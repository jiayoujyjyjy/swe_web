<template>
  <div class="devAnalysisBase">
    <el-container>
      <el-header class="secondTab">
        <el-tabs v-model="device_activeName_second" @tab-click="handleClick">
            <el-tab-pane label="城市分布" name="first">城市分布</el-tab-pane>
            <el-tab-pane label="标签分析" name="second">标签分析</el-tab-pane>
        </el-tabs>
      </el-header>
      <el-container class="secondtabMain">
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Routers from '@/router'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
export default {
  data () {
    return {
      device_activeName_second: 'first'
    }
  },
  created: function () {
    this.device_activeName_second = sessionGetStore('device_activeName_second')
    if (this.device_activeName_second === null) {
      this.device_activeName_second = 'first'
    }
  },
  mounted: function () {
    this.handleActive()
  },
  methods: {
    handleClick: function (tab) {
      if (tab.index === '0') {
        this.toCity()
      } else if (tab.index === '1') {
        this.toTag()
      }
    },
    handleActive: function () {
      if (this.device_activeName_second === 'first') {
        this.toCity()
      } else if (this.device_activeName_second === 'second') {
        this.toTag()
      }
    },
    toCity: function () {
      this.device_activeName_second = 'first'
      sessionSetStore('device_activeName_second', this.device_activeName_second)
      Routers.push({ path: '/home/devmanage/deviceAnalysis/cityAna' })
    },
    toTag: function () {
      this.device_activeName_second = 'second'
      sessionSetStore('device_activeName_second', this.device_activeName_second)
      Routers.push({ path: '/home/devmanage/deviceAnalysis/tagAna' })
    }
  }
}
</script>

<style>
.devAnalysisBase {
  width: 100%;
}
.el-container {
  background-color: #D7DEE8;
}
.secondTab {
  background-color: #FFFFFD;
  border-radius: 4px;
  box-shadow: 0 0 5px #FFFFFD;
  height: 40.5px !important;
}
.secondtabMain {
  background-color: #FFFFFD;
  height: 90%;
  border-radius: 4px;
  box-shadow: 0 0 5px #FFFFFD;
}
.el-tabs__content {
  height: 0px;
}
.el-tabs__header{
  margin: 0px;
  color: #fff;
}
</style>
