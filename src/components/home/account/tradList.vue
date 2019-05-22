<template>
  <el-container>
    <el-main class="tradListmain">

      <!-- 资金结算条件选择 -->

      <div class="searchdiv">
        <el-input v-model="input" placeholder="请输入客户或受益人手机号" @keyup.enter.native="clientTradlistQueBt" style="margin-right:15px;width:300px;"></el-input>
        <el-date-picker
          v-model="timeRange"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary" size="medium" @click="clientTradlistQueBt" style="margin: 0 15px">订单查询</el-button>
        <el-button type="primary" size="medium" @click="queAllBt">查找全部</el-button>
      </div>

      <!-- 订单表格 -->
      <el-table
        :data="tradList"
        style="width: 100%"
        max-height = "570">
        <el-table-column
          prop="paymentNo"
          label="订单编号"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="paymentTime"
          label="时间"
          header-align="center">
        </el-table-column>
        <el-table-column
          prop="income"
          label="收益"
          header-align="center">
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

  </el-container>
</template>

<script>
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
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
        }],
        // 设置禁用状态,默认保存近三个月的数据
        disabledDate (time) {
          return (time.getTime() > Date.now() || time.getTime() < Date.now() - 1000 * 60 * 60 * 24 * 90)
        }
      },
      param: {
        'userId': 0,
        'Authorization': '',
        'phone': '',
        'start': '',
        'end': '',
        'currentPage': 1, // 资金结算列表换页
        'pagesize': 8
      },
      // ******  搜索部分  ******
      input: '',
      timeRange: '',
      timeStart: '', // 转换格式后的起始时间
      timeEnd: '', // 转换格式后的结束时间
      clientTradlistSearch: [], // 搜索后的客户结算信息，客户是唯一的，永远只有一条数据
      // ******  列表  ******
      eltotal: 0, // 资金结算列表总数
      tradList: [{
        paymentNo: 'dds4546q13456g543',
        paymentTime: '2018-11-1',
        income: 20
      }, {
        paymentNo: 'dds4546q13456g543',
        paymentTime: '2018-11-1',
        income: 20
      }, {
        paymentNo: 'dds4546q13456g543',
        paymentTime: '2018-11-1',
        income: 20
      }, {
        paymentNo: 'dds4546q13456g543',
        paymentTime: '2018-11-1',
        income: 20
      }, {
        paymentNo: 'dds4546q13456g543',
        paymentTime: '2018-11-1',
        income: 20
      }, {
        paymentNo: 'dds4546q13456g543',
        paymentTime: '2018-11-1',
        income: 20
      }, {
        paymentNo: 'dds4546q13456g543',
        paymentTime: '2018-11-1',
        income: 20
      }, {
        paymentNo: 'dds4546q13456g543',
        paymentTime: '2018-11-1',
        income: 20
      }]
    }
  },
  mounted: function () {
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    // 查找全部？
  },
  methods: {
    // 根据条件查找订单
    clientTradlistQueBt: function () {
      console.log(this.timeRange)
      this.param.start = this.timeStart = this.GMTToStr(this.timeRange[0])
      this.param.end = this.timeEnd = this.GMTToStr(this.timeRange[1])
      console.log(this.timeStart)
      console.log(this.timeEnd)
      console.log(this.param)
      if (this.input === '') {
        this.queAllBt()
        return
      }
      this.param.currentPage = 1 // 防止查另一个用户分页设置为2，相当于复位操作
      this.param.mobile = this.input
      this.input = ''
      this.backCustomerOrderHisListQue()
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
    // 查询所有信息对话框
    queAllBt: function () {
      this.param.currentPage = 1
      this.input = ''
      // this.back()
    },
    // 列表换页
    handlePaginationChange: function (value) {
      console.log(value)
      // this.userTabNUm = this.param.pagesize * (value - 1) + 1
      this.param.currentPage = value
      this.backCustomerOrderHisListQue()
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 分页获取客户列表

    // 根据手机号分页获取某一用户一段时间内的历史转账订单列表
    backCustomerOrderHisListQue: function () {
      back.customerOrderHisListQue(this.param).then(function (response) {
        console.log(response)
        console.log('搜索用户')
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.eltotal = response.data.total
        this.tradList = []
        for (let i = 0; i < response.data.record.length; i++) {
          let obj = {}
          obj.paymentNo = response.data.record[i].paymentNo
          obj.paymentTime = response.data.record[i].paymentTime
          obj.income = response.data.record[i].income
          this.tradList.push(obj)
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
  width: 800px;
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
  width: 100%
}
.dialog_p {
  line-height: 85%;
  /* margin-top: 5px */
}
</style>
