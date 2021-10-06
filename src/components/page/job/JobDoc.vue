<template>
  <div id="job">
    <iframe
        style="border:none; margin:0px 0 0 -6%"
        :width="searchTableWidth"
        :height="searchTableHeight"
        v-bind:src="reportUrl"
    ></iframe>
  </div>
</template>
<script>

export default {
  methods: {
    widthHeight() {
      this.searchTableHeight = window.innerHeight -150;
      this.searchTableWidth = window.innerWidth - 40
    },
  },
  data() {
    return {
      reportUrl: 'https://www.xuxueli.com/xxl-job/#%E3%80%8A%E5%88%86%E5%B8%83%E5%BC%8F%E4%BB%BB%E5%8A%A1%E8%B0%83%E5%BA%A6%E5%B9%B3%E5%8F%B0XXL-JOB%E3%80%8B',
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
    this.reportUrl = 'https://www.xuxueli.com/xxl-job/#%E3%80%8A%E5%88%86%E5%B8%83%E5%BC%8F%E4%BB%BB%E5%8A%A1%E8%B0%83%E5%BA%A6%E5%B9%B3%E5%8F%B0XXL-JOB%E3%80%8B'
  },
  watch: {
    '$route': function () {
      // 监听路由变化
      this.reportUrl = 'https://www.xuxueli.com/xxl-job/#%E3%80%8A%E5%88%86%E5%B8%83%E5%BC%8F%E4%BB%BB%E5%8A%A1%E8%B0%83%E5%BA%A6%E5%B9%B3%E5%8F%B0XXL-JOB%E3%80%8B'
    }
  }
}
</script>