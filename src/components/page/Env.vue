<template>
    <div>
        <div style="text-align: center">
            <h1>系统环境监控</h1>
            <span>一分钟刷新一次</span>
        </div>
        <el-row :gutter="20">
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    系统信息
                    <div class="col-child">
                        <div>操作系统：{{osName}}</div>
                        <div>Java版本：{{javaVersion}}</div>
                        <div>程序启动时间：{{upTime}}</div>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    CPU
                    <div class="col-child">
                        <div>CPU总量：{{cpuCount}}</div>
                        <div>CPU使用率：{{cpuUse}}</div>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple" id="memoryChart"></div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple" id="diskChart"></div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    JVM缓存区
                    <div class="col-child">
                        <div>JVM 缓冲区已用内存：{{bufferUse}}</div>
                        <div>当前缓冲区数量：{{bufferTotal}}</div>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple" id="threadsChart">
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {env, metrics, health} from '../../api/sys';

    export default {
        name: 'dashboard',
        data() {
            return {
                osName: "",
                javaVersion: "",
                upTime: "",
                cpuCount: "",
                cpuUse: "",
                memory: "",
                memoryUse: "",
                diskSpaceTotal: "",
                diskSpaceFree: "",
                bufferUse: "",
                bufferTotal: "",
                threadsDaemon: "",
                threadsLive: "",
                chartInstance: null,
            };
        },
        mounted() {
            this.env();
            this.initMemoryChart();
            this.initDiskChart();
            this.initThreadsChart();
            this.timer = setInterval(() => {
                setTimeout(this.env, 0)
            }, 1000*60)
            setTimeout(this.initMemoryChart, 1000*1)
            setTimeout(this.initDiskChart, 1000*1)
            setTimeout(this.initThreadsChart, 1000*1)
        },
        destroyed() {
          clearInterval(this.timer)
        },
      methods: {
            initPieChart(elementTag) {
              this.chartInstance = this.$echarts.init(elementTag);
              const initOption = {
                title: {
                  left: 'center'
                },
                tooltip: {
                  trigger: 'item'
                },
                legend: {
                  orient: 'vertical',
                  left: 'left'
                },
                series: [
                  {
                    type: 'pie',
                    radius: '50%',
                    emphasis: {
                      itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                    }
                  }
                ]
              };
              this.chartInstance.setOption(initOption);
            },
            initMemoryChart() {
              // 初始化memory chart实例
              this.initPieChart(document.getElementById('memoryChart'))
              // 绘制图表
              const option = {
                title: {
                  text: 'Memory',
                },
                series: [
                  {
                    name: 'memory',
                    data: [
                      { value: 0, name: 'memory use' },
                      { value: 0, name: 'memory free' }
                    ],
                  }
                ]
              };
              option.series[0].data[0].value = this.memoryUse;
              option.series[0].data[1].value = this.memory - this.memoryUse;
              this.chartInstance.setOption(option);
            },
            initDiskChart() {
              // 初始化echarts实例
              this.initPieChart(document.getElementById('diskChart'));
              // 绘制图表
              const option = {
                title: {
                  text: 'Disk',
                },
                series: [
                  {
                    name: 'disk',
                    data: [
                      { value: 0, name: 'disk use(G)' },
                      { value: 0, name: 'disk free(G)' }
                    ],
                  }
                ]
              };
              option.series[0].data[0].value = this.diskSpaceTotal - this.diskSpaceFree;
              option.series[0].data[1].value = this.diskSpaceFree;
              this.chartInstance.setOption(option);
            },
            initThreadsChart() {
              // 初始化echarts实例
              this.initPieChart(document.getElementById('threadsChart'));
              // 绘制图表
              const option = {
                title: {
                  text: 'Threads',
                },
                series: [
                  {
                    name: 'JVM threads',
                    data: [
                      { value: 0, name: 'jvm daemon thread(jvm守护线程数量)' },
                      { value: 0, name: 'jvm active threads(jvm活跃线程数量)' }
                    ],
                  }
                ]
              };
              option.series[0].data[0].value = this.threadsDaemon
              option.series[0].data[1].value = this.threadsLive;
              this.chartInstance.setOption(option);
            },
            env() {
                env("os.name").then(res => {
                    this.osName = res.property.value
                }).catch((res) => {
                    console.log("异常:" + res)
                });
                env("java.runtime.version").then(res => {
                    this.javaVersion = res.property.value
                }).catch((res) => {
                    console.log("异常:" + res)
                });
                metrics("process.start.time").then(res => {
                    this.upTime = res.measurements[0].value.toString().substring(0, 10)
                    this.upTime = this.timestampToTime(this.upTime);
                }).catch((res) => {
                    console.log("异常:" + res)
                });
                metrics("system.cpu.count").then(res => {
                    this.cpuCount = res.measurements[0].value
                }).catch((res) => {
                    console.log("异常:" + res)
                });
                metrics("system.cpu.usage").then(res => {
                    this.cpuUse = res.measurements[0].value
                }).catch((res) => {
                    console.log("异常:" + res)
                });
                metrics("jvm.memory.max").then(res => {
                    this.memory = res.measurements[0].value
                }).catch((res) => {
                    console.log("异常:" + res)
                });
                metrics("jvm.memory.used").then(res => {
                    this.memoryUse = res.measurements[0].value
                }).catch((res) => {
                    console.log("异常:" + res)
                });
                health("diskSpace").then(res => {
                    this.diskSpaceTotal = res.details.total.toString().substring(0,5)/100
                    this.diskSpaceFree = res.details.free.toString().substring(0,5)/100
                }).catch((res) => {
                    console.log("异常:" + res)
                });
                metrics("jvm.buffer.memory.used").then(res => {
                    this.bufferUse = res.measurements[0].value
                }).catch((res) => {
                    console.log("异常:" + res)
                });
                metrics("jvm.buffer.total.capacity").then(res => {
                    this.bufferTotal = res.measurements[0].value
                }).catch((res) => {
                    console.log("异常:" + res)
                });
                metrics("jvm.threads.daemon").then(res => {
                    this.threadsDaemon = res.measurements[0].value
                }).catch((res) => {
                    console.log("异常:" + res)
                });
                metrics("jvm.threads.live").then(res => {
                    this.threadsLive = res.measurements[0].value
                }).catch((res) => {
                    console.log("异常:" + res)
                });
            },
            timestampToTime(timestamp) {
                var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var D = date.getDate() + ' ';
                var h = date.getHours() + ':';
                var m = date.getMinutes() + ':';
                var s = date.getSeconds();
                return Y + M + D + h + m + s;
            }
        }
    }
    ;
</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
        background-color: #fde2e2;
    }

    .el-col {
        border-radius: 4px;
        margin-top: 15px;
    }

    .bg-purple-dark {
        background: #99a9bf;
    }

    .bg-purple {
        padding: 15px;
        background: white;
        height: 150px;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }

    .col-child {
        margin-top: 30px;
    }
</style>
