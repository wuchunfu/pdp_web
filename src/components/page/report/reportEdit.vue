<template>
  <div id="job">
    <iframe
        style="border:none; margin: -57px 0 0 0px"
        :width="searchTableWidth"
        :height="searchTableHeight"
        v-bind:src="reportUrl"
    ></iframe>
  </div>
</template>
<script>
import {reportBaseUrl} from "../../../utils/request";

export default {
  methods: {
    widthHeight() {
      this.searchTableHeight = window.innerHeight - 10;
      this.searchTableWidth = window.innerWidth -280
    },
  },
  data() {
    return {
      reportUrl: reportBaseUrl + '/jmreport/list',
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
    this.reportUrl = reportBaseUrl + '/jmreport/list'
  },
  watch: {
    '$route': function () {
      // 监听路由变化
      this.reportUrl = reportBaseUrl + '/jmreport/list'
    }
  }
}
</script>