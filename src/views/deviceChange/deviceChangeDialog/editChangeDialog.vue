<template>
  <div class="editDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="变更操作" :visible.sync="editDialogVisible" width="30%"
               center>
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="infoData.name" clearable/>
        </el-form-item>
        <el-form-item label="设备位号" prop="deviceKks">
          <el-input v-model="infoData.deviceKks" disabled/>
        </el-form-item>
        <el-form-item label="资产编号" prop="assetCode">
          <el-input v-model="infoData.assetCode" clearable/>
        </el-form-item>
        <el-form-item label="规格型号" prop="specificationModel">
          <el-input v-model="infoData.specificationModel" clearable/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="infoData.status">
            <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="调整原因" prop="reason">
          <el-input v-model="infoData.reason" clearable/>
        </el-form-item>
        <el-form-item label="调整后设备现状" prop="afterStatus">
          <el-input v-model="infoData.afterStatus" clearable/>
        </el-form-item>
        <el-form-item label="调整人" prop="person">
          <el-input v-model="infoData.person" clearable/>
        </el-form-item>
        <el-form-item label="调整时间" prop="time">
          <el-input v-model="infoData.time" />
        </el-form-item>
        <el-form-item label="风险控制措施" prop="measures">
          <el-input v-model="infoData.measures" type="textarea" clearable :maxlength="200" show-word-limit :rows="4" resize="none"/>
        </el-form-item>
        <el-form-item label="单位设备部门意见" prop="deptAdvice">
          <el-input v-model="infoData.deptAdvice" type="textarea" clearable :maxlength="200" show-word-limit :rows="4" resize="none"/>
        </el-form-item>
        <el-form-item label="设备业务管理部门意见" prop="securityAdvice">
          <el-input v-model="infoData.securityAdvice" type="textarea" clearable :maxlength="200" show-word-limit :rows="4" resize="none"/>
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
      infoData: {
        name: '',
        deviceKks: '',
        specificationModel: '',
        assetCode: '',
        status: '',
        reason: '',
        afterStatus: '',
        person: '',
        time: null,
        measures: '',
        deptAdvice: '',
        securityAdvice: ''
      },
      statusList:[]
    }
  },
  watch: {
    // 当dialog关闭，对表单内容的清空
    editDialogVisible(val) {
      if (val === false) {
        this.infoData = {
          name: '',
          deviceKks: '',
          specificationModel: '',
          assetCode: '',
          status: '',
          reason: '',
          afterStatus: '',
          person: '',
          time: null,
          measures: '',
          deptAdvice: '',
          securityAdvice: ''
        }
      }
    }
  },
  created() {
    // 编辑bus传值&跳转实现
    this.$bus.$on('edit', (e) => {
      //console.log('状态',e)
      this.infoData.name = e.name
      this.infoData.deviceKks = e.deviceKks
      this.infoData.specificationModel = e.specificationModel
      this.infoData.assetCode = e.assetCode
      this.infoData.person = e.changePerson
      this.infoData.time = e.changeTime
      this.infoData.status = e.status
      this.statusList = e.statusList
      this.editDialogVisible = true
    })
    //新增跳转
    // this.$bus.$on('add',(e)=>{
    //   this.editDialogVisible = e
    // })
  },
  methods: {
    close() {
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
</style>
