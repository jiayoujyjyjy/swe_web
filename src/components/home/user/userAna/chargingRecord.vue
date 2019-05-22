<template>
 <el-container>
    <div class="chargingRecord">
      <div style="text-align: left;margin:0 0 10px 10px">
        <el-radio-group v-model="isTable">
          <el-radio-button :label="true">列表</el-radio-button>
          <el-radio-button :label="false">图表</el-radio-button>
        </el-radio-group>
      </div>

      <!--选择要分析的用户-->
      <div class="searchdiv">
        <el-select v-model="userValue" placeholder="请选择用户" @change="userSelected">
          <el-option
            v-for="item in userOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <!-- <el-button type="primary" size="medium" @click="userQueBt">用户查询</el-button> -->
      </div>

      <div v-show="isTable" style="width:95%;margin: 0 auto">
        <el-table
          :data="chargingRecordTabData"
          max-height="540"
          >
          <el-table-column
            label="序号"
            header-align="center"
            align="center"
            min-width="15%">
            <template slot-scope="scope">
              {{ChargingTabNum + scope.$index}}
            </template>
          </el-table-column>
          <el-table-column
            prop="station"
            label="充电桩"
            header-align="center"
            align="center"
            min-width="25%">
          </el-table-column>
          <el-table-column
            prop="date"
            label="日期"
            header-align="center"
            align="center"
            min-width="15%">
          </el-table-column>
          <el-table-column
            prop="duration"
            label="时长"
            header-align="center"
            align="center"
            min-width="15%">
          </el-table-column>
          <el-table-column
            prop="power"
            label="功率"
            header-align="center"
            align="center"
            min-width="15%">
          </el-table-column>
          <el-table-column
            prop="sum"
            label="金额"
            header-align="center"
            align="center"
            min-width="15%">
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
import echarts from 'echarts'
export default {
  data () {
    return {
      currentPage: 1,
      isTable: true,
      userValue: '',
      pagesize: 10, // 每页显示的记录数目
      eltotal: 0, // 分页器中的记录总数
      ChargingTabNum: 1, // 用来计算表格序号
      chargingRecordTabData: null,
      xdata: [],
      ydata: [],
      userOptions: [{
        value: 'user1',
        label: '用户1'
      }, {
        value: 'user2',
        label: '用户2'
      }, {
        value: 'user3',
        label: '用户3'
      }, {
        value: 'user4',
        label: '用户4'
      }, {
        value: 'user5',
        label: '用户5'
      }],
      chargingRecord: [{
        station: '高科技企业孵化园区A#1',
        date: '05-23 08:59',
        duration: '432',
        power: '107W',
        sum: '2.46' // 金额
      }, {
        station: '高科技企业孵化园区A#2',
        date: '06-03 09:30',
        duration: '424',
        power: '106W',
        sum: '2.51' // 金额
      }, {
        station: '高科技企业孵化园区A#3',
        date: '06-11 08:59',
        duration: '400',
        power: '108W',
        sum: '2.32' // 金额
      }, {
        station: '高科技企业孵化园区A#4',
        date: '06-19 08:54',
        duration: '366',
        power: '104W',
        sum: '2.12' // 金额
      }, {
        station: '高科技企业孵化园区B#1',
        date: '06-25 09:02',
        duration: '358',
        power: '104W',
        sum: '2.08' // 金额
      }, {
        station: '高科技企业孵化园区B#2',
        date: '05-23 08:59',
        duration: '432',
        power: '107W',
        sum: '2.51' // 金额
      }, {
        station: '高科技企业孵化园区B#3',
        date: '06-29 08:56',
        duration: '385',
        power: '104W',
        sum: '2.23' // 金额
      }, {
        station: '高科技企业孵化园区C#1',
        date: '07-04 09:04',
        duration: '405',
        power: '103W',
        sum: '2.35' // 金额
      }, {
        station: '高科技企业孵化园区C#2',
        date: '05-23 08:59',
        duration: '432',
        power: '107W',
        sum: '2.51' // 金额
      }, {
        station: '高科技企业孵化园区D#1',
        date: '05-23 08:59',
        duration: '432',
        power: '107W',
        sum: '2.51' // 金额
      }]
    }
  },
  mounted: function () {
    this.eltotal = this.chargingRecord.length
    this.initTable()
    this.loaddiagram()
  },
  methods: {
    userSelected: function (value) {
      console.log(value)
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      this.chargingRecordTabData = []
      this.currentPage = value
      let num = 0
      let length
      if (this.pagesize * this.currentPage >= this.chargingRecord.length) {
        length = this.chargingRecord.length
      } else {
        length = this.pagesize * this.currentPage
      }
      for (let i = this.pagesize * (this.currentPage - 1); i < length; i++) {
        let obj = {}
        obj.station = this.chargingRecord[i].station
        obj.date = this.chargingRecord[i].date
        obj.duration = this.chargingRecord[i].duration
        obj.power = this.chargingRecord[i].power
        obj.sum = this.chargingRecord[i].sum
        this.chargingRecordTabData[num] = obj
        num = num + 1
        this.ChargingTabNum = this.pagesize * (this.currentPage - 1) + 1
      }
      console.log(this.chargingRecordTabData)
    },
    // 初始化表格，默认加载第一页数据
    initTable: function () {
      let num = 0
      let pageTableData = []
      if (this.chargingRecord.length >= this.pagesize) {
        for (let i = 0; i < this.pagesize; i++) {
          let obj = {}
          obj.station = this.chargingRecord[i].station
          obj.date = this.chargingRecord[i].date
          obj.duration = this.chargingRecord[i].duration
          obj.power = this.chargingRecord[i].power
          obj.sum = this.chargingRecord[i].sum
          pageTableData[num] = obj
          num = num + 1
        }
        this.chargingRecordTabData = pageTableData
      } else {
        for (let i = 0; i < this.chargingRecord.length; i++) {
          let obj = {}
          obj.station = this.chargingRecord[i].station
          obj.date = this.chargingRecord[i].date
          obj.duration = this.chargingRecord[i].duration
          obj.power = this.chargingRecord[i].power
          obj.sum = this.chargingRecord[i].sum
          pageTableData[num] = obj
          num = num + 1
        }
        this.chargingRecordTabData = pageTableData
      }
    },
    loaddiagram: function () {
      this.xdata = []
      for (let i = 0; i < this.chargingRecordTabData.length; i++) {
        this.xdata.push(this.chargingRecordTabData[i].date)
      }
      console.log(this.xdata)
      this.ydata = []
      for (let j = 0; j < this.chargingRecordTabData.length; j++) {
        this.ydata.push(this.chargingRecordTabData[j].duration)
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
          text: '充电记录',
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
          data: ['时长']
        },
        xAxis: {
          data: this.xdata
        },
        yAxis: {},
        series: [{
          name: '时长',
          // type: 'bar',
          type: 'line',
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
.searchdiv {
  margin: 0 0 10px 50px;
  float: left;
}
.el-container {
  background-color: #D7DEE8;
  padding: 10px;
}
.chargingRecord {
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
