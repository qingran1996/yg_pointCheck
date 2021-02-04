<template>
 <div class="applyHistory">
   <el-card shadow="always">
     <el-form :inline="true" :model="maintain" class="demo-form-inline">
       <el-form-item label="领用类型">
         <el-select v-model="maintain.type" @change="maintain_type" clearable>
           <el-option label="维修" :value="1"/>
           <el-option label="保养" :value="2"/>
         </el-select>
       </el-form-item>
       <el-form-item label="维修/保养单号">
         <el-input v-model="maintain.orderNo" placeholder="请输入" @change="maintain_show" clearable/>
       </el-form-item>
       <el-form-item>
         <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
       </el-form-item>
     </el-form>
   </el-card>
   <el-card class="box-card" shadow="always">
     <el-row style="margin-bottom: 5px;">
     </el-row>
     <h3>备件名:{{spareName}}</h3>
     <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight">
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
     <el-pagination align="center" style="margin-top: 15px;"
                    :current-page="pageNo"
                    :page-sizes="[5, 10, 15]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
     />
     <div style="display: flex;justify-content: flex-end">
       <el-button round class="exit" type="primary" @click="exit">返回备件管理</el-button>
     </div>
   </el-card>
 </div>
</template>

<script>
export default {
  data(){
    return{
      loading: false,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 270, // 表格高度
      pageNo:1,
      pageSize:10,
      total:10,
      tableData: [{
        addBatch: '领用单号0123456',
        qty: '20',
        outUser: '张三',
        submitTime: '2020-7-1 10:30:00',
        applyDesc: '维修采购100个液位计',
        dealTime: '2020-9-1 10:00:00',
        type: '类型1',
        applyBarCode: '维修/保养单号0987654321'
      }],
      maintain: {
        type: null,
        orderNo: ''
      },
      spareName: '',
      jsonData: {
        id: null,
        applyTypeId:null, //维修(1)或保养(2)类型
        orderNo:'',//维修/保养单号
        startTime: '',
        endTime: ''
      },
      listName: [{
        label: '领用单号',
        name: 'applyBarCode'
      }, {
        label: '提交时间',
        name: 'submitTime'
      },{
        label: '审核时间',
        name: 'checkTimeString'
      },{
        label: '领用类型',
        name: 'applyTypeIdString'
      },{
        label: '维修/保养单号',
        name: 'orderNo'
      }, {
        label: '申领人',
        name: 'applyUser'
      }, {
        label: '申领数量',
        name: 'qty'
      }, {
        label: '申领说明',
        name: 'applyDesc'
      }]
    }
  },
  created() {
    let result = JSON.parse(sessionStorage.getItem('sparePartApplyHistory'))
    this.jsonData.id = result.id
    this.spareName = result.name
    //console.log(result)
    this.getTableData()
  },
  destroyed() {
    sessionStorage.removeItem('sparePartApplyHistory')
  },
  methods:{
    maintain_show(row) {
      this.jsonData.orderNo = row
    },
    maintain_type(row) {
      //console.log(row)
      this.jsonData.applyTypeId =row
    },
    onSubmit() {
      this.getTableData()
    },
    //获得出库详细信息
    getTableData() {
      let par = {
        id: this.jsonData.id,//备品备件id
        applyTypeId:this.jsonData.applyTypeId, //领用类型[1维修/2保养]
        orderNo:this.jsonData.orderNo,//维修单号
        startTime: this.jsonData.startTime,
        endTime: this.jsonData.endTime,
        pageNo:this.pageNo,
        pageSize:this.pageSize
      }
      this.loading = true
      this.$axios.post('/d/sparePartApply/applyList', par).then(res => {
        if (res.data.code === 0) {
          console.log('领用记录',res)
          this.tableData = []
          let msg = res.data.data.content
          for (let k of msg) {
            let obj = {}
            obj = k
            obj.submitTime = k.applyTime
            obj.submitTime = this.formatDate(obj.submitTime).split(' ')[0]
            if (k.checkTime === ''){
              obj.checkTimeString='————'
            }else {
              obj.checkTimeString = k.checkTime
              obj.checkTimeString = this.formatDate(obj.checkTimeString).split(' ')[0]
            }
            obj.applyTypeIdString =k.applyTypeId ===1?'维修':'保养'
            this.tableData.push(obj)
          }
          this.total=res.data.data.totalElements
          this.pageSize=res.data.data.size
          this.pageNo=res.data.data.number+1
          this.loading = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    exit() {
      this.$router.push('/sparePart/sparePart_manage')
      sessionStorage.removeItem('sparePartApplyHistory')
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

</style>
