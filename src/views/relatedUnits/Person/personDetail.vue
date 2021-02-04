<template>
  <div class="personDetail">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle"
               :visible.sync="editDialogVisible" width="40%" center :key="addRender">
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm">
        <div style="display: flex;justify-content: space-around;margin: 0;padding: 0;">
          <div class="divItem">
            <el-form-item label="相关方单位名称" prop="unitId">
              <el-select v-model="infoData.unitId" disabled>
                <el-option v-for="item in unitList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="人员姓名" prop="name">
              <el-input v-model="infoData.name" disabled/>
            </el-form-item>
            <el-form-item label="身份证" prop="idcard">
              <el-input v-model="infoData.idcard" disabled/>
            </el-form-item>
            <el-form-item label="民族" prop="nation">
              <el-input v-model="infoData.nation" disabled/>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="infoData.sex" disabled>
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="健康状态" prop="health">
              <el-input v-model="infoData.health" disabled/>
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
              <el-input v-model="infoData.position" disabled/>
            </el-form-item>
            <el-form-item label="职称" prop="jobTitle">
              <el-select v-model="infoData.jobTitle"  disabled>
                <el-option v-for="item in jobTitleList" :key="item.id" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item label="所属部门" prop="dept">
              <el-input v-model="infoData.dept" disabled/>
            </el-form-item>
            <el-form-item label="工种" prop="workType">
              <el-select v-model="infoData.workType"  disabled>
                <el-option v-for="item in workTypeList" :key="item.id" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
            <!--            <el-form-item label="录入人">-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="录入时间">-->
            <!--            </el-form-item>-->
          </div>
        </div>
      </el-form>
      <span slot="footer" class="footerClass">
        <el-button @click="close">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogTitle: '第三方人员详情',
      editDialogVisible: false, //外层dialog
      addRender: 0,
      workTypeList: [],
      jobTitleList: [],
      unitList: [],
      tPerson: {}, //人员信息更新--》用到
      infoData: {
        name: '',
        unitId: '',
        phone: '',
        email: '',
        idcard: '',
        position: '',
        health: '',
        nation: '',
        workType: '',
        dept: '',
        jobTitle: '',
        sex: null
      }
    }
  },
  mounted() {
    this.$bus.on('personLookDetail', e => {
      //console.log('edit', e)
      this.getDetailData(e.id, e.unitId)
      this.getWorkType()
      this.getJobTitle()
      this.getUnitData()
      this.editDialogVisible = true
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
    renderDialog() {
      this.addRender += 1
    },
    //获取详情信息
    getDetailData(Tid, unitId) {
      let checkPar = {
        personId: Tid,
        unitId: unitId
      }
      this.$axios.post('/p/personJobInfo/getByPersonIdAndUnitId', checkPar).then(res => {
        if (res.data.code === 0) {
          //console.log(res)
          this.tPerson = {}
          let result = res.data.data
          this.infoData.id = result.id
          this.infoData.personId = result.personId
          this.infoData.unitId = result.unitId
          this.infoData.name = result.person.name //人名
          this.infoData.phone = result.person.phone
          this.infoData.idcard = result.person.idcard
          this.infoData.email = result.person.email
          this.infoData.sex = result.person.sex
          this.infoData.position = result.position
          this.infoData.nation = result.nation
          this.infoData.workType = result.workType
          this.infoData.dept = result.dept
          this.infoData.health = result.health
          this.infoData.jobTitle = result.jobTitle
          this.tPerson.code = result.person.code
          this.tPerson.orgCode = result.person.organization.code
          this.tPerson.state = result.person.state
          this.tPerson.userTypeCode = result.person.userTypeCode
          //console.log(this.tPerson)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
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
    //获取单位信息
    getUnitData() {
      let par = {
        pageSize: 10000,
        pageNo: 1
      }
      this.$axios.post('/p/unit/query', par).then(res => {
        if (res.data.code === 0) {
          let msg = res.data.data.content
          this.unitList = []
          for (let key of msg) {
            let obj = {
              id: key.id,
              name: key.name
            }
            this.unitList.push(obj)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.personDetail {

}
</style>
