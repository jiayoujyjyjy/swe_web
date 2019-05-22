<template>
  <el-container>
    <el-main class="clientlistmain">

      <!--根据手机号查询客户信息-->
      <div class="searchdiv">
        <el-autocomplete
          class="inline-input"
          v-model="input"
          :fetch-suggestions="querySearch"
          placeholder="请输入手机号"
          :trigger-on-focus="false"
          @select="clientQueBt"
          @keyup.enter.native="clientQueBt">
        </el-autocomplete>
        <el-button type="primary" size="medium" @click="clientQueBt">客户查询</el-button>
        <el-button type="primary" size="medium" @click="queAllBt">查找全部</el-button>
      </div>

      <p></p>

      <!-- 客户表格 -->
      <el-table
        :data="clientTable"
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
          label="序号"
          header-align="center"
          min-width="4%">
          <template slot-scope="scope">
            {{clientTabNum + scope.$index}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          header-align="center"
          min-width="10%">
        </el-table-column>
        <!-- <el-table-column
          prop="company"
          label="公司"
          header-align="center"
          min-width="20%">
        </el-table-column> -->
        <el-table-column
          prop="city"
          label="城市"
          header-align="center"
          min-width="20%">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="联系方式"
          header-align="center"
          min-width="10%">
        </el-table-column>
        <el-table-column
          prop="registerTime"
          label="注册时间"
          header-align="center"
          min-width="20%">
        </el-table-column>
        <el-table-column
          prop="chargingPile"
          label="拥有充电桩"
          header-align="center"
          min-width="10%">
          <template slot-scope="scope">
            <el-button type="text" @click="chargingPileBt(scope.$index)">详情</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="account"
          label="账户"
          header-align="center"
          min-width="15%">
        </el-table-column> -->
        <!-- <el-table-column
          prop="msg"
          label="备注"
          header-align="center"
          min-width="5%">
        </el-table-column> -->
        <!-- <el-table-column
          label="操作"
          header-align="center"
          min-width="15%">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-edit" @click="clientEditBt(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" size="small" icon="el-icon-delete" @click="clientDeleteBt(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column> -->
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
        <el-button type="success" diaplay="inline" icon="el-icon-circle-plus-outline" @click="clientAddBt">新增客户</el-button>
        <el-button type="success" diaplay="inline" icon="el-icon-tickets" @click="clientBatchDelBt">批量删除</el-button>
      </div>
    </el-footer> -->

    <!--新增/编辑对话框-->
    <el-dialog title="客户信息" width="430px" top="10vh" :visible.sync="dialogEditVisible" center>
      <div style="margin-right: 20px;">
        <el-form :model="clientForm" :rules="rules" label-width="100px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="clientForm.name"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="mobile">
            <el-input v-model="clientForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="账户" prop="account">
            <el-input v-model="clientForm.account"></el-input>
          </el-form-item>
          <el-form-item label="拥有充电桩">
            <div style="width: 100%;height: 100px;border: 1px solid silver;overflow-y:auto; overflow-x:auto;">
              <el-tag
                :key="sn"
                v-for="sn in dynamicSN"
                closable
                :disable-transitions="false"
                @close="handleClose(sn)">
                {{sn}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="snInputVisible"
                v-model="snInputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ SN</el-button>
            </div>
          </el-form-item>
          <el-form-item label="备注" prop="msg">
            <el-input v-model="clientForm.msg"></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 40px;">
            <el-button type="primary" @click="clientChangeConfirm">确定</el-button>
            <el-button @click="dialogEditVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="title" class="dialog-title" style="font-size:16px">{{operationName}}</div>
    </el-dialog>

    <!--客户拥有充电桩具体情况对话框-->
    <el-dialog :title="chargingPileDialogTitle" width="500px" top="10vh" :visible.sync="dialogchargingPileVisible" center>
      <div>
        <el-table
          :data="chargingPileTabData"
          style="width: 100%"
          max-height="450"
          >
          <el-table-column
            label="序号"
            header-align="center"
            align="center"
            min-width="15%">
            <template slot-scope="scope">
              {{diaTabNum + scope.$index}}
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            header-align="center"
            align="center"
            min-width="50%">
          </el-table-column>
          <el-table-column
            prop="sn"
            label="sn"
            header-align="center"
            align="center"
            min-width="40%">
          </el-table-column>
        </el-table>
      </div>
      <div class="block" style="margin-top:15px;">
        <el-pagination
          @current-change="handlePaginationChange_Dia"
          :current-page="param.currentPage_DiaDev"
          :page-size="param.pagesize_DiaDev"
          layout="total, prev, pager, next, jumper"
          :total="eltotal_Dia">
        </el-pagination>
      </div>
    </el-dialog>

    <!--删除客户信息对话框-->
    <el-dialog
      title="提示"
      :visible.sync="dialogDelVisible"
      width="20%"
      center>
      <span>确定删除客户{{clientName}}的信息吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelVisible = false">取 消</el-button>
        <el-button type="primary" @click="clientDelConfirm">确 定</el-button>
      </span>
    </el-dialog>

  </el-container>
</template>

<script>
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'
export default {
  data () {
    // 手机号验证
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (value.length !== 11) {
        callback(new Error('请输入11位手机号'))
      }
    }
    return {
      param: {
        'currentPage': 1,
        'pagesize': 8,
        'currentPage_DiaDev': 1, // 客户拥有设备对话框当前页
        'pagesize_DiaDev': 8
      },
      input: '', // 特定客户查询输入
      title: [],
      dialogEditVisible: false,
      dialogDelVisible: false,
      dialogchargingPileVisible: false,
      chargingPileDialogTitle: '', // 客户拥有充电桩具体信息对话框标题
      eltotal: 0, // 分页器中的记录总数
      eltotal_Dia: 0, // 分页器中的记录总数
      clientTabNum: 1, // 用来计算客户列表表格顺序
      diaTabNum: 1, // 用来计算对话框表格序号
      clientName: '',
      clientTable: null,
      chargingPileTabData: null,
      indexList: [], // 用于批量删除
      operationName: '',
      dynamicSN: ['1001', '1002', '1003'],
      snInputVisible: false,
      snInputValue: '',
      clientForm: {
        name: '',
        mobile: '',
        account: '',
        msg: ''
      },
      rules: {
        mobile: [
          {validator: validatePhone, trigger: 'blur'}
        ]
      }
    }
  },
  created: function () {
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    // back分页获取客户列表
    this.backCustomerListQue()
  },
  mounted: function () {
    this.title = this.loadAll()
  },
  methods: {
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
      return [{
        value: '客户'
      }, {
        value: '李四'
      }, {
        value: '赵五'
      }]
    },
    clientQueBt: function () {
      if (this.input === '') {
        this.queAllBt()
        return
      }
      this.param.mobile = this.input
      this.input = ''
      this.backCustomerSearch()
    },
    // 编辑按钮
    clientEditBt: function (index) {
      this.clientForm.name = this.clientTable[index].name
      this.clientForm.city = this.clientTable[index].city
      this.clientForm.registerTime = this.clientTable[index].registerTime
      this.clientForm.mobile = this.clientTable[index].mobile
      // this.clientForm.account = this.clientTable[index].account
      // this.clientForm.msg = this.clientTable[index].msg
      this.dynamicSN = ['1001', '1002', '1003']
      this.operationName = '编辑信息'
      this.dialogEditVisible = true
    },
    // 删除按钮
    clientDeleteBt: function (index) {
      this.clientName = this.clientTable[index].name
      this.dialogDelVisible = true
    },
    // 批量删除按钮
    clientBatchDelBt: function () {
      console.log('clientBatchDel')
    },
    // 新增按钮
    clientAddBt: function () {
      this.clientForm.name = ''
      this.clientForm.mobile = ''
      this.clientForm.account = ''
      this.clientForm.msg = ''
      this.dynamicSN = []
      this.operationName = '新增客户'
      this.dialogEditVisible = true
    },
    // 批量删除
    handleCheckChange: function (index, row) {
      console.log(index)
      console.log(this.clientTable[index].checked)
      this.indexList = []
      for (let i = 0; i < this.clientTable.length; i++) {
        if (this.clientTable[i].checked === true) {
          this.indexList.push(this.clientTable[i].name)
        }
      }
      console.log(this.indexList)
    },
    // 查询所有信息,默认回到第一页
    queAllBt: function () {
      this.input = ''
      this.param.currentPage = 1
      this.backCustomerListQue()
    },
    // 拥有充电桩详情
    chargingPileBt: function (index) {
      this.param.uid = this.clientTable[index].userId
      this.backCustomerNetListQue()
      this.dialogchargingPileVisible = true
      this.chargingPileDialogTitle = this.clientTable[index].name
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      this.clientTabNum = this.param.pagesize * (value - 1) + 1
      this.param.currentPage = value
      this.backCustomerListQue()
    },
    /*
    *
    *   ******** 对话框操作 ********
    *
    */
    // 对话框修改确认按钮
    clientChangeConfirm: function () {
      console.log('edit')
      console.log(this.clientForm.msg)
    },
    // 对话框删除确认按钮
    clientDelConfirm: function () {
      console.log('clientdel')
    },
    handleClose: function (sn) {
      this.dynamicSN.splice(this.dynamicSN.indexOf(sn), 1)
      console.log(this.dynamicSN)
    },
    showInput: function () {
      this.snInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm: function () {
      let snInputValue = this.snInputValue
      if (snInputValue) {
        this.dynamicSN.push(snInputValue)
      }
      this.snInputVisible = false
      this.snInputValue = ''
      console.log(this.dynamicSN)
    },
    // 客户拥有设备对话框分页器
    handlePaginationChange_Dia: function (value) {
      this.diaTabNum = this.param.pagesize_DiaDev * (value - 1) + 1
      this.param.currentPage_DiaDev = value
      this.backCustomerNetListQue()
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
        this.clientTable = []
        for (let i = 0; i < response.data.record.length; i++) {
          let obj = {}
          obj.userId = response.data.record[i].userId
          obj.name = response.data.record[i].name
          obj.city = response.data.record[i].city
          obj.mobile = response.data.record[i].mobile
          obj.registerTime = response.data.record[i].registerTime
          this.clientTable.push(obj)
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
        this.clientTable = []
        for (let i = 0; i < response.data.record.length; i++) {
          let obj = {}
          obj.userId = response.data.record[i].userId
          obj.name = response.data.record[i].name
          obj.city = response.data.record[i].city
          obj.mobile = response.data.record[i].mobile
          obj.registerTime = response.data.record[i].registerTime
          this.clientTable.push(obj)
        }
      }.bind(this))
    },
    // 分页获取客户下的网关列表
    backCustomerNetListQue: function () {
      back.customerNetListQue(this.param).then(function (response) {
        console.log(response)
        console.log('分页获取客户下的网关列表')
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.eltotal_Dia = response.data.total
        if (response.data.record) {
          this.chargingPileTabData = []
          for (let i = 0; i < response.data.record.length; i++) {
            let obj = {}
            obj.name = response.data.record[i].name
            obj.sn = response.data.record[i].sn
            this.chargingPileTabData.push(obj)
          }
        } else {
          this.chargingPileTabData = []
        }
      }.bind(this))
    }
  }
}
</script>

<style scoped>
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
  bottom: 35px;
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
.inline-input {
  margin-right:20px;
  width: 200px;
}
</style>
