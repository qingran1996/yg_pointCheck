<template>
  <div class="overview_five">
    <el-card shadow="always">
      <el-form :inline="true" :model="maintain" class="demo-form-inline">
        <el-form-item label="验收时间">
          <el-date-picker v-model="maintain.time" type="date" placeholder="选择日期" @change="maintain_show"/>
        </el-form-item>
        <el-form-item label="验收结果">
          <el-select v-model="maintain.radio" clearable>
            <el-option label="未通过" :value="0"></el-option>
            <el-option label="通过" :value="1"></el-option>
            <el-option label="全部" :value="null"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-row style="margin-bottom: 5px;">
        <el-button type="primary" @click="addOverviewFive">新增</el-button>
        <el-button type="danger" :disabled="isDelete" @click="deleteItems">删除</el-button>
      </el-row>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight"  @selection-change="selectionchange" :row-key="getRowKeys" ref="tableCheck">
        <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="100" align="center"/>
        <el-table-column
          v-for="item in listName"
          :key="item.name"
          :label="item.label"
          :prop="item.name"
          min-width="180"
          align="center" show-overflow-tooltip
        />
        <el-table-column fixed="right" label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <div class="action">
              <el-tag @click="updateList(scope.row)">编辑</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top:15px;">
        <el-pagination v-show="total!==0" align="center" :current-page="pageNo" :page-sizes="[10,15,20]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"/>
      </div>
    </el-card>
    <overview_fiveEditDialog/>
  </div>
</template>

<script>
import overview_fiveEditDialog from '../devicedetail/overview_fiveEditDialog'

export default {
  name: 'OverviewFive',
  components: { overview_fiveEditDialog },
  data() {
    return {
      loading: false,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 270, // 表格高度
      pageNo:1,
      pageSize:10,
      total:12,
      isDelete:true,
      chooseIds:[], //删除数组
      tableData: [{
        deviceCode: '001',
        name: '存储1',
        personAcceptance: '王处长',
        acceptanceTime: '2019-8-1 08:00:00',
        acceptanceResults: '验收通过',
        contactNumber: '188888888'
      }],
      dName: '',
      dCode: '',
      maintain: {
        time: '',
        radio: null
      },
      listName: [{
        label: '设备名称',
        name: 'name'
      },
        {
          label: '设备位号',
          name: 'deviceCode'
        },
        {
          label: '验收结果',
          name: 'acceptanceResultsString'
        },
        {
          label: '验收人',
          name: 'personAcceptance'
        }, {
          label: '验收时间',
          name: 'acceptanceTimeString'
        }, {
          label: '联系电话',
          name: 'contactNumber'
        }
      ]
    }
  },
  created() {
    this.$bus.on('gotab', e => {
      if (e.num === '5') {
        this.dName = e.data.name
        this.dCode = e.data.code
        this.getTableData()
      }
    })
    this.$bus.on('refreshData',e=>{
      if (e === true){
        this.getTableData()
      }
    })
  },
  destroyed() {
    console.log('overview_five')
    this.$bus.off('editInfo5')
    this.$bus.off('add5')
    this.$bus.off('refreshData')
  },
  methods: {
    maintain_show(row) {
      this.maintain.time = new Date(row).getTime()
    },
    onSubmit() {
      let queryPar={
        acceptanceTime:this.maintain.time,
        deviceKks: this.dCode,
        acceptanceResults:this.maintain.radio
      }
      this.$axios.post('/d/deviceAcceptance/getByKeyword',queryPar).then(res=>{
        if (res.data.code === 0){
          this.loading = true
          //console.log(res)
          let msg1 = res.data.data.content
          this.tableData = []
          this.pageNo = res.data.data.number + 1
          this.pageSize = res.data.data.size
          this.total = res.data.data.numberOfElements
          for (let key of msg1) {
            let obj = {}
            obj = key
            obj.acceptanceTimeString = this.formatDate(key.acceptanceTime).split(' ')[0]
            obj.acceptanceResultsString = key.acceptanceResults === 0?'未通过':'通过'    //0:未通过 1:通过
            obj.deviceCode = key.deviceKks //设备位号
            obj.name = this.dName //设备
            this.tableData.push(obj)
          }
          setTimeout(()=>{
            this.loading = false
          },200)
        }else {
          this.$message.error(res.data.message)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    updateList(row) {
      this.$bus.emit('editInfo5', row)
    },
    addOverviewFive() {
      let pam = {
        show: true,
        code: this.dCode
      }
      this.$bus.emit('add5', pam)
    },
    getRowKeys(row){
      return row.id
    },
    selectionchange(data) {
      //console.log(data)
      this.chooseIds=[]
      this.isDelete = data.length ===0
      for (let i =0;i<data.length;i++){
        this.chooseIds.push(data[i].id)
      }
      console.log(this.chooseIds)
    },
    //删除按钮
    deleteItems(){
      this.$confirm('确定删除这些信息吗?').then(()=>{
        let par={
          ids:this.chooseIds
        }
        this.$axios.post('/d/deviceAcceptance/delete',par).then(res=>{
          if (res.data.code === 0){
            this.$message.success('成功删除')
            this.pageSize = 10
            this.pageNo = 1
            this.$refs.tableCheck.clearSelection()
            this.getTableData()
          }else {
            this.$message.error(res.data.message)
            this.$refs.tableCheck.clearSelection()
          }
        }).catch(err=>{
          console.log(err)
        })
      },()=>{
        this.$message('已取消删除')
      })
    },
    //初始列表展示
    getTableData() {
      let par = {
        deviceKks: this.dCode,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      this.$axios.post('/d/deviceAcceptance/query', par).then(res => {
        if (res.data.code === 0) {
          this.loading = true
          console.log(res)
          let msg = res.data.data.content
          this.tableData = []
          this.pageNo = res.data.data.number + 1
          this.pageSize = res.data.data.size
          this.total = res.data.data.numberOfElements
          for (let key of msg) {
            let obj = {}
            obj = key
            obj.acceptanceTimeString = this.formatDate(key.acceptanceTime).split(' ')[0]
            obj.acceptanceResultsString = key.acceptanceResults === 0?'未通过':'通过'    //0:未通过 1:通过
            obj.deviceCode = key.deviceKks //设备位号
            obj.name = this.dName //设备
            this.tableData.push(obj)
          }
          setTimeout(()=>{
            this.loading = false
          },200)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`)
      this.pageNo = val
      this.getTableData()
    }
  }
}
</script>
<style scoped>
.overview_five {
  padding: 5px;
}
</style>
