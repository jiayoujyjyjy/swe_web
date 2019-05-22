<template>
  <el-container>
    <el-main class="accountlistmain">

      <!-- 资金结算条件选择 -->

      <div class="searchdiv">
        <el-input v-model="input" placeholder="请输入客户手机号" @keyup.enter.native="clientAccountQueBt" style="margin-right:15px;width:300px;"></el-input>
        <el-button type="primary" size="medium" @click="clientAccountQueBt" style="margin: 0 15px">收益查询</el-button>
        <el-button type="primary" size="medium" @click="queAllBt">查找全部</el-button>
      </div>

      <!-- 结算表格 -->
      <el-table
        :data="accountTable"
        style="width: 100%"
        max-height = "570">
        <el-table-column
          label="序号"
          header-align="center"
          min-width="4%">
          <template slot-scope="scope">
            {{clientTabNum + scope.$index}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="客户"
          header-align="center"
          min-width="10%">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
          header-align="center"
          min-width="10%">
        </el-table-column>
        <!-- <el-table-column
          prop="clientpercent"
          label="百分比"
          header-align="center">
        </el-table-column> -->
        <el-table-column
          prop="registerTime"
          label="注册时间"
          header-align="center"
          min-width="20%">
        </el-table-column>
        <el-table-column
          prop="income"
          label="客户累计收益"
          header-align="center"
          min-width="10%">
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

    <!-- <el-footer height="60px">
      <div class="footer">
        <el-button type="success" diaplay="inline" icon="el-icon-circle-plus-outline" @click="exportAccountBt">导出结算</el-button>
      </div>
    </el-footer> -->

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
        'mobile': '',
        'currentPage': 1, // 资金结算列表换页
        'pagesize': 8
      },
      // ******  搜索部分  ******
      input: '',
      clientAccountSearch: [], // 搜索后的客户结算信息，客户是唯一的，永远只有一条数据
      // ******  列表  ******
      eltotal: 0, // 资金结算列表总数
      clientTabNum: 1, // 用来计算客户列表表格顺序
      accountTable: []
    }
  },
  created: function () {
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    // back分页获取客户列表
    this.backCustomerListQue()
  },
  mounted: function () {
    // this.title = this.loadAll()
  },
  methods: {
    // 根据条件查找客户
    clientAccountQueBt: function () {
      if (this.input === '') {
        this.queAllBt()
        return
      }
      this.param.mobile = this.input
      this.input = ''
      this.backCustomerSearch()
    },
    // 查询所有信息对话框
    queAllBt: function () {
      this.param.currentPage = 1
      this.backCustomerListQue()
    },
    // 客户列表换页
    handlePaginationChange: function (value) {
      console.log(value)
      this.clientTabNum = this.param.pagesize * (value - 1) + 1
      this.param.currentPage = value
      this.backCustomerListQue()
    },
    // 导出结算
    exportAccountBt: function () {
      this.exportData = 'downaccount'
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
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 分页获取客户列表
    backCustomerListQue: function () {
      back.customerListQue(this.param).then(function (response) {
        console.log('分页获取客户列表')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.eltotal = response.data.total
        this.accountTable = []
        for (let i = 0; i < response.data.record.length; i++) {
          let obj = {}
          obj.userId = response.data.record[i].userId
          obj.name = response.data.record[i].name
          // obj.city = response.data.record[i].city
          obj.mobile = response.data.record[i].mobile
          obj.registerTime = response.data.record[i].registerTime
          obj.income = response.data.record[i].income
          this.accountTable.push(obj)
        }
      }.bind(this))
    },
    // 搜索用户
    backCustomerSearch: function () {
      back.customerSearch(this.param).then(function (response) {
        console.log(response)
        console.log('搜索用户')
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.eltotal = response.data.total
        this.accountTable = []
        for (let i = 0; i < response.data.record.length; i++) {
          let obj = {}
          obj.userId = response.data.record[i].userId
          obj.name = response.data.record[i].name
          // obj.city = response.data.record[i].city
          obj.mobile = response.data.record[i].mobile
          obj.registerTime = response.data.record[i].registerTime
          obj.income = response.data.record[i].income
          this.accountTable.push(obj)
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
.searchdiv {
  margin: 20px 0 20px 20px;
  width: 500px;
  display: -webkit-flex; /* Safari */
  display: flex;
  justify-content: space-between;
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
  right: 20px;
  bottom: 30px;
}
.block{
  text-align: right;
  width: 100% /* 哈哈 */
}
.dialog_p {
  line-height: 85%;
  /* margin-top: 5px */
}
</style>
