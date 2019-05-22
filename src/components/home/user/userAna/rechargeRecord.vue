<template>
 <el-container>
    <div class="rechargeData">
      <div style="text-align: left;margin:0 0 10px 10px">
        <el-radio-group v-model="isTable">
          <el-radio-button :label="true">列表</el-radio-button>
          <el-radio-button :label="false">图表</el-radio-button>
        </el-radio-group>
      </div>
      <div v-show="isTable" style="width:95%;margin: 0 auto">
        <el-table
          :data="rechargeTableData"
          max-height="540"
          >
          <el-table-column
            fixed
            prop="money"
            label="金额/元"
            header-align="center"
            >
          </el-table-column>
          <el-table-column
            prop="number"
            label="数量"
            header-align="center">
          </el-table-column>
        </el-table>

        <el-footer class="paginationfooter" height="60px">
          <div class="block">
            <el-pagination
              @current-change="handlePaginationChange"
              :current-page="param.currentPage"
              :page-size="param.pagesize"
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
      eltotal: 0, // 分页器中的记录总数
      rechargeTableData: null,
      pieData: [],
      xdata: []
    }
  },
  created: function () {
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    // back获取用户的充值类型计数统计（列表或者图表）,默认为列表
    this.backUserRechargeTypeQue()
  },
  mounted: function () {
    this.param.picture = false
    // back获取用户的充值类型计数统计（列表或者图表）,二次为图形
    this.backUserRechargeTypeQue()
  },
  methods: {
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      // this.clientTabNum = this.param.pagesize * (value - 1) + 1
      this.param.currentPage = value
      this.backUserRechargeTypeQue()
    },
    loaddiagram: function () {
      this.xdata = []
      for (let i = 0; i < this.rechargeTableData.length; i++) {
        this.xdata.push(this.rechargeTableData[i].money)
      }
      console.log(this.xdata)
      this.pieData = []
      for (let i = 0; i < this.rechargeTableData.length; i++) {
        let obj = {}
        obj.value = this.rechargeTableData[i].number
        obj.name = this.rechargeTableData[i].money
        this.pieData[i] = obj
      }
      console.log(this.pieData)
      var diagramContainer = document.getElementById('diagram')
      var resizediagramContainer = function () {
        diagramContainer.style.height = document.body.clientHeight - 240 + 'px'
        diagramContainer.style.width = (document.body.clientWidth) * 0.6 + 'px'
      }
      resizediagramContainer()
      var myChart = echarts.init(diagramContainer)
      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '用户充值记录',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.xdata
        },
        series: [
          {
            name: '城市分布',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.pieData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 获取用户的充值类型计数统计
    backUserRechargeTypeQue: function () {
      back.userRechargeTypeQue(this.param).then(function (response) {
        console.log('获取用户的充值类型计数统计')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 表格显示
        if (this.param.picture === true) {
          // this.eltotal = response.data.total
          this.rechargeTableData = []
          for (let i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.money = response.data[i].money
            obj.number = response.data[i].number
            this.rechargeTableData.push(obj)
          }
        } else { // 图形显示 1.back数据存储
          this.rechargeTableData = []
          for (let i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.money = response.data[i].money
            obj.number = response.data[i].number
            this.rechargeTableData.push(obj)
          }
          // 2.加载图形
          this.loaddiagram()
        }
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
.rechargeData {
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
