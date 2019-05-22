<template>
  <div class="cameralistpage">
    <!--查询对应摄像头视频监控-->
    <el-row>
      <el-col>
        <div class="searchdiv">
          <p class="text">请选择摄像头</p>
          <el-autocomplete
            class="inline-input"
            v-model="cameraName"
            :fetch-suggestions="querySearchTitle"
            placeholder="请选择"
            @select="videQueBt"
            @keyup.enter.native="videQueBt">
          </el-autocomplete>
        </div>
      </el-col>
    </el-row>

    <div class="video-container">
      <video id="myPlayer" width="1151px" height="575px" poster controls playsInline webkit-playsinline autoplay>
        <source src="" type="rtmp/flv" />
      </video>
    </div>
    <div id="controlpanel">
      <img src="/static/panel1.png" id="panelimg">
    </div>
    <div id="iconpanel">
      <img src="/static/arrowicon.png" class="controlicon" v-on:click="panelVisible">
    </div>
    <div id="up" v-on:mousedown="turnup" v-on:mouseup="stopmove"></div>
    <div id="down" v-on:mousedown="turndown" v-on:mouseup="stopmove"></div>
    <div id="left" v-on:mousedown="turnleft" v-on:mouseup="stopmove"></div>
    <div id="right" v-on:mousedown="turnright" v-on:mouseup="stopmove"></div>
    <div id="mirror" v-on:click="mirrorBt"></div>
  </div>
</template>

