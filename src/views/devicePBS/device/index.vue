<template>
  <div class="devicePBS">
    <el-row>
      <el-col :xs="6" :sm="6" :md="7" :lg="4" :xl="3">
        <areaTree />
      </el-col>
      <el-col :xs="18" :sm="18" :md="17" :lg="20" :xl="21">
        <deviceIndex />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import areaTree from '../area/areaTree.vue'
import deviceIndex from './deviceNav.vue'
export default {
  name: 'DevicePBS',
  components: { areaTree, deviceIndex },
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
