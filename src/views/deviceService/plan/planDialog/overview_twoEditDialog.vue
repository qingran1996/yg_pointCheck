<template>
  <div class="editDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="DialogTitle" :visible.sync="editDialogVisible" width="30%" center :key="renderDialog">
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm" :rules="ruleForm">
        <el-form-item label="保养计划编号" prop="planCode">
          <el-input v-model="infoData.planCode"  clearable :disabled="inputDisabled"/>
        </el-form-item>
        <el-form-item label="保养标题" prop="level">
<!--          <el-select v-model="infoData.level" clearable filterable >-->
<!--            <el-option v-for="item in service_options" :key="item.id" :label="item.name" :value="item.code" />-->
<!--          </el-select>-->
          <el-input v-model="infoData.level" clearable/>
        </el-form-item>
        <el-form-item label="保养内容" prop="content">
          <el-input v-model="infoData.content" type="textarea" resize="none" :maxlength="200" :rows="4" :show-word-limit="true" clearable/>
        </el-form-item>
        <el-form-item label="预计保养时间(h)" prop="workHour">
          <el-input-number v-model="infoData.workHour"  :step="1" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item label="保养频率" prop="rate">
          <el-input-number v-model="infoData.rate" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item label="保养频率周期" prop="cycle">
          <el-select v-model="infoData.cycle" clearable>
            <el-option label="日" :value="1"/>
            <el-option label="周" :value="2"/>
            <el-option label="月(30天)" :value="3"/>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="保养状态" prop="status">-->
<!--          <el-select v-model="infoData.status"  clearable>-->
<!--            <el-option label="待保养" :value="1"></el-option>-->
<!--            <el-option label="已完成" :value="2"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
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
    let checkHour=(rule, value, callback)=>{
      if (value === 0){
        return callback(new Error('请设置预计所需花费的时间'))
      }else {
        return callback()
      }
    }
    let checkRate=(rule, value, callback)=>{
      if (value === 0){
        return callback(new Error('请设置频率'))
      } else {
        return callback()
      }
    }
    return {
      editDialogVisible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      renderDialog:1, //重新渲染方式
      DialogTitle:'保养计划编辑',
      inputDisabled:true, //编号新增时，后端自动生成;而编辑时，应该也不能更改
      infoData: {
        planCode: '',
        //status: '',
        level: '',
        content:'',
        workHour:0,
        rate:0,
        cycle:''
      },
      ruleForm: {
        level:[{
          required: true,
          message: '请输入保养标题',
          trigger: 'change'
        },{
          max: 16,
          message: '保养标题长度不可超过16位',
          trigger: ['change', 'blur']
        }],
        content:[{
          required: true,
          message: '请输入保养内容',
          trigger: ['change', 'blur']
        }],
        workHour:[{
          required:true,
          validator: checkHour,
          trigger: 'change'
        }],
        rate:[{
          required:true,
          validator: checkRate,
          trigger: 'change'
        }],
        cycle:[{
          required: true,
          message: '请选择保养频率周期',
          trigger:  'change'
        }]
      },
      service_options: [{
        code: '01',
        name: '一级保养'
      }]
    }
  },
  watch: {
    // 当dialog关闭，对表单的清空
    editDialogVisible(val) {
      if (val === false) {
        this.againRender()
        this.resetForm1()
      }
    }
  },
  created() {
    // 编辑bus传值&跳转实现
    this.$bus.$on('edit2', (e) => {
      this.DialogTitle ='保养计划编辑'
      console.log('编辑',e)
      this.infoData.planCode = e.code
      this.infoData.level = e.serviceLevel
      this.infoData.content = e.serviceContent
      this.infoData.workHour = e.workHour
      this.infoData.rate = e.rate
      this.infoData.cycle = e.cycleType
      this.service_options = e.service_options
      this.editDialogVisible = true
    })
    // 新增按钮跳转实现
    this.$bus.$on('add2', (e) => {
      this.DialogTitle ='保养计划新增'
      this.editDialogVisible = e.ps
      this.infoData.planCode = '新增成功后会自动生成'
      this.service_options = e.service_options
    })
  },
  methods: {
    close(){
      this.editDialogVisible = false
    },
    updateInfo() {
      console.log(this.infoData)
      this.$refs.ruleForm.validate(valid=>{
        if (valid){
          console.log(this.infoData)
          if (this.DialogTitle === '保养计划编辑'){
            this.editPlan(this.infoData)
          }else if (this.DialogTitle === '保养计划新增'){
            this.addPlan(this.infoData)
          }
        }
      })
    },
    againRender(){
      this.renderDialog +=1
    },
    resetForm1(){ //表单重置
      this.infoData ={
          planCode: '',
          level: '',
          content:'',
          workHour:0,
          rate:0,
          cycle:''
      }
    },
    //新增: add->axios
    addPlan(item){
      let addPar={
        creator: localStorage.getItem('username') , //新增时，指登录者的用户名 string《---》
        content:item.content,
        time:item.workHour,
        frequency:item.rate,
        frequencyType:item.cycle,
        title:item.level //保养级别- 暂定
      }
      this.$axios.post('/d/maintainPlan/add',addPar).then(res=>{
        if (res.data.code === 0){
          this.$message.success('成功新增')
          this.close()
          this.$bus.emit('serviceRender',true)
        }else {
          this.$message.error(res.data.message)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    //编辑:update->axios
    editPlan(item){
      let updatePar={
        planNum:item.planCode,
        content:item.content,
        time:item.workHour,
        frequency:item.rate,
        frequencyType:item.cycle,
        title:item.level //保养级别- 暂定
      }
      this.$axios.post('/d/maintainPlan/update',updatePar).then(res=>{
        if (res.data.code ===0){
          this.$message.success('成功编辑')
          this.close()
          this.$bus.emit('serviceRender',true)
        }else {
          this.$message.error(res.data.message)
        }
      }).catch(err=>{
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.editDialog>>>.el-input__count{
  top:70px;
  background:none;
}
</style>
