<template>
  <div id="dataQuality" style="height: 300px; width: 600px"></div>
</template>

<script>
import getDateList from "@/components/common/getDateList";
import {
  queryWorkFlowEveryDayDataCountCheckResultStatistics,
  queryWorkFlowEveryDayDataCountCheckResultStatisticsList,
} from "@/api/dataQuality";
import moment from "moment";
export default {
  // 数据质量
  name: 'DataQuality',
  data() {
    return {
      // 图表的实例对象
      chartInstance: null,
      // 从服务器中获取的所有数据
      allData: null,
      query:{},
      xAxisDateList: [],
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
      this.chartInstance = this.$echarts.init(document.getElementById('dataQuality'))
      this.xAxisDateList = getDateList(30,24*60*60*1000)
      const initOption = {
        title: {
          text: 'DataQuality',
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
            color: '#0080FF',
            barWidth: 13, //设置柱子的宽度
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
          },
          {
            name: 'fail',
            type: 'bar',
            color: '#FF60AF',
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
      // 最近一个月每天数据数量校验成功的工作流数量
      let rMWFEDCCheckSuccessCountList = [];
      // 最近一个月每天数据数量校验失败的工作流数量
      let rMWFEDCCheckFailCountList = [];
      this.query = {
        start_unix_time: moment().subtract(1, "months").unix(),
        end_unix_time: moment().subtract(1, "days").unix(),
      }
      await queryWorkFlowEveryDayDataCountCheckResultStatistics(this.query).then(res => {
        if (res.code == '200') {
          // 对返回值结果做处理
          // 初始化map集合
          let everyDayCheckSuccessCountMap = new Map();
          let recentMonthDay = this.xAxisDateList;
          let recentMonthDayArrLen = this.xAxisDateList.length;
          for (let recentMonthDayIndex=0; recentMonthDayIndex < recentMonthDayArrLen; recentMonthDayIndex++) {
            let dateKey = recentMonthDay[recentMonthDayIndex]
            everyDayCheckSuccessCountMap.set(dateKey,0)
          }

          let everyDayCheckFailCountMap = new Map();
          for (let recentMonthDayIndex=0; recentMonthDayIndex < recentMonthDayArrLen; recentMonthDayIndex++) {
            let dateKey = recentMonthDay[recentMonthDayIndex]
            everyDayCheckFailCountMap.set(dateKey,0)
          }
          // 组织数据
          let dataLen = res.data.length;
          let resData = res.data;
          for (let i=0; i < dataLen; i++) {
            let arrEle = resData[i];
            let arrEleLen = arrEle.length;
            if(arrEleLen > 0) {
              for (let j=0; j < arrEleLen; j++) {
                let dataEle = arrEle[j];
                if (dataEle.result === '1') {
                  everyDayCheckSuccessCountMap.set(dataEle.createTime, dataEle.count);
                }
                if (dataEle.result === '0') {
                  everyDayCheckFailCountMap.set(dataEle.createTime, dataEle.count);
                }
              }
            }
          }
          const everyDayCheckSuccessCountMapIterator = everyDayCheckSuccessCountMap.values();
          let successMapIndex = 0;
          while (successMapIndex < everyDayCheckSuccessCountMap.size) {
            rMWFEDCCheckSuccessCountList.push(everyDayCheckSuccessCountMapIterator.next().value);
            successMapIndex ++;
          }

          const everyDayCheckFailCountMapIterator = everyDayCheckFailCountMap.values();
          let failMapIndex = 0;
          while (failMapIndex < everyDayCheckFailCountMap.size) {
            rMWFEDCCheckFailCountList.push(everyDayCheckFailCountMapIterator.next().value);
            failMapIndex ++;
          }

          everyDayCheckSuccessCountMap.clear();
          everyDayCheckFailCountMap.clear();
        }
      })
      this.updateChart(rMWFEDCCheckSuccessCountList, rMWFEDCCheckFailCountList)
    },
    // 更新图表配置项
    updateChart(data1, data2) {
      const dataOption = {
        series: [
          {
            data: data1
          },
          {
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
