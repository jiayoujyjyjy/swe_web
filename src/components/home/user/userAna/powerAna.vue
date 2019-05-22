<template>
 <el-container>
    <div class="powerAna">
      <div style="text-align: left;margin:0 0 10px 10px">
        <el-radio-group v-model="isTable">
          <el-radio-button :label="true">列表</el-radio-button>
          <el-radio-button :label="false">图表</el-radio-button>
        </el-radio-group>
      </div>
      <div v-show="isTable" style="width:95%;margin: 0 auto">
        <el-table
          :data="powerTableData"
          max-height="540"
          >
          <el-table-column
            fixed
            prop="powerInterval"
            label="功率区间"
            header-align="center"
            >
          </el-table-column>
          <el-table-column
            prop="quantity"
            label="数量"
            header-align="center">
          </el-table-column>
        </el-table>
      </div>

      <div v-show="!isTable" id="diagram">
        <h1>echart</h1>
      </div>
    </div>
  </el-container>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      tableVisible: true,
      currentPage: 1,
      isTable: true,
      pagesize: 10, // 每页显示的记录数目
      eltotal: 0, // 分页器中的记录总数
      powerTableData: null,
      xdata: [],
      ydata: [],
      powerData: [{
        powerInterval: '0<P≤120W',
        quantity: 1000
      }, {
        powerInterval: '120<P≤200W',
        quantity: 800
      }, {
        powerInterval: '200<P≤300W',
        quantity: 400
      }, {
        powerInterval: '300<P≤400W',
        quantity: 200
      }, {
        powerInterval: '400<P≤700W',
        quantity: 200
      }, {
        powerInterval: '700<P≤900W',
        quantity: 200
      }]
    }
  },
  mounted: function () {
    this.powerTableData = this.powerData
    this.eltotal = this.powerData.length
    this.loaddiagram()
  },
  methods: {
    loaddiagram: function () {
      this.xdata = []
      for (let i = 0; i < this.powerTableData.length; i++) {
        this.xdata.push(this.powerTableData[i].powerInterval)
      }
      console.log(this.xdata)
      this.ydata = []
      for (let j = 0; j < this.powerTableData.length; j++) {
        this.ydata.push(this.powerTableData[j].quantity)
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
          text: '功率区间分布',
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
          type: 'bar',
          // type: 'line',
          // smooth: true,
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
.powerAna {
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
