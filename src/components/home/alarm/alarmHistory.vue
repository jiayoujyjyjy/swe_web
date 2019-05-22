<template>
  <el-container>
    <el-main class="alarmHistorymain">

      <!--根据充电桩名称查找设备报警信息信息-->
      <el-row>
        <el-col>
          <div class="searchdiv">
            <el-autocomplete
              class="inline-input"
              v-model="input"
              :fetch-suggestions="querySearch"
              placeholder="请输入充电桩名称"
              :trigger-on-focus="false"
              @select="alarmHisQueBt"
              @keyup.enter.native="alarmHisQueBt">
            </el-autocomplete>
            <!-- <el-input v-model="input" placeholder="请输入充电桩名称" @keyup.enter.native="alarmHisQueBt" style="margin-right:20px;width: 200px;"></el-input> -->
            <el-date-picker
              v-model="timeRange"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" size="medium" @click="alarmHisQueBt" style="margin-left:20px;">报警查询</el-button>
            <el-button type="primary" size="medium" @click="queAllBt">查找全部</el-button>
          </div>
        </el-col>
      </el-row>
      <p></p>

      <!-- 历史报警表格 -->
      <el-table
        :data="alarmHisTable"
        style="width: 95%;margin: 0 auto"
        max-height = "570">
        <el-table-column
          label="序号"
          header-align="center"
          min-width="10%">
          <template slot-scope="scope">
            {{alarmTabNum + scope.$index}}
          </template>
        </el-table-column>
        <el-table-column
          prop="chargingTitle"
          label="充电桩"
          header-align="center"
          min-width="25%">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          header-align="center"
          min-width="25%">
        </el-table-column>
        <el-table-column
          prop="timeStart"
          label="开始时间"
          header-align="center"
          min-width="20%">
        </el-table-column>
        <el-table-column
          prop="content"
          label="故障名称"
          header-align="center"
          min-width="20%">
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

    <el-footer height="60px">
      <div class="footer">
        <el-button type="success" diaplay="inline" icon="el-icon-circle-plus-outline" @click="exportAlarmBt">导出报警</el-button>
      </div>
    </el-footer>

  </el-container>
</template>

