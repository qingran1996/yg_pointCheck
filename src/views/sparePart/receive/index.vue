<template>
  <div class="receive">
    <el-row>
      <!--      <el-col :xs="6" :sm="6" :md="7" :lg="4" :xl="3">-->
      <!--        <area-tree />-->
      <!--      </el-col>-->
      <reviceIndex/>
    </el-row>
  </div>
</template>

<script>
import areaTree from './are/areTree'
import reviceIndex from './rightrRecive/reviveindex'

export default {
  name: 'Receive',
  components: {
    areaTree,
    reviceIndex
  },
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
