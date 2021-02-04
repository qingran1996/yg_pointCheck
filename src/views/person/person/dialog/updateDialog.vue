<template>
  <div class="personDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :destroy-on-close="true" @close="closedialog('ruleForm')"
               :title="wordtitle" :visible.sync="editDialogVisible" width="30%" center :key="renderKey">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="ruleForm.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="人员编号" prop="code">
          <el-input v-model="ruleForm.code" disabled></el-input>
        </el-form-item>
        <el-form-item label="用工状态" prop="state">
          <el-select v-model="ruleForm.state" >
            <el-option v-for="item in personStatusList" :key="item.id" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="人员类型" prop="userTypeCode">
          <el-select v-model="ruleForm.userTypeCode" >
            <el-option v-for="item in personTypeList" :key="item.id" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ruleForm.phone" clearable></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="idcard">
          <el-input v-model="ruleForm.idcard" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="单位组织" prop="orgCode">
          <el-popover style="margin-left: 10px;"
                      placement="right"
                      width="300"
                      trigger="click" :value="IsShowpop" v-show="IsShowpop">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="单位组织:">
                <el-input v-model="deptInline1" clearable></el-input>
                <el-tree v-show="isShow" :highlight-current="true" :default-expand-all="false"
                         :style="{maxHeight: popheight,overflowY: 'scroll'}"
                         :expand-on-click-node="true" :data="organization" :filter-node-method="filterNode"
                         @node-click="selectClassfy" class="width-220 selectTree-input objectTree"
                         ref="OrgTree"></el-tree>
              </el-form-item>
            </el-form>
            <el-tag slot="reference" effect="plain">组织单位添加</el-tag>
          </el-popover>
          <el-input v-show="!isShow" v-model="deptInline" clearable @click.native="deptInputInlinefun"></el-input>
        </el-form-item>
        <el-form-item label="工号" prop="jobNumber">
          <el-input v-model="ruleForm.jobNumber" clearable></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人" prop="emergencyContactName">
          <el-input v-model="ruleForm.emergencyContactName" clearable></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人电话" prop="emergencyContactPhone">
          <el-input v-model="ruleForm.emergencyContactPhone" clearable></el-input>
        </el-form-item>
