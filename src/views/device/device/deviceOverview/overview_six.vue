<template>
  <div class="overview_six">
    <el-card shadow="always">
      <el-form :inline="true" :model="maintain" class="demo-form-inline">
        <el-form-item label="文档名称">
          <el-input v-model="maintain.name" placeholder="请输入内容" @change="maintain_show" />
        </el-form-item>
        <el-form-item label="文档类型">
          <el-select v-model="maintain.type" placeholder="请输入内容" @change="maintain_show">
            <el-option v-for="item in optionList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="上传时间">
          <el-date-picker v-model="maintain.time" type="date" placeholder="请选择日期" @change="maintain_show" />
        </el-form-item>
        <el-form-item label="上传用户">
          <el-input v-model="maintain.uploadUser" placeholder="请输入内容" @change="maintain_show" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-row style="margin-bottom: 5px;">
        <el-button type="primary" @click="addOverviewSix">新增</el-button>
        <el-button type="danger">删除</el-button>
        <el-button type="success">批量导出</el-button>
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
              <el-tag @click="updateList(scope.row)">编辑</el-tag>
              <el-tag type="warning">预览</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <overview_sixEditDialog/>
  </div>
</template>

<script>
import overview_sixEditDialog from '../devicedetail/overview_sixEditDialog'
export default {
  name: 'OverviewSix',
  components: {overview_sixEditDialog},
  data() {
    return {
      loading: false,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 270, // 表格高度
      tableData: [{
        name: '建模图纸',
        type: '模型类',
        code: 'hadkfb',
        uploadUser: '赵四',
        time: '2019-8-1 08:00:00'
      }],
      maintain: {
        name: '',
        code: '',
        uploadUser: '',
        time: '',
        type:''
      },
      optionList: [{
        value: '选项1',
        label: '模型类'
      },
      {
        value: '选项2',
        label: '工艺图纸类'
      },
      {
        value: '选项3',
        label: '说明类'
      },
      {
        value: '选项4',
        label: '设备合格证类'
      },
      {
        value: '选项5',
        label: '其他类'
      }
      ],
      listName: [{
        label: '文档名称',
        name: 'name'
      },
      {
        label: '文档类型',
        name: 'type'
      },
      {
        label: '附件编号',
        name: 'code'
      },
      {
        label: '上传时间',
        name: 'time'
      },
      {
        label: '上传用户',
        name: 'uploadUser'
      }
      ]
    }
  },
  created() {
    // 获得传来的 foreignId
    let id=JSON.parse(sessionStorage.getItem('deviceStatus')).id
    // 此时默认的 catalog 为  1
    console.log(id)
    let params={
      foreignId : id,
      catalog : 1
    }
    this.$axios.post('/d/deviceDocument/getByForeignId',params).then(res=>{
      console.log('文档',res)
      },err=>{

      }
    )
  },
  destroyed() {
    console.log('overview_six')
    this.$bus.off('editInfo6')
    this.$bus.off('add6')
  },
  methods: {
    maintain_show() {

    },
    onSubmit() {
      this.$message({
        type: 'success',
        message: '查询'
      })
    },
    updateList(item) {
        this.$bus.emit('editInfo6',item)
    },
    addOverviewSix(){
      this.$bus.emit('add6',true)
    }
  }
}
</script>
<style scoped>
.overview_six {
	padding: 5px;
}
</style>
