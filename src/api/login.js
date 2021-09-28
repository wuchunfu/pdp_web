import request from '../utils/request';

export const login = query => {
    return request.post('/login/login', query);
};

export const selectLoginLogList = query => {
    return request.post('/login/selectLoginLogList', query);
};
