<template>
  <div class="login">
    <div class="titlediv">
      <span class="titlename">鸿世充电桩管理系统</span>
    </div>

    <!--用户登录-->
    <el-form :model="ruleFormLogin" :rules="rulesLogin" ref="ruleFormLogin" v-show="loginShowFlag" label-position="left" label-width="0px" class="login-container">
      <h3 class="title">用户登录</h3>
      <el-form-item prop="phone">
        <el-input type="text" @keyup.enter.native="userLandBt('ruleFormLogin')" v-model="ruleFormLogin.phone" auto-complete="off" placeholder="请输入手机号或邮箱"></el-input>
      </el-form-item>
      <el-form-item prop="password" class="password">
        <el-input type="password" @keyup.enter.native="userLandBt('ruleFormLogin')" v-model="ruleFormLogin.password" auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-button type="text" @click.native.prevent="regiterForm" class="toLogin">用户注册</el-button>
      <el-button type="text" @click.native.prevent="passwordForget" class="toRemember">忘记密码</el-button>
      <el-form-item style="width:100%;">
        <el-button type="primary" round style="width:100%;" @click.native.prevent="userLandBt('ruleFormLogin')" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>

    <!--忘记密码-->
    <el-form :model="ruleFormPass" :rules="rulesRetrieve" ref="ruleFormPass" v-show="passShowFlag" label-position="left" label-width="0px" class="login-container">
      <h3 class="title">找回密码</h3>
      <el-form-item prop="phone">
        <el-input type="text" v-model="ruleFormPass.phone" auto-complete="off" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="VeriCode">
        <el-input type="text" v-model="ruleFormPass.VeriCode" auto-complete="off" placeholder="获取验证码">
        <el-button slot="append" v-show="!passwordComputedTime" @click.native.prevent="passGetVeriCode">获取验证码</el-button>
        <el-button slot="append" v-show="passwordComputedTime">已发送({{passwordComputedTime}}s)</el-button>
        </el-input>
      </el-form-item>
      <el-form-item prop="newPassword">
        <el-input type="password" v-model="ruleFormPass.newPassword" auto-complete="off" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item prop="newPasswordAgain" class="password">
        <el-input type="password" v-model="ruleFormPass.newPasswordAgain" auto-complete="off" placeholder="确认新密码"></el-input>
      </el-form-item>
      <el-button type="text" @click.native.prevent="backToLogin" class="remember">返回登录</el-button>
      <el-form-item style="width:100%;">
        <el-button type="primary" round style="width:100%;" @click.native.prevent="getPasswordBt('ruleFormPass')" :loading="logining">确定</el-button>
      </el-form-item>
    </el-form>

    <!--用户注册-->
    <el-form :model="ruleFormRegister" :rules="rulesRegister" ref="ruleFormRegister" v-show="registerShowFlag" label-position="left" label-width="0px" class="login-container">
      <h3 class="title">用户注册</h3>
      <el-form-item prop="userName">
        <el-input type="text" v-model="ruleFormRegister.userName" auto-complete="off" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item prop="phone">
        <el-input type="text" v-model="ruleFormRegister.phone" auto-complete="off" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="VeriCode">
        <el-input type="text" v-model="ruleFormRegister.VeriCode" auto-complete="off" placeholder="获取验证码">
        <el-button slot="append" v-show="!regiterComputedTime" @click.native.prevent="registerGetVeriCode">获取验证码</el-button>
        <el-button slot="append" v-show="regiterComputedTime">已发送({{regiterComputedTime}}s)</el-button>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="ruleFormRegister.password" auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item prop="passwordAgain" class="password">
        <el-input type="password" v-model="ruleFormRegister.passwordAgain" auto-complete="off" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item class="invitationCode" prop="invitationCode">
        <el-input v-model="ruleFormRegister.invitationCode" auto-complete="off" placeholder="请输入邀请码"></el-input>
      </el-form-item>
      <el-button type="text" @click.native.prevent="backToLogin" class="remember">返回登录</el-button>
      <el-form-item style="width:100%;">
        <el-button type="primary" round style="width:100%;" @click.native.prevent="userRegiterBt('ruleFormRegister')" :loading="logining">确定</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { back } from 'api'
import Routers from '@/router'
import { sessionSetStore, sessionClearStore } from '@/components/config/Utils'

