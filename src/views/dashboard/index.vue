<template>
  <div class="dashboard-container">
    <el-row :gutter="10">
      <el-col :xl="10" >
        <todayWarning/>
      </el-col>
      <el-col :xl="14" >
         <Agent/>
      </el-col>
    </el-row>
    <el-row :gutter="15" style="margin-top: 10px;">
      <el-col :xl="8" >
        <warningTrend/>
      </el-col>
      <el-col :xl="8" >
        <deviceCount/>
      </el-col>
      <el-col :xl="8" >
        <onlineStatistics/>
      </el-col>
    </el-row>
    <!-- <component :is="currentRole" /> -->
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
<style scoped>
.dashboard-container{
  padding: 15px;
}
</style>
