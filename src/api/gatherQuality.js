import request from '../utils/request';

export const selectGatherQualityList = query => {
    return request.post('/gather_quality/quality_job_list', query);
};
export const selectQualityRules = query => {
    return request.post('/gather_quality/check_rules', query);
};
export const deleteGatherQuality = query => {
    return request.post('/gather_quality/quality_job_delete', query);
};
export const insertGatherQuality = query => {
    return request.post('/gather_quality/quality_job_add', query);
};
export const updateGatherQuality = query => {
    return request.post('/gather_quality/quality_job_update', query);
};


