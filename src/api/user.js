import request from '../utils/request';

export const selectUserList = query => {
    return request.post('/user/selectUserList', query);
};

export const insertUser = query => {
    return request.post('/user/insertUser', query);
};

export const updateUser = query => {
    return request.post('/user/updateUser', query);
};

export const deleteUser = query => {
    return request.post('/user/deleteUser', query);
};