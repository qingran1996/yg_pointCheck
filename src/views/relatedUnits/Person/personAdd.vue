<template>
  <div class="personAdd">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle"
               :visible.sync="editDialogVisible" width="40%" center :key="addRender">
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm" :rules="rules">
        <div style="display: flex;justify-content: space-around;margin: 0;padding: 0;">
          <div class="divItem">
            <el-form-item label="相关方单位名称" prop="unitId">
              <el-select v-model="infoData.unitId" filterable>
                <el-option v-for="item in unitList" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
            <el-form-item label="人员姓名" prop="name">
              <el-input v-model="infoData.name" clearable/>
            </el-form-item>
            <el-form-item label="身份证" prop="idcard">
              <el-input v-model="infoData.idcard" clearable/>
            </el-form-item>
            <el-form-item label="民族" prop="nation">
              <el-input v-model="infoData.nation" clearable/>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="infoData.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="健康状态" prop="health">
              <el-input v-model="infoData.health" clearable/>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="infoData.phone" clearable/>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="infoData.email" clearable/>
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
              <el-input v-model="infoData.dept" clearable/>
            </el-form-item>
            <el-form-item label="工种" prop="workType">
              <el-select v-model="infoData.workType" clearable filterable multiple >
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
      dialogTitle: '第三方人员新增',
      editDialogVisible: false, //外层dialog
      addRender: 0,
      infoData: {
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
        sex: null
      },
      workTypeList: [],
      jobTitleList: [],
      unitList: [],
      rules: {
        name: [
          { required: true, message: '请输入人员姓名', rigger: ['change', 'blur'] },
          { max: 32, message: '长度不可超过32位', trigger: ['change', 'blur'] }
        ],
        unitId: [
          { required: true, message: '请选择相关单位', trigger: ['change', 'blur'], type: 'number' }
        ],
        idcard: [
          { required: true, validator: this.userCardRole, trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, validator: this.phoneRole, trigger: ['blur', 'change'] }
        ],
        email: [
          { required: true, validator: this.emailRole, trigger: ['blur', 'change'] }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: ['change'] }
        ]
      }
    }
  },
  created() {
  },
  mounted() {
    this.$bus.on('personAdd', e => {
      this.editDialogVisible = e.show
      this.getWorkType()
      this.getJobTitle()
      this.getUnitData()
      this.isShowImg = false
    })
  },
  watch: {
    editDialogVisible(val) {
      if (val === false) { //关闭后，所有数据重置
        this.$refs.ruleForm.resetFields()
        this.renderDialog()
        this.source = {
          source: 4,
          file: null
        }
        this.fileList = []
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
          this.axiosAdd().then(res => {
            if (res === 'success') {
              this.$message.success('新增成功')
              this.close()
              this.$bus.emit('renderPersonThree', true)
            } else {
              this.$message.error(res)
              //this.$bus.emit('renderPersonThree', true)
            }
          }).catch(err => {
            console.log(err)
          })
        }
      })
    },
    renderDialog() {
      this.addRender += 1
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
      this.$axios.post('/p/unit/queryByName', par).then(res => {
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
    },
    //正式新增
    async axiosAdd() {
      let addparOne = {
        name: this.infoData.name,
        sex: this.infoData.sex,
        phone: this.infoData.phone,
        email: this.infoData.email,
        idcard: this.infoData.idcard,
        code: this.infoData.idcard,
        state: '004',
        userTypeCode: '03', //相关方人员
        orgCode: 'EXTERNAL-UNIT'
      }
      let src=''
      if (this.infoData.workType.length>0){
        for (let z =0;z<this.infoData.workType.length;z++){
          src = src+this.infoData.workType[z]
          if (z<this.infoData.workType.length-1){
            src = src +','
          }
        }
      }
      let addpartwo = {
        personId: 0,
        unitId: this.infoData.unitId,
        jobTitle: this.infoData.jobTitle,
        workType: src,
        position: this.infoData.position,
        dept: this.infoData.dept,
        nation: this.infoData.nation,
        health: this.infoData.health
      }
      let backThing = ''
      await this.$axios.post('/p/person/add', addparOne).then(res => {
        if (res.data.code !== 0) {
          backThing = res.data.message
          return backThing
        } else {
          addpartwo.personId = res.data.data.id
        }
      }).catch(err => {
        console.log(err)
      })
      await this.$axios.post('/p/personJobInfo/add', addpartwo).then(res => {
        if (res.data.code === 0) {
          backThing = 'success'
        }
      }).catch(err => {
        console.log(err)
      })
      return backThing
    }
  }
}
</script>

<style scoped>
.personAdd {

}

.personAdd >>> .el-input__count {
  background: none;
  bottom: -10px;
}
</style>
