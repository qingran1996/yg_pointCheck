<template>
  <div class="workInformation">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle"
               :visible.sync="editDialogVisible" width="40%" center :key="addRender">
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm" >
        <div style="display: flex;justify-content: space-around;margin: 0;padding: 0;">
          <div class="divItem">
            <el-form-item label="人员姓名" prop="name">
              <el-input v-model="infoData.name" disabled/>
            </el-form-item>
            <el-form-item label="身份证" prop="idcard">
              <el-input v-model="infoData.idcard" disabled/>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="infoData.sex" disabled>
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="民族" prop="nation">
              <el-input v-model="infoData.nation" clearable/>
            </el-form-item>
            <el-form-item label="健康状态" prop="health">
              <el-input v-model="infoData.health" clearable/>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="infoData.phone" disabled/>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="infoData.email" disabled/>
            </el-form-item>
          </div>
          <div class="divItem">
            <el-form-item label="职务" prop="position">
              <el-input v-model="infoData.position" clearable/>
            </el-form-item>
            <el-form-item label="职称" prop="jobTitle">
              <el-select v-model="infoData.jobTitle" clearable filterable>
                <el-option v-for="item in jobTitleList" :key="item.id" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item label="所属部门" prop="dept">
              <el-input v-model="infoData.dept" type="textarea" :rows="3" disabled/>
            </el-form-item>
            <el-form-item label="工种" prop="workType">
              <el-select v-model="infoData.workType" clearable filterable multiple>
                <el-option v-for="item in workTypeList" :key="item.id" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="footerClass">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="updateInfo" v-prevent-re-click>更新</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogTitle: '单位人员工作信息',
      editDialogVisible: false, //外层dialog
      addRender: 0,
      isHaveDetail:false,
      workTypeList: [],
      jobTitleList: [],
      tPerson: {}, //人员信息更新--》用到
      infoData: {
        id:null,
        name: '',
        unitId: '',
        phone: '',
        email: '',
        idcard: '',
        position: '',
        health: '',
        nation: '',
        workType: [],
        dept: '',
        jobTitle: '',
        sex: null,
        personId:null
      }
    }
    },
  created() {
  },
  mounted() {
    this.$bus.on('personWorkInfo', e => {
      //console.log('workInfo', e)
      this.infoData.dept = e.dept
      this.getDetailData(e.code)
      this.getWorkInformation(e.id)
      this.getWorkType()
      this.getJobTitle()
      this.editDialogVisible = e.show
    })
  },
  watch: {
    editDialogVisible(val) {
      if (val === false) { //关闭后，所有数据重置
        this.$refs.ruleForm.resetFields()
        this.renderDialog()
      }
    }
  },
  methods: {
    close() {
      this.editDialogVisible = false
    },
    updateInfo() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.isHaveDetail === false){
            this.axiosAdd()
          }else if (this.isHaveDetail === true){
            this.axiosUpdate().then(res=>{
              if (res === 'success'){
                this.$message.success('编辑成功')
                this.close()
              }else {
                this.$message.error(res)
              }
            })
          }
        }
      })
    },
    renderDialog() {
      this.addRender += 1
    },
    //获取详情信息
    getDetailData(code) {
      let obj1 = {
        code: code
      }
      this.$axios.post('/p/person/get', obj1).then(res => {
        if (res.data.code === 0) {
          let info = res.data.data
          console.log(info)
          this.infoData.name = info.name
          this.infoData.personId = info.id
          this.infoData.sex = info.sex
          this.infoData.idcard = info.idcard
          this.infoData.phone = info.phone
          this.infoData.email = info.email
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //getWorkInformation
    getWorkInformation(Tid){
      let par={
        personId: Tid,
        unitId: 1
      }
    this.$axios.post('/p/personJobInfo/getByPersonIdAndUnitId',par).then(res=>{
      if (res.data.code === 0){
        let msg = res.data.data
        console.log(msg)
        this.tPerson = {}
        this.infoData.nation = msg.nation
        this.infoData.id = msg.id
        this.infoData.health = msg.health
        this.infoData.jobTitle = msg.jobTitle
        this.infoData.position = msg.position
        this.infoData.dept = msg.dept
        if (msg.workType === ''){
          this.infoData.workType = []
        }else {
          this.infoData.workType = msg.workType.split(',')
        }
        this.tPerson.code = msg.person.code
        this.tPerson.orgCode = msg.person.organization.code
        this.tPerson.state = msg.person.state
        this.tPerson.userTypeCode = msg.person.userTypeCode
        this.isHaveDetail = true
      }else {
        this.isHaveDetail = false
      }
    }).catch(err=>{
      console.log(err)
    })
    },
    //数据字典查询 workType
    getWorkType() {
      let par = {
        parentCode: 'workType'
      }
      this.getStateInfo(par).then(res => {
        if (res.data.code === 0) {
          this.workTypeList = null
          this.workTypeList = res.data.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //数据字典 jobTitle
    getJobTitle() {
      let par = {
        parentCode: 'jobTitle'
      }
      this.getStateInfo(par).then(res => {
        if (res.data.code === 0) {
          this.jobTitleList = null
          this.jobTitleList = res.data.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //新增
    axiosAdd(){
      let src=''
      if (this.infoData.workType.length>0){
        for (let z =0;z<this.infoData.workType.length;z++){
          src = src+this.infoData.workType[z]
          if (z<this.infoData.workType.length-1){
            src = src +','
          }
        }
      }
      let par={
        personId: this.infoData.personId,
        unitId: 1,
        jobTitle: this.infoData.jobTitle,
        workType: src,
        position: this.infoData.position,
        dept: this.infoData.dept,
        nation: this.infoData.nation,
        health: this.infoData.health
      }
      this.$axios.post('/p/personJobInfo/add',par).then(res=>{
        if (res.data.code === 0){
          this.$message.success('编辑成功')
          this.close()
        }else {
          this.$message.error(res.data.message)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    //真正的更新操作 2步:1,人员更新 2，三方更新
    async axiosUpdate() {
      let src=''
      if (this.infoData.workType.length>0){
        for (let z =0;z<this.infoData.workType.length;z++){
          src = src+this.infoData.workType[z]
          if (z<this.infoData.workType.length-1){
            src = src +','
          }
        }
      }
      let parTwo = {
        id: this.infoData.id,
        personId: this.infoData.personId,
        unitId: 1, //我方单位
        jobTitle: this.infoData.jobTitle,
        workType: src,
        position: this.infoData.position,
        dept: this.infoData.dept,
        nation: this.infoData.nation,
        health: this.infoData.health
      }
      let backThing = ''
      await this.$axios.post('/p/personJobInfo/update', parTwo).then(res => {
        if (res.data.code === 0) {
          backThing = 'success'
        }else {
          backThing = res.data.message
        }
      })
      return backThing
    }
  }

}
</script>

<style scoped>
.workInformation {

}
</style>
