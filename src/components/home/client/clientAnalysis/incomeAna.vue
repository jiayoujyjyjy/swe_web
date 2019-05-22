<template>
 <el-container>
    <div class="incomeAna">
      <div style="text-align: left;margin:0 0 10px 10px">
        <el-radio-group v-model="isTable">
          <el-radio-button :label="true">列表</el-radio-button>
          <el-radio-button :label="false">图表</el-radio-button>
        </el-radio-group>
      </div>
      <div v-show="isTable" style="width:95%;margin: 0 auto">
        <el-table
          :data="incomeTableData"
          max-height="540"
          >
          <el-table-column
            fixed
            prop="client"
            label="客户"
            header-align="center"
            >
          </el-table-column>
          <el-table-column
            prop="income"
            label="收益/万元"
            header-align="center">
          </el-table-column>
        </el-table>

        <el-footer class="paginationfooter" height="60px">
          <div class="block">
            <el-pagination
              @current-change="handlePaginationChange"
              :current-page="currentPage"
              :page-size="pagesize"
              layout="total, prev, pager, next, jumper"
              :total="eltotal">
            </el-pagination>
          </div>
        </el-footer>
      </div>

      <div v-show="!isTable" id="diagram">
        <h1>echart</h1>
      </div>
    </div>
  </el-container>
</template>

