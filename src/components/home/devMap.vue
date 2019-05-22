<template>
  <el-container>
    <div id="mapPage">
      <div id="allmap" >
        <h3>地图显示</h3>
      </div>

      <div id="deviceListpanel">
        <div class="titleandclose"><span class="paneltitle">充电桩列表</span><span style="float: right; margin: 5px; cursor: default" v-on:click="closeListpanel">X</span></div>
        <div id="deviceList" style="height: 260px"></div>
      </div>

      <div id="deviceInfopanel">
        <div class="titleandclose"><span class="paneltitle">充电桩信息</span><span style="float: right; margin: 5px; cursor: default" v-on:click="closeInfopanel">X</span></div>
        <div id="deviceInfo" style="height: 260px"></div>
      </div>

      <div id="searchInput">
        <el-input
          placeholder="请输入设备编号"
          v-model="searchInput"
          @keyup.enter.native="serachDevice">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="serachDevice"></i>
        </el-input>
      </div>

    </div>
  </el-container>
</template>

<script type="text/javascript">
import BMap from 'BMap'
import $ from 'jquery'
import BMAP_ANIMATION_BOUNCE from 'BMAP_ANIMATION_BOUNCE'
import BMAP_ANCHOR_TOP_LEFT from 'BMAP_ANCHOR_TOP_LEFT'
// import { sessionGetStore } from '@/components/config/Utils'
import Routers from '@/router'
import Vue from 'vue'

