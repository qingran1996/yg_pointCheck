<template>
  <div class="warehouseInfo">
    <el-card shadow="always">
      <el-form :inline="true" :model="maintain" class="demo-form-inline">
        <el-form-item label="入库人">
          <el-input v-model="maintain.person" placeholder="请输入内容" @change="maintain_person" clearable/>
        </el-form-item>
        <el-form-item label="入库时间之后">
          <el-date-picker v-model="maintain.time" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  @change="maintain_show" />
        </el-form-item>
        <el-form-item label="入库类型" >
          <el-select v-model="maintain.type" @change="maintain_type" clearable>
            <el-option :value="1" label="采购入库"></el-option>
            <el-option :value="2" label="归还入库"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-row style="margin-bottom: 5px;">
        <el-button type="warning" :disabled="isPrint" @click="printCodes">打印条码</el-button>
      </el-row>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight" show-summary :summary-method="getSummaries" :row-key="getRowKeys" @selection-change="selectionchange">
        <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="100" align="center"/>
        <el-table-column
          v-for="item in listName"
          :key="item.name"
          :label="item.label"
          :prop="item.name"
          min-width="180"
          align="center"
        />
      </el-table>
      <div class="block" style="margin-top: 15px">
        <el-pagination align="center" style="margin-top: 15px;"
                       :current-page="pageNo"
                       :page-sizes="[5, 10, 15]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"/>
      </div>
      <div style="display: flex;justify-content: flex-end;">
        <el-button round class="exit" type="primary" @click="exit">返回备件管理</el-button>
        <el-button round class="exit" type="success" @click="goToOutput">查看出库记录</el-button>
      </div>
    </el-card>
    <printSparePartCode/>
  </div>
</template>

<script>
import printSparePartCode from '@/views/sparePart/warehouseInfo/printSparePartCode'
export default {
  components: {printSparePartCode},
  data() {
    return {
      loading: false,
      isPrint:true,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 270, // 表格高度
      pageNo:1,
      pageSize:10,
      total:10,
      tableData: [{
        count: '8',
        person: '赵四',
        time: '2019-8-1 08:00:00',
        remarks: '采购800个液位计'
      }],
      maintain: {
        person: '',
        time: '',
        type: ''
      },
      jsonData:{
        id:null,
        addType:null,
        startTime:'',
        endTime:''
      },
      chooseCodes:[],
      spareName:'',//备件名
      listName: [{
        label: '入库批次',
        name: 'addBatch'
      }, {
        label: '入库数量(+)',
        name: 'qty'
      },{
        label: '库存数量',
        name: 'lastQty'
      },{
        label: '仓库',
        name: 'stockName'
      },{
        label: '入库人',
        name: 'addUser'
      },{
        label: '入库类型',
        name: 'addTypeString'
      },{
        label: '备品备件条形码',
        name: 'sparePartBarCode'
      },{
        label: '入库说明',
        name: 'addDesc'
      }]
    }
  },
  created() {
    let result=JSON.parse(sessionStorage.getItem('warehouseInformation'))
    this.jsonData.id = result.id
    this.spareName = result.name
    //console.log(result)
    this.getTableData()
  },
  destroyed() {
    sessionStorage.removeItem('warehouseInformation')
    this.$bus.off('printCodes')
  },
  methods: {
    maintain_person(row){
      this.jsonData.addUser = row
    },
    maintain_show(row) {
      console.log(row)
      if (row){
        this.jsonData.startTime=this.formatDate(new Date(row[0]).getTime())
        this.jsonData.endTime=this.formatDate(new Date(row[1]).getTime())
      }else {
        this.jsonData.startTime=''
        this.jsonData.endTime=''
      }
    },
    maintain_type(row){
      this.jsonData.addType = row
    },
    onSubmit() {
     this.getTableData()
    },
    getRowKeys(row){
      return row.id
    },
    selectionchange(data){
      this.chooseCodes=[]
      this.isPrint = data.length === 0
      for (let j=0;j<data.length;j++){
        this.chooseCodes.push({
          spareName: this.spareName,
          addBatch: data[j].addBatch,
          sparePartBarCode :data[j].sparePartBarCode
        })
      }
      console.log(this.chooseCodes)
    },
    //打印条形码
    printCodes(){
      let row ={
        chooseCodes:this.chooseCodes,
        show:true
      }
     this.$bus.emit('printCodes',row)
    },
    //入库记录
    getTableData(){
      let par={
        id:this.jsonData.id,//备品备件id
        addUser:this.jsonData.addUser,
        addType:this.jsonData.addType,
        startTime:this.jsonData.startTime,
        endTime:this.jsonData.endTime,
        pageNo:this.pageNo,
        pageSize:this.pageSize
      }
      this.loading =true
      this.$axios.post('/d/sparePartApply/recordInList',par).then(res=>{
        if (res.data.code === 0){
          console.log(res)
          this.tableData=[]
          let msg =res.data.data.content
          for (let key of msg){
            let obj={}
            obj=key
            obj.addTypeString = key.addType ===1?'采购入库':'归还入库'
            this.tableData.push(obj)
          }
          this.total=res.data.data.totalElements
          this.pageSize=res.data.data.size
          this.pageNo=res.data.data.number+1
          this.loading =false
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    //合计展示
    getSummaries(param){
      //console.log('合计',param)
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[index] = '总计'
          return
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            //console.log('prev->',prev,'curr->', curr)
            const value = Number(curr);
            if (!isNaN(value)&&(index ===3||index ===4)) {
              return prev + curr;
            } else {
              return '';
            }
          }, 0);
          sums[index] += ' '
          //sums[index] = '+'+sums[index]
        } else {
          sums[index] = ' '
        }
      });

      return sums;
    },
    exit() {
      this.$router.push('/sparePart/sparePart_manage')
      sessionStorage.removeItem('warehouseInformation')
    },
    goToOutput(){
      this.$router.push('/sparePart/sparePart_outportInfo')
      sessionStorage.removeItem('warehouseInformation')
      let par={
        id:this.jsonData.id,
        desc:'来自入库跳转',
        name:this.spareName
      }
      sessionStorage.setItem('warehouseOutputInformation', JSON.stringify(par))
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getTableData()
    }
  }
}
</script>

<style scoped>
.warehouseInfo {
  padding: 10px;
}

.exit {
  margin-top: 2vh;
  margin-left: 3vw;
}
</style>
