<template>
  <div class="personCertDetail">
    <el-dialog
      width="30%"
      :title="innerTitle"
      :visible.sync="innerVisible" center
      append-to-body :key="innerRender">
      <el-form ref="ruleForms" :model="infoData" label-width="130px" class="demo-ruleForm">
        <el-form-item label="证书名称" prop="cerName">
          <el-input v-model="infoData.cerName" disabled/>
        </el-form-item>
        <el-form-item label="证书编号" prop="cerNo">
          <el-input v-model="infoData.cerNo" disabled/>
        </el-form-item>
        <el-form-item label="发证部门">
          <el-input v-model="infoData.issuingAgency" disabled/>
        </el-form-item>
        <el-form-item label="发证日期" prop="effectTime">
          <el-date-picker v-model="infoData.effectTime" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
                          value-format="timestamp" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="有效截止日期" prop="failureTime">
          <el-date-picker v-model="infoData.failureTime" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
                          value-format="timestamp" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="infoData.remark"  :maxlength="200" show-word-limit
                    :rows="4"
                    disabled/>
        </el-form-item>
        <el-form-item label="上传附件">
          <el-image v-for="item in fileList" :key="item.id" :src="item.url" @click="handlePreview(item)" style="width: 100px;height: 100px;margin-right: 10px;"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="footerClass">
            <el-button @click="innerVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      innerTitle: '',
      picurl: this.documentEAMUrl('upload'),
      innerVisible: false, //内部dialog
      innerRender: 5,
      infoData: {
        id: null,
        cerName: '',
        cerNo: '',
        issuingAgency: '',
        effectTime: null,
        failureTime: null,
        remark: ''
      }, //表单信息
      fileList: []//图片列表展示
    }
  },
  created() {
  },
  mounted() {
    this.$bus.on('personCertDetail', e => {
      //console.log(e)
      this.innerTitle = '证书信息详情'
      this.innerVisible = true
      this.getDetail(e.id)
    })
  },
  watch: {
    innerVisible(val) {
      if (val === false) {
        this.infoData = {
          id: null,
          cerName: '',
          cerNo: '',
          issuingAgency: '',
          effectTime: null,
          failureTime: null,
          remark: ''
        }
        this.innerRender += 1
      }
    }
  },
  methods: {
    close() {
      this.editDialogVisible = false
    },
    getDetail(Tid) {
      this.$axios.post('/p/personCert/getForUpdate', { id: Tid }).then(res => {
        if (res.data.code === 0) {
          //console.log(res)
          let msg = res.data.data
          this.infoData = msg
          this.fileList = []
          for (let k of msg.attachs) {
            this.fileList.push({
              id: k.id,
              url: this.picurl + k.filepath
            })
          }
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //预览
    handlePreview(file) {
      window.open(this.documentEAMUrl('preview') + encodeURIComponent(file.url))
    }
  }
}
</script>

<style scoped>
.personCertDetail {

}
</style>
