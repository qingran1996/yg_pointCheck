<template>
  <div class="deviceLinkPlan">
    <el-card class="box-card" shadow="always">
      <el-col :span="18">
        <el-row style="margin-bottom: 5px;">
          <el-button type="success" :disabled="isDelete" @click="setServicePlan" v-prevent-re-click>配置保养计划</el-button>
        </el-row>
        <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight"
                  @selection-change="selectionchange" :row-key="getRowKeys" ref="serviceTable" height="300">
          <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"/>
          <el-table-column v-for="item in listName" :key="item.name" :label="item.label" :prop="item.name"
                           min-width="140" show-overflow-tooltip
                           align="center"/>
        </el-table>
        <!-- 分页器 -->
        <div class="block" style="margin-top:15px;margin-bottom: 5px;">
          <el-pagination
            v-show="total!==0"
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
      </el-col>
      <el-col :span="6">
        <div style="margin-left: 10px;">
          <el-row style="display: flex;justify-content: center;">
            <el-button type="danger" @click="deleteServicePlan" :disabled="planDelete">取消保养计划</el-button>
          </el-row>
          <div class="deleteLink" :style="{height:tagHeight}">
            <span style="color: #409EFF;margin-bottom: 10px;display: flex;justify-content: center;margin-top: 15px;">已选计划</span>
            <div style="display: flex;justify-content: center;">
              <el-checkbox-group v-model="checkList" @change="watchCheckList">
                <el-checkbox v-for="item in planData" :key="item.maintainPlanId" :label="item.maintainPlan.planNum"/>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </el-col>
    </el-card>
    <setPlanTime/>
  </div>
</template>

