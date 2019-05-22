<template>
  <div class="UserAnalysisBase">
    <el-container>
      <el-header class="secondTab">
        <el-tabs v-model="user_activeName_second" @tab-click="handleClick">
            <!-- <el-tab-pane label="时间段分布" name="first">城市分布</el-tab-pane>
            <el-tab-pane label="功率区间" name="second">功率区间</el-tab-pane> -->
            <!-- <el-tab-pane label="充电记录" name="third">充电记录</el-tab-pane> -->
            <el-tab-pane label="充值记录" name="forth">充值记录</el-tab-pane>
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
      user_activeName_second: 'forth'
    }
  },
  created: function () {
    this.user_activeName_second = sessionGetStore('user_activeName_second')
    if (this.user_activeName_second === null) {
      this.user_activeName_second = 'forth'
    }
  },
  mounted: function () {
    console.log(this.user_activeName_second)
    this.handleActive()
  },
  methods: {
    handleClick: function (tab) {
      console.log(tab.index)
      if (tab.index === '0') {
        this.toRecharge()
      } else if (tab.index === '1') {
        this.toRecharge()
      } else if (tab.index === '2') {
        this.toCharging()
      } else if (tab.index === '3') {
        this.toRecharge()
      }
    },
    handleActive: function () {
      if (this.user_activeName_second === 'first') {
        this.toUserTimeInterrval()
      } else if (this.user_activeName_second === 'second') {
        this.toPower()
      } else if (this.user_activeName_second === 'third') {
        this.toCharging()
      } else if (this.user_activeName_second === 'forth') {
        this.toRecharge()
      }
    },
    toUserTimeInterrval: function () {
      this.user_activeName_second = 'first'
      sessionSetStore('user_activeName_second', this.user_activeName_second)
      Routers.push({ path: '/home/user/userAnalysis/userTimeInterrval' })
    },
    toPower: function () {
      this.user_activeName_second = 'second'
      sessionSetStore('user_activeName_second', this.user_activeName_second)
      Routers.push({ path: '/home/user/userAnalysis/powerAna' })
    },
    toCharging: function () {
      this.user_activeName_second = 'third'
      sessionSetStore('user_activeName_second', this.user_activeName_second)
      Routers.push({ path: '/home/user/userAnalysis/chargingRecord' })
    },
    toRecharge: function () {
      this.user_activeName_second = 'forth'
      sessionSetStore('user_activeName_second', this.user_activeName_second)
      Routers.push({ path: '/home/user/userAnalysis/rechargeRecord' })
    }
  }
}
</script>

<style>
.UserAnalysisBase {
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
