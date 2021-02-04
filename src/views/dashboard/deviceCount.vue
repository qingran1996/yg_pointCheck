<template>
  <div class="deviceCount">
    <el-card>
      <div class="bClass">
        <ECharts ref="chartTest" :options="option" :style="{width:EChartsWidth,height:EChartsHeight} "></ECharts>
      </div>
    </el-card>
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
export default {
  components:{ECharts},
  data() {
    return {
      option: {},
      EChartsWidth: 25 + 'vw',
      EChartsHeight: 40 + 'vh'
    }
  },
  mounted() {
    this.getEcharts()
  },
  methods: {
    getEcharts(){
      this.option={
        title:{
          text:'设备统计',
          textStyle:{
            fontSize:18
          },
          left:'45%',
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c}个 ({d}%)",
          textStyle:{    //图例文字的样式
            color:'#fff',  //文字颜色
            fontSize:10    //文字大小
          }
        },
        legend:{
          type:'plain',
          bottom: 10,
          textStyle:{
            fontSize: 13,
            fontWeight:'bold'
          }
        },
        //圆环的颜色
        color:['#48cda6','#fd87fb','#11abff','#ffdf6f','#968ade'],
        series:[{
          type: 'pie',
          name:'设备统计',
          radius:['50%','70%'],
          label:{
            formatter:'{b} {c}个\n {d}%'
          },
          itemStyle:{
            borderWidth:4,
            borderColor:'white'
          },
          data:[          // 数据数组，name 为数据项名称，value 为数据项值
            {value:235, name:'罐类'},
            {value:274, name:'风机'},
            {value:310, name:'反应器类'},
            {value:400, name:'管道'}
          ]
        }]
      }
    }
  }
}
</script>

<style scoped>
.deviceCount {

}
.bClass {
  padding-top: 30px;
}
</style>
