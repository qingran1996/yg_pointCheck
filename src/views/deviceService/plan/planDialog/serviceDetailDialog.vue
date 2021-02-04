<template>
  <div class="serviceDetailDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="DialogTitle" :visible.sync="editDialogVisible" width="30%" center :key="renderDialog">
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm" >
        <el-form-item label="保养计划编号" prop="planNum">
          <el-input v-model="infoData.planNum"   :disabled="inputDisabled"/>
        </el-form-item>
        <el-form-item label="保养标题" prop="title">
          <el-input v-model="infoData.title" disabled/>
        </el-form-item>
        <el-form-item label="保养内容" prop="content">
          <el-input v-model="infoData.content" type="textarea" resize="none" :maxlength="200" :rows="4" :show-word-limit="true" disabled/>
        </el-form-item>
        <el-form-item label="预计保养时间(h)" prop="time">
          <el-input-number v-model="infoData.time"  :step="1" controls-position="right" disabled/>
        </el-form-item>
        <el-form-item label="保养频率" prop="frequency">
          <el-input-number v-model="infoData.frequency" controls-position="right" disabled/>
        </el-form-item>
        <el-form-item label="保养频率周期" prop="frequencyType">
          <el-select v-model="infoData.frequencyType" disabled>
            <el-option label="日" :value="1"/>
            <el-option label="周" :value="2"/>
            <el-option label="月(30天)" :value="3"/>
          </el-select>
        </el-form-item>
        <el-form-item label="保养计划创建人" prop="creator">
          <el-input v-model="infoData.creator"  disabled/>
        </el-form-item>
      </el-form>
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
      renderDialog:1, //重新渲染方式
      DialogTitle:'保养计划详情',
      inputDisabled:true, //编号新增时，后端自动生成;而编辑时，应该也不能更改
      infoData: { }
    }
  },
  watch: {
    // 当dialog关闭，对表单的清空
    editDialogVisible(val) {
      if (val === false) {
        this.againRender()
        this.resetForm1()
      }
    }
  },
  created() {
    this.$bus.on('serviceLook',e=>{
      this.editDialogVisible = e.show
      this.getDetail(e.planNum)
    })
  },
  methods: {
    //获取详情信息
    getDetail(planNum){
      let par={
        planNum:planNum
      }
      this.$axios.post('/d/maintainPlan/get',par).then(res=>{
        if (res.data.code === 0){
         // console.log('详情',res)
          this.infoData = res.data.data
        }else {
          this.$message.error(res.data.message)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    close() {
      this.editDialogVisible = false
    },
    againRender() {
      this.renderDialog += 1
    },
    resetForm1() { //表单重置
      this.infoData = {
        planCode: '',
        level: '',
        content: '',
        workHour: 0,
        rate: 0,
        cycle: ''
      }
    }
  }
}
</script>

<style scoped>
.serviceDetailDialog{

}
</style>
