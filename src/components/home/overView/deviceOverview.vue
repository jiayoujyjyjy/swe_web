<template>
  <div class="deviceOverviewbase">
    <div class="deviceOverview">
      <div class="box1">
        <div class="device0">今日激活</div>
        <div class="device11">{{chargingTodayData.todayCreate}}</div>
        <div class="device12">台</div>
      </div>
      <div class="box1">
        <div class="device0">今日在线</div>
        <div class="device11">{{chargingTodayData.online}}</div>
        <div class="device12">台</div>
      </div>
      <div class="box1">
        <div class="device0">累计激活</div>
        <div class="device11">{{chargingTodayData.historyCreate}}</div>
        <div class="device12">台</div>
      </div>
    </div>
    <div class="chartBox">
      <div id="deviceToday">每日激活</div>
      <div id="deviceActive">每日在线</div>
      <div id="deviceTotal">累计激活</div>
      <div id="deviceCity">城市分布</div>
    </div>
  </div>
</template>

<script>
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
import echarts from 'echarts'
import { character } from '@/components/config/Character'
export default {
  name: 'billing',
  data () {
    return {
      param: {
        'currentPage': 1,
        'pagesize': 10, // 每页显示的记录数目
        'picture': false // true-表格 false-图形
      },
      // 设备今日统计数目
      chargingTodayData: {
        todayCreate: '',
        online: '',
        historyCreate: ''
      },
      // 设备累计统计数目
      chargingWeekData: [],
      cityTableData: [], // 城市分布数据
      xdata1: ['2018.08.20', '2018.08.21', '2018.08.22', '2018.08.23', '2018.08.24', '2018.08.25', '2018.08.26'],
      ydata1: ['30', '25', '35', '20', '25', '20', '30'],
      xdata2: ['2018.08.20', '2018.08.21', '2018.08.22', '2018.08.23', '2018.08.24', '2018.08.25', '2018.08.26'],
      ydata2: ['2000', '1900', '1950', '2150', '2050', '2000', '1900'],
      xdata3: ['2018.08.20', '2018.08.21', '2018.08.22', '2018.08.23', '2018.08.24', '2018.08.25', '2018.08.26'],
      ydata3: ['2850', '2800', '2870', '2910', '2950', '2980', '3000'],
      xdata4: ['北京', '上海', '广州', '南京', '苏州'],
      ydata4: ['23', '35', '20', '27', '30'],
      timer: null,
      resizeMarker: 0
    }
  },
  created: function () {
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
  },
  mounted: function () {
    // 获取设备的今日统计数目
    this.backChargingToday()
    // // 获取设备的累计统计数目
    // this.backChargingWeek()
    // // 分页获取充电桩城市列表（图形或者表格）,默认为列表
    // this.backChargingCityListQue()
    Promise.all([this.backChargingWeek(), this.backChargingCityListQue()]).then(function () {
      console.log('两个AJAX请求均已执行完毕')
      this.loaddiagram()
    }.bind(this))
  },
  methods: {
    loaddiagram: function () {
      /*
      //  ************  加载每日激活图表  *************
      */
      this.xdata1 = []
      for (let i = 0; i < this.chargingWeekData.length; i++) {
        this.xdata1.push(character.getCurrentTimeSimple(7 - i))
      }
      console.log(this.xdata1)
      this.ydata1 = []
      for (let j = 0; j < this.chargingWeekData.length; j++) {
        this.ydata1.push(this.chargingWeekData[j].todayCreate)
      }
      var diagramContainer1 = document.getElementById('deviceToday')
      let chart1 = echarts.init(diagramContainer1)
      // 指定图表的配置项和数据
      var option1 = {
        title: {
          text: '每日激活/台',
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
          data: ['激活数量']
        },
        xAxis: {
          data: this.xdata1
        },
        yAxis: {
          splitLine: {show: false}
        },
        series: [{
          name: '激活数量',
          type: 'line',
          data: this.ydata1
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      chart1.setOption(option1, true)
      /*
      //  ************  加载每日在线图表  *************
      */
      this.xdata2 = this.xdata1 // 加载每日激活图表 已经初始化x轴日期数组了
      this.ydata2 = []
      for (let j = 0; j < this.chargingWeekData.length; j++) {
        this.ydata2.push(this.chargingWeekData[j].online)
      }
      var diagramContainer2 = document.getElementById('deviceActive')
      let chart2 = echarts.init(diagramContainer2)
      // 指定图表的配置项和数据
      var option2 = {
        title: {
          text: '每日在线/台',
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
          data: ['在线数量']
        },
        xAxis: {
          data: this.xdata2
        },
        yAxis: {
          splitLine: {show: false}
        },
        series: [{
          name: '在线数量',
          type: 'line',
          data: this.ydata2
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      chart2.setOption(option2, true)
      /*
      //  ************  加载累计激活图表  *************
      */
      this.xdata3 = this.xdata1 // 加载每日激活图表 已经初始化x轴日期数组了
      this.ydata3 = []
      for (let j = 0; j < this.chargingWeekData.length; j++) {
        this.ydata3.push(this.chargingWeekData[j].historyCreate)
      }
      var diagramContainer3 = document.getElementById('deviceTotal')
      let chart3 = echarts.init(diagramContainer3)
      // 指定图表的配置项和数据
      var option3 = {
        title: {
          text: '累计激活/台',
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
          data: ['累计激活数量']
        },
        xAxis: {
          data: this.xdata3
        },
        yAxis: {
          splitLine: {show: false}
        },
        series: [{
          name: '累计激活数量',
          type: 'line',
          data: this.ydata3
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      chart3.setOption(option3, true)
      /*
      //  ************  加载城市分布图表  *************
      */
      this.xdata4 = []
      for (let i = 0; i < this.cityTableData.length; i++) {
        this.xdata4.push(this.cityTableData[i].city)
      }
      this.ydata4 = []
      for (let j = 0; j < this.cityTableData.length; j++) {
        this.ydata4.push(this.cityTableData[j].quantity)
      }
      var diagramContainer4 = document.getElementById('deviceCity')
      let chart4 = echarts.init(diagramContainer4)
      // 指定图表的配置项和数据
      var option4 = {
        title: {
          text: '城市分布/台',
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
          data: this.xdata4
        },
        yAxis: {
          splitLine: {show: false}
        },
        series: [{
          name: '数量',
          type: 'bar',
          data: this.ydata4
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      chart4.setOption(option4, true)
      window.onresize = function () {
        console.log('chartresize')
        chart1.resize()
        chart2.resize()
        chart3.resize()
        chart4.resize()
      }
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 获取设备的今日统计数目
    backChargingToday: function () {
      back.chargingToday(this.param).then(function (response) {
        console.log('获取设备的今日统计数目')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        let obj = {}
        obj.todayCreate = response.data.todayCreate
        obj.online = response.data.online
        obj.historyCreate = response.data.historyCreate
        this.chargingTodayData = obj
      }.bind(this))
    },
    // 获取设备的累计统计数目
    backChargingWeek: function () {
      return new Promise(function (resolve, reject) {
        back.chargingWeek(this.param).then(function (response) {
          console.log('获取设备的累计统计数目')
          console.log(response)
          if (response.errno !== 0) {
            this.notificationInfo('错误提示', response.error)
            resolve()
            return
          }
          let data = []
          for (let i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.todayCreate = response.data[i].todayCreate
            obj.online = response.data[i].online
            obj.historyCreate = response.data[i].historyCreate
            data.push(obj)
          }
          this.chargingWeekData = data
          resolve()
        }.bind(this))
          .catch(function (error) {
            console.log(error)
            reject()
          })
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    },
    // 分页获取充电桩城市列表（图形或者表格）,默认为列表
    backChargingCityListQue: function () {
      return new Promise(function (resolve, reject) {
        back.chargingCityListQue(this.param).then(function (response) {
          console.log('分页获取充电桩城市列表（图形或者表格）,默认为列表')
          console.log(response)
          if (response.errno !== 0) {
            this.notificationInfo('错误提示', response.error)
            resolve()
            return
          }
          // 表格显示
          if (this.param.picture === true) {
            this.eltotal = response.data.total
            this.cityTableData = []
            for (let i = 0; i < response.data.record.length; i++) {
              let obj = {}
              obj.city = response.data.record[i].city
              obj.quantity = response.data.record[i].nums
              this.cityTableData.push(obj)
            }
          } else { // 图形显示 1.back数据存储
            this.cityTableData = []
            for (let i = 0; i < response.data.record.length; i++) {
              let obj = {}
              obj.city = response.data.record[i].city
              obj.quantity = response.data.record[i].nums
              this.cityTableData.push(obj)
            }
          }
          resolve()
        }.bind(this))
          .catch(function (error) {
            console.log(error)
            reject()
          })
      }.bind(this))
        .catch(function (error) {
          console.log(error)
        })
    }
    // // 获取设备的累计统计数目
    // backChargingWeek: function () {
    //   back.chargingWeek(this.param).then(function (response) {
    //     console.log('获取设备的累计统计数目')
    //     console.log(response)
    //     if (response.errno !== 0) {
    //       this.notificationInfo('错误提示', response.error)
    //       return
    //     }
    //     let data = []
    //     for (let i = 0; i < response.data.length; i++) {
    //       let obj = {}
    //       obj.todayCreate = response.data[i].todayCreate
    //       obj.online = response.data[i].online
    //       obj.historyCreate = response.data[i].historyCreate
    //       data.push(obj)
    //     }
    //     this.chargingWeekData = data
    //     console.log(this.chargingWeekData)
    //     // 2.加载图形
    //     this.loaddiagram()
    //   }.bind(this))
    // },
    // // 分页获取充电桩城市列表（图形或者表格）,默认为列表
    // backChargingCityListQue: function () {
    //   back.chargingCityListQue(this.param).then(function (response) {
    //     console.log('分页获取充电桩城市列表（图形或者表格）,默认为列表')
    //     console.log(response)
    //     if (response.errno !== 0) {
    //       this.notificationInfo('错误提示', response.error)
    //       return
    //     }
    //     // 表格显示
    //     if (this.param.picture === true) {
    //       this.eltotal = response.data.total
    //       this.cityTableData = []
    //       for (let i = 0; i < response.data.record.length; i++) {
    //         let obj = {}
    //         obj.city = response.data.record[i].city
    //         obj.quantity = response.data.record[i].nums
    //         this.cityTableData.push(obj)
    //       }
    //     } else { // 图形显示 1.back数据存储
    //       this.cityTableData = []
    //       for (let i = 0; i < response.data.record.length; i++) {
    //         let obj = {}
    //         obj.city = response.data.record[i].city
    //         obj.quantity = response.data.record[i].nums
    //         this.cityTableData.push(obj)
    //       }
    //     }
    //   }.bind(this))
    // }
  }
}
</script>

<style scoped>
.deviceOverviewbase{
  width: 100%;
  height: 100%;
  /* overflow: auto; */
}
.deviceOverview {
  height: 75px;
  width: 100%;
  background-color: #FFFFFD;
  border-radius: 4px;
  box-shadow: 0 0 5px #FFFFFD;
  margin-top: 10px;
}
.box1 {
  padding: 10px 20px 0 20px;
  margin: 0 40px;
  float: left;
  width: 160px;
}
.device0 {
  font-size: 12px;
  color: #666666;
}
.device11 {
  font-size: 24px;
  float: left;
  margin: 10px 0 0 55px;
  color: #ff6600;
}
.device12 {
  font-size: 10px;
  float: left;
  margin-top: 20px;
  color: #ff6600;
}
.chartBox {
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
#deviceToday {
  padding-top: 10px;
  width: 38vw;
  height: 34vh;
  background-color: #FFFFFD;
  box-shadow: 0 0 5px #FFFFFD;
  border-radius: 4px;
  margin: 20px 20px 10px 20px;
  /* float: left; */
}
#deviceActive {
  padding-top: 10px;
  width: 38vw;
  height: 34vh;
  background-color: #FFFFFD;
  box-shadow: 0 0 5px #FFFFFD;
  border-radius: 4px;
  margin: 20px 0 10px 0px;
  /* float: left; */
}
#deviceTotal {
  padding-top: 10px;
  width: 38vw;
  height: 34vh;
  background-color: #FFFFFD;
  box-shadow: 0 0 5px #FFFFFD;
  border-radius: 4px;
  margin: 10px 20px 10px 20px;
  /* float: left; */
}
#deviceCity {
  padding-top: 10px;
  width: 38vw;
  height: 34vh;
  background-color: #FFFFFD;
  box-shadow: 0 0 5px #FFFFFD;
  border-radius: 4px;
  margin: 10px 0 10px 0px;
  /* float: left; */
}
</style>
