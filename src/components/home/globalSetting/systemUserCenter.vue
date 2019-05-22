<template>
  <el-container>
    <el-main class="systemUserCentermain">

      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="systemUserForm" class="from-inline" label-width="130px">
            <el-form-item label="用户名">
              <el-input readonly v-model="systemUserForm.name"></el-input>
            </el-form-item>
            <el-form-item>
            <el-button type="primary" @click="changenameBt">更改用户名</el-button>
          </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="systemUserForm" class="from-inline" label-width="130px">
            <el-form-item label="手 机">
              <el-input readonly v-model="systemUserForm.mobile"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changephoneBt">更改手机</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="systemUserForm" class="from-inline" label-width="130px">
            <el-form-item label="邮 箱">
              <el-input readonly v-model="systemUserForm.mail"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changemailBt">更改邮箱</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="systemUserForm" class="from-inline" label-width="130px">
            <el-form-item label="公司">
              <el-input readonly v-model="systemUserForm.company"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changecompanyBt">更改公司</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="systemUserForm" class="from-inline" label-width="130px">
            <el-form-item label="用户ID">
              <el-input readonly v-model="systemUserForm.userId"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row v-show="(userAuth == superAdminAuth)">
        <el-col :span="24">
          <el-form :inline="true" :model="systemUserForm" v-show="InvitationCodeVisible" class="from-inline" label-width="130px">
            <el-form-item label="一级管理员邀请码">
              <el-input readonly v-model="systemUserForm.primaryCode"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="generateCode1">刷新</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row v-show="(userAuth == superAdminAuth)">
        <el-col :span="24">
          <el-form :inline="true" :model="systemUserForm" v-show="InvitationCodeVisible" class="from-inline" label-width="130px">
            <el-form-item label="二级管理员邀请码">
              <el-input readonly v-model="systemUserForm.secondaryCode"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="generateCode2">刷新</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="systemUserForm" class="from-inline" label-width="130px">
            <el-form-item label="密 码">
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changepassBt">更改密码</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!-- 更改邮箱对话框 -->
      <el-dialog title="更改邮箱" :visible.sync="emaildialogFormVisible" width="500px" center>
        <el-form ref="emailruleform" :model="emailruleform" :rules="rules" label-width="80px">
          <el-form-item label="邮箱" prop="email">
            <el-input type="text" v-model="emailruleform.email" auto-complete="off" placeholder="请输入邮箱">
            <el-button slot="append" @click.native.prevent="emailGetVeriCode">获取验证码</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="VeriCode">
            <el-input type="text" v-model="emailruleform.VeriCode" auto-complete="off" placeholder="请输入验证码"></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 80px;">
            <el-button type="primary" @click="changePhoneHandleSave('emailruleform')">修改</el-button>
            <el-button @click="emaildialogFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 更改手机号对话框 -->
      <el-dialog title="更改手机号" :visible.sync="phonedialogFormVisible" width="500px" center>
        <el-form ref="phoneruleform" :model="phoneruleform" :rules="rules" label-width="80px">
          <el-form-item label="手机号" prop="phone">
            <el-input type="text" v-model="phoneruleform.phone" auto-complete="off" placeholder="请输入手机号">
            <el-button slot="append" v-show="!passwordComputedTime" @click.native.prevent="phoneGetVeriCode">获取验证码</el-button>
            <el-button slot="append" v-show="passwordComputedTime">已发送({{passwordComputedTime}}s)</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="VeriCode">
            <el-input type="text" v-model="phoneruleform.VeriCode" auto-complete="off" placeholder="请输入验证码"></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 80px;">
            <el-button type="primary" @click="changePhoneHandleSave('phoneruleform')">修改</el-button>
            <el-button @click="phonedialogFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 更改密码对话框 -->
      <el-dialog title="更改密码" :visible.sync="passdialogFormVisible" width="500px" center>
        <el-form ref="passruleform" :model="passruleform" :rules="rules" label-width="80px">
          <el-form-item label="旧密码" prop="oldpass">
            <el-input type="password" v-model="passruleform.oldpass"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newpass">
            <el-input type="password" v-model="passruleform.newpass"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmpass">
            <el-input type="password" v-model="passruleform.confirmpass"></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 100px;">
            <el-button type="primary" @click="passHandleChange">修改</el-button>
            <el-button @click="passdialogFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { back } from 'api'
