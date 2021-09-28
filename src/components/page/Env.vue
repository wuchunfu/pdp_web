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
                <div class="grid-content bg-purple">
                    内存
                    <div class="col-child">
                        <div>内存总量：{{memory}}</div>
                        <div>已用内存：{{memoryUse}}</div>
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content bg-purple">
                    磁盘
                    <div class="col-child">
                        <div>磁盘总量：{{diskSpaceTotal}}(G)</div>
                        <div>空闲磁盘：{{diskSpaceFree}}(G)</div>
                    </div>
                </div>
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
                <div class="grid-content bg-purple">
                    JVM线程
                    <div class="col-child">
                        <div>JVM 守护线程数量：{{threadsDaemon}}</div>
                        <div>JVM 当前活跃线程数量：{{threadsLive}}</div>
                    </div>
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
                threadsLive: ""
            };
        },
        mounted() {
            this.env();
            this.timer = setInterval(() => {
                setTimeout(this.env, 0)
            }, 1000*60)
        },
        methods: {
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
