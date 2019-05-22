<template>
  <div class="clientOverviewbase">
    <div class="clientOverview">
      <div class="box1">
        <div class="client0">今日新增</div>
        <div class="client11">{{customerTodayData.todayCreate}}</div>
        <div class="client12">位</div>
      </div>
      <div class="box1">
        <div class="client0">累计客户</div>
        <div class="client11">{{customerTodayData.historyCreate}}</div>
        <div class="client12">位</div>
      </div>
    </div>
    <div class="chartBox">
      <div id="clientToday">每日新增</div>
      <div id="clientTotal">累计客户</div>
      <div id="clientCity">城市分布</div>
      <div id="clientblank">城市分布</div>
    </div>
  </div>
</template>

<script>
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
import echarts from 'echarts'
import { character } from '@/components/config/Character'
export default {
  data () {
    return {
      param: {
        'currentPage': 1,
        'pagesize': 10, // 每页显示的记录数目
        'picture': false // true-表格 false-图形
      },
      // 客户今日统计数目
      customerTodayData: {
        todayCreate: '',
        historyCreate: ''
      },
      // 客户累计统计数目
      customerWeekData: [],
      xdata1: ['2018.08.20', '2018.08.21', '2018.08.22', '2018.08.23', '2018.08.24', '2018.08.25', '2018.08.26'],
      ydata1: ['10', '5', '8', '4', '6', '5', '9'],
      xdata2: ['2018.08.20', '2018.08.21', '2018.08.22', '2018.08.23', '2018.08.24', '2018.08.25', '2018.08.26'],
      ydata2: ['180', '184', '189', '191', '195', '197', '200'],
      xdata3: ['北京', '上海', '广州', '南京', '苏州'],
      ydata3: ['23', '35', '20', '27', '30']
    }
  },
  created: function () {
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
  },
  mounted: function () {
    // 获取客户的今日统计数目
    this.backCustomerToday()
    // // 获取客户的累计统计数目
    // this.backCustomerWeek()
    // // 分页获取客户城市列表（图形或者表格）,默认为列表
    // this.backCustomerCityListQue()
    Promise.all([this.backCustomerWeek(), this.backCustomerCityListQue()]).then(function () {
      console.log('两个AJAX请求均已执行完毕')
      this.loaddiagram()
    }.bind(this))
  },
  methods: {
    loaddiagram: function () {
      /*
      //  ************  加载每日新增图表  *************
      */
      this.xdata1 = []
      for (let i = 0; i < this.customerWeekData.length; i++) {
        this.xdata1.push(character.getCurrentTimeSimple(7 - i))
      }
      this.ydata1 = []
      for (let j = 0; j < this.customerWeekData.length; j++) {
        this.ydata1.push(this.customerWeekData[j].todayCreate)
      }
      var diagramContainer1 = document.getElementById('clientToday')
      let chart1 = echarts.init(diagramContainer1)
      // 指定图表的配置项和数据
      var option1 = {
        title: {
          text: '每日新增/位',
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
          data: ['新增数量']
        },
        xAxis: {
          data: this.xdata1
        },
        yAxis: {
          splitLine: {show: false}
        },
        series: [{
          name: '新增数量',
          type: 'line',
          data: this.ydata1
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      chart1.setOption(option1)
      /*
      //  ************  加载累计客户图表  *************
      */
      this.xdata2 = this.xdata1 // 加载每日激活图表 已经初始化x轴日期数组了
      this.ydata2 = []
      for (let j = 0; j < this.customerWeekData.length; j++) {
        this.ydata2.push(this.customerWeekData[j].historyCreate)
      }
      var diagramContainer2 = document.getElementById('clientTotal')
      let chart2 = echarts.init(diagramContainer2)
      // 指定图表的配置项和数据
      var option2 = {
        title: {
          text: '累计客户/位',
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
          data: ['客户数量']
        },
        xAxis: {
          data: this.xdata2
        },
        yAxis: {
          splitLine: {show: false}
        },
        series: [{
          name: '客户数量',
          type: 'line',
          data: this.ydata2
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      chart2.setOption(option2)
      /*
      //  ************  加载城市分布图表  *************
      */
      this.xdata3 = []
      for (let i = 0; i < this.cityTableData.length; i++) {
        this.xdata3.push(this.cityTableData[i].city)
      }
      this.ydata3 = []
      for (let j = 0; j < this.cityTableData.length; j++) {
        this.ydata3.push(this.cityTableData[j].quantity)
      }
      var diagramContainer3 = document.getElementById('clientCity')
      let chart3 = echarts.init(diagramContainer3)
      // 指定图表的配置项和数据
      var option3 = {
        title: {
          text: '城市分布/位',
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
          data: this.xdata3
        },
        yAxis: {
          splitLine: {show: false}
        },
        series: [{
          name: '数量',
          type: 'line',
          data: this.ydata3
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      chart3.setOption(option3)
      window.onresize = function () {
        console.log('chartresize')
        chart1.resize()
        chart2.resize()
        chart3.resize()
      }
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 获取客户的今日统计数目
    backCustomerToday: function () {
      back.customerToday(this.param).then(function (response) {
        console.log('获取客户的今日统计数目')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        let obj = {}
        obj.todayCreate = response.data.todayCreate
        obj.historyCreate = response.data.historyCreate
        this.customerTodayData = obj
      }.bind(this))
    },
    // 获取客户的累计统计数目
    backCustomerWeek: function () {
      return new Promise(function (resolve, reject) {
        back.customerWeek(this.param).then(function (response) {
          console.log('获取客户的累计统计数目')
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
            obj.historyCreate = response.data[i].historyCreate
            data.push(obj)
          }
          this.customerWeekData = data
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
    // 分页获取客户城市列表（图形或者表格）,默认为列表
    backCustomerCityListQue: function () {
      return new Promise(function (resolve, reject) {
        back.customerCityListQue(this.param).then(function (response) {
          console.log('分页获取客户城市列表（图形或者表格）,默认为列表')
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
              obj.quantity = response.data.record[i].number
              this.cityTableData.push(obj)
            }
          } else { // 图形显示 1.back数据存储
            this.cityTableData = []
            for (let i = 0; i < response.data.record.length; i++) {
              let obj = {}
              obj.city = response.data.record[i].city
              obj.quantity = response.data.record[i].number
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
  }
}
</script>

<style scoped>
.clientOverviewbase{
  width: 100%;
  height: 100%;
}
.clientOverview {
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
.client0 {
  font-size: 12px;
  color: #666666;
}
.client11 {
  font-size: 24px;
  float: left;
  margin: 10px 0 0 55px;
  color: #ff6600;
}
.client12 {
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
#clientToday {
  padding-top: 10px;
  width: 38vw;
  height: 34vh;
  background-color: #FFFFFD;
  box-shadow: 0 0 5px #FFFFFD;
  border-radius: 4px;
  margin: 20px 20px 10px 20px;
  float: left;
}
#clientTotal {
  padding-top: 10px;
  width: 38vw;
  height: 34vh;
  background-color: #FFFFFD;
  box-shadow: 0 0 5px #FFFFFD;
  border-radius: 4px;
  margin: 20px 0 10px 0px;
  float: left;
}
#clientCity {
  padding-top: 10px;
  width: 38vw;
  height: 34vh;
  background-color: #FFFFFD;
  box-shadow: 0 0 5px #FFFFFD;
  border-radius: 4px;
  margin: 10px 20px 10px 20px;
  float: left;
}
#clientblank {
  padding-top: 10px;
  width: 38vw;
  height: 34vh;
  background-color: #FFFFFD;
  box-shadow: 0 0 5px #FFFFFD;
  border-radius: 4px;
  margin: 10px 0 10px 0px;
  visibility: hidden;
}
</style>
