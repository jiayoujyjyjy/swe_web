<template>
  <div class="devmanagebase">
    <el-container>
      <template>
        <el-header class="firstTab">
          <el-tabs v-model="device_activeName" @tab-click="handleClick">
              <el-tab-pane label="充电桩列表" name="first"></el-tab-pane>
              <el-tab-pane label="统计分析" name="second"></el-tab-pane>
              <el-tab-pane label="功率曲线" name="third"></el-tab-pane>
          </el-tabs>
        </el-header>
        <el-container class="devmanagebasemain">
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
  name: 'devManageBaseDiv',
  data () {
    return {
      device_activeName: 'first'
    }
  },
  computed: {
  },
  // 生命周期钩子--创建期
  created: function () {
    this.device_activeName = sessionGetStore('device_activeName')
  },
  mounted: function () {
  },
  methods: {
    handleClick: function (tab) {
      if (tab.index === '0') {
        this.toDeviceList()
      } else if (tab.index === '1') {
        this.toDeviceAnalysis()
      } else {
        this.toDatachart()
      }
    },
    toDeviceList: function () {
      this.device_activeName = 'first'
      sessionSetStore('device_activeName', this.device_activeName)
      Routers.push({ path: '/home/devmanage/deviceList' })
    },
    toDeviceAnalysis: function () {
      this.device_activeName = 'second'
      sessionSetStore('device_activeName', this.device_activeName)
      Routers.push({ path: '/home/devmanage/deviceAnalysis' })
    },
    toDatachart: function () {
      this.device_activeName = 'third'
      sessionSetStore('device_activeName', this.device_activeName)
      Routers.push({ path: '/home/devmanage/datachart' })
    }
  }
}
</script>

<style>
.devmanagebase{
  overflow: hidden;
  height: 100%;
  padding: 0 10px 0 10px;
}
.el-container{
  width: 100%;
  height: 100%;
}
.devmanagebasemain{
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
