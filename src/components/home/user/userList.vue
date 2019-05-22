<template>
  <el-container>
    <el-main>

      <!--根据手机号查询用户信息-->
      <el-row>
        <el-col>
          <div class="searchdiv">
            <el-input v-model="input" placeholder="请输入用户手机号" @keyup.enter.native="userQueBt" style="margin-right:20px;width:200px;"></el-input>
            <el-button type="primary" size="medium" @click="userQueBt">用户查询</el-button>
            <el-button type="primary" size="medium" @click="queAllBt">查找全部</el-button>
          </div>
        </el-col>
      </el-row>

      <p></p>

      <!-- 客户表格 -->
      <el-table
        :data="userTable"
        style="width: 100%"
        max-height = "570">
        <el-table-column
          label="序号"
          header-align="center"
          min-width="10%">
          <template slot-scope="scope">
            {{ userTabNUm + scope.$index }}
          </template>
        </el-table-column>
        <el-table-column
          prop="gmtCreate"
          label="注册时间"
          header-align="center"
          min-width="10%">
        </el-table-column>
        <el-table-column
          prop="nickName"
          label="昵称"
          header-align="center"
          min-width="10%">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系方式"
          header-align="center"
          min-width="15%">
        </el-table-column>
        <el-table-column
          prop="balance"
          label="余额"
          header-align="center"
          min-width="10%">
        </el-table-column>
        <el-table-column
          prop="chargingRecord"
          label="充电记录"
          header-align="center"
          min-width="10%">
          <template slot-scope="scope">
            <el-button type="text" @click="chargingRecordBt(scope.$index)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="rechargeRocord"
          label="充值记录"
          header-align="center"
          min-width="10%">
          <template slot-scope="scope">
            <el-button type="text" @click="rechargeRecordBt(scope.$index)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="station"
          label="常用电站"
          header-align="center"
          min-width="10%">
          <template slot-scope="scope">
            <el-button type="text" @click="stationBt(scope.$index)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-footer class="paginationfooter" height="60px">
        <div class="block">
          <el-pagination
            @current-change="handlePaginationChange"
            :current-page="param.currentPage"
            :page-size="param.pagesize"
            layout="total, prev, pager, next, jumper"
            :total="eltotal">
          </el-pagination>
        </div>
      </el-footer>

    </el-main>

    <!--充电记录对话框-->
    <el-dialog title="充电记录" width="850px" top="10vh" :visible.sync="dialogChargingVisible" center>
      <div>
        <el-table
          :data="chargingTabData"
          style="width: 100%"
          max-height="600"
          >
          <el-table-column
            label="序号"
            header-align="center"
            align="center"
            min-width="5%">
            <template slot-scope="scope">
              {{diaChargingTabNum + scope.$index}}
            </template>
          </el-table-column>
          <el-table-column
            prop="station"
            label="充电桩"
            header-align="center"
            align="center"
            min-width="20%">
          </el-table-column>
          <el-table-column
            prop="sockId"
            label="插座"
            header-align="center"
            align="center"
            min-width="6%">
          </el-table-column>
          <el-table-column
            prop="date"
            label="日期"
            header-align="center"
            align="center"
            min-width="25%">
          </el-table-column>
          <el-table-column
            prop="duration"
            label="时长"
            header-align="center"
            align="center"
            min-width="6%">
          </el-table-column>
          <el-table-column
            prop="power"
            label="功率"
            header-align="center"
            align="center"
            min-width="6%">
          </el-table-column>
          <el-table-column
            prop="sum"
            label="金额"
            header-align="center"
            align="center"
            min-width="6%">
          </el-table-column>
          <el-table-column
            label="查看曲线"
            header-align="center"
            align="center"
            min-width="12%">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-d-arrow-right" @click="tocharts(scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block" style="margin-top:15px;">
        <el-pagination
          @current-change="handlePaginationChange_DiaCha"
          :current-page="param.currentPage_DiaCha"
          :page-size="param.pagesize_DiaCha"
          layout="total, prev, pager, next, jumper"
          :total="eltotal_DiaCha">
        </el-pagination>
      </div>
    </el-dialog>

    <!--充值记录对话框-->
    <el-dialog title="充值记录" width="700px" top="10vh" :visible.sync="dialogRechargeVisible" center>
      <div>
        <el-table
          :data="rechargeTabData"
          style="width: 100%"
          max-height="450"
          >
          <el-table-column
            label="序号"
            header-align="center"
            align="center"
            min-width="15%">
            <template slot-scope="scope">
              {{rechargeTabNum + scope.$index}}
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            label="日期"
            header-align="center"
            align="center"
            min-width="30%">
          </el-table-column>
          <el-table-column
            prop="traId"
            label="交易单号"
            header-align="center"
            align="center"
            min-width="40%">
          </el-table-column>
          <el-table-column
            prop="amount"
            label="金额"
            header-align="center"
            align="center"
            min-width="15%">
          </el-table-column>
        </el-table>
      </div>
      <div class="block" style="margin-top:15px;">
        <el-pagination
          @current-change="handlePaginationChange_DiaRe"
          :current-page="param.currentPage_DiaRe"
          :page-size="param.pagesize_DiaRe"
          layout="total, prev, pager, next, jumper"
          :total="eltotal_DiaRe">
        </el-pagination>
      </div>
    </el-dialog>

    <!--常用电站对话框，默认五条-->
    <el-dialog title="常用电站" width="700px" top="10vh" :visible.sync="dialogStationVisible" center>
      <div>
        <el-table
          :data="station"
          style="width: 100%"
          max-height="430"
          >
          <el-table-column
            label="序号"
            header-align="center"
            align="center"
            min-width="20%">
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="station"
            label="充电桩"
            header-align="center"
            align="center"
            min-width="40%">
          </el-table-column>
          <el-table-column
            prop="frequency"
            label="频次"
            header-align="center"
            align="center"
            min-width="20%">
          </el-table-column>
        </el-table>
      </div>
      <div id="devmap">map</div>
    </el-dialog>

  </el-container>
</template>

<script>
import { back } from 'api'
import BMap from 'BMap'
import BMAP_ANCHOR_TOP_LEFT from 'BMAP_ANCHOR_TOP_LEFT'
import Routers from '@/router'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
export default {
  data () {
    return {
      param: {
        'uid': '',
        'userId': 0,
        'Authorization': '',
        'mobile': '',
        'currentPage': 1,
        'pagesize': 8,
        'currentPage_DiaRe': 1, // 充值记录对话框当前页
        'pagesize_DiaRe': 8,
        'currentPage_DiaCha': 1, // 充电记录对话框当前页
        'pagesize_DiaCha': 8,
        'sn': ''
      },
      map: null,
      lon: '116.404',
      lat: '39.915',
      input: '',
      dialogChargingVisible: false,
      dialogRechargeVisible: false,
      dialogStationVisible: false,
      eltotal: 0, // 分页器中的记录总数
      eltotal_DiaCha: 0, // 分页器中的记录总数
      eltotal_DiaRe: 0, // 分页器中的记录总数
      rechargeTabData: [{
        date: '03-08 09:03',
        amount: '10',
        traId: '523JW9TNY5DR3F17'
      }], // 充值记录对话框表格数据
      userTabNUm: 1, // 用来计算客户列表表格顺序
      diaChargingTabNum: 1, // 用来计算充电记录对话框表格序号
      rechargeTabNum: 1, // 用来计算充值记录对话框表格序号
      userTable: null,
      chargingTabData: [{
        station: '高科技企业孵化园区A#1',
        date: '05-23 08:59',
        duration: '432分钟',
        power: '107W',
        sum: '2.46' // 金额
      }],
      station: [{
        station: '高科技企业孵化园区A#1',
        plug: '8',
        frequency: '12',
        lon: '120.380469',
        lat: '30.315774',
        online: 0,
        onlineImg: '',
        points: null
      }],
      user: [{
        uid: '',
        nickName: '昵称1',
        phone: '15957123064',
        balance: '20',
        gmtCreate: ''
      }],
      marker: [],
      point: [],
      overlapgroup: []
    }
  },
  created: function () {
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.backUserListQue()
  },
  mounted: function () {
  },
  methods: {
    userQueBt: function () {
      if (this.input === '') {
        this.queAllBt()
        return
      }
      this.param.currentPage = 1 // 防止查另一个用户分页设置为2，相当于复位操作
      this.param.mobile = this.input
      this.input = ''
      this.backUserSearch()
    },
    // 查询所有信息对话框,默认回到第一页
    queAllBt: function () {
      this.input = ''
      this.param.currentPage = 1
      this.backUserListQue()
    },
    // 充电记录详情
    chargingRecordBt: function (index) {
      this.param.uid = this.userTable[index].uid
      this.backUserChargingQue()
      this.dialogChargingVisible = true
    },
    // 查看充电记录对应的充电曲线
    tocharts: function (index) {
      console.log(this.chargingTabData[index])
      let datastreamId = this.chargingTabData[index].sockId + '00'
      // 开始时间
      let startTime = this.chargingTabData[index].date.replace(/\s/, 'T')
      console.log(startTime)
      // 根据充电时长计算结束时间
      let timestart = new Date(startTime).getTime()
      let timeEnd = timestart + this.chargingTabData[index].duration * 60 * 1000
      let date = new Date(timeEnd)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = date.getDate() + 'T'
      let h = date.getHours() + ':'
      let m = date.getMinutes() + ':'
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      let endTime = Y + M + D + h + m + s
      console.log(endTime)
      // 存储数据，跳转到充电曲线页面的时候调用
      sessionSetStore('CRApiKey', this.chargingTabData[index].apiKey)
      sessionSetStore('CRDeviceId', this.chargingTabData[index].deviceId)
      sessionSetStore('CRDatastreamId', datastreamId)
      sessionSetStore('CRStartTime', startTime)
      sessionSetStore('CREndTime', endTime)
      sessionSetStore('device_activeName', 'third')
      Routers.push({ path: '/home/devmanage/datachart' })
    },
    // 充值记录详情
    rechargeRecordBt: function (index) {
      this.param.uid = this.userTable[index].uid
      this.backUserRechargeQue()
      this.dialogRechargeVisible = true
    },
    // 常用电站详情
    stationBt: function (index) {
      this.param.uid = this.userTable[index].uid
      this.backUserStationsQue()
      this.dialogStationVisible = true
    },
    // 用户列表换页
    handlePaginationChange: function (value) {
      console.log(value)
      this.userTabNUm = this.param.pagesize * (value - 1) + 1
      this.param.currentPage = value
      this.backUserListQue()
    },
    /*
    *
    *   ******** 对话框操作 ********
    *
    */
    // 充电记录列表对话框分页器
    handlePaginationChange_DiaCha: function (value) {
      this.diaChargingTabNum = this.param.pagesize_DiaCha * (value - 1) + 1
      this.param.currentPage_DiaCha = value
      this.backUserChargingQue()
    },
    // 充值记录对话框分页器
    handlePaginationChange_DiaRe: function (value) {
      this.rechargeTabNum = this.param.pagesize_DiaRe * (value - 1) + 1
      this.param.currentPage_DiaRe = value
      this.backUserRechargeQue()
    },
    /*
    *
    *   ******** 地图 ********
    *
    */
    // 数据处理
    dataprocessing: function () {
      this.point = []
      for (let i = 0; i < this.station.length; i++) {
        this.point[i] = new BMap.Point(this.station[i].lon, this.station[i].lat)
        this.station[i].points = this.point[i]
        if (this.station[i].online === 0) {
          this.station[i].onlineImg = '/static/online.png'
        } else {
          this.station[i].onlineImg = '/static/outline.png'
        }
      }
      // 地图初始化
      this.mapinit()
    },
    // 地图加载
    mapinit: function () {
      // 创建Map实例
      this.map = new BMap.Map('devmap')
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
      // 将经纬度相同的点存放在一个组里
      this.countmarkers()
    },
    // 将经纬度相同的点存放在一个组里
    countmarkers: function () {
      this.overlapgroup = []
      let pointsimplify = []
      for (let i = 0; i < this.point.length; i++) {
        pointsimplify.push(this.point[i])
      }
      for (let i = 0; i < pointsimplify.length; i++) {
        let group = []
        if (pointsimplify[i] === undefined) {
          continue
        }
        for (let j = i; j < pointsimplify.length; j++) {
          if (pointsimplify[j] === undefined) {
            continue
          }
          if (pointsimplify[i].lng === pointsimplify[j].lng && pointsimplify[i].lat === pointsimplify[j].lat) {
            group.push(this.station[j])
            // 防止i与j相等时，删除数组中第j个数据时也删除了第i个数据，导致继续进行循环时找不到第i个数据出错
            if (i !== j) {
              delete pointsimplify[j]
            }
          }
        }
        this.overlapgroup.push(group)
      }
      console.log(this.overlapgroup)
      this.addmarkerandInfo()
    },
    // 添加标注点和信息面板
    addmarkerandInfo: function () {
      // 标注点信息窗口显示信息
      var msg = []
      this.map.clearOverlays()
      // 简化添加标注点和标签
      for (let i = 0; i < this.overlapgroup.length; i++) {
        // 按重叠分组的第一个点添加标注
        if (this.overlapgroup[i][0].online) {
          var myIcon = new BMap.Icon('/static/offline.png', new BMap.Size(32, 32))
          this.marker[i] = new BMap.Marker(this.overlapgroup[i][0].points, {icon: myIcon})
        } else {
          this.marker[i] = new BMap.Marker(this.overlapgroup[i][0].points)
        }
        this.map.addOverlay(this.marker[i])
        // 添加标注点重叠数量标签
        var label = new BMap.Label(this.overlapgroup[i].length, {offset: new BMap.Size(20, -10)})
        this.marker[i].setLabel(label)
        // 添加信息窗口,这个窗口大小有最小值限制，小于官方的最小值就不能再小了
        var opts = {
          width: 100,
          height: 30,
          title: '',
          enableMessage: true,
          message: ''
        }
        var stationlist = ''
        for (let j = 0; j < this.overlapgroup[i].length; j++) {
          stationlist = stationlist + ' ' + this.overlapgroup[i][j].station
        }
        msg[i] = stationlist
        this.marker[i].addEventListener('click', function () {
          var infoWindow = new BMap.InfoWindow(msg[i], opts)
          this.map.openInfoWindow(infoWindow, this.overlapgroup[i][0].points)
        }.bind(this))
      }
    },
    // 根据原始数据计算中心坐标和缩放级别，并为地图设置中心坐标和缩放级别
    setCenterandZoom: function () {
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
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 分页获取微信用户列表
    backUserListQue: function () {
      back.userListQue(this.param).then(function (response) {
        console.log(response)
        console.log('微信用户信息')
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.eltotal = response.data.total
        this.userTable = []
        for (let i = 0; i < response.data.record.length; i++) {
          let obj = {}
          obj.uid = response.data.record[i].uid
          obj.nickName = response.data.record[i].nickName
          obj.phone = response.data.record[i].mobile
          obj.balance = response.data.record[i].balance
          obj.gmtCreate = response.data.record[i].gmtCreate
          this.userTable.push(obj)
        }
      }.bind(this))
    },
    // 搜索用户
    backUserSearch: function () {
      back.userSearch(this.param).then(function (response) {
        console.log(response)
        console.log('搜索用户')
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.eltotal = response.data.total
        this.userTable = []
        for (let i = 0; i < response.data.record.length; i++) {
          let obj = {}
          obj.uid = response.data.record[i].uid
          obj.nickName = response.data.record[i].nickName
          obj.phone = response.data.record[i].mobile
          obj.balance = response.data.record[i].balance
          obj.gmtCreate = response.data.record[i].gmtCreate
          this.userTable.push(obj)
        }
      }.bind(this))
    },
    // 分页获取微信用户充值记录
    backUserRechargeQue: function () {
      back.userRechargeQue(this.param).then(function (response) {
        console.log(response)
        console.log('微信用户充值记录')
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.eltotal_DiaRe = response.data.total
        if (response.data.record) {
          this.rechargeTabData = []
          for (let i = 0; i < response.data.record.length; i++) {
            let obj = {}
            obj.date = response.data.record[i].time
            obj.amount = response.data.record[i].money
            obj.traId = response.data.record[i].tradeNo
            this.rechargeTabData.push(obj)
          }
        } else {
          this.rechargeTabData = []
        }
      }.bind(this))
    },
    // 分页获取微信用户充电记录
    backUserChargingQue: function () {
      back.userChargingQue(this.param).then(function (response) {
        console.log(response)
        console.log('微信用户充电记录')
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.eltotal_DiaCha = response.data.total
        this.chargingTabData = []
        for (let i = 0; i < response.data.record.length; i++) {
          let obj = {}
          obj.date = response.data.record[i].time
          obj.station = response.data.record[i].name
          obj.duration = response.data.record[i].duration
          obj.power = response.data.record[i].power
          obj.sum = response.data.record[i].cost
          obj.sockId = response.data.record[i].sockId
          obj.sn = response.data.record[i].sn
          obj.apiKey = response.data.record[i].apiKey
          obj.deviceId = response.data.record[i].deviceId
          this.chargingTabData.push(obj)
        }
      }.bind(this))
    },
    // 常用电站
    backUserStationsQue: function () {
      back.userStationsQue(this.param).then(function (response) {
        console.log(response)
        console.log('微信用户常用电站')
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.station = []
        if (response.data) {
          for (let i = 0; i < response.data.length; i++) {
            let obj = {}
            obj.station = response.data[i].name
            // obj.plug = response.data[i].plug
            obj.frequency = response.data[i].total
            obj.lon = response.data[i].latitude.lon
            obj.lat = response.data[i].latitude.lat
            obj.online = response.data[i].state
            obj.onlineImg = ''
            obj.points = null
            this.station.push(obj)
          }
        }
        console.log(this.station)
        this.dataprocessing()
      }.bind(this))
    },
    /*
    *
    *   ******** 辅助方法函数 ********
    *
    */
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
.searchdiv {
  margin: 20px 0 10px 50px;
  float: left;
}
.footer {
  float: left;
}
.el-footer {
  background-color: #D7DEE8;
}
.el-dialog__header {
  background-color: #409EFF;
}
.paginationfooter {
  position: absolute;
  bottom: 40px;
  right: 20px;
}
.block{
  text-align: right;
  width: 100%
}
.el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
#devmap {
  width:100%;
  height:360px;
  border: 1px solid silver;
  margin: 40px 0 10px 0;
}
</style>
