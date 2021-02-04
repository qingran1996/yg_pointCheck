<template>
  <div class="serviceInformation">
    <el-col :span="8">
      <el-image style="height: 130px;width: 130px;">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </el-col >
    <el-col :span="16">
      <p>设备名称: {{deviceDetail.name}}</p>
      <p>设备位号: {{deviceDetail.code}}</p>
      <p>资产编号: {{deviceDetail.zcnum}}</p>
      <p>规格型号: {{deviceDetail.ggtype}}</p>
      <p>设备类型: {{deviceDetail.devicetypeName}}</p>
      <p>安装位置: {{deviceDetail.installAreaName}}</p>
      <p>是否为特种设备: {{deviceDetail.isTZ}}</p>
      <p>设备状态: {{deviceDetail.stateName}}</p>
    </el-col>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deviceDetail:{
        name:null,
        code:null,
        zcnum:null,
        ggtype:null,
        installAreaName:null,
        isTZ:null,
        stateName:null,
        devicetypeName:null
      }
    }
  },
  created() {
    this.deviceDetail = JSON.parse(sessionStorage.getItem('deviceStatus'))
    //console.log(this.deviceDetail)
  },
  methods:{

  }
}
</script>

<style scoped>
.serviceInformation {

}
</style>