<script>
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
import echarts from 'echarts'
export default {
  data () {
    return {
      param: {
        'currentPage': 1,
        'pagesize': 10, // 每页显示的记录数目
        'picture': true // true-表格 false-图形
      },
      tableVisible: true,
      currentPage: 1,
      isTable: true,
      upArr: [], // 顺序排序数据，用于进一步正态分布处理
      arrData: [], // 正态分布数组
      reverseOrder: [], // 逆序排序数组，用于列表显示
      pagesize: 10, // 每页显示的记录数目
      eltotal: 0, // 分页器中的记录总数
      incomeTableData: null,
      xdata: [],
      ydata: [],
      incomeData: [{
        client: '周女士',
        income: 22
      }, {
        client: '张先生',
        income: 35
      }, {
        client: '陈先生',
        income: 51
      }, {
        client: '薛先生',
        income: 21
      }, {
        client: '薛女士',
        income: 16
      }, {
        client: '吴先生',
        income: 32
      }, {
        client: '杨女士',
        income: 22
      }, {
        client: '杨先生',
        income: 27
      }, {
        client: '张女士',
        income: 12
      }, {
        client: '王女士',
        income: 11
      }, {
        client: '王先生',
        income: 33
      }, {
        client: '杜先生',
        income: 37
      }, {
        client: '徐先生',
        income: 42
      }, {
        client: '尹先生',
        income: 10
      }, {
        client: '常女士',
        income: 18
      }, {
        client: '常先生',
        income: 19
      }]
    }
  },
  created: function () {
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    // 等待两个ajax异步执行之后再执行操作
    this.myAjaxFunction()
  },
  mounted: function () {
    // this.arrData = this.sortarr()
    // this.reverseOrder = this.incomeData.sort(this.downSort('income'))
    // this.initTable()
    // this.loaddiagram()
  },
  methods: {
    /* ******等待两个ajax异步执行之后再执行操作
      这样不好，后期改进应该用promise.all，而不是像目前这样ajax2等待ajax1执行完之后再执行
    */
    myAjaxFunction: async function () {
      await this.backCustomerIncomeListQue()
      this.param.picture = false
      // 分页获取客户城市分布（列表或者图表）,二次为图形
      await this.backCustomerIncomeListQue()
      // 等待两个异步ajax请求同时执行完毕后打印出数据
      console.log('两个ajax均已执行完毕')
      console.log(this.incomeData)
      console.log(this.arrData)
      // 表格/图形数据处理转化
      this.arrData = this.sortarr()
      this.reverseOrder = this.incomeData.sort(this.downSort('income'))
      this.initTable()
      this.loaddiagram()
    },
    /*
    *
    *   ******** 将数组进行正态分布排序，下标为偶数的时候放到左侧，为奇数的时候放到右侧，
    在左右两边的数组增长过程中，当数组长度相等的时候，对左右两侧数组之和进行比较，因为是按照从小到大排列的，
    所以正常情况下，右侧会大于左侧，然后将右侧第一个跟左侧最后一个互换一下即可达到平衡的目的 ********
    *
    */
    // 正态分布
    sortarr: function () {
      this.upArr = this.incomeData.sort(this.upSort('income'))
      console.log(this.upArr)
      let tempLeft = []
      let tempRight = []
      for (let i = 0; i < this.upArr.length; i++) {
        i % 2 === 0 ? tempLeft.push(this.upArr[i]) : tempRight.unshift(this.upArr[i])
        if (i > 1) {
          if (tempLeft.length === tempRight.length && !this.compare(tempLeft, tempRight)) {
            this.wrap(tempLeft, tempRight)
          }
        }
      }
      return tempLeft.concat(tempRight)
    },
    // 对incomeData按照income属性就行升序排序
    upSort: function (prop) {
      return function (obj1, obj2) {
        var val1 = obj1[prop]
        var val2 = obj2[prop]
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
          val1 = Number(val1)
          val2 = Number(val2)
        }
        if (val1 < val2) {
          return -1
        } else if (val1 > val2) {
          return 1
        } else {
          return 0
        }
      }
    },
    // 对incomeData按照income属性就行降序排序，用于列表显示
    downSort: function (prop) {
      return function (obj1, obj2) {
        var val1 = obj1[prop]
        var val2 = obj2[prop]
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
          val1 = Number(val1)
          val2 = Number(val2)
        }
        if (val1 < val2) {
          return 1
        } else if (val1 > val2) {
          return -1
        } else {
          return 0
        }
      }
    },
    // 数组求和
    sum: function (arr) {
      let sum = 0
      for (let i = 0; i < arr.length; i++) {
        sum = sum + arr[i].income
      }
      return sum
    },
    // 比较大小
    compare: function (arr1, arr2) {
      return (this.sum(arr1) >= this.sum(arr2))
    },
    // 左边最后一个和右边第一个交换
    wrap: function (left, right) {
      let m = right.shift()
      right.unshift(left.pop())
      left.push(m)
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      this.incomeTableData = []
      this.currentPage = value
      let num = 0
      let length
      if (this.pagesize * this.currentPage >= this.reverseOrder.length) {
        length = this.reverseOrder.length
      } else {
        length = this.pagesize * this.currentPage
      }
      for (let i = this.pagesize * (this.currentPage - 1); i < length; i++) {
        let obj = {}
        obj.client = this.reverseOrder[i].client
        obj.income = this.reverseOrder[i].income
        this.incomeTableData[num] = obj
        num = num + 1
      }
      console.log(this.incomeTableData)
    },
    // 初始化表格，默认加载第一页数据
    initTable: function () {
      let num = 0
      let pageTableData = []
      if (this.reverseOrder.length >= this.pagesize) {
        for (let i = 0; i < this.pagesize; i++) {
          let obj = {}
          obj.client = this.reverseOrder[i].client
          obj.income = this.reverseOrder[i].income
          pageTableData[num] = obj
          num = num + 1
        }
        this.incomeTableData = pageTableData
      } else {
        for (let i = 0; i < this.reverseOrder.length; i++) {
          let obj = {}
          obj.client = this.reverseOrder[i].client
          obj.income = this.reverseOrder[i].income
          pageTableData[num] = obj
          num = num + 1
        }
        this.incomeTableData = pageTableData
      }
    },
    loaddiagram: function () {
      this.xdata = []
      for (let i = 0; i < this.arrData.length; i++) {
        this.xdata.push(this.arrData[i].client)
      }
      console.log(this.xdata)
      this.ydata = []
      for (let j = 0; j < this.arrData.length; j++) {
        this.ydata.push(this.arrData[j].income)
      }
      console.log(this.ydata)
      var diagramContainer = document.getElementById('diagram')
      var resizediagramContainer = function () {
        diagramContainer.style.height = document.body.clientHeight - 240 + 'px'
        diagramContainer.style.width = (document.body.clientWidth) * 0.6 + 'px'
      }
      resizediagramContainer()
      var myChart = echarts.init(diagramContainer)
      // 指定图表的配置项和数据
      // 条形图
      var option = {
        title: {
          text: '收益分布',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPoniter: {
            type: 'cross'
          }
        },
        color: ['#6495ED'],
        legend: {
          left: 'left',
          data: ['收益']
        },
        xAxis: {
          data: this.xdata
        },
        yAxis: {},
        series: [{
          name: '收益',
          type: 'bar',
          // type: 'line',
          // smooth: true,
          data: this.ydata
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 分页获取客户收入分布（列表或者图表）,默认为列表
    backCustomerIncomeListQue: function () {
      return new Promise(function (resolve, reject) {
        back.customerIncomeListQue(this.param).then(function (response) {
          console.log('分页获取客户收入分布（列表或者图表）,默认为列表')
          console.log(response)
          if (response.errno !== 0) {
            this.notificationInfo('错误提示', response.error)
            return
          }
          // 表格显示
          if (this.param.picture === true) {
            console.log('picture true')
            this.eltotal = response.data.total
            this.incomeData = []
            for (let i = 0; i < response.data.record.length; i++) {
              let obj = {}
              obj.client = response.data.record[i].name
              obj.income = response.data.record[i].income
              this.incomeData.push(obj)
            }
          } else { // 图形显示 1.back数据存储
            console.log('picture false')
            this.arrData = []
            for (let i = 0; i < response.data.record.length; i++) {
              let obj = {}
              obj.client = response.data.record[i].name
              obj.income = response.data.record[i].income
              this.arrData.push(obj)
            }
            // 2.加载图形
            this.loaddiagram()
          }
          resolve()
        }.bind(this))
          .catch(function (error) {
            console.log(error)
            reject()
          })
      }.bind(this))
    }
  }
}
</script>

<style scoped>
.el-container {
  background-color: #D7DEE8;
  padding: 10px;
}
.incomeAna {
  width:100%;
}
.block{
    text-align: right;
    width: 100%
}
.paginationfooter {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
#diagram {
  margin: 0 auto;
  width: 800px;
  height: 400px;
  min-height: 200px;
}
</style>
