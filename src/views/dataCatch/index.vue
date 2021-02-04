<template>
  <div class="dataCatch">
    <el-card shadow="always">
      <el-form :inline="true" :model="maintain" class="demo-form-inline">
        <el-form-item label="设备">
          <el-input v-model="maintain.device" placeholder="请输入内容" @change="maintain_show" />
        </el-form-item>
        <el-form-item label="采集点名称">
          <el-input v-model="maintain.place" placeholder="请输入内容" @change="maintain_show" />
        </el-form-item>
        <el-form-item label="采集点类型" style="margin-left: 10px">
          <el-select v-model="maintain.type" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="传感器编号">
          <el-input v-model="maintain.sensorCode" placeholder="请输入内容" @change="maintain_show" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-row style="margin-bottom: 5px;">
        <el-button type="primary" @click="addCatch">新增</el-button>
        <el-button type="danger">删除</el-button>
      </el-row>
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
              <el-tag @click="edit(scope.row)">编辑</el-tag>
              <el-tag @click="checkDetail(scope.row)">运行记录</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 15px">
        <el-pagination
          align="center"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <catchEditDialog/>
  </div>
</template>

<script>
import catchEditDialog from './dataCatchDialog/catchEditDialog'
export default {
  name: 'DataCatch',
  components: {catchEditDialog},
  data() {
    return {
      loading: false,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 270, // 表格高度
      total: 6,
      pageSize: 5,
      currentPage: 1,
      tableData: [{
        device: 'GD1322',
        index: 1,
        place: '采集点a',
        type: '温度',
        sensorCode: '传感器编号001'
      },{
        device: 'KB9984',
        index: 2,
        place: '采集点b',
        type: '压力',
        sensorCode: '传感器编号002'
      }],
      maintain: {
        device: '',
        place: '',
        sensorCode: '',
        type: ''
      },
      options: [{
        value: '选项1',
        label: '温度'
      },
      {
        value: '选项2',
        label: '压力'
      },
      {
        value: '选项3',
        label: '湿度'
      },
      {
        value: '选项4',
        label: '液位'
      }
      ],
      listName: [{
        label: '设备',
        name: 'device'
      },
      {
        label: '采集点名称',
        name: 'place'
      },
      {
        label: '采集点类型',
        name: 'type'
      },
      {
        label: '传感器编号',
        name: 'sensorCode'
      }
      ]
    }
  },
  created() {

  },
  methods: {
    maintain_show() {

    },
    onSubmit() {
      this.$message({
        type: 'success',
        message: '报废处理'
      })
    },
    // 编辑
    edit(item) {
      this.$bus.emit('edit',item)
    },
    //新增dataCatch
    addCatch(){
      this.$bus.emit('add',true)
    },
    checkDetail(row) {
      console.log(row)
    },
    handleSizeChange(val) {
      console.log(`size change :${val}`)
    },
    handleCurrentChange(val) {
      console.log(`current change :${val}`)
    }
  },
  destroyed() {
    this.$bus.off('edit')
    this.$bus.off('add')
  }
}
</script>
<style scoped>
	.dataCatch {
		padding: 10px;
	}
</style>
