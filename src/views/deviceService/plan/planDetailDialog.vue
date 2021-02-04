<template>
  <div class="planDetailDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="DialogTitle" :visible.sync="editDialogVisible"
               width="40%" center :key="renderDialog">
      <el-collapse v-model="activeNames" >
        <el-collapse-item title="设备信息" name="1">
          <div class="deviceDetail">
            <el-col :span="12">
              <p><b style="color:#303133;">设备名</b>: {{ infoData.device.deviceName }}</p>
              <p><b style="color:#303133;">设备位号</b>: {{ infoData.device.deviceKks }}</p>
              <p><b style="color:#303133;">资产编号</b>: {{ infoData.device.assetCode }}</p>
              <p><b style="color:#303133;">规格型号</b>: {{ infoData.device.specificationModel }}</p>
            </el-col>
            <el-col :span="12">
              <p><b style="color:#303133;">重要参数</b>: {{ infoData.device.mainParameters }}</p>
              <p><b style="color:#303133;">生产厂家</b>: {{ infoData.device.mainParameters }}</p>
              <p><b style="color:#303133;">生产时间</b>: {{ infoData.device.productionTime }}</p>
              <p><b style="color:#303133;">是否为危险品</b>: {{ infoData.device.isSpecialString }}</p>
            </el-col>
          </div>
        </el-collapse-item>
        <el-collapse-item title="保养计划" name="2">
          <div class="deviceDetail">
            <el-col :span="12">
              <p><b style="color:#303133;">计划执行人</b>:{{ infoData.executor }}</p>
              <p><b style="color:#303133;">保养计划编号</b>: {{ infoData.maintainPlan.planNum }}</p>
              <p><b style="color:#303133;">保养标题</b>: {{ infoData.maintainPlan.title }}</p>
              <p><b style="color:#303133;">计划预计执行时间</b>: {{ infoData.maintainTime }}</p>
            </el-col>
            <el-col :span="12">
              <p><b style="color:#303133;">执行时间</b>:{{ infoData.executeTime }}</p>
              <p><b style="color:#303133;">保养计划频率</b>: {{ infoData.maintainPlan.frequency }}</p>
              <p><b style="color:#303133;">保养计划预计工作时间</b>: {{ infoData.maintainPlan.time }}h</p>
              <p><b style="color:#303133;">保养计划周期</b>: {{ infoData.maintainPlan.frequencyType }}</p>
            </el-col>
            <p><b style="color:#303133;">保养计划内容</b>: {{ infoData.maintainPlan.content }}</p>
          </div>
        </el-collapse-item>
        <el-collapse-item title="保养前后对比" name="3">
          <el-col :span="12">
            <p>保养前:</p>
            <el-image :src="infoData.beforeImagePath" style="width: 150px;height: 150px;" @click="lookBefore"></el-image>
          </el-col>
          <el-col :span="12">
            <p>保养后:</p>
            <el-image :src="infoData.afterImagePath" style="width: 150px;height: 150px;" @click="lookAfter"></el-image>
          </el-col>
        </el-collapse-item>
      </el-collapse>
      <span slot="footer" class="footerClass">
        <el-button type="primary" @click="close">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editDialogVisible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      detailUrl:this.documentEAMUrl('preview'),
      renderDialog: 1, //重新渲染方式
      DialogTitle: '历史计划详情',
      infoData: {
        device: {
          deviceName: '名',
          deviceKks: 'kks',
          assetCode: '资产编号',
          specificationModel: '规格型号',
          mainParameters: '参数',
          productionTime: '生产时间',
          isSpecialString: 'y'
        },
        maintainPlan: {
          planNum: '计划名',
          content: '内容',
          frequencyType: '周期',
          frequency: '频率',
          time: '时间',
          title: '标题'
        },
        executeTime: 'time',
        maintainTime: '111',
        executor: '执行人', //负责人
        beforeImagePath:'',
        afterImagePath:''
      },
      jsonid: null,
      activeNames: []  //折叠面板
    }
  },
  watch: {
    // 当dialog关闭，对表单的清空
    editDialogVisible(val) {
      if (val === false) {
        this.againRender()
      }
    }
  },
  created() {
    this.$bus.on('planList2', e => {
     // console.log('保养计划详情',e)
      this.activeNames=['1']
      this.editDialogVisible = e.show
      this.infoData = e.msg //接收到的信息
      this.infoData.device.productionTime = this.formatDate(this.infoData.device.productionTime).split(' ')[0]
      this.infoData.device.isSpecialString = this.infoData.device.isSpecial === 1 ? '是' : '否'
      this.infoData.executeTime = this.formatDate(this.infoData.executeTime).split(' ')[0]
      if (this.infoData.maintainPlan.frequencyType === 1){
        this.infoData.maintainPlan.frequencyType ='天'
      }else if (this.infoData.maintainPlan.frequencyType ===2){
        this.infoData.maintainPlan.frequencyType = '周'
      }else if (this.infoData.maintainPlan.frequencyType ===3){
        this.infoData.maintainPlan.frequencyType = '月(30天)'
      }
    })
  },
  methods: {
    close() {
      this.editDialogVisible = false
    },
    againRender() {
      this.renderDialog += 1
    },
    lookBefore(){
      window.open(this.detailUrl + encodeURIComponent(this.infoData.beforeImagePath))
    },
    lookAfter(){
      window.open(this.detailUrl + encodeURIComponent(this.infoData.afterImagePath))
    }
  }
}
</script>

<style scoped>
.planDetailDialog >>> .el-collapse-item__header {
  font-size: 18px;
  color: #409EFF;
}

.deviceDetail {
  color: #606266;
}
</style>
