<template>
  <div class="overview_three">
    <el-card shadow="always">
      <el-form :inline="true" :model="maintain" class="demo-form-inline">
        <el-form-item label="工单编号">
          <el-input v-model="maintain.code" placeholder="请输入内容" @change="maintain_show" clearable/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="maintain.status" placeholder="请输入内容" @change="maintain_show" clearable>
            <el-option v-for="item in optionList" :key="item.id" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
<!--      <el-row style="margin-bottom: 5px;">-->
<!--        <el-button type="success" @click="workTicket" :disabled="ticketShow">作业票详情</el-button>-->
<!--      </el-row>-->
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight">
        <el-table-column type="index" label="序号" width="100" align="center"/>
        <el-table-column
          v-for="item in listName"
          :key="item.name"
          :label="item.label"
          :prop="item.name"
          min-width="180"
          align="center"
          show-overflow-tooltip/>
        <el-table-column fixed="right" label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <div class="action">
              <el-tag type="warning" @click="showDetail(scope.row)">详情</el-tag>
              <!-- <el-tag @click="updateList(scope.row)">编辑</el-tag> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-if="pageShow">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
    <overview_threeEditDialog/>
  </div>
</template>

<script>
import overview_threeEditDialog from '../devicedetail/overview_threeEditDialog'

export default {
  name: 'OverviewThree',
  components: { overview_threeEditDialog },
  data() {
    return {
      loading: true,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 270, // 表格高度
      currentPage: 1,
      pageSize: 5,
      total: 20,
      pageShow: false, // 分页显示判断
      tableShow: true, // 表格显示判断
      //ticketShow: true, //作业票按钮能否点击
      tableData: [{
        deviceCode: '132DSDCASDF',
        workNoteNo: 'GD1328',
        problemContent: '出现了xxxx问题123456789123456789',
        applyerName: '王麻子',      // 申请人
        applyDepName: '王处长',    //申请部门
        applyTime: '2019-8-1 08:00:00',
        equipmentCode: '未维修',  // 维修结果
        workOrderStatus: '正常'   // 工作状态
      }],
      axiosData: [],
      maintain: {
        deviceCode: '',
        code: '',
        status: ''
      },
      // 状态选项 共6中状态
      optionList: [],
      listName: [
        {
          label: '工单编号',
          name: 'workNoteNo'
        },
        {
          label: '问题描述',
          name: 'problemContent'
        },
        {
          label: '申请人',
          name: 'applyerName'
        },
        {
          label: '申请部门',
          name: 'applyDepName'
        },
        {
          label: '申请时间',
          name: 'applyTime'
        },
        {
          label: '维修状态',
          name: 'workOrderStatus'
        },
        // {
        //   label: '维修人确认结果',
        //   name: 'processingResult'
        // },
        {
          label: '维修结果最终确认',
          name: 'lastProcessResultString'
        }
      ]
    }
  },
  created() {
    //this.$bus.off('gotab')
    this.$bus.$on('gotab', (e) => {
      //console.log(e)
      if (e.num === '3') {
        this.getData(e.data.id)
        this.getworkOrderState()
        //console.log(e.data.id)
      }
      setTimeout(() => {
          this.ticketShow = false
      }, 200)
    })

  },
  destroyed() {
    console.log('overview_three')
  },
  methods: {
    maintain_show() {
    },
    onSubmit() {
    },
    updateList(row) {
    },
    getData(Tid) {
      // 传参数 Tid 为pc端设备台账中的二维码id
      let params = {
        id: Tid
      }
      // 获取台账下的维修信息
      this.$axios.post('/w/equipmentMaintenanceBussiness/getEMRecordByDeviceId', params).then(res => {
        console.log('kkk',res)
        if (res.data.code === 0) {
          const msg = res.data.data.content
          this.total = res.data.data.numberOfElements
          this.pageSize =res.data.data.size
          this.currentPage = res.data.data.number + 1
          let dataArry = []   //所有数据的初步处理
          if (msg.length > 0) {
            this.axiosData = msg
            this.pageShow = true
            this.total = msg.length
            // console.log(msg.length)
            for (let key of msg) {
              key.applyTime = this.formatDate(key.applyTime)  //时间处理
              key.workOrderStatus = this.changeStatus(key.workOrderStatus)  //对于状态改变
              if ('processingResult' in key) {
                key.processingResult = key.processingResult === 0 ? '未修复' : '已修复'
              } else {
                key.processingResult = ''
              }
              if ('lastProcessResult' in key) {
                key.lastProcessResultString =this.lastStatus(key.lastProcessResult)
              } else {
                key.lastProcessResultString = ''
              }
              dataArry.push(key)
            }
            this.tableData = dataArry
          } else {
            this.tableShow = false
            this.tableData = []
            //console.log('没有数据')
          }
          this.loading = false
        } else {
          this.$message.error(res.data.message)
        }

      }, err => {
        console.log('<-- axios error -->', err)
      })
    },
    //作业票的配置
    // workTicket() {
    //   this.$router.push('/device/index/deviceOverview/workTicket')
    // },
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`)
      this.pageSize = val
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`)
      this.currentPage = val
    },
    //详情按钮
    showDetail(item) {
      console.log(item)
      let item1 = {
        status: item.workOrderStatus,
        show: true,
        msg: item
      }
      this.$bus.emit('threeDetails', item1)
    },
    //工单状态
    getworkOrderState(){
      let par={
        parentCode:'workOrderState'
      }
      this.getStateInfo(par).then(res=>{
        if (res.data.code === 0){
          console.log(res.data.data)
          this.optionList =res.data.data
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    //状态的判断
    changeStatus(val) {
      if (val === 1) {
        return '待确认'
      } else if (val === 2) {
        return '已确认'
      } else if (val === 3) {
        return '已驳回'
      } else if (val === 4) {
        return '未修复'
      } else if (val === 5) {
        return '已修复'
      } else {
        return '已关闭'
      }
    },
    //最终确认状态展示 0:  , 1:  ,  2:
    lastStatus(val){
      if (val === 0){
        return '未修复'
      }else if (val === 1){
        return '已修复'
      }else if (val === 2){
        return '无需维修'
      }
    }
  }
}
</script>
<style scoped>
.overview_three {
  padding: 5px;
}

.el-table__row {
  text-overflow: ellipsis;
}

.block>>>.el-pagination {
  display: flex;
  justify-content: center;
  padding: 0;
  margin-top: 10px;
}
</style>
