<template>
  <el-container>
    <el-main class="alarmNowmain">

      <!--根据充电桩名称查询设备报警信息-->
      <el-row>
        <el-col>
          <div class="searchdiv">
            <el-autocomplete
              class="inline-input"
              v-model="input"
              :fetch-suggestions="querySearch"
              placeholder="请输入充电桩名称"
              :trigger-on-focus="false"
              @select="alarmNowQueBt"
              @keyup.enter.native="alarmNowQueBt">
            </el-autocomplete>
            <el-button type="primary" size="medium" @click="alarmNowQueBt" style="margin-left:20px;">报警查询</el-button>
            <el-button type="primary" size="medium" @click="queAllBt">查找全部</el-button>
          </div>
        </el-col>
      </el-row>
      <p></p>

      <!-- 当前报警表格 -->
      <el-table
        :data="alarmNowTable"
        style="width: 95%;margin: 0 auto"
        max-height = "570">
        <el-table-column
          prop="status"
          label="状态"
          header-align="center"
          min-width="10%">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.status"  placement="right">
              <el-button type="text" :icon="(scope.row.status === '已确认') ? 'el-icon-check': 'el-icon-info'" @click="dealStatus(scope.$index, scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
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
          min-width="15%">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          header-align="center"
          min-width="15%">
        </el-table-column>
        <el-table-column
          prop="timeStart"
          label="开始时间"
          header-align="center"
          min-width="15%">
        </el-table-column>
        <el-table-column
          prop="content"
          label="故障名称"
          header-align="center"
          min-width="15%">
        </el-table-column>
      </el-table>

      <el-footer class="paginationfooter" height="60px">
        <div class="block">
          <el-pagination
            @current-change="handlePaginationChange"
            :current-page="param.currentPage"
            :page-size="pagesize"
            layout="total, prev, pager, next, jumper"
            :total="eltotal">
          </el-pagination>
        </div>
      </el-footer>

    </el-main>

  </el-container>
</template>

<script>
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
export default {
  data () {
    return {
      param: {
        'userId': 0,
        'Authorization': '',
        'currentPage': 1,
        'pagesize': 8,
        'chargingName': '',
        'time': 8,
        'sn': ''
      },
      input: '',
      title: [], // 搜索框autocomplete所有的充电桩title
      pagesize: 8, // 每页显示的记录数目
      eltotal: 0, // 分页器中的记录总数
      alarmTabNum: 1, // 用来计算客户列表表格顺序
      alarmNowTable: null,
      userBehavior: '0', // 标识用户换页行为，0表示查找全部，1表示查找特定充电桩
      alarmNow: [{
        sn: '1010',
        chargingTitle: '鸿世测试充电桩2',
        status: '未确认',
        address: '',
        content: '电流过大',
        timeStart: '2018-6-29'
      }]
    }
  },
  created: function () {
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.backAlarmNowAllQue()
  },
  mounted: function () {
    this.title = this.loadAll()
  },
  methods: {
    alarmNowQueBt: function () {
      this.alarmTabNum = 1
      if (this.input === '') {
        this.queAllBt()
      } else {
        this.param.currentPage = 1
        this.param.chargingName = this.input
        this.backAlarmNowSnQue()
      }
    },
    // 查询所有信息对话框
    queAllBt: function () {
      this.input = ''
      this.param.currentPage = 1
      this.backAlarmNowAllQue()
    },
    // 信息处理状态
    dealStatus: function (index, row) {
      if (this.alarmNowTable[index].status === '未确认') {
        this.alarmNowTable[index].status = '已确认'
      }
      this.param.sn = this.alarmNowTable[index].sn
      this.param.time = this.alarmNowTable[index].timeStart
      this.backAlarmConfirm()
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
      for (let i = 0; i < this.alarmNow.length; i++) {
        let obj = {}
        obj.value = this.alarmNow[i].chargingTitle
        this.title.push(obj)
      }
      return this.title
    },
    // 换页重新请求数据
    handlePaginationChange: function (value) {
      this.alarmTabNum = this.param.pagesize * (value - 1) + 1
      this.param.currentPage = value
      if (this.userBehavior === '0') {
        this.backAlarmNowAllQue()
      } else {
        this.backAlarmNowSnQue()
      }
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 分页获取所有充电桩的当前报警信息
    backAlarmNowAllQue: function () {
      back.alarmNowAllQue(this.param).then(function (response) {
        console.log('所有当前报警')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.eltotal = response.data.total
        this.alarmNowTable = []
        for (let i = 0; i < response.data.record.length; i++) {
          let obj = {}
          obj.sn = response.data.record[i].sn
          obj.chargingTitle = response.data.record[i].name
          obj.status = '未确认'
          obj.address = response.data.record[i].address
          obj.content = response.data.record[i].content
          obj.timeStart = response.data.record[i].time
          this.alarmNowTable.push(obj)
        }
        this.userBehavior = '0'
      }.bind(this))
    },
    // 分页获取单一充电桩的当前报警信息
    backAlarmNowSnQue: function () {
      console.log(this.param)
      back.alarmNowSnQue(this.param).then(function (response) {
        console.log('单一当前报警')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.eltotal = response.data.total
        this.alarmNowTable = []
        for (let i = 0; i < response.data.record.length; i++) {
          let obj = {}
          obj.sn = response.data.record[i].sn
          obj.chargingTitle = response.data.record[i].name
          obj.status = '未确认'
          obj.address = response.data.record[i].address
          obj.content = response.data.record[i].content
          obj.timeStart = response.data.record[i].time
          this.alarmNowTable.push(obj)
        }
        this.userBehavior = '1'
      }.bind(this))
    },
    // 确认当前报警
    backAlarmConfirm: function () {
      back.alarmConfirm(this.param).then(function (response) {
        console.log('确认当前报警')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          this.notificationInfo('提示', '已确认，请到历史报警中查看该条信息')
        }
        // 根据当前情况刷新列表，主要是区分现在是否处于搜索状态
        if (this.userBehavior === '0') {
          this.backAlarmNowAllQue()
        } else {
          this.backAlarmNowSnQue()
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
.el-icon-remove {
  color: red;
  font-size: 18px;
}
.inline-input {
  margin-right:20px;
  width: 200px;
}
.searchdiv {
  margin: 20px 0 10px 50px;
  /* text-align: left */
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
</style>
