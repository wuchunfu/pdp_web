import request from '../utils/request';

export const selectCheckResultList = query => {
    return request.post('/quality_report/check_result_list', query);
};


