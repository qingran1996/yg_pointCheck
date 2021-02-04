<template>
  <div class="deviceService_task">
<!--    <el-card shadow="always" >-->
<!--      <el-form :inline="true" :model="maintain" class="demo-form-inline">-->
<!--        <el-form-item label="设备">-->
<!--          <el-input v-model="maintain.device" placeholder="请输入设备名称" clearable/>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-button size="small" type="primary" @click="onSubmit">查询</el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--    </el-card>-->
    <el-card class="box-card" shadow="always">
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="OnlyId">
        <el-table-column label="设备" width="140" align="center" prop="deviceName" show-overflow-tooltip fixed/>
        <el-table-column v-for="item in listName" :key="item.name" :label="item.label" :fixed="item.sfix"
                         :prop="item.name" width="280" align="center">
          <template slot-scope="scope" v-if="item.sd">
            <div v-if="item.st">
              <p>保养计划编号:<b style="color: red;">{{ scope.row.planNum }}</b>,待保养</p>
              <el-tag type="success" effect="dark" v-show="scope.row.showTempContent" @click="setPeople(scope.row)">
                指派人员
              </el-tag>
              <el-badge :value="scope.row.badge" v-show="scope.row.showTempContent">
              <el-tag effect="dark"  @click="detailOne(scope.row)">详情</el-tag>
              </el-badge>
              <el-badge :value="scope.row.badge" class="item" v-show="!scope.row.showTempContent">
                <el-tag effect="dark" @click="detailTwo(scope.row)">详情</el-tag>
              </el-badge>
            </div>
            <div v-if="!item.st">{{ scope.row.nextContent }}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <setPerson/>
    <detailOne/>
    <detailTwo/>
  </div>
</template>

<script>
import setPerson from './setPerson'
import detailTwo from './detailTwo'
import detailOne from './detailOne'

