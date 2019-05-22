<template>
  <div class="accountbase">
    <!-- <div class="overView">
      <div class="accountOverView">
        <div class="classtext">今日总收益</div>
        <div class="classnum">10</div>
        <div class="classunit">万</div>
      </div>
      <div class="accountOverView">
        <div class="classtext">近七日总收益</div>
        <div class="classnum">80</div>
        <div class="classunit">万</div>
      </div>
      <div class="accountOverView">
        <div class="classtext">近一月总收益</div>
        <div class="classnum">200</div>
        <div class="classunit">万</div>
      </div>
    </div> -->
    <el-header class="firstTab">
      <el-tabs v-model="account_activeName" @tab-click="handleClick">
        <el-tab-pane label="收益列表" name="first"></el-tab-pane>
        <el-tab-pane label="订单列表" name="second"></el-tab-pane>
      </el-tabs>
    </el-header>
    <el-container class="accountbasemain">
      <router-view></router-view>
    </el-container>
  </div>
</template>

<script>
import Routers from '@/router'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
export default {
  name: 'accountBaseDiv',
  data () {
    return {
      account_activeName: 'first'
    }
  },
  computed: {
  },
  // 生命周期钩子--创建期
  created: function () {
    this.account_activeName = sessionGetStore('account_activeName')
  },
  mounted: function () {
  },
  methods: {
    handleClick: function (tab) {
      if (tab.index === '0') {
        this.toaccountList()
      } else if (tab.index === '1') {
        this.totradList()
      }
    },
    toaccountList: function () {
      this.account_activeName = 'first'
      sessionSetStore('account_activeName', this.account_activeName)
      Routers.push({ path: '/home/account/accountList' })
    },
    totradList: function () {
      this.account_activeName = 'second'
      sessionSetStore('account_activeName', this.account_activeName)
      Routers.push({ path: '/home/account/tradList' })
    }
  }
}
</script>

<style>
.accountbase{
  overflow: hidden;
  height: 100%;
  padding: 0 10px 0 10px;
}
.overView {
  background-color: #FFFFFD;
  border-radius: 4px;
  height: 80px !important;
  box-shadow: 0 0 5px #FFFFFD;
  margin: 10px 0;
}
.accountOverView {
  padding: 10px 20px;
  margin: 0 40px;
  float: left;
  width: 100px;
}
.classtext {
  font-size: 15px;
  color: #666666;
}
.classnum {
  font-size: 24px;
  float: left;
  margin: 10px 0 0 30px;
  color: #ff6600;
}
.classunit {
  font-size: 10px;
  float: left;
  margin-top: 20px;
  color: #ff6600;
}
.el-container{
  width: 100%;
  height: 100%;
}
.accountbasemain{
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
