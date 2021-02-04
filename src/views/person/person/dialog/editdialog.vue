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
          <el-input v-model="ruleForm.code" clearable></el-input>
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
				  <el-form-item label="身份证" prop="userCard">
				  	<el-input v-model="ruleForm.userCard" clearable></el-input>
				  </el-form-item>
				  <el-form-item label="邮箱" prop="email">
				  	<el-input v-model="ruleForm.email" clearable></el-input>
				  </el-form-item>
        <el-form-item label="组织" prop="orgCode">
          <el-popover style="margin-left: 10px;"
                      placement="right"
                      width="300"
                      trigger="click" :value="IsShowpop" v-show="IsShowpop">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="单位组织:">
                <el-input v-model="deptInline1" clearable></el-input>
                <el-tree v-show="isShow" :highlight-current=true :default-expand-all=false
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
<!--                     :before-remove="beforeRemove" :file-list="fileList" :limit=3 :on-exceed="handleExceed" ref="uploadPic" >-->
<!--            <el-button type="info" class="el-icon-upload2" circle plain />-->
<!--          </el-upload>-->
<!--        </el-form-item>-->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea" resize="none" :show-word-limit="true" :maxlength="200" :rows="4" clearable></el-input>
        </el-form-item>
			</el-form>
			<span slot="footer" class="footerClass">
				<el-button @click="editDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="sure('ruleForm')" v-prevent-re-click>确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "personDialog",
		data() {
			return {
				wordtitle: '人员添加',
				editDialogVisible: false,
        actionurl: 'http://192.168.10.152:10005/u/attach/upload',
        picurl:this.documentEAMUrl('upload'),
        detailUrl:this.documentEAMUrl('preview'),
        Thisauth: {
          'Authorization': `Bearer ${localStorage.getItem('eleToken')}`
        }, //给请求头部添加 权限
        IsShowpop:true,
        isShow:true,
        extraUnit:"EXTERNAL-UNIT",
        deptInline:'',
        deptInputInline:'',
        deptInline1:'',
        popheight: document.body.clientHeight * 0.3 + 'px',
				ruleForm: {
					name: '', //姓名*
					sex: '', //性别
          code:'', //编号 *
          state:'', //用工状态 *
          userTypeCode:'', //人员类型 *
					phone: '',   // 重复格式检查
					userCard: '', //身份证 重复格式检查
					email: '', // 重复格式检查
          orgCode:'',//组织编码
          jobNumber:'',//工号16位
          remark:'',//备注  255
          emergencyContactName:'',//紧急联系人[长度32]
          emergencyContactPhone:'',//紧急联系人电话[长度16]
          personFaces:[] //人员图片[数组]
				},
        fileList:[],
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
          code:[{
            required: true,
            message: '请输入人员编号',
            trigger: 'blur'
          }],
          state:[{
            required: true,
            message: '请输入用工状态',
            trigger: 'blur'
          }],
          userTypeCode:[{
            required: true,
            message: '请输入人员类型',
            trigger: 'blur'
          }],
          orgCode:[{
            required: true,
            message: '请输入组织编码',
            trigger: ['blur','change']
          }],
          jobNumber:[{
            max: 16,
            message: '工号长度不可超过16位',
            trigger: ['change', 'blur']
          }],
          emergencyContactName:[{
            max: 32,
            message: '紧急联系人长度不可超过32位',
            trigger: ['change', 'blur']
          }],
          emergencyContactPhone:[{
            validator: this.otherPhoneRole,
            trigger: 'blur'
          }],
					sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
					phone: [{required: true, validator: this.phoneRole, trigger: 'blur' }], //utiles目录中config全局方法调用
					userCard: [{required: true, validator: this.userCardRole, trigger: 'blur' }], //utiles目录中config全局方法调用
					email: [{required: true, validator: this.emailRole, trigger: 'blur' }], //utiles目录中config全局方法调用
				}
			};
		},
    watch:{
      deptInline(val){
        this.deptInline1 = ''
        if (val === ''){
          this.isShow = true
          this.IsShowpop = true
          this.ruleForm.orgCode = ''
        }
      },
      deptInline1(val){
        this.$refs.OrgTree.filter(val)
      }
    },
		methods: {
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
            // console.log(objOrg)
            //this.updateTree.push(res.data.data.id)
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
			sure(formName) {
        console.log(this.ruleForm)
        this.$refs[formName].validate((valid) => {
					if (valid) {
					  let addPar={
              name: this.ruleForm.name,
              sex: this.ruleForm.sex,
              code: this.ruleForm.code,
              state: this.ruleForm.state,
              userTypeCode: this.ruleForm.userTypeCode,
              phone: this.ruleForm.phone,
              idcard:this.ruleForm.userCard,
              email:this.ruleForm.email,
              orgCode:this.ruleForm.orgCode,
              jobNumber:this.ruleForm.jobNumber,
              remark:this.ruleForm.remark,
              emergencyContactName:this.ruleForm.emergencyContactName,
              emergencyContactPhone:this.ruleForm.emergencyContactPhone,
              personFaces:this.ruleForm.personFaces,
            }
						this.$axios.post('/p/person/add',addPar).then(res=>{
						  if (res.data.code ===0){
						    this.$message.success('新增成功')
                this.editDialogVisible = false
                this.$bus.emit('renderData',true)
              }else {
						    this.$message.error(res.data.message)
              }
            }).catch(err=>{
              console.log(err)
            })
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
      deptInputInlinefun() {
        this.isShow = true
        this.IsShowpop = true
        this.deptInline = ''
      },
      //选择器树节点
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      selectClassfy(data) {
        console.log('tree', data)
        this.deptInline1 = data.label
        this.deptInline = this.deptInline1
        this.ruleForm.orgCode = data.code
        this.isShow = false
        this.IsShowpop = false
      },
      renderDialog(){
        this.renderKey+=1
      },
      handlePreview(file) {
        console.log('已上传的文件-》', file)
        let url1=file.url
        window.open(this.detailUrl + encodeURIComponent(url1))
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      beforeRemove(file, fileList) {
        console.log('删除前的list',fileList)
        let format=file.url.split('.')[file.url.split('.').length-1].toLowerCase() //上传格式(小写)判断
        let pcitype = ['jpg', 'png', 'bmp', 'gif','psd','psb']
        if (pcitype.includes(format) === false){
         return  this.fileList.slice(0,1) //清空上传列表的显示(如果不是图片格式)
        }
        return this.$confirm(`确定移除 ${file.name}？`).then(()=>{
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
        })
      },
      beforeUpload(file){
        //console.log(file)
        let format=file.name.split('.')[file.name.split('.').length-1].toLowerCase() //上传格式(小写)判断
        let pcitype = ['jpg', 'png', 'bmp', 'gif','psd','psb']
        console.log(format)
        if (pcitype.includes(format)){
          let formData = new FormData()
          formData.append('file', file)
          formData.append('source', 1)
          this.$axios.post('/u/attach/upload', formData, {
            header: {
              'Authorization': `Bearer ${localStorage.getItem('eleToken')}`
            }
          }).then(res => {
            console.log('----上传后的data----', res.data.data)
            if (res.data.code === 0) {
              this.ruleForm.personFaces=[]
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
                name: pic.fileName,
                url: this.picurl+pic.filePath
              })
              this.ruleForm.personFaces.push(pic.id)
              console.log(this.ruleForm)
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
			this.$bus.$on('personDialog', e => {
        console.log(e)
        if (this.requestOrgCount === 0){
          this.getOrganization()
          this.personTypeList = e.personTypeList
          this.personStatusList = e.personStatusList
          this.requestOrgCount ++
        }
        this.editDialogVisible = e.ps
        this.ruleForm.personFaces=[] //图片列表的清空
        this.fileList=[] //上传信息的清空
			})
      this.$bus.on('updateOrgAgain',e=>{
        if (e===true){
          this.getOrganization()
        }
      })
		}
	};
</script>
<style scoped>
.demo-ruleForm >>>.el-input__inner{
  width: 100%;
}
.demo-ruleForm >>>.el-form-item__label{
  width: 110px!important;
  margin-left: -10px;
}
.demo-ruleForm >>>.el-radio-group{
  margin-left: 20px;
}
</style>
