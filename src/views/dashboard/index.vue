<template>
  <div class="dashboard-container" :style="{height: indexheight}">

    <div class="head_">

      <div class="head_title">
        <img src="../../../public/headerTip.png"
             style="width: 30px;height: 30px;vertical-align: middle;margin: 10px 0 10px 12px;" alt="">
        <span style="margin-left: 10px">联峰实业设备管理系统</span>
        </div>
    </div>
    <div class="body_"></div>
    <el-row :gutter="10" class="row1">
      <el-col :xl="8" >

      </el-col>
      <el-col :xl="8" >

      </el-col>
      <el-col :xl="8" >

      </el-col>
    </el-row>
    <el-row :gutter="10" class="row2">
      <el-col :xl="8" >

      </el-col>
      <el-col :xl="8" >

      </el-col>
      <el-col :xl="8" >

      </el-col>
      <el-col :xl="8" >

      </el-col>
    </el-row>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import adminDashboard from './admin'
// import editorDashboard from './editor'
import todayWarning from '@/views/dashboard/todayWarning'
import warningTrend from '@/views/dashboard/warningTrend'
import deviceCount from '@/views/dashboard/deviceCount'
import onlineStatistics from '@/views/dashboard/onlineStatistics'
import Agent from '@/views/dashboard/Agent'
export default {
  name: 'Index',
  components: {todayWarning,warningTrend,deviceCount,onlineStatistics , Agent},
  data() {
    return {
      currentRole: 'adminDashboard',
	  indexheight: document.body.clientHeight - 84 + "px",
      tableData:[{

      }]
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
<style scoped lang="scss">
.dashboard-container{
  border: 1px solid red;
  /* padding: 15px; */
	background: url(../../assets/user_images/indexbg.png) no-repeat center/cover;
  width: 100%;
  height: 100%;
	overflow-y: hidden;
	background-size: 100% 100%;
	object-fit: fill;
}
  .head_{
    width: 100%;
    height: 5%;
    border: 1px solid yellow;
    .head_title{
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgb(0,227,232);
      font-size: 32px;
    }
  }


  .body_{
    width: 100%;
    height: 95%;
    border: 1px solid cornflowerblue;
    .row2{
      height: 55%;
    }
    .row2{
      margin-top: 10px;
      height: 45%;
    }
  }
</style>
