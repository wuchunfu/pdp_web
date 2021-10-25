import request from '../utils/request';

export const getMetaDataChangeList = query => {
    return request.post('/metaData/change/list', query);
};