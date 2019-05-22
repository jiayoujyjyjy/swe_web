<template>
  <div class="userOverviewbase">
    <div class="userOverview">
      <div class="box1">
        <div class="user0">今日新增</div>
        <div class="user11">{{userTodayData.todayCreate}}</div>
        <div class="user12">位</div>
      </div>
      <div class="box1">
        <div class="user0">今日活跃</div>
        <div class="user11">{{userTodayData.todayActive}}</div>
        <div class="user12">位</div>
      </div>
      <div class="box1">
        <div class="user0">累计用户</div>
        <div class="user11">{{userTodayData.historyCreate}}</div>
        <div class="user12">位</div>
      </div>
    </div>
    <div class="chartBox">
      <div id="userToday">每日新增</div>
      <div id="userActive">每日活跃</div>
      <div id="userTotal">累计用户</div>
      <div id="userblank">累计用户</div>
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
        'pagesize': 10 // 每页显示的记录数目
      },
      // 用户今日统计数目
      userTodayData: {
        todayCreate: '',
        todayActive: '',
        historyCreate: ''
      },
      // 用户累计统计数目
      userWeekData: [],
      xdata1: ['2018.08.20', '2018.08.21', '2018.08.22', '2018.08.23', '2018.08.24', '2018.08.25', '2018.08.26'],
      ydata1: ['100', '90', '95', '80', '110', '85', '90'],
      xdata2: ['2018.08.20', '2018.08.21', '2018.08.22', '2018.08.23', '2018.08.24', '2018.08.25', '2018.08.26'],
      ydata2: ['20', '15', '25', '10', '15', '15', '20'],
      xdata3: ['2018.08.20', '2018.08.21', '2018.08.22', '2018.08.23', '2018.08.24', '2018.08.25', '2018.08.26'],
      ydata3: ['36', '36.8', '37.5', '38', '38.6', '39', '40']
    }
  },
  created: function () {
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
  },
  mounted: function () {
    // 获取用户的今日统计数目
    this.backUserToday()
    // 获取用户的累计统计数目
    this.backUserWeek()
  },
  methods: {
    loaddiagram: function () {
      /*
      //  ************  加载每日新增图表  *************
      */
      this.xdata1 = []
      for (let i = 0; i < this.userWeekData.length; i++) {
        this.xdata1.push(character.getCurrentTimeSimple(7 - i))
      }
      this.ydata1 = []
      for (let j = 0; j < this.userWeekData.length; j++) {
        this.ydata1.push(this.userWeekData[j].todayCreate)
      }
      var diagramContainer1 = document.getElementById('userToday')
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
      //  ************  加载每日活跃图表  *************
      */
      this.xdata2 = this.xdata1 // 加载每日激活图表 已经初始化x轴日期数组了
      this.ydata2 = []
      for (let j = 0; j < this.userWeekData.length; j++) {
        this.ydata2.push(this.userWeekData[j].historyActive)
      }
      var diagramContainer2 = document.getElementById('userActive')
      let chart2 = echarts.init(diagramContainer2)
      // 指定图表的配置项和数据
      var option2 = {
        title: {
          text: '每日活跃/k位',
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
          data: ['活跃数量']
        },
        xAxis: {
          data: this.xdata2
        },
        yAxis: {
          splitLine: {show: false}
        },
        series: [{
          name: '活跃数量',
          type: 'line',
          data: this.ydata2
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      chart2.setOption(option2)
      /*
      //  ************  加载累计用户图表  *************
      */
      this.xdata3 = this.xdata1 // 加载每日激活图表 已经初始化x轴日期数组了
      this.ydata3 = []
      for (let j = 0; j < this.userWeekData.length; j++) {
        this.ydata3.push(this.userWeekData[j].historyCreate)
      }
      var diagramContainer3 = document.getElementById('userTotal')
      let chart3 = echarts.init(diagramContainer3)
      // 指定图表的配置项和数据
      var option3 = {
        title: {
          text: '累计用户/k位',
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
          data: ['累计用户数量']
        },
        xAxis: {
          data: this.xdata3
        },
        yAxis: {
          splitLine: {show: false}
        },
        series: [{
          name: '累计用户数量',
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
    // 获取用户的今日统计数目
    backUserToday: function () {
      back.userToday(this.param).then(function (response) {
        console.log('获取用户的今日统计数目')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        let obj = {}
        obj.todayCreate = response.data.todayCreate
        obj.todayActive = response.data.todayActive
        obj.historyCreate = response.data.historyCreate
        this.userTodayData = obj
      }.bind(this))
    },
    // 获取用户的累计统计数目
    backUserWeek: function () {
      back.userWeek(this.param).then(function (response) {
        console.log('获取用户的累计统计数目')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        let data = []
        for (let i = 0; i < response.data.length; i++) {
          let obj = {}
          obj.todayCreate = response.data[i].todayCreate
          obj.historyActive = response.data[i].historyActive
          obj.historyCreate = response.data[i].historyCreate
          data.push(obj)
        }
        this.userWeekData = data
        // 2.加载图形
        this.loaddiagram()
      }.bind(this))
    }
  }
}
</script>

<style scoped>
.userOverviewbase{
  width: 100%;
  height: 100%;
}
.userOverview {
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
.user0 {
  font-size: 12px;
  color: #666666;
}
.user11 {
  font-size: 24px;
  float: left;
  margin: 10px 0 0 55px;
  color: #ff6600;
}
.user12 {
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
#userToday {
  padding-top: 10px;
  width: 38vw;
  height: 34vh;
  background-color: #FFFFFD;
  box-shadow: 0 0 5px #FFFFFD;
  border-radius: 4px;
  margin: 20px 20px 10px 20px;
  float: left;
}
#userActive {
  padding-top: 10px;
  width: 38vw;
  height: 34vh;
  background-color: #FFFFFD;
  box-shadow: 0 0 5px #FFFFFD;
  border-radius: 4px;
  margin: 20px 0 10px 0px;
  float: left;
}
#userTotal {
  padding-top: 10px;
  width: 38vw;
  height: 34vh;
  background-color: #FFFFFD;
  box-shadow: 0 0 5px #FFFFFD;
  border-radius: 4px;
  margin: 10px 20px 10px 20px;
  float: left;
}
#userblank {
  padding-top: 10px;
  width: 38vw;
  height: 34vh;
  background-color: #FFFFFD;
  box-shadow: 0 0 5px #FFFFFD;
  border-radius: 4px;
  margin: 10px 0 10px 0px;
  float: left;
  visibility: hidden;
}
</style>
