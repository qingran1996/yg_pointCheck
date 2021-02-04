<template>
  <div class="alarmRecord">
    <el-card class="box-card" shadow="always">
      <el-form :inline="true" :model="alarmRecord_model" class="demo-form-inline">
        <el-form-item label="告警类型">
          <!-- <el-input v-model="alarmRecord.alarmType" placeholder="请输入内容" @change="alarmRecord_type" /> -->
          <el-select v-model="alarmRecord_model.alarmType" placeholder="请选择" @change="alarmRecord_type">
            <el-option v-for="item in alarmTypeData" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="告警时间">
          <el-date-picker v-model="alarmRecord_model.time" type="datetime" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="告警级别">
          <!-- <el-input v-model="alarmRecord_model.level" placeholder="请输入内容" @change="alarmRecord_level" /> -->
          <el-select v-model="alarmRecord_model.level" placeholder="请选择" @change="alarmRecord_level">
            <el-option v-for="item in alarmLevelData" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <!-- <el-input v-model="alarmRecord.status" placeholder="请输入内容" @change="warehouse_username_show" /> -->
          <el-select v-model="alarmRecord_model.status" placeholder="请选择" @change="alarmRecord_status">
            <el-option v-for="item in alarmStatusData" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <!-- <el-row style="margin-bottom: 5px;">
				<el-button type="primary">新增</el-button>
				<el-button type="danger">删除</el-button>
			</el-row> -->
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight">
        <el-table-column type="index" label="序号" width="100" align="center" />
        <el-table-column
          v-for="item in listName"
          :key="item.name"
          :label="item.label"
          :prop="item.name"
          min-width="180"
          align="center"
        />
        <el-table-column fixed="right" label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <div class="action">
              <el-tooltip class="item" effect="dark" content="处理" placement="bottom">
                <el-tag @click="updateList(scope.row)">处理</el-tag>
                <!-- <i class="el-icon-view" @click="updateList(scope.row)"></i> -->
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="block" style="margin-top:15px;">
        <el-pagination
          v-show="total!=0"
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
    <resloveDialog/>
  </div>
</template>

<script>
import resloveDialog from '../resloveDialog/resloveDialog'
export default {
  name: 'AlarmRecord',
  components: {resloveDialog},
  data() {
    return {
      loading: false,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 152, // 表格高度
      currentPage: 1,
      pageSize: 10,
      total: 1,
      listName: [{
        label: '告警名称',
        name: 'alarmName'
      },
      {
        label: '告警类型',
        name: 'alarmType'
      },
      {
        label: '告警级别',
        name: 'alarmLevel'
      },
      {
        label: '状态',
        name: 'alarmStatus'
      },
      {
        label: '开始时间',
        name: 'startTime'
      },
      {
        label: '结束时间',
        name: 'endTime'
      }
      ],
      tableData: [{
        alarmName: '电流过大',
        alarmType: '库存不足',
        alarmLevel: '严重',
        alarmStatus: '未处理',
        startTime: '2019-8-1 08:00:00',
        endTime: '2019-8-1 08:00:00'
      }],
      // 筛选
      alarmRecord_model: {
        alarmType: '',
        time: '',
        level: '',
        status: ''
      },
      // 告警类型
      alarmTypeData: [{
        value: '1',
        label: '正常'
      }, {
        value: '2',
        label: '库存不足'
      }],
      // 告警状态
      alarmStatusData: [{
        value: '1',
        label: '已处理'
      }, {
        value: '2',
        label: '未处理'
      }],
      // 告警级别
      alarmLevelData: [{
        value: '1',
        label: '主要'
      }, {
        value: '2',
        label: '严重'
      }]
    }
  },
  created() {

  },
  methods: {
    // 告警类型选择
    alarmRecord_type(val) {
      console.log(val)
    },
    // 告警级别
    alarmRecord_level() {

    },
    // 告警状态
    alarmRecord_status() {

    },
    // table警告处理
    updateList(row) {
      this.$bus.emit('reslove',row)
    },
    onSubmit() {

    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  },
  destroyed() {
    this.$bus.off('reslove')
  }
}
</script>
<style scoped>
	.alarmRecord {
		padding: 10px;
	}
</style>
