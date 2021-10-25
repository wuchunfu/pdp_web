import request from '../utils/request';

export const selectPlatformLinkList = query => {
    return request.post('/platformLink/list', query);
};

export const selectAllPlatformLink = query => {
    return request.post('/platformLink/all', query);
};

export const insertPlatformLink = query => {
    return request.post('/platformLink/add', query);
};

export const updatePlatformLink = query => {
    return request.post('/platformLink/update', query);
};