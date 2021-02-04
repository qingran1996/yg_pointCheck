<template>
  <div class="deviceStatus">
    <el-card class="box-card" shadow="always">
      <el-form :inline="true" :model="deviceChange_model" class="demo-form-inline">
        <el-form-item label="设备编号">
          <el-input v-model="deviceChange_model.code" placeholder="请输入内容" @change="deviceChange_code_show" />
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="deviceChange_model.name" placeholder="请输入内容" @change="deviceChange_name_show" />
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="deviceChange_model.deviceType" placeholder="请输入内容">
            <el-option v-for="item in device_options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="进度">
          <el-select v-model="deviceChange_model.progress" placeholder="请输入内容">
            <el-option v-for="item in device_progress" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-row style="margin-bottom: 5px;">
        <!-- <el-button type="primary">新增</el-button> -->
        <el-button type="danger">删除</el-button>
        <!-- <el-button type="success" @click="gotoStatus">设备状态</el-button> -->
      </el-row>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight">
        <el-table-column type="index" label="序号" width="100" align="center" />
        <el-table-column prop="code" label="设备编号" min-width="180" align="center" />
        <el-table-column prop="name" label="设备名称" min-width="180" align="center" />
        <el-table-column prop="guige" label="规格型号" min-width="180" align="center" />
        <el-table-column prop="deviceNum" label="设备数量(台)" min-width="180" align="center" />
        <el-table-column prop="area" label="安装位置" min-width="180" align="center" />
        <el-table-column prop="status" label="设备状态" min-width="180" align="center" />
        <el-table-column prop="progress" label="进度" min-width="180" align="center" />
        <el-table-column fixed="right" label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <div class="action">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <el-tag @click="updateList(scope.row)">编辑</el-tag>
                <!-- <i class="el-icon-view" @click="updateList(scope.row)"></i> -->
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                <el-tag @click="lookList(scope.row)">详情</el-tag>
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
  </div>
</template>

<script>
export default {
  name: 'DeviceStatus',
  components: {},
  data() {
    return {

      loading: false,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 152, // 表格高度
      currentPage: 1,
      pageSize: 10,
      total: 1,
      tableData: [{
        code: 'qwwre123',
        name: '机械零件仓库',
        guige: 'bb123',
        deviceNum: '5',
        area: 'A区',
        status: '启用',
        progress: '审判中'
      }],
      device_options: [{
        value: '1',
        label: '启用'
      }, {
        value: '2',
        label: '停用'
      }],
      device_progress: [{
        value: '1',
        label: '审批中'
      }, {
        value: '2',
        label: '已启用'
      }, {
        value: '3',
        label: '已停用'
      }, {
        value: '4',
        label: '驳回'
      }],
      // 筛选
      deviceChange_model: {
        code: '',
        name: '',
        deviceType: '启用',
        progress: '审批中'
      }

    }
  },
  created() {

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
    updateList() {

    },
    // table详情
    lookList() {

    },
    // 查询按钮
    onSubmit() {

    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }

  }

}
</script>
<style scoped>
	.deviceStatus {
		padding: 10px;
	}
</style>
