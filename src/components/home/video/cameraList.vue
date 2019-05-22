<template>
  <el-container>
    <div class="cameralist">
      <el-main class="cameralistmain">
        <el-table
          :data="cameraTableData"
          border
          style="width: 100%"
          max-height = "450">
          <el-table-column
            fixed
            prop="cameraName"
            label="名称"
            header-align="center"
            min-width="20%">
          </el-table-column>
          <el-table-column
            prop="deviceSerial"
            label="序列号"
            header-align="center"
            min-width="20%">
          </el-table-column>
          <el-table-column
            prop="verifCode"
            label="验证码"
            header-align="center"
            min-width="20%">
          </el-table-column>
          <el-table-column
            prop="channel"
            label="通道"
            header-align="center"
            min-width="20%">
          </el-table-column>
          <el-table-column
            label="操作"
            header-align="center"
            min-width="20%">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-delete" @click="cameraDelBt(scope.$index, scope.row)">删除</el-button>
              <el-button type="text" size="small" icon="el-icon-d-arrow-right" @click="tocameraBt(scope.$index, scope.row)">跳转</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" class="addcamera" icon="el-icon-circle-plus-outline" @click="cameraAddInitBt">新增摄像头</el-button>

        <!-- 新增摄像头对话框 -->
        <el-dialog title="新增摄像机" width="400px" :visible.sync="dialogFormVisible" center>
          <el-form :model="cameraForm" :inline="true">
            <el-form-item label="名称" :label-width="formLabelWidth">
              <el-input v-model="cameraForm.cameraName"></el-input>
            </el-form-item>
            <el-form-item label="序列号" :label-width="formLabelWidth">
              <el-input v-model="cameraForm.deviceSerial" ></el-input>
            </el-form-item>
            <el-form-item label="验证码" :label-width="formLabelWidth">
              <el-input v-model="cameraForm.verifCode" ></el-input>
            </el-form-item>
            <el-form-item label="通道" :label-width="formLabelWidth">
              <el-input v-model="cameraForm.channel" ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="cameraAddConfirmBt">确 定</el-button>
          </div>
        </el-dialog>

        <!--删除摄像头对话框-->
        <el-dialog
          title="提示"
          :visible.sync="dialogDelVisible"
          width="20%"
          center>
          <span>确定删除摄像头{{cameraName}}的信息吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogDelVisible = false">取 消</el-button>
            <el-button type="primary" @click="cameraDelConfirm">确 定</el-button>
          </span>
        </el-dialog>
      </el-main>
    </div>
  </el-container>
</template>

