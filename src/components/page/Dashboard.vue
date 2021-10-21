<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card shadow="hover" class="mgb20" style="height:100px;">
                  <div>
                    <div class="dataAmount" style="float:left;color:#0080FF">
                        <h3>
                          总任务数
                        </h3>
                        <h1 id="allTaskNum">1540</h1>
                    </div>
                    <div class="dataAmount" style="float:left;color:#0080FF">
                      <h3>
                        总调度数
                      </h3>
                      <h1 id="allDispatchNum">1540</h1>
                    </div>
                    <div class="dataAmount" style="float:left;color:#00DB00">
                      <h3>
                        开启调度数
                      </h3>
                      <h1 id="allDispatchRunNum">1540</h1>
                    </div>
                    <div class="dataAmount" style="float:left;color:#00DB00">
                      <h3>
                        今日成功数
                      </h3>
                      <h1 id="successNum">1540</h1>
                    </div>
                    <div class="dataAmount" style="float:left;color:#FFD306">
                      <h3>
                        今日告警数
                      </h3>
                      <h1 id="alarmNum">1540</h1>
                    </div>
                    <div class="dataAmount" style="float:left;color:#FF2D2D">
                      <h3>
                        今日失败数
                      </h3>
                      <h1 id="errorNum">1540</h1>
                    </div>
                  </div>
                </el-card>
            </el-col>
            <el-col :span="24">
                <el-card shadow="hover" style="height:600px;">
                  <div style="float:left">
                    <trend style="float:left"></trend>
                    <dataQuality style="float:right"></dataQuality>
                  </div>
                </el-card>
            </el-col>
            <el-col :span="24">
              <el-card shadow="hover" style="height:600px;">
              </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Trend from '@/components/report/Trend'
import DataQuality from "@/components/report/DataQuality";
export default {
    name: 'dashboard',
    data() {
        return {
            name: localStorage.getItem('ms_username'),
            roleName: JSON.parse(localStorage.getItem('roleEntities'))[0].name,
            time: localStorage.getItem('time'),
            address: localStorage.getItem('address') === ''?"获取失败":localStorage.getItem('address'),
            tableLogData: [],
        };
    },
    components: {
        trend: Trend,
        dataQuality: DataQuality,
    },
    mounted() {
    },
    methods: {
    }
};
</script>


<style scoped>

.mgb20 {
    margin-bottom: 10px;
}

.dataAmount {
  font-size: 15px;
  color: #222;
  width: 250px;
  height: 50px;
}
</style>
