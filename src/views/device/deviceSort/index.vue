<template>
  <div class="device_Sort">
    <el-row>
      <el-col :xs="6" :sm="6" :md="7" :lg="4" :xl="3">
        <sortTree />
      </el-col>
      <el-col :xs="18" :sm="18" :md="17" :lg="20" :xl="21">
        <deviceSort />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import sortTree from '../sort/sortTree.vue'
import deviceSort from './deviceSort.vue'
export default {
  name: 'DeviceSort',
  components: { sortTree, deviceSort },
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
