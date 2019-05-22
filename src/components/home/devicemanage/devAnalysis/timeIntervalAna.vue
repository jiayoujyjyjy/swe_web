<template>
 <el-container>
    <div class="timeIntervalAna">
      <div style="text-align: left;margin:0 0 10px 10px">
        <el-radio-group v-model="isTable">
          <el-radio-button :label="true">列表</el-radio-button>
          <el-radio-button :label="false">图表</el-radio-button>
        </el-radio-group>
      </div>
      <div v-show="isTable" style="width:95%;margin: 0 auto">
        <el-table
          :data="timeIntervalTabData"
          max-height="540"
          class="tableView"
          >
          <el-table-column
            fixed
            prop="timeInterval"
            label="时间段"
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
    <!-- 必须使用v-show,如果使用v-if和v-else,v-else中的模块未渲染，在mounted中执行图表加载函数将
    获取不到div.如果想使用v-if和v-else,就不要使用el-radio-button，用两个el-button替代效果，
    将图表加载函数放在button的click事件中执行-->
  </el-container>
</template>

<script>
// import Routers from '@/router'
import echarts from 'echarts'
export default {
  data () {
    return {
      tableVisible: true,
      currentPage: 1,
      isTable: true,
      pagesize: 10, // 每页显示的记录数目
      eltotal: 0, // 分页器中的记录总数
      timeIntervalTabData: null,
      xdata: [],
      ydata: [],
      timeIntervalData: [{
        timeInterval: '1:00-3:00',
        quantity: 10
      }, {
        timeInterval: '3:00-5:00',
        quantity: 10
      }, {
        timeInterval: '5:00-7:00',
        quantity: 10
      }, {
        timeInterval: '7:00-9:00',
        quantity: 80
      }, {
        timeInterval: '9:00-11:00',
        quantity: 100
      }, {
        timeInterval: '11:00-13:00',
        quantity: 100
      }, {
        timeInterval: '13:00-15:00',
        quantity: 90
      }, {
        timeInterval: '15:00-17:00',
        quantity: 80
      }, {
        timeInterval: '17:00-19:00',
        quantity: 60
      }, {
        timeInterval: '19:00-21:00',
        quantity: 40
      }, {
        timeInterval: '21:00-23:00',
        quantity: 20
      }, {
        timeInterval: '23:00-1:00',
        quantity: 10
      }]
    }
  },
  mounted: function () {
    this.eltotal = this.timeIntervalData.length
    this.initTable()
    this.loaddiagram()
  },
  methods: {
    // 初始化表格，默认加载第一页数据
    initTable: function () {
      let num = 0
      let pageTableData = []
      if (this.timeIntervalData.length >= this.pagesize) {
        for (let i = 0; i < this.pagesize; i++) {
          let obj = {}
          obj.timeInterval = this.timeIntervalData[i].timeInterval
          obj.quantity = this.timeIntervalData[i].quantity
          pageTableData[num] = obj
          num = num + 1
        }
        this.timeIntervalTabData = pageTableData
      } else {
        for (let i = 0; i < this.timeIntervalData.length; i++) {
          let obj = {}
          obj.timeInterval = this.timeIntervalData[i].timeInterval
          obj.quantity = this.timeIntervalData[i].quantity
          pageTableData[num] = obj
          num = num + 1
        }
        this.timeIntervalTabData = pageTableData
      }
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      this.timeIntervalTabData = []
      this.currentPage = value
      let num = 0
      let length
      if (this.pagesize * this.currentPage >= this.timeIntervalData.length) {
        length = this.timeIntervalData.length
      } else {
        length = this.pagesize * this.currentPage
      }
      for (let i = this.pagesize * (this.currentPage - 1); i < length; i++) {
        let obj = {}
        obj.timeInterval = this.timeIntervalData[i].timeInterval
        obj.quantity = this.timeIntervalData[i].quantity
        this.timeIntervalTabData[num] = obj
        num = num + 1
      }
      console.log(this.timeIntervalTabData)
    },
    // 加载图表
    loaddiagram: function () {
      this.xdata = []
      for (let i = 0; i < this.timeIntervalData.length; i++) {
        this.xdata.push(this.timeIntervalData[i].timeInterval)
      }
      console.log(this.xdata)
      this.ydata = []
      for (let j = 0; j < this.timeIntervalData.length; j++) {
        this.ydata.push(this.timeIntervalData[j].quantity)
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
          text: '时间段分布',
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
          type: 'line',
          data: this.ydata
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  }
}
</script>

<style scoped>
.el-container {
  background-color: #D7DEE8;
  padding: 10px;
}
.timeIntervalAna {
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
