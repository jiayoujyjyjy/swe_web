<template>
  <div class="clientAnalysisBase">
    <el-container>
      <el-header class="secondTab">
        <el-tabs v-model="client_activeName_second" @tab-click="handleClick">
            <el-tab-pane label="城市分布" name="first">城市分布</el-tab-pane>
            <el-tab-pane label="收入正态分布" name="second">收入正态分布</el-tab-pane>
        </el-tabs>
      </el-header>
      <el-container>
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
      client_activeName_second: 'first'
    }
  },
  created: function () {
    this.client_activeName_second = sessionGetStore('client_activeName_second')
    if (this.client_activeName_second === null) {
      this.client_activeName_second = 'first'
    }
  },
  mounted: function () {
    this.handleActive()
  },
  methods: {
    handleClick: function (tab) {
      if (tab.index === '0') {
        this.toClientCity()
      } else if (tab.index === '1') {
        this.toIncome()
      }
    },
    handleActive: function () {
      if (this.client_activeName_second === 'first') {
        this.toClientCity()
      } else if (this.client_activeName_second === 'second') {
        this.toIncome()
      }
    },
    toClientCity: function () {
      this.client_activeName_second = 'first'
      sessionSetStore('client_activeName_second', this.client_activeName_second)
      Routers.push({ path: '/home/client/clientAnalysis/clientCityAna' })
    },
    toIncome: function () {
      this.client_activeName_second = 'second'
      sessionSetStore('client_activeName_second', this.client_activeName_second)
      Routers.push({ path: '/home/client/clientAnalysis/incomeAna' })
    }
  }
}
</script>

<style>
.el-container {
  background-color: #D7DEE8;
}
.clientAnalysisBase {
  width: 100%;
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