export default {
  name: 'deviceServiceTask',
  components: { setPerson, detailTwo, detailOne },
  data() {
    return {
      maintain: {
        time: [],
        device: ''
      },
      loading: true,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 180, // 表格高度
      tableData: [{
        deviceName: 'name1'
      }],
      nowTime: null,//今天的时间
      weekAterTime: null,//7天后时间
      planSteartTime: null,//计划开始时间
      jsonData: {},
      todayTime: new Date(), //当前的时间(动态列表名)
      listName: [{
        label: '2020',
        name: 'date1'
      }]
    }
  },
  methods: {
    //查询按钮
    // onSubmit() {
    //   this.jsonData.deviceName =this.maintain.device
    //   //console.log(this.maintain.device)
    //   this.getTableData()
    // },
    //获取任务进行时
    getTableData() {
      this.loading = true
      this.$axios.post('/d/MaintainRuTask/query', this.jsonData).then(res => {
        if (res.data.code === 0) {
          console.log('数据获取', res.data.data)
          let msgData = res.data.data
          this.tableData = []
          for (let key of msgData) {
            let obj = {}
            let PlanList={}
            obj.deviceName = key.device.deviceName
            obj.deviceId = key.device.id
            obj.children = []
            for (let j = 0;j<key.maintainRuTaskList.length;j++){
              PlanList =key.maintainRuTaskList[j]
              //console.log(PlanList) //第二层数组
              if (j === 0){
                obj.planId = PlanList.maintainPlan.id
                obj.OnlyId =PlanList.maintainLinkId + `c${PlanList.maintainPlan.id}`+(1+j)*(Math.random()) //table 中每条数据唯一id辨识
                obj.planNum=PlanList.maintainPlan.planNum
                obj.mPlan =PlanList.maintainPlan
                obj.maintainTime = PlanList.maintainTime
                obj.executor = PlanList.executor //指派执行人
                obj.contentTwoShow =true
                obj.badge = '未分配'
                if(PlanList.maintainTime === this.formatDate(this.nowTime).split(' ')[0]){
                  obj.showTempContent = true //当天执行的时候，在之后7天是否有文字展示 ,true
                  //开始渲染未来的预计时间 1-天 2-周 3-月
                  if(PlanList.maintainPlan.frequencyType === 1){ //判断频率
                    obj.nextContent = '下次保养(预计):' + this.formatDate((new Date(PlanList.maintainTime).getTime() / 1000 + 24 * 3600 * PlanList.maintainPlan.frequency) * 1000).split(' ')[0]
                  }else if (PlanList.maintainPlan.frequencyType === 2){
                    obj.contentTwoShow = false
                    obj.nextContent = '下次保养(预计):' + this.formatDate((new Date(PlanList.maintainTime).getTime() / 1000 + 24 * 3600 * PlanList.maintainPlan.frequency) * 1000).split(' ')[0]
                  }else if (PlanList.maintainPlan.frequencyType === 3){
                    obj.contentTwoShow = false
                    obj.nextContent = '下次保养(预计):' + this.formatDate((new Date(PlanList.maintainTime).getTime() / 1000 + 24 * 3600 * PlanList.maintainPlan.frequency) * 1000).split(' ')[0]
                  }
                  obj.badge = obj.executor===''?'未分配':''
                }else { //不一样，则就是之前有未执行的保养信息
                  obj.badge = obj.executor===''?'未保养':'保养仍未执行'
                  obj.showTempContent = false
                  obj.nextContent = ''
                }
              }else {
                let sThing={
                  deviceId: key.device.id,
                  deviceName: key.device.deviceName,
                  planId: PlanList.maintainPlan.id,
                  OnlyId: PlanList.maintainLinkId + `c${PlanList.maintainPlan.id}`+(1+j)*(Math.random()),//table 中每条数据唯一id辨识
                  planNum: PlanList.maintainPlan.planNum,
                  contentTwoShow: true, //当天执行的时候，在之后7天是否有文字展示 ,true
                  mPlan: PlanList.maintainPlan,
                  maintainTime: PlanList.maintainTime,
                  executor:PlanList.executor,
                  sThing:'未分配'
                }
                if(PlanList.maintainTime === this.formatDate(this.nowTime).split(' ')[0]){
                  sThing.showTempContent = true //当天执行的时候，在之后7天是否有文字展示 ,true
                  //开始渲染未来的预计时间 1-天 2-周 3-月
                  if(PlanList.maintainPlan.frequencyType === 1){ //判断频率
                    sThing.nextContent = '下次保养(预计):' + this.formatDate((new Date(PlanList.maintainTime).getTime() / 1000 + 24 * 3600 * PlanList.maintainPlan.frequency) * 1000).split(' ')[0]
                  }else if (PlanList.maintainPlan.frequencyType === 2){
                    sThing.contentTwoShow = false
                    sThing.nextContent = '下次保养(预计):' + this.formatDate((new Date(PlanList.maintainTime).getTime() / 1000 + 24 * 3600 * PlanList.maintainPlan.frequency) * 1000).split(' ')[0]
                  }else if (PlanList.maintainPlan.frequencyType === 3){
                    sThing.contentTwoShow = false
                    sThing.nextContent = '下次保养(预计):' + this.formatDate((new Date(PlanList.maintainTime).getTime() / 1000 + 24 * 3600 * PlanList.maintainPlan.frequency) * 1000).split(' ')[0]
                  }
                  sThing.badge = sThing.executor===''?'未分配':''
                }else { //不一样，则就是之前有未执行的保养信息
                  sThing.badge = sThing.executor===''?'未保养':'保养仍未执行'
                  sThing.showTempContent = false
                  sThing.nextContent = ''
                }
                obj.children.push(sThing)
              }
            }
            this.tableData.push(obj)
          }
          console.log(this.tableData)
          this.loading = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //指定人员
    setPeople(row) {
      let item = row
      item.show = true
      this.$bus.emit('setPerson', item)
    },
    //详情
    detailOne(row) {
      let item = row
      item.show = true
      this.$bus.emit('lookDetailOne', item)
    },
    //未保养计划详情
    detailTwo(row) {
      let item = row
      item.show = true
      this.$bus.emit('lookDetailTwo', item)
    },
    //给时间列表名赋值
    getList() {
      let currentDate = this.todayTime.getTime()
      this.nowTime = currentDate //当天时间
      this.weekAterTime = currentDate + 3600 * 1000 * 6 * 24 //一周后时间
      //console.log(Math.floor(this.nowTime/1000),this.weekAterTime/1000)
      this.listName = [{
        label: this.formatDate(currentDate).split(' ')[0] + '(当天)',
        name: 'date1',
        sfix: true, //当天的固定
        sd: true, //template 只在当天一栏的展示 show day
        st: true  //template下 展示 什么内容 true(执行计划设置)  false(纯文字) show template
      }, {
        label: this.formatDate(currentDate + 3600 * 1000 * 24).split(' ')[0],
        name: 'date2',
        sfix: false,
        sd: false,
        st: false
      }, {
        label: this.formatDate(currentDate + 3600 * 1000 * 2 * 24).split(' ')[0],
        name: 'date3',
        sfix: false,
        sd: false,
        st: false
      }, {
        label: this.formatDate(currentDate + 3600 * 1000 * 3 * 24).split(' ')[0],
        name: 'date4',
        sfix: false,
        sd: false,
        st: false
      }, {
        label: this.formatDate(currentDate + 3600 * 1000 * 4 * 24).split(' ')[0],
        name: 'date5',
        sfix: false,
        sd: false,
        st: false
      }, {
        label: this.formatDate(currentDate + 3600 * 1000 * 5 * 24).split(' ')[0],
        name: 'date6',
        sfix: false,
        sd: false,
        st: false
      }, {
        label: this.formatDate(currentDate + 3600 * 1000 * 6 * 24).split(' ')[0],
        name: 'date7',
        sfix: false,
        sd: false,
        st: false
      }, {
        label: '下次预计保养时间',
        name: 'date8',
        sfix: 'right', //固定在最右侧
        sd: true,
        st: false
      }]
    },
    //时间赋值
    setTimePicker() {
      this.maintain.time[0] = this.formatDate(this.nowTime).split(' ')[0]
      this.maintain.time[1] = this.weekAterTime(this.nowTime).split(' ')[0]
    }
  },
  created() {
    this.getTableData()
    //给listName动态赋值
    this.getList()
  },
  mounted() {
    this.$bus.on('renderService',e=>{
      if (e === true){
        this.getTableData()
      }
    })
  },
  destroyed() {
    this.$bus.off('setPerson')
    this.$bus.off('lookDetailTwo')
    this.$bus.off('lookDetailOne')
    this.$bus.off('renderService')
  }
}
</script>
<style scoped>
.deviceService_task {
  padding: 10px;
}
</style>
