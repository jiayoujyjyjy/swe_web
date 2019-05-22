<template>
  <div style="width:100%;height:100%">
    <el-header>
      <div class="logoImg">
        <img src="/static/logo.png" class="logoicon" />
      </div>
      <div class="name">
        鸿世电器充电桩管理系统
      </div>
      <div class="usermsg">
        <div class="onlineInfo">在线：{{onlineNum}}离线：{{outlineNum}}</div>
        <div style="float:left">
          <el-dropdown>
            <span>
              <div class="headerImgdiv">
                <img src="/static/alarm.png" class="headerImg" style="z-index:1"/>
              </div>
              <div class="alarmNum">{{alarmNum}}</div>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item divided class="border-bottom: solid 1px silver" @click.native="firstAlarmBt">{{alarmInfo[0]}}</el-dropdown-item>
              <el-dropdown-item divided @click.native="secondAlarmBt">{{alarmInfo[1]}}</el-dropdown-item>
              <el-dropdown-item divided @click.native="thirdAlarmBt">{{alarmInfo[2]}}</el-dropdown-item>
              <el-dropdown-item @click.native="moreAboutAlarm" style="text-align:center">查看更多</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="headerImgdiv">
          <img src="/static/userimg.png" class="headerImg" />
        </div>
        <el-menu
          :default-active="activeIndex"
          style="float:left;margin-top:-11px;"
          text-color='#ffffff'
          active-text-color='#ffffff'
          background-color='#1f2326'
          mode="horizontal">
          <el-submenu index="1">
            <template slot="title">{{userName}}</template>
            <el-menu-item style="width:50px;" index="1-1" @click="toSystemUserCenterBt">个人中心</el-menu-item>
            <el-menu-item style="width:50px;" index="1-2" @click="tologinBt">退出</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </el-header>
    <el-container>
        <el-aside width="200px">
          <div>
            <el-menu
            background-color="#1f2326"
            text-color="#fff"
            class="el-menu-aside"
            active-text-color="#409EFF"
            :default-active="activeNum">
                <el-menu-item index="1" @click="deviceInfoBt" class="menutext">
                    <img class="menuImg" src="/static/plug_white.png" v-show="plugwhite"/>
                    <img class="menuImg" src="/static/plug_blue.png" v-show="plugblue"/>
                    <span slot="title">设备信息</span>
                </el-menu-item>
                <el-menu-item index="2" @click="overviewBt" class="menutext">
                    <img class="menuImg" src="/static/overview_white.png" v-show="overviewwhite"/>
                    <img class="menuImg" src="/static/overview_blue.png" v-show="overviewblue"/>
                    <span slot="title">数据概况</span>
                </el-menu-item>
                <el-menu-item index="3" @click="devManageBt" class="menutext">
                    <img class="menuImg" src="/static/devmanage_white.png" v-show="devmanagewhite"/>
                    <img class="menuImg" src="/static/devmanage_blue.png" v-show="devmanageblue"/>
                    <span slot="title">设备管理</span>
                </el-menu-item>
                <el-menu-item index="4" @click="videoBt" class="menutext">
                    <img class="menuImg" src="/static/video_white.png" v-show="videowhite"/>
                    <img class="menuImg" src="/static/video_blue.png" v-show="videoblue"/>
                    <span slot="title">视频监控</span>
                </el-menu-item>
                <el-menu-item index="5" @click="clientManageBt" class="menutext">
                    <img class="menuImg" src="/static/client_white.png" v-show="clientwhite"/>
                    <img class="menuImg" src="/static/client_blue.png" v-show="clientblue"/>
                    <span slot="title">客户管理</span>
                </el-menu-item>
                <el-menu-item index="6" @click="userManageBt" class="menutext">
                    <img class="menuImg" src="/static/user_white.png" v-show="userwhite"/>
                    <img class="menuImg" src="/static/user_blue.png" v-show="userblue"/>
                    <span slot="title">用户管理</span>
                </el-menu-item>
                <el-menu-item index="7" @click="alarmBt" class="menutext">
                    <img class="menuImg" src="/static/alarm_white.png" v-show="alarmwhite"/>
                    <img class="menuImg" src="/static/alarm_blue.png" v-show="alarmblue"/>
                    <span slot="title">报警信息</span>
                </el-menu-item>
                <el-menu-item index="8" @click="accountBt" class="menutext">
                    <img class="menuImg" src="/static/account_white.png" v-show="accountwhite"/>
                    <img class="menuImg" src="/static/account_blue.png" v-show="accountblue"/>
                    <span slot="title">资金结算</span>
                </el-menu-item>
                <el-menu-item index="9" @click="globalSettingBt" class="menutext">
                    <img class="menuImg" src="/static/set_white.png" v-show="setwhite"/>
                    <img class="menuImg" src="/static/set_blue.png" v-show="setblue"/>
                    <span slot="title">系统设置</span>
                </el-menu-item>
            </el-menu>
          </div>
        </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Routers from '@/router'
