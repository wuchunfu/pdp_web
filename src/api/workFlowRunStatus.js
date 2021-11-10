import request from '../utils/request';

export const queryEveryDayWorkFlowRunStatusStatistics = query => {
    return request.post('/process_instance/every_day_run_status_statistics', query);
};