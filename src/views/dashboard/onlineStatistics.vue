<template>
  <div class="onlineStatistics">
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
  components: { ECharts },
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
    getEcharts() {
      this.option = {
        title: {
          text: '在线离线统计',
          textStyle: {
            fontSize: 18
          },
          left:'45%'
        },
        legend:{
          type:'plain',
          orient:'vertical',
          right: 10,
          formatter:'{name} ',
          textStyle:{
            fontSize: 13,
            fontWeight:'bold'
          }
        },
        //圆环的颜色
        color:['#9ADC8A','#41ABF1','#fd87fb'],
        series:[{
          type: 'pie',
          name:'设备统计',
          radius:['0%','70%'],
          center:['55%','50%'],
          startAngle:0,
          label:{
            formatter:'{b} {c}人\n {d}%',
            padding:[2,2,2,2]
          },
          labelLine:{
            length:30
          },
          data:[          // 数据数组，name 为数据项名称，value 为数据项值
            {value:100, name:'离线'},
            {value:400, name:'在线'}
          ]
        }]
      }
    }
  }
}
</script>

<style scoped>
.onlineStatistics {

}
.bClass{
  padding-top: 30px;
}
</style>
