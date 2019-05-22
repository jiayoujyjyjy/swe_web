<template>
  <div class="globalsettingbase">
    <el-container>
      <template>
        <el-header class="firstTab">
          <el-tabs v-model="globalSetting_activeName" @tab-click="handleClick">
              <el-tab-pane label="管理员" name="first"></el-tab-pane>
              <el-tab-pane label="个人中心" name="second"></el-tab-pane>
          </el-tabs>
        </el-header>
        <el-container class="globalsettingbasemain">
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
  name: 'globalsettingbaseDiv',
  data () {
    return {
      globalSetting_activeName: 'first'
    }
  },
  computed: {
  },
  // 生命周期钩子--创建期
  created: function () {
    this.globalSetting_activeName = sessionGetStore('globalSetting_activeName')
    console.log(this.globalSetting_activeName)
  },
  mounted: function () {
    console.log(this.globalSetting_activeName)
  },
  methods: {
    handleClick: function (tab) {
      if (tab.index === '0') {
        this.toSystemUser()
      } else if (tab.index === '1') {
        this.toUserCenter()
      }
    },
    toSystemUser: function () {
      this.globalSetting_activeName = 'first'
      sessionSetStore('globalSetting_activeName', this.globalSetting_activeName)
      Routers.push({ path: '/home/globalSetting/systemUser' })
    },
    toUserCenter: function () {
      this.globalSetting_activeName = 'second'
      sessionSetStore('globalSetting_activeName', this.globalSetting_activeName)
      Routers.push({ path: '/home/globalSetting/systemUserCenter' })
    }
  }
}
</script>

<style>
.globalsettingbase{
  overflow: hidden;
  height: 100%;
  padding: 0 10px 0 10px;
}
.el-container{
  width: 100%;
  height: 100%;
}
.globalsettingbasemain{
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
