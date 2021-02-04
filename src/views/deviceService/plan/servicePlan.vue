<template>
  <div class="servicePlan">
    <el-card class="box-card" shadow="always">
      <el-form :inline="true" :model="servicePlan" class="demo-form-inline">
        <el-form-item label="计划编号">
          <el-input v-model="servicePlan.code" placeholder="请输入内容" @change="deviceChange_code_show" clearable/>
        </el-form-item>
        <!--        <el-form-item label="保养级别">-->
        <!--          <el-select v-model="servicePlan.level" placeholder="请输入内容" clearable>-->
        <!--            <el-option v-for="item in service_options" :key="item.id" :label="item.name" :value="item.code"/>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit" v-prevent-re-click>查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-row style="margin-bottom: 5px;">
        <el-button type="primary" @click="addPlan">新增</el-button>
        <el-button type="danger" @click="deletePlan" :disabled="isDelete">批量删除</el-button>
      </el-row>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight"
                @selection-change="selectionchange" :row-key="getRowKeys" ref="serviceTable">
        <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="100" align="center"/>
        <el-table-column v-for="item in listName" :key="item.name" :label="item.label" :prop="item.name" min-width="180"
                         align="center" show-overflow-tooltip/>
        <el-table-column fixed="right" label="操作" min-width="220" align="center">
          <template slot-scope="scope">
            <div class="action">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <el-tag @click="editPlan(scope.row)">编辑</el-tag>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <el-popover placement="left" width="400" trigger="click" :ref="`popover-${scope.$index}`">
                  <p>确定删除这个计划： <b style="color: red">{{ scope.row.code }}</b> 的信息吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消
                    </el-button>
                    <el-button type="primary" size="mini" @click="deleteItem(scope.row)">确定</el-button>
                  </div>
                  <el-tag slot="reference" type="danger">删除</el-tag>
                </el-popover>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="已绑设备" placement="bottom">
                <el-tag type="success" @click="bindedDevice(scope.row)">已绑设备</el-tag>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                <el-tag type="warning" @click="lookDetail(scope.row)">详情</el-tag>
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
    <overview_twoEditDialog/>
    <serviceDetailDialog/>
    <bindDevice/>
  </div>
</template>

<script>
import overview_twoEditDialog from '@/views/deviceService/plan/planDialog/overview_twoEditDialog'
import serviceDetailDialog from '@/views/deviceService/plan/planDialog/serviceDetailDialog'
import bindDevice from '@/views/deviceService/plan/planDialog/bindDevice'
export default {
  components: { overview_twoEditDialog, serviceDetailDialog, bindDevice },
  data() {
    return {
      loading: true,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 152, // 表格高度
      pageNo: 1,
      pageSize: 10,
      total: 6,
      chooseId: [], //删除选项数组
      isDelete: true, //删除按钮是否可用
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
    this.getDicData()
    this.$bus.on('serviceRender', e => {
      if (e === true) {
        this.getTableData()
      }
    })
  },
  methods: {
    // 设备编号输入
    deviceChange_code_show() {

    },
    // 设备名称输入
    deviceChange_name_show() {

    },
    // 变更时间选择
    deviceChange_time_show() {

    },
    //保养计划数据获取
    getTableData() {
      this.$axios.post('/d/maintainPlan/query', this.jsonData).then(res => {
        if (res.data.code === 0) {
          console.log('保养计划列表', res.data.data)
          let msg = res.data.data.content
          this.tableData = []
          for (let key of msg) {
            let obj = {}
            obj.index = key.planNum + this.jsonData.pageNo // 触发删除时用的
            obj.code = key.planNum //计划编号
            obj.id = key.id //计划id
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
    //字典里获取保养级别
    getDicData() {
      let parm = {
        parentCode: 'maintenance'
      }
      this.getStateInfo(parm).then(res => {
        if (res.data.code === 0) {
          //console.log('字典保养级别信息',res)
          this.service_options = res.data.data
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
      this.isDelete = data.length === 0
      console.log(data)
      for (let i = 0; i < data.length; i++) {
        this.chooseId.push(data[i].code)
      }
    },
    //编辑
    editPlan(item) {
      item.service_options = this.service_options
      this.$bus.emit('edit2', item)
    },
    //新增按钮
    addPlan() {
      let item = {
        ps: true,
        service_options: this.service_options
      }
      this.$bus.emit('add2', item)
    },
    //批量删除按钮
    deletePlan() {
      return this.$confirm('是否删除选中的保养计划？<b style="color: red">注意:删除后会导致-计划与所有已绑定的设备失去关联!</b>',{
        dangerouslyUseHTMLString: true
      }).then(() => {
        for (let i = 0; i < this.chooseId.length; i++) {
          let scode = this.chooseId[i]
          let deItem = {
            planNum: scode
          }
          this.$axios.post('/d/maintainPlan/delete', deItem).then(res => {
            if (res.data.code === 0) {

            }
          }).catch(err => {
            console.log(err)
          })
        }
        this.$message.success('批量删除成功')
        this.$refs.serviceTable.clearSelection()
        setTimeout(() => {
          this.jsonData.pageNo = 1
          this.jsonData.pageSize = 10
          this.getTableData()
        }, 100)
      },(rej)=>{
        console.log(rej)
      })
    },
    //删除按钮
    deleteItem(row) {
      let deletePar = {
        planNum: row.code
      }
      this.$axios.post('/d/maintainPlan/delete', deletePar).then(res => {
        if (res.data.code === 0) {
          this.$message.success('成功删除')
          this.pageNo = this.deleteLastPageData(this.total,this.pageSize,this.pageNo)
          this.jsonData.pageNo = this.pageNo
          this.getTableData()
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 查询按钮
    onSubmit() {
      if (this.servicePlan.code === '') {
        this.jsonData.pageSize = 10
        this.jsonData.pageNo = 1
        this.getTableData()
      } else {
        let par = {
          planNum: this.servicePlan.code //计划编号
        }
        this.$axios.post('/d/maintainPlan/get', par).then(res => {
          if (res.data.code === 0) {
            //console.log(res)
            let msg2 =res.data.data
            this.tableData=[]
            let obj={}
            obj.index = msg2.planNum + this.jsonData.pageNo
            obj.code = msg2.planNum
            obj.serviceContent = msg2.content //保养内容
            obj.rate = msg2.frequency //频率
            obj.workHour = msg2.time //保养时间
            obj.serviceLevel = msg2.title //保养标题
            obj.cycleType = msg2.frequencyType // 保养周期类型 1:日 2:周(7天) 3:月(30天)
            this.tableData.push(obj)
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    //详情
    lookDetail(row) {
      let detail = {
        planNum: row.code,
        show: true
      }
      this.$bus.emit('serviceLook', detail)
    },
    //已经绑定的设备查看信息
    bindedDevice(row){
      let item = row
      item.show = true
      this.$bus.emit('bindDevice',item)
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
  destroyed() {
    this.$bus.off('edit2')
    this.$bus.off('add2')
    this.$bus.off('serviceRender')
    this.$bus.off('serviceLook')
    this.$bus.off('bindDevice')
  }
}
</script>

<style scoped>
.servicePlan {
  padding: 10px;
}

</style>
