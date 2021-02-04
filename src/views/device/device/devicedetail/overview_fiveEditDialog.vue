<template>
  <div class="editDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle" :visible.sync="editDialogVisible" width="30%" center :key="renderD">
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm" :rules="rules">
        <el-form-item label="设备位号" prop="deviceCode">
          <el-input v-model="infoData.deviceCode"  disabled/>
        </el-form-item>
        <el-form-item label="验收人" prop="personAcceptance">
          <el-input v-model="infoData.personAcceptance" clearable/>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactNumber">
          <el-input v-model="infoData.contactNumber" clearable/>
        </el-form-item>
        <el-form-item label="验收时间" prop="acceptanceTime">
          <el-date-picker v-model="infoData.acceptanceTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="验收结果" prop="acceptanceResults">
          <el-radio-group v-model="infoData.acceptanceResults">
            <el-radio  :label="1">通过</el-radio>
            <el-radio  :label="0">未通过</el-radio>
          </el-radio-group>
        </el-form-item>
<!--        <el-form-item label="附件" prop="remarks">-->
<!--          <el-upload-->
<!--            action="https://jsonplaceholder.typicode.com/posts/"-->
<!--            list-type="picture-card"-->
<!--            :on-change="handleChange"-->
<!--            :file-list="infoData.remarks"-->
<!--          >-->
<!--            <i class="el-icon-plus" />-->
<!--          </el-upload>-->
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
    let checkPhone=(rule, value, callback)=>{
      if (!value){
        return callback(new Error('电话号码不能为空'))
      }else {
        const reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/
        //console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
      }
    }
    return {
      editDialogVisible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      dialogTitle:'验收信息编辑',
      addTitle:'验收信息新增',
      editTitle:'验收信息编辑',
      fileList: [],
      renderD:0,
      infoData: {
        deviceCode: '',
        personAcceptance: '', //验收人
        acceptanceTime: '',
        contactNumber: '',
        acceptanceResults: '',
        id:null,
        remarks: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }]
      },
      rules:{
        personAcceptance:[{
          required: true, message: '请输入验收人', trigger: ['blur','change']
        }],
        acceptanceResults:[{
          required: true, message: '请选择验收结果', trigger: ['change']
        }],
        contactNumber:[{
          required: true, validator:checkPhone, trigger: ['blur']
        }],
        acceptanceTime:[{
          required: true, message: '请选择验收时间', trigger: ['blur','change']
        }]
      }
    }
  },
  watch: {
    // 当dialog关闭，对表单内容的清空
    editDialogVisible(val) {
      if (val === false) {
        this.infoData.deviceCode = ''
        this.infoData.personAcceptance = ''
        this.infoData.acceptanceTime = ''
        this.infoData.acceptanceResults = null
        this.infoData.contactNumber = null
        this.infoData.id = null
        this.renderDialog()
      }
    }
  },
  created() {
    // 编辑bus传值&跳转实现
    this.$bus.$on('editInfo5', (e) => {
      this.infoData.deviceCode = e.deviceCode
      this.infoData.contactNumber = e.contactNumber
      this.infoData.personAcceptance = e.personAcceptance
      this.infoData.acceptanceTime = e.acceptanceTime
      this.infoData.acceptanceResults = e.acceptanceResults
      this.infoData.id = e.id
      this.editDialogVisible = true
      this.dialogTitle = this.editTitle
    })
    this.$bus.$on('add5',(e)=>{
      this.dialogTitle = this.addTitle
      this.editDialogVisible = e.show
      this.infoData.deviceCode = e.code
    })
  },
  methods: {
    close(){
      this.editDialogVisible = false
    },
    updateInfo() {
      this.$refs.ruleForm.validate(valid=>{
        if (valid){
          this.infoData.acceptanceTime =new Date(this.infoData.acceptanceTime).getTime()
          //console.log(this.infoData)
          if (this.dialogTitle === this.editTitle){ //edit
            let editPar={
              id:this.infoData.id,
              deviceKks:this.infoData.deviceCode,
              personAcceptance:this.infoData.personAcceptance,
              acceptanceResults:this.infoData.acceptanceResults,
              acceptanceTime:this.infoData.acceptanceTime,
              contactNumber:this.infoData.contactNumber
            }
            this.$axios.post('/d/deviceAcceptance/update',editPar).then(res=>{
              if (res.data.code === 0){
                this.$message.success('成功修改')
                this.close()
                this.$bus.emit('refreshData',true)
              }else {
                this.$message.error(res.data.message)
              }
            }).catch(err=>{
              console.log(err)
            })
          }else if (this.dialogTitle === this.addTitle){ //add
            let addPar={
              deviceKks:this.infoData.deviceCode,
              personAcceptance:this.infoData.personAcceptance,
              acceptanceResults:this.infoData.acceptanceResults,
              acceptanceTime:this.infoData.acceptanceTime,
              contactNumber:this.infoData.contactNumber
            }
            this.$axios.post('/d/deviceAcceptance/add',addPar).then(res=>{
              if (res.data.code === 0){
                this.$message.success('新增成功')
                this.close()
                this.$bus.emit('refreshData',true)
              }else {
                this.$message.error(res.data.message)
              }
            }).catch(err=>{
              console.log(err)
            })
          }
        }
      })
    },
    renderDialog(){
      this.renderD +=1
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3)
    }
  }
}
</script>

<style scoped>

</style>
