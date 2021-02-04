<template>
  <div class="editDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="设备编辑" :visible.sync="editDialogVisible" width="30%" center>
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="infoData.name" />
        </el-form-item>
        <el-form-item label="设备位号" prop="code">
          <el-input v-model="infoData.code" />
        </el-form-item>
        <el-form-item label="资产编号" prop="zcnum">
          <el-input v-model="infoData.zcnum" />
        </el-form-item>
        <el-form-item label="规格型号" prop="ggtype">
          <el-input v-model="infoData.ggtype" />
        </el-form-item>
        <el-form-item label="安装位置" prop="place">
          <el-select v-model="infoData.place" placeholder="请选择">
            <el-option label="安装1" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="sbtype">
          <el-select v-model="infoData.sbtype">
            <el-option label="类型1" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否为特种设备" prop="isTZ">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio v-model="infoData.isTZ" label="1">是</el-radio>
            <el-radio v-model="infoData.isTZ" label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="重要参数" prop="mainArgs">
          <el-input v-model="infoData.mainArgs" />
        </el-form-item>
        <el-form-item label="使用部门" prop="dept">
          <el-select v-model="infoData.dept">
            <el-option label="使用部门1" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="维保部门" prop="bydept">
          <el-select v-model="infoData.bydept">
            <el-option label="维修部门1" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="生产厂家" prop="creator">
          <el-input v-model="infoData.creator" />
        </el-form-item>
        <el-form-item label="生产时间" prop="createTime">
          <el-input v-model="infoData.createTime" />
        </el-form-item>
        <el-form-item label="设备状态" prop="status">
          <el-input v-model="infoData.status" />
        </el-form-item>
        <el-form-item label="图片" prop="pic">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-change="handleChange"
            :file-list="infoData.pic"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="tip">
          <el-input v-model="infoData.tip" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="footerClass">
        <el-button @click="editDialogVisible = false">取消</el-button>
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
        zcnum: '',
        ggtype: '',
        status: '',
        createTime: '',
        devicetype: '',
        isTZ: '',
        place: '',
        sbtype: '',
        mainArgs: '主要参数',
        pic: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }],
        tip: '',
        dept: '',
        bydept: '',
        creator: ''
      },
      ruleForm: []
    }
  },
  watch: {
    // 当dialog关闭，对表单的清空
    editDialogVisible(val) {
      if (val === false) {
        this.$refs.ruleForm.resetFields()
      }
    }
  },
  created() {
    // 编辑bus传值&跳转实现
    this.$bus.$on('editInfo', (e) => {
      this.infoData.name = e.name
      this.infoData.code = e.code
      this.infoData.zcnum = e.zcnum
      this.infoData.ggtype = e.ggtype
      this.infoData.status = e.status
      this.infoData.createTime = e.createTime
      this.editDialogVisible = true
    })
  },
  methods: {
    updateInfo() {
      setTimeout(() => {
        this.editDialogVisible = false
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
