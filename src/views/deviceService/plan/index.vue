<template>
  <div class="deviceService_plan">
    <el-card shadow="always">
      <el-form :inline="true" :model="maintain" class="demo-form-inline">
        <el-form-item label="保养执行时间">
          <el-date-picker v-model="maintain.time" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                          type="daterange" @change="maintain_time" clearable/>
        </el-form-item>
        <el-form-item label="执行人">
          <el-input v-model="maintain.executor" clearable @change="maintain_show"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-row style="margin-bottom: 5px;">
        <el-button type="success" @click="servicePlan">保养计划</el-button>
      </el-row>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight">
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
              <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                <el-tag @click="lookList(scope.row)" type="warning">详情</el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="block" style="margin-top:15px;">
        <el-pagination
          align="center"
          :current-page="pageNo"
          :page-sizes="[10,15,20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <planDetailDialog/>
  </div>
</template>

<script>
import planDetailDialog from '@/views/deviceService/plan/planDetailDialog'

export default {
  name: 'deviceServicePlan',
  components: { planDetailDialog },
  data() {
    return {
      loading: true,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 270, // 表格高度
      total: 100,
      pageSize: 10,
      pageNo: 1,
      // 筛选
      maintain: {
        time: '',
        status: '',
        executor: ''
      },
      jsonData: {
        executor: '', //执行人
        pageNo: 1,
        startTime: '',
        endTime: '',
        pageSize: 10
      },
      tableData: [{
        name: '储罐1',
        assetCode: '001',
        content: '清洁清洁',
        beforePic: 'before',
        afterPic: 'after',
        executor: '谢天',
        executeTime: '2019-8-1 08:00:00',
        status: '待保养',
        result: '正常'
      }],
      listName: [{
        label: '设备名称',
        name: 'name'
      }, {
        label: '设备资产编号',
        name: 'assetCode'
      }, {
        label: '保养计划编号',
        name: 'planNum'
      }, {
        label: '保养内容',
        name: 'content'
      }, {
        label: '保养负责人',
        name: 'assigner'
      }, {
        label: '执行人',
        name: 'executor'
      }, {
        label: '保养执行时间',
        name: 'executeTime'
      }, {
        label: '预计保养时间',
        name: 'maintainTime'
      }, {
        label: '保养结果',
        name: 'result'
      }]
    }
  },
  methods: {
    maintain_show(row) {
      this.jsonData.executor = row
    },
    maintain_time(row) {
      if (row) {
        this.jsonData.startTime = new Date(row[0]).getTime()
        this.jsonData.endTime = new Date(row[1]).getTime()+86399*1000 //当天开始start 00:00:00 到 23:59:59 结束
      } else {
        this.jsonData.startTime = null
        this.jsonData.endTime = null
      }
      console.log(this.jsonData)
    },
    //查询
    onSubmit() {
      this.getTableData()
    },
    //详情
    lookList(item) {
      let obj = {
        msg: item.detail,
        show: true
      }
      this.$bus.emit('planList2', obj)
    },
    //保养计划---跳转
    servicePlan() {
      this.$router.push('/deviceService/plan/servicePlan')
    },
    //列表
    getTableData() {
      this.$axios.post('/d/maintainHistory/queryByExecutor', this.jsonData).then(res => {
        if (res.data.code === 0) {
          console.log('保养历史记录', res)
          this.tableData = []
          let msg2 = res.data.data.content
          this.pageSize = res.data.data.size
          this.total = res.data.data.totalElements
          this.pageNo = res.data.data.number + 1
          for (let key of msg2) {
            let arr = {}
            arr.maintainPlanId = key.maintainPlanId //保养计划的id
            arr.planNum = key.maintainPlan.planNum //保养计划编号
            arr.deviceId = key.deviceId //设备的id--详情查看时调用接口
            arr.name = key.device.deviceName //设备名
            arr.assetCode = key.device.assetCode //资产编号
            arr.content = key.maintainPlan.content //保养内容
            arr.assigner = key.assigner //保养负责人(指定人)
            arr.executor = key.executor //保养真正执行人
            arr.beforePic = key.beforeImagePath // 保养前图片path
            arr.afterPic = key.afterImagePath // 保养后图片path
            arr.executeTime = this.formatDate(key.executeTime).split(' ')[0] //真正执行时间
            arr.maintainTime = key.maintainTime //保养预计执行时间
            arr.resultType = key.resultType //保养结果 1:成功 2:异常
            arr.result = key.resultType === 1 ? '正常' : '异常'
            arr.detail = key //详情->信息
            this.tableData.push(arr)
          }
          this.loading = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.jsonData.pageSize = val
      this.getTableData()
      //console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.jsonData.pageNo = val
      this.getTableData()
      //console.log(`当前页: ${val}`)
    }
  },
  created() {
    this.getTableData()
  },
  destroyed() {
    this.$bus.off('planList2')
  }
}
</script>
<style scoped>
.deviceService_plan {
  padding: 10px;
}
</style>
