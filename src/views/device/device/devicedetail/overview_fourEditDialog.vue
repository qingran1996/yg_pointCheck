<template>
  <div class="editDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle" :visible.sync="editDialogVisible" width="30%" center :key="renderDialog">
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm" :rules="rules">
        <el-form-item label="设备位号" prop="deviceKks">
          <el-input v-model="infoData.deviceKks"  disabled/>
        </el-form-item>
        <el-form-item label="是否第三方检验" prop="thirdPartyExamine">
          <el-radio-group v-model="thirdPartyExamine">
            <el-radio :label="1" >是</el-radio>
            <el-radio :label="0" >否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="校验人" prop="examinePerson">
          <el-input v-model="infoData.examinePerson" clearable/>
        </el-form-item>
        <el-form-item label="校验时间" prop="examineTime">
          <el-date-picker type="date" placeholder="选择日期" v-model="infoData.examineTime" />
        </el-form-item>
        <el-form-item label="所属部门" prop="examineDept" v-show="checkShow">
          <el-popover placement="right" width="250" trigger="click" v-model="topPopoShow" class="topPop">
            <el-tree :highlight-current="true" :default-expand-all="false" node-key="id"
                     :style="{maxHeight: 150+'px',overflowY: 'scroll',width: 220+'px'}"
                     :expand-on-click-node="true" :data="deptTree" :filter-node-method="filterNode"
                     @node-click="selectClassfy" class="width-220 selectTree-input objectTree"
                     ref="DeptTree"></el-tree>
            <div style="margin-top: 5px;">
              <el-button size="mini" type="text" @click="cleanChoose">取消</el-button>
<!--              <el-button type="primary" size="mini" @click="topPopoShow = false">确定</el-button>-->
            </div>
            <el-input v-model="infoData.examineDept" slot="reference" @click.native="cleanChoose"/>
          </el-popover>
        </el-form-item>
        <el-form-item label="校验机构" prop="examineMechanism" v-show="!checkShow">
          <el-input v-model="infoData.examineMechanism" clearable/>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactNumber">
          <el-input v-model="infoData.contactNumber" clearable/>
        </el-form-item>
        <el-form-item label="校验结果" prop="examineResults">
          <el-radio-group v-model="infoData.examineResults">
            <el-radio  :label="1">通过</el-radio>
            <el-radio  :label="0">未通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="下次校验时间" prop="examineTimeNext">
          <el-date-picker type="date" placeholder="选择日期" v-model="infoData.examineTimeNext" />
        </el-form-item>
