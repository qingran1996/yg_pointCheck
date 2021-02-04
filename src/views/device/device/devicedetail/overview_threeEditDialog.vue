<template>
  <div class="dialog">
    <el-dialog v-dialogDrag :title="deviceTitle" :visible.sync="editDialogVisible"
               width="50%"
               center destroy-on-close>
      <el-form :model="infoData" label-width="130px" class="demo-ruleForm" size="small" ref="infoform">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备编号" prop="equipmentNo" v-if="judge1">
              <el-input v-model="infoData.equipmentNo" disabled/>
            </el-form-item>
            <el-form-item label="设备位号" prop="equipmentCode" v-if="judge1">
              <el-input v-model="infoData.equipmentCode" disabled/>
            </el-form-item>
            <el-form-item label="工单编号" prop="workNoteNo" v-if="judge1">
              <el-input v-model="infoData.workNoteNo" disabled/>
            </el-form-item>
            <el-form-item label="设备位置" prop="equipmentLocation" v-if="judge1">
              <el-input v-model="infoData.equipmentLocation" disabled/>
            </el-form-item>
            <el-form-item label="问题描述" prop="problemContent" v-if="judge1">
              <el-input v-model="infoData.problemContent" disabled/>
            </el-form-item>
            <el-form-item label="问题图片" prop="applyPics" v-if="judge1">
              <el-image style="width: 100px;height: 100px" v-for="item in urlquestion" :src="item.url" :key="item.id"></el-image>
            </el-form-item>
            <el-form-item label="申请人" prop="applyerName" v-if="judge1">
              <el-input v-model="infoData.applyerName" disabled/>
            </el-form-item>
            <el-form-item label="申请部门" prop="processingDepName" v-if="judge1">
              <el-input v-model="infoData.applyDepName" disabled/>
            </el-form-item>
            <el-form-item label="申请时间" prop="applyTime" v-if="judge1">
              <el-input v-model="infoData.applyTime" disabled/>
            </el-form-item>
            <el-form-item label="确认人" prop="problemConfirmerName" v-if="judge1">
              <el-input v-model="infoData.problemConfirmerName" disabled/>
            </el-form-item>
            <el-form-item label="问题确认" prop="isConfirm" v-if="judge1">
              <el-input v-model="infoData.isConfirm" disabled/>
            </el-form-item>
            <el-form-item label="问题确认审核意见" prop="problemConfirmComment" v-if="judge1">
              <el-input v-model="infoData.problemConfirmComment" disabled/>
            </el-form-item>
            <el-form-item label="是否危险作业" prop="isDangerous" v-if="judge1&&judge2">
              <el-input v-model="infoData.isDangerous" disabled/>
            </el-form-item>
            <el-form-item label="维修人" prop="processingPersonName" v-if="judge1&&judge2">
              <el-input v-model="infoData.processingPersonName" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维修部门" prop="processingDepName" v-if="judge1&&judge2&&judge3">
              <el-input v-model="infoData.processingDepName" disabled/>
            </el-form-item>
            <el-form-item label="维修时间" prop="processingTime" v-if="judge1&&judge2&&judge3">
              <el-input v-model="infoData.processingTime" disabled/>
            </el-form-item>
            <el-form-item label="维修结果" prop="processingResult" v-if="judge1&&judge2&&judge3">
              <el-input v-model="infoData.processingResult" disabled/>
            </el-form-item>
            <el-form-item label="维修内容" prop="processingContent" v-if="judge1&&judge2&&judge3">
              <el-input v-model="infoData.processingContent" disabled/>
            </el-form-item>
            <el-form-item label="维修图片" prop="processingPics" v-if="judge1&&judge2&&judge3">
              <el-image style="width: 100px;height: 100px" v-for="item in urlprocess" :src="item.url" :key="item.id"></el-image>
            </el-form-item>
            <el-form-item label="是否有遗留问题" prop="isLegacy" v-if="judge1&&judge2&&judge3">
              <el-input v-model="infoData.isLegacy" disabled/>
            </el-form-item>
            <el-form-item label="遗留问题内容" prop="legacyContent" v-if="judge1&&judge2&&judge3">
              <el-input v-model="infoData.legacyContent" disabled/>
            </el-form-item>
            <el-form-item label="故障类型" prop="faultTypeName" v-if="judge1&&judge2&&judge3">
              <el-input v-model="infoData.faultTypeName" disabled/>
            </el-form-item>
            <el-form-item label="故障分析" prop="faultAnalysis" v-if="judge1&&judge2&&judge3">
              <el-input v-model="infoData.faultAnalysis" disabled/>
            </el-form-item>
            <el-form-item label="维修结果确认人" prop="confirmResultPersonName" v-if="judge1&&judge2&&judge3&&judge4">
              <el-input v-model="infoData.confirmResultPersonName" disabled/>
            </el-form-item>
            <el-form-item label="维修结果审核意见" prop="resultConfirmComment" v-if="judge1&&judge2&&judge3&&judge4">
              <el-input v-model="infoData.resultConfirmComment" disabled/>
            </el-form-item>
            <el-form-item label="状态" prop="workOrderStatus" v-if="judge1&&judge2&&judge3">
              <el-input v-model="infoData.workOrderStatus" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="footerClass">
				<el-button type="primary" @click="updateInfo">确定</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deviceTitle: '的维修详情',
      editDialogVisible: false,
      status: '',
      picShowUrl:this.documentEAMUrl('upload'),
      infoData: {
        applyDepName: '', //申请部门
        applyTime: '',//申请时间
        equipmentCode: '',//设备位号
        applyerName: '', //申请人
        equipmentNo: '',//设备编号
        problemContent: '', //问题描述
        workNoteNo: '',//工单编号
        workOrderStatus: '',//状态
        processingResult: '', //维修结果
        equipmentLocation: '',//设备位置
        problemConfirmerName: '',//问题确认人
        isConfirm: null, //问题是否确认
        isDangerous: null, //是否危险
        processingPersonName: '',//维修人名
        processingDepName: '',//维修人部门
        processingTime: '', //维修时间
        processingContent: '',//维修内容
        isLegacy: '',//是否遗留问题
        legacyContent: '',//遗留内容
        faultAnalysis: '',//故障分析
        faultTypeName: null,//故障类型
        confirmResultPersonName: '',//维修结果确认人
        confirmResultStatus: null,//维修结果确认状态-
        problemConfirmTime: '',//问题确认时间-
        confirmResultTime: '',//维修结果确认时间-
        applyPics: [],//申请问题图片
        processingPics: [] ,//问题处理图片
        problemConfirmComment:'' ,//问题确认审核意见
        resultConfirmComment:'' //结果确认审核意见
      },
      urlprocess: [],
      urlquestion: [],
      judge1: false,
      judge2: false,
      judge3: false,
      judge4: false,
      tip1: '待确认',
      tip2: '已确认',
      tip3: '已驳回',
      tip4: '未修复',
      tip5: '已修复',
      tip6: '已关闭'
    }
  },
  created() {

  },
  mounted() {
    this.$bus.off('threeDetails')
    this.$bus.$on('threeDetails', e => {
      if (e.show === true) {
        this.deviceTitle = '的维修详情'
        console.log('维修情况弹窗信息', e)
        this.status = e.status
        this.deviceTitle = e.status + this.deviceTitle
        this.editDialogVisible = true
        this.judgeShow(e.status)
        this.infoData.applyDepName = e.msg.applyDepName
        this.infoData.applyTime = e.msg.applyTime
        this.infoData.applyerName = e.msg.applyerName
        this.infoData.equipmentCode = e.msg.equipmentCode
        this.infoData.problemContent = e.msg.problemContent
        this.infoData.workNoteNo = e.msg.workNoteNo
        this.infoData.workOrderStatus = e.msg.workOrderStatus
        this.infoData.processingResult = e.msg.processingResult
        this.Tid = e.msg.id
        console.log(this.Tid, this.infoData.applyDepName)
        this.urlquestion = []
        this.urlprocess = []
        this.getDetail(this.Tid, 'workNote')
      }
    })
  },
  watch: {},
  methods: {
    updateInfo() {
      this.editDialogVisible = false
      this.$refs.infoform.resetFields()
    },
    //判断什么状态显示那些窗口数据
    judgeShow(status) {
      this.judge1 = false
      this.judge2 = false
      this.judge3 = false
      this.judge4 = false
      if (status === this.tip1 || status === this.tip3) {
        this.judge1 = true
      } else if (status === this.tip2) {
        this.judge1 = true
        this.judge2 = true
      } else if (status === this.tip4 || status === this.tip5) {
        this.judge1 = true
        this.judge2 = true
        this.judge3 = true
        this.judge4 = true
      } else if (status === this.tip6) {
        this.judge1 = true
        this.judge2 = true
        this.judge3 = true
        this.judge4 = true
      }
    },
    getDetail(Tid, deploymentName) {
      let Tparams = {
        bussinessId: Tid,
        deploymentName: deploymentName
      }
      this.$axios.post('/w/equipmentMaintenanceBussiness/getEMDetail', Tparams).then(res => {
        if (res.data.code === 0) {
          let getdata = res.data.data
          console.log('detali', res.data.data)
          this.infoData.equipmentNo = getdata.equipmentNo
          this.infoData.equipmentLocation = getdata.equipmentLocation
          this.infoData.problemConfirmerName = getdata.problemConfirmerName
          if ('isConfirm' in getdata){
            this.infoData.isConfirm = getdata.isConfirm ===0?'问题驳回':'已确认'  //问题是否已确认（包含问题结果 null:待... 0:驳回 1:已确认）
          }else {
            this.infoData.isConfirm ='待确认中'
          }
          this.infoData.isDangerous = getdata.isDangerous ===0? '否':'是'
          this.infoData.processingPersonName = getdata.processingPersonName
          this.infoData.processingDepName = getdata.processingDepName
          this.infoData.processingContent = getdata.processingContent
          this.infoData.isLegacy = getdata.isLegacy ===1?'是':'否'
          this.infoData.legacyContent = getdata.legacyContent
          this.infoData.faultTypeName = getdata.faultTypeName
          this.infoData.faultAnalysis = getdata.faultAnalysis
          this.infoData.confirmResultPersonName = getdata.confirmResultPersonName
          this.infoData.confirmResultStatus = getdata.confirmResultStatus ===0?'未确认':'已确认'
          this.infoData.problemConfirmComment = getdata.problemConfirmComment
          this.infoData.resultConfirmComment = getdata.resultConfirmComment
          this.infoData.problemConfirmTime = this.formatDate(getdata.problemConfirmTime)
          this.infoData.processingTime = this.formatDate(getdata.processingTime)
          this.infoData.confirmResultTime = this.formatDate(getdata.confirmResultTime)
          if (getdata.applyPics.length>0){
            this.infoData.applyPics = getdata.applyPics
            for (let i=0;i<getdata.applyPics.length;i++){
              let ipic={
                url:this.picShowUrl+this.infoData.applyPics[i].picPath,
                id:this.infoData.applyPics[i].attachId
              }
              this.urlquestion.push(ipic)
            }
          }
          if (getdata.processingPics.length>0){
            this.infoData.processingPics = getdata.processingPics
            for (let j=0;j<getdata.processingPics.length;j++){
              let jpic={
                url:this.picShowUrl+this.infoData.processingPics[j].picPath,
                id:this.infoData.processingPics[j].attachId
              }
              this.urlprocess.push(jpic)
            }
          }
          //console.log('questionpic',this.infoData.applyPics)
        }else {
          this.$message(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  beforeDestroy() {
  }
}
</script>

<style scoped>
.dialog {

}
</style>
