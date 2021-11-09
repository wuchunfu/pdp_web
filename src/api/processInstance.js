import request from '../utils/request';

export const selectProcessInstanceList = query => {
    return request.post('/process_instance/process_instance_list', query);
};