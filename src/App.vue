<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { back } from 'api'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
import $ from 'jquery'
export default {
  name: 'App',
  data () {
    return {
      param: {
        'userId': ''
      },
      windowHeighth: '',
      containerHeight: ''
    }
  },
  mounted: function () {
    // // 全局设置console.log为空函数，等价于注释掉所有的打印输出
    // console.log = function () {}
    // window.alert = function () {}
    this.caculateContainer()
    // 每隔五十分钟刷新一次token
    window.setInterval(this.backTokenQue, 3000000)
  },
  methods: {
    // 因为header高度不可变，要想在不同尺寸的显示器上完全显示页面，需要计算container的高度，
    caculateContainer: function () {
      var containerHeight = document.getElementById('app')
      this.windowHeighth = $(window).height()
      console.log(this.windowHeighth)
      this.containerHeight = this.windowHeighth - 60
      console.log(this.containerHeight)
      containerHeight.style.height = (((this.containerHeight) / (this.windowHeighth)).toFixed(20)) * 100 + '%'
    },
    // token过期，重新获取
    backTokenQue: function () {
      this.param.userId = sessionGetStore('userId')
      back.tokenQue(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        let Authorization = 'Bearer' + ' ' + response.data.token
        console.log(Authorization + 'new')
        sessionSetStore('Authorization', Authorization)
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

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
body, html {
  margin: 0px;
  padding: 0px;
  height: 100%;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}
</style>
