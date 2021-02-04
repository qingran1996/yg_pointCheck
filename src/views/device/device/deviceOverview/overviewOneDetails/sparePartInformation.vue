<template>
  <div class="sparePartInformation">
    <el-table v-loading="loading" ref="multipleTable" :data="tableData" border style="width: 100%"
              :max-height="tableHeight">
    <el-table-column v-for="item in listName" :key="item.name" :label="item.label" :prop="item.name" min-width="110" show-overflow-tooltip/>
    </el-table>
  </div>
</template>

<script>
export default {
  data(){
    return{
      tableData:[{
        name:'备品备件1',
        type:'规格型号00k1',
        min:30,
        currentStock:100
      },{
        name:'备品备件2',
        type:'规格型号00k2',
        min:65,
        currentStock:65
      },{
        name:'备品备件3',
        type:'规格型号00k3',
        min:30,
        currentStock:10
      }],
      tableHeight:300 - 100 ,
      loading:false,
      listName:[{
        label:'备品备件名',
        name:'name'
      },{
        label: '规格型号',
        name: 'type'
      },{
        label: '最低库存',
        name: 'min'
      },{
        label: '当前库存',
        name: 'currentStock'
      }]
    }
  }
}
</script>

<style scoped>
.sparePartInformation {
  margin-top: 10px;
}
</style>
