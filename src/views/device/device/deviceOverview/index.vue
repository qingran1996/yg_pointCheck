<template>
  <div class="deviceOverview">
    <el-card class="box-card">
      <el-row class="overviewRow">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="4">
          <div class="grid-content bg-purple" />{{ title.name }}
        </el-col>
        <el-col :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
          <div class="grid-content bg-purple-light">位号：{{ title.code }}</div>
        </el-col>
        <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="6">
          <div class="grid-content bg-purple" />{{ title.status }}
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="设备总览" name="1">
          <overviewOne />
        </el-tab-pane>
<!--        <el-tab-pane label="保养信息" name="2">-->
<!--          <overviewTwo />-->
<!--        </el-tab-pane>-->
        <el-tab-pane label="维修信息" name="3">
          <overviewThree />
        </el-tab-pane>
        <el-tab-pane label="检验信息" name="4">
          <overviewFour />
        </el-tab-pane>
        <el-tab-pane label="验收信息" name="5">
          <overviewFive />
        </el-tab-pane>
        <!-- <el-tab-pane label="文档信息" name="6">
          <overviewSix />
        </el-tab-pane> -->
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import overviewOne from './overview_one.vue'
import overviewThree from './overview_three.vue'
import overviewFour from './overview_four.vue'
import overviewFive from './overview_five.vue'
// import overviewSix from './overview_six'
//import overviewTwo from './overview_two.vue'
export default {
  name: 'DeviceOverview',
  components: {
    overviewOne,
    overviewThree,
    overviewFour,
    overviewFive
  },
  data() {
    return {
      activeName: '1',
      tabPosition: 'top',
      title: {}
    }
  },
  computed: {
    // token () {
    //  return this.$store.getters
    // }
  },
  created() {
    const data = JSON.parse(sessionStorage.getItem('deviceStatus'))
    this.title = data
    console.log(data)
  },
  methods: {
    // tab切换
    handleClick(tab, event) {
      if (this.time) {
        clearTimeout(this.time)
      }
      this.time = setTimeout(() => {
        console.log(tab.name)
        this.$bus.emit('gotab',{num: tab.name,data: this.title})
      }, 300) // 大概时间300ms
    }
  }
}
</script>
<style scoped>
	.deviceOverview {
		padding: 10px;
	}
	@media (max-width:768px) {
		.overviewRow {
			font-size: 12px !important;
		}
	}
	@media (max-width:1024px) {
		.overviewRow {
			font-size: 20px !important;
		}
	}
	/* @media (max-width:1200px) {
		.overviewRow {
			font-size: 24px !important;
		}
	} */
	@media (max-width:1920px) {
		.overviewRow {
			font-size: 26px;
		}
	}
	@media (max-width:3000px) {
		.overviewRow {
			font-size: 26px;
		}
	}
	/* .el-tabs>>>.el-tabs__content {
		padding: 5px !important;
	} */
</style>
