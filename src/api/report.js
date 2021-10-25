import request from '../utils/request';

export const selectReportList = query => {
    return request.post('/report/report_list', query);
};
export const insertReport = query => {
    return request.post('/report/add_report', query);
};
export const selectReportType = query => {
    return request.post('/report/report_type', query);
};
export const selectAllReport = query => {
    return request.post('/report/report_all', query);
};
export const updateReportInfo = query => {
    return request.post('/report/report_update', query);
};
export const deletereport = query => {
    return request.post('/report/report_delete', query);
};
export const testAddConn = query => {
    return request.post('/report/test_add_conn', query);
};
export const testEditConn = query => {
    return request.post('/report/test_edit_conn', query);
};