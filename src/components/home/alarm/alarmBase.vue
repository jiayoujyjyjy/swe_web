<template>
  <div class="alarmbase">
    <el-container>
      <template>
        <el-header class="firstTab">
          <el-tabs v-model="alarm_activeName" @tab-click="handleClick">
              <el-tab-pane label="当前报警" name="first"></el-tab-pane>
              <el-tab-pane label="历史报警" name="second"></el-tab-pane>
              <!-- <el-tab-pane label="报警联系人" name="third"></el-tab-pane> -->
          </el-tabs>
        </el-header>
        <el-container class="alarmbasemain">
          <router-view></router-view>
        </el-container>
      </template>
    </el-container>
  </div>
</template>

<script>
import Routers from '@/router'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
export default {
  name: 'alarmBaseDiv',
  data () {
    return {
      // alarm_activeName: 'first'
    }
  },
  // vuex数据绑定
  computed: {
    alarm_activeName: {
      get: function () {
        return this.$store.state.alarmActiveName
      },
      set: function () {
      }
    }
  },
  // 生命周期钩子--创建期
  created: function () {
    var alarmActiveName = sessionGetStore('alarm_activeName')
    this.$store.commit('setAlarmActiveName', alarmActiveName)
  },
  mounted: function () {
  },
  methods: {
    handleClick: function (tab) {
      if (tab.index === '0') {
        this.toalarmNow()
      } else if (tab.index === '1') {
        this.toalarmHistory()
      } else if (tab.index === '2') {
        this.toalarmContact()
      }
    },
    toalarmNow: function () {
      this.alarm_activeName = 'first'
      sessionSetStore('alarm_activeName', this.alarm_activeName)
      Routers.push({ path: '/home/alarm/alarmNow' })
    },
    toalarmHistory: function () {
      this.alarm_activeName = 'second'
      sessionSetStore('alarm_activeName', this.alarm_activeName)
      Routers.push({ path: '/home/alarm/alarmHistory' })
    },
    toalarmContact: function () {
      this.alarm_activeName = 'third'
      sessionSetStore('alarm_activeName', this.alarm_activeName)
      Routers.push({ path: '/home/alarm/alarmContact' })
    }
  }
}
</script>

<style>
.alarmbase{
  overflow: hidden;
  height: 100%;
  padding: 0 10px 0 10px;
}
.el-container{
  width: 100%;
  height: 100%;
}
.alarmbasemain{
  bottom: 0;
  overflow: hidden;
  height: 90%;
  margin-top: 10px;
  background-color: #FFFFFD;
}
.firstTab{
  background-color: #FFFFFD;
  border-radius: 4px;
  height: 40.5px !important;
  box-shadow: 0 0 5px #FFFFFD;
}
</style>
