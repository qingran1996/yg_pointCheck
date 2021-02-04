<template>
  <div class="personCertDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle"
               :visible.sync="editDialogVisible" width="40%" center :key="addRender">
      <el-card class="box-card" shadow="always">
        <el-row style="margin-bottom: 5px;">
          <el-button type="primary" @click="add">新增</el-button>
          <el-button type="danger" :disabled="isDelete" @click="deleteItems">删除</el-button>
        </el-row>
        <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight"
                  ref="multipleTable" @selection-change="selectionchange" row-key="index">
          <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
          <el-table-column v-for="item in listName" :key="item.name" :label="item.label"
                           :prop="item.name" align="center" min-width="120" show-overflow-tooltip/>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template slot-scope="scope">
              <div class="action">
                <el-tag type="primary" @click="edit(scope.row)">编辑</el-tag>
                <el-tag type="warning" @click="lookList(scope.row)">详情</el-tag>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          width="30%"
          :title="innerTitle"
          :visible.sync="innerVisible" center
          append-to-body :key="innerRender">
          <el-form ref="ruleForms" :model="infoData" label-width="130px" class="demo-ruleForm" :rules="rules">
            <el-form-item label="证书名称" prop="cerName">
              <el-input v-model="infoData.cerName" clearable/>
            </el-form-item>
            <el-form-item label="证书编号" prop="cerNo">
              <el-input v-model="infoData.cerNo" clearable/>
            </el-form-item>
            <el-form-item label="发证部门">
              <el-input v-model="infoData.issuingAgency" clearable/>
            </el-form-item>
            <el-form-item label="发证日期" prop="effectTime">
              <el-date-picker v-model="infoData.effectTime" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
                              value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="有效截止日期" prop="failureTime">
              <el-date-picker v-model="infoData.failureTime" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
                              value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" v-model="infoData.remark" resize="none" :maxlength="200" show-word-limit
                        :rows="4"
                        clearable/>
            </el-form-item>
            <el-form-item label="上传附件">
              <el-upload
                class="upload-demo"
                ref="upload"
                action="http://192.168.10.152:10005/test.com"
                :data="source"
                :on-preview="handlePreview"
                :before-remove="handleRemove"
                :before-upload="beforeUpload"
                :http-request="upload"
                :on-exceed="limitUpload"
                :file-list="fileList" :auto-upload="false" :limit="2">
                <el-button slot="trigger" size="small" round icon="el-icon-upload2"></el-button>
              </el-upload>
            </el-form-item>
          </el-form>
          <span slot="footer" class="footerClass">
            <el-button @click="innerVisible = false">取消</el-button>
            <el-button type="primary" @click="submitThings" v-prevent-re-click>确定</el-button>
          </span>
        </el-dialog>
        <personCertDetail/>
      </el-card>
      <span slot="footer" class="footerClass">
        <el-button @click="close">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import personCertDetail from '@/views/relatedUnits/Person/personCertDetail'

