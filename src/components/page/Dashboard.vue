<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-card shadow="hover" class="mgb20" style="height:100px;">
                  <div>
                    <div class="dataAmount" style="float:left;color:#0080FF">
                        <h3>
                          今日工作流数
                        </h3>
                        <h1 id="allTaskNum">{{ todayWorkFlowNumber }}</h1>
                    </div>
                    <div class="dataAmount" style="float:left;color:#00DB00">
                      <h3>
                        开启调度数
                      </h3>
                      <h1 id="allDispatchRunNum">{{ openScheduleNumber }}</h1>
                    </div>
                    <div class="dataAmount" style="float:left;color:#00DB00">
                      <h3>
                        今日成功数
                      </h3>
                      <h1 id="successNum">{{ todayWorkFlowSuccessNumber }}</h1>
                    </div>
                    <div class="dataAmount" style="float:left;color:#FF2D2D">
                      <h3>
                        今日失败数
                      </h3>
                      <h1 id="errorNum">{{ todayWorkFlowFailNumber }}</h1>
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
import {queryEveryDayWorkFlowRunStatusStatistics} from "@/api/workFlowRunStatus";
import moment from "moment";
export default {
    name: 'dashboard',
    data() {
        return {
            name: localStorage.getItem('ms_username'),
            roleName: JSON.parse(localStorage.getItem('roleEntities'))[0].name,
            time: localStorage.getItem('time'),
            address: localStorage.getItem('address') === ''?"获取失败":localStorage.getItem('address'),
            tableLogData: [],
            todayWorkFlowNumber: 0,
            openScheduleNumber: 0,
            todayWorkFlowSuccessNumber: 0,
            todayWorkFlowFailNumber: 0,
        };
    },
    components: {
        trend: Trend,
        dataQuality: DataQuality,
    },
    mounted() {
      this.getTodayWorkFlowData();
    },
    methods: {
      // 发送请求，获取数据
      async getTodayWorkFlowData() {
        let query = {
          start_unix_time: moment().startOf('day').unix(),
          end_unix_time: moment().endOf('day').unix(),
        }
        await queryEveryDayWorkFlowRunStatusStatistics(query).then(res => {
          if (res.code == '200') {
            let resData = res.data;
            let successEle = resData[0];
            let failEle = resData[1];
            let successLen = resData[0].length;
            let failLen = resData[1].length;
            if (successLen >=1 ) {
              this.todayWorkFlowSuccessNumber = successEle[0].count;
            }
            if (failLen >=1 ) {
              this.todayWorkFlowFailNumber = failEle[0].count;
            }
            this.todayWorkFlowNumber = this.todayWorkFlowSuccessNumber + this.todayWorkFlowFailNumber;
            this.openScheduleNumber = this.todayWorkFlowSuccessNumber + this.todayWorkFlowFailNumber;
          }
        })
      }
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
