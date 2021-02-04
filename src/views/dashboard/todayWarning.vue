<template>
  <div class="todayWarning">
    <el-card >
      <h3 style="display: flex;justify-content: center;">今日告警</h3>
      <div :style="{height:heightCheck}">
        <el-table v-loading="loading" :data="tableData" style="width: 100%" :max-height="tableHeight">
          <el-table-column type="index" width="50" align="center">
            <template slot-scope="scope">
              <img src="@/assets/user_images/main6.png">
            </template>
          </el-table-column>
          <el-table-column v-for="item in listName" :key="item.name" :label="item.label" :prop="item.name" align="center"/>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return{
      loading:false,
      tableHeight:document.body.clientWidth / 6 - 10,
      heightCheck: document.body.clientWidth / 7 + 24 + 'px',
      tableData:[{
        type:'库存警告',
        content:'二级螺母库存警告',
        time:'2021-01-04 08:00:00'
      },{
        type:'库存警告',
        content:'二级螺母库存警告',
        time:'2021-01-04 08:00:00'
      },{
        type:'库存警告',
        content:'二级螺母库存警告',
        time:'2021-01-04 08:00:00'
      },{
        type:'库存警告',
        content:'二级螺母库存警告',
        time:'2021-01-04 08:00:00'
      },{
        type:'库存警告',
        content:'二级螺母库存警告',
        time:'2021-01-04 08:00:00'
      },{
        type:'库存警告',
        content:'二级螺母库存警告',
        time:'2021-01-04 08:00:00'
      }],
      listName:[{
        label:'告警类别',
        name:'type'
      },{
        label: '告警内容',
        name: 'content'
      },{
        label: '时间',
        name: 'time'
      }]
    }
  }
}
</script>

<style scoped>
.todayWarning {

}
</style>
