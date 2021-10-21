<template>
    <div id="trend" style="height: 300px; width: 600px"></div>
</template>

<script>
import getDateList from "@/components/common/getDateList";
export default {
  // 工作流运行趋势
  name: 'Trend',
  data() {
    return {
      // 图表的实例对象
      chartInstance: null,
      // 从服务器中获取的所有数据
      allData: null,
    }
  },
  mounted() {
    this.initChart();
    this.getData();
    // 图标跟随屏幕自适应
    window.addEventListener('resize', this.screenAdapter)
    // 主动触发 响应式配置
    this.screenAdapter()
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化图表的方法
    initChart() {
      this.chartInstance = this.$echarts.init(document.getElementById('trend'))
      let xAxisDateList = getDateList(30,24*60*60*1000)
      const initOption = {
        title: {
          text: 'WorkFlow',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: xAxisDateList,
            axisTick: {
              alignWithLabel: true,
              interval: 0,
            },
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'success',
            type: 'bar',
            color: '#A6FFA6',
            barWidth: 13, //设置柱子的宽度
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
          },
          {
            name: 'fail',
            type: 'bar',
            color: '#FF5151',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
          },
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    // 发送请求，获取数据  //websocket： realData 服务端发送给客户端需要的数据
    async getData(res) {
      // const { data: res } = await this.$http.get('http://101.34.160.195:8888/api/trend')
      // this.allData = res
      // console.log('res: ', res)
      this.updateChart()
    },
    // 更新图表配置项
    updateChart() {
      const dataOption = {
        series: [
          {
            data: [50, 49, 48, 50, 49, 48, 50, 50, 49, 48, 50, 49, 48, 50, 50, 49, 48, 50, 49, 48, 50, 50, 49, 48, 50, 49, 48, 50, 50, 50, 50]
          },
          {
            data: [0, 1, 2, 0, 1, 2, 0, 0, 1, 2, 0, 1, 2, 0, 0, 1, 2, 0, 1, 2, 0,0, 1, 2, 0, 1, 2, 0, 0, 0, 0]
          },
        ]
      };
      this.chartInstance.setOption(dataOption);
    },
    // 不同分辨率的响应式
    screenAdapter() {
      this.chartInstance.resize()
    },
  }
}
</script>
