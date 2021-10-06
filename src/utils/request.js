import axios from 'axios';
import {MessageBox} from 'element-ui';
import router from '../router';
import md5 from 'js-md5';

export const  baseUrl = 'http://localhost:8807';

const
    service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: baseUrl,
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            var code = response.data.code;
            if (code == '401') {
                MessageBox.alert("登陆过期，请重新登录", "温馨提示", {
                    confirmButtonText: '确定',
                    type:'error',
                    callback: action => {
                        router.push("login")
                    }
                });
                return false;
            }
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

//封装get请求
function get(url, params = {}) {
    return service({
        url,
        method: 'GET',
        headers: {},
        params
    })
}

//封装post请求
function post(url, data = {}) {
    var time = Date.parse( new Date() ).toString().substr(0,10);
    var userId = null;
    var token = null;
    if (url != "/login/login"){
        token = localStorage.getItem('token');
        if (token == null){
            MessageBox.alert("登陆过期，请重新登录", "温馨提示", {
                confirmButtonText: '确定',
                type:'error',
                callback: action => {
                    router.push("login")
                }
            });
            return false;
        }
        userId = JSON.parse(localStorage.getItem('userEntity')).id
    }
    return service({
        url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: JSON.stringify({
            "userId": userId,
            "token": token,
            "sysId": 1,
            "sign": md5("reqData=" + data +"&time=" + time + "&token=" + token),
            "time": time,
            "data": data,
        })
    })
}

export default {
    get, post, baseUrl
}
