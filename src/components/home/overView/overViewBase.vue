<template>
  <div class="overviewbase">
    <el-container>
      <template>
        <el-header class="firstTab">
          <el-tabs v-model="overview_activeName" @tab-click="handleClick">
              <el-tab-pane label="设备概况" name="first"></el-tab-pane>
              <el-tab-pane label="用户概况" name="second"></el-tab-pane>
              <el-tab-pane label="客户概况" name="third"></el-tab-pane>
              <el-tab-pane label="资金概况" name="forth"></el-tab-pane>
          </el-tabs>
        </el-header>
        <el-container class="overviewbasemain">
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
  name: 'overviewBaseDiv',
  data () {
    return {
      overview_activeName: 'first'
    }
  },
  computed: {
  },
  // 生命周期钩子--创建期
  created: function () {
    this.overview_activeName = sessionGetStore('overview_activeName')
    console.log(this.overview_activeName)
  },
  mounted: function () {
  },
  methods: {
    handleClick: function (tab) {
      if (tab.index === '0') {
        this.todevice()
      } else if (tab.index === '1') {
        this.touser()
      } else if (tab.index === '2') {
        this.toclient()
      } else if (tab.index === '3') {
        this.toaccount()
      }
    },
    todevice: function () {
      this.overview_activeName = 'first'
      sessionSetStore('overview_activeName', this.overview_activeName)
      Routers.push({ path: '/home/overview/deviceOverview' })
    },
    touser: function () {
      this.overview_activeName = 'second'
      sessionSetStore('overview_activeName', this.overview_activeName)
      Routers.push({ path: '/home/overview/userOverview' })
    },
    toclient: function () {
      this.overview_activeName = 'third'
      sessionSetStore('overview_activeName', this.overview_activeName)
      Routers.push({ path: '/home/overview/clientOverview' })
    },
    toaccount: function () {
      this.overview_activeName = 'forth'
      sessionSetStore('overview_activeName', this.overview_activeName)
      Routers.push({ path: '/home/overview/accountOverview' })
    }
  }
}
</script>

<style>
.overviewbase{
  overflow: auto;
  height: 100%;
  padding: 0 10px 0 10px;
}
.el-container{
  width: 100%;
  height: 100%;
}
.overviewbasemain{
  bottom: 0;
  overflow: auto;
  height: 90%;
  margin-top: 10px;
  /* background-color: #FFFFFD; */
}
.firstTab{
  background-color: #FFFFFD;
  border-radius: 4px;
  height: 40.5px !important;
  box-shadow: 0 0 5px #FFFFFD;
}
</style>
