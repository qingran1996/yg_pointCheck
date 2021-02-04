<template>
  <div class="editWarePerson">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="warehouseTitle" :visible.sync="editDialogVisible"
               width="40%" center >
      <div class="transfer">
        <el-transfer v-model="choosevalue" :data="persondata" :props="{key:'id',label:'name'}"
                     :button-texts="['移除', '添加']"
                     :titles="['其他人员', warehousename+'现有人员']"
                     filterable @change="updateInfo" v-prevent-re-click>
          <el-button class="transfer-footer" slot="right-footer" size="mini" type="success"
                     @click="looklist" plain round>相关人员详情</el-button>
        </el-transfer>
      </div>
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
      warehouseTitle: '仓库人员变动',
      editDialogVisible: false,
      warehousename:'',
      stockId:null, //仓库id名
      persondata:[{
        label:'test1',
        id:1
      },{
        label:'test2',
        id:2
      },{
        label:'test3',
        id:3
      }],
      choosevalue:[]
    }
  },
  created() {
    this.getPersonData()
    this.$bus.on('changePerson', e => {
      this.editDialogVisible = true
      console.log('row传来的仓库信息',e)
      //this.warehousename = e.warehouse.name
      this.stockId = e.id
      this.getLinkedPerson(e.id)
    })
  },
  methods: {
    //拥有仓库管理权限的用户
    getPersonData(){
      let par={
        roleName:'仓库管理员'  ///////!!!!!!!!!
      }
      this.getByRole(par).then(res=>{
        if (res.data.code === 0){
          console.log('仓库用户',res)
          let msg =res.data.data
          this.persondata=[]
          for (let key of msg){
            let obj ={}
            obj.name = key.name
            obj.id = key.id //此为用户id标记
            this.persondata.push(obj)
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    //查找已经关联的仓库人员
    getLinkedPerson(Tid){
      let theStockId={
        stockId: Tid
      }
      this.$axios.post('/d/stockUser/getAllUserByStockId',theStockId).then(res=>{
        if (res.data.code === 0){
          //console.log('关联的用户',res)
          this.choosevalue=[]
          let linkedPerson = res.data.data
          for (let linkP of linkedPerson){
            this.choosevalue.push(linkP.users.id)
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    close() {
      this.editDialogVisible = false
    },
    //修改变动
    updateInfo() {
      let parm={
        stockId:this.stockId,
        userIds:this.choosevalue
      }
      this.$axios.post('/d/stockUser/set',parm).then(res=>{
        if (res.data.code === 0){
          this.$message.success('仓库人员成功配置')
          this.getLinkedPerson(this.stockId)
        }else {
          this.$message.error(res.data.message)
        }
      }).catch(err=>[
        console.log(err)
      ])
    },
    //详情查看
    looklist(){
      this.$router.push('/warehouse/warehousePerson')
      this.editDialogVisible =false
    }
  },
  destroyed() {
  }
}
</script>

<style scoped>
.editWarePerson {

}
.transfer{
display: flex;
  justify-content: center;
}
.transfer>>>.el-button--mini{
  margin: 0;
  position: absolute;
  left: 25%;
  top:5px;
}
</style>
