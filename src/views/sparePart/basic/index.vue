<template>
  <div class="basic">
    <el-row>
      <el-col :xs="6" :sm="6" :md="7" :lg="4" :xl="3">
        <sortTree />
      </el-col>
      <el-col :xs="18" :sm="18" :md="17" :lg="20" :xl="21">
        <basicNav />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import basicNav from '../basic/basicNav'
import sortTree from '../basic/sortTree'
export default {
  name: 'Basic',
  components: {  basicNav,sortTree },
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
