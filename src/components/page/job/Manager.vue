<template>
  <div id="job">
    <iframe
        style="border:none; margin:0px 0 0 -240px"
        :width="searchTableWidth"
        :height="searchTableHeight"
        v-bind:src="reportUrl"
    ></iframe>
  </div>
</template>
<script>
import {baseUrl} from "../../../utils/request";

export default {
  methods: {
    widthHeight() {
      this.searchTableHeight = window.innerHeight - 200;
      this.searchTableWidth = window.innerWidth - 40
    },
  },
  data() {
    return {
      reportUrl: baseUrl + '/jobinfo',
      searchTableHeight: 0,
      searchTableWidth: 0
    }
  },
  mounted() {
    document.getElementsByName('content-wrapper');
    window.onresize = () => {
      this.widthHeight(); // 自适应高宽度
    };
    this.$nextTick(function () {
      this.widthHeight();
    });
  },
  created() {
    // 从路由里动态获取 url地址   具体地址看libs下util.js里的 backendMenuToRoute  方法
    this.reportUrl = baseUrl + '/jobinfo'
  },
  watch: {
    '$route': function () {
      // 监听路由变化
      this.reportUrl = baseUrl + '/jobinfo'
    }
  }
}
</script>