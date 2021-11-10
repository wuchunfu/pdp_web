import request from '../utils/request';
// 每天数据数量校验成功的工作流数量
export const queryWorkFlowEveryDayDataCountCheckResultStatistics = query => {
    return request.post('/quality_report/every_day_check_result_statistic', query);
};