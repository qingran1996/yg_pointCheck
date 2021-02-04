<template>
  <div class="editDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="仓库管理编辑" :visible.sync="editDialogVisible" width="30%" center>
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm">
        <el-form-item label="分类编号" prop="code">
          <el-input v-model="infoData.code" />
        </el-form-item>
        <el-form-item label="上级分类" prop="superior">
          <el-select v-model="infoData.superior">

            <el-option label="test1" value="key1"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="infoData.name" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="infoData.remarks" />
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
        name:'',
        code:'',
        superior: '',
        remarks:''
      }
    }
  },
  watch: {
    // 当dialog关闭，对表单内容的清空
    editDialogVisible(val) {
      if (val === false) {
        this.infoData.name = ''
        this.infoData.code = ''
        this.infoData.superior = ''
        this.infoData.remarks = ''
      }
    }
  },
  created() {
    // 编辑bus传值&跳转实现
    this.$bus.$on('edit', (e) => {
      this.infoData.name = e.name
      this.infoData.code = e.code
      this.infoData.superior = e.superior
      this.infoData.remarks = e.remarks
      this.editDialogVisible = true
    })
    //新增跳转
    this.$bus.$on('add',(e)=>{
      this.editDialogVisible = e
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
