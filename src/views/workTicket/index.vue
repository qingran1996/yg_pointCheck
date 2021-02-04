<template>
  <div class="workTicket">
    <el-card class="box-card" shadow="always">
      <el-form :inline="true" :model="workTicketCheck" class="demo-form-inline">
<!--        <el-form-item label="工单编号">-->
<!--          <el-input v-model="workTicketCheck.code" placeholder="请输入内容" clearable/>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="作业票编号">-->
<!--          <el-input v-model="workTicketCheck.name" placeholder="请输入内容"  clearable/>-->
<!--        </el-form-item>-->
        <el-form-item label="作业票类型">
          <el-select v-model="workTicketCheck.deviceType" placeholder="请选择" clearable @change="typeCode">
            <el-option v-for="item in ticket_options" :key="item.id" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="作业票级别">
          <el-select v-model="workTicketCheck.jobWorkLevelCode" placeholder="请选择" clearable @change="deviceChange_level_show">
            <el-option v-for="item in ticket_level" :key="item.id" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="作业结束时间">-->
<!--          <el-input v-model="workTicketCheck.endTime" placeholder="请输入内容"  clearable/>-->
<!--        </el-form-item>-->
        <el-form-item label="状态">
          <el-select v-model="workTicketCheck.progress" placeholder="请选择" clearable @change="statusChange">
            <el-option v-for="item in ticket_progress" :key="item.id" :label="item.name" :value="item.code" />
          </el-select>
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
        <el-table-column type="index" label="序号" width="100" align="center" />
        <el-table-column v-for="item in listName" :key="item.name" :label="item.label" :prop="item.name" min-width="180" align="center"/>
        <el-table-column fixed="right" label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <div class="action">
              <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                <el-tag @click="lookList(scope.row)" type="success">详情</el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="block" style="margin-top:15px;">
        <el-pagination
          v-show="total!==0"
          align="center"
          :current-page="currentPage"
          :page-sizes="[10,15,20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <ticketDetail/>
  </div>
</template>

