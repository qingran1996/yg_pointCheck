<template>
  <div class="setPerson">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="DialogTitle" :visible.sync="editDialogVisible"
               width="30%" center >
      <el-form :model="setData" label-width="100px" class="demo-ruleForm" ref="setForm" :rules="rules">
        <el-form-item label="保养计划编号" prop="planNum">
          {{ setData.planNum }}
        </el-form-item>
        <el-form-item label="被保养的设备">
          {{setData.deviceName}}
        </el-form-item>
        <el-form-item label="指派人员" prop="executor">
          <el-input v-model="setData.executor" clearable/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="footerClass">
        <el-button  @click="close">取消</el-button>
        <el-button type="primary" @click="setSubmit" v-prevent-re-click>确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editDialogVisible: false,
      DialogTitle: '指派人员',
      setData:{
        deviceId:null,
        deviceName:'',
        planId:null,
        planNum:'',
        executor:''
      },
      rules:{
        executor:[{
          required:true,
          message:'请指派人员',
          trigger: 'change'
        }]
      }
    }
  },
  watch:{
    editDialogVisible(val){
      if (val ===false){
        this.setData={
          deviceId:null,
          deviceName:'',
          planId:null,
          planNum:'',
          executor:''
        }
      }
    }
  },
  created() {
    this.$bus.on('setPerson',e=>{
      this.editDialogVisible = e.show
      this.setData.deviceId = e.deviceId
      this.setData.deviceName = e.deviceName
      this.setData.planId = e.planId
      this.setData.planNum = e.planNum
      this.setData.executor = e.executor
    })
  },
  methods:{
    close(){
      this.editDialogVisible = false
    },
    setSubmit(){
      this.$refs.setForm.validate((valid)=>{
        if (valid){
          let par={
            deviceId:this.setData.deviceId, //number
            maintainPlanId:this.setData.planId, //number
            executor:this.setData.executor //执行人 string
          }
          this.$axios.post('/d/MaintainRuTask/setExecutor',par).then(res=>{
            if (res.data.code ===0){
              this.$message.success('成功指派!')
              this.close()
              this.$bus.emit('renderService',true)
            }else {
              this.$message.error(res.data.message)
            }
          }).catch(err=>{
            console.log(err)
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.setPerson {

}
</style>
