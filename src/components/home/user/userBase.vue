<template>
  <div class="userbase">
    <el-container>
      <template>
        <el-header class="firstTab">
          <el-tabs v-model="user_activeName" @tab-click="handleClick">
              <el-tab-pane label="用户列表" name="first"></el-tab-pane>
              <el-tab-pane label="用户分析" name="second"></el-tab-pane>
          </el-tabs>
        </el-header>
        <el-container class="userbasemain">
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
  name: 'userBaseDiv',
  data () {
    return {
      user_activeName: 'first'
    }
  },
  computed: {
  },
  // 生命周期钩子--创建期
  created: function () {
    this.user_activeName = sessionGetStore('user_activeName')
  },
  mounted: function () {
  },
  methods: {
    handleClick: function (tab) {
      if (tab.index === '0') {
        this.toUserList()
      } else if (tab.index === '1') {
        this.toUserAnalysis()
      }
    },
    toUserList: function () {
      this.user_activeName = 'first'
      sessionSetStore('user_activeName', this.user_activeName)
      Routers.push({ path: '/home/user/userList' })
    },
    toUserAnalysis: function () {
      this.user_activeName = 'second'
      sessionSetStore('user_activeName', this.user_activeName)
      Routers.push({ path: '/home/user/userAnalysis' })
    }
  }
}
</script>

<style>
.userbase{
  overflow: hidden;
  height: 100%;
  padding: 0 10px 0 10px;
}
.el-container{
  width: 100%;
  height: 100%;
}
.userbasemain{
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
