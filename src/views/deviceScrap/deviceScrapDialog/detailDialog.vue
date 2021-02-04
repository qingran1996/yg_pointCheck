<template>
  <div class="editDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="设备报废详情" :visible.sync="editDialogVisible" width="30%" center>
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm">
        <el-form-item label="设备编号" prop="deviceCode">
          <el-input v-model="infoData.deviceCode" disabled/>
        </el-form-item>
        <el-form-item label="申请人" prop="applicant">
          <el-input v-model="infoData.applicant" disabled/>
        </el-form-item>
        <el-form-item label="申请时间" prop="createTime">
          <el-input v-model="infoData.createTime" disabled/>
        </el-form-item>
        <el-form-item label="申请部门" prop="dept">
          <el-input v-model="infoData.dept" disabled/>
        </el-form-item>
        <el-form-item label="申请原因" prop="reason">
          <el-input v-model="infoData.reason" disabled/>
        </el-form-item>
        <el-form-item label="是否为危险品" prop="isDanger">
          <el-radio-group v-model="ruleRadio" disabled>
            <el-radio  :label="1">是</el-radio>
            <el-radio  :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="ruleRadio===1" label="危险品迁址方案" prop="mainArgs">
          <el-input v-model="infoData.mainArgs" placeholder="危险品的处理方案" disabled/>
        </el-form-item>
        <el-form-item label="图片" prop="pic">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-change="handleChange"
            :file-list="infoData.pic"
            disabled
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item label="审批人" prop="approve">
          <el-input v-model="infoData.approve" disabled/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="footerClass">
        <el-button @click="close">关闭</el-button>
<!--        <el-button type="primary" @click="updateInfo">确定</el-button>-->
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
      fileList: [{
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }],
      infoData: {
        applicant: '',
        deviceCode: '',
        reason: '',
        createTime: '',
        isDanger: '',
        pic: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }],
        dept: '',
        approve: '',
        mainArgs:''
      },
      ruleRadio: 0
    }
  },
  watch: {
    // 当dialog关闭，对表单内容的清空
    editDialogVisible(val) {
      if (val === false) {
        this.infoData.applicant = ''
        this.infoData.deviceCode = ''
        this.infoData.dept = ''
        this.infoData.reason = ''
        this.infoData.approve = ''
        this.infoData.createTime = ''
        this.infoData.isDanger = ''
        this.ruleRadio = 0
      }
    }
  },
  created() {
    // 编辑bus传值&跳转实现
    this.$bus.$on('detail', (e) => {
      this.infoData.applicant = e.applicant
      this.infoData.deviceCode = e.deviceCode
      this.infoData.dept = e.dept
      this.infoData.reason = e.reason
      this.infoData.approve = e.approve
      this.infoData.createTime = e.createTime
      this.infoData.isDanger = e.isDanger
      this.editDialogVisible = true
      this.ruleRadio=this.infoData.isDanger ==='是' ? 1 : 2
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
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3)
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
