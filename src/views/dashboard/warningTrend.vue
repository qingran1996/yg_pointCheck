<template>
  <div class="warningTrend">
    <el-card>
      <div class="bClass">
        <ECharts ref="chartTest" :options="option" :style="{width:EChartsWidth,height:EChartsHeight} "></ECharts>
      </div>
    </el-card>
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
export default {
  components: { ECharts },
  data() {
    return {
      option: {},
      EChartsWidth:25+'vw',
      EChartsHeight:40+'vh'
    }
  },
  mounted() {
    this.getEcharts()
  },
  methods: {
    getEcharts() {
      this.option={
        title:{
          text:'告警趋势',
          textStyle:{
           fontSize:18
          },
          left:'45%',
        },
        tooltip:{
          show:true,
          trigger:'axis',
          axisPointer:{type:'line'},
          backgroundColor:'rgba(50,50,50,0.5)', //tooltip背景色 渐变
          // formatter:function(param) {
          //   console.log(param)
          //   return[
          //     '1'+param.value
          //   ]
          // }
        },
        xAxis:{
          type:'category',
          data:["周一","周二","周三","周四","周五","周六","周日"],
          axisTick: {
            show: false
          }, //去掉x轴刻度线
          axisLabel:{
            fontSize:13,
            fontWeight:'bold'
          }
        },
        yAxis:{
          axisTick: {
            show: false
          }, //去掉x轴刻度线
          axisLine:{
            show:false
          },
          axisLabel:{
            fontSize:13,
            fontWeight:'bold'
          }
        },
        legend:{
          type:'plain',
          top: 30,
          data:[{
            name:'库存警告',
            textStyle: {
              color:'orange',
              fontSize: 13,
              fontWeight:'bold'
            }
          },{
            name:'传感器参数警告',
            textStyle: {
              color:'#ff3333',
              fontSize: 13,
              fontWeight:'bold'
            }
          }]
        },
        series:[{
          type: 'line',
          name:'库存警告',
          label: {
            show:true,
            color:'orange'
          },
          data:[40,44,48,50,55,60,70],
          lineStyle:{
            color:'orange'
          }, //折线样式
          itemStyle:{
            color:'orange',
            borderType:'solid'
          },
          areaStyle:{
            color:{
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 0.5,
              colorStops: [{
                offset: 0, color: 'rgb(255, 194, 102,0.7)' // 0% 处的颜色
              },{
                offset: 1, color: 'rgb(255, 194, 102,0)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          },
          tooltip:{
          }
        },{
          type: 'line',
          name:'传感器参数警告',
          label: {
            show:true,
          },
          data:[20,25,30,35,40,50,60],
          lineStyle:{
            color:'#ff3333'
          }, //折线样式
          itemStyle:{
            color:'#ff3333',
            borderType:'solid'
          },
          areaStyle:{
            color:{
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 0.7,
              colorStops: [{
                offset: 0, color: 'rgb(255, 51, 51,0.4)' // 0% 处的颜色
              },{
                offset: 1, color: 'rgb(255, 51, 51,0)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }]
      }
    }
  }
}
</script>

<style scoped>
.warningTrend {

}

.bClass {
padding-top: 30px;
}
</style>
