<template>
    <div id="trend" style="height: 300px; width: 600px"></div>
</template>

<script>
import getDateList from "@/components/common/getDateList";
import {queryEveryDayWorkFlowRunStatusStatistics} from "@/api/workFlowRunStatus";
import moment from "moment";
export default {
  // 工作流运行趋势
  name: 'Trend',
  data() {
    return {
      // 图表的实例对象
      chartInstance: null,
      // 从服务器中获取的所有数据
      allData: null,
      query: {},
      xAxisDateList:[],
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
      this.xAxisDateList = getDateList(30,24*60*60*1000)
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
            data: this.xAxisDateList,
            axisLabel:{
              interval:0,
              rotate:45,//倾斜度 -90 至 90 默认为0
            },
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

    // 发送请求，获取数据
    async getData() {
      // 最近一个月每天运行成功的工作流数量
      let recentMonthEveryDayWorkFlowSuccessCountList = [];
      // 最近一个月每天运行失败的工作流数量
      let recentMonthEveryDayWorkFlowFailCountList = [];
      this.query = {
        start_unix_time: moment().subtract(1, "months").unix(),
        end_unix_time: moment().subtract(1, "days").unix(),
      }
      await queryEveryDayWorkFlowRunStatusStatistics(this.query).then(res => {
        if (res.code == '200') {
          // 对返回值结果做处理
          // 初始化map集合
          let everyDaySuccessCountMap = new Map();
          let recentMonthDay = this.xAxisDateList;
          let recentMonthDayArrLen = this.xAxisDateList.length;
          for (let recentMonthDayIndex=0; recentMonthDayIndex < recentMonthDayArrLen; recentMonthDayIndex++) {
            let dateKey = recentMonthDay[recentMonthDayIndex]
            everyDaySuccessCountMap.set(dateKey,0)
          }

          let everyDayFailCountMap = new Map();
          for (let recentMonthDayIndex=0; recentMonthDayIndex < recentMonthDayArrLen; recentMonthDayIndex++) {
            let dateKey = recentMonthDay[recentMonthDayIndex]
            everyDayFailCountMap.set(dateKey,0)
          }
          // 组织数据
          let dataLen = res.data.length;
          let resData = res.data;
          for (let i=0; i < dataLen; i++) {
            let arrEle = resData[i];
            let arrEleLen = arrEle.length;
            if(arrEleLen !== 0) {
              for (let j=0; j < arrEleLen; j++) {
                let dataEle = arrEle[j];
                if (dataEle.state === 'SUCCESS') {
                  everyDaySuccessCountMap.set(dataEle.schedulingTime, dataEle.count);
                }
                if (dataEle.state === 'FAILURE') {
                  everyDayFailCountMap.set(dataEle.schedulingTime, dataEle.count);
                }
              }
            }
          }

          const everyDaySuccessCountMapIterator = everyDaySuccessCountMap.values();
          let successMapIndex = 0;
          while (successMapIndex < everyDaySuccessCountMap.size) {
            recentMonthEveryDayWorkFlowSuccessCountList.push(everyDaySuccessCountMapIterator.next().value);
            successMapIndex ++;
          }

          const everyDayFailCountMapIterator = everyDayFailCountMap.values();
          let failMapIndex = 0;
          while (failMapIndex < everyDayFailCountMap.size) {
            recentMonthEveryDayWorkFlowFailCountList.push(everyDayFailCountMapIterator.next().value);
            failMapIndex ++;
          }

          everyDaySuccessCountMap.clear();
          everyDayFailCountMap.clear();
        }
      })
      this.updateChart(recentMonthEveryDayWorkFlowSuccessCountList, recentMonthEveryDayWorkFlowFailCountList)
    },
    // 更新图表配置项
    updateChart(data1, data2) {
      const dataOption = {
        series: [
          {
            // 测试用：data: [50, 49, 48, 50, 49, 48, 50, 50, 49, 48, 50, 49, 48, 50, 50, 49, 48, 50, 49, 48, 50, 50, 49, 48, 50, 49, 48, 50, 50, 50, 50]
            data: data1
          },
          {
            // 测试用：data: [0, 1, 2, 0, 1, 2, 0, 0, 1, 2, 0, 1, 2, 0, 0, 1, 2, 0, 1, 2, 0,0, 1, 2, 0, 1, 2, 0, 0, 0, 0]
            data: data2
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
