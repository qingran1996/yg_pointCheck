<template>
  <div class="roleProcess">
    <el-dialog v-dialogDrag title="流程权限" :visible.sync="centerDialogVisible" width="80%" center
               :close-on-click-modal="false">
      <el-form :label-position="'left'" label-width="80px" :model="sizeForm">
        <el-form-item label="角色名称"><el-input v-model="input1" disabled/></el-form-item>
        <el-form-item label="排列顺序"><el-input v-model="input2" disabled/></el-form-item>
        <el-form-item label="流程权限">
          <div :style="{height: heightT,overflowY:'scroll'}">
            <el-tree :data="processTree" v-loading="loading" show-checkbox ref="processTree" :default-expanded-keys="checkedKeys"
                     node-key="id" :props="defaultProps" :default-checked-keys="checkedKeys" @check-change="isCheckedOne">
            </el-tree>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
				<el-button @click="centerDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="UpdateSure" v-prevent-re-click>保 存</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      centerDialogVisible: false,
      input1:'',
      loading:true,
      input2:'',
      roleId:null,
      heightT:document.body.clientHeight * 0.2 + "px",
      chooseIds:[], //选择的权限array
      processTree:[],//流程权限树
      checkedKeys:[], //获取数据时，tree中已经被选中的keys
      defaultProps:{
        children: 'children',
        label:'permission'
      },
      sizeForm:{}
    }
  },
  mounted() {
    this.$bus.on('roleProcess', e => {
      this.roleId =null
      this.input1 = e.rolename
      this.input2 = e.number
      this.roleId = e.id
      this.getProcessData(this.roleId)
      this.centerDialogVisible = true
    })
  },
  methods: {
    //保存按钮
    UpdateSure() {
      // this.centerDialogVisible = false
      let par={
        roleId:this.roleId,
        stageIds: this.chooseIds
      }
      this.$axios.post('/w/actPermissions/updateAllStageByRole',par).then(res=>{
        if (res.data.code === 0){
          this.$notify({
            title: res.data.message,
            message: '保存成功',
            type: 'success'
          })
          this.centerDialogVisible = false
        }else {
          this.$message.error(res.data.message)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    //获取流程权限树
    getProcessData(Tid){
      let parm={
        roleId:Tid
      }
      this.$axios.post('/w/actPermissions/getAllStageByRole',parm).then(res=>{
        this.loading = true
        if (res.data.code === 0){
          //console.log('响应体',res)
          this.processTree = []
          this.checkedKeys = []
          let msg =res.data.data
          for (let key of msg){
              let obj ={}
              obj.permission = key.stageName
              obj.children = []
              for (let i =0;i<key.stageBos.length;i++){
                let child ={}
                child.id = key.stageBos[i].id
                child.permission = key.stageBos[i].permission
                if (key.stageBos[i].isOwn ===1){ //若为1 表示拥有该权限,则要显示勾选状态
                  this.checkedKeys.push(child.id)
                }
                obj.children.push(child)
              }
              //obj.children = key.stageBos
              obj.id = obj.children[obj.children.length-1].id+100
            this.processTree.push(obj)
          }
          //console.log('流程权限',this.checkedKeys)
          this.chooseIds = this.checkedKeys //赋值,什么都不选时候直接进行接口update
          setTimeout(()=>{
            this.loading = false
          },430)
        }else {
          this.$message.error(res.data.message)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    //当复选框状态发生变化时，触发的事件
    isCheckedOne(data,isChecked){
      if (isChecked === true){
        if (!data.children){ //排除父节点的影响
          this.chooseIds.push(data.id)
        }
      }else {
        if (!data.children){ //同上
          this.chooseIds.splice(this.chooseIds.indexOf(data.id),1)
        }
      }
      //console.log(this.chooseIds)
    }
  }
}
</script>

<style scoped>
.roleProcess {

}
</style>
