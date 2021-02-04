<template>
  <div class="detailOne">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="DialogTitle" :visible.sync="editDialogVisible"
               width="30%" center >
      <el-form :model="setData" label-width="100px" class="demo-ruleForm" ref="setForm" >
        <el-form-item label="保养计划编号" prop="planNum">
          {{ setData.planNum }}
        </el-form-item>
        <el-form-item label="被保养的设备">
          {{setData.deviceName}}
        </el-form-item>
        <el-form-item label="保养计划内容">
          {{setData.mPlan.content}}
        </el-form-item>
        <el-form-item label="保养标题">
          {{setData.mPlan.title}}
        </el-form-item>
        <el-form-item label="频率">
          {{setData.mPlan.frequency}}
        </el-form-item>
        <el-form-item label="频率周期">
          {{setData.mPlan.frequencyTypeString}}
        </el-form-item>
        <el-form-item label="执行时间">
          {{setData.maintainTime}}(当天)
        </el-form-item>
        <el-form-item label="执行人">
          {{setData.executor}}
        </el-form-item>
      </el-form>
      <span slot="footer" class="footerClass">
        <el-button  @click="close">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editDialogVisible: false,
      DialogTitle: '需执行保养的信息',
      setData:{
        deviceName:'',
        planNum:'',
        executor:'',
        mPlan:{
          content:'',
          frequency:1,
          title:'',
          frequencyType:null,
          frequencyTypeString:'',
          maintainTime:''
        }
      }
    }
  },
  watch:{
    editDialogVisible(val){
      if (val ===false){
        this.setData={
          deviceName:'',
          planNum:'',
          maintainTime:'',
          executor:'',//执行人
          mPlan:{
            content:'',
            frequency:1,
            title:'',
            frequencyType:null,
            frequencyTypeString:'',
          }
        }
      }
    }
  },
  created() {
    this.$bus.on('lookDetailOne',e=>{
      this.editDialogVisible = e.show
      //console.log(e)
      this.setData.deviceName = e.deviceName
      this.setData.planNum = e.planNum
      this.setData.executor = e.executor
      this.setData.maintainTime = e.maintainTime
      this.setData.mPlan = e.mPlan
      if (this.setData.mPlan.frequencyType === 1){
        this.setData.mPlan.frequencyTypeString = '天'
      }else if (this.setData.mPlan.frequencyType === 2){
        this.setData.mPlan.frequencyTypeString = '周'
      }else if (this.setData.mPlan.frequencyType === 3){
        this.setData.mPlan.frequencyTypeString = '月(30天)'
      }
    })
  },
  methods:{
    close(){
      this.editDialogVisible = false
    }
  }
}
</script>

<style scoped>
</style>
