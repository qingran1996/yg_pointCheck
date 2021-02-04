<template>
  <div class="ticketDetail">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="deviceTitle" :visible.sync="editDialogVisible"
               width="45%" center :key="renderChild">
      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item title="作业票信息" name="1">
          <el-row :gutter="24">
            <el-col :span="12">
              <p><b>工单编号</b>:{{ msg.noteNo }}</p>
              <p><b>作业票编号</b>:{{ msg.jobWorkNo }}</p>
              <p><b>作业票类型</b>:{{ msg.jobTypeCodeName }}</p>
              <p><b>作业票级别</b>:{{ msg.jobLevelName }}</p>
              <p><b>作业票内容</b>:{{ msg.jobWorkContent }}</p>
            </el-col>
            <el-col :span="12">
              <p><b>作业票地址</b>:{{ msg.jobWorkLocation }}</p>
              <p><b>开始时间</b>:{{ msg.startTime }}</p>
              <p><b>结束时间</b>:{{ msg.endTime }}</p>
              <p><b>作业时长</b>:{{ msg.workHour }}h</p>
              <p><b>进程状态</b>:{{ msg.jwStatusName }}</p>
            </el-col>
          </el-row>
          <p><b>危险辨识内容</b></p>
          <div style="display: flex;justify-content: flex-start;flex-wrap:wrap;">
            <el-tag style="margin-left:8px;margin-bottom: 8px;" v-for="item in msg.jwDangerIdentityList"
                    :key="item.diCode" effect="plain" type="danger">{{ item.diContent }}
            </el-tag>
          </div>
          <p><b>环境监测物质</b></p>
          <div style="display: flex;justify-content: flex-start;flex-wrap: wrap;">
            <div v-for="item in msg.jwDetectMatterBoList" :key="item.detectTypeCode">
              <p>
                <el-tag effect="dark">{{ item.detectTypeCodeName }}</el-tag>
              </p>
              <el-tag style="margin-left:8px;margin-bottom: 8px;" v-for="item1 in item.detectMatterBos "
                      :key="item1.detectMatter" effect="plain" type="success">{{ item1.detectMatter }}
              </el-tag>
            </div>
          </div>
          <p><b>安全措施</b></p>
          <div style="display: flex;justify-content: flex-start;flex-wrap:wrap;">
            <el-tag style="margin-left:8px;margin-bottom: 8px;" v-for="item in msg.jwProtectMeasuresList"
                    :key="item.protectCode" effect="plain">{{ item.protectContent }}
            </el-tag>
          </div>
        </el-collapse-item>
        <el-collapse-item title="申请方" name="2">
          <el-col :span="12">
            <p><b>申请部门</b>:{{ msg.applyDepName }}</p>
            <p><b>申请人</b>:{{ msg.applyerName }}</p>
            <p><b>申请时间</b>:{{ msg.createTime }}</p>
          </el-col>
          <el-col :span="12">
            <div v-if="applyerBofre">
              <p><b>申请方作业票执行前签字地址</b>:{{ msg.applyerBofreSid.address }}</p>
              <p style="display: flex;align-items: center;"><b>申请方作业票执行前签字</b>:
                <el-image :src="picUrl + msg.applyerBofreSid.sidPath" style="width: 70px;height: 70px;"/>
              </p>
            </div>
            <div v-if="applyerAfter">
              <p><b>申请方作业票执行后签字地址</b>:{{ msg.applyerAfterSpid.address }}</p>
              <p style="display: flex;align-items: center;"><b>申请方作业票执行后签字</b>:
                <el-image :src="picUrl + msg.applyerAfterSpid.sidPath" style="width: 70px;height: 70px;"/>
              </p>
            </div>
          </el-col>
        </el-collapse-item>
        <el-collapse-item title="审批方" name="6">
          <p><b>审批人</b>:{{ msg.approverName }}</p>
          <p><b>审批人意见</b>:{{ msg.approverComment }}</p>
          <p v-if="approve"><b>审批人签字地址</b>:{{ msg.approveSid.address }}</p>
          <p v-if="approve" style="display: flex;align-items: center;"><b>审批人签字</b>:
            <el-image :src="picUrl+msg.approveSid.sidPath" style="width: 100px;height: 100px;"/>
          </p>
        </el-collapse-item>
        <el-collapse-item title="施工方" name="3">
          <el-row>
            <el-col :span="12">
              <p><b>施工单位</b>:{{ msg.constructedUnits }}</p>
              <p><b>施工负责人</b>:{{ msg.constructedManagerName }}</p>
            </el-col>
            <el-col :span="12">
              <p v-if="cm"><b>施工负责人签字地址</b>:{{ msg.cmSid.address }}</p>
              <p v-if="cm" style="display: flex;align-items: center;"><b>施工负责人签字</b>:
                <el-image :src="picUrl + msg.cmSid.sidPath" style="width: 70px;height: 70px;"/>
              </p>
            </el-col>
          </el-row>
          <div style="display: flex;justify-content: flex-start;flex-wrap: wrap;" v-if="jwConstructor">
            <div v-for="item in msg.jwConstructorList" :key="item.sid">
              <p><b>施工人</b>:{{ item.userName }}</p>
              <p><b>施工人签字地址</b>:{{ item.address }}</p>
              <p><b>施工人证书编号</b>:{{ item.cerNo }}</p>
              <p style="display: flex;align-items: center;"><b>施工人签字</b>:
                <el-image :src="picUrl + item.sidPath" style="width: 70px;height: 70px;"/>
              </p>
            </div>
          </div>
          <div v-if="constructionBefore">
            <p><b>施工方作业票执行前签字地址</b>:{{ msg.constructionBeforeSid.address }}</p>
            <p style="display: flex;align-items: center;"><b>施工方作业票执行前签字</b>:
              <el-image :src="picUrl + msg.constructionBeforeSid.sidPath" style="width: 70px;height: 70px;"/>
            </p>
          </div>
          <div v-if="constructionAfter">
            <p><b>施工方作业票执行后签字地址</b>:{{ msg.constructionAfterSpid.address }}</p>
            <p style="display: flex;align-items: center;"><b>施工方作业票执行后签字</b>:
              <el-image :src="picUrl + msg.constructionAfterSpid.sidPath" style="width: 70px;height: 70px;"/>
            </p>
          </div>
        </el-collapse-item>
        <el-collapse-item title="监护方" name="4">
          <el-row>
            <el-col :span="12">
              <p><b>监护负责人编号</b>:{{ msg.guarderCerNo }}</p>
              <p><b>监护负责人</b>:{{ msg.guarderName }}</p>
              <p><b>监护负责人工种</b>:{{ msg.guarderWorkType }}</p>
              <p v-if="guarderBefore"><b>监护负责人作业票执行前签字地址</b>:{{ msg.guarderBeforeSid.address }}</p>
              <p v-if="guarderBefore" style="display: flex;align-items: center;"><b>监护负责人作业票执行前签字</b>:
                <el-image :src="picUrl + msg.guarderBeforeSid.sidPath" style="width: 70px;height: 70px;"/>
              </p>
              <p v-if="guarderAfter"><b>监护负责人作业票执行后签字地址</b>:{{ msg.guarderAfterSpid.address }}</p>
              <p v-if="guarderAfter" style="display: flex;align-items: center;"><b>监护负责人作业票执行后签字</b>:
                <el-image :src="picUrl + msg.guarderAfterSpid.sidPath" style="width: 70px;height: 70px;"/>
              </p>
            </el-col>
            <el-col :span="12">
              <p><b>安巡员</b>:{{ msg.safetyPatrolName }}</p>
              <p v-if="safetyPatrol"><b>安巡员签字地址</b>:{{ msg.safetyPatrolSpid.address }}</p>
              <p v-if="safetyPatrol" style="display: flex;align-items: center;"><b>安巡员签字</b>:
                <el-image :src="picUrl + msg.safetyPatrolSpid.sidPath" style="width: 70px;height: 70px;"/>
              </p>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="安全方" name="5">
          <el-row>
            <el-col :span="12">
              <p><b>安全员姓名</b>:{{ msg.safetyOfficerName }}</p>
              <p v-if="saferLiveConfirm"><b>安全员签名地址</b>:{{ msg.saferLiveConfirmSid.address }}</p>
              <p v-if="saferLiveConfirm" style="display: flex;align-items: center;"><b>安全员签名</b>:
                <el-image :src="picUrl + msg.saferLiveConfirmSid.sidPath" style="width: 70px;height: 70px;"/>
              </p>
              <p><b>安全员意见</b>:{{ msg.saferComment }}</p>
            </el-col>
            <el-col :span="12">
              <p v-if="saferEducate"><b>安全教育员签字地址</b>:{{ msg.saferEducateSid.address }}</p>
              <p v-if="saferEducate" style="display: flex;align-items: center;"><b>安全教育员签字</b>:
                <el-image :src="picUrl + msg.saferEducateSid.sidPath" style="width: 70px;height: 70px;"/>
              </p>
            </el-col>
          </el-row>
          <div v-if="saferBefore">
            <p><b>安全方作业票执行前签字地址</b>:{{ msg.saferBeforeSid.address }}</p>
            <p style="display: flex;align-items: center;"><b>安全方作业票执行前签字</b>:
              <el-image :src="picUrl + msg.saferBeforeSid.sidPath" style="width: 70px;height: 70px;"/>
            </p>
          </div>
          <div v-if="saferAfter">
            <p><b>安全方作业票执行后签字地址</b>:{{ msg.saferAfterSpid.address }}</p>
            <p style="display: flex;align-items: center;"><b>安全方作业票执行后签字</b>:
              <el-image :src="picUrl + msg.saferAfterSpid.sidPath" style="width: 70px;height: 70px;"/>
            </p>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div slot="footer" class="footerClass">
        <el-button @click="editDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      deviceTitle: '作业票详情',
      editDialogVisible: false,
      renderChild: 0,
      safetyPatrol: true,
      saferLiveConfirm: true,
      jwConstructor: true,
      cm: true,
      approve: true,
      saferEducate: true,
      applyerBofre: true,
      applyerAfter: true,
      guarderBefore: true,
      guarderAfter: true,
      saferBefore: true,
      saferAfter: true,
      constructionBefore: true,
      constructionAfter: true,
      picUrl: this.documentEAMUrl('upload'),
      msg: {
        noteNo: '',
        applyerName: '',
        constructedManagerName: '',
        constructedUnits: '',
        cmSid: {},
        applyerBofreSid: {},
        applyerAfterSpid: {},
        guarderBeforeSid: {},
        guarderAfterSpid: {},
        constructionBeforeSid: {},
        constructionAfterSpid: {},
        saferBeforeSid: {},
        saferAfterSpid: {},
        jwConstructorList: [{
          sid: 999,
          userName: '',
          address: ''
        }],
        jwDangerIdentityList: [{
          diCode: 'save',
          diContent: '666'
        }],
        jwDetectMatterBoList: [{
          detectTypeCode: '006',
          detectTypeCodeName: '123',
          detectMatterBos: [{
            detectMatter: '氧气'
          }]
        }],
        jwProtectMeasuresList: [{
          protectCode: 54,
          protectContent: '666'
        }],
        saferLiveConfirmSid: {
          sidPath: ''
        },
        safetyPatrolSpid: {},
        saferEducateSid: {},
        jobTypeCodeName: '',
        jobLevelName: '',
        workHour: '',
        applyDepName: '',
        approverName: '',
        approverComment: '',
        approveSid: {},
        taskName: '',
        startTime: '',
        endTime: '',
        jwStatusName: ''
      },
      activeNames: ['1']
    }
  },
  created() {

  },
  mounted() {
    this.$bus.on('ticketDetailChild', e => {
      this.activeNames = ['1']
      this.getDetail(e.taskId, e.bussinessId, e.processInstanceId)
      setTimeout(() => {
        this.editDialogVisible = e.showDialog
      }, 220)
    })
  },
  watch: {
    editDialogVisible(val) {
      if (val === false) {
        this.renderChild += 1
      }
    }
  },
  methods: {
    getDetail(taskId, bussinessId, processInstanceId) {
      let par = {
        taskId,
        bussinessId,
        processInstanceId
      }
      this.$axios.post('/w/jobWork/taskDetail', par).then(res => {
        if (res.data.code === 0) {
          console.log(res)
          let key = res.data.data.dataResponse
          this.msg.noteNo = key.noteNo //工单编号
          this.msg.noteType = key.noteType //工单编号类型
          this.msg.workHour = key.planTimeLength //工作时长
          this.msg.startTime = this.formatDate(key.planStartTime) //工作时长
          this.msg.endTime = this.formatDate(key.planEndTime) //工作时长
          this.msg.applyDepName = key.applyDepName //申请部门
          this.msg.applyerName = key.applyerName //申请人
          if (key.applyerBofreSid) { //1
            this.msg.applyerBofreSid = key.applyerBofreSid
            this.applyerBofre = true
          } else {
            this.applyerBofre = false
          }
          if (key.applyerAfterSpid) { //2
            this.msg.applyerAfterSpid = key.applyerAfterSpid
            this.applyerAfter = true
          } else {
            this.applyerAfter = false
          }
          this.msg.createTime = this.formatDate(key.createTime) //作业票申请时间
          this.msg.approverName = key.approverName //审批人
          this.msg.approverComment = key.approverComment //审批人内容
          if (key.approveSid) {
            this.msg.approveSid = key.approveSid //审批人签字
            this.approve = true
          } else {
            this.approve = false
          }
          this.msg.constructedManagerName = key.constructedManagerName //施工负责人
          this.msg.constructedUnits = key.constructedUnits //施工单位
          if (key.cmSid) {
            this.msg.cmSid = key.cmSid //施工负责人签字
            this.cm = true
          } else {
            this.cm = false
          }
          if (key.jwConstructorList) {
            this.msg.jwConstructorList = key.jwConstructorList //施工人 arrayList
            this.jwConstructor = true
          } else {
            this.jwConstructor = false
          }
          if (key.constructionBeforeSid) {
            this.msg.constructionBeforeSid = key.constructionBeforeSid //执行前施工签字
            this.constructionBefore = true
          } else {
            this.constructionBefore = false
          }
          if (key.constructionAfterSpid) {
            this.msg.constructionAfterSpid = key.constructionAfterSpid //执行后施工签字
            this.constructionAfter = true
          } else {
            this.constructionAfter = false
          }
          this.msg.finalJobLevel = key.finalJobLevel //最终确认作业票等级
          this.msg.jobLevelName = key.jobLevelName //初始判断作业票等级
          this.msg.jobTypeCodeName = key.jobTypeCodeName //作业票类型
          this.msg.jobWorkContent = key.jobWorkContent //作业票内容
          this.msg.jobWorkLocation = key.jobWorkLocation //作业票地址
          this.msg.jobWorkNo = key.jobWorkNo //作业票编号
          this.msg.jwStatusName = key.jwStatusName //进程状态
          this.msg.guarderName = key.guarderName //监护人
          this.msg.guarderCerNo = key.guarderCerNo //监护人编号
          this.msg.guarderWorkType = key.guarderWorkType //监护人工种
          if (key.guarderBeforeSid) {
            this.msg.guarderBeforeSid = key.guarderBeforeSid //监护人签字第一次
            this.guarderBefore = true
          } else {
            this.guarderBefore = false
          }
          if (key.guarderAfterSpid) {
            this.msg.guarderAfterSpid = key.guarderAfterSpid //监护人签字第二次
            this.guarderAfter = true
          } else {
            this.guarderAfter = false
          }
          this.msg.safetyOfficerName = key.safetyOfficerName //安全员姓名
          this.msg.safetyPatrolName = key.safetyPatrolName //安巡员姓名
          if (key.safetyPatrolSpid) {
            this.msg.safetyPatrolSpid = key.safetyPatrolSpid //安巡员姓名
            this.safetyPatrol = true
          } else {
            this.safetyPatrol = false
          }
          this.msg.saferComment = key.saferComment //安全员审核意见
          if (key.saferLiveConfirmSid) {
            this.msg.saferLiveConfirmSid = key.saferLiveConfirmSid //安全员现场签字
            this.saferLiveConfirm = true
          } else {
            this.saferLiveConfirm = false
          }
          if (key.saferEducateSid) {
            this.msg.saferEducateSid = key.saferEducateSid //安全教育人现场签字
            this.saferEducate = true
          } else {
            this.saferEducate = false
          }
          if (key.saferBeforeSid) {
            this.saferBeforeSid = key.saferBeforeSid //1
            this.saferBefore = true
          } else {
            this.saferBefore = false
          }
          if (key.saferAfterSpid) {
            this.saferAfterSpid = key.saferAfterSpid //2
            this.saferAfter = true
          } else {
            this.saferAfter = false
          }
          this.msg.jwDangerIdentityList = key.jwDangerIdentityList //危险辨识
          this.msg.jwDetectMatterBoList = key.jwDetectMatterBoList //环境检测物质（map）
          this.msg.jwProtectMeasuresList = key.jwProtectMeasuresList //保护措施
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    lookpic(row) {
      window.open(this.documentEAMUrl('preview') + encodeURIComponent(row))
    }
  }
}
</script>

<style scoped>
.ticketDetail {

}

.ticketDetail >>> .el-collapse-item__header {
  font-size: 18px;
  color: #409EFF;
}
</style>
