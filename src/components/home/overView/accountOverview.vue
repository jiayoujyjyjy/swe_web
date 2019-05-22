<template>
  <div class="accountOverviewbase">
    <div class="accountOverview">
      <div class="box1">
        <div class="account0">今日收益</div>
        <div class="account11">{{incomeTodayData.today}}</div>
        <div class="account12">万</div>
      </div>
      <div class="box1">
        <div class="account0">累计收益</div>
        <div class="account11">{{incomeTodayData.history}}</div>
        <div class="account12">万</div>
      </div>
      <div class="box2">
        注：此页的收益指鸿世电器有限公司的收益
      </div>
    </div>
    <div class="chartBox">
      <div id="accountToday">每日收益</div>
      <div id="accountTotal">累计收益</div>
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
      // 资金今日统计数目
      incomeTodayData: {
        today: '',
        history: ''
      },
      // 资金累计统计数目
      incomeWeekData: [],
      xdata1: ['2018.08.20', '2018.08.21', '2018.08.22', '2018.08.23', '2018.08.24', '2018.08.25', '2018.08.26'],
      ydata1: ['20', '15', '25', '10', '15', '10', '20'],
      xdata2: ['2018.08.20', '2018.08.21', '2018.08.22', '2018.08.23', '2018.08.24', '2018.08.25', '2018.08.26'],
      ydata2: ['2850', '2890', '2900', '2920', '2940', '2970', '3000']
    }
  },
  created: function () {
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
  },
  mounted: function () {
    // 获取资金的今日统计数目
    this.backIncomeToday()
    // 获取资金的累计统计数目
    this.backIncomeWeek()
  },
  methods: {
    loaddiagram: function () {
      /*
      //  ************  加载每日收益图表  *************
      */
      this.xdata1 = []
      for (let i = 0; i < this.incomeWeekData.length; i++) {
        this.xdata1.push(character.getCurrentTimeSimple(7 - i))
      }
      this.ydata1 = []
      for (let j = 0; j < this.incomeWeekData.length; j++) {
        this.ydata1.push(this.incomeWeekData[j].today)
      }
      var diagramContainer1 = document.getElementById('accountToday')
      let chart1 = echarts.init(diagramContainer1)
      // 指定图表的配置项和数据
      var option1 = {
        title: {
          text: '每日收益/万',
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
          data: ['收益']
        },
        xAxis: {
          data: this.xdata1
        },
        yAxis: {
          splitLine: {show: false}
        },
        series: [{
          name: '收益',
          type: 'line',
          data: this.ydata1
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      chart1.setOption(option1)
      /*
      //  ************  加载累计收益图表  *************
      */
      this.xdata2 = this.xdata1 // 加载每日激活图表 已经初始化x轴日期数组了
      this.ydata2 = []
      for (let j = 0; j < this.incomeWeekData.length; j++) {
        this.ydata2.push(this.incomeWeekData[j].history)
      }
      var diagramContainer2 = document.getElementById('accountTotal')
      let chart2 = echarts.init(diagramContainer2)
      // 指定图表的配置项和数据
      var option2 = {
        title: {
          text: '累计收益/万',
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
          data: ['收益']
        },
        xAxis: {
          data: this.xdata2
        },
        yAxis: {
          splitLine: {show: false}
        },
        series: [{
          name: '收益',
          type: 'line',
          data: this.ydata2
        }]
      }
      // 使用刚指定的配置项和数据显示图表。
      chart2.setOption(option2)
      window.onresize = function () {
        console.log('chartresize')
        chart1.resize()
        chart2.resize()
      }
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 获取资金的今日统计数目
    backIncomeToday: function () {
      back.incomeToday(this.param).then(function (response) {
        console.log('获取资金的今日统计数目')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        let obj = {}
        obj.today = response.data.today
        obj.history = response.data.history
        this.incomeTodayData = obj
      }.bind(this))
    },
    // 获取资金的累计统计数目
    backIncomeWeek: function () {
      back.incomeWeek(this.param).then(function (response) {
        console.log('获取资金的累计统计数目')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        let data = []
        for (let i = 0; i < response.data.length; i++) {
          let obj = {}
          obj.today = response.data[i].today
          obj.history = response.data[i].history
          data.push(obj)
        }
        this.incomeWeekData = data
        // 2.加载图形
        this.loaddiagram()
      }.bind(this))
    }
  }
}
</script>

<style scoped>
.accountOverviewbase{
  width: 100%;
  height: 100%;
}
.accountOverview {
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
  width: 150px;
}
.box2 {
  color: #f5a65e;
  padding: 75px 0px 0 0px;
  margin-left: 1200px;
  width: 300px;
}
.account0 {
  font-size: 12px;
  color: #666666;
}
.account11 {
  font-size: 24px;
  float: left;
  margin: 10px 0 0 55px;
  color: #ff6600;
}
.account12 {
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
#accountToday {
  padding-top: 10px;
  width: 38vw;
  height: 34vh;
  background-color: #FFFFFD;
  box-shadow: 0 0 5px #FFFFFD;
  border-radius: 4px;
  margin: 20px 20px 10px 20px;
  float: left;
}
#accountTotal {
  padding-top: 10px;
  width: 38vw;
  height: 34vh;
  background-color: #FFFFFD;
  box-shadow: 0 0 5px #FFFFFD;
  border-radius: 4px;
  margin: 20px 0 10px 0px;
  float: left;
}
</style>
