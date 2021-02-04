<template>
  <div class="outInfo">
    <el-card shadow="always">
      <el-form :inline="true" :model="maintain" class="demo-form-inline">
        <el-form-item label="出库时间">
          <el-date-picker v-model="maintain.time" type="datetimerange" range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期" @change="maintain_time"/>
          </el-form-item>
        <el-form-item label="出库人">
          <el-input v-model="maintain.person" placeholder="请输入" @change="maintain_show" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-row style="margin-bottom: 5px;">
      </el-row>
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
        <el-button round class="exit" type="success" @click="goToOutput">查看入库记录</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  components: {},
  data() {
    return {
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
        time: '',
        person: ''
      },
      spareName: '',
      jsonData: {
        id: null,
        outUser: null,
        startTime: '',
        endTime: ''
      },
      listName: [{
        label: '领用批次',
        name: 'addBatch'
      }, {
        label: '备品备件',
        name: 'spareName'
      }, {
        label: '提交时间',
        name: 'submitTime'
      }, {
        label: '领用单号',
        name: 'applyBarCode'
      }, {
        label: '出库人',
        name: 'outUser'
      }, {
        label: '出库数量',
        name: 'qty'
      }, {
        label: '申领说明',
        name: 'applyDesc'
      }]
    }
  },
  created() {
    let result = JSON.parse(sessionStorage.getItem('warehouseOutputInformation'))
    this.jsonData.id = result.id
    this.spareName = result.name
    //console.log(result)
    this.getTableData()
  },
  destroyed() {
    sessionStorage.removeItem('warehouseOutputInformation')
  },
  methods: {
    maintain_show(row) {
      this.jsonData.outUser = row
    },
    maintain_time(row) {
      //console.log(row)
      if (row){
        this.jsonData.startTime=this.formatDate(new Date(row[0]).getTime())
        this.jsonData.endTime=this.formatDate(new Date(row[1]).getTime())
      }else {
        this.jsonData.startTime=''
        this.jsonData.endTime=''
      }
    },
    onSubmit() {
      this.getTableData()
    },
    //获得出库详细信息
    getTableData() {
      let par = {
        id: this.jsonData.id,//备品备件id
        outUser: this.jsonData.outUser,
        addType: this.jsonData.addType,
        startTime: this.jsonData.startTime,
        endTime: this.jsonData.endTime,
        pageNo:this.pageNo,
        pageSize:this.pageSize
      }
      this.loading = true
      this.$axios.post('/d/sparePartApply/recordOutList', par).then(res => {
        if (res.data.code === 0) {
          console.log(res)
          this.tableData = []
          let msg = res.data.data.content
          for (let k of msg) {
            let obj = {}
            obj = k
            obj.submitTime = k.createTime
            obj.submitTime = obj.submitTime.split(' ')[0]
            obj.spareName = this.spareName
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
      sessionStorage.removeItem('warehouseOutputInformation')
    },
    goToOutput(){
      this.$router.push('/sparePart/sparePart_warehouseInfo')
      sessionStorage.removeItem('warehouseOutputInformation')
      let par={
        id:this.jsonData.id,
        desc:'来自出库跳转',
        name:this.spareName
      }
      sessionStorage.setItem('warehouseInformation', JSON.stringify(par))
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
.outInfo {
  padding: 10px;
}

.exit {
  margin-top: 2vh;
  margin-left: 3vw;
}
</style>
