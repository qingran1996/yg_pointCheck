<template>
  <div class="overview_four">
    <el-card shadow="always">
      <el-form :inline="true" :model="maintain" class="demo-form-inline">
        <el-form-item label="校验时间">
          <el-date-picker v-model="maintain.time" type="date" placeholder="选择日期" @change="maintain_show"/>
        </el-form-item>
        <el-form-item label="校验结果">
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
        <el-button type="primary" @click="addOverviewFour">新增</el-button>
        <el-button type="danger" :disabled="isDelete" @click="deleteItems">删除</el-button>
      </el-row>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight"  @selection-change="selectionchange" :row-key="getRowKeys" ref="tableCheck">
        <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="100" align="center" />
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
    <overview_fourEditDialog/>
  </div>
</template>

<script>
import overview_fourEditDialog from '../devicedetail/overview_fourEditDialog'
export default {
  name: 'OverviewFour',
  components: {overview_fourEditDialog},
  data() {
    return {
      loading: false,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 270, // 表格高度
      pageNo:1,
      pageSize:10,
      total:12,
      chooseIds:[],
      isDelete:true,
      tableData: [{
        deviceKks: '001',
        name: '存储1',
        mechanism: '张家港机构',
        apply: '王处长',
        createTime: '2019-8-1 08:00:00',
        result: '未维修'
      }],
      dName:'', // bus -> 监听获取:该设备名
      dCode:'', // bus -> 监听获取:该设备kks
      maintain: {
        time: '',
        radio: null
      },
      listName: [{
        label: '设备名称',
        name: 'name'
      }, {
        label: '设备位号',
        name: 'deviceKks'
      }, {
        label: '校验结果',
        name: 'examineResultsString'
      }, {
        label: '所属部门/校验机构',
        name: 'thirdPartyExamineString'
      }, {
        label: '校验人',
        name: 'examinePerson'
      }, {
        label: '校验时间',
        name: 'examineTimeString'
      }, {
          label: '下次校验时间',
          name: 'examineTimeNextString'
        }]
    }
  },
  created() {
    this.$bus.on('gotab',e=>{
      if (e.num === '4') {
        // console.log('4:',e)
        this.dName = e.data.name
        this.dCode = e.data.code
        this.getTableData()
      }
    })
    this.$bus.on('renderTableTwo',e=>{
      if (e === true){
        this.getTableData()
      }
    })
  },
  destroyed() {
    console.log('overview_four')
    this.$bus.off('editInfo4')
    this.$bus.off('add4')
    this.$bus.off('renderTableTwo')
  },
  methods: {
    maintain_show(row) {
      this.maintain.time = new Date(row).getTime()
    },
    onSubmit() {
      let checkPar={
        deviceKks: this.dCode,
        examineResults: this.maintain.radio,
        examineTime: this.maintain.time
      }
      this.$axios.post('/d/deviceExamine/getByKeyword',checkPar).then(res=>{
        if (res.data.code === 0){
          this.loading = true
          //console.log(res)
          let msg1 = res.data.data.content
          this.tableData = []
          this.pageNo = res.data.data.number + 1
          this.pageSize = res.data.data.size
          this.total = res.data.data.numberOfElements
          for (let key of msg1){
            let obj={}
            obj = key
            obj.name = this.dName
            obj.examineTimeString = this.formatDate(key.examineTime).split(' ')[0]
            obj.examineTimeNextString = this.formatDate(key.examineTimeNext).split(' ')[0]
            obj.examineResultsString = key.examineResults === 0?'未通过':'通过'
            obj.thirdPartyExamineString = key.thirdPartyExamine === 0?'本组织部门':'第三方校验机构'
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
    //删除操作
    deleteItems(){
      this.$confirm('确定删除这些信息吗?').then(()=>{
        let par={
          ids:this.chooseIds
        }
        this.$axios.post('/d/deviceExamine/delete',par).then(res=>{
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
    updateList(row) {
      this.$bus.emit('editInfo4',row)
    },
    addOverviewFour(){
      let pam={
        show:true,
        code:this.dCode //kks
      }
      this.$bus.emit('add4',pam)
    },
    //设备校验的数据展示
    getTableData(){
      let par = {
        deviceKks: this.dCode,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      this.$axios.post('/d/deviceExamine/query',par).then(res=>{
        if (res.data.code === 0){
          this.loading = true
          //console.log(res)
          let msg =res.data.data.content
          this.pageNo = res.data.data.number + 1
          this.pageSize = res.data.data.size
          this.total = res.data.data.numberOfElements
          this.tableData = []
          for (let key of msg){
            let obj ={}
            obj = key
            obj.name = this.dName
            obj.examineTimeString = this.formatDate(key.examineTime).split(' ')[0]
            obj.examineTimeNextString = this.formatDate(key.examineTimeNext).split(' ')[0]
            obj.examineResultsString = key.examineResults === 0?'未通过':'通过'
            obj.thirdPartyExamineString = key.thirdPartyExamine === 0?'本组织部门':'第三方校验机构'
            this.tableData.push(obj)
          }
          setTimeout(()=>{
            this.loading = false
          },200)
        }
      }).catch(err=>{
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
.overview_four {
	padding: 5px;
}
</style>
