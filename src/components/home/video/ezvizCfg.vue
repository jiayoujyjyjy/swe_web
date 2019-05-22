<template>
    <!-- 构建信息表单 -->
    <div id="ezvizConfig">

      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
            <el-form-item label="AppKey">
              <el-input readonly v-model="formInline.AppKey" style="width: 300px;"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="formInline" class="from-inline" label-width="100px">
            <el-form-item label="Secret">
              <el-input readonly v-model="formInline.Secret" style="width: 300px;"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="formInline" class="from-button" label-width="100px">
            <el-form-item>
              <el-button type="primary" @click="bindEzivizBt">绑定</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="unbindBt">解绑</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>

      <!-- 添加摄像机对话框 -->
      <el-dialog title="配置萤石云账号" :visible.sync="dialogFormVisible" width="400px">
        <el-form ref="configform" :model="configform" label-width="80px" style="margin-right: 30px;">
          <el-form-item label="AppKey" prop="AppKey">
            <el-input type="text" v-model="configform.AppKey"></el-input>
          </el-form-item>
          <el-form-item label="Secret" prop="Secret">
            <el-input type="text" v-model="configform.Secret"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="bindEzvizConfirmBt">确定</el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script type="text/javascript">
import { back } from 'api'
import { sessionGetStore } from '@/components/config/Utils'

export default {
  data () {
    return {
      param: {
        sn: '',
        userId: '',
        appKey: '',
        appSecret: ''
      },
      formInline: {
        AppKey: '',
        Secret: ''
      },
      configform: {
        AppKey: '',
        Secret: ''
      },
      dialogFormVisible: false,
      bind: 0 // 判断用户是否已经绑定萤石云账号，1为已绑定，0为未绑定
    }
  },
  //
  // ***************生命周期*********************
  //
  created: function () {
    // this.param.sn = sessionGetStore('deviceSNNow')
    this.param.userId = sessionGetStore('userId')
  },
  // 生命周期钩子--安装期
  mounted: function () {
    if (sessionGetStore('ezvizBind')) {
      this.formInline = {
        AppKey: '**********',
        Secret: '**********'
      }
    } else {
      this.formInline = {
        AppKey: '未绑定',
        Secret: '未绑定'
      }
    }
    // this.ezvizInfoQue()
  },
  //
  // ****************方法函数***********************
  //
  methods: {
    // 绑定萤石云账号按钮
    bindEzivizBt: function () {
      if (this.bind === 0) {
        this.dialogFormVisible = true
        this.configform.AppKey = ''
        this.configform.Secret = ''
      } else {
        this.$message('请先解绑旧账号')
      }
    },
    // 确认绑定萤石云账号按钮
    bindEzvizConfirmBt: function () {
      this.param.appKey = this.configform.AppKey
      this.param.appSecret = this.configform.Secret
      // this.ezvizInfoBind()
    },
    // 解绑操作按钮
    unbindBt: function () {
      if (this.bind === 0) {
        this.$message('无法解绑，请先绑定账号')
        return
      }
      this.$confirm('确认解绑该萤石云账号？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.unbindconfirmBt()
      }).catch(() => {
      })
    },
    // 确认解绑操作按钮，操作后删除配置的萤石云账号下的所有视频设备
    unbindconfirmBt: function () {
      this.$confirm('解绑后将删除该萤石云账号下所有设备，是否删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.ezvizInfoUnbind()
      }).catch(() => {
      })
    },
    //
    // *******************   API调用   *********************
    //
    // 绑定萤石云账号信息
    ezvizInfoBind: function () {
      back.ezvizInfoBind(this.param).then(function (response) {
        console.log(response)
        console.log('绑定返回信息')
        if (response.errno === 0) {
          this.formInline.AppKey = this.configform.AppKey
          this.formInline.Secret = this.configform.Secret
          this.dialogFormVisible = false
          this.bind = 1
        } else {
          this.$message(response.error)
        }
      }.bind(this))
    },
    // 获取用户绑定的萤石云信息
    ezvizInfoQue: function () {
      back.ezvizInfoQue(this.param).then(function (response) {
        console.log(response)
        console.log('获取用户绑定信息')
        if (response.errno === 0) {
          if (response.data !== undefined) {
            this.formInline.AppKey = response.data[0].appKey
            this.formInline.Secret = response.data[0].appSecret
            this.bind = 1
          } else {
            this.formInline.AppKey = ''
            this.formInline.Secret = ''
            this.bind = 0
          }
        } else if (response.errno === 1) {
          this.$message(response.error)
        }
      }.bind(this))
    },
    // 解绑萤石云账号，同时删除账号下的所有摄像机设备
    ezvizInfoUnbind: function () {
      back.ezvizInfoUnbind(this.param).then(function (response) {
        console.log(response)
        console.log('解绑萤石云')
        if (response.errno === 0) {
          this.formInline.AppKey = ''
          this.formInline.Secret = ''
          this.bind = 0
        } else if (response.errno === 1) {
          this.$message(response.error)
        }
      }.bind(this))
    }
  }
}
</script>

<style scoped>
#ezvizConfig {
  margin: 20px;
}
.from-inline {
  float: left;
  margin-left: 20px;
}
.from-button{
  float: left;
  margin-left: 180px
}
</style>