<script type="text/javascript">
import EZUIPlayer from 'EZUIPlayer'
import { back } from 'api'
import $ from 'jquery'
import { sessionGetStore } from '@/components/config/Utils'
export default {
  name: 'playerDiv',
  data () {
    return {
      param: {
        'accessToken': '',
        'sn': '',
        'deviceSerial': '781802782',
        'expireTime': '',
        'userId': '',
        'channelNo': 1,
        'direction': 1, // 操作命令：0-上，1-下，2-左，3-右
        'speed': 1, // 云台速度：0-慢，1-适中，2-快
        'command': 2
      },
      liveAddress: '',
      cameraName: '',
      nameSearch: [],
      click: 0 // 面板显示标识，0为不显示，1为显示
    }
  },
  computed: {
    selectCamName () {
      return this.$store.state.selectCamName
    }
  },
  //
  // ***************生命周期****************
  //
  // 生命周期钩子--创建期
  created: function () {
    this.param.accessToken = sessionGetStore('accessToken')
    // this.param.sn = sessionGetStore('deviceSNNow')
    this.param.userId = sessionGetStore('userId')
  },
  // 生命周期，安装期
  mounted: function () {
    this.liveUrlQue()
    // this.backCameraInfoQue()
    $('#controlpanel').hide()
    $('up').hide()
    $('down').hide()
    $('left').hide()
    $('right').hide()
    $('mirror').hide()
    this.nameSearch = this.loadAllSearch()
  },
  //
  // ****************方法函数***********************
  //
  methods: {
    // 带建议的输入框
    querySearchTitle: function (queryString, cb) {
      var nameSearch = this.nameSearch
      var results = queryString ? nameSearch.filter(this.createFilterTitle(queryString)) : nameSearch
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilterTitle: function (queryString) {
      return (nameSearch) => {
        return (nameSearch.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAllSearch: function () {
      return [{
        value: 'C6H'
      }]
    },
    videQueBt: function () {
      console.log(this.cameraName)
    },
    // 点击事件判断
    panelVisible: function () {
      if (this.click === 0) {
        this.click = 1
      } else {
        this.click = 0
      }
      console.log(this.click)
      this.panelVisibleEvent()
    },
    // 云台控制-显示控制面板
    panelVisibleEvent: function () {
      if (this.click === 0) {
        $('#controlpanel').hide()
        $('up').hide()
        $('down').hide()
        $('left').hide()
        $('right').hide()
        $('mirror').hide()
      } else {
        $('#controlpanel').show()
        $('up').show()
        $('down').show()
        $('left').show()
        $('right').show()
        $('mirror').show()
      }
    },
    // 云台控制-上
    turnup: function () {
      this.param.direction = 0
      this.ptzStart()
      console.log('上')
    },
    // 云台控制-下
    turndown: function () {
      this.param.direction = 1
      this.ptzStart()
      console.log('下')
    },
    // 云台控制-左
    turnleft: function () {
      this.param.direction = 2
      this.ptzStart()
      console.log('左')
    },
    // 云台控制-右
    turnright: function () {
      this.param.direction = 3
      this.ptzStart()
      console.log('右')
    },
    // 云台控制-停止
    stopmove: function () {
      this.ptzStop()
    },
    // 镜像翻转
    mirrorBt: function () {
      console.log('镜像翻转操作')
      this.mirror()
    },
    video: function () {
      document.getElementById('myPlayer').src = this.liveAddress
      console.log('video')
      console.log(this.liveAddress)
      var player = new EZUIPlayer('myPlayer')
      player.on('error', function () {
        console.log('error')
      })
      player.on('play', function () {
        console.log('play')
      })
      player.on('pause', function () {
        console.log('pause')
      })
      console.log(document.getElementById('myPlayer'))
      // 云台控制
      // player.PTZCtrl(LONG cmd, LONG action, LONG speed);
    },
    //
    //  ************ API ****************
    //
    // 获取网关下摄像头信息
    backCameraInfoQue: function () {
      back.cameraInfoQue(this.param).then(function (response) {
        console.log(response)
        console.log('获取网关下摄像头信息')
        if (response.errno === 0) {
          for (let i = 0; i < response.data.length; i++) {
            if (response.data[i].deviceName === this.selectCamName) {
              this.param.deviceSerial = response.data[i].deviceSerial
              this.param.channelNo = response.data[i].channelNo
              console.log(this.param.deviceSerial)
              // this.liveUrlQue()
            }
          }
        } else if (response.errno === 1) {
          this.notificationInfo('错误提示', response.error)
        }
      }.bind(this))
    },
    // 获取视频设备的accessToken
    // 单独获取accessToken的一条api,在进行云台控制时如果accessToken过期根据后台返回错误信息重新请求获取新的accessToken
    accessTokenQue: function () {
      back.accessTokenQue(this.param).then(function (response) {
        console.log('密钥')
        console.log(response)
        if (response.errno === 0) {
          this.param.accessToken = response.data[0].accessToken
          this.param.expireTime = response.data[0].expireTime
        } else if (response.errno === 1) {
          this.notificationInfo('错误提示', response.error)
        }
      }.bind(this))
    },
    // // 获取rtmp直播地址
    // liveUrlQue: function () {
    //   back.liveAddressQue(this.param).then(function (response) {
    //     console.log('直播地址')
    //     console.log(response)
    //     if (response.errno === 0) {
    //       this.liveAddress = response.data[0].liveAddress
    //       this.param.accessToken = response.data[0].accessToken
    //       this.param.expireTime = response.data[0].expireTime
    //       this.video()
    //     } else if (response.errno === 1) {
    //       this.notificationInfo('错误提示', response.error)
    //     } else if (response.errno === 2) {
    //       this.notificationInfo('错误提示', response.error)
    //     }
    //   }.bind(this))
    // },
    // 开启云台控制
    ptzStart: function () {
      console.log(this.param)
      back.ptzStart(this.param).then(function (response) {
        console.log(response)
        console.log('开启云台控制')
        if (response.errno > 0) {
          this.notificationInfo('错误提示', response.error)
          // return
        }
      }.bind(this))
    },
    // 停止云台控制
    ptzStop: function () {
      console.log(this.param)
      back.ptzStop(this.param).then(function (response) {
        console.log(response)
        console.log('停止云台控制')
        if (response.errno > 0) {
          this.notificationInfo('错误提示', response.error)
          // return
        }
      })
    },
    // 镜像翻转
    mirror: function () {
      back.mirror(this.param).then(function (response) {
        console.log(response)
        console.log('镜像翻转')
        if (response.errno > 0) {
          this.notificationInfo('错误提示', response.error)
          // return
        }
      }.bind(this))
    },
    //
    //  ************ YApi ****************
    //
    // 获取rtmp直播地址
    liveUrlQue: function () {
      back.rtmpQue(this.param).then(function (response) {
        console.log('直播地址')
        console.log(response)
        this.liveAddress = response.data.showUrl
        this.video()
      }.bind(this))
    },
    // 可关闭式通知提示，titlePara为标题，messagePara为通知内容
    notificationInfo: function (titlePara, messagePara) {
      const h = this.$createElement
      this.$notify({
        title: titlePara,
        message: h('i', {style: 'color: teal'}, `${messagePara}`)
      })
    }
  }
}
</script>

<style scoped>
.cameralistpage{
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
}
.searchdiv {
  margin: 10px 0 20px 20px;
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.text {
  font-weight: bold;
  font-size: 15px;
  margin-right: 20px;
  margin-left: 20px;
}
.video-container{
  margin: 20px;
  position: absolute;
  top: 53px;
  bottom: 0;
  left: 10px;
  right: 10px;
}
#myPlayer {
  display: block;
}
#myPlayer embed {
  position: absolute;
  top:0;
  left: 0;
  width: 100%;
  height: 100%;
}
#controlpanel {
  position: absolute;
  bottom: 80px;
  right: 230px;
  width: 145px;
  height: 135px;
  opacity: 0.75;
  background: black;
  border-radius: 8px;
  overflow: auto;
}
.img{
  width: 25px;
  height: 25px;
  padding: 5px;
  margin: 5px;
}
#iconpanel{
  position: absolute;
  bottom: 65px;
  right: 100px;
  width: 30px;
  height: 30px;
  opacity: 0.75;
  background: black;
  border-radius: 4px;
  overflow: auto;
}
.controlicon{
  /* position: absolute;
  bottom: 50px;
  right: 100px; */
  width: 29px;
  height: 29px;
  vertical-align: middle;
  text-align:center;
  /* opacity: 0.75;
  background: black;
  border-radius: 4px;
  overflow: auto; */
}
#panelimg {
  height: 130px;
  width: 130px;
}
#up{
  position: absolute;
  bottom: 180px;
  right: 284px;
  width: 30px;
  height: 15px;
  background: black;
  opacity: 0;
}
#down{
  position: absolute;
  bottom: 110px;
  right: 283px;
  width: 30px;
  height: 15px;
  background: black;
  opacity: 0;
}
#left{
  position: absolute;
  bottom: 135px;
  right: 330px;
  width: 15px;
  height: 30px;
  background: black;
  opacity: 0;
}
#right{
  position: absolute;
  bottom: 135px;
  right: 255px;
  width: 15px;
  height: 30px;
  background: black;
  opacity: 0;
}
#mirror{
  position: absolute;
  bottom: 135px;
  right: 285px;
  width: 30px;
  height: 30px;
  background: black;
  opacity: 0;
}
</style>