import { sessionGetStore, sessionSetStore, sessionClearStore } from '@/components/config/Utils'
export default {
  name: 'home',
  data () {
    return {
      userAuth: 1,
      superAdminAuth: 0, // 0超级管理员 1一级管理员 2二级管理员
      activeNum: '',
      activeIndex: '1',
      menu: '',
      alarmNum: 8,
      onlineNum: 8,
      outlineNum: 2,
      alarmInfo: ['第一条报警信息', '第二条报警信息', '第三条报警信息'],
      plugwhite: true, // 左侧菜单图标颜色切换显示标识
      plugblue: false,
      devmanagewhite: true,
      devmanageblue: false,
      videowhite: true,
      videoblue: false,
      clientwhite: true,
      clientblue: false,
      userwhite: true,
      userblue: false,
      alarmwhite: true,
      alarmblue: false,
      accountwhite: true,
      accountblue: false,
      overviewwhite: true,
      overviewblue: false,
      setwhite: true,
      setblue: false,
      deviceSelected: true,
      devManageSelected: false,
      videoSelected: false,
      clientSelected: false,
      userSelected: false,
      alarmSelected: false,
      accountSelected: false,
      overviewSelected: false,
      setSelected: false
    }
  },
  // vuex数据绑定
  computed: {
    userName () {
      return this.$store.state.userName
    },
    devRouter () {
      return this.$store.state.devRouter
    }
  },
  watch: {
    devRouter: function (val) {
      // 设备地图页面跳转到设备列表时保证左侧菜单实时更新
      if (val === '1') {
        this.selectedSet(false, false, true, false, false, false, false, false, false)
        this.iconShowSet(this.deviceSelected, this.overviewSelected, this.devManageSelected, this.videoSelected, this.clientSelected, this.userSelected, this.alarmSelected, this.accountSelected, this.setSelected)
        this.activeNum = '3'
        sessionSetStore('activeNum', this.activeNum)
        this.$store.commit('setDevRouter', '0')
      } else if (val === '2') {
      // 设备列表页面跳转到历史报警时保证左侧菜单实时更新
        this.selectedSet(false, false, false, false, false, false, true, false, false)
        this.iconShowSet(this.deviceSelected, this.overviewSelected, this.devManageSelected, this.videoSelected, this.clientSelected, this.userSelected, this.alarmSelected, this.accountSelected, this.setSelected)
        this.activeNum = '7'
        sessionSetStore('activeNum', this.activeNum)
        this.$store.commit('setDevRouter', '0')
      } else if (val === '3') {
      // 用户管理页面跳转到功率曲线时保证左侧菜单实时更新
        this.selectedSet(false, false, true, false, false, false, false, false, false)
        this.iconShowSet(this.deviceSelected, this.overviewSelected, this.devManageSelected, this.videoSelected, this.clientSelected, this.userSelected, this.alarmSelected, this.accountSelected, this.setSelected)
        this.activeNum = '3'
        sessionSetStore('activeNum', this.activeNum)
        this.$store.commit('setDevRouter', '0')
      } else if (val === '4') {
      // 设备列表跳转到设备地图页面时保证左侧菜单实时更新
        this.selectedSet(true, false, false, false, false, false, false, false, false)
        this.iconShowSet(this.deviceSelected, this.overviewSelected, this.devManageSelected, this.videoSelected, this.clientSelected, this.userSelected, this.alarmSelected, this.accountSelected, this.setSelected)
        this.activeNum = '1'
        sessionSetStore('activeNum', this.activeNum)
        this.$store.commit('setDevRouter', '0')
      }
    }
  },
  created: function () {
    // 防止刷新vuex数据丢失
    var userName = sessionGetStore('userName')
    this.$store.commit('setUserName', userName)
    var userId = sessionGetStore('userId')
    if (!userId) {
      this.notificationInfo('提示', '用户数据过期，请重新登陆')
      Routers.push({ path: '/login' })
    }
    this.activeNum = sessionGetStore('activeNum')
    this.userAuth = sessionGetStore('role')
  },
  mounted: function () {
    // 确定是第几项被选中，防止刷新后图标状态出错
    if (this.activeNum === '1') {
      console.log('activeNum1')
      this.iconShowSet(true, false, false, false, false, false, false, false, false)
    } else if (this.activeNum === '2') {
      this.iconShowSet(false, true, false, false, false, false, false, false, false)
    } else if (this.activeNum === '3') {
      this.iconShowSet(false, false, true, false, false, false, false, false, false)
    } else if (this.activeNum === '4') {
      this.iconShowSet(false, false, false, true, false, false, false, false, false)
    } else if (this.activeNum === '5') {
      this.iconShowSet(false, false, false, false, true, false, false, false, false)
    } else if (this.activeNum === '6') {
      this.iconShowSet(false, false, false, false, false, true, false, false, false)
    } else if (this.activeNum === '7') {
      this.iconShowSet(false, false, false, false, false, false, true, false, false)
    } else if (this.activeNum === '8') {
      this.iconShowSet(false, false, false, false, false, false, false, true, false)
    } else if (this.activeNum === '9') {
      this.iconShowSet(false, false, false, false, false, false, false, false, true)
    }
  },
  methods: {
    // 设备信息
    deviceInfoBt: function () {
      this.selectedSet(true, false, false, false, false, false, false, false, false)
      this.iconShowSet(this.deviceSelected, this.overviewSelected, this.devManageSelected, this.videoSelected, this.clientSelected, this.userSelected, this.alarmSelected, this.accountSelected, this.setSelected)
      this.activeNum = '1'
      // 将activeNum存储在浏览器中，防止页面刷新之后左侧导航栏活动项与实际页面不符
      sessionSetStore('activeNum', this.activeNum)
      Routers.push({ path: '/home/deviceInfo' })
    },
    // 数据概况
    overviewBt: function () {
      this.selectedSet(false, true, false, false, false, false, false, false, false)
      this.iconShowSet(this.deviceSelected, this.overviewSelected, this.devManageSelected, this.videoSelected, this.clientSelected, this.userSelected, this.alarmSelected, this.accountSelected, this.setSelected)
      this.activeNum = '2'
      sessionSetStore('activeNum', this.activeNum)
      sessionSetStore('overview_activeName', 'first')
      Routers.push({ path: '/home/overview' })
    },
    // 设备管理
    devManageBt: function () {
      this.selectedSet(false, false, true, false, false, false, false, false, false)
      this.iconShowSet(this.deviceSelected, this.overviewSelected, this.devManageSelected, this.videoSelected, this.clientSelected, this.userSelected, this.alarmSelected, this.accountSelected, this.setSelected)
      this.activeNum = '3'
      sessionSetStore('activeNum', this.activeNum)
      sessionSetStore('device_activeName', 'first')
      Routers.push({ path: '/home/devmanage' })
    },
    // 视频监控
    videoBt: function () {
      this.selectedSet(false, false, false, true, false, false, false, false, false)
      this.iconShowSet(this.deviceSelected, this.overviewSelected, this.devManageSelected, this.videoSelected, this.clientSelected, this.userSelected, this.alarmSelected, this.accountSelected, this.setSelected)
      this.activeNum = '4'
      sessionSetStore('activeNum', this.activeNum)
      sessionSetStore('camera_activeName', 'first')
      this.$store.commit('setCamActiveName', 'first')
      Routers.push({ path: '/home/video' })
    },
    // 客户管理
    clientManageBt: function () {
      this.selectedSet(false, false, false, false, true, false, false, false, false)
      this.iconShowSet(this.deviceSelected, this.overviewSelected, this.devManageSelected, this.videoSelected, this.clientSelected, this.userSelected, this.alarmSelected, this.accountSelected, this.setSelected)
      this.activeNum = '5'
      sessionSetStore('activeNum', this.activeNum)
      sessionSetStore('client_activeName', 'first')
      Routers.push({ path: '/home/client' })
    },
    // 用户管理
    userManageBt: function () {
      this.selectedSet(false, false, false, false, false, true, false, false, false)
      this.iconShowSet(this.deviceSelected, this.overviewSelected, this.devManageSelected, this.videoSelected, this.clientSelected, this.userSelected, this.alarmSelected, this.accountSelected, this.setSelected)
      this.activeNum = '6'
      sessionSetStore('activeNum', this.activeNum)
      sessionSetStore('user_activeName', 'first')
      Routers.push({ path: '/home/user' })
    },
    // 报警信息
    alarmBt: function () {
      this.selectedSet(false, false, false, false, false, false, true, false, false)
      this.iconShowSet(this.deviceSelected, this.overviewSelected, this.devManageSelected, this.videoSelected, this.clientSelected, this.userSelected, this.alarmSelected, this.accountSelected, this.setSelected)
      this.activeNum = '7'
      sessionSetStore('activeNum', this.activeNum)
      sessionSetStore('alarm_activeName', 'first')
      Routers.push({ path: '/home/alarm' })
    },
    // 资金结算
    accountBt: function () {
      this.selectedSet(false, false, false, false, false, false, false, true, false)
      this.iconShowSet(this.deviceSelected, this.overviewSelected, this.devManageSelected, this.videoSelected, this.clientSelected, this.userSelected, this.alarmSelected, this.accountSelected, this.setSelected)
      this.activeNum = '8'
      sessionSetStore('activeNum', this.activeNum)
      sessionSetStore('account_activeName', 'first')
      console.log(this.userAuth)
      Routers.push({ path: '/home/account' })
      // this.notificationInfo('提示', '资金结算功能暂未开通，敬请期待')
      // if (this.userAuth === '0') {
      //   Routers.push({ path: '/home/account' })
      // } else {
      //   this.notificationInfo('提示', '您没有权限查看该项信息')
      // }
    },
    // 系统设置
    globalSettingBt: function () {
      this.selectedSet(false, false, false, false, false, false, false, false, true)
      this.iconShowSet(this.deviceSelected, this.overviewSelected, this.devManageSelected, this.videoSelected, this.clientSelected, this.userSelected, this.alarmSelected, this.accountSelected, this.setSelected)
      this.activeNum = '9'
      sessionSetStore('activeNum', this.activeNum)
      sessionSetStore('globalSetting_activeName', 'first')
      Routers.push({ path: '/home/globalSetting' })
    },
    // 退出登录
    tologinBt: function () {
      // sessionRemoveStore('userName')
      // sessionRemoveStore('role')
      // sessionRemoveStore('userId')
      // sessionRemoveStore('hour')
      // sessionRemoveStore('minute')
      // sessionRemoveStore('Authorization')
      // sessionRemoveStore('activeNum')
      // sessionRemoveStore('device_activeName')
      // sessionRemoveStore('device_activeName_second')
      // sessionRemoveStore('client_activeName')
      // sessionRemoveStore('client_activeName_second')
      // sessionRemoveStore('user_activeName')
      // sessionRemoveStore('user_activeName_second')
      // sessionRemoveStore('alarm_activeName')
      // sessionRemoveStore('account_activeName')
      // sessionRemoveStore('snSelected')
      // sessionRemoveStore('globalSetting_activeName')
      // sessionRemoveStore('systemUser_activeName_second')
      sessionClearStore()
      Routers.push({ path: '/login' })
    },
    // 进入个人中心
    toSystemUserCenterBt: function () {
      this.selectedSet(false, false, false, false, false, false, false, false, true)
      this.iconShowSet(this.deviceSelected, this.overviewSelected, this.devManageSelected, this.videoSelected, this.clientSelected, this.userSelected, this.alarmSelected, this.accountSelected, this.setSelected)
      this.activeNum = '9'
      sessionSetStore('activeNum', this.activeNum)
      Routers.push({ path: '/home/globalSetting/systemUserCenter' })
    },
    // 报警信息点击按钮事件
    firstAlarmBt: function () {
      console.log('firstAlarm')
      Routers.push({ path: '/home/alarm' })
    },
    secondAlarmBt: function () {
      console.log('secondAlarm')
      Routers.push({ path: '/home/alarm' })
    },
    thirdAlarmBt: function () {
      console.log('thirdAlarm')
      Routers.push({ path: '/home/alarm' })
    },
    // 查看更多关于报警的信息
    moreAboutAlarm: function () {
      console.log('moreAboutAlarm')
      Routers.push({ path: '/home/alarm' })
    },
    /*
    //  ************  辅助函数  *************
    */
    selectedSet: function (deviceSelected, overviewSelected, devManageSelected, videoSelected, clientSelected, userSelected, alarmSelected, accountSelected, setSelected) {
      this.deviceSelected = deviceSelected
      this.overviewSelected = overviewSelected
      this.devManageSelected = devManageSelected
      this.videoSelected = videoSelected
      this.clientSelected = clientSelected
      this.userSelected = userSelected
      this.alarmSelected = alarmSelected
      this.accountSelected = accountSelected
      this.setSelected = setSelected
    },
    iconShowSet: function (deviceSelected, overviewSelected, devManageSelected, videoSelected, clientSelected, userSelected, alarmSelected, accountSelected, setSelected) {
      if (deviceSelected) {
        this.plugwhite = false
        this.plugblue = true
      } else {
        this.plugwhite = true
        this.plugblue = false
      }
      if (overviewSelected) {
        this.overviewwhite = false
        this.overviewblue = true
      } else {
        this.overviewwhite = true
        this.overviewblue = false
      }
      if (devManageSelected) {
        this.devmanagewhite = false
        this.devmanageblue = true
      } else {
        this.devmanagewhite = true
        this.devmanageblue = false
      }
      if (videoSelected) {
        this.videowhite = false
        this.videoblue = true
      } else {
        this.videowhite = true
        this.videoblue = false
      }
      if (clientSelected) {
        this.clientwhite = false
        this.clientblue = true
      } else {
        this.clientwhite = true
        this.clientblue = false
      }
      if (userSelected) {
        this.userwhite = false
        this.userblue = true
      } else {
        this.userwhite = true
        this.userblue = false
      }
      if (alarmSelected) {
        this.alarmwhite = false
        this.alarmblue = true
      } else {
        this.alarmwhite = true
        this.alarmblue = false
      }
      if (accountSelected) {
        this.accountwhite = false
        this.accountblue = true
      } else {
        this.accountwhite = true
        this.accountblue = false
      }
      if (setSelected) {
        this.setwhite = false
        this.setblue = true
      } else {
        this.setwhite = true
        this.setblue = false
      }
    },
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
.logoImg {
  float: left;
  margin-top: 12px;
}
.logoicon {
  width: 130px;
  height: 40px;
}
.name {
  float: left;
  color: #ffffff;
  font-size: 22px;
  margin-top: 15px;
}
.usermsg {
  float: right;
  margin-top: 10px;
  margin-right: 20px;
}
.onlineInfo {
  float: left;
  color:#ffffff;
  font-size: 14px;
  padding: 10px 20px 0 0;
}
.headerImgdiv {
  float: left;
  height: 30px;
  text-align: left;
  margin: 8px 5px 0 0;
}
.headerImg {
  height: 25px;
  width: 25px;
}
.alarmNum {
  width:22px;
  height:18px;
  background-color:red;
  float:left;
  z-index:999;
  margin:2px 20px 0 -15px;
  border-radius: 8px;
  color:#ffffff;
}
.menutext {
  padding-top: 20px;
  font-size: 16px;
  height: 90px;
}
.menuImg {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}
.el-header {
  background-color: #1f2326;
  border-bottom: 1px solid silver
}
.el-aside {
  background-color: #1f2326;
  color: #333;
  height: 100%;
  border-right: 1px solid silver
}
.el-main {
  /* background-color: #F1F1F1; */
  background-color: #D7DEE8;
  color: #333;
  padding: 0px;
}
.el-container {
  width: 100%;
  height: 100%;
}
.el-menu-aside {
  background-color: #1f2326;
}
.el-dropdown-item {
  border-bottom: solid 1px silver
}
.el-dialog__header {
  background-color: #409EFF;
}
</style>
