<template>
  <div class="editDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="文档编辑" :visible.sync="editDialogVisible" width="30%" center>
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm">
        <el-form-item label="文档" prop="remarks">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-change="handleChange"
            :file-list="infoData.remarks"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item label="文档名称" prop="name">
          <el-input v-model="infoData.name"  />
        </el-form-item>
        <el-form-item label="附件编号" prop="code">
          <el-input v-model="infoData.code" />
        </el-form-item>
        <el-form-item label="设备编号" prop="deviceCode">
          <el-input v-model="infoData.deviceCode" />
        </el-form-item>
        <el-form-item label="文档类型" prop="type">
          <el-select v-model="infoData.type">
            <el-option v-for="it in optionList" :key="it.value" :label="it.label" :value="it.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文档概述" prop="fileMsg">
          <el-input v-model="infoData.fileMsg" />
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
      fileList: [{
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }],
      infoData: {
        name: '',
        code: '',
        type: '',
        deviceCode: '',
        fileMsg: '',
        remarks: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }]
      },
      optionList: [{
        value: '选项1',
        label: '模型类'
      },
        {
          value: '选项2',
          label: '工艺图纸类'
        },
        {
          value: '选项3',
          label: '说明类'
        },
        {
          value: '选项4',
          label: '设备合格证类'
        },
        {
          value: '选项5',
          label: '其他类'
        }
      ]
    }
  },
  watch: {
    // 当dialog关闭，对表单内容的清空
    editDialogVisible(val) {
      if (val === false) {
        this.infoData.name = ''
        this.infoData.code = ''
        this.infoData.type = ''
        this.infoData.deviceCode = ''
        this.infoData.fileMsg = ''
        this.infoData.remarks = [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }]
      }
    }
  },
  created() {
    // 编辑bus传值&跳转实现
    this.$bus.$on('editInfo6', (e) => {
      this.infoData.name = e.name
      this.infoData.code = e.code
      this.infoData.type = e.type
      this.infoData.fileMsg = e.fileMsg
      this.infoData.result = e.result
    //上传的文档//  this.infoData.remarks = e.remarks
      this.editDialogVisible = true
    })
    this.$bus.$on('add6',(e)=>{
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
