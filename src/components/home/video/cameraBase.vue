<template>
  <div class="camerabase">
    <el-container>
      <template>
        <el-header class="firstTab">
          <el-tabs v-model="camera_activeName" @tab-click="handleClick">
            <el-tab-pane label="视频列表" name="first"></el-tab-pane>
            <el-tab-pane label="视频播放" name="second"></el-tab-pane>
            <el-tab-pane label="账号配置" name="third"></el-tab-pane>
          </el-tabs>
        </el-header>
        <el-container class="camerabasemain">
          <router-view></router-view>
        </el-container>
      </template>
    </el-container>
  </div>
</template>

<script>
import Routers from '@/router'
// import { sessionSetStore } from '@/components/config/Utils'
export default {
  name: 'cameraBaseDiv',
  data () {
    return {
      // camera_activeName: 'first'
    }
  },
  computed: {
    camera_activeName: {
      get: function () {
        return this.$store.state.camActiveName
      },
      set: function () {
      }
    }
  },
  // 生命周期钩子--创建期
  created: function () {
    // this.camera_activeName = sessionGetStore('camera_activeName')
    // this.camera_activeName = this.$store.state.camActiveName
  },
  mounted: function () {
  },
  methods: {
    handleClick: function (tab) {
      if (tab.index === '0') {
        this.toCameraList()
      } else if (tab.index === '1') {
        this.toPlayer()
      } else if (tab.index === '2') {
        this.toCfg()
      }
    },
    toCameraList: function () {
      this.camera_activeName = 'first'
      // sessionSetStore('camera_activeName', this.camera_activeName)
      this.$store.commit('setCamActiveName', 'first')
      Routers.push({ path: '/home/video/cameraList' })
    },
    toPlayer: function () {
      this.camera_activeName = 'second'
      // sessionSetStore('camera_activeName', this.camera_activeName)
      this.$store.commit('setCamActiveName', 'second')
      Routers.push({ path: '/home/video/player' })
    },
    toCfg: function () {
      this.camera_activeName = 'third'
      // sessionSetStore('camera_activeName', this.camera_activeName)
      this.$store.commit('setCamActiveName', 'third')
      Routers.push({ path: '/home/video/ezvizCfg' })
    }
  }
}
</script>

<style>
.camerabase{
  overflow: hidden;
  height: 100%;
  padding: 0 10px 0 10px;
}
.el-container{
  width: 100%;
  height: 100%;
}
.camerabasemain{
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
