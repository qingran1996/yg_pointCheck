<template>
  <div class="dictionaryChildren">
    <el-card shadow="always">
      <el-form :inline="true" :model="maintain" class="demo-form-inline">
        <el-form-item label="字典编码">
          <el-input v-model="maintain.code" placeholder="请输入内容" @change="maintain_show" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <h4> 父字典名称:{{parentName}}</h4>
      <el-row style="margin-bottom: 5px;">
        <el-button type="primary" @click="addDictionary">新增</el-button>
        <el-button type="danger" @click="deleteItems" :disabled="isDelete">删除</el-button>
      </el-row>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight"  @selection-change="selectionchange" :row-key="getRowKeys" ref="childrenTable">
        <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="100" align="center" />
        <el-table-column
          v-for="item in listName"
          :key="item.name"
          :label="item.label"
          :prop="item.name"
          min-width="180"
          align="center"
        />
        <el-table-column fixed="right" label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <div class="action">
              <el-tag @click="edit(scope.row)">编辑</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 15px">
        <el-pagination v-show="false"
                       align="center"
                       :current-page="currentPage"
                       :page-sizes="[5, 10, 15]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <childrenAdd/>
    <childrenEdit/>
  </div>
</template>

<script>
import childrenAdd from './dictionaryDialog/childrenAdd'
import childrenEdit from './dictionaryDialog/childrenEdit'
export default {
  components:{childrenAdd,childrenEdit},
  data() {
    return {
      loading: false,
      isDelete:true,
      chooseCode:[],
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 270, // 表格高度
      total: 6,
      pageSize: 5,
      currentPage: 1,
      parentCode:'',
      parentName:'',
      count:0,
      tableData: [{
        code: '001',
        name: '设备类型',
        createTime: '2019-8-1 08:00:00'
      }],
      maintain: {
        code: ''
      },
      listName: [{
        label: '字典编码',
        name: 'code'
      }, {
        label: '字典名称',
        name: 'name'
      }, {
        label: '创建时间',
        name: 'createTime'
      }]
    }
  },
  created() {
    this.createGetData()
    this.isDelete = true
    this.$bus.on('renderChildren',e=>{
      if (e === true){
        this.getTableData(this.parentCode)
      }
    })
  },
  methods:{
    maintain_show(row) {
      this.maintain.code = row
    },
    onSubmit(){
      if (this.maintain.code !==''){
        let checkPar={
          parentCode: this.parentCode,
          code:this.maintain.code
        }
        this.$axios.post('/u/dictionary/get',checkPar).then(res=>{
          if (res.data.code ===0){
            let msg1 =res.data.data
            //console.log(msg1)
            this.tableData = []
            let obj ={}
            obj.name = msg1.name //名字
            obj.code = msg1.code //编码
            obj.createTime = this.formatDate(msg1.createTime) //创建时间
            this.tableData.push(obj)
          }else {
            this.$message.error(res.data.message)
          }
        }).catch(err=>{
          console.log(err)
        })
      }else {
        this.getTableData(this.parentCode)
      }
    },
    getRowKeys(row){
      return row.name
    },
    selectionchange(data){
      this.chooseCode=[]
      this.isDelete = data.length === 0
      //console.log(data)
      for (let i=0;i<data.length;i++){
      this.chooseCode.push(data[i].code)
      }
      //console.log(this.chooseCode)
    },
    //批量删除
    deleteItems(){
      this.$confirm('确定删除所选的字典数据吗？').then(()=>{
        this.deleteItemsAxios()
      }).catch(err=>{
        console.log(err)
      })
    },
    //删除
    async deleteItemsAxios(){
       this.count =0
      for (let j=0;j<this.chooseCode.length;j++){
        let par={
          code:this.chooseCode[j],
          parentCode:this.parentCode
        }
        let result = await this.$axios.post('/u/dictionary/delete',par)
        console.log(result)
        if (result.data.code ===0){
          this.count = this.count+1
        }
      }
      if (this.count === this.chooseCode.length){
        this.getTableData(this.parentCode)
        this.$refs.childrenTable.clearSelection()
        return this.$message.success('成功删除')
      }else {
        this.getTableData(this.parentCode)
        this.$refs.childrenTable.clearSelection()
        return this.$message.warning('部分字典数据操作有误,无误的已经完成删除!')
      }
    },
    addDictionary(){
      let item={
        show:true,
        info:this.parentCode
      }
      this.$bus.emit('addDChildren',item)
    },
    edit(row){
      let item = row
      item.info = this.parentCode
      this.$bus.emit('editChildren',item)
    },
    getTableData(code){
      let par={
        parentCode:code
      }
      this.getStateInfo(par).then(res=>{
        this.loading = true
        if (res.data.code === 0){
          console.log(res)
          this.tableData=[]
          let msg =res.data.data
          for (let key of msg){
            let obj={}
            obj.name = key.name //名字
            obj.code = key.code //编码
            obj.createTime = this.formatDate(key.createTime) //创建时间
            this.tableData.push(obj)
          }
          this.loading = false
        }else {
          this.$message.error(res.data.message)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    createGetData(){
      let result=JSON.parse(sessionStorage.getItem('dictionaryChildren'))
      console.log(result)
      this.parentCode = result.code
      this.parentName = result.name
      if (result){
        this.getTableData(this.parentCode)
      }
    },
    handleSizeChange(val) {
      console.log(`size change :${val}`)
    },
    handleCurrentChange(val) {
      console.log(`current change :${val}`)
    }
  },
  destroyed() {
    sessionStorage.removeItem('dictionaryChildren')
    this.$bus.off('addDChildren')
    this.$bus.off('renderChildren')
    this.$bus.off('editChildren')
  }
}
</script>

<style scoped>
.dictionaryChildren {

}
</style>
