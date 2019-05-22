<template>
  <div id="allmap" >
    <h3>地图刷新跳转</h3>
  </div>
</template>

<script>
import Routers from '@/router'

export default {
  name: 'blankDiv',
  data () {
    return {
    }
  },
  mounted: function () {
    Routers.push({ path: '/home/deviceInfo' })
  }
}
</script>

<style scoped>
</style>