import { sessionGetStore, sessionRemoveStore, sessionSetStore } from '@/components/config/Utils'
export default {
  data () {
    // 自定义校验规则
    // 旧密码
    var validatePassOld = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'))
      } else {
        if (this.passruleform.newpass !== '') {
          this.$refs.passruleform.validateField('newpass')
        }
        callback()
      }
    }
    // 新密码
    var validatePassNew = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.passruleform.confirmpass !== '') {
          this.$refs.passruleform.validateField('confirmpass')
        }
        callback()
      }
    }
    // 确认新密码
    var validatePassConf = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passruleform.newpass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 校验验证码
    var checkVeriCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('验证码不能为空'))
      } else {
        callback()
      }
    }
    // 手机号验证
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (value.length !== 11) {
        callback(new Error('请输入11位手机号'))
      } else if (value === this.systemUserForm.mobile) {
        callback(new Error('新手机号码不能与旧手机号码相同'))
      } else {
        callback()
      }
    }
    // 邮箱验证
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('邮箱账号不能为空'))
      } else if (!/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(this.emailruleform.email)) {
        callback(new Error('请输入正确的邮箱账号'))
      } else if (value === this.systemUserForm.email) {
        callback(new Error('新邮箱不能与旧邮箱相同'))
      } else {
        callback()
      }
    }
    return {
      param: {
        'name': '',
        'password': '',
        'userId': 0,
        'role': '',
        'mobile': '',
        'email': '',
        'code': '',
        'oldPassword': '',
        'newPassword': '',
        'Authorization': ''
      },
      // 用户整体信息
      systemUserForm: {
        name: '',
        mobile: '',
        mail: '',
        emailState: '',
        password: '',
        oldPassword: '',
        newPassword: '',
        company: '鸿世',
        userId: '',
        primaryCode: '',
        secondaryCode: ''
      },
      phoneruleform: {
        phone: '',
        VeriCode: '',
        VerCodeToken: '',
        VerPhone: ''
      },
      emailruleform: {
        email: '',
        VeriCode: '',
        VerCodeToken: '',
        VerEmail: ''
      },
      passruleform: {
        oldpass: '',
        newpass: '',
        confirmpass: ''
      },
      // 校验规则
      rules: {
        phone: [
          {validator: validatePhone, trigger: 'blur'}
        ],
        email: [
          {validator: validateEmail, trigger: 'blur'}
        ],
        VeriCode: [
          { validator: checkVeriCode, trigger: 'blur' }
        ],
        oldpass: [
          {validator: validatePassOld, trigger: 'blur'},
          {min: 6, max: 16, message: '密码长度必须大于6位小于16位', triiger: 'blur'}
        ],
        newpass: [
          {validator: validatePassNew, trigger: 'blur'},
          {min: 6, max: 16, message: '密码长度必须大于6位小于16位', triiger: 'blur'}
        ],
        confirmpass: [
          {validator: validatePassConf, trigger: 'blur'},
          {min: 6, max: 16, message: '密码长度必须大于6位小于16位', triiger: 'blur'}
        ]
      },
      codeMarker: 0, // 用来区分一级管理员、二级管理员邀请码操作
      InvitationCodeVisible: true,
      userAuth: 1,
      superAdminAuth: 0, // 0超级管理员 1一级管理员 2二级管理员
      phoneVeriCode: '', // 更换手机时的验证码
      passwordComputedTime: 0, // 更换手机短信倒数记时
      phonedialogFormVisible: false, // 手机号修改对话框
      emaildialogFormVisible: false, // 邮箱修改对话框
      passdialogFormVisible: false // 密码修改对话框
    }
  },
  created: function () {
    this.param.userId = sessionGetStore('userId')
    this.systemUserForm.userId = this.param.userId
    this.userAuth = sessionGetStore('role')
    this.param.Authorization = sessionGetStore('Authorization')
  },
  mounted: function () {
    // this.tokenIsDisabled()
    sessionRemoveStore('userCenter')
    this.backUserInfoQue()
  },
  methods: {
    // 更改用户名
    changenameBt () {
      this.$prompt('用户名', '更改用户名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[\u4e00-\u9fff\w]{3,18}$/,
        inputErrorMessage: '只能包含数字、字母、汉字和下划线，长度在3~18之间'
      }).then(({value}) => {
        this.param.name = value
        this.backUserInfoMod()
      }).catch(() => {
      })
    },
    // 更改公司
    changecompanyBt () {
      this.$prompt('公司', '更改公司', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({value}) => {
        this.param.company = value
        this.backUserInfoMod()
      }).catch(() => {
      })
    },
    // 更改手机号
    changephoneBt () {
      this.phoneruleform = {phone: '', VeriCode: ''}
      if (this.passTimer !== undefined) {
        clearInterval(this.passTimer)
      }
      this.phonedialogFormVisible = true
      this.passwordComputedTime = 0
      if (this.$refs.phoneruleform !== undefined) {
        this.$refs.phoneruleform.resetFields()
      }
    },
    // 添加/更改邮箱
    changemailBt () {
      this.emailruleform = {email: '', VeriCode: ''}
      this.emaildialogFormVisible = true
    },
    // 更改密码
    changepassBt () {
      this.passruleform.oldpass = ''
      this.passruleform.newpass = ''
      this.passruleform.confirmpass = ''
      this.passdialogFormVisible = true
    },
    // 刷新一级管理员邀请码
    generateCode1: function () {
      this.codeMarker = 1
      this.param.oldCode = this.systemUserForm.primaryCode
      console.log(this.param.oldCode)
      this.backRefreshCode()
      // for (let i = 0; i < 6; i++) {
      //   this.InvitationCode1.code += Math.floor(Math.random() * 10)
      // }
    },
    // 刷新二级管理员邀请码
    generateCode2: function () {
      this.codeMarker = 2
      this.param.oldCode = this.systemUserForm.secondaryCode
      console.log(this.param.oldCode)
      this.backRefreshCode()
    },
    /*
    *
    *   ******** 对话框操作 ********
    *
    */
    // 更换手机，获取验证码
    phoneGetVeriCode: function () {
      if (/^1\d{10}$/gi.test(this.phoneruleform.phone)) {
        this.passwordComputedTime = 60
        this.passTimer = setInterval(() => {
          this.passwordComputedTime--
          if (this.passwordComputedTime === 0) {
            clearInterval(this.passTimer)
          }
        }, 1000)
        this.param.mobile = this.phoneruleform.phone
        // 发送短信验证信息
        this.backSmsCodeQue()
      } else {
        this.notificationInfo('错误提示', '手机号格式不正确')
      }
    },
    // 确认手机号更改
    changePhoneHandleSave () {
      this.$refs.phoneruleform.validate((valid) => {
        if (valid && this.phoneruleform.VeriCode === this.phoneruleform.VerCodeToken) {
          this.backUserInfoMod()
          // this.systemUserForm.mobile = this.phoneruleform.phone
          this.backUserInfoQue()
          this.phonedialogFormVisible = false
          // 清除输入信息
          this.phoneruleform.phone = ''
          this.phoneruleform.VeriCode = ''
        } else if (this.phoneruleform.VeriCode !== this.phoneruleform.VerCodeToken) {
          this.notificationInfo('错误提示', '验证码不正确')
        } else {
          return false
        }
      })
    },
    // 添加/更换邮箱，获取验证码
    emailGetVeriCode: function () {
      if (/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/gi.test(this.emailruleform.email)) {
        console.log('lueluelue')
        this.param.email = this.emailruleform.email
        // 发送邮箱验证信息
        this.backEmailCodeQue()
      } else {
        this.notificationInfo('错误提示', '邮箱格式不正确')
      }
    },
    // 确认邮箱更改
    changeEmailHandleSave () {
      this.$refs.emailruleform.validate((valid) => {
        if (valid && this.emailruleform.VeriCode === this.emailruleform.VerCodeToken) {
          this.backUserInfoMod()
          this.backUserInfoQue()
          this.emaildialogFormVisible = false
          // 清除输入信息
          this.emailruleform.email = ''
          this.emailruleform.VeriCode = ''
        } else if (this.emailruleform.VeriCode !== this.emailruleform.VerCodeToken) {
          this.notificationInfo('错误提示', '验证码不正确')
        } else {
          return false
        }
      })
    },
    // 确认密码修改
    passHandleChange () {
      this.$refs.passruleform.validate((valid) => {
        if (valid) {
          this.param.oldPassword = this.passruleform.oldpass
          this.param.newPassword = this.passruleform.newpass
          this.backUserPassMod()
          this.passdialogFormVisible = false
          this.passruleform.oldpass = ''
          this.passruleform.newpass = ''
          this.passruleform.confirmpass = ''
        } else {
          return false
        }
      })
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 用户信息查询
    backUserInfoQue: function () {
      back.userInfoQue(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        this.systemUserForm.name = response.data.name
        this.systemUserForm.mobile = response.data.mobile
        // this.systemUserForm.mail = response.data.email
        // this.systemUserForm.emailState = response.data.emailState
        this.systemUserForm.company = response.data.company
        this.systemUserForm.primaryCode = response.data.hsManagerCode
        this.systemUserForm.secondaryCode = response.data.hsMaintainerCode
        this.systemUserForm.clientCode = response.data.clientCode
      }.bind(this))
    },
    // 用户信息修改
    backUserInfoMod: function () {
      back.userInfoMod(this.param).then(function (response) {
        console.log(response)
        if (response.errno === 1) {
          this.notificationInfo('修改失败，错误提示：', response.error)
          // 用户信息查询
          this.backUserInfoQue()
          return
        }
        sessionSetStore('userName', this.param.name)
        this.$store.commit('setUserName', this.param.name)
        // this.$store.commit('setUserName', this.systemUserForm.name)
        // 用户信息查询
        this.backUserInfoQue()
      }.bind(this))
    },
    // 用户账号密码修改
    backUserPassMod: function () {
      back.passwordMod(this.param).then(function (response) {
        console.log(response)
        if (response.errno === 1) {
          this.notificationInfo('修改失败，错误提示：', response.error)
          // 用户信息查询
          this.backUserInfoQue()
          return
        }
        console.log('啦啦啦')
        sessionSetStore('userName', this.param.name)
        // this.$store.commit('setUserName', this.systemUserForm.name)
        // 用户信息查询
        this.backUserInfoQue()
      }.bind(this))
    },
    // 发送短信验证信息
    backSmsCodeQue: function () {
      back.smsCodeQue(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        // 存储获取到的验证码
        this.phoneruleform.VerCodeToken = response.data.code
        this.phoneruleform.VerPhone = this.param.mobile
      }.bind(this))
    },
    // 发送邮件验证信息
    backEmailCodeQue: function () {
      back.mailCodeQue(this.param).then(function (response) {
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          // return
        }
        // 存储获取到的验证码
        // this.emailruleform.VerCodeToken = response.data.code
        // this.emailruleform.VerEmail = this.param.email
      }.bind(this))
    },
    // 刷新邀请码
    backRefreshCode: function () {
      back.refreshCode(this.param).then(function (response) {
        console.log('刷新邀请码')
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        if (this.codeMarker === 1) {
          this.systemUserForm.primaryCode = response.data.code
        } else {
          this.systemUserForm.secondaryCode = response.data.code
        }
      }.bind(this))
    },
    /*
    *
    *   ******** 辅助方法函数 ********
    *
    */
    // token有有效期，请求前需要判断token是否过期
    // tokenIsDisabled: function () {
    //   // 判断token是否过期
    //   let dateNow = new Date()
    //   let dateBefore = sessionGetStore('dateBefore')
    //   // 对从session中取得的数据进行转换
    //   let dateRe1 = dateBefore.replace(/-/g, '/')
    //   let dateRe2 = dateRe1.replace(/T/g, ' ')
    //   console.log(dateRe2)
    //   let dateRe3 = new Date(dateRe2)
    //   console.log(dateRe3)
    //   console.log(dateNow)
    //   let date1 = dateNow.getTime()
    //   let date2 = dateRe3.getTime()
    //   let date3 = date1 - date2 // 当前时间与token取得时间的毫秒差
    //   console.log(date3)
    //   // 以50分钟为界限，超过五十分钟判定token失效，重新获取
    //   if (date3 >= 3000000) {
    //     console.log('token过期')
    //   }
    // },
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
.systemUserCentermain {
  text-align: left;
  padding: 20px 0 0 50px;
}
</style>
