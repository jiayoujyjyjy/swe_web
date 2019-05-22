<template>
  <!-- 动态曲线 -->
  <el-container>
    <div class="datachartPage">
      <div class="select">
        <div class="chargingInfo">请选择插座
          <el-cascader
            expand-trigger="hover"
            :options="options"
            v-model="selectedOptions"
            @change="handleChange">
          </el-cascader>
        </div>
        <div class="dataTimePicker">请选择时间范围
          <el-date-picker
            v-model="valueData"
            type="datetimerange"
            value-format="yyyy-MM-ddTHH:mm:ss"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getTimeRange"
            align="right">
          </el-date-picker>
        </div>
        <el-button type="primary" class="querybtn" @click="queryHistoryBt">查询</el-button>
      </div>
      <div id="diagram">
        <h1>请先选择查询条件</h1>
      </div>
    </div>
  </el-container>
</template>

<script>
import echarts from 'echarts'
import { onenet } from 'api'
export default {
  data () {
    return {
      param: {
        'apiKey': 'Kd8is3aeq41=dtQFfTx8kHwWSBM=',
        'deviceId': '45053792',
        'datastreamId': '100',
        'startTime': '',
        'endTime': '',
        'cursor': '',
        'sort': 'DESC',
        'limit': 100
      },
      timer: 0,
      hour: '6',
      minute: '50',
      second: '',
      data: [],
      xdata: [],
      ydata: [],
      options: [{
        value: '43170892',
        label: '鸿世测试充电桩1',
        children: [{
          value: '1',
          label: '插座1'
        }, {
          value: '2',
          label: '插座2'
        }, {
          value: '3',
          label: '插座3'
        }, {
          value: '4',
          label: '插座4'
        }, {
          value: '5',
          label: '插座5'
        }, {
          value: '6',
          label: '插座6'
        }, {
          value: '7',
          label: '插座7'
        }, {
          value: '8',
          label: '插座8'
        }]
      }, {
        value: '45053754',
        label: '鸿世测试充电桩2',
        children: [{
          value: '1',
          label: '插座1'
        }, {
          value: '2',
          label: '插座2'
        }, {
          value: '3',
          label: '插座3'
        }, {
          value: '4',
          label: '插座4'
        }, {
          value: '5',
          label: '插座5'
        }, {
          value: '6',
          label: '插座6'
        }, {
          value: '7',
          label: '插座7'
        }, {
          value: '8',
          label: '插座8'
        }]
      }, {
        value: '45053772',
        label: '鸿世测试充电桩3',
        children: [{
          value: '1',
          label: '插座1'
        }, {
          value: '2',
          label: '插座2'
        }, {
          value: '3',
          label: '插座3'
        }, {
          value: '4',
          label: '插座4'
        }, {
          value: '5',
          label: '插座5'
        }, {
          value: '6',
          label: '插座6'
        }, {
          value: '7',
          label: '插座7'
        }, {
          value: '8',
          label: '插座8'
        }]
      }, {
        value: '45053792',
        label: '鸿世测试充电桩4',
        children: [{
          value: '1',
          label: '插座1'
        }, {
          value: '2',
          label: '插座2'
        }, {
          value: '3',
          label: '插座3'
        }, {
          value: '4',
          label: '插座4'
        }, {
          value: '5',
          label: '插座5'
        }, {
          value: '6',
          label: '插座6'
        }, {
          value: '7',
          label: '插座7'
        }, {
          value: '8',
          label: '插座8'
        }]
      }, {
        value: '45053800',
        label: '鸿世测试充电桩5',
        children: [{
          value: '1',
          label: '插座1'
        }, {
          value: '2',
          label: '插座2'
        }, {
          value: '3',
          label: '插座3'
        }, {
          value: '4',
          label: '插座4'
        }, {
          value: '5',
          label: '插座5'
        }, {
          value: '6',
          label: '插座6'
        }, {
          value: '7',
          label: '插座7'
        }, {
          value: '8',
          label: '插座8'
        }]
      }],
      selectedOptions: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }],
        // 设置禁用状态，参数为当前日期，要求返回 Boolean
        disabledDate (time) {
          return (time.getTime() > Date.now() || time.getTime() < Date.now() - 1000 * 60 * 60 * 24 * 90)
        }
      },
      valueData: ''
    }
  },
  mounted: function () {
    this.timer = window.setInterval(this.demonstrate, 2000)
  },
  // 生命周期，销毁前
  beforeDestroy: function () {
    // 停止定时器
    window.clearInterval(this.timer)
  },
  methods: {
    // 动态曲线测试
    demonstrate: function () {
      this.param.deviceId = 45053772
      this.param.datastreamId = '800'
      this.param.endTime = '2018-11-22T22:00:00'
      let strhour
      let strminute
      // this.param.startTime = '2018-11-22T07:05:00'
      if ((Number(this.minute) + 5 - 60) < 0) {
        this.minute = String(Number(this.minute) + 5)
        this.hour = this.hour
      } else {
        this.minute = String(Number(this.minute) + 5 - 60)
        this.hour = String(Number(this.hour) + 1)
      }
      if (this.hour === '9' && this.minute === '10') {
        this.hour = '6'
        this.minute = '50'
        return
      }
      if (this.hour.length === 1) {
        strhour = '0' + this.hour
      } else {
        strhour = this.hour
      }
      if (this.minute.length === 1) {
        strminute = '0' + this.minute
      } else {
        strminute = this.minute
      }
      this.param.startTime = '2018-11-22T' + strhour + ':' + strminute + ':00'
      console.log('开始时间')
      console.log(this.param.startTime)
      this.backHisQue()
    },
    // 获取充电桩及插座选择参数
    handleChange: function (value) {
      console.log(value)
      this.param.deviceId = value[0]
      this.param.datastreamId = value[1] + '00'
    },
    // 获取用户所选时间范围
    getTimeRange: function (value) {
      console.log(value)
      this.param.startTime = value[0]
      this.param.endTime = value[1]
    },
    // 查询按钮
    queryHistoryBt: function () {
      // this.backHisQue()
    },
    // 加载图表
    loaddiagram: function () {
      this.xdata = []
      for (let j = 0; j < this.data.length; j++) {
        this.xdata.push(this.data[j].time)
      }
      // console.log(this.xdata)
      this.ydata = []
      for (let i = 0; i < this.data.length; i++) {
        this.ydata.push(this.data[i].value)
      }
      // console.log(this.ydata)
      var diagramContainer = document.getElementById('diagram')
      var resizediagramContainer = function () {
        diagramContainer.style.height = document.body.clientHeight - 240 + 'px'
        diagramContainer.style.width = (document.body.clientWidth) * 0.8 + 'px'
      }
      resizediagramContainer()
      var myChart = echarts.init(diagramContainer)
      // 指定图表的配置项和数据
      // 条形图
      var option = {
        title: {
          text: '历史数据',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPoniter: {
            type: 'cross'
          }
        },
        dataZoom: [
          {
            type: 'slider', // 滑动条调节
            start: 0,
            end: 100
          },
          {
            type: 'inside', // 鼠标缩放
            start: 0,
            end: 100
          }
        ],
        color: ['#6495ED'],
        legend: {
          left: 'left',
          data: ['功率']
        },
        xAxis: {
          data: this.xdata
        },
        yAxis: {},
        series: [{
          name: '功率',
          type: 'line',
          smooth: true,
          data: this.ydata
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    // 向onenet请求数据
    backHisQue: function () {
      onenet.onenetHisQue(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.data = []
        for (let i = 0; i < response.data.datastreams[0].datapoints.length; i++) {
          let obj = {}
          obj.time = response.data.datastreams[0].datapoints[i].at
          obj.value = response.data.datastreams[0].datapoints[i].value
          this.data[i] = obj
        }
        console.log(this.data)
        this.loaddiagram()
      }.bind(this))
    },
    /*
    *
    *   ******** 辅助方法函数 ********
    *
    */
    // 可关闭式通知提示，titlePara为标题，messagePara为通知内容
    notificationInfo: function (titlePara, messagePara) {
      const h = this.$createElement
      this.$notify({
        title: titlePara,
        message: h('i', {style: 'color: teal'}, `${messagePara}`)
      })
    }
  }
}
</script>

<style scoped>
.el-container {
  background-color: #D7DEE8;
  padding: 10px;
}
.datachartPage {
  width:100%;
}
.select {
  padding: 0 150px;
  margin-bottom: 50px;
  display: -webkit-flex; /* Safari */
  display: flex;
  justify-content: space-around;
}
.querybtn {
  margin-left: -200px;
}
#diagram {
  margin: 0 auto;
  width: 800px;
  height: 400px;
  min-height: 200px;
}
</style>
