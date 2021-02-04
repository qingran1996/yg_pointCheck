<template>
  <div class="deviceScrap">
    <el-card shadow="always">
      <el-form :inline="true" :model="maintain" class="demo-form-inline">
        <el-form-item label="设备名称">
          <el-input v-model="maintain.name" placeholder="请输入内容" @change="maintain_show" />
        </el-form-item>
        <!-- <el-form-item label="设备编号">
          <el-input v-model="maintain.code" placeholder="请输入内容" @change="maintain_show" />
        </el-form-item> -->
        <el-form-item label="是否为危险品" style="margin-left: 10px">
          <el-radio v-model="maintain.radio" label="true">是</el-radio>
          <el-radio v-model="maintain.radio" label="false">否</el-radio>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="maintain.time" type="datetime" placeholder="选择日期时间" style="margin-left: 10px" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-row style="margin-bottom: 5px;">
        <el-button type="primary" @click="add">新增</el-button>
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
              <el-tag type="warning">附件</el-tag>
              <el-tag @click="checkDetail(scope.row)">详情</el-tag>
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
    <scrapEditDialog/>
    <detailDialog/>
  </div>
</template>

<script>
import scrapEditDialog from './deviceScrapDialog/scrapEditDialog'
import detailDialog from './deviceScrapDialog/detailDialog'
export default {
  name: 'DeviceScrap',
  components: {
    scrapEditDialog,
    detailDialog
  },
  data() {
    return {
      loading: false,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 270, // 表格高度
      total: 6,
      pageSize: 5,
      currentPage: 1,
      tableData: [{
        deviceCode: 'GD1322',
        name: '设备名称',
        dept: '生产部',
        applicant: '张三',
        reason: '泄露',
        createTime: '2019-8-1 08:00:00',
        isDanger: '是',
        approve: '王处长'
      }, {
        deviceCode: 'GD19999',
        name: '设备名称2',
        dept: '保养部',
        applicant: '赵四',
        reason: '维修不合格',
        createTime: '2019-8-1 08:00:00',
        isDanger: '否',
        approve: '李处长'
      }],
      maintain: {
        name: '',
        code: '',
        radio: '',
        time: ''
      },
      listName: [{
        label: '设备名称',
        name: 'name'
      },
      {
        label: '申请部门',
        name: 'dept'
      },
      {
        label: '申请人',
        name: 'applicant'
      },
      {
        label: '申请原因',
        name: 'reason'
      },
      {
        label: '申请时间',
        name: 'createTime'
      },
      {
        label: '是否危险品',
        name: 'isDanger'
      },
      {
        label: '审批人',
        name: 'approve'
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
    edit(item) {
      let obj=item
      this.$bus.emit('editInfo',obj)
    },
    add(){
      this.$bus.emit('add',true)
    },
    checkDetail(row) {
      this.$bus.emit('detail',row)
    },
    handleSizeChange(val) {
      console.log(`size change :${val}`)
    },
    handleCurrentChange(val) {
      console.log(`current change :${val}`)
    }
  },
  destroyed() {
    this.$bus.off('editInfo')
    this.$bus.off('add')
    this.$bus.off('detail')
  }
}
</script>
<style scoped>
	.deviceScrap {
		padding: 10px;
	}
</style>
