<template>
<div class="companyDetail">
  <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle"
             :visible.sync="editDialogVisible" width="30%" center :key="addRender">
    <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm">
      <el-form-item label="相关方单位名称" prop="name">
        <el-input v-model="infoData.name" disabled/>
      </el-form-item>
      <el-form-item label="所属类型" prop="kindId">
        <el-select v-model="infoData.kindId" disabled>
          <el-option label="承包商" :value="2"/>
          <el-option label="供应商" :value="3"/>
          <el-option label="相关方单位" :value="4"/>
        </el-select>
      </el-form-item>
      <el-form-item label="社会信用代码" prop="creditCode">
        <el-input v-model="infoData.creditCode" disabled/>
      </el-form-item>
      <el-form-item label="法定代表人" prop="legalPerson">
        <el-input v-model="infoData.legalPerson" disabled/>
      </el-form-item>
      <el-form-item label="地址" prop="houseAddress">
        <el-input v-model="infoData.houseAddress" disabled/>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model="infoData.address" disabled/>
      </el-form-item>
      <el-form-item label="注册资金" prop="registerMoney">
        <el-input v-model.number="infoData.registerMoney" disabled>
          <template slot="append">({{ infoData.currency }})万元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="成立日期" prop="registerDate">
        <el-date-picker v-model="infoData.registerDate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
                        value-format="timestamp" disabled/>
      </el-form-item>
      <el-form-item label="企业规模" prop="scale">
        <el-select v-model="infoData.scale" disabled>
          <el-option label="大型" value="大型"></el-option>
          <el-option label="中型" value="中型"></el-option>
          <el-option label="小型" value="小型"></el-option>
          <el-option label="微型" value="微型"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="从业人数" prop="employees">
        <el-input v-model="infoData.employees" disabled>
          <template slot="append">人</template>
        </el-input>
      </el-form-item>
      <el-form-item label="信用等级" prop="creditGrade">
        <el-input v-model="infoData.creditGrade" disabled/>
      </el-form-item>
      <el-form-item label="企业简介" prop="companyProfiles">
        <el-input v-model="infoData.companyProfiles" disabled type="textarea"  :maxlength="200" show-word-limit :rows="4"/>
      </el-form-item>
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
      dialogTitle: '第三方单位详情',
      editDialogVisible: false,
      addRender: 0,
      infoData: {
        name: '',
        kindId: '',
        creditCode: '',
        registerMoney: 100, //注册资金
        currency: '',//币种
        registerDate: null,//成立日期
        registerDateString: null,//成立日期
        scale: '',//企业规模
        employees: null,
        houseAddress:'', //住所
        address:'', //详细地址
        creditGrade: null, //信用等级
        companyProfiles: ''//简介
      }
    }
  },
  created() {

  },
  mounted() {
    this.$bus.on('companyLookDetail', e => {
      this.editDialogVisible = true
      this.getDetailData(e.id)
    })
  },
  watch: {
    editDialogVisible(val) {
      if (val === false) {
        this.$refs.ruleForm.resetFields()
        this.renderDialog()
      }
    }
  },
  methods: {
    close() {
      this.editDialogVisible = false
    },
    //获取详情信息
    getDetailData(Tid) {
      let checkPar = {
        id: Tid
      }
      this.$axios.post('/p/unit/get', checkPar).then(res => {
        if (res.data.code === 0) {
          this.infoData = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    renderDialog() {
      this.addRender += 1
    }
  }
}
</script>

<style scoped>
.companyDetail{

}
</style>
