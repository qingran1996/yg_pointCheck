<template>
  <div class="editDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle" :visible.sync="editDialogVisible" width="30%" center :key="renderDialog">
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm" :rules="rules">
        <el-form-item label="字典编码" prop="code">
          <el-input v-model="infoData.code" clearable/>
        </el-form-item>
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="infoData.name" disabled/>
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
      dialogTitle:'数据字典编辑',
      infoData: {
        code:'',
        name:''
      },
      oldCode:'',
      parentCode:'',
      rules:{
        name: [
          { required: true, message: '请输入名称', trigger: ['blur','change'] },
          { max:16,message: '长度不能超过16位', trigger: ['blur','change']}],
        code: [
          { required: true, message: '请输入编号', trigger: ['blur','change'] },
          { max:16,message: '长度不能超过16位', trigger: ['blur','change']}]
      },
      renderDialog:0
    }
  },
  watch: {
    // 当dialog关闭，对表单内容的清空
    editDialogVisible(val) {
      if (val === false) {
        this.infoData.code = ''
        this.infoData.name = ''
        this.oldCode = ''
        this.parentCode = ''
        this.renderAgain()
      }
    }
  },
  created() {
    // 编辑bus传值&跳转实现
    this.$bus.$on('editChildren', (e) => {
      this.infoData.code = e.code
      this.oldCode = e.code //旧code
      this.infoData.name = e.name
      this.parentCode = e.info
      this.editDialogVisible = true
    })
  },
  methods: {
    close(){
      this.editDialogVisible = false
    },
    updateInfo() {
      let updatePar={
        parentCode:this.parentCode,
        code:this.oldCode,
        newCode:this.infoData.code,
        name:this.infoData.name,
        status:1,  //1:启用 0:关闭禁用
      }
      this.$axios.post('/u/dictionary/update',updatePar).then(res=>{
        if (res.data.code === 0){
          this.$message.success('修改成功')
          this.close()
          this.$bus.emit('renderChildren',true)
        }else {
          this.$message.error(res.data.message)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    renderAgain(){
      this.renderDialog+=1
    }
  }
}
</script>

<style scoped>
</style>
