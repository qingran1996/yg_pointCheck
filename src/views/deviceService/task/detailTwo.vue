<template>
  <div class="detailTwo">
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
        <el-form-item label="应执行时间">
          <span style="color: red;">{{setData.maintainTime}}</span>
        </el-form-item>
        <el-form-item label="人员配置">
          <div class="personSet">
            <el-switch v-model="isSetPersonAgain" :active-text="activeText" inactive-text="关闭"/>
            <el-input v-show="isSetPersonAgain" v-model="personString" placeholder="请重新配置人员" />
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="footerClass">
        <el-button  @click="close">关闭</el-button>
        <el-button type="primary" v-show="isSetPersonAgain" @click="surePerson" v-prevent-re-click>人员配置</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editDialogVisible: false,
      DialogTitle: '未保养的信息',
      isSetPersonAgain:false, //是否人员重新配置开关
      personString:'', //人员重新配置
      activeText:'重新配置',
      setData:{
        deviceName:'',
        planNum:'',
        deviceId:null,
        planId:null,
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
          deviceId:null,
          planId:null,
          maintainTime:'',
          executor:'',
          mPlan:{
            content:'',
            frequency:1,
            title:'',
            frequencyType:null,
            frequencyTypeString:'',
          }
        }
        this.isSetPersonAgain = false
        this.personString = ''
      }
    },
    personString(val){
      if (val === ''){
        this.activeText = '重新配置'
      }else {
        this.activeText = '已配置'
        this.isSetPersonAgain = true
      }
    }
  },
  created() {
    this.$bus.on('lookDetailTwo',e=>{
      this.editDialogVisible = e.show
      //console.log('未保养',e)
      this.setData.deviceName = e.deviceName
      this.setData.deviceId = e.deviceId
      this.setData.maintainTime = e.maintainTime
      this.setData.executor = e.executor
      this.personString  = e.executor
      this.setData.planId = e.planId
      this.setData.planNum = e.planNum
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
    },
    //人员的指派
    surePerson(){
      if (this.personString.length>0){ //对人员输入长度控制
        let par={
          deviceId:this.setData.deviceId, //number
          maintainPlanId:this.setData.planId, //number
          executor:this.personString //执行人 string
        }
        this.$axios.post('/d/MaintainRuTask/setExecutor',par).then(res=>{
          if (res.data.code ===0){
            this.$message.success('成功指派')
            this.close()
            this.$bus.emit('renderService',true)
          }else {
            this.$message.error(res.data.message)
          }
        }).catch(err=>{
          console.log(err)
        })
      }else if (this.personString.length === 0){
        this.$message.error('人员不能为空')
      }else if (this.personString.length<16){
        this.$message.error('配置人员长度不能超过16位')
      }
    }
  }
}
</script>

<style scoped>
.personSet{
  height: 55px;
}
.personSet >>>.el-input__inner{
  width: 240px;
  position: absolute;
  left: 160px;
  top: -56px;
}
.personSet >>>.el-input__icon{
  position: relative;
  left: -2vw;
  top: -56px;
}
</style>
