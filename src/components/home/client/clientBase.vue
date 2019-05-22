<template>
  <div class="clientbase">
    <el-container>
      <template>
        <el-header class="firstTab">
          <el-tabs v-model="client_activeName" @tab-click="handleClick">
              <el-tab-pane label="客户列表" name="first"></el-tab-pane>
              <el-tab-pane label="客户分析" name="second"></el-tab-pane>
          </el-tabs>
        </el-header>
        <el-container class="clientbasemain">
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
  name: 'clientBaseDiv',
  data () {
    return {
      client_activeName: 'first'
    }
  },
  computed: {
  },
  // 生命周期钩子--创建期
  created: function () {
    this.client_activeName = sessionGetStore('client_activeName')
    console.log(this.client_activeName)
  },
  mounted: function () {
  },
  methods: {
    handleClick: function (tab) {
      if (tab.index === '0') {
        this.toClientList()
      } else if (tab.index === '1') {
        this.toClientAnalysis()
      }
    },
    toClientList: function () {
      this.client_activeName = 'first'
      sessionSetStore('client_activeName', this.client_activeName)
      Routers.push({ path: '/home/client/clientList' })
    },
    toClientAnalysis: function () {
      this.client_activeName = 'second'
      sessionSetStore('client_activeName', this.client_activeName)
      Routers.push({ path: '/home/client/clientAnalysis' })
    }
  }
}
</script>

<style>
.clientbase{
  overflow: hidden;
  height: 100%;
  padding: 0 10px 0 10px;
}
.el-container{
  width: 100%;
  height: 100%;
}
.clientbasemain{
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