<!--        <el-form-item label="附件" prop="remarks">-->
<!--          <el-upload-->
<!--            action="https://jsonplaceholder.typicode.com/posts/"-->
<!--            list-type="picture-card"-->
<!--            :on-change="handleChange"-->
<!--            :file-list="fileList"-->
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
    let checkMechanism=(rule, value, callback)=>{
      if (!value&&this.checkShow === false){
        return callback(new Error('第三方校验机构不能为空'))
      }else {
        callback()
      }
    }
    let checkDept=(rule, value, callback)=>{
      if (!value&&this.checkShow === true){
        return callback(new Error('部门机构不能为空'))
      }else {
        callback()
      }
    }
    return {
      editDialogVisible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      radioCheck:0, // 默认为自己部门
      checkShow:true,
      renderDialog:0,
      topPopoShow:false,//组织tree展示
      dialogTitle:'校验信息编辑',
      addTitle:'校验信息新增',
      editTitle:'校验信息编辑',
      fileList: [{
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }],
      thirdPartyExamine:null, //是否为第三方校验
      infoData: {
        id:null,
        deviceKks: '',
        examinePerson: '',
        examineTime: '',
        mechanism: '',
        contactNumber: '',
        examineResults: '',
        examineDeptId:'',
        examineDept:'',//部门名字 ---
        examineMechanism:'',
        examineTimeNext:'',
        remarks: []
      },
      deptTree:null,//组织部门树
      rules:{
        examinePerson:[{
          required: true, message: '请输入校验人', trigger: ['blur','change']
        }],
        examineTime:[{
          required: true, message: '请选择校验时间', trigger: 'change'
        }],
        examineTimeNext:[{
          required: true, message: '请选择下次校验时间', trigger: 'change'
        }],
        examineResults:[{
          required: true, message: '请选择校验结果', trigger: 'change'
        }],
        contactNumber:[{
          required: true, validator:checkPhone, trigger: ['blur']
        }],
        examineMechanism:[{
          required:true, validator:checkMechanism, trigger:'change'
        }],
        examineDept:[{
          required:true, validator:checkDept, trigger:'change'
        }]
      }
    }
  },
  watch: {
    // 当dialog关闭，对表单内容的清空
    editDialogVisible(val) {
      if (val === false) {
         this.infoData.deviceKks = ''
         this.infoData.examinePerson = ''
         this.infoData.mechanism = ''
         this.infoData.contactNumber = ''
         this.infoData.examineMechanism = ''
         this.infoData.examineTime = null
         this.infoData.examineTimeNext = null
         this.infoData.examineDeptId = null
         this.infoData.examineResults = null
         this.infoData.id = null
         this.thirdPartyExamine = null
         this.renderAgain()
      }
    },
    'infoData.examineDept':{
      handler:function(val){
        this.$refs.DeptTree.filter(val)
      }
    },
    thirdPartyExamine(val){
      this.checkShow = val === 0
      if (val ===0){
        this.infoData.examineMechanism =''
      }else {
        this.infoData.examineDeptId = ''
        this.infoData.examineDept = ''
      }
    }
  },
  created() {
    // 编辑bus传值&跳转实现
    this.$bus.$on('editInfo4', (e) => {
      console.log('edit',e)
      this.dialogTitle = this.editTitle
      this.infoData.deviceKks = e.deviceKks
      this.infoData.id = e.id
      this.infoData.examineDeptId = e.examineDeptId
      this.getDeptTree().then((res)=>{
        let nodeData = this.$refs.DeptTree.getNode(res)
        if (nodeData) {
          this.infoData.examineDept = nodeData.data.label //根据部门id->查找相应的label string名
        } else {
          this.infoData.examineDept = ''
        }
      })
      // console.log('193',this.$refs.DeptTree.getCurrentNode(e.examineDeptId))
      this.thirdPartyExamine = e.thirdPartyExamine
      this.infoData.examinePerson = e.examinePerson
      this.infoData.examineMechanism = e.examineMechanism
      this.infoData.contactNumber = e.contactNumber
      this.infoData.examineTime = e.examineTime
      this.infoData.examineTimeNext = e.examineTimeNext
      this.infoData.examineResults = e.examineResults
      this.editDialogVisible = true
    })
    this.$bus.$on('add4',(e)=>{
      console.log('add',e)
      this.editDialogVisible = e.show
      this.getDeptTree()
      this.infoData.deviceKks = e.code
      this.thirdPartyExamine = 0 //默认不是第三方
      this.dialogTitle = this.addTitle
      this.radioCheck = null
    })
  },
  methods: {
    close(){
      this.editDialogVisible = false
    },
    updateInfo() {
      this.$refs.ruleForm.validate(valid=>{
        if (valid){
          this.infoData.examineTime = new Date(this.infoData.examineTime).getTime()
          this.infoData.examineTimeNext = new Date(this.infoData.examineTimeNext).getTime()
          if (this.dialogTitle === this.addTitle){ //add
            let addPar={
              deviceKks:this.infoData.deviceKks,
              examinePerson:this.infoData.examinePerson, //检测人员
              contactNumber:this.infoData.contactNumber, //检测人电话
              examineResults:this.infoData.examineResults, //检测结果
              examineTime:this.infoData.examineTime ,//检测时间
              examineTimeNext:this.infoData.examineTimeNext, //下次检测时间
              thirdPartyExamine:this.thirdPartyExamine, //是否为第三方机构
              examineDeptId:this.infoData.examineDeptId, //部门id
              //examineDeptId:0, //部门id  若不传部门则设置为0
              examineMechanism:this.infoData.examineMechanism//检测机构名称
            }
            this.$axios.post('/d/deviceExamine/add',addPar).then(res=>{
              if (res.data.code === 0){
                this.$message.success('新增成功')
                this.close()
                this.$bus.emit('renderTableTwo',true)
              }else {
                this.$message.error(res.data.message)
              }
            }).catch(err=>{
              console.log(err)
            })
          }else if (this.dialogTitle === this.editTitle){ //edit
            let editPar={
              id:this.infoData.id,
              deviceKks:this.infoData.deviceKks,
              examinePerson:this.infoData.examinePerson,
              contactNumber:this.infoData.contactNumber,
              examineResults:this.infoData.examineResults,
              examineTime:this.infoData.examineTime,
              thirdPartyExamine:this.thirdPartyExamine,
              examineDeptId:this.infoData.examineDeptId,
              examineTimeNext:this.infoData.examineTimeNext, //下次检测时间
              examineMechanism:this.infoData.examineMechanism
            }
            this.$axios.post('/d/deviceExamine/update',editPar).then(res=>{
              if (res.data.code === 0){
                this.$message.success('成功修改')
                this.close()
                this.$bus.emit('renderTableTwo',true)
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
    renderAgain(){
      this.renderDialog+=1
    },
    //获取组织树
    async getDeptTree(){
      let parm = {
        name: ''
      }
      await this.deptData(parm).then(res => {
        if (res.data.code === 0) {
          //console.log('组织机构',res.data.data)
          this.deptTree = []
          this.deptTree.push(res.data.data) //组织部门
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
      return this.infoData.examineDeptId
    },
    //搜索框-设备类型tree
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    selectClassfy(data) {
      //console.log('tree', data)
      this.topPopoShow = false
      this.infoData.examineDeptId = data.id
      this.infoData.examineDept = data.label
    },
    //取消
    cleanChoose(){
      this.topPopoShow = false
      this.infoData.examineDeptId = null
      this.infoData.examineDept = ''
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3)
    }
  }
}
</script>

<style scoped>
.topPop >>>.el-input__inner{
  width: 220px;
}
.topPop>>>.el-input--medium{
  width: 220px;
}
</style>