export default {
  components: { personCertDetail },
  data() {
    return {
      dialogTitle: '证书信息',
      innerTitle: '',
      picurl: this.documentEAMUrl('upload'),
      editDialogVisible: false,
      innerVisible: false, //内部dialog
      isDelete: true,
      addRender: 0,
      innerRender: 5,
      loading: false,
      chooseId: [],
      personID: null,
      personName: '',
      tableData: [], //table信息
      infoData: {
        id: null,
        cerName: '',
        cerNo: '',
        issuingAgency: '',
        effectTime: null,
        failureTime: null,
        remark: ''
      }, //表单信息
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 570, // 表格高度
      listName: [{
        label: '证书名称',
        name: 'cerName'
      }, {
        label: '证书编号',
        name: 'cerNo'
      }, {
        label: '发证部门',
        name: 'issuingAgency'
      }, {
        label: '发证日期',
        name: 'effectTimeString'
      }, {
        label: '有效截止日期',
        name: 'failureTimeString'
      }, {
        label: '备注',
        name: 'remark'
      }],
      rules: {
        cerName: [{
          required: true, message: '请输入证书名称', trigger: ['change', 'blur']
        }],
        cerNo: [{
          required: true, message: '请输入证书编号', trigger: ['change', 'blur']
        }],
        effectTime: [{
          required: true, message: '请选择发证日期', trigger: ['change', 'blur'], type: 'number'
        }],
        failureTime: [{
          required: true, message: '请选择发证日期', trigger: ['change', 'blur'], type: 'number'
        }]
      },
      fileList: [],//图片列表展示
      fileIds: [],//上传后的图片id
      source: {}
    }
  },
  created() {
  },
  mounted() {
    this.$bus.on('personCertInfo', e => {
      //console.log(e)
      this.dialogTitle = e.name + '的证书信息'
      this.editDialogVisible = true
      this.personID = e.id
      this.personName = e.name
      this.getTableData(e.id)
    })
  },
  watch: {
    editDialogVisible(val) {
      if (val === false) {
        this.personID = null
        this.personName = ''
        this.renderDialog()
      }
    },
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
    getTableData(Tid) {
      this.loading = true
      let par = {
        personId: Tid
      }
      this.$axios.post('/p/personCert/getByPersonId', par).then(res => {
        if (res.data.code === 0) {
          //console.log('证书信息', res)
          this.tableData = []
          let msg = res.data.data
          for (let key of msg) {
            let obj = {}
            obj = key
            obj.index = key.cerName + 'c' + key.id * key.personId
            obj.effectTimeString = this.formatDate(key.effectTime).split(' ')[0]
            obj.failureTimeString = this.formatDate(key.failureTime).split(' ')[0]
            this.tableData.push(obj)
          }
          this.loading = false
        } else if (res.data.code === 10001) { //若记录不存在,则说明没有数据
          this.tableData = []
          //this.$message.error(res.data.message)
          this.loading = false
        } else { // 其他情况则认为error报错问题
          this.$message.error(res.data.message)
          this.tableData = []
          this.loading = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    renderDialog() {
      this.addRender += 1
    },
    //新增证书
    add() {
      this.innerVisible = true
      this.fileList = []
      this.fileIds = []
      this.innerTitle = '证书新增'
    },
    //编辑证书
    edit(row) {
      this.innerVisible = true
      this.fileList = []
      this.fileIds = []
      this.innerTitle = '证书编辑'
      this.getDetail(row.id)
    },
    //详情按钮
    lookList(row) {
      this.$bus.emit('personCertDetail', row)
    },
    selectionchange(data) {
      //console.log(data)
      this.chooseId = []
      this.isDelete = data.length === 0
      for (let i = 0; i < data.length; i++) {
        this.chooseId.push(data[i].id)
      }
    },
    //删除证书
    deleteItems() {
      this.$confirm('确定删除选中的证书信息吗?').then(() => {
        let par = {
          ids: this.chooseId
        }
        this.$axios.post('/p/personCert/delete', par).then(res => {
          if (res.data.code === 0) {
            this.$message.success('删除成功')
            this.$refs.multipleTable.clearSelection()
            this.getTableData(this.personID)
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch(rej => {
        console.log(rej)
      })
    },
    //提交操作
    submitThings() {
      this.$refs.ruleForms.validate(valid => {
        if (valid) {//新增
          if (this.innerTitle === '证书新增') {
            this.axiosAdd()
          } else if (this.innerTitle === '证书编辑') {//编辑
            this.axiosEdit()
          }
        }
      })
    },
    //证书的新增操作axios
    async axiosAdd() {
      let promise = new Promise((res, rej) => {
        this.$refs.upload.submit()
        setTimeout(() => {
          res()
        }, 100)
      })
      await promise
      let addPar = {
        personId: this.personID,
        personName: this.personName,
        cerName: this.infoData.cerName,
        cerNo: this.infoData.cerNo,
        issuingAgency: this.infoData.issuingAgency,
        effectTime: this.infoData.effectTime,
        failureTime: this.infoData.failureTime,
        remark: this.infoData.remark,
        certPictures: this.fileIds
      }
      await this.$axios.post('/p/personCert/add', addPar).then(res => {
        if (res.data.code === 0) {
          this.$message.success('新增成功')
          this.innerVisible = false
          this.getTableData(this.personID)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })

    },
    //证书的编辑操作axios
    async axiosEdit() {
      let promise = new Promise((res, rej) => {
        this.$refs.upload.submit()
        setTimeout(() => {
          res()
        }, 100)
      })
      await promise
      let editPar = {
        id: this.infoData.id,
        personId: this.personID,
        personName: this.personName,
        cerName: this.infoData.cerName,
        cerNo: this.infoData.cerNo,
        issuingAgency: this.infoData.issuingAgency,
        effectTime: this.infoData.effectTime,
        failureTime: this.infoData.failureTime,
        remark: this.infoData.remark,
        certPictures: this.fileIds
      }
      await this.$axios.post('/p/personCert/update', editPar).then(res => {
        if (res.data.code === 0) {
          this.$message.success('编辑成功')
          this.innerVisible = false
          this.getTableData(this.personID)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => [
        err.renderDialog()
      ])
    },
    getDetail(Tid) {
      this.$axios.post('/p/personCert/getForUpdate', { id: Tid }).then(res => {
        if (res.data.code === 0) {
          //console.log(res)
          let msg = res.data.data
          this.infoData = msg
          for (let k of msg.attachs) {
            this.fileList.push({
              name: '证书',
              url: this.picurl + k.filepath
            })
            this.fileIds.push(k.id)
          }
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //上传具体操作
    //预览
    handlePreview(file) {
      window.open(this.documentEAMUrl('preview') + encodeURIComponent(file.url))
    },
    //上传前操作
    beforeUpload(file) {
      this.source.source = 6
      this.source.file = file
      console.log('上传前,', this.source)
    },
    //自定义上传文件的方式
    upload() {
      this.axiosUpload()
    },
    //axios upload
    async axiosUpload() {
      let formData = new FormData()
      formData.append('file', this.source.file)
      formData.append('source', this.source.source)
      await this.$axios.post('u/attach/upload', formData).then(res => {
        if (res.data.code === 0) {
          console.log(res.data.data)
          this.fileIds.push(res.data.data.id)
          this.fileList.push({
            name: res.data.data.fileName,
            url: this.picurl + res.data.data.filePath
          })
          //let result = res.data.data
        } else {
          return 'error'
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //上传删除的操作
    handleRemove(file, fileList) {
      return this.$confirm('确定不上传这个文件吗?').then(() => {
        //console.log(file)
        let found = this.fileList.findIndex(item => item.url === file.url)
        if (found > -1) {
          this.$nextTick(() => {
            this.fileList.splice(found, 1)
            this.fileIds.splice(found, 1)
            // console.log(this.fileList)
            // console.log(this.fileIds)
          })
        }
      })
    },
    limitUpload() {
      this.$message.warning('上传证件限制为2个文件!!')
    }
  },
  destroyed() {
    this.$bus.off('personCertDetail')
  }
}
</script>

<style scoped>
.personCertDialog {

}
</style>