<script>
import ticketDetail from '@/views/workTicket/ticketDetail'
export default {
  components:{ticketDetail},
  data(){
    return{
      loading: false,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 152, // 表格高度
      currentPage: 1,
      pageSize: 10,
      total: 1,
      tableData: [{
        ticketCode: '作业票编号1234566',
        code: '工单编号9996',
        ticketType: '动火作业',
        ticketLevel: '一级',
        workHour: 3.5,
        applyDepName: '申请部门000',
        startTime: '2020-10-01',
        endTime:'2020-11-01',
        phone:'188888888'
      }],
      ticket_options: [{
        code: 'error ',
        id:999,
        name: '故障中....无法获取数据'
      }],
      ticket_progress: [{
        code: 'error',
        id:999,
        name: '故障中....无法获取数据'
      }],
      ticket_level:[{
        code: 'error',
        id:999,
        name: '故障中....无法获取数据'
      }],
      // 筛选
      workTicketCheck: {
        code: '',
        ticketCode: null,
        jobWorkTypeCode: null,
        jobWorkLevelCode:null,
        status:null
      },
      listName:[{
        label:'工单编号',
        name:'noteNo'
      },{
        label:'作业票类型',
        name:'jobTypeCodeName'
      },{
        label:'作业票级别',
        name:'jobLevelName'
      },{
        label:'作业时长(h)',
        name:'workHour'
      },{
        label:'申请单位',
        name:'applyDepName'
      },{
        label:'作业开始时间',
        name:'startTime'
      },{
        label:'作业结束时间',
        name:'endTime'
      },{
        label:'进程状态',
        name:'jwStatusName'
      }]
    }
  },
  created() {
    this.getTicketType() //获取作业票类型
    this.getTicketStatus() //获取工单状态
    this.getTicketLevel()
    this.getTableData()
  },
  methods:{
    // 状态
    statusChange(row) {
      if (row){
        this.workTicketCheck.status = parseInt(row)
      }else {
        this.workTicketCheck.status = null
      }
    },
    // 作业票级别
    deviceChange_level_show(row) {
      if (row){
        this.workTicketCheck.jobWorkLevelCode = row
      } else {
        this.workTicketCheck.jobWorkLevelCode = null
      }
    },
    // 作业票类型
    typeCode(row) {
      if (row){
        this.workTicketCheck.jobWorkTypeCode = row
      }else {
        this.workTicketCheck.jobWorkTypeCode = null
      }
    },
    // table详情
    lookList(row) {
      let item = row
      item.showDialog = true
      this.$bus.emit('ticketDetailChild',item)
    },
    // 查询按钮
    onSubmit() {
      if (this.workTicketCheck.jobWorkLevelCode === null && this.workTicketCheck.jobWorkTypeCode === null && this.workTicketCheck.status === null){
        this.getTableData()
      }else {
        this.pageSize = 10
        this.currentPage = 1
        this.axiosCheck()
      }
    },
    //check axios
    axiosCheck(){
      let checkParam={
        deploymentName:'jobWork',
        pageSize:this.pageSize,
        pageNo: this.currentPage,
        jobWorkTypeCode:this.workTicketCheck.jobWorkTypeCode,
        jobWorkLevelCode:this.workTicketCheck.jobWorkLevelCode,
        status:this.workTicketCheck.status
      }
      this.$axios.post('/w/jobWork/getWebJWListByColum',checkParam).then(res=>{
        if (res.data.code === 0){
          let msg2 = res.data.data.content
          this.tableData=[]
          this.pageSize = res.data.data.size
          this.currentPage = res.data.data.number+1
          this.total = res.data.data.totalElements
          for (let key of msg2){
            let obj={}
            obj.applyDepName = key.dataResponse.applyDepName
            obj.noteNo = key.dataResponse.noteNo //工单编号
            obj.jobTypeCode = key.dataResponse.jobTypeCode //作业类型
            obj.jobLevel = key.dataResponse.jobLevel //作业级别
            obj.jwStatus = key.dataResponse.jwStatus //作业票状态
            obj.workHour = key.dataResponse.planTimeLength //时长
            obj.jobLevelName = key.dataResponse.jobLevelName //作业级别名称
            obj.jobTypeCodeName = key.dataResponse.jobTypeCodeName //作业类型名称
            obj.taskName = key.taskResponse.taskName //任务进程判断2
            obj.jwStatusName = key.dataResponse.jwStatusName
            // if (obj.taskName){
            //   obj.jwStatusName = key.taskResponse.taskName //作业票状态名称
            // }else {
            //   obj.jwStatusName = key.dataResponse.jwStatusName //作业票状态名称
            // }
            obj.planStartTime = key.dataResponse.planStartTime //计划执行时间
            obj.startTime = this.formatDate(obj.planStartTime).split(' ')[0]
            obj.planEndTime = key.dataResponse.planEndTime //计划执行时间
            obj.endTime = this.formatDate(obj.planEndTime).split(' ')[0]
            obj.createTime = key.dataResponse.createTime //作业票创建时间
            obj.taskId = key.taskResponse.taskId //任务id
            obj.bussinessId = key.taskResponse.bussinessId //业务id
            obj.processInstanceId = key.taskResponse.processInstanceId //进程id
            this.tableData.push(obj)
          }
        }else {
          this.$message.error(res.data.message)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    //获取作业票类型
    getTicketType(){
      let par={
        parentCode:'jobTicketType'
      }
      this.getStateInfo(par).then(res=>{
        if (res.data.code ===0){
          this.ticket_options = res.data.data
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    //获取作业票级别
    getTicketLevel(){
      let par={
        parentCode:'jobLevel'
      }
      this.getStateInfo(par).then(res=>{
        if (res.data.code === 0){
          this.ticket_level = res.data.data
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    //获取工单状态
    getTicketStatus(){
      let par={
        parentCode:'jobTicketStatus'
      }
      this.getStateInfo(par).then(res=>{
        if (res.data.code ===0){
          this.ticket_progress = res.data.data
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    getTableData(){
      let par={
        deploymentName:'jobWork',
        pageSize:this.pageSize,
        pageNo:this.currentPage
      }
      this.$axios.post('/w/jobWork/getWebJWList',par).then(res=>{
        this.loading = true
        if (res.data.code === 0){
          console.log('列表展示',res)
          let msg = res.data.data.content
          this.tableData=[]
          this.pageSize = res.data.data.size
          this.currentPage = res.data.data.number+1
          this.total = res.data.data.totalElements
          for (let key of msg){
            let obj={}
            obj.applyDepName = key.dataResponse.applyDepName
            obj.noteNo = key.dataResponse.noteNo //工单编号
            obj.jobTypeCode = key.dataResponse.jobTypeCode //作业类型
            obj.jobLevel = key.dataResponse.jobLevel //作业级别
            obj.workHour = key.dataResponse.planTimeLength //时长
            obj.jobLevelName = key.dataResponse.jobLevelName //作业级别名称
            obj.jobTypeCodeName = key.dataResponse.jobTypeCodeName //作业类型名称
            obj.planStartTime = key.dataResponse.planStartTime //计划执行时间
            obj.startTime = this.formatDate(obj.planStartTime).split(' ')[0]
            obj.planEndTime = key.dataResponse.planEndTime //计划执行时间
            obj.jwStatus = key.dataResponse.jwStatus //作业票状态
            obj.endTime = this.formatDate(obj.planEndTime).split(' ')[0]
            obj.createTime = key.dataResponse.createTime //作业票创建时间
            obj.taskName = key.taskResponse.taskName //任务进行判断2
            if (obj.taskName){
              obj.jwStatusName = key.taskResponse.taskName //作业票状态名称
            }else {
              obj.jwStatusName = key.dataResponse.jwStatusName //作业票状态名称
            }
            obj.taskId = key.taskResponse.taskId //任务id
            obj.bussinessId = key.taskResponse.bussinessId //业务id
            obj.processInstanceId = key.taskResponse.processInstanceId //进程id
            this.tableData.push(obj)
          }
          this.loading = false
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
      this.currentPage = val
      this.getTableData()
    }
  },
  beforeDestroy() {
    this.$bus.off('this.ticketDetailChild')
  }
}
</script>

<style scoped>
.workTicket{
  padding: 10px;
}
</style>
