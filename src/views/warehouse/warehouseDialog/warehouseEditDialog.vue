<template>
  <div class="editDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="warehouseTitle" :visible.sync="editDialogVisible" width="30%"
               center :key="editRender">
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm" :rules="rules">
        <el-form-item label="仓库名称" prop="name">
          <el-input v-model="infoData.name" clearable/>
        </el-form-item>
        <el-form-item label="仓库位置" prop="areaId">
          <el-popover style="margin-left: 10px;"
                      placement="right"
                      width="280"
                      trigger="click" :value="IsShowAreapop" v-show="IsShowAreapop">
            <el-form :inline="true" :model="areaInlineForm" class="demo-form-inline">
              <el-form-item label="安装位置:">
                <el-input v-model="areaInline1" clearable></el-input>
                <el-tree v-show="isShowArea" :highlight-current=true :default-expand-all=false
                         :style="{maxHeight: popheight,overflowY: 'scroll'}"
                         :expand-on-click-node="true" :data="areaTree" :filter-node-method="filterNode3"
                         @node-click="selectClassfy3" class="width-220 selectTree-input objectTree"
                         ref="AreaTree"></el-tree>
              </el-form-item>
            </el-form>
            <el-tag slot="reference" effect="plain">安装位置添加</el-tag>
          </el-popover>
          <el-input v-show="!isShowArea" v-model="areaInline" clearable @click.native="areaInputInline"></el-input>
        </el-form-item>
<!--        <el-form-item label="备注" prop="remarks">-->
<!--          <el-input v-model="infoData.remarks" clearable type="textarea" resize="none" :show-word-limit="true" :maxlength="200" :rows="5"/>-->
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
    return {
      editDialogVisible: false,
      warehouseTitle:'仓库管理编辑',
      popheight: document.body.clientHeight * 0.3 + 'px',
      isShowArea:true, // 仓库位置
      IsShowAreapop:true,
      areaInlineForm:{},
      areaInline1:'',
      areaInline:'',
      infoData: {
        name: '',
        areaId: '',
        remarks: ''
      },
      rules: {
        name: [{
          required: true,
          message: '请输入仓库名称',
          trigger: ['change','blur']
        },{
          max: 64,
          message: '长度不可超过64位',
          trigger: ['change', 'blur']
        }],
        areaId:[{
          required: true,
          message: '请选择仓库位置',
          trigger: 'change'
        }],
      },
      editRender:0,
      areaTree:[] //仓库位置树
    }
  },
  watch: {
    // 当dialog关闭，对表单内容的清空
    editDialogVisible(val) {
      if (val === false) {
        this.infoData.name = ''
        this.infoData.area = ''
        this.infoData.remarks = ''
        this.reload()
      }
    },
    areaInline(val) {
      this.areaInline1 = ''
      if (val === '') {
        this.isShowArea = true
        this.IsShowAreapop = true
        this.infoData.areaId = ''
      }
    },
    areaInline1(val){
      this.$refs.AreaTree.filter(val)
    }
  },
  created() {
    // 编辑bus传值&跳转实现
    this.$bus.$on('edit', (e) => {
      console.log('edit',e)
      this.infoData.name = e.name
      this.areaInline = e.areaName
      this.isShowArea = false
      this.IsShowAreapop = false
      this.infoData.areaId = e.areaId
      this.infoData.remarks = e.remarks
      this.infoData.id = e.id
      this.editDialogVisible = true
      if (this.areaTree.length<=0){
        this.areaTree = e.areaTree
      }
      this.warehouseTitle='仓库管理编辑'
    })
    //新增跳转
    this.$bus.$on('add', (e) => {
      console.log('add',e)
      this.editDialogVisible = e.show
      this.areaInline = null
      this.infoData.areaId =null
      this.isShowArea = true
      this.IsShowAreapop = true
      if (this.areaTree.length<=0){
        this.areaTree = e.areaTree
      }
      this.warehouseTitle='仓库管理新增'
    })
  },
  methods: {
    close() {
      this.editDialogVisible = false
      this.areaInline =''
    },
    updateInfo() {
      console.log(this.infoData)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.warehouseTitle ==='仓库管理编辑'){
              //let parm=this.infoData
            let parm={
                id:this.infoData.id,
                name:this.infoData.name,
              areaId:this.infoData.areaId
            }
              this.$axios.post('/d/stock/update', parm).then(res=>{
                if(res.data.code===0){
                  this.$message({
                    type:'success',
                    message:'编辑成功'
                  })
                  setTimeout(()=>{
                    this.close()
                    this.$bus.emit('reload',true)
                  },220)
                }else {
                  this.$message.error(res.data.message)
                }
              }).catch(err=>{
                console.log(err)
              })
            }else if (this.warehouseTitle ==='仓库管理新增'){
            let addparm={
              name:this.infoData.name,
              areaId:this.infoData.areaId
            }
              this.$axios.post('/d/stock/add',addparm).then(res=>{
                if (res.data.code===0){
                  this.$message({
                    type:'success',
                    message:'新增成功'
                  })
                  setTimeout(()=>{
                    this.close()
                    this.$bus.emit('reload',true)
                  },230)
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
    reload() {
      this.editRender+=1
    },
    filterNode3(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    areaInputInline() {
      this.IsShowAreapop = true
      this.isShowArea = true
      this.areaInline = ''
    },
    selectClassfy3(data) {
      console.log('areatree', data)
      this.areaInline1 =data.label
      this.areaInline = this.areaInline1
      this.infoData.areaId = data.id
      this.isShowArea = false
      this.IsShowAreapop = false
    }
  }
}
</script>

<style scoped>

</style>