<!--        <el-form-item label="人员图片" prop="personFaces">-->
<!--          <el-upload :action="actionurl" :headers="Thisauth" :on-preview="handlePreview" :before-upload="beforeUpload"-->
<!--                     :before-remove="beforeRemove" :file-list="fileList" :limit=3 :on-exceed="handleExceed" ref="uploadPic">-->
<!--            <el-button type="info" class="el-icon-upload2" circle plain/>-->
<!--          </el-upload>-->
<!--        </el-form-item>-->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea" resize="none" :show-word-limit="true" :maxlength="200"
                    :rows="4" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="footerClass">
				<el-button @click="editDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="sure" v-prevent-re-click>确定</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    let checkOrg=(rule, value, callback)=>{
      if (!value){
        return callback(new Error('组织机构不能为空'))
      }else {
        return callback()
      }
    }
    return {
      wordtitle: '人员编辑',
      editDialogVisible: false,
      actionurl: 'http://192.168.10.152:10005/u/attach/upload',
      picurl:this.documentEAMUrl('upload'),
      detailUrl:this.documentEAMUrl('preview'),
      Thisauth: {
        'Authorization': `Bearer ${localStorage.getItem('eleToken')}`
      }, //给请求头部添加 权限
      extraUnit:"EXTERNAL-UNIT",
      IsShowpop:true,
      isShow:true,
      deptInline:'',
      deptInline1:'',
      popheight: document.body.clientHeight * 0.3 + 'px',
      orgTree:[],
      ruleForm: {
        name: '', //姓名*
        sex: '', //性别
        code: '', //编号 *
        state: '', //用工状态 *
        userTypeCode: '', //人员类型 *
        phone: null,   // 重复格式检查
        idcard: null, //身份证 重复格式检查
        email: null, // 重复格式检查
        orgCode: '',//组织编码
        jobNumber: null,//工号16位
        remark: '',//备注  255
        emergencyContactName: null,//紧急联系人[长度32]
        emergencyContactPhone: null,//紧急联系人电话[长度16]
        personFaces: null //人员图片[数组]
      },
      fileList: [],
      organization: [], //单位组织
      requestOrgCount:0, //请求组织机构数据限制请求1次
      personTypeList:[],
      personStatusList:[],
      renderKey:0,
      rules: {
        name: [{
          required: true,
          message: '请输入名字',
          trigger: 'blur'
        }],
        code: [{
          required: true,
          message: '请输入人员编号',
          trigger: 'blur'
        }],
        state: [{
          required: true,
          message: '请输入用工状态',
          trigger: 'blur'
        }],
        orgCode: [{
          required: true,
          validator:checkOrg,
          trigger: ['change','blur']
        }],
        userTypeCode: [{
          required: true,
          message: '请输入人员类型',
          trigger: 'change'
        }],
        jobNumber: [{
          max: 16,
          message: '工号长度不可超过16位',
          trigger: ['blur']
        }],
        emergencyContactName: [{
          max: 32,
          message: '紧急联系人长度不可超过32位',
          trigger: ['blur']
        }],
        emergencyContactPhone: [{
          validator: this.otherPhoneRole,
          trigger: 'blur'
        }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        phone: [{ required: true, validator: this.phoneRole, trigger: 'blur' }], //utiles目录中config全局方法调用 --如果为空时，默认不填写，可以通过验证
        idcard: [{ required: true, validator: this.userCardRole, trigger: 'blur' }], //utiles目录中config全局方法调用
        email: [{ required: true, validator: this.emailRole, trigger: 'blur' }] //utiles目录中config全局方法调用
      }
    }
  },
  watch:{
    deptInline(val){
      this.deptInline1 = ''
      if (val === ''){
        this.isShow = true
        this.IsShowpop = true
        this.ruleForm.orgCode = null
      }
    },
    deptInline1(val){
      this.$refs.OrgTree.filter(val)
    }
  },
  methods: {
    //根据code查询
    async getdata1(item) {
      let obj1 = {
        code: item.code
      }
      await this.$axios.post('/p/person/getForUpdate', obj1).then(res => {
        if (res.data.code === 0) {
          console.log('edit', res)
          let msg =res.data.data
          let obj={}
          obj=msg
          this.deptInline=msg.orgName
          this.isShow =false
          this.IsShowpop=false
          obj.personFaces=[]
          for (let k=0;k<msg.attachs.length;k++){
            let opic={}
            opic.name='人员图片-'+k
            opic.id=msg.attachs[k].id
            opic.url=msg.attachs[k].filepath
            this.fileList.push(opic)
            obj.personFaces.push(msg.attachs[k].id)
            //console.log(this.ruleForm.personFaces)
            //console.log(this.fileList)
          }
          obj.orgCode = item.organization.code
          this.ruleForm = obj
          console.log(this.ruleForm)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //获取单位组织
    getOrganization() {
      this.organization = []
      let jsonData={
        orgCode: "0"
      }
      this.deptData(jsonData).then(res => {
        if (res.data.code === 0) {
          let objOrg =res.data.data
          let found = Array.from(objOrg.children).find(item=>item.code === this.extraUnit)
          if (found){
            objOrg.children.splice(Array.from(objOrg.children).indexOf(found),1)
          }
          this.organization.push(objOrg)
        } else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
        }
      })
    },
    //关闭dialog时清除显示数据
    closedialog(formName) {
      this.deptInline1 = null
      this.deptInline = null
      this.renderDialog()
      this.$refs[formName].resetFields()
    },
    sure() {
      console.log('submit',this.ruleForm)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let updatePar = {
            id: this.ruleForm.id,
            name: this.ruleForm.name,
            sex: this.ruleForm.sex,
            code: this.ruleForm.code,
            state: this.ruleForm.state,
            userTypeCode: this.ruleForm.userTypeCode,
            phone: this.ruleForm.phone,
            idcard: this.ruleForm.idcard,
            email: this.ruleForm.email,
            orgCode: this.ruleForm.orgCode,
            jobNumber: this.ruleForm.jobNumber,
            remark: this.ruleForm.remark,
            emergencyContactName: this.ruleForm.emergencyContactName,
            emergencyContactPhone: this.ruleForm.emergencyContactPhone,
            personFaces: this.ruleForm.personFaces
          }
          this.$axios.post('/p/person/update', updatePar).then(res => {
            if (res.data.code === 0) {
              this.$message.success('成功修改')
              this.editDialogVisible = false
              this.$bus.emit('renderData',true)
            } else {
              this.$message.error(res.data.message)
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deptInputInlinefun() {
      this.isShow = true
      this.IsShowpop = true
      this.deptInline = ''
      this.ruleForm.orgCode=null
      console.log(this.ruleForm)
    },
    //选择器树节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    selectClassfy(data) {
      console.log('tree', data)
      this.deptInline1 = data.label
      this.deptInline = data.label
      this.isShow = false
      this.IsShowpop = false
      this.ruleForm.orgCode = data.code
      console.log(this.ruleForm)
    },
    renderDialog(){
      this.renderKey+=1
    },
    handlePreview(file) {
      console.log('已上传的文件-》', file)
      let filearry = file.name.split('.')
      let nametype = filearry[filearry.length - 1]
      let pcitype = ['jpg', 'png', 'bmp', 'gif', 'PNG', 'JPG', 'BMP', 'GIF']
      // console.log(nametype)
      let url1=this.picurl+file.url
      window.open(this.detailUrl + encodeURIComponent(url1))
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      console.log('删除前的list',fileList)
      console.log('file',file)
      let format=file.url.split('.')[file.url.split('.').length-1].toLowerCase() //上传格式(小写)判断
      console.log(format)
      let pcitype = ['jpg', 'png', 'bmp', 'gif','psd','psb']
      if (pcitype.includes(format) === false){
        return  this.fileList.slice(0,1) //清空上传列表的显示(如果不是图片格式)
      }
      return this.$confirm(`确定移除 ${file.name}？`).then(() => {
        console.log(file)
        let arry= this.ruleForm.personFaces
        let list = this.fileList
        this.fileList=[]
        this.ruleForm.personFaces=[]
        for (let i=0;i<arry.length;i++){
          if (arry[i]!==file.id){
            this.ruleForm.personFaces.push(arry[i])
          }
        }
        for (let j=0;j<list.length;j++){
          if (list[j].id !== file.id){
            this.$nextTick(()=>{
              this.fileList.push(list[j])
            })
          }
        }
        console.log('330',this.fileList)
      })
    },
    beforeUpload(file) {
      let format=file.name.split('.')[file.name.split('.').length-1].toLowerCase() //上传格式(小写)判断
      let pcitype = ['jpg', 'png', 'bmp', 'gif','psd','psb']
      console.log(format)
      if (pcitype.includes(format)){
        let formData = new FormData()
        formData.append('file', file)
        formData.append('source', 1) //人脸
        this.$axios.post('/u/attach/upload', formData, {
          header: {
            'Authorization': `Bearer ${localStorage.getItem('eleToken')}`
          }
        }).then(res => {
          console.log('----上传后的data----', res.data.data)
          //this.ruleForm.personFaces=[]
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '文件成功上传!'
            })
            let pic = {
              createTime: res.data.data.createTime,
              ext: res.data.data.ext,
              fileName: res.data.data.fileName,
              filePath: res.data.data.filePath,
              id: res.data.data.id,
              isDelete: null,
              source: res.data.data.source
            }
            this.fileList.push({
              name: pic.fileName.split('.')[0],
              url: this.picurl + pic.filePath
            })
            this.ruleForm.personFaces.push(pic.id)
            console.log(this.ruleForm.personFaces)
          }
        })
      }else {
        this.$nextTick(()=>{
          this.$message.error('只能上传图片!!')
          this.$refs.uploadPic.handleRemove(file)
          return pcitype.includes(format)
        })
      }

    }
  },
  created() {
    this.$bus.on('editper', e => {
      this.editDialogVisible = true
      //this.deptInline =e.organization.name
      this.isShow =true
      this.IsShowpop=true
      this.fileList=[]
      console.log(e)
      this.getdata1(e)
      if (this.requestOrgCount === 0){
        this.getOrganization()
        this.personTypeList = e.personTypeList
        this.personStatusList = e.personStatusList
        this.requestOrgCount ++
      }
      // console.log('组织机构',this.organization)
    })
    this.$bus.on('updateOrgAgain',e=>{
      if (e===true){
        this.getOrganization()
      }
    })
  }
}
</script>
<style scoped>
.demo-ruleForm >>> .el-input__inner {
  width: 100%;
}

.demo-ruleForm >>> .el-form-item__error {
  margin-left: 20px;
}

.demo-ruleForm >>> .el-form-item__label {
  width: 110px !important;
  margin-left: -10px;
}

.demo-ruleForm >>> .el-radio-group {
  margin-left: 20px;
}
</style>
