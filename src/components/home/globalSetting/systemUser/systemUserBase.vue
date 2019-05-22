<template>
  <div class="systemUserBase">
    <el-container>
      <el-header class="secondTab">
        <el-tabs v-model="systemUser_activeName_second" @tab-click="handleClick">
            <el-tab-pane label="角色列表" name="first">角色列表</el-tab-pane>
            <el-tab-pane label="管理员列表" name="second" :disabled="(userAuth !== '0')">管理员列表</el-tab-pane>
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
      systemUser_activeName_second: 'first',
      userAuth: ''
    }
  },
  created: function () {
    this.userAuth = sessionGetStore('role')
    this.systemUser_activeName_second = sessionGetStore('systemUser_activeName_second')
    if (this.systemUser_activeName_second === null) {
      this.systemUser_activeName_second = 'first'
    }
  },
  mounted: function () {
    this.handleActive()
  },
  methods: {
    handleClick: function (tab) {
      if (tab.index === '0') {
        this.toSystemUserRoles()
      } else if (tab.index === '1') {
        this.toSystemUserList()
      }
    },
    handleActive: function () {
      if (this.systemUser_activeName_second === 'first') {
        this.toSystemUserRoles()
      } else if (this.systemUser_activeName_second === 'second') {
        this.toSystemUserList()
      }
    },
    toSystemUserList: function () {
      this.systemUser_activeName_second = 'second'
      sessionSetStore('systemUser_activeName_second', this.systemUser_activeName_second)
      Routers.push({ path: '/home/globalSetting/systemUser/systemUserList' })
    },
    toSystemUserRoles: function () {
      this.systemUser_activeName_second = 'first'
      sessionSetStore('systemUser_activeName_second', this.systemUser_activeName_second)
      Routers.push({ path: '/home/globalSetting/systemUser/systemUserRoles' })
    }
  }
}
</script>

<style>
.systemUserBase {
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