export default {
  name: 'ZMapDiv',
  // 存入数据
  data () {
    return {
      point: [], // 存放标注点经纬度信息
      marker: [], // 存放标注点对象
      map: null,
      selectedHtml: '',
      overlapgroup: [], // 将经纬度相同的点存放在一个组里
      pointsimplify: [], // 存放删除了重复点的点数据
      clickEvent: 0, // 当前点击显示弹窗序号
      deviceListhtml: '',
      deviceInfohtml: '',
      searchInput: '',
      formerMarkerIndex: null,
      device: [{
        sn: '1001', // 必须是字符串类型，否则无法与搜索输入框的值匹配
        title: '孵化器园区B区1#',
        online: 1,
        onlineImg: '',
        points: [{
          lat: '29.3',
          lng: '120.3'
        }],
        address: '',
        type: '单路',
        tag: '',
        client: '',
        plugonline: 4,
        alarm: null
      }, {
        sn: '1002',
        title: '孵化器园区A区1#',
        online: 0,
        onlineImg: '',
        points: [{
          lat: '29.1',
          lng: '118.6'
        }],
        address: '',
        type: '单路',
        tag: '',
        client: '',
        plugonline: 4,
        alarm: null
      }, {
        sn: '1003',
        title: '孵化器园区B区1#',
        online: 1,
        onlineImg: '',
        points: [{
          lat: '31.1',
          lng: '113.9'
        }],
        address: '',
        type: '单路',
        tag: '',
        client: '',
        plugonline: 4,
        alarm: null
      }, {
        sn: '1004',
        title: '孵化器园区A区2#',
        online: 1,
        onlineImg: '',
        points: [{
          lat: '29.1',
          lng: '118.6'
        }],
        address: '',
        type: '单路',
        tag: '',
        client: '',
        plugonline: 4,
        alarm: null
      }]
    }
  },
  //
  // ***************生命周期****************
  //
  // 生命周期钩子--创建期
  created: function () {
    // var userId = sessionGetStore('userId')
    // console.log(userId)
    // this.param.userId = userId
  },
  // 生命周期--安装期
  mounted: function () {
    // 初始化先隐藏设备信息面板
    $('#deviceListpanel').hide()
    $('#deviceInfopanel').hide()
    this.dataprocessing()
  },
  beforeDestroy: function () {
    // 停止定时器
    // window.clearInterval(this.timerOnlineMap)
    // console.log('leave one')
  },
  //
  // ****************方法函数***********************
  //
  methods: {
    // 数据处理
    dataprocessing: function () {
      for (let i = 0; i < this.device.length; i++) {
        this.point[i] = new BMap.Point(this.device[i].points[0].lng, this.device[i].points[0].lat)
        this.device[i].points[0] = this.point[i]
        // 由坐标转换得到地理位置
        let geoc = new BMap.Geocoder()
        geoc.getLocation(this.point[i], function (rs) {
          var addComp = rs.addressComponents
          this.device[i].address = addComp.province + addComp.city
        }.bind(this))
        if (this.device[i].online === 1) {
          this.device[i].onlineImg = '/static/online.png'
        } else {
          this.device[i].onlineImg = '/static/outline.png'
        }
      }
      // 地图初始化
      this.mapinit()
      // 将经纬度相同的点存放在一个组里
      this.countmarkers()
    },
    // 地图初始化
    mapinit: function () {
      // 创建Map实例
      this.map = new BMap.Map('allmap')
      // 开启鼠标滚轮缩放
      this.map.enableScrollWheelZoom(true)
      // 左上角，添加比例尺
      var topleftcontrol = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT})
      this.map.addControl(topleftcontrol)
      // 左上角，添加默认缩放平移控件
      var topleftnavigation = new BMap.NavigationControl()
      this.map.addControl(topleftnavigation)// 添加平移缩放控件
      // 左上角添加城市列表控件
      this.map.addControl(new BMap.CityListControl({
        anchor: BMAP_ANCHOR_TOP_LEFT,
        offset: new BMap.Size(80, 60)
      }))
      // 调用方法，根据所有设备点的位置设置最优的中心点和缩放级别
      this.setCenterandZoom()
      // this.map.centerAndZoom(new BMap.Point(103.388611, 35.563611), 5)
      // 添加刷新页面图标及功能
      function Refresh () {
        this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT
        this.defaultOffset = new BMap.Size(90, 90)
      }
      Refresh.prototype = new BMap.Control()
      Refresh.prototype.initialize = function (map) {
        var ref = document.createElement('input')
        document.body.appendChild(ref)
        ref.type = 'image'
        ref.src = '/static/refresh.png'
        ref.style = 'height: 35px; width: 35px'
        ref.onclick = function (e) {
          Routers.push({ path: '/home/blank' })
        }
        map.getContainer().appendChild(ref)
        return ref
      }
      if (navigator.userAgent.indexOf('Chrome') !== -1) {
        var myrefresh = new Refresh()
        this.map.addControl(myrefresh)
      }
      // 设置版权标识
      // var cr = new BMap.CopyrightControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT})
      // this.map.addControl(cr)
      // var bs = this.map.getBounds()
      // cr.addCopyright({id: 1, content: '<img src="/static/logo.png" height=40px width=100px/>', bounds: bs})
    },
    // 添加标注点和信息面板，根据设备在线状况添加不同的标注点
    addmarkerandInfo: function () {
      this.map.clearOverlays()
      // 简化添加标注点和标签
      for (let i = 0; i < this.overlapgroup.length; i++) {
      // 按重叠分组的第一个点添加标注
        if (!this.overlapgroup[i][0].online) {
          var myIcon = new BMap.Icon('/static/offline.png', new BMap.Size(32, 32))
          this.marker[i] = new BMap.Marker(this.overlapgroup[i][0].points[0], {icon: myIcon})
        } else {
          this.marker[i] = new BMap.Marker(this.overlapgroup[i][0].points[0])
        }
        this.map.addOverlay(this.marker[i])
        // 添加标注点重叠数量标签
        var label = new BMap.Label(this.overlapgroup[i].length, {offset: new BMap.Size(20, -10)})
        this.marker[i].setLabel(label)
        this.marker[i].addEventListener('click', function () {
          // 获取点击的标注点序号
          this.clickEvent = i
          this.deviceListhtml = ''
          let overlapgroupcopy = this.overlapgroup
          document.getElementById('deviceList').innerHTML = this.deviceListhtml
          for (let k = 0; k < this.overlapgroup[i].length; k++) {
            var MyComponent = Vue.extend({
              template: '<div class="class2"><span class="class1">' + this.overlapgroup[i][k].title +
              '</span><span style="width:20px;float:right;margin:5px 15px 5px 5px;cursor:default" v-on:click="todevice()">>></span></div>',
              methods: {
                todevice: function () {
                  console.log(overlapgroupcopy)
                  $('#deviceListpanel').hide()
                  this.deviceInfohtml = ''
                  document.getElementById('deviceInfo').innerHTML = this.deviceInfohtml
                  console.log(i, k)
                  var MyComponent = Vue.extend({
                    template: '<div class="class2"><span>名称：</span><span>' + overlapgroupcopy[i][k].sn +
                    '</span></div>',
                    methods: {
                      todev: function () {
                        Routers.push({ path: '/home/blank' })
                      }
                    }
                  })
                  var component = new MyComponent().$mount()
                  document.getElementById('deviceInfo').appendChild(component.$el)
                  $('#deviceInfopanel').show()
                }
              }
            })
            var component = new MyComponent().$mount()
            document.getElementById('deviceList').appendChild(component.$el)
            $('#deviceListpanel').show()
          }
        }.bind(this))
      }
    },
    // 根据原始数据计算中心坐标和缩放级别，并为地图设置中心坐标和缩放级别
    setCenterandZoom: function () {
      // console.log(this.point.length + 'res')
      if (this.point.length > 0) {
        let maxLon = this.point[0].lng
        let minLon = this.point[0].lng
        let maxLat = this.point[0].lat
        let minLat = this.point[0].lat
        let res
        for (let i = 0; i < this.point.length; i++) {
          res = this.point[i]
          if (res.lng > maxLon) maxLon = res.lng
          if (res.lng < minLon) minLon = res.lng
          if (res.lat > maxLat) maxLat = res.lat
          if (res.lat < minLat) minLat = res.lat
        }
        let cenLon = (parseFloat(maxLon) + parseFloat(minLon)) / 2
        let cenLat = (parseFloat(maxLat) + parseFloat(minLat)) / 2
        let zoom = this.getZoom(maxLon, minLon, maxLat, minLat)
        this.map.centerAndZoom(new BMap.Point(cenLon, cenLat), zoom)
      } else {
        this.map.centerAndZoom(new BMap.Point(103.388611, 35.563611), 5)
      }
    },
    // 根据经纬极值计算缩放级别
    getZoom: function (maxLon, minLon, maxLat, minLat) {
      let zoom = ['50', '100', '200', '500', '1000', '2000', '5000', '10000', '20000', '25000', '50000', '100000', '200000', '500000', '1000000', '2000000']
      let pointA = new BMap.Point(maxLon, maxLat)
      let pointB = new BMap.Point(minLon, minLat)
      let distance = this.map.getDistance(pointA, pointB).toFixed(1)
      for (let i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
        if (zoom[i] - distance > 0) {
          return 18 - i + 3
        }
      }
      return 5
    },
    // 关闭设备信息面板
    closeListpanel: function () {
      $('#deviceListpanel').hide()
    },
    closeInfopanel: function () {
      $('#deviceInfopanel').hide()
    },
    // 将经纬度相同的点存放在一个组里
    countmarkers: function () {
      this.pointsimplify = []
      for (let i = 0; i < this.point.length; i++) {
        this.pointsimplify.push(this.point[i])
      }
      for (let i = 0; i < this.pointsimplify.length; i++) {
        let group = []
        if (this.pointsimplify[i] === undefined) {
          continue
        }
        for (let j = i; j < this.pointsimplify.length; j++) {
          if (this.pointsimplify[j] === undefined) {
            continue
          }
          if (this.pointsimplify[i].lng === this.pointsimplify[j].lng && this.pointsimplify[i].lat === this.pointsimplify[j].lat) {
            group.push(this.device[j])
            // 防止i与j相等时，删除数组中第j个数据时也删除了第i个数据，导致继续进行循环时找不到第i个数据出错
            if (i !== j) {
              delete this.pointsimplify[j]
            }
          }
        }
        this.overlapgroup.push(group)
      }
      this.addmarkerandInfo()
    },
    serachDevice: async function () {
      console.log(this.searchInput)
      for (let i = 0; i < this.overlapgroup.length; i++) {
        for (let j = 0; j < this.overlapgroup[i].length; j++) {
          if (this.searchInput === this.overlapgroup[i][j].sn) {
            this.devicehtml = '<div class="class2"><span class="class1" style="width:90px">编号</span><span class="class1" style="width:90px">名称</span>' +
            '<span class="class1" style="width:90px">ID</span><span class="class1" style="width:90px">状态</span><span class="class1" style="width:90px">地址</span>' +
            '<span class="class1" style="width:20px"></span></div>'
            document.getElementById('deviceinfo').innerHTML = this.devicehtml
            for (let k = 0; k < this.overlapgroup[i].length; k++) {
              var MyComponent = Vue.extend({
                template: '<div></br></br><div class="class2"><span class="class1" style="width:90px">' + k + '</span><span class="class1" style="width:90px">' + this.overlapgroup[i][k].title +
                '</span><span class="class1" style="width:90px">' + this.overlapgroup[i][k].devId + '</span><span class="class1" style="width:90px"><img src=' + this.overlapgroup[i][k].onlineImg + '></span>' +
                '<span class="class1" style="width:90px">' + this.overlapgroup[i][k].address + '</span><span style="width:20px;float:right;margin:5px;cursor:default" v-on:click="todevice()">>></span></div></div>',
                methods: {
                  todevice: function () {
                    Routers.push({ path: '/home/blankToDevice' })
                  }
                }
              })
              if (this.formerMarkerIndex !== null) {
                this.marker[this.formerMarkerIndex].setAnimation(null)
              }
              var component = new MyComponent().$mount()
              document.getElementById('deviceinfo').appendChild(component.$el)
              $('#devicepanel').show()
              this.map.centerAndZoom(new BMap.Point(this.overlapgroup[i][j].points[0].lng, this.overlapgroup[i][j].points[0].lat), 9)
              this.marker[i].setAnimation(BMAP_ANIMATION_BOUNCE)
              this.formerMarkerIndex = i
            }
          }
        }
      }
    }
  }
}
</script>

