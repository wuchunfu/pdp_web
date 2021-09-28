import request from '../utils/request';

export const selectAuthList = query => {
    return request.post('/auth/selectAuthList', query);
};

export const selectAllAuth = query => {
    return request.post('/auth/selectAllAuth', query);
};

export const insertAuth = query => {
    return request.post('/auth/insertAuth', query);
};

export const updateAuth = query => {
    return request.post('/auth/updateAuth', query);
};

export const updateAuthStatus = query => {
    return request.post('/auth/updateAuthStatus', query);
};

export const selectAuthTree = query => {
    return request.post('/auth/selectAuthTree', query);
};