<script>
import { back } from 'api'
import { sessionGetStore, sessionRemoveStore } from '@/components/config/Utils'
export default {
  data () {
    return {
      pickerOptions: {
        // 日期时间选择器快捷操作
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }],
        // 设置禁用状态,默认保存近三个月的数据
        disabledDate (time) {
          return (time.getTime() > Date.now() || time.getTime() < Date.now() - 1000 * 60 * 60 * 24 * 90)
        }
      },
      param: {
        'userId': '',
        'Authorization': '',
        'currentPage': 1,
        'pagesize': 8,
        'chargingName': '鸿世测试充电桩2', // 充值记录对话框当前页
        'startTime': '2018-07-18 14:00:39',
        'endTime': '2018-12-05 14:00:39',
        'sn': ''
      },
      timeRange: [],
      timeStart: '', // 转换格式后的起始时间
      timeEnd: '', // 转换格式后的结束时间
      input: '',
      title: [],
      userBehavior: '0', // 标识用户换页行为，0表示查找全部充电桩全部信息，1表示查找特定充电桩全部信息，2表示查找全部充电桩特定信息，3表示查找特定充电桩特定信息
      eltotal: 0, // 分页器中的记录总数
      alarmTabNum: 1, // 用来计算客户列表表格顺序
      alarmHisTable: null,
      alarmHis: [{
        sn: '1010',
        content: '电流过大',
        chargingTitle: '高科技企业孵化园区A#1',
        address: '',
        timeStart: '2018-6-29'
      }]
    }
  },
  created: function () {
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    var alarmSearch = sessionGetStore('alarmSearch')
    if (alarmSearch !== null) {
      this.$store.commit('setDevRouter', '2')
      this.$store.commit('setAlarmActiveName', 'second')
      this.input = this.param.chargingName = alarmSearch
      this.$nextTick(() => {
        this.backAlarmHisSnAllQue()
        sessionRemoveStore('alarmSearch')
      })
    } else {
      this.backAlarmHisAllQue()
    }
  },
  mounted: function () {
    this.title = this.loadAll()
  },
  methods: {
    alarmHisQueBt: function () {
      this.alarmTabNum = 1
      console.log(this.timeRange)
      this.timeStart = this.GMTToStr(this.timeRange[0])
      this.timeEnd = this.GMTToStr(this.timeRange[1])
      console.log(this.timeStart)
      console.log(this.timeEnd)
      this.param.currentPage = 1
      this.param.chargingName = this.input
      this.param.startTime = this.timeStart
      this.param.endTime = this.timeEnd
      if (this.input === '') {
        if (this.timeRange.length === 0) {
          this.backAlarmHisAllQue()
        } else {
          this.backAlarmHisDateAllQue()
        }
      } else {
        if (this.timeRange.length === 0) {
          this.backAlarmHisSnAllQue()
        } else {
          this.backAlarmHisDateSnQue()
        }
      }
    },
    // 查询所有信息对话框
    queAllBt: function () {
      this.param.currentPage = 1
      this.timeRange = []
      this.input = ''
      this.backAlarmHisAllQue()
    },
    // 带建议的输入框
    querySearch: function (queryString, cb) {
      var title = this.title
      var results = queryString ? title.filter(this.createFilter(queryString)) : title
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter: function (queryString) {
      return (title) => {
        return (title.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll: function () {
      this.title = []
      for (let i = 0; i < this.alarmHis.length; i++) {
        let obj = {}
        obj.value = this.alarmHis[i].chargingTitle
        this.title.push(obj)
      }
      return this.title
    },
    GMTToStr: function (time) {
      let date = new Date(time)
      let Str = date.getFullYear() + '-' +
      (date.getMonth() + 1) + '-' +
      date.getDate() + ' ' +
      date.getHours() + ':' +
      date.getMinutes() + ':' +
      date.getSeconds()
      return Str
    },
    // 导出文件
    exportAlarmBt: function () {
      this.exportData = 'downtest'
      if ('download' in document.createElement('a')) {
        this.download(this.exportData, 'filename')
      } else {
        alert('浏览器不支持')
      }
    },
    // 下载设备配置文件
    download: function (content, filename) {
      let link = document.createElement('a')
      link.download = filename
      link.style.display = 'none'
      // 字符内容转变成blob地址
      let blob = new Blob([content])
      link.href = URL.createObjectURL(blob)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    // 换页
    handlePaginationChange: function (value) {
      this.alarmTabNum = this.param.pagesize * (value - 1) + 1
      this.param.currentPage = value
      if (this.userBehavior === '0') {
        this.backAlarmHisAllQue()
      } else if (this.userBehavior === '1') {
        this.backAlarmHisSnAllQue()
      } else if (this.userBehavior === '2') {
        this.backAlarmHisDateAllQue()
      } else {
        this.backAlarmHisDateSnQue()
      }
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 分页获取所有电桩的所有历史报警信息
    backAlarmHisAllQue: function () {
      back.alarmHisAllQue(this.param).then(function (response) {
        console.log('所有所有历史报警')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.eltotal = response.data.total
        this.alarmHisTable = []
        for (let i = 0; i < response.data.record.length; i++) {
          let obj = {}
          obj.sn = response.data.record[i].sn
          obj.chargingTitle = response.data.record[i].name
          obj.address = response.data.record[i].address
          obj.content = response.data.record[i].content
          obj.timeStart = response.data.record[i].time
          this.alarmHisTable.push(obj)
        }
        this.userBehavior = '0'
      }.bind(this))
    },
    // 分页获取单一充电桩的所有历史报警信息
    backAlarmHisSnAllQue: function () {
      back.alarmHisSnAllQue(this.param).then(function (response) {
        console.log('单一所有历史报警')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.eltotal = response.data.total
        this.alarmHisTable = []
        for (let i = 0; i < response.data.record.length; i++) {
          let obj = {}
          obj.sn = response.data.record[i].sn
          obj.chargingTitle = response.data.record[i].name
          obj.address = response.data.record[i].address
          obj.content = response.data.record[i].content
          obj.timeStart = response.data.record[i].time
          this.alarmHisTable.push(obj)
        }
        this.userBehavior = '1'
      }.bind(this))
    },
    // 分页获取所有充电桩的特定历史报警信息
    backAlarmHisDateAllQue: function () {
      back.alarmHisDateAllQue(this.param).then(function (response) {
        console.log('所有特定历史报警')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.eltotal = response.data.total
        this.alarmHisTable = []
        for (let i = 0; i < response.data.record.length; i++) {
          let obj = {}
          obj.sn = response.data.record[i].sn
          obj.chargingTitle = response.data.record[i].name
          obj.address = response.data.record[i].address
          obj.content = response.data.record[i].content
          obj.timeStart = response.data.record[i].time
          this.alarmHisTable.push(obj)
        }
        this.userBehavior = '2'
      }.bind(this))
    },
    // 分页获取单一充电桩的特定历史报警信息
    backAlarmHisDateSnQue: function () {
      console.log(this.param)
      back.alarmHisDateSnQue(this.param).then(function (response) {
        console.log('单一特定历史报警')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.eltotal = response.data.total
        this.alarmHisTable = []
        for (let i = 0; i < response.data.record.length; i++) {
          let obj = {}
          obj.sn = response.data.record[i].sn
          obj.chargingTitle = response.data.record[i].name
          obj.address = response.data.record[i].address
          obj.content = response.data.record[i].content
          obj.timeStart = response.data.record[i].time
          this.alarmHisTable.push(obj)
        }
        this.userBehavior = '3'
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
.searchdiv {
  margin: 20px 0 10px 50px;
  float: left;
}
.inline-input {
  margin-right:20px;
  width: 200px;
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
</style>
