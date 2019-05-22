<template>
  <el-container>
    <el-main>

      <!--根据sn查询设备信息-->
      <div style="display: -webkit-flex; display: flex;justify-content: space-between;margin: 20px 50px 10px">
        <div class="searchdiv">
          <el-input v-model="input_name" placeholder="请输入充电桩名称" @keyup.enter.native="chargingPileQueBt"></el-input>
          <el-button size="medium" type="primary" @click="chargingPileQueBt">充电桩查询</el-button>
          <el-button size="medium" type="primary" @click="queAllBt">查找全部</el-button>
        </div>
        <div>
          <el-radio-group v-model="radioVal" @change="stateFilter">
            <el-radio-button label="在线"></el-radio-button>
            <el-radio-button label="离线"></el-radio-button>
            <el-radio-button label="重置"></el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <p></p>

      <!--充电桩信息表格-->
      <el-table
        v-loading="loadingFlag"
        element-loading-text="加载中,请稍候"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="deviceTable"
        style="width: 100%"
        max-height = "570">
        <el-table-column
          label=""
          header-align="center"
          min-width="4%">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.checked" @change="handleCheckChange(scope.$index, scope.$row)"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="名称"
          header-align="center"
          min-width="10%">
        </el-table-column>
        <el-table-column
          prop="sn"
          label="sn"
          header-align="center"
          min-width="6%">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          header-align="center"
          min-width="12%">
        </el-table-column>
        <el-table-column
          label="状态"
          header-align="center"
          min-width="4%">
          <template slot-scope="scope">
            <img :src="scope.row.onlineImg" style="width:32px;height:15px" />
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          header-align="center"
          min-width="4%">
        </el-table-column>
        <el-table-column
          prop="tag"
          label="标签"
          header-align="center"
          min-width="4%">
        </el-table-column>
        <el-table-column
          prop="client"
          label="所属客户"
          header-align="center"
          min-width="6%">
        </el-table-column>
        <el-table-column
          prop="plug"
          label="插头使用状况"
          header-align="center"
          min-width="15%">
          <template slot-scope="scope">
            {{scope.row.plug}}
            <el-button type="text" icon="el-icon-info" @click="socketBt(scope.$index)"></el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="计费规则"
          header-align="center"
          min-width="5%">
          <template slot-scope="scope">
            <el-button type="text" @click="billingRulesBt(scope.$index)">详情</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="alarm"
          label="报警数目"
          header-align="center"
          min-width="5%">
          <template slot-scope="scope">
            <el-button type="text" @click="alarmBt(scope.$index)">{{scope.row.alarm}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          min-width="14%">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-edit" @click="deviceEditBt(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" size="small" icon="el-icon-delete" @click="deviceDeleteBt(scope.$index, scope.row)">删除</el-button>
            <el-button type="text" size="small" icon="el-icon-download" @click="qrdownloadBt(scope.$index, scope.row)">二维码</el-button>
            <el-button type="text" size="small" icon="el-icon-d-arrow-right" @click="toMapBt(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- table分页器 -->
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

    <el-footer height="60px">
      <div class="footer">
        <el-button type="success" diaplay="inline" icon="el-icon-circle-plus-outline" @click="chargingPileAddBt">新增充电桩</el-button>
        <el-button type="success" diaplay="inline" icon="el-icon-tickets" @click="chargingBatchDelBt">批量删除</el-button>
        <!--el-button type="success" diaplay="inline" icon="el-icon-tickets" v-show="(param.auth <= shareAdminAuth)" @click="monitorBatchAddBt">批量添加</el-button-->

      </div>
    </el-footer>

    <!-- 计费规则对话框 -->
    <el-dialog title="计费规则" :visible.sync="dialogBillingVisible" width="520px">
      <div style="text-align: left; margin: 0 0 20px 20px;font-size: 16px;">sn：{{billingSn}}</div>
        <el-form>
          <el-form-item
            v-for="(billing) in billingDiaData"
            :key = "billing.key"
          >
            <el-input v-model="billing.min" class="input1"></el-input>
            <el-button type="text">--</el-button>
            <el-input v-model="billing.max" class="input1"></el-input>
            <el-button type="text" style="padding-right: 20px;">W</el-button>
            <el-input v-model="billing.price" class="input2"></el-input>
            <el-button type="text" class="labelbutton">元/小时</el-button>
            <el-button @click.prevent="removeItem(billing)">删除</el-button>
          </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="itemAddBt">新增一项</el-button>
        <el-button type="primary" @click="billingEditBt">修改</el-button>
        <el-button @click="dialogBillingVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!--新增/编辑对话框-->
    <el-dialog :title="dialogTitle" width="700px" top="10vh" :visible.sync="dialogEditVisible" center>
      <div>
        <el-row style="margin-right:30px;">
          <el-col :span="12">
            <el-form :model="deviceForm" label-width="80px">
              <el-form-item label="名称" prop="title">
                <el-input v-model="deviceForm.title"></el-input>
              </el-form-item>
              <el-form-item label="标签">
                <el-select v-model="tagValue" placeholder="请选择" @change="tagSelected">
                  <el-option
                    v-for="item in tagSelection"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            <el-form-item label="所属客户" prop="client">
                <el-autocomplete
                  class="inline-input"
                  v-model="deviceForm.client"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容"
                  :trigger-on-focus="false"
                  @select="handleAutocompleteSelect">
                </el-autocomplete>
              </el-form-item>
              <el-form-item label="地址" prop="address" v-show="formAddressVisible">
                <el-input v-model="deviceForm.address" @keyup.enter.native="addressChange" @change="addressChange"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-form :model="deviceForm" ref="deviceForm" label-width="80px">
              <el-form-item label="sn" prop="sn" v-show="formSnvisible">
                <el-input v-model="deviceForm.sn"></el-input>
              </el-form-item>
              <el-form-item label="类型">
                <el-select v-model="typeValue" placeholder="请选择" @change="typeSelected">
                  <el-option
                    v-for="item in typeSelection"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="经度" prop="lng">
                <el-input type="number" v-model="deviceForm.lng" @keyup.enter.native="lngChange" @change="lngChange"></el-input>
              </el-form-item>
              <el-form-item label="纬度" prop="lat">
                <el-input type="number" v-model="deviceForm.lat" @keyup.enter.native="latChange" @change="latChange"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div id="dialogEdit"></div>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="deviceEditConfirm">修改</el-button>
            <el-button @click="dialogEditVisible = false">取消</el-button>
        </div>
      </div>
    </el-dialog>

    <!--删除充电桩对话框-->
    <el-dialog
      title="提示"
      :visible.sync="dialogDelVisible"
      width="25%"
      center>
      <span>确定删除{{plugDialogTitle}}的信息吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelVisible = false">取 消</el-button>
        <el-button type="primary" @click="deviceDelConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!--下载二维码对话框-->
    <el-dialog
      title="下载二维码"
      :visible.sync="dialogQrVisible"
      width="50%"
      center>
      <p style="margin-left:20px;">充电桩：{{downloadCharging}}</p>
      <div class="flexbox">
        <div>
          <div id="qrcode1"></div>
          <div class="qr_text">插座1</div>
        </div>
        <div>
          <div id="qrcode2"></div>
          <div class="qr_text">插座2</div>
        </div>
        <div>
          <div id="qrcode3"></div>
          <div class="qr_text">插座3</div>
        </div>
        <div>
          <div id="qrcode4"></div>
          <div class="qr_text">插座4</div>
        </div>
        <div>
          <div id="qrcode5"></div>
          <div class="qr_text">插座5</div>
        </div>
        <div>
          <div id="qrcode6"></div>
          <div class="qr_text">插座6</div>
        </div>
        <div>
          <div id="qrcode7"></div>
          <div class="qr_text">插座7</div>
        </div>
        <div>
          <div id="qrcode8"></div>
          <div class="qr_text">插座8</div>
        </div>
      </div>
      <div style="text-align:center">
        <el-button @click="downloadClick" type="primary" plain>批量下载</el-button>
      </div>
    </el-dialog>

    <!--插座详情对话框-->
    <el-dialog
      title="插座详情"
      :visible.sync="dialogSocketVisible"
      width="25%"
      center>
      <p style="margin-left:20px;">充电桩：{{socketDetailTitle}}</p>
      <el-row :gutter="20">
        <el-col :span="6" v-for="item in socketList" :key="item.value">
          <div class="grid-content">
            <img :src="item.src" />
            <p>{{item.value}}</p>
          </div>
        </el-col>
      </el-row>
    </el-dialog>

  </el-container>
</template>

<script>
import { back } from 'api'
import BMap from 'BMap'
import Routers from '@/router'
import QRCode from 'qrcodejs2'
import JsZip from 'jszip'
import FileSaver from 'file-saver'
import BMAP_ANCHOR_TOP_LEFT from 'BMAP_ANCHOR_TOP_LEFT'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
export default {
  data () {
    // 自定义校验规则
    // 客户姓名验证
    // var validateClient = (rule, value, callback) => {
    //   let validateMarker = 0
    //   console.log(value)
    //   for (let i = 0; i < this.client.length; i++) {
    //     console.log(this.client[i].value)
    //     if (value === this.client[i].value) {
    //       validateMarker = 1
    //       console.log(validateMarker)
    //     }
    //   }
    //   if (value === '') {
    //     callback(new Error('所属客户不能为空'))
    //   }
    //   if (validateMarker !== 1) {
    //     callback(new Error('请输入正确的客户信息'))
    //   }
    // }
    return {
      param: {
        'sn': '',
        'name': '',
        'label': '',
        'type': '',
        'lon': '',
        'lat': '',
        'ele': '',
        'userId': 0,
        'Authorization': '',
        'currentPage': 1,
        'pagesize': 8,
        'isSend': true,
        'billing': [],
        'online': true,
        'keyword': ''
      },
      input_name: '',
      qrcode: null,
      radioVal: '',
      urlList: '', // 插座二维码url
      userBehavior: '0', // 标识用户换页行为，0表示查找全部充电桩，1表示关键字查找，2表示在线离线查找
      // dialogPlugVisible: false, // 充电桩具体信息对话框显示属性
      dialogBillingVisible: false, // 计费规则对话框显示属性
      dialogDelVisible: false, // 删除对话框显示属性
      dialogEditVisible: false, // 编辑/新增对话框显示属性
      dialogQrVisible: false, // 下载二维码对话框显示属性
      formAddressVisible: false,
      formSnvisible: false,
      loadingFlag: false,
      dialogTitle: '',
      billingSn: '',
      indexList: [], // 批量删除用
      eltotal: 0, // 分页器中的记录总数
      plugDialogTitle: '充电桩名称',
      socketDetailTitle: '',
      downloadCharging: '',
      dialogSocketVisible: false,
      location: 'LocationMessage',
      locationLabel: '',
      map: null,
      lon: null,
      lat: null,
      typeValue: '多路',
      client: [],
      typeSelection: [{
        value: '单路',
        label: '单路'
      }, {
        value: '多路',
        label: '多路'
      }],
      socketList: [{
        value: '插座1',
        src: '/static/socket_unuse.png'
      }],
      tagValue: '公司',
      tagSelection: [{
        value: '学校',
        label: '学校'
      }, {
        value: '工厂',
        label: '工厂'
      }, {
        value: '地铁口',
        label: '地铁口'
      }, {
        value: '小区',
        label: '小区'
      }, {
        value: '公司',
        label: '公司'
      }, {
        value: '商业街',
        label: '商业街'
      }, {
        value: '景区',
        label: '景区'
      }],
      deviceForm: {
        title: '',
        sn: '',
        points: [{
          lat: '',
          lng: ''
        }],
        lng: '119',
        lat: '29',
        address: '',
        type: '',
        tag: '',
        client: ''
      },
      point: [],
      deviceTable: [{
        sn: '1001', // 必须是字符串类型，否则无法与搜索输入框的值匹配
        title: '孵化器园区B区1#',
        online: 1,
        onlineImg: '',
        points: [{
          lat: '29.3',
          lng: '120.3'
        }],
        address: '',
        type: '多路',
        tag: '公司',
        client: '客户',
        plug: '在线：2 离线：6',
        plugNum: 8,
        alarm: 1,
        checked: false
      }],
      billingform: {
        first: '0.35',
        second: '0.4',
        third: '0.5',
        forth: '0.7',
        fifth: '1.3',
        sixth: '1.5'
      },
      editMarker: 2, // 标识，0表示修改计费部分，后台不需要下发设备，1表示修改了功率区间，需要下发设备, 2表示数据没有被修改。
      backBillingData: [{
        min: '0',
        max: '150',
        price: 0.35
      }, {
        min: '150',
        max: '200',
        price: 0.4
      }, {
        min: '200',
        max: '300',
        price: 0.5
      }, {
        min: '300',
        max: '400',
        price: 0.7
      }, {
        min: '400',
        max: '700',
        price: 1.3
      }, {
        min: '700',
        max: '900',
        price: 1.5
      }],
      billingDiaData: [{
        powerInterval: '0<P≤120W',
        price: '0.35'
      }]
    }
  },
  created: function () {
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    // 设备地图页面跳转到设备列表时保证左侧菜单实时更新
    this.$store.commit('setDevRouter', '1')
    // var snSelected = sessionGetStore('snSelected')
    // console.log(snSelected)
    // console.log('snSelected')
    // if (snSelected) {
    //   this.param.sn = snSelected
    //   this.backChargingSnQue()
    //   sessionSetStore('snSelected', null)
    // } else {
    //   this.backChargingListQue()
    // }
    this.backChargingListQue()
  },
  mounted: function () {
    this.client = this.loadAll()
  },
  methods: {
    // 根据关键字查找
    chargingPileQueBt: function () {
      if (this.input_name === '') {
        this.queAllBt()
        return
      }
      this.param.currentPage = 1
      this.param.keyword = this.input_name
      this.backStationKeyQue()
    },
    // check选择，得到批量删除indexList,批量删除预留
    handleCheckChange: function (index, row) {
      console.log(index)
      console.log(this.deviceTable[index].checked)
      this.indexList = []
      for (let i = 0; i < this.deviceTable.length; i++) {
        if (this.deviceTable[i].checked === true) {
          this.indexList.push(this.deviceTable[i].sn)
        }
      }
      console.log(this.indexList)
    },
    // 查询所有设备信息
    queAllBt: function () {
      this.param.currentPage = 1
      this.input_name = ''
      this.backChargingListQue()
    },
    stateFilter: function (val) {
      if (val === '在线') {
        this.param.online = true
        this.param.currentPage = 1
        this.backStationStateQue()
      } else if (val === '离线') {
        this.param.online = false
        this.param.currentPage = 1
        this.backStationStateQue()
      } else {
        this.radioVal = ''
        this.param.currentPage = 1
        this.backChargingListQue()
      }
    },
    // 设备编辑按钮
    deviceEditBt: function (index) {
      this.param.sn = this.deviceTable[index].sn
      this.dialogTitle = '设备信息'
      this.formAddressVisible = false
      this.formSnvisible = false
      this.deviceForm.title = this.deviceTable[index].title
      this.deviceForm.type = this.deviceTable[index].type
      this.deviceForm.tag = this.deviceTable[index].tag
      this.deviceForm.client = this.deviceTable[index].client
      this.deviceForm.lng = this.deviceTable[index].points.lng
      this.deviceForm.lat = this.deviceTable[index].points.lat
      this.lon = this.deviceTable[index].points.lng
      this.lat = this.deviceTable[index].points.lat
      this.locationLabel = this.deviceTable[index].address
      console.log(this.deviceForm.client)
      this.dialogEditVisible = true
      if (this.map !== null) {
        this.map = null
      }
      this.$nextTick(() => {
        setTimeout(this.mapInit(), 200)
      })
    },
    // 设备删除按钮
    deviceDeleteBt: function (index) {
      this.plugDialogTitle = this.deviceTable[index].title
      this.dialogDelVisible = true
    },
    // 跳转到地图页面
    toMapBt: function (index) {
      console.log(this.deviceTable[index].sn)
      sessionSetStore('sn_listTomap', this.deviceTable[index].sn)
      Routers.push({ path: '/home/deviceInfo' })
    },
    // 下载对应设备插座二维码按钮
    qrdownloadBt: function (index) {
      this.downloadCharging = this.deviceTable[index].title
      this.param.sn = this.deviceTable[index].sn
      this.backStationQRQue()
    },
    generate: function () {
      let qrID
      for (let i = 0; i < 8; i++) {
        qrID = 'qrcode' + (i + 1)
        this.qrcode = new QRCode(qrID, {
          width: 200,
          height: 200,
          text: this.urlList[i].url // 二维码地址
        })
      }
    },
    // 下载二维码生成的图片
    // downloadClick1: function () {
    //   // 获取base64的图片节点
    //   var img = document.getElementById('qrcode').getElementsByTagName('img')[0]
    //   // 构建画布
    //   var canvas = document.createElement('canvas')
    //   canvas.width = img.width
    //   canvas.height = img.height
    //   canvas.getContext('2d').drawImage(img, 0, 0)
    //   // 构造url
    //   var url = canvas.toDataURL('image/png')
    //   // 构造a标签并模拟点击
    //   var downloadLink = document.createElement('a')
    //   // var downloadLink = document.getElementById('downloadLink')
    //   downloadLink.setAttribute('href', url)
    //   downloadLink.setAttribute('download', '二维码.png')
    //   downloadLink.click()
    // },
    // 显示插头使用状况按钮
    socketBt: function (index) {
      this.socketDetailTitle = this.deviceTable[index].title
      this.param.sn = this.deviceTable[index].sn
      this.backSocketStateQue()
    },
    // 批量下载二维码
    downloadClick: function () {
      var zip = new JsZip()
      var imgs = zip.folder(this.downloadCharging)
      var baseList = []
      var _this = this
      // var arr = ['/static/online.png', '/static/outline.png']
      var arr = []
      for (let i = 0; i < 8; i++) {
        var ID = 'qrcode' + (i + 1)
        arr.push(document.getElementById(ID).getElementsByTagName('img')[0].src)
      }
      console.log(arr)
      for (var i = 0; i < arr.length; i++) {
        let image = new Image()
        // 解决跨域 Canvas 污染问题
        image.setAttribute('crossOrigin', 'anonymous')
        image.onload = function () {
          let canvas = document.createElement('canvas')
          canvas.width = image.width
          canvas.height = image.height
          let context = canvas.getContext('2d')
          context.drawImage(image, 0, 0, image.width, image.height)
          let url = canvas.toDataURL() // 得到图片的base64编码数据 let url =
          canvas.toDataURL('image/png')
          baseList.push(url.substring(22))
          if (baseList.length === arr.length) {
            if (baseList.length > 0) {
              console.log('开始下载')
              for (let k = 0; k < baseList.length; k++) {
                imgs.file(_this.downloadCharging + '插座' + (k + 1) + '_' + _this.urlList[k].uid + '.png', baseList[k], {base64: true})
              }
              zip.generateAsync({type: 'blob'}).then(function (content) {
                FileSaver.saveAs(content, _this.downloadCharging + '.zip')
              })
            }
          }
        }
        image.src = arr[i]
      }
    },
    // 显示计费规则按钮
    billingRulesBt: function (index) {
      this.param.sn = this.billingSn = this.deviceTable[index].sn
      console.log(index)
      this.backChargingRulesQue()
    },
    alarmBt: function (index) {
      sessionSetStore('alarmSearch', this.deviceTable[index].title)
      console.log(this.deviceTable[index].title)
      Routers.push({ path: '/home/alarm/alarmHistory' })
    },
    // 新增设备按钮
    chargingPileAddBt: function () {
      this.dialogTitle = '新增设备'
      this.formAddressVisible = true
      this.formSnvisible = true
      this.deviceForm.sn = ''
      this.deviceForm.title = ''
      this.deviceForm.type = ''
      this.deviceForm.tag = ''
      this.deviceForm.address = '浙江省杭州市'
      this.deviceForm.client = ''
      this.lon = 120.2
      this.lat = 30.2
      this.locationLabel = '浙江省杭州市'
      this.dialogEditVisible = true
      this.$nextTick(() => {
        this.mapInit()
      })
    },
    // 批量删除设备按钮
    chargingBatchDelBt: function () {
      console.log('clientBatchDel')
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      this.param.currentPage = value
      if (this.userBehavior === '0') {
        this.backChargingListQue()
      } else if (this.userBehavior === '1') {
        this.backStationKeyQue()
      } else {
        this.backStationStateQue()
      }
    },
    /*
    *
    *   ******** 对话框操作 ********
    *
    */
    // 新增/编辑对话框中，改变经度后更新地图标注点显示及地址数据
    lngChange: function (value) {
      this.lon = value
      // 由坐标转换得到地理位置
      let geoc = new BMap.Geocoder()
      geoc.getLocation(new BMap.Point(this.lon, this.lat), function (rs) {
        var addComp = rs.addressComponents
        this.locationLabel = addComp.province + addComp.city + addComp.district
        this.deviceForm.address = this.locationLabel
      }.bind(this))
      this.mapInit()
    },
    // 新增/编辑对话框中，改变纬度后更新地图标注点显示及地址数据
    latChange: function (value) {
      this.lat = value
      // 由坐标转换得到地理位置
      let geoc = new BMap.Geocoder()
      geoc.getLocation(new BMap.Point(this.lon, this.lat), function (rs) {
        var addComp = rs.addressComponents
        this.locationLabel = addComp.province + addComp.city + addComp.district
        this.deviceForm.address = this.locationLabel
      }.bind(this))
      this.mapInit()
    },
    // 新增/编辑对话框中，改变地址后更新经纬度信息及地图标注点显示
    addressChange: function (value) {
      console.log(value)
      // 创建地址解析器实例
      var myGeo = new BMap.Geocoder()
      // 将地址解析结果显示在地图上,并调整地图视野
      myGeo.getPoint(value, function (point) {
        console.log(point)
        if (point) {
          this.lon = point.lng
          this.lat = point.lat
          // 由坐标转换得到地理位置
          let geoc = new BMap.Geocoder()
          geoc.getLocation(new BMap.Point(this.lon, this.lat), function (rs) {
            var addComp = rs.addressComponents
            this.locationLabel = addComp.province + addComp.city + addComp.district
            this.deviceForm.lng = this.lon
            this.deviceForm.lat = this.lat
            this.mapInit()
          }.bind(this))
        }
      }.bind(this))
    },
    tagSelected: function () {
      console.log(this.tagValue)
    },
    typeSelected: function (value) {
      console.log(value)
    },
    // 带建议的输入框
    querySearch: function (queryString, cb) {
      console.log(queryString, cb)
      var client = this.client
      var results = queryString ? client.filter(this.createFilter(queryString)) : client
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter: function (queryString) {
      return (client) => {
        return (client.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll: function () {
      return [{
        value: '客户'
      }, {
        value: '李四'
      }, {
        value: '赵五'
      }]
      // return ['张三', '李四', '赵五']
    },
    handleAutocompleteSelect: function (item) {
      console.log('123')
      console.log(item)
      console.log(this.deviceForm.client)
    },
    // 删除对话框确认按钮
    deviceDelConfirm: function () {
      console.log('deviceDelConfirm')
    },
    // 编辑对话框确认按钮
    deviceEditConfirm: function () {
      // let marker = 0 // 0标识客户信息不正确，1表示正确
      // for (let i = 0; i < this.client.length; i++) {
      //   if (this.deviceForm.client === this.client[i].value) {
      //     marker = 1
      //   }
      // }
      // if (marker === 0) {
      //   this.notificationInfo('提示', '没有此客户,请重新编辑')
      // } else {
      //   console.log('deviceEditConfirm')
      // }
      this.param.name = this.deviceForm.title
      this.param.label = this.tagValue
      this.param.type = this.typeValue
      this.param.lon = this.deviceForm.lng
      this.param.lat = this.deviceForm.lat
      console.log(this.param)
      console.log('param')
      this.backChargingInfoMod()
    },
    // 新增对话框确认按钮
    deviceAddConfirm: function () {
      let marker = 0 // 0标识客户信息不正确，1表示正确
      for (let i = 0; i < this.client.length; i++) {
        if (this.deviceForm.client === this.client[i].value) {
          marker = 1
        }
      }
      if (marker === 0) {
        this.notificationInfo('提示', '没有此客户,请重新编辑')
      } else {
        console.log('deviceAddConfirm')
      }
    },
    // 对话框计费规则确认修改按钮
    billingEditBt: function () {
      console.log('数据比较')
      this.param.billing = []
      for (let i = 0; i < this.billingDiaData.length; i++) {
        let obj = {}
        obj.min = parseFloat(this.billingDiaData[i].min)
        obj.max = parseFloat(this.billingDiaData[i].max)
        obj.price = parseFloat(this.billingDiaData[i].price)
        this.param.billing.push(obj)
      }
      console.log(this.param.billing)
      if (this.param.billing[0].min !== 0) {
        this.notificationInfo('提示', '请从0开始选择功率区间')
        return
      }
      for (let i = 0; i < this.billingDiaData.length; i++) {
        if (this.billingDiaData[i].min === '' || this.billingDiaData[i].max === '' || this.billingDiaData[i].price === '') {
          this.notificationInfo('提示', '请保证没有空数据')
          return
        }
      }
      for (let i = 0; i < this.param.billing.length - 1; i++) {
        if (this.param.billing[i].max !== this.param.billing[i + 1].min) {
          this.notificationInfo('提示', '请保证功率区间正确')
          return
        }
      }
      if (this.backBillingData.length !== this.billingDiaData.length) {
        console.log('长度变了')
        this.editMarker = 1
        this.param.isSend = true
        this.backChargingRulesMod()
      } else {
        // 分别进行遍历
        let marker = 0
        for (let i = 0; i < this.backBillingData.length; i++) {
          if (this.backBillingData[i].min === this.billingDiaData[i].min && this.backBillingData[i].max === this.billingDiaData[i].max && this.backBillingData[i].price === this.billingDiaData[i].price) {
            marker = marker + 1
          }
        }
        if (marker === this.backBillingData.length) {
          console.log('数据没变')
          this.editMarker = 2
          return
        }
        for (let i = 0; i < this.backBillingData.length; i++) {
          if (this.backBillingData[i].min !== this.billingDiaData[i].min || this.backBillingData[i].max !== this.billingDiaData[i].max) {
            console.log('功率区间变了')
            this.editMarker = 1
            this.param.isSend = true
            this.backChargingRulesMod()
            return
          }
        }
        for (let j = 0; j < this.backBillingData.length; j++) {
          if (this.backBillingData[j].price !== this.billingDiaData[j].price) {
            console.log('计费变了')
            this.editMarker = 0
            this.param.isSend = false
            this.backChargingRulesMod()
            return
          }
        }
      }
    },
    // 计费规则对话框去掉一行
    removeItem: function (item) {
      var index = this.billingDiaData.indexOf(item)
      if (index !== -1) {
        this.billingDiaData.splice(index, 1)
      }
    },
    // 计费规则对话框新增一行
    itemAddBt: function (item) {
      this.billingDiaData.push({
        powerInterval: '',
        price: ''
      })
    },
    // 地图加载
    mapInit: function () {
      this.map = new BMap.Map('dialogEdit')
      this.map.centerAndZoom(new BMap.Point(this.lon, this.lat), 15)
      this.map.enableScrollWheelZoom(true)
      this.addmarker()
      this.map.addEventListener('click', function (e) {
        this.lon = e.point.lng.toFixed(3)
        this.lat = e.point.lat.toFixed(3)
        // 由坐标转换得到地理位置
        let geoc = new BMap.Geocoder()
        geoc.getLocation(new BMap.Point(this.lon, this.lat), function (rs) {
          var addComp = rs.addressComponents
          this.locationLabel = addComp.province + addComp.city + addComp.district
          this.deviceForm.address = this.locationLabel
          this.addmarker()
        }.bind(this))
        this.deviceForm.lng = this.lon
        this.deviceForm.lat = this.lat
        this.location = '经度：' + this.lon + ' ' + '纬度：' + this.lat
        console.log(this.location)
      }.bind(this))
      this.map.addControl(new BMap.CityListControl({
        anchor: BMAP_ANCHOR_TOP_LEFT
      }))
    },
    // 向地图中添加坐标标注点
    addmarker: function () {
      this.map.clearOverlays()
      var marker = new BMap.Marker(new BMap.Point(this.lon, this.lat))
      this.map.addOverlay(marker)
      var label = new BMap.Label(this.locationLabel, { offset: new BMap.Size(20, -10) })
      marker.setLabel(label)
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 分页获取充电桩信息列表
    backChargingListQue: function () {
      back.chargingListQue(this.param).then(function (response) {
        console.log('充电桩分页信息')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.deviceTable = []
        for (let i = 0; i < response.data.record.length; i++) {
          let obj = {}
          obj.sn = response.data.record[i].sn
          obj.title = response.data.record[i].name
          obj.online = response.data.record[i].state
          if (response.data.record[i].state === '1') {
            obj.onlineImg = '/static/outline.png'
          } else {
            obj.onlineImg = '/static/online.png'
          }
          obj.points = {
            lat: response.data.record[i].latitude.lat,
            lng: response.data.record[i].latitude.lon
          }
          obj.address = response.data.record[i].address
          obj.type = response.data.record[i].type
          obj.tag = response.data.record[i].label
          obj.client = response.data.record[i].customerName
          obj.plug = '使用中：' + response.data.record[i].used + '未使用：' + response.data.record[i].unuse + '异常：' + response.data.record[i].error
          obj.alarm = response.data.record[i].warn
          obj.checked = false
          this.deviceTable.push(obj)
        }
        this.eltotal = response.data.total
        this.userBehavior = '0'
      }.bind(this))
    },
    // 获取单一充电桩信息
    backChargingSnQue: function () {
      // 登陆API请求,通过用户名登陆
      back.chargingSnQue(this.param).then(function (response) {
        console.log('充电桩sn查询')
        console.log(response)
        console.log('marker')
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          // return
        }
        // 信息处理
      }.bind(this))
    },
    // 修改充电桩信息
    backChargingInfoMod: function () {
      back.chargingInfoMod(this.param).then(function (response) {
        console.log('修改充电桩信息')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.dialogEditVisible = false
        this.notificationInfo('提示', '修改设备信息成功！')
        this.backChargingListQue()
        // 信息处理
      }.bind(this))
    },
    // 获取充电桩计费规则
    backChargingRulesQue: function () {
      // 登陆API请求,通过用户名登陆
      back.chargingRulesQue(this.param).then(function (response) {
        console.log('充电桩计费规则')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.billingDiaData = []
        this.backBillingData = response.data
        for (let i = 0; i < response.data.length; i++) {
          let obj = {}
          obj.min = response.data[i].min
          obj.max = response.data[i].max
          obj.price = response.data[i].price
          this.billingDiaData.push(obj)
        }
        this.dialogBillingVisible = true
        // 信息处理
      }.bind(this))
    },
    // 修改充电桩计费规则
    backChargingRulesMod: function () {
      back.chargingRulesMod(this.param).then(function (response) {
        console.log('充电桩计费规则')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.notificationInfo('提示', '修改成功')
        this.dialogBillingVisible = false
        // 信息处理
      }.bind(this))
    },
    // 获取充电桩下的插座状态
    backSocketStateQue: function () {
      back.socketStateQue(this.param).then(function (response) {
        console.log('插座状态')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.socketList = []
        let num = 1
        for (let j = 0; j < 8; j++) {
          for (let i = 0; i < response.data.length; i++) {
            if (num === response.data[i].id) {
              let obj = {}
              obj.value = '插座' + num
              if (response.data[i].state === 0) {
                obj.src = '/static/socket_unuse.png'
              } else if (response.data[i].state === 1) {
                obj.src = '/static/socket_used.png'
              } else {
                obj.src = '/static/socket_error.png'
              }
              this.socketList.push(obj)
            }
          }
          num++
        }
        console.log(this.socketList)
        this.dialogSocketVisible = true
      }.bind(this))
    },
    // 根据充电桩关键字分页查找充电桩信息
    backStationKeyQue: function () {
      back.stationKeyQue(this.param).then(function (response) {
        console.log('关键字查找')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.deviceTable = []
        for (let i = 0; i < response.data.record.length; i++) {
          let obj = {}
          obj.sn = response.data.record[i].sn
          obj.title = response.data.record[i].name
          obj.online = response.data.record[i].state
          if (response.data.record[i].state === '1') {
            obj.onlineImg = '/static/outline.png'
          } else {
            obj.onlineImg = '/static/online.png'
          }
          obj.points = {
            lat: response.data.record[i].latitude.lat,
            lng: response.data.record[i].latitude.lon
          }
          obj.address = response.data.record[i].address
          obj.type = response.data.record[i].type
          obj.tag = response.data.record[i].label
          obj.client = response.data.record[i].customerName
          obj.plug = '使用中：' + response.data.record[i].used + '未使用：' + response.data.record[i].unuse + '异常：' + response.data.record[i].error
          obj.alarm = response.data.record[i].warn
          obj.checked = false
          this.deviceTable.push(obj)
        }
        this.eltotal = response.data.total
        this.userBehavior = '1'
      }.bind(this))
    },
    // 根据充电桩在线离线分页获取充电桩列表
    backStationStateQue: function () {
      back.stationStateQue(this.param).then(function (response) {
        console.log('在线离线筛选')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.deviceTable = []
        for (let i = 0; i < response.data.record.length; i++) {
          let obj = {}
          obj.sn = response.data.record[i].sn
          obj.title = response.data.record[i].name
          obj.online = response.data.record[i].state
          if (response.data.record[i].state === '1') {
            obj.onlineImg = '/static/outline.png'
          } else {
            obj.onlineImg = '/static/online.png'
          }
          obj.points = {
            lat: response.data.record[i].latitude.lat,
            lng: response.data.record[i].latitude.lon
          }
          obj.address = response.data.record[i].address
          obj.type = response.data.record[i].type
          obj.tag = response.data.record[i].label
          obj.client = response.data.record[i].customerName
          obj.plug = '使用中：' + response.data.record[i].used + '未使用：' + response.data.record[i].unuse + '异常：' + response.data.record[i].error
          obj.alarm = response.data.record[i].warn
          obj.checked = false
          this.deviceTable.push(obj)
        }
        this.eltotal = response.data.total
        this.userBehavior = '2'
      }.bind(this))
    },
    // 获取充电桩下的插座二维码信息
    backStationQRQue: function () {
      back.stationQRQue(this.param).then(function (response) {
        console.log('二维码查询')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          this.urlList = []
          let num = 1
          for (let j = 0; j < 8; j++) {
            for (let i = 0; i < response.data.length; i++) {
              if (num === response.data[i].id) {
                let obj = {}
                obj.id = response.data[i].id
                obj.uid = response.data[i].uid
                obj.url = response.data[i].url
                this.urlList.push(obj)
              }
            }
            num++
          }
          console.log('urllist')
          console.log(this.urlList)
          this.dialogQrVisible = true
          this.$nextTick(() => {
            if (document.getElementById('qrcode1').innerHTML) {
              console.log('第二次绘制')
              for (let i = 0; i < 8; i++) {
                var ID = 'qrcode' + (i + 1)
                document.getElementById(ID).innerHTML = ''
              }
            }
            setTimeout(this.generate(), 2000)
          })
        }
      }.bind(this))
    },
    /*
    //  ************  辅助函数  *************
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
.searchdiv .el-input {
  width: 230px;
  margin-right: 15px;
}
.paginationfooter {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
.block{
  text-align: right;
  width: 100%
}
.labelbutton {
  color: #303133;
}
.input {
  width: 65%;
  float: left;
}
.dialog-footer {
  text-align: center;
  padding: 0px 20px 20px 20px;
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
.dialog-footer {
  text-align: center;
}
#dialogEdit {
  width:100%;
  height:360px;
  border: 1px solid silver;
  margin-bottom:10px;
}
/* 去除百度标识 */
.anchorBL {
  display:none
}
.el-select {
  width: 230px;
}
.el-autocomplete {
  width: 230px;
}
.input1 {
  width: 15%;
}
.input2 {
  width: 20%;
  padding-right:10px;
}
.inline-input {
  margin-right:20px;
  width: 200px;
}
.flexbox {
  display: -webkit-flex; /* Safari */
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.flexbox > *{
  margin-bottom: 15px;
}
.grid-content {
  text-align: center;
  height: auto;
}
.qr_text {
  text-align: center;
  margin-top:5px;
}
</style>
