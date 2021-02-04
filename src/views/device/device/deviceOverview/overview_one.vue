<template>
  <div class="overview_one" :style="{height: showheight}">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card class="box-card" style="height: 400px;">
          <div slot="header" class="clearfix one">
            <span>设备信息</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <serviceInformation/>
        </el-card>
        <el-card class="box-card" style="height: 200px;">
          <div slot="header" class="clearfix two">
            <span>设计参数</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <p>流量：15m3/h    扬程：25m    汽蚀余量：2.5m   转速：2900rpm   </p>
          <p>额定电压：380V 额定电流：6.2A  频率：50Hz  功率：2.2KW</p>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="16">
        <el-card class="box-card" style="height: 605px;">
          <div slot="header" class="clearfix three">
            <span>设备运行参数</span>
          </div>
         <deviceParams/>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card class="box-card" style="height: 605px;">
          <div slot="header" class="clearfix four">
            <span>设备履历信息</span>
            <el-button style="float: right; padding: 3px 0" type="text">查看更多</el-button>
          </div>
          <resumeInformation/>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="16">
        <el-card class="box-card" style="height: 300px;">
          <div slot="header" class="clearfix five">
            <span>备品备件信息</span>
            <el-button style="float: right; padding: 3px 0" type="text">查看更多</el-button>
          </div>
          <sparePartInformation/>
        </el-card>
        <el-card class="box-card" style="height: 300px;">
          <div slot="header" class="clearfix six">
            <span>告警信息</span>
            <el-button style="float: right; padding: 3px 0" type="text">查看更多</el-button>
          </div>
          <warningInformation/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import resumeInformation from '@/views/device/device/deviceOverview/overviewOneDetails/resumeInformation'
import sparePartInformation from '@/views/device/device/deviceOverview/overviewOneDetails/sparePartInformation'
import warningInformation from '@/views/device/device/deviceOverview/overviewOneDetails/warningInformation'
import serviceInformation from '@/views/device/device/deviceOverview/overviewOneDetails/serviceInformation'
import deviceParams from '@/views/device/device/deviceOverview/overviewOneDetails/deviceParams'
export default {
  name: 'OverviewOne',
  components: {resumeInformation,sparePartInformation,warningInformation,serviceInformation,deviceParams},
  data() {
    return {
      showheight: document.body.clientHeight - 84 - 36 - 50 - 115 + 'px'
    }
  },
  created() {

  },
  destroyed() {
    console.log('overview_one')
  },
  methods: {}
}
</script>
<style scoped>
	.overview_one {
		padding: 5px;
		overflow-y: scroll;
		overflow-x: hidden;
	}

	.clearfix {
		color: #1890FF;
	}
</style>