<style>
  #mapPage {
    width: 100%;
    height: 100%;
    /*margin: 2px;*/
  }
  #allmap {
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family:"微软雅黑";
    position: relative;
  }
  /* 去除百度标识 */
  .anchorBL {
    display:none
  }
  .map {
    padding:0;
    margin:0;
  }
  .h3 {
    padding:0;
    margin:0;
  }
  #deviceListpanel {
    position: absolute;
    font-size: 15px;
    top: 60px;
    right: 20px;
    color: white;
    width: 350px;
    height:400px;
    opacity: 0.75;
    background: black;
    margin: 5px;
    border-radius: 5px;
    overflow: auto;
  }
  #deviceInfopanel {
    position: absolute;
    font-size: 15px;
    top: 60px;
    right: 20px;
    color: white;
    width: 350px;
    height:400px;
    opacity: 0.75;
    background: black;
    margin: 5px;
    border-radius: 5px;
    overflow: auto;
  }
  #searchInput {
    position: absolute;
    top: 80px;
    left: 360px;
    width:150px;
    border-radius: 10px;
  }
  .devInfo {
    float: left;
    margin: 10px
  }
  .paneltitle {
    font-size: 18px;
  }
  .titleandclose {
    margin-top: 10px;
    margin-bottom: 10px
  }
  .class1 {
    width:250px;
  }
  .class2 {
    margin: 20px 0 0 20px;
    text-align:left;
  }
</style>