<script type="text/javascript">
import { back } from 'api'
import Routers from '@/router'
import { sessionGetStore, sessionSetStore } from '@/components/config/Utils'
export default {
  name: 'cameraListDiv',
  data () {
    return {
      param: {
        'accessToken': '',
        'sn': '',
        'deviceSerial': '',
        'userId': '',
        'deviceName': '',
        'expireTime': '',
        'validCode': '',
        'channelNo': '',
        'appKey': '',
        'appSecret': ''
      },
      cameraTableData: [{
        cameraName: 'C6H',
        deviceSerial: '781802782',
        verifCode: 'LWAFXI',
        channel: 1
      }],
      cameraForm: {
        cameraName: '',
        deviceSerial: '',
        verifCode: '',
        channel: ''
      },
      formLabelWidth: '80px',
      dialogFormVisible: false,
      dialogDelVisible: false,
      cameraName: '',
      selectCamName: '',
      index: 0
    }
  },
  //
  created: function () {
    // this.param.sn = sessionGetStore('deviceSNNow')
    this.param.userId = sessionGetStore('userId')
  },
  // 生命周期，安装期
  mounted: function () {
    // this.cameraTableData = []
    // this.cameralistQue()
  },
  //
  // ****************方法函数***********************
  //
  methods: {
    // 新增摄像头初始化按钮
    cameraAddInitBt: function () {
      this.cameraForm.cameraName = ''
      this.cameraForm.deviceSerial = ''
      this.cameraForm.verifCode = ''
      this.cameraForm.channel = ''
      this.dialogFormVisible = true
      console.log('新增摄像头')
    },
    // 跳转到监控播放页面
    tocameraBt: function (index, row) {
      console.log(index)
      this.index = index
      this.selectCamName = this.cameraTableData[index].cameraName
      sessionSetStore('cameraName', this.selectCamName)
      this.$store.commit('setCamName', this.selectCamName)
      sessionSetStore('camera_activeName', 'second')
      this.$store.commit('setCamActiveName', 'second')
      Routers.push({ path: '/home/video/player' })
    },
    // 删除选中行的摄像机设备
    cameraDelBt: function (index, row) {
      this.cameraName = this.cameraTableData[index].cameraName
      this.param.deviceSerial = this.cameraTableData[index].deviceSerial
      this.dialogDelVisible = true
    },
    // 删除确认按钮
    cameraDelConfirm: function () {
      // this.cameraDel()
    },
    // 确认添加摄像机设备按钮
    cameraAddConfirmBt: function () {
      if (this.cameraForm.cameraName === '' ||
      this.cameraForm.deviceSerial === '' ||
      this.cameraForm.verifCode === '' ||
      this.cameraForm.channel === '') {
        this.$message('参数不能为空')
        return
      }
      this.param.deviceName = this.cameraForm.cameraName
      this.param.deviceSerial = this.cameraForm.deviceSerial
      this.param.validCode = this.cameraForm.verifCode
      this.param.channelNo = this.cameraForm.channel
      this.cameraAdd()
    },
    /*
    **  ********** API调用相关函数 ***********
    */
    // 添加摄像头
    cameraAdd: function () {
      back.cameraAdd(this.param).then(function (response) {
        console.log(response)
        console.log('添加摄像头')
        if (response.errno === 0) {
          let obj = {}
          obj.cameraName = this.cameraForm.cameraName
          obj.deviceSerial = this.cameraForm.deviceSerial
          obj.verifCode = this.cameraForm.verifCode
          obj.channel = this.cameraForm.channel
          this.cameraTableData.splice(this.cameraTableData.length, 0, obj)
          this.dialogFormVisible = false
        } else if (response.errno === 1) {
          this.$message(response.error)
        }
      }.bind(this))
    },
    // 获取网关下摄像机信息
    cameralistQue: function () {
      back.cameralistQue().then(function (response) {
        console.log(response)
        console.log('获取网关下摄像头信息')
        let data = []
        for (let i = 0; i < response.length; i++) {
          let obj = {}
          obj.cameraName = response[i].cameraName
          obj.deviceSerial = response[i].deviceSerial
          obj.verifCode = response[i].verifCode
          obj.channel = response[i].channel
          data[i] = obj
        }
        // if (response.errno === 0) {
        //   for (let i = 0; i < response.data.length; i++) {
        //     let obj = {}
        //     obj.cameraName = response.data[i].deviceName
        //     obj.deviceSerial = response.data[i].deviceSerial
        //     obj.verifCode = response.data[i].validCode
        //     obj.channel = response.data[i].channelNo
        //     data[i] = obj
        //   }
        // } else if (response.errno === 1) {
        //   this.$message(response.error)
        // }
        this.cameraTableData = data
        console.log(this.cameraTableData)
        console.log('表格数据')
      }.bind(this))
    },
    // 删除单一摄像头
    cameraDel: function () {
      back.cameraDel(this.param).then(function (response) {
        console.log(response)
        if (response.errno === 0) {
          let num = 0
          for (let i = 0; i < this.cameraTableData.length; i++) {
            if (this.param.deviceSerial === this.cameraTableData[i].deviceSerial) {
              num = i
              if (num === this.index) {
                this.$store.commit('setCamName', '')
              }
            }
          }
          console.log('删除单一摄像机')
          this.cameraInfoQue()
        } else if (response.errno === 1) {
          this.$message(response.error)
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

<style>
.cameralist{
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: column;
}
.cameralistmain{
  overflow-x: hidden;
  height: 70%;
}
.el-main{
  padding: 0;
  flex: 1;
}
.addcamera {
  position: absolute;
  bottom:30px;
  left: 10px;
}
</style>
