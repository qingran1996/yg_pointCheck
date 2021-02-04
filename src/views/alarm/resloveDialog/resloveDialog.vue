<template>
  <div class="editDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="警告记录处理" :visible.sync="editDialogVisible" width="30%" center>
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm">
        <el-form-item label="告警名称" prop="alarmName">
          <el-input v-model="infoData.alarmName"  />
        </el-form-item>
        <el-form-item label="告警类型" prop="alarmType">
          <el-input v-model="infoData.alarmType" />
        </el-form-item>
        <el-form-item label="告警级别" prop="alarmLevel">
          <el-input v-model="infoData.alarmLevel" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-input v-model="infoData.startTime"/>
        </el-form-item>
        <el-form-item label="处理意见" prop="advice">
          <el-input v-model="infoData.advice" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="footerClass">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="updateInfo">确定</el-button>
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
      infoData: {
        alarmName: '',
        alarmType: '',
        alarmLevel: '',
        startTime: '',
        advice: ''
      }
    }
  },
  watch: {
    // 当dialog关闭，对表单内容的清空
    editDialogVisible(val) {
      if (val === false) {
        this.infoData.alarmName = ''
        this.infoData.alarmType = ''
        this.infoData.alarmLevel = ''
        this.infoData.startTime = ''
        this.infoData.advice = ''
      }
    }
  },
  created() {
    // 编辑bus传值&跳转实现
    this.$bus.$on('reslove', (e) => {
      this.infoData.alarmName = e.alarmName
      this.infoData.alarmType = e.alarmType
      this.infoData.alarmLevel = e.alarmLevel
      this.infoData.startTime = e.startTime
      this.infoData.advice = e.advice

      this.editDialogVisible = true
    })

  },
  methods: {
    close(){
      this.editDialogVisible = false
    },
    updateInfo() {
      setTimeout(() => {
        this.close()
        this.$message({
          message: '成功修改',
          type: 'success'
        })
      }, 100)
    }

  }
}
</script>

<style scoped>
.el-form-item {
  margin: 10px 0;
}
/* .ruleform>>>.el-form-item__content {
  display: inline-block;
  margin-bottom: 8px;
  margin-left: 10px;
}

.ruleform>>>.el-input__inner {
  width: 200px;
  margin-left: 30px;
}

.ruleform>>>.el-card__body {
  width: 400px;
}

el-form-item>>>.el-radio__inner {
  line-height: 36px;
}

el-form-item>>>.el-radio__label {
  line-height: 36px;
}

.m-upload {}

.ruleform>>>.el-upload-list__item-name {
  margin-left: 30px;
  margin-top: -40px;
  width: 100px;
}

.ruleform>>>.el-upload-list {
  margin-left: 18%;
} */
</style>
