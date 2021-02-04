<template>
  <div class="person">
    <el-row>
      <el-col :xs="6" :sm="6" :md="7" :lg="4" :xl="3">
        <areaTree />
      </el-col>
      <el-col :xs="18" :sm="18" :md="17" :lg="20" :xl="21">
        <personNav />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import areaTree from '../area/areaTree.vue'
import personNav from './personNav.vue'
export default {
  name: 'PersonShow',
  components: { areaTree, personNav },
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
