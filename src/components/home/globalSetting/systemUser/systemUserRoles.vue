<template>
  <el-container>
    <div class="roleTable">
      <el-table
        :data="roleData"
        style="width: 100%;border-radius:4px;margin-top:30px;"
        >
        <el-table-column
          prop="role"
          label="角色"
          header-align="center"
          max-width="20%">
        </el-table-column>
        <el-table-column
          prop="permission"
          label="权限"
          header-align="center"
          max-width="80%">
        </el-table-column>
      </el-table>
    </div>
  </el-container>
</template>

<script>
// import { sessionGetStore } from '@/components/config/Utils'
// import Routers from '@/router'
export default {
  data () {
    return {
      roleData: [{
        role: '超级管理员',
        permission: '拥有所有权限，产生邀请码邀请其他用户注册'
      }, {
        role: '一级管理员',
        permission: '不可查看资金结算部分，不可对管理员账号进行编辑操作'
      }, {
        role: '二级管理员',
        permission: '查看信息的权限'
      }]
    }
  },
  created: function () {
    // let userCenterMarker = sessionGetStore('userCenter')
    // console.log(userCenterMarker)
  },
  mounted: function () {
    // if (sessionGetStore('userCenter') === 1) {
    //   Routers.push({ path: '/home/globalSetting/systemUserCenter' })
    // }
  },
  methods: {
  }
}
</script>

<style scoped>
.roleTable {
  width: 90%;
  margin: 0 auto;
  border-radius: 4px;
  /* box-shadow: 0 0 5px #FFFFFD; */
}
.el-container {
  background-color: #D7DEE8;
  padding: 10px;
}
</style>
