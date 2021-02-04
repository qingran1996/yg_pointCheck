<template>
  <div class="warningInformation">
    <el-table v-loading="loading" ref="multipleTable" :data="tableData" border style="width: 100%"
              :max-height="tableHeight">
      <el-table-column v-for="item in listName" :key="item.name" :label="item.label" :prop="item.name" min-width="110" show-overflow-tooltip/>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData:[{
        name:'警告1',
        type:'规格型号00k1',
        time:'2020-12-18 08:00:00',
        status:'已处理'
      },{
        name:'警告2',
        type:'规格型号00k2',
        time:'2020-12-18 10:00:00',
        status:'已处理'
      },{
        name:'警告3',
        type:'规格型号00k3',
        time:'2020-12-23 08:00:00',
        status:'未处理'
      }],
      tableHeight:300 - 100 ,
      loading:false,
      listName:[{
        label:'警告名称',
        name:'name'
      },{
        label: '规格型号',
        name: 'type'
      },{
        label: '时间',
        name: 'time'
      },{
        label: '状态',
        name: 'status'
      }]
    }
  }
}
</script>

<style scoped>
.warningInformation {
  margin-top: 10px;
}
</style>
