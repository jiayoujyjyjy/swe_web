<template>
 <el-container>
    <div class="systemUserList">
      <div style="width:100%">
        <el-table
          :data="systemUserTabData"
          max-height="540"
          class="tableView"
          >
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
            min-width="10%">
            <template slot-scope="scope">
              {{systemUserTabNum + scope.$index}}
            </template>
          </el-table-column>
          <el-table-column
            prop="nickName"
            label="用户名"
            header-align="center"
            min-width="6%">
          </el-table-column>
          <el-table-column
            prop="userId"
            label="userId"
            header-align="center"
            min-width="10%">
          </el-table-column>
          <el-table-column
            prop="role"
            label="角色"
            header-align="center"
            min-width="10%">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
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
            prop="content"
            label="启用"
            header-align="center"
            min-width="10%">
          </el-table-column>
          <el-table-column
            label="操作"
            header-align="center"
            min-width="25%">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-edit" @click="systemUserEditBt(scope.$index, scope.row)">编辑</el-button>
              <el-button type="text" size="small" icon="el-icon-delete" @click="systemUserDelBt(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="paginationfooter" height="60px">
          <div class="block">
            <el-pagination
              @current-change="handlePaginationChange"
              :current-page="currentPage"
              :page-size="pagesize"
              layout="total, prev, pager, next, jumper"
              :total="eltotal">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>

    <el-footer height="60px">
      <div class="footer">
        <el-button type="success" diaplay="inline" icon="el-icon-circle-plus-outline" @click="systemUserAddBt">新增用户</el-button>
        <el-button type="success" diaplay="inline" icon="el-icon-tickets" @click="systemUserBatchDelBt">批量删除</el-button>
      </div>
    </el-footer>
    <!-- 必须使用v-show,如果使用v-if和v-else,v-else中的模块未渲染，在mounted中执行图表加载函数将
    获取不到div.如果想使用v-if和v-else,就不要使用el-radio-button，用两个el-button替代效果，
    将图表加载函数放在button的click事件中执行-->

    <!--删除系统用户对话框-->
    <el-dialog
      title="提示"
      :visible.sync="dialogDelVisible"
      width="20%"
      center>
      <span>确定删除系统用户{{systemUserName}}吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelVisible = false">取 消</el-button>
        <el-button type="primary" @click="systemUserDelConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑/新增对话框-->
    <el-dialog title="编辑用户信息" width="430px" top="10vh" :visible.sync="dialogEditVisible" center>
      <div style="margin-right: 20px;">
        <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="100px">
          <el-form-item label="用户名" prop="nickName">
            <el-input v-model="dialogForm.nickName"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="dialogForm.role" placeholder="请选择" @change="roleSelected">
              <el-option
                v-for="item in roleSelection"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="dialogForm.name"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="dialogForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="启 用">
            <el-switch
              v-model="dialogForm.flag"
              active-color="#13ce66"
              inactive-color="#ff4949"
              inactive-text=""
              @change="changeswitch">
            </el-switch>
          </el-form-item>
          <el-form-item style="margin-left: 30px;">
            <el-button type="primary" @click="dialogEditConfirm">确定</el-button>
            <el-button @click="dialogEditVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="title" class="dialog-title" style="font-size:16px">{{operationName}}</div>
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
    // 校验用户名
    var checkNickName = (rule, value, callback) => {
      var reg = /^[\u4e00-\u9fff\w]{3,18}$/
      if (value === '') {
        return callback(new Error('用户名不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('只能包含数字、字母、汉字和下划线，长度在3~18之间'))
      } else {
        callback()
      }
    }
    return {
      param: {
        'userId': 0,
        'Authorization': ''
      },
      currentPage: 1,
      pagesize: 8, // 每页显示的记录数目
      eltotal: 0, // 分页器中的记录总数
      systemUserTabNum: 1, // 用来计算表格序号
      systemUserTabData: null,
      dialogDelVisible: false,
      systemUserName: '',
      indexList: [],
      operationName: '', // 编辑或新增对话框标题
      dialogEditVisible: false,
      dialogForm: {
        nickName: '',
        role: '',
        name: '',
        phone: '',
        content: '',
        flag: ''
      },
      systemUserData: [{
        checked: false,
        nickName: '用户1',
        userId: '091',
        role: '超级管理员',
        name: '用户01',
        phone: '13588767140',
        content: '',
        flag: true
      }, {
        checked: false,
        nickName: '用户2',
        userId: '092',
        role: '一级管理员',
        name: '用户02',
        phone: '13588767140',
        content: '',
        flag: true
      }, {
        checked: false,
        nickName: '用户3',
        userId: '093',
        role: '一级管理员',
        name: '用户03',
        phone: '13588767140',
        content: '',
        flag: true
      }, {
        checked: false,
        nickName: '用户4',
        userId: '094',
        role: '一级管理员',
        name: '用户04',
        phone: '13588767140',
        content: '',
        flag: true
      }, {
        checked: false,
        nickName: '用户5',
        userId: '095',
        role: '二级管理员',
        name: '用户05',
        phone: '13588767140',
        content: '',
        flag: true
      }, {
        checked: false,
        nickName: '用户6',
        userId: '096',
        role: '二级管理员',
        name: '用户06',
        phone: '13588767140',
        content: '',
        flag: true
      }, {
        checked: false,
        nickName: '用户7',
        userId: '097',
        role: '二级管理员',
        name: '用户07',
        phone: '13588767140',
        content: '',
        flag: true
      }, {
        checked: false,
        nickName: '用户8',
        userId: '098',
        role: '二级管理员',
        name: '用户08',
        phone: '13588767140',
        content: '',
        flag: true
      }, {
        checked: false,
        nickName: '用户8',
        userId: '098',
        role: '二级管理员',
        name: '用户08',
        phone: '13588767140',
        content: '',
        flag: true
      }, {
        checked: false,
        nickName: '用户8',
        userId: '098',
        role: '二级管理员',
        name: '用户08',
        phone: '13588767140',
        content: '',
        flag: true
      }, {
        checked: false,
        nickName: '用户8',
        userId: '098',
        role: '二级管理员',
        name: '用户08',
        phone: '13588767140',
        content: '',
        flag: true
      }],
      roleSelection: [{
        value: '超级管理员',
        label: '超级管理员'
      }, {
        value: '一级管理员',
        label: '一级管理员'
      }, {
        value: '二级管理员',
        label: '二级管理员'
      }],
      rules: {
        phone: [
          {validator: validatePhone, trigger: 'blur'}
        ],
        nickName: [
          { validator: checkNickName, trigger: 'blur' }
        ]
      }
    }
  },
  mounted: function () {
    this.param.userId = sessionGetStore('userId')
    this.param.Authorization = sessionGetStore('Authorization')
    this.eltotal = this.systemUserData.length
    this.dataProcess()
    this.initTable()
  },
  methods: {
    dataProcess: function () {
      for (let i = 0; i < this.systemUserData.length; i++) {
        if (this.systemUserData[i].flag === true) {
          this.systemUserData[i].content = '√'
        } else {
          this.systemUserData[i].content = '×'
        }
      }
    },
    // 初始化表格，默认加载第一页数据
    initTable: function () {
      let num = 0
      let pageTableData = []
      if (this.systemUserData.length >= this.pagesize) {
        for (let i = 0; i < this.pagesize; i++) {
          let obj = {}
          obj.nickName = this.systemUserData[i].nickName
          obj.userId = this.systemUserData[i].userId
          obj.role = this.systemUserData[i].role
          obj.name = this.systemUserData[i].name
          obj.phone = this.systemUserData[i].phone
          obj.content = this.systemUserData[i].content
          obj.checked = this.systemUserData[i].checked
          obj.flag = this.systemUserData[i].flag
          pageTableData[num] = obj
          num = num + 1
        }
        this.systemUserTabData = pageTableData
      } else {
        for (let i = 0; i < this.systemUserData.length; i++) {
          let obj = {}
          obj.nickName = this.systemUserData[i].nickName
          obj.userId = this.systemUserData[i].userId
          obj.role = this.systemUserData[i].role
          obj.name = this.systemUserData[i].name
          obj.phone = this.systemUserData[i].phone
          obj.content = this.systemUserData[i].content
          obj.checked = this.systemUserData[i].checked
          obj.flag = this.systemUserData[i].flag
          pageTableData[num] = obj
          num = num + 1
        }
        this.systemUserTabData = pageTableData
      }
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      this.systemUserTabData = []
      this.currentPage = value
      let num = 0
      let length
      if (this.pagesize * this.currentPage >= this.systemUserData.length) {
        length = this.systemUserData.length
      } else {
        length = this.pagesize * this.currentPage
      }
      for (let i = this.pagesize * (this.currentPage - 1); i < length; i++) {
        let obj = {}
        obj.nickName = this.systemUserData[i].nickName
        obj.userId = this.systemUserData[i].userId
        obj.role = this.systemUserData[i].role
        obj.name = this.systemUserData[i].name
        obj.phone = this.systemUserData[i].phone
        obj.content = this.systemUserData[i].content
        obj.flag = this.systemUserData[i].flag
        obj.checked = this.systemUserData[i].checked
        this.systemUserTabData[num] = obj
        num = num + 1
        this.systemUserTabNum = this.pagesize * (this.currentPage - 1) + 1
      }
      console.log(this.systemUserTabData)
    },
    // 编辑
    systemUserEditBt: function (index) {
      this.operationName = '编辑信息'
      this.dialogForm.nickName = this.systemUserTabData[index].nickName
      this.dialogForm.role = this.systemUserTabData[index].role
      this.dialogForm.name = this.systemUserTabData[index].name
      this.dialogForm.phone = this.systemUserTabData[index].phone
      this.dialogForm.content = this.systemUserTabData[index].content
      this.dialogForm.flag = this.systemUserTabData[index].flag
      this.dialogEditVisible = true
      if (this.$refs.dialogForm !== undefined) {
        this.$refs.dialogForm.clearValidate()
      }
    },
    // 删除
    systemUserDelBt: function (index) {
      this.systemUserName = this.systemUserTabData[index].name
      this.dialogDelVisible = true
    },
    // 新增
    systemUserAddBt: function () {
      this.dialogForm.nickName = ''
      this.dialogForm.role = ''
      this.dialogForm.name = ''
      this.dialogForm.phone = ''
      this.dialogForm.content = ''
      this.dialogForm.flag = ''
      this.operationName = '新增用户'
      this.dialogEditVisible = true
      if (this.$refs.dialogForm !== undefined) {
        this.$refs.dialogForm.clearValidate()
      }
    },
    // 批量删除
    systemUserBatchDelBt: function () {
      console.log('456')
    },
    /*
    *
    *   ******** 对话框操作 ********
    *
    */
    // 对话框删除确认按钮
    systemUserDelConfirm: function () {
      console.log('hongshidel')
      this.backuserDel()
    },
    dialogEditConfirm: function () {
      console.log('789')
    },
    roleSelected: function (value) {
      console.log(this.dialogForm.role)
    },
    changeswitch: function () {
      console.log('789')
    },
    handleCheckChange: function (index, row) {
      console.log(index)
      console.log(this.systemUserTabData[index].checked)
      this.indexList = []
      for (let i = 0; i < this.systemUserTabData.length; i++) {
        if (this.systemUserTabData[i].checked === true) {
          this.indexList.push(this.systemUserTabData[i].userId)
        }
      }
      console.log(this.indexList)
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 删除鸿世用户
    backuserDel: function () {
      back.userDel(this.param).then(function (response) {
        console.log('删除鸿世管理员')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          // return
        }
        // 信息处理
      }.bind(this))
    }
  }
}
</script>

<style scoped>
.el-container {
  background-color: #D7DEE8;
  padding: 10px;
}
.systemUserList {
  width:100%;
}
.block{
  text-align: right;
  width: 100%
}
.paginationfooter {
  position: absolute;
  bottom: 140px;
  right: 20px;
}
#diagram {
  margin: 0 auto;
  width: 800px;
  height: 400px;
  min-height: 200px;
}
.footer {
  position: absolute;
  left: 230px;
  bottom: 10px;
}
.el-dialog__header {
  background-color: #409EFF;
}
.el-select {
  width: 260px;
}
.el-switch {
  /* float: left; */
}
</style>
