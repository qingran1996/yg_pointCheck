<template>
  <div class="dictionaryAddDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle" :visible.sync="editDialogVisible" width="30%"
               center :key="renderDialog">
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm" :rules="rules">
        <el-form-item label="字典编码" prop="code">
          <el-input v-model="infoData.code" clearable/>
        </el-form-item>
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="infoData.name" clearable/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="footerClass">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="updateInfo" v-prevent-re-click>确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editDialogVisible: false,
      dialogTitle:'数据字典新增',
      infoData: {
        code:'',
        name:''
      },
      renderDialog:0,
      rules:{
        name: [
          { required: true, message: '请输入名称', trigger: ['blur','change'] },
          { max:16,message: '长度不能超过16位', trigger: ['blur','change']}],
        code: [
          { required: true, message: '请输入编号', trigger: ['blur','change'] },
          { max:16,message: '长度不能超过16位', trigger: ['blur','change']}]
      }
    }
  },
  watch: {
    // 当dialog关闭，对表单内容的清空
    editDialogVisible(val) {
      if (val === false) {
        this.infoData.code = ''
        this.infoData.name = ''
        this.renderAgain()
      }
    }
  },
  created() {
    //新增跳转
    this.$bus.$on('add',(e)=>{
      this.editDialogVisible = e
    })
  },
  methods: {
    close(){
      this.editDialogVisible = false
    },
    //add
    updateInfo() {
      this.$refs.ruleForm.validate(valid=>{
        if (valid){
          let addPar={
            parentCode:'0', //父编码
            code:this.infoData.code,
            name:this.infoData.name
          }
          this.$axios.post('/u/dictionary/add',addPar).then(res=>{
            if (res.data.code === 0){
              this.$message.success('成功新增')
              this.close()
              this.$bus.emit('renderGet',true)
            }else {
              this.$message.error(res.data.message)
            }
          }).catch(err=>{
            console.log(err)
          })
        }
      })
    },
    renderAgain(){
      this.renderDialog+=1
    }
  }
}
</script>

<style scoped>
.dictionaryAddDialog {

}
</style>
