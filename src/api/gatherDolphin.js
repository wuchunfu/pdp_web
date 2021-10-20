import request from '../utils/request';

export const selectGatherDolphinList = query => {
    return request.post('/gather_dolphin/job_list', query);
};
export const insertGatherDolphin = query => {
    return request.post('/gather_dolphin/add_job', query);
};
export const selectGatherDolphinsType = query => {
    return request.post('/gather_dolphin/data_sources_type', query);
};
export const selectGatherDolphinsInfoById = query => {
    return request.post('/gather_dolphin/job_info', query);
};
export const updateGatherDolphinsInfo = query => {
    return request.post('/gather_dolphin/job_update', query);
};
export const deleteGatherDolphin = query => {
    return request.post('/gather_dolphin/job_delete', query);
};

export const selectDBByDatasource = query => {
    return request.post('/gather_dolphin/db', query);
};
export const selectTableByDB = query => {
    return request.post('/gather_dolphin/table', query);
};
export const selectSyncType = query => {
    return request.post('/gather_dolphin/sync_type', query);
};
export const onLineDolphinJob = query => {
    return request.post('/gather_dolphin/online', query);
};
export const offLineDolphinJob = query => {
    return request.post('/gather_dolphin/offline', query);
};
export const delJobOnDolphin = query => {
    return request.post('/gather_dolphin/del_dolphin_Job', query);
};
export const syncDolphinJobJson = query => {
    return request.post('/gather_dolphin/sync_dolphin_Job_info', query);
};
export const createJobByJson = query => {
    return request.post('/gather_dolphin/create_job_by_json', query);
};
export const createJobByTemplate = query => {
    return request.post('/gather_dolphin/create_job_by_template', query);
};
export const initJob = query => {
    return request.post('/gather_dolphin/init_job', query);
};