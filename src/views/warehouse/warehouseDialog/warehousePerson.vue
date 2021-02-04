<template>
    <div class="warehousePerson">
      <el-card class="box-card" shadow="always">
        <el-row style="margin-bottom: 15px;">
          <el-button icon="el-icon-back" @click="goback" circle></el-button>
<!--          <el-button type="primary" @click="editPerson" round>仓库人员变动</el-button>-->
        </el-row>
        <el-table v-loading="loading" :data="tableDataTrue" border style="width: 100%" :max-height="tableHeight" >
          <el-table-column type="index" label="序号" width="100" align="center"/>
          <el-table-column
            v-for="item in listName"
            :key="item.name"
            :label="item.label"
            :prop="item.name"
            min-width="180"
            align="center"
            show-overflow-tooltip/>
        </el-table>
<!--        <div class="block" style="margin-top:15px;">-->
<!--          <el-pagination-->
<!--            @size-change="handleSizeChange"-->
<!--            @current-change="handleCurrentChange"-->
<!--            :current-page="currentPage"-->
<!--            :page-sizes="[10, 15, 20]"-->
<!--            :page-size="pageSize"-->
<!--            layout="total, sizes, prev, pager, next, jumper"-->
<!--            :total="total"-->
<!--            align="center">-->
<!--          </el-pagination>-->
<!--        </div>-->
      </el-card>
    </div>
</template>

<script>
export default {
  data(){
    return{
      loading:true,
      tableDataTrue:[],
      tableData:[{
        code:'123',
        name:'张三',
        dept:'申请部门123',
        phone:'1888888'
      }], //信息表
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 270, // 表格高度
      currentPage: 1,
      pageSize: 5,
      total: 20,
      warehouse:'', //显示进入的仓库信息
      listName:[{
        label:'人员编号',
        name:'code'
      },{
        label:'人员姓名',
        name:'name'
      },{
        label:'部门',
        name:'dept'
      },{
        label:'联系电话',
        name:'phone'
      }]
    }
  },
  created() {
    this.warehouse=JSON.parse(sessionStorage.getItem('warehousePerson'))
    //console.log('人员创建',this.warehouse)
    this.getPesronData(this.warehouse.id)
  },
  methods:{
    async getPesronData(Tid){
      //仓库人相关信息初始化
      this.tableData =[]
      let theStockId={
        stockId: Tid
      }
      await this.$axios.post('/d/stockUser/getAllUserByStockId',theStockId).then(res=>{
        if (res.data.code === 0){
          //console.log('仓库人 ',res.data.data)
          const personData = res.data.data
          for (let key of personData){
            let arry={
              code: key.users.userName,
              name: key.users.name,
              userid: key.userId,
              stockId: key.stockId
            }
            this.tableData.push(arry)
          }
        }else {
          this.$message.error(res.data.message)
        }
        this.personDetail()
      }).catch(err=>{
        console.log('仓库人初始化失败->',err)
      })
    },
    //人员其他信息
    async personDetail(){
      for (let j =0;j<this.tableData.length;j++){
        let par={
          orgCode: "0",
          code:this.tableData[j].code
        }
        let res=await this.personData(par)
        //console.log(res.data.data.content)
        if (res.data.code === 0){
          let data = res.data.data.content
          this.tableData[j].dept =data[0].organization.name
          this.tableData[j].phone =data[0].phone
        }
      }
      console.log(this.tableData)
      this.tableDataTrue=null
      this.tableDataTrue =this.tableData
      setTimeout(()=>{
        this.loading = false
      },500)
    },
    goback(){
      this.$router.push('/warehouse/index')
      sessionStorage.removeItem('warehousePerson')
    },
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`)
      this.pageSize = val
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`)
      this.currentPage = val
    }
  },
  destroyed() {
    sessionStorage.removeItem('warehousePerson')
  }
}
</script>

<style scoped>
.warehousePerson{
  padding: 10px;
}
</style>