export default {
  name: 'loginDiv',
  data () {
    // ***********表单输入规则校验***********
    // 校验用户名
    var checkUserName = (rule, value, callback) => {
      var reg = /^[\u4e00-\u9fff\w]{3,18}$/
      if (value === '') {
        return callback(new Error('用户名不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('只能包含数字、字母、汉字和下划线，长度在3~18之间'))
      } else {
        callback()
      }
    }
    // 校验密码
    var checkPassword = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('密码不能为空'))
      } else if (value.length > 20) {
        callback(new Error('密码长度不超过20位'))
      } else {
        callback()
      }
    }
    // 校验手机号
    var checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else if (!(/^1\d{10}$/gi.test(value))) {
        callback(new Error('请输入11位手机号'))
      } else {
        callback()
      }
    }
    // 校验验证码
    var checkVeriCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('验证码不能为空'))
      } else if (value.length !== 6) {
        callback(new Error('请输入6位验证码'))
      } else {
        callback()
      }
    }
    // 校验再次输入的密码(忘记密码)
    var checkPasswordAgainForget = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else if (value.length > 20) {
        callback(new Error('密码长度不超过20位'))
      } else if (value !== this.ruleFormPass.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    // 校验再次输入的密码（用户注册）
    var checkPasswordAgainRegister = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else if (value.length > 20) {
        callback(new Error('密码长度不超过20位'))
      } else if (value !== this.ruleFormRegister.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      param: {
        'name': '',
        'password': '',
        'userId': 0,
        'mobile': '',
        'email': '',
        'code': ''
      },
      passwordVeriCode: '', // 忘记密码时的验证码
      regiterVeriCode: '', // 用户注册时的验证码
      passwordComputedTime: 0, // 忘记密码短信倒数记时
      regiterComputedTime: 0, // 用户注册短信倒数记时
      loginShowFlag: false, // 登陆表单显示标志位
      passShowFlag: false, // 找回密码表单显示标志位
      registerShowFlag: false, // 用户注册表单显示标志位
      logining: false, // 确定按键--加载效果
      // 用户登录
      ruleFormLogin: {
        phone: '',
        password: ''
      },
      // 登录表单校验
      rulesLogin: {
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        password: [
          { validator: checkPassword, trigger: 'blur' }
        ]
      },
      // 忘记密码
      ruleFormPass: {
        phone: '',
        VeriCode: '',
        newPassword: '',
        newPasswordAgain: '',
        VerCodeToken: '',
        VerPhone: ''
      },
      // 忘记密码表单校验
      rulesRetrieve: {
        phone: [
          { validator: checkPhone, trigger: 'blur' },
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        VeriCode: [
          { validator: checkVeriCode, trigger: 'blur' }
        ],
        newPassword: [
          { validator: checkPassword, trigger: 'blur' },
          {min: 6, max: 16, message: '密码长度必须大于6位小于16位', trigger: 'blur'}
        ],
        newPasswordAgain: [
          { validator: checkPasswordAgainForget, trigger: 'blur' },
          {min: 6, max: 16, message: '密码长度必须大于6位小于16位', trigger: 'blur'}
        ]
      },
      // 用户注册
      ruleFormRegister: {
        userName: '',
        phone: '',
        VeriCode: '',
        password: '',
        passwordAgain: '',
        VerCodeToken: '',
        VerPhone: '',
        invitationCode: ''
      },
      // 用户注册表单校验
      rulesRegister: {
        userName: [
          { validator: checkUserName, trigger: 'blur' }
        ],
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        VeriCode: [
          { validator: checkVeriCode, trigger: 'blur' }
        ],
        password: [
          { validator: checkPassword, trigger: 'blur' },
          {min: 6, max: 16, message: '密码长度必须大于6位小于16位', trigger: 'blur'}
        ],
        passwordAgain: [
          { validator: checkPasswordAgainRegister, trigger: 'blur' },
          {min: 6, max: 16, message: '密码长度必须大于6位小于16位', trigger: 'blur'}
        ]
      }
    }
  },
  //
  // *****************生命周期****************
  //
  // 生命周期钩子--创建期
  created: function () {
    // 清除浏览器本地存储
    sessionClearStore()
    // 默认显示 用户登录界面
    this.loginShowFlag = true
    this.passShowFlag = false
    this.registerShowFlag = false
  },
  //
  // ****************方法函数***********************
  //
  methods: {
    // 用户登录
    userLandBt: function (ruleFormLogin) {
      // 错误检查
      this.$refs[ruleFormLogin].validate((valid) => {
        if (valid) {
          this.param.mobile = this.ruleFormLogin.phone
          this.param.password = this.ruleFormLogin.password
          this.logining = true
          this.backUserLogMobile()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 用户注册，进行表单的跳转
    regiterForm: function () {
      // 数据初始化
      this.dataAllInit()
      this.loginShowFlag = false
      this.passShowFlag = false
      this.registerShowFlag = true
    },
    // 忘记密码，进行表单的跳转
    passwordForget: function () {
      // 数据初始化
      this.dataAllInit()
      this.loginShowFlag = false
      this.passShowFlag = true
      this.registerShowFlag = false
    },
    // 用户登录，进行表单的跳转
    backToLogin: function () {
      // 数据初始化
      this.dataAllInit()
      this.loginShowFlag = true
      this.passShowFlag = false
      this.registerShowFlag = false
    },
    // 用户注册，按键事件
    userRegiterBt: function (ruleFormRegister) {
      // 错误检查
      this.$refs[ruleFormRegister].validate((valid) => {
        if (valid && this.ruleFormRegister.VeriCode === this.ruleFormRegister.VerCodeToken && this.ruleFormRegister.phone === this.ruleFormRegister.VerPhone) {
          this.logining = true
          this.param = {
            name: this.ruleFormRegister.userName,
            company: '鸿世电器有限公司',
            mobile: this.ruleFormRegister.phone,
            password: this.ruleFormRegister.password,
            code: this.ruleFormRegister.invitationCode
          }
          // 用户注册，新增用户
          this.backUserRegister()
        } else {
          if (this.ruleFormRegister.VeriCode !== this.ruleFormRegister.VerCodeToken) {
            this.notificationInfo('错误提示', '验证码不正确')
          }
          if (this.ruleFormRegister.phone !== this.ruleFormRegister.VerPhone) {
            this.notificationInfo('错误提示', '手机号码未校验')
          }
          console.log('error submit!!')
          return false
        }
      })
    },
    // 忘记密码，按键事件
    getPasswordBt: function (ruleFormPass) {
      // 错误检查
      this.$refs[ruleFormPass].validate((valid) => {
        if (valid && this.ruleFormPass.VeriCode === this.ruleFormPass.VerCodeToken && this.ruleFormPass.phone === this.ruleFormPass.VerPhone) {
          this.logining = true
          this.param = { mobile: this.ruleFormPass.phone, password: this.ruleFormPass.newPassword }
          // 忘记密码，密码修改
          // this.backUserPasswordMod()
        } else {
          if (this.ruleFormPass.VeriCode !== this.ruleFormPass.VerCodeToken) {
            this.notificationInfo('错误提示', '验证码不正确')
          }
          if (this.ruleFormPass.phone !== this.ruleFormPass.VerPhone) {
            this.notificationInfo('错误提示', '手机号码未校验')
          }
          console.log('error submit!!')
          return false
        }
      })
    },
    // 用户注册，获取验证码
    registerGetVeriCode: function () {
      if (/^1\d{10}$/gi.test(this.ruleFormRegister.phone)) {
        this.regiterComputedTime = 60
        this.regiterTimer = setInterval(() => {
          this.regiterComputedTime--
          if (this.regiterComputedTime === 0) {
            clearInterval(this.regiterTimer)
          }
        }, 1000)
        this.param.mobile = this.ruleFormRegister.phone
        // 发送短信验证信息
        this.backSmsCodeQue()
      } else {
        this.notificationInfo('错误提示', '手机号格式不正确')
      }
    },
    // 忘记密码，获取验证码
    passGetVeriCode: function () {
      if (/^1\d{10}$/gi.test(this.ruleFormPass.phone)) {
        this.passwordComputedTime = 60
        this.passTimer = setInterval(() => {
          this.passwordComputedTime--
          if (this.passwordComputedTime === 0) {
            clearInterval(this.passTimer)
          }
        }, 1000)
        this.param.mobile = this.ruleFormPass.phone
        // 发送短信验证信息
        this.backSmsCodeQue()
      } else {
        this.notificationInfo('错误提示', '手机号格式不正确')
      }
    },
    /*
    *
    *   ******** API调用函数 ********
    *
    */
    // 用户登录
    backUserLogMobile: function () {
      // 登陆API请求,通过用户名登陆
      back.userLogMobile(this.param).then(function (response) {
        console.log(response)
        if (response.errno > 0) {
          this.notificationInfo('错误提示', response.error)
          this.logining = false
          return
        }
        // 用户信息存储vuex localstorge
        this.userinfoStore(response)
        // sessionSetStore('userName', response.data.name)
        sessionSetStore('activeNum', '1')
        this.backEzvizBindQue()
        // 跳转到home页面
        Routers.push({ path: '/home' })
      }.bind(this))
    },
    // 用户注册
    backUserRegister: function () {
      back.userRegister(this.param).then(function (response) {
        this.logining = false
        console.log(response)
        if (response.errno !== 0) {
          this.notificationInfo('错误提示', response.error)
        } else {
          this.notificationInfo('提示', '注册用户成功！')
          this.loginShowFlag = true
          this.passShowFlag = false
          this.registerShowFlag = false
        }
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
        this.ruleFormPass.VerCodeToken = response.data.code
        this.ruleFormPass.VerPhone = this.param.mobile
        this.ruleFormRegister.VerCodeToken = response.data.code
        this.ruleFormRegister.VerPhone = this.param.mobile
      }.bind(this))
    },
    // // 修改用户密码（用于忘记密码)
    // backUserPasswordMod: function () {
    //   back.userPasswordMod(this.param).then(function (response) {
    //     this.logining = false
    //     console.log(response)
    //     if (response.errno !== 0) {
    //       this.notificationInfo('错误提示', response.error)
    //     } else {
    //       this.notificationInfo('提示', '修改密码成功！')
    //       this.loginShowFlag = true
    //       this.passShowFlag = false
    //       this.registerShowFlag = false
    //     }
    //   }.bind(this))
    // },
    // 获取用户的萤石云绑定信息
    backEzvizBindQue: function () {
      // 登陆API请求,通过用户名登陆
      back.ezvizBindQue(this.param).then(function (response) {
        console.log('萤石云')
        console.log(response)
        if (response.errno > 0) {
          this.notificationInfo('错误提示', response.error)
          return
        }
        if (response.data) {
          sessionSetStore('ezvizBind', true)
          sessionSetStore('accessToken', response.data.accessToken)
          let timestamp = Math.round(new Date().getTime() / 1000)
          console.log(timestamp)
          // 如果离token过期时间小于2小时，就需要续签token
          if ((response.data.expireTime - timestamp) < 7200000) {
            this.backRenewToken()
            console.log('需要续签')
          } else {
            console.log('不需要续签')
          }
        }
      }.bind(this))
    },
    // 续签token
    // 获取用户的萤石云绑定信息
    backRenewToken: function () {
      // 登陆API请求,通过用户名登陆
      back.renewToken(this.param).then(function (response) {
        console.log('续签')
        console.log(response)
        if (response.errno > 0) {
          this.notificationInfo('错误提示', response.error)
        }
      }.bind(this))
    },
    /*
    *
    *   ******** 辅助方法函数 ********
    *
    */
    // 用户信息存储vuex localstorge
    userinfoStore: function (info) {
      // vuex存储
      // this.$store.commit('setUserId', info.data[0].userId)
      console.log(info.data.name)
      this.$store.commit('setUserName', info.data.name)
      this.param.userId = info.data.userId
      // 浏览器本地存储
      sessionSetStore('userName', info.data.name)
      sessionSetStore('role', info.data.role)
      let myDate = new Date()
      console.log(myDate)
      let hour = myDate.getHours()
      let minute = myDate.getMinutes()
      sessionSetStore('dateBefore', myDate)
      sessionSetStore('hour', hour)
      sessionSetStore('minute', minute)
      let Authorization = 'Bearer' + ' ' + info.data.token
      console.log(Authorization)
      sessionSetStore('Authorization', Authorization)
      sessionSetStore('password', this.param.password)
      sessionSetStore('userId', info.data.userId)
    },
    // 界面跳转，数据初始化
    dataAllInit: function () {
      // 用户登录，数据初始化
      this.ruleFormLogin = {
        userName: '',
        password: ''
      }
      // 忘记密码，数据初始化
      this.ruleFormPass = {
        phone: '',
        VeriCode: '',
        newPassword: '',
        newPasswordAgain: '',
        VerCodeToken: '',
        VerPhone: ''
      }
      // 用户注册，数据初始化
      this.ruleFormRegister = {
        userName: '',
        phone: '',
        VeriCode: '',
        password: '',
        passwordAgain: '',
        VerCodeToken: '',
        VerPhone: ''
      }
      this.passwordVeriCode = '' // 忘记密码时的验证码
      this.regiterVeriCode = '' // 用户注册时的验证码
      this.passwordComputedTime = 0 // 忘记密码短信倒数记时
      this.regiterComputedTime = 0 // 用户注册短信倒数记时
      if (this.regiterTimer !== undefined) {
        clearInterval(this.regiterTimer)
      }
      if (this.passTimer !== undefined) {
        clearInterval(this.passTimer)
      }
      this.logining = false
    },
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
.login{
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
  background-image: url('/static/login-bg.jpg');
  background-repeat:no-repeat;
  background-size:100% 100%;
  /* 兼容火狐浏览器 */
  -moz-background-size:100% 100%;
}
.titlediv{
  margin-top: 9vh;
}
.titlename{
  color: white;
  font-size: 40px;
}
.login-container {
    -webkit-border-radius: 5px;
    border-radius: 15px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 0 auto;
    margin-top: 3vh;
    width: 350px;
    padding: 35px 35px 15px 35px;
    /* background: rgba(48, 64, 57, 0.5); */
    box-shadow: 0 0 25px #cac1c6;
  }
.title{
  color: white;
  font-size: 20px;
}
.invitationCode {
  margin-bottom: 0px
}
.toLogin {
  margin: 0px 100px 0px 0px;
}
.toRemember {
  margin: 0px 0px 0px 100px;
}
.remember {
  margin: 0px 0px 0px 260px;
}
</style>
