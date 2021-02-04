<template>
  <div class="companyAdd">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle"
               :visible.sync="editDialogVisible" width="30%" center :key="addRender">
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm" :rules="rules">
        <el-form-item label="相关方单位名称" prop="name">
          <el-input v-model="infoData.name" clearable/>
        </el-form-item>
        <el-form-item label="所属类型" prop="kindId">
          <el-select v-model="infoData.kindId">
<!--            <el-option label="我方单位" :value="1"/>-->
            <el-option label="承包商" :value="2"/>
            <el-option label="供应商" :value="3"/>
            <el-option label="相关方单位" :value="4"/>
          </el-select>
        </el-form-item>
        <el-form-item label="社会信用代码" prop="creditCode">
          <el-input v-model="infoData.creditCode" clearable/>
        </el-form-item>
        <el-form-item label="法定代表人" prop="legalPerson">
          <el-input v-model="infoData.legalPerson" clearable/>
        </el-form-item>
        <el-form-item label="地址" prop="houseAddress">
          <el-input v-model="infoData.houseAddress" clearable/>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="infoData.address" clearable/>
        </el-form-item>
        <el-form-item label="注册资金" prop="registerMoney">
          <el-input v-model.number="infoData.registerMoney" clearable>
            <template slot="append">({{ infoData.currency }})万元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="成立日期" prop="registerDate">
          <el-date-picker v-model="infoData.registerDate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
                          value-format="timestamp" />
        </el-form-item>
        <el-form-item label="企业规模" prop="scale">
          <el-select v-model="infoData.scale" clearable>
            <el-option label="大型" value="大型"></el-option>
            <el-option label="中型" value="中型"></el-option>
            <el-option label="小型" value="小型"></el-option>
            <el-option label="微型" value="微型"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="从业人数" prop="employees">
          <el-input v-model="infoData.employees" clearable>
            <template slot="append">人</template>
          </el-input>
        </el-form-item>
        <el-form-item label="信用等级" prop="creditGrade">
          <el-input v-model="infoData.creditGrade" clearable/>
        </el-form-item>
        <el-form-item label="企业简介" prop="companyProfiles">
          <el-input v-model="infoData.companyProfiles" clearable type="textarea" resize="none" :maxlength="200" show-word-limit :rows="4"/>
        </el-form-item>
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
    let checkMoney=(rule, value, callback)=>{
      if (!value){
        return callback(new Error('请输入注册资金'))
      }else {
        const re = /^[0-9]+.?[0-9]*/
        if (!re.test(value)){
          return callback(new Error('请输入数字'))
        }else {
          return callback()
        }
      }
    }
    let checkPerson=(rule, value, callback)=>{
      if (value){
        const re = /^[0-9]+.?[0-9]*/
        if (!re.test(value)){
          return callback(new Error('请输入数字'))
        }else {
          return callback()
        }
      }
      return callback()
    }
    return {
      dialogTitle:'第三方单位新增',
      editDialogVisible:false,
      addRender:0,
      infoData: {
        name: '',
        kindId: '',
        creditCode: '',
        registerMoney: null, //注册资金
        currency: '',//币种
        registerDate: null,//成立日期
        scale: '',//企业规模
        employees: null,
        houseAddress:'', //住所
        address:'', //详细地址
        creditGrade: null, //信用等级
        companyProfiles: ''//简介
      },
      rules:{
        name: [{
          required: true, message: '请输入相关单位名称', trigger: ['change', 'blur'] },
          { max: 32, message: '长度不可超过32位', trigger: ['change', 'blur']
          }],
        kindId: [{
          required: true, message: '请选择所属类型', trigger: 'change', type:'number'
        }],
        creditCode:[{
          required: true, message: '请输入社会信用代码', trigger: ['change', 'blur']
        }],
        legalPerson:[{
          required: true, message: '请输入法定代表人', trigger: ['change', 'blur'] },
          { max: 32, message: '长度不可超过32位', trigger: ['change', 'blur']
        }],
        registerDate:[{
          required: true, message: '请选择日期', trigger: 'change',type:'number'
        }],
        registerMoney:[{
          required: true, validator:checkMoney, trigger: 'change'
        }],
        address:[{
          required: true, message: '请输入详细地址', trigger: ['change','blur']
        }],
        houseAddress:[{
          required: true, message: '请输入地址', trigger: ['change','blur']
        }],
        employees:[{
          validator:checkPerson,trigger:'change'
        }]
      }
    }
  },
  created() {

  },
  mounted() {
    this.$bus.on('companyAdd',e=>{
      this.editDialogVisible = e
      this.infoData.currency = '人民币'
    })
  },
  watch:{
    editDialogVisible(val){
      if (val === false){
        this.$refs.ruleForm.resetFields()
        this.renderDialog()
      }
    }
  },
  methods:{
    close(){
      this.editDialogVisible = false
    },
    updateInfo(){
      this.$refs.ruleForm.validate(valid=>{
        if (valid){
          let addPar={
            name:this.infoData.name,
            kindId:this.infoData.kindId,
            creditCode:this.infoData.creditCode,
            legalPerson: this.infoData.legalPerson,
            houseAddress: this.infoData.houseAddress,
            address:this.infoData.address,
            registerMoney: parseInt(this.infoData.registerMoney),
            currency: this.infoData.currency,
            registerDate:this.infoData.registerDate,
            scale: this.infoData.scale,
            employees: parseInt(this.infoData.employees),
            creditGrade: this.infoData.creditGrade,
            companyProfiles:this.infoData.companyProfiles
          }
          this.$axios.post('/p/unit/add',addPar).then(res=>{
            if (res.data.code === 0){
              this.$message.success('新增成功')
              this.close()
              this.$bus.emit('renderTable',true)
            }else {
              this.$message.error(res.data.message)
            }
          }).catch(err=>{
            console.log(err)
          })
        }
      })
    },
    renderDialog(){
      this.addRender+=1
    }
  },
  destroyed() {

  }
}
</script>

<style scoped>
.companyAdd {

}
</style>
