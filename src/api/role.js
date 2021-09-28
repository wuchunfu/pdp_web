import request from '../utils/request';

export const selectRoleList = query => {
    return request.post('/role/selectRoleList', query);
};

export const selectAllRole = query => {
    return request.post('/role/selectAllRole', query);
};

export const insertRole = query => {
    return request.post('/role/insertRole', query);
};

export const updateRole = query => {
    return request.post('/role/updateRole', query);
};

export const updateRoleStatus = query => {
    return request.post('/role/updateRoleStatus', query);
};

export const selectAllAuthIdByRoleId = query => {
    return request.post('/role/selectAllAuthIdByRoleId', query);
};

export const insertRoleAndAuth = query => {
    return request.post('/role/insertRoleAndAuth', query);
};