<template>
  <el-container>
    <el-main class="alarmContactmain">

      <el-table
        :data="alarmContactTabData"
        style="width: 95%;margin: 0 auto"
        max-height="540"
        class="tableView"
        >
        <el-table-column
          prop="name"
          label="姓名"
          header-align="center"
          min-width="20%">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="联系方式"
          header-align="center"
          min-width="20%">
        </el-table-column>
        <el-table-column
          prop="chargingTitle"
          label="充电桩"
          header-align="center"
          min-width="20%">
        </el-table-column>
        <el-table-column
          prop="content"
          label="启用"
          header-align="center"
          min-width="15%">
        </el-table-column>
        <el-table-column
          label="操作"
          header-align="center"
          min-width="25%">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-edit" @click="alarmContactEditBt(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" size="small" icon="el-icon-delete" @click="alarmContactDelBt(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-footer class="paginationfooter" height="60px">
        <div class="block">
          <el-pagination
            @current-change="handlePaginationChange"
            :current-page="currentPage"
            :page-size="pagesize"
            layout="total, prev, pager, next, jumper"
            :total="eltotal">
          </el-pagination>
        </div>
      </el-footer>

    </el-main>

    <el-footer height="60px">
      <div class="footer">
        <el-button type="success" diaplay="inline" icon="el-icon-circle-plus-outline" @click="contactAddBt">新增报警联系人</el-button>
      </div>
    </el-footer>

    <!--编辑/新增对话框-->
    <el-dialog title="编辑用户信息" width="430px" top="10vh" :visible.sync="dialogEditVisible" center>
      <div style="margin-right: 20px;">
        <el-form :model="dialogForm" :rules="rules" ref="dialogForm" label-width="100px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="dialogForm.name"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="dialogForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="充电桩" prop="chargingTitle">
            <el-input v-model="dialogForm.chargingTitle"></el-input>
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
      currentPage: 1,
      pagesize: 8, // 每页显示的记录数目
      eltotal: 0, // 分页器中的记录总数
      alarmContactTabNum: 1, // 用来计算表格序号
      alarmContactTabData: null,
      operationName: '', // 编辑或新增对话框标题
      dialogEditVisible: false,
      dialogForm: {
        name: '',
        phone: '',
        chargingTitle: '',
        content: '',
        flag: ''
      },
      alarmContactData: [{
        name: '用户01',
        phone: '13588767140',
        sn: '1001',
        chargingTitle: '高科技企业孵化园区A#1',
        content: '',
        flag: true
      }, {
        name: '用户02',
        phone: '13588767140',
        sn: '1001',
        chargingTitle: '高科技企业孵化园区A#1',
        content: '',
        flag: true
      }, {
        name: '用户03',
        phone: '13588767140',
        sn: '1001',
        chargingTitle: '高科技企业孵化园区A#1',
        content: '',
        flag: true
      }, {
        name: '用户04',
        phone: '13588767140',
        sn: '1001',
        chargingTitle: '高科技企业孵化园区A#1',
        content: '',
        flag: true
      }, {
        name: '用户05',
        phone: '13588767140',
        sn: '1001',
        chargingTitle: '高科技企业孵化园区A#1',
        content: '',
        flag: true
      }, {
        name: '用户06',
        phone: '13588767140',
        sn: '1001',
        chargingTitle: '高科技企业孵化园区A#1',
        content: '',
        flag: true
      }, {
        name: '用户07',
        phone: '13588767140',
        sn: '1001',
        chargingTitle: '高科技企业孵化园区A#1',
        content: '',
        flag: true
      }, {
        name: '用户08',
        phone: '13588767140',
        sn: '1001',
        chargingTitle: '高科技企业孵化园区A#1',
        content: '',
        flag: true
      }, {
        name: '用户08',
        phone: '13588767140',
        sn: '1001',
        chargingTitle: '高科技企业孵化园区A#1',
        content: '',
        flag: true
      }, {
        name: '用户08',
        phone: '13588767140',
        sn: '1001',
        chargingTitle: '高科技企业孵化园区A#1',
        content: '',
        flag: true
      }, {
        name: '用户08',
        phone: '13588767140',
        sn: '1001',
        chargingTitle: '高科技企业孵化园区A#1',
        content: '',
        flag: true
      }],
      roleSelection: [{
        value: '超级管理员',
        label: '超级管理员'
      }, {
        value: '管理员',
        label: '管理员'
      }, {
        value: '操作员',
        label: '操作员'
      }],
      rules: {
        phone: [
          {validator: validatePhone, trigger: 'blur'}
        ]
      }
    }
  },
  mounted: function () {
    this.eltotal = this.alarmContactData.length
    this.dataProcess()
    this.initTable()
  },
  methods: {
    dataProcess: function () {
      for (let i = 0; i < this.alarmContactData.length; i++) {
        if (this.alarmContactData[i].flag === true) {
          this.alarmContactData[i].content = '√'
        } else {
          this.alarmContactData[i].content = '×'
        }
      }
    },
    // 初始化表格，默认加载第一页数据
    initTable: function () {
      let num = 0
      let pageTableData = []
      if (this.alarmContactData.length >= this.pagesize) {
        for (let i = 0; i < this.pagesize; i++) {
          let obj = {}
          obj.name = this.alarmContactData[i].name
          obj.phone = this.alarmContactData[i].phone
          obj.sn = this.alarmContactData[i].sn
          obj.chargingTitle = this.alarmContactData[i].chargingTitle
          obj.content = this.alarmContactData[i].content
          obj.flag = this.alarmContactData[i].flag
          pageTableData[num] = obj
          num = num + 1
        }
        this.alarmContactTabData = pageTableData
      } else {
        for (let i = 0; i < this.alarmContactData.length; i++) {
          let obj = {}
          obj.name = this.alarmContactData[i].name
          obj.phone = this.alarmContactData[i].phone
          obj.sn = this.alarmContactData[i].sn
          obj.chargingTitle = this.alarmContactData[i].chargingTitle
          obj.content = this.alarmContactData[i].content
          obj.flag = this.alarmContactData[i].flag
          pageTableData[num] = obj
          num = num + 1
        }
        this.alarmContactTabData = pageTableData
      }
    },
    // 每次切换页码之前清空table数据
    handlePaginationChange: function (value) {
      console.log(value)
      this.alarmContactTabData = []
      this.currentPage = value
      let num = 0
      let length
      if (this.pagesize * this.currentPage >= this.alarmContactData.length) {
        length = this.alarmContactData.length
      } else {
        length = this.pagesize * this.currentPage
      }
      for (let i = this.pagesize * (this.currentPage - 1); i < length; i++) {
        let obj = {}
        obj.name = this.alarmContactData[i].name
        obj.phone = this.alarmContactData[i].phone
        obj.sn = this.alarmContactData[i].sn
        obj.chargingTitle = this.alarmContactData[i].chargingTitle
        obj.content = this.alarmContactData[i].content
        obj.flag = this.alarmContactData[i].flag
        this.alarmContactTabData[num] = obj
        num = num + 1
        this.alarmContactTabNum = this.pagesize * (this.currentPage - 1) + 1
      }
      console.log(this.alarmContactTabData)
    },
    // 编辑信息按钮
    alarmContactEditBt: function (index) {
      this.operationName = '编辑信息'
      this.dialogForm.name = this.alarmContactTabData[index].name
      this.dialogForm.phone = this.alarmContactTabData[index].phone
      this.dialogForm.chargingTitle = this.alarmContactTabData[index].chargingTitle
      this.dialogForm.content = this.alarmContactTabData[index].content
      this.dialogForm.flag = this.alarmContactTabData[index].flag
      this.dialogEditVisible = true
      if (this.$refs.dialogForm !== undefined) {
        this.$refs.dialogForm.clearValidate()
      }
    },
    // 删除按钮
    alarmContactDelBt: function () {
      console.log('456')
    },
    changeswitch: function () {
      console.log('change')
    },
    // 编辑联系人按钮
    contactAddBt: function () {
      this.dialogForm.name = ''
      this.dialogForm.phone = ''
      this.dialogForm.chargingTitle = ''
      this.dialogForm.content = ''
      this.dialogForm.flag = ''
      this.operationName = '新增联系人'
      this.dialogEditVisible = true
      if (this.$refs.dialogForm !== undefined) {
        this.$refs.dialogForm.clearValidate()
      }
    },
    /*
    *
    *   ******** 对话框操作 ********
    *
    */
    // 对话框确认修改按钮
    dialogEditConfirm: function () {
      console.log('789')
    },
    roleSelected: function (value) {
      console.log(this.dialogForm.role)
    }
  }
}
</script>

<style scoped>
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
/* .el-dialog--center .el-dialog__body {
  text-align: left;
} */
</style>
