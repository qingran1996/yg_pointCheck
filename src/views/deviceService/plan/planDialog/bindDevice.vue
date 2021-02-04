<template>
  <div class="bindDevice">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="DialogTitle" :visible.sync="editDialogVisible"
               width="40%" center :key="renderDialog">
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight"
                 ref="serviceTable" height="300">
        <el-table-column type="index" label="序号" width="50" align="center"/>
        <el-table-column v-for="item in listName" :key="item.name" :label="item.label" :prop="item.name"
                         min-width="140" show-overflow-tooltip
                         align="center"/>
      </el-table>
    <span slot="footer" class="footerClass">
        <el-button  @click="close">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      DialogTitle: '已经绑定的设备信息',
      editDialogVisible: false,
      loading:false,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 152 +'px', // 表格高度
      renderDialog: 0,
      tableData:[], //列表展示数组,
      listName:[{
        label:'设备名称',
        name:'deviceName'
      },{
        label:'设备位号',
        name:'deviceKks'
      },{
        label:'规格型号',
        name:'specificationModel'
      },{
        label:'主要参数',
        name:'mainParameters'
      },{
        label:'是否为特殊设备',
        name:'isSpecialString'
      }]
    }
  },
  mounted() {
    this.$bus.on('bindDevice',e=>{
      //console.log(e)
      this.editDialogVisible = e.show
      this.queryBindDevice(e.id)
    })
  },
  methods: {
    close() {
      this.editDialogVisible = false
    },
    //查询该计划已经绑定的设备
    queryBindDevice(Tid){
      this.$axios.post('/d/maintainPlan/queryDevList',{planId:Tid}).then(res=>{
        this.loading = true
        if (res.data.code === 0){
          this.tableData = []
          //console.log(res)
          let msg = res.data.data
          for (let key of msg){
            let obj =key
            obj.isSpecialString = key.isSpecial ===1?'是':'否'
            this.tableData.push(obj)
          }
        }else {
          this.$message.error(res.data.message)
        }
        this.loading = false
      }).catch(err=>{
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.bindDevice {

}
</style>
