<template>
 <el-container>
    <div class="clientCityAna">
      <div style="text-align: left;margin:0 0 10px 10px">
        <el-radio-group v-model="isTable">
          <el-radio-button :label="true">列表</el-radio-button>
          <el-radio-button :label="false">图表</el-radio-button>
        </el-radio-group>
      </div>
      <div v-show="isTable" style="width:95%;margin: 0 auto">
        <el-table
          :data="clientCityTableData"
          max-height="540"
          >
          <el-table-column
            fixed
            prop="city"
            label="城市"
            header-align="center"
            >
          </el-table-column>
          <el-table-column
            prop="quantity"
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
    <!-- 必须使用v-show,如果使用v-if和v-else,v-else中的模块未渲染，在mounted中执行图表加载函数将
    获取不到div.如果想使用v-if和v-else,就不要使用el-radio-button，用两个el-button替代效果，
    将图表加载函数放在button的click事件中执行-->
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
      clientCityTableData: null,
      xdata: [],
      ydata: []
    }
  },
  created: function () {
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    // 分页获取客户城市分布（列表或者图表）,默认为列表
    this.backCustomerCityListQue()
  },
  mounted: function () {
    this.param.picture = false
    // 分页获取客户城市分布（列表或者图表）,二次为图形
    this.backCustomerCityListQue()
  },
  methods: {
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      // this.clientTabNum = this.param.pagesize * (value - 1) + 1 // 列表序号用
      this.param.currentPage = value
      this.backCustomerCityListQue()
    },
    loaddiagram: function () {
      this.xdata = []
      for (let i = 0; i < this.clientCityTableData.length; i++) {
        this.xdata.push(this.clientCityTableData[i].city)
      }
      // console.log(this.xdata)
      this.ydata = []
      for (let j = 0; j < this.clientCityTableData.length; j++) {
        this.ydata.push(this.clientCityTableData[j].quantity)
      }
      // console.log(this.ydata)
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
          text: '城市分布',
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
          data: ['数量']
        },
        xAxis: {
          data: this.xdata
        },
        yAxis: {},
        series: [{
          name: '数量',
          // type: 'line',
          type: 'bar',
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
    // 分页获取客户城市分布（列表或者图表）,默认为列表
    backCustomerCityListQue: function () {
      back.customerCityListQue(this.param).then(function (response) {
        console.log('分页获取客户城市分布（列表或者图表）,默认为列表')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 表格显示
        if (this.param.picture === true) {
          this.eltotal = response.data.total
          this.clientCityTableData = []
          for (let i = 0; i < response.data.record.length; i++) {
            let obj = {}
            obj.city = response.data.record[i].city
            obj.quantity = response.data.record[i].number
            this.clientCityTableData.push(obj)
          }
        } else { // 图形显示 1.back数据存储
          this.clientCityTableData = []
          for (let i = 0; i < response.data.record.length; i++) {
            let obj = {}
            obj.city = response.data.record[i].city
            obj.quantity = response.data.record[i].number
            this.clientCityTableData.push(obj)
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
.clientCityAna {
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