<script>
import setPlanTime from '@/views/device/device/devicedetail/setPlanTime'
export default {
  props: {
    planset: Object //父传子 属性
  },
  components:{setPlanTime},
  data() {
    return {
      loading: true,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 152 +'px', // 表格高度
      tagHeight: document.body.clientHeight * 0.45 - 50 - 42 - 15 - 61 - 70 + 'px',
      pageNo: 1,
      pageSize: 10,
      total: 6,
      deviceId:null, //设备id
      chooseId: [], //配置保养选项数组
      choosePlans:[], //配置保养计划数组
      isDelete: true, //配置按钮是否可用
      planDelete: true,//删除按钮是否可用
      checkList: [], //选中的保养计划
      checkId: [], //选中计划相对应的id
      tableData: [{
        code: '计划编号9996',
        serviceLevel: '一级',
        serviceContent: '清洁润滑巴拉巴拉',
        workHour: 3.5,
        rate: 3,
        cycle: '月',
        nextTime: '2021-01-01'//这个字段放置ing
      }],
      jsonData: { // 数据列表请求体
        pageNo: 1,
        pageSize: 10
      },
      planData: null,//已经绑定的相应的保养内容
      service_options: [{
        code: '01',
        name: '一级保养',
        id: 1
      }],
      // 筛选
      servicePlan: {
        code: '',
        level: ''
      },
      listName: [{
        label: '计划编号',
        name: 'code'
      }, {
        label: '保养标题',
        name: 'serviceLevel'
      }, {
        label: '保养内容',
        name: 'serviceContent'
      }, {
        label: '预计保养时间(h)',
        name: 'workHour'
      }, {
        label: '保养频率',
        name: 'rate'
      }, {
        label: '保养周期',
        name: 'cycle'
      }]
    }
  },
  created() {
    this.getTableData()
    //this.getDicData()
    //console.log(this.planset)
    this.getBindServicePlan(this.planset.id)
    this.deviceId = this.planset.id
    this.$bus.on('setFinished',e=>{
      if (e ==='renderAgain'){
        this.getBindServicePlan(this.planset.id)
        this.$refs.serviceTable.clearSelection()
      }
    })
  },
  watch: {
    planset(val, old) {
      //console.log(val,old)
      if (val !== old) {
        this.getBindServicePlan(this.planset.id)
        this.deviceId = this.planset.id
      }
    }
  },
  destroyed() {
    this.$bus.off('setPlanTime')
    this.$bus.off('setFinished')
  },
  methods: {
    //保养计划数据获取
    getTableData() {
      this.$axios.post('/d/maintainPlan/query', this.jsonData).then(res => {
        if (res.data.code === 0) {
          //console.log('保养计划列表', res.data.data)
          let msg = res.data.data.content
          this.tableData = []
          for (let key of msg) {
            let obj = {}
            obj.index = key.planNum + this.jsonData.pageNo // 触发删除时用的
            obj.id = key.id //计划编号id
            obj.code = key.planNum //计划编号
            obj.serviceContent = key.content //保养内容
            obj.rate = key.frequency //频率
            obj.workHour = key.time //保养时间
            obj.serviceLevel = key.title //保养标题
            obj.cycleType = key.frequencyType // 保养周期类型 1:日 2:周(7天) 3:月(30天)
            if (obj.cycleType === 1) {
              obj.cycle = '日'
            } else if (obj.cycleType === 2) {
              obj.cycle = '周'
            } else {
              obj.cycle = '月(30天)'
            }
            this.tableData.push(obj)
          }
          this.pageSize = res.data.data.size //每页信息数量
          this.total = res.data.data.totalElements //总数
          setTimeout(() => {
            this.loading = false
          }, 250)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //查询这个设备现在已经绑定的保养计划
    getBindServicePlan(Tid) {
      let par = {
        deviceId: Tid
      }
      this.$axios.post('/d/maintainDeviceLink/queryByDeviceId', par).then(res => {
        if (res.data.code === 0) {
          //console.log('设备已绑定计划', res)
          this.planData = res.data.data.content
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getRowKeys(row) {
      //console.log(row)
      return row.index
    },
    selectionchange(data) {
      this.chooseId = [] //每次选择重置批量
      this.choosePlans = []
      this.isDelete = data.length === 0
      //console.log(data)
      for (let i = 0; i < data.length; i++) {
        let objT =data[i]
        objT.maintainTime=new Date().getTime()
        this.chooseId.push(data[i].id)
        this.choosePlans.push(objT)
      }
      console.log(this.choosePlans)
    },
    //配置保养计划
    setServicePlan() {
      let row={
        deviceId:this.deviceId,
        show:true,
        info:this.choosePlans
      }
      this.$bus.emit('setPlanTime',row)
    },
    //取消配置计划
    deleteServicePlan() {
      this.axiosdeleteServicePlan().then(res => {
        console.log(res)
        if (!res) {
          this.$message.success('成功取消绑定')
          this.checkId = []
          this.checkList = []
          this.planDelete = true
          this.getBindServicePlan(this.planset.id)
        } else {
          this.$message.error(res)
          this.$nextTick(() => {
            this.checkId = []
            this.checkList = []
            this.planDelete = true
            this.getBindServicePlan(this.planset.id)
          })
        }
      }, reject => {
        console.log(reject)
      }).catch(err => {
        console.log(err)
      })
    },
    ///取消配置计划 axios
    async axiosdeleteServicePlan() {
      let msg = ''
      try {
        for (let j = 0; j < this.checkId.length; j++) {
          let deletePar = {
            deviceId: this.planset.id,
            maintainPlanId: this.checkId[j]
          }
          let result = await this.$axios.post('/d/maintainDeviceLink/delete', deletePar)
          if (result.data.code !== 0) {
            msg = msg + result.data.message + ' '
          }
        }
      } catch (e) {
        console.log(e)
      }
      return msg.length > 0 ? msg : null
    },
    //多选框内选择情况
    watchCheckList(val) {
      //console.log('checkList',val)
      this.checkId = []
      if (val.length > 0) {
        this.planDelete = false
        for (let i = 0; i < val.length; i++) {
          let found = this.planData.find(item => item.maintainPlan.planNum === val[i])
          if (found) {
            this.checkId.push(found.maintainPlanId)
          }
        }
      } else {
        this.planDelete = true
      }
      //console.log('取消id',this.checkId)
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
  }
}
</script>

<style scoped>
.deleteLink {
  overflow-y: scroll;
  border: 1px solid #c7cbcc;
  padding-left: 15px;
  opacity: 0.8;
  margin-top: 5px;
}
</style>
