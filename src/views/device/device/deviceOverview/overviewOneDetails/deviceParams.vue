<template>
  <div class="deviceParams">
    <ECharts ref="chartTest" :options="option" style="width:53vw ;height: 400px;"/>
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/gauge'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/title'

export default {
  components: { ECharts },
  data() {
    return {
      option: {}
    }
  },
  mounted() {
    this.getCharts()
  },
  methods: {
    getCharts() {
      this.option = {
        textStyle: {
          color: 'red'
        },
        series: [{ // 温度表
          center: ['20%', '50%'],
          type: 'gauge',
          radius: '65%',
          data: [{
            value: 25,
            name: '温度℃'
          }],
          title: {
            color: '#242424',
            fontStyle: 'italic',
            fontSize: 19
          },
          axisLabel: { show: false },
          axisLine: {
            show: true,
            shadowColor: '#fff',
            lineStyle: {
              opacity: 0.9,
              width: 7,
              //color:[[0.3,'#66ccff'],[0.7,'#ffcc33'],[1,'#ff0033']]
              color: [[0.3, {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0.2,
                y2: 1,
                colorStops: [{ offset: 0, color: '#66ccff' }, { offset: 1, color: '#6699ff' }],
                global: false // 缺省为 false
              }], [0.7, {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0.2,
                y2: 1,
                colorStops: [{ offset: 0.1, color: '#ccffcc' }, { offset: 0.9, color: '#ffcc00' }, {
                  offset: 1,
                  color: '#ffcc99'
                }],
                global: false // 缺省为 false
              }], [1, {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0.2,
                y2: 1,
                colorStops: [{ offset: 0, color: '#FA8072' }, { offset: 1, color: '#ff0000' }],
                global: false // 缺省为 false
              }]]
            }
          },
          detail: {
            offsetCenter: [0, '40%'],
            fontWeight: 'bold',
            fontSize: 50,
            color: '#ffcc33'
          },
          splitLine: {
            lineStyle: {
              opacity: 0.55,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#C6E2FF' // 50% 处的颜色
                }, {
                  offset: 1, color: '#E3E3E3' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          },
          pointer: { show: true,width:2 },
          itemStyle: { opacity:0.4 },
          axisTick: {
            length: 10,
            lineStyle: {
              width: 3,
              opacity: 0.3,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#C6E2FF' // 50% 处的颜色
                }, {
                  offset: 1, color: '#E3E3E3' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }
        },
        { //// 电流表
            center: ['53%', '50%'],
            type: 'gauge',
            radius: '65%',
            data: [{
              value: 55,
              name: '电流A'
            }],
            title: {
              color: '#242424',
              fontStyle: 'italic',
              fontSize: 19
            },
            axisLabel: { show: false },
            axisLine: {
              show: true,
              shadowColor: '#fff',
              lineStyle: {
                opacity: 0.9,
                width: 7,
                //color:[[0.3,'#66ccff'],[0.7,'#ffcc33'],[1,'#ff0033']]
                color: [[0.3, {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0.2,
                  y2: 1,
                  colorStops: [{ offset: 0, color: '#66ccff' }, { offset: 1, color: '#6699ff' }],
                  global: false // 缺省为 false
                }], [0.7, {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0.2,
                  y2: 1,
                  colorStops: [{ offset: 0.1, color: '#ccffcc' }, { offset: 0.9, color: '#ffcc00' }, {
                    offset: 1,
                    color: '#ffcc99'
                  }],
                  global: false // 缺省为 false
                }], [1, {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0.2,
                  y2: 1,
                  colorStops: [{ offset: 0, color: '#FA8072' }, { offset: 1, color: '#ff0000' }],
                  global: false // 缺省为 false
                }]]
              }
            },
            detail: {
              offsetCenter: [0, '40%'],
              fontWeight: 'bold',
              fontSize: 50,
              color: '#ffcc33'
            },
            splitLine: {
              lineStyle: {
                opacity: 0.55,
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#C6E2FF' // 50% 处的颜色
                  }, {
                    offset: 1, color: '#E3E3E3' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            },
            pointer: { show: true,width:2 },
            itemStyle: { opacity:0.4 },
            axisTick: {
              length: 10,
              lineStyle: {
                width: 3,
                opacity: 0.3,
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#C6E2FF' // 50% 处的颜色
                  }, {
                    offset: 1, color: '#E3E3E3' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            }
          },
          { //液位表
            center: ['85%', '50%'],
            type: 'gauge',
            radius: '65%',
            data: [{
              value: 75,
              name: '液位MM³'
            }],
            title: {
              color: '#242424',
              fontStyle: 'italic',
              fontSize: 19
            },
            axisLabel: { show: false },
            axisLine: {
              show: true,
              shadowColor: '#fff',
              lineStyle: {
                opacity: 0.9,
                width: 7,
                //color:[[0.3,'#66ccff'],[0.7,'#ffcc33'],[1,'#ff0033']]
                color: [[0.3, {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0.2,
                  y2: 1,
                  colorStops: [{ offset: 0, color: '#66ccff' }, { offset: 1, color: '#6699ff' }],
                  global: false // 缺省为 false
                }], [0.7, {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0.2,
                  y2: 1,
                  colorStops: [{ offset: 0.1, color: '#ccffcc' }, { offset: 0.9, color: '#ffcc00' }, {
                    offset: 1,
                    color: '#ffcc99'
                  }],
                  global: false // 缺省为 false
                }], [1, {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0.2,
                  y2: 1,
                  colorStops: [{ offset: 0, color: '#FA8072' }, { offset: 1, color: '#ff0000' }],
                  global: false // 缺省为 false
                }]]
              }
            },
            detail: {
              offsetCenter: [0, '40%'],
              fontWeight: 'bold',
              fontSize: 50,
              color: '#ffcc33'
            },
            splitLine: {
              lineStyle: {
                opacity: 0.55,
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#C6E2FF' // 50% 处的颜色
                  }, {
                    offset: 1, color: '#E3E3E3' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            },
            pointer: { show: true,width:2 },
            itemStyle: { opacity:0.4 },
            axisTick: {
              length: 10,
              lineStyle: {
                width: 3,
                opacity: 0.3,
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: '#C6E2FF' // 50% 处的颜色
                  }, {
                    offset: 1, color: '#E3E3E3' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              }
            }
          }]
      }
      //颜色判断设置
      for (let i = 0; i < this.option.series.length; i++) {
        if (this.option.series[i].data[0].value <= 35) {
          this.option.series[i].detail.color = '#66ccff'
        } else if (35 < this.option.series[i].data[0].value && this.option.series[i].data[0].value <= 74) {
          this.option.series[i].detail.color = '#ffcc33'
        } else {
          this.option.series[i].detail.color = '#ff0033'
        }
      }

    }
  }
}
</script>

<style scoped>
.deviceParams {
  height: 500px;
}
</style>
