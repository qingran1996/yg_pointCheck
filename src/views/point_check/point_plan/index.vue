<template>
  <div class="pointPlan">
		<rightBody />
   <!-- <el-row>
      <el-col :xs="6" :sm="6" :md="7" :lg="4" :xl="3">
        <areaTree />
      </el-col>
      <el-col :xs="18" :sm="18" :md="17" :lg="20" :xl="21">
        <rightBody />
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
	import areaTree from '../area/areaTree.vue'
	import rightBody from './rightBody.vue'
export default {
  name: 'pointPlan',
  components: { areaTree, rightBody },
  data() {
    return {}
  },
  created() {

  },
  methods: {}
}
</script>
<style scoped>

</style>
