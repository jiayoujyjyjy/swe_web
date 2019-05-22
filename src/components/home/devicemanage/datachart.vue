<template>
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
          <el-button type="primary" class="querybtn" @click="queryHistoryBt">查询</el-button>
        </div>
      </div>
      <div id="diagram">
        <h1>请先选择查询条件</h1>
      </div>
    </div>
  </el-container>
</template>

<script>
import echarts from 'echarts'
import { onenet, back } from 'api'
import { sessionGetStore, sessionRemoveStore } from '@/components/config/Utils'
export default {
  data () {
    return {
      param: {
        'apiKey': 'Kd8is3aeq41=dtQFfTx8kHwWSBM=',
        'deviceId': '',
        'datastreamId': '',
        'startTime': '',
        'endTime': '',
        'cursor': '',
        'sort': 'DESC',
        'limit': 100
      },
      myChart: null,
      flag: 0, // 0表示收到了onenet请求响应，1表示网络不好没有收到请求响应
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
      valueData: [],
      loading: null
    }
  },
  created: function () {
    this.backAllStationQue()
  },
  mounted: function () {
    if (sessionGetStore('CRApiKey')) {
      this.$store.commit('setDevRouter', '3')
      // 是从用户充电记录跳转过来的
      this.param.apiKey = sessionGetStore('CRApiKey')
      this.param.deviceId = sessionGetStore('CRDeviceId')
      this.param.datastreamId = sessionGetStore('CRDatastreamId')
      this.param.startTime = sessionGetStore('CRStartTime')
      this.param.endTime = sessionGetStore('CREndTime')
      this.selectedOptions = [this.param.deviceId, this.param.datastreamId.substring(0, 1)]
      this.valueData = [this.param.startTime, this.param.endTime]
      this.loading = this.$loading({
        lock: true,
        text: '加载中，请稍候',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(this.closeloading, 10000)
      this.backHisQue()
    }
  },
  methods: {
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
      if (this.param.deviceId === '' || this.param.datastreamId === '') {
        this.notificationInfo('提示', '请选择充电桩')
        return
      }
      if (this.param.startTime === '' || this.param.endTime === '') {
        this.notificationInfo('提示', '请选择时间范围')
        return
      }
      if (this.myChart) {
        console.log('清除mycharts')
        this.myChart.clear()
      }
      this.flag = 1
      this.loading = this.$loading({
        lock: true,
        text: '加载中，请稍候',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(this.closeloading, 10000)
      this.backHisQue()
    },
    closeloading: function () {
      if (this.flag === 1) {
        this.notificationInfo('提示', '请求超时，请稍后重试！')
      }
      this.loading.close()
    },
    // 加载图表
    loaddiagram: function () {
      this.xdata = []
      for (let j = 0; j < this.data.length; j++) {
        this.xdata.push(this.data[j].time)
      }
      console.log(this.xdata)
      this.ydata = []
      for (let i = 0; i < this.data.length; i++) {
        this.ydata.push(this.data[i].value)
      }
      console.log(this.ydata)
      var diagramContainer = document.getElementById('diagram')
      var resizediagramContainer = function () {
        diagramContainer.style.height = document.body.clientHeight - 240 + 'px'
        diagramContainer.style.width = (document.body.clientWidth) * 0.8 + 'px'
      }
      resizediagramContainer()
      this.myChart = echarts.init(diagramContainer)
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
      this.myChart.setOption(option)
      this.loading.close()
    },
    // 向onenet请求功率数据
    // 1、功率大约每8s上报一次，一天大约10800条数据
    // 2、onenet单次查询上限6000条
    // 3、如果一次查询未能返回所有数据（数据量大于limit数），会返回cursor参数，下次查询带cursor可查询从上次结束开始的数据
    // 4、充电桩一天的数据量，最多查两次就够了
    backHisQue: function () {
      let onenetData = []
      onenet.onenetHisQue(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.flag = 0
        if (response.data.datastreams.length === 0) {
          this.notificationInfo('提示', '该时段内无数据')
        } else {
          for (let i = 0; i < response.data.datastreams[0].datapoints.length; i++) {
            onenetData.push(response.data.datastreams[0].datapoints[i])
          }
        }
        if (response.data.cursor) {
          console.log('第二次查询')
          this.param.cursor = response.data.cursor
          onenet.onenetHisQueCur(this.param).then(function (res) {
            console.log('res')
            console.log(res)
            if (res.errno !== 0) {
              this.notificationInfo('错误提示', res.error)
              return
            }
            for (let i = 0; i < res.data.datastreams[0].datapoints.length; i++) {
              onenetData.push(res.data.datastreams[0].datapoints[i])
            }
            console.log('onenet')
            console.log(onenetData)
            this.data = []
            for (let i = 0; i < onenetData.length; i++) {
              let obj = {}
              obj.time = onenetData[i].at
              obj.value = onenetData[i].value
              this.data[i] = obj
            }
            console.log(this.data)
            this.loaddiagram()
          }.bind(this))
        } else {
          this.data = []
          for (let i = 0; i < onenetData.length; i++) {
            let obj = {}
            obj.time = onenetData[i].at
            obj.value = onenetData[i].value
            this.data[i] = obj
          }
          console.log(this.data)
          this.loaddiagram()
        }
        sessionRemoveStore('CRApiKey')
        sessionRemoveStore('CRDeviceId')
        sessionRemoveStore('CRDatastreamId')
        sessionRemoveStore('CRStartTime')
        sessionRemoveStore('CREndTime')
      }.bind(this))
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 获取所有充电桩信息
    backAllStationQue: function () {
      back.allStationQue().then(function (response) {
        console.log('充电桩信息查询')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.param.apiKey = response.data[0].apiKey
        this.options = []
        for (let i = 0; i < response.data.length; i++) {
          let obj = {}
          obj.value = response.data[i].deviceId
          obj.label = response.data[i].name
          obj.children = [{
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
          this.options.push(obj)
        }
        console.log(this.options)
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
  margin-bottom: 50px;
}
.chargingInfo {
  float: left;
  margin: 0 50px 0 120px;
}
.dataTimePicker {
  float: left;
}
.querybtn {
  margin-left: 10px;
}
#diagram {
  margin: 0 auto;
  width: 800px;
  height: 400px;
  min-height: 200px;
}
</style>
