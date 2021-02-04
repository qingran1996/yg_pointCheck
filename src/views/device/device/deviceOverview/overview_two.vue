<template>
  <div class="overview_two">
    <el-card shadow="always">
      <el-form :inline="true" :model="maintain" class="demo-form-inline">
        <el-form-item label="保养结果">
          <el-select v-model="maintain.result" placeholder="请选择" clearable>
            <el-option label="正常" :value="1"/>
            <el-option label="异常" :value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="保养时间">
          <el-date-picker v-model="maintain.time" placeholder="请选择日期" type="date" @change="maintain_show" clearable/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="maintain.status" placeholder="请选择" clearable>
            <el-option label="待保养" :value="0"/>
            <el-option label="已完成" :value="1"/>
          </el-select>
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
              <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                <el-tag @click="lookList(scope.row)" type="warning">详情</el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      loading: false,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 270, // 表格高度
      // 筛选
      maintain: {
        time: '',
        status:'',
        result:''
      },
      tableData: [{
        name: '储罐1',
        deviceCode: '001',
        content: '清洁清洁',
        beforePic: 'before',
        afterPic: 'after',
        dept: '谢天',
        createTime: '2019-8-1 08:00:00',
        status: '待保养',
        result: '正常'
      }],
      listName: [{
        label: '设备名称',
        name: 'name'
      }, {
        label: '设备编号',
        name: 'deviceCode'
      }, {
        label: '保养内容',
        name: 'content'
      }, {
        label: '保养负责人',
        name: 'dept'
      }, {
        label: '保养前图片',
        name: 'beforePic'
      }, {
        label: '保养后图片',
        name: 'afterPic'
      }, {
        label: '保养时间',
        name: 'createTime'
      }, {
        label: '保养结果',
        name: 'result'
      },{
        label: '状态',
        name: 'status'
      }]
    }
  },
  created() {
    this.$bus.on('gotab',e=>{
      if (e.num === '2'){
        console.log('overview2--保养计划',e) //获取保养的信息
      }
    })
  },
  destroyed() {
    console.log('overview_two')
    this.$bus.off('gotab')
  },
  methods: {
    maintain_show() {

    },
    //查询
    onSubmit() {

    },
    //详情
    lookList(item){

    },
    //保养计划---跳转
    servicePlan(){
    }
  }
}
</script>
<style scoped>
	.overview_two {
		padding: 5px;
	}
</style>
