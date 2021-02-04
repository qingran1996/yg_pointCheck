<template>
  <div class="deviceChange">
    <el-card class="box-card" shadow="always">
      <el-form :inline="true" :model="deviceChange_model" class="demo-form-inline">
        <el-form-item label="设备位号">
          <el-input v-model="deviceChange_model.code" placeholder="请输入内容" @change="deviceChange_code_show"/>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="deviceChange_model.name" placeholder="请输入内容" @change="deviceChange_name_show"/>
        </el-form-item>
        <el-form-item label="变更时间">
          <el-date-picker v-model="deviceChange_model.time" type="datetime" placeholder="选择日期"/>
        </el-form-item>
        <el-form-item label="设备状态">
          <el-select v-model="deviceChange_model.status">
            <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-row style="margin-bottom: 5px;">
<!--        <el-button type="primary" @click="addChange">新增</el-button>-->
        <el-button type="success" @click="gotoStatus">设备状态</el-button>
      </el-row>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight">
        <el-table-column type="index" label="序号" width="100" align="center"/>
        <el-table-column v-for="item in listName" :key="item.label" :label="item.label" :prop="item.name" min-width="180" align="center" show-overflow-tooltip/>
        <el-table-column fixed="right" label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <div class="action">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <el-tag @click="updateList(scope.row)" type="success">编辑</el-tag>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                <el-tag @click="lookList(scope.row)">详情</el-tag>
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
    <editChangeDialog/>
  </div>
</template>

<script>
import editChangeDialog from './deviceChangeDialog/editChangeDialog'

export default {
  name: 'DeviceChange',
  components: { editChangeDialog },
  data() {
    return {
      loading: false,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 152, // 表格高度
      currentPage: 1,
      pageSize: 10,
      total: 1,
      tableData: [{
        deviceKks: 'qwwre123',
        name: '机械零件仓库',
        assetCode:'资产编号123456789',
        specificationModel: '规格型号123',
        changeContent: '地点变更',
        changePerson:'张三',
        changeTime: '2020-8-1 08:00:00',
        status:'启用',
        isChangeStatus:'待变更'
      }],
      // 筛选
      deviceChange_model: {
        code: '',
        name: '',
        time: '',
        status: ''
      },
      statusList: [{
        name: '21',
        code: 1
      }],
      listName:[{
        label:'设备位号',
        name: 'deviceKks'
      },{
        label:'设备名称',
        name: 'name'
      },{
        label:'资产编号',
        name: 'assetCode'
      },{
        label:'规格型号',
        name: 'specificationModel'
      },{
        label:'变更内容',
        name: 'changeContent'
      },{
        label:'变更人',
        name: 'changePerson'
      },{
        label:'变更时间',
        name: 'changeTime'
      },{
        label:'设备状态',
        name: 'status'
      },{
        label:'变更记录状态',
        name: 'isChangeStatus'
      }]
    }
  },
  created() {
    this.getStatus()
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
    gotoStatus() {
      this.$router.push({
        path: '/deviceChange/index/deviceStatus'
      })
    },
    // table编辑
    updateList(item) {
      item.statusList =this.statusList
      this.$bus.emit('edit', item)
    },
    // table 新增
    addChange() {
      //this.$bus.emit('add', true)
    },
    // table详情
    lookList() {

    },
    // 查询按钮
    onSubmit() {

    },
    //状态列表查询
    getStatus() {
      let parm = {
        parentCode: 'deviceState'
      }
      this.getStateInfo(parm).then(res => {
        if (res.data.code === 0) {
          //console.log('状态', res)
          this.statusList = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  },
  destroyed() {
    this.$bus.off('edit')
    this.$bus.off('add')
  }
}
</script>
<style scoped>
.deviceChange {
  padding: 10px;
}
</style>
