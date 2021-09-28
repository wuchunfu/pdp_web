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
export const selectDatasourcesInfoById = query => {
    return request.post('/datasource/data_sources_info', query);
};
export const updateDatasourcesInfo = query => {
    return request.post('/datasource/data_sources_update', query);
};
export const deleteDatasource = query => {
    return request.post('/datasource/data_sources_delete', query);
};