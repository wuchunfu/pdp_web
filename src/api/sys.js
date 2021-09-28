import request from '../utils/request';

export const env = query => {
    return request.get('/actuator/env/' + query, query);
};

export const metrics = query => {
    return request.get('/actuator/metrics/' + query, query);
};

export const health = query => {
    return request.get('/actuator/health/' + query, query);
};