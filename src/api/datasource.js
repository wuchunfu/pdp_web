import request from '../utils/request';

export const selectDatasourcesList = query => {
    return request.post('/datasource/data_sources_list', query);
};
export const insertDatasource = query => {
    return request.post('/datasource/add_data_sources', query);
};
export const selectDataSourcesType = query => {
    return request.post('/datasource/data_sources_type', query);
};
export const selectAllDatasources = query => {
    return request.post('/datasource/data_sources_all', query);
};
export const updateDatasourcesInfo = query => {
    return request.post('/datasource/data_sources_update', query);
};
export const deleteDatasource = query => {
    return request.post('/datasource/data_sources_delete', query);
};
export const testAddConn = query => {
    return request.post('/datasource/test_add_conn', query);
};
export const testEditConn = query => {
    return request.post('/datasource/test_edit_conn', query);
};