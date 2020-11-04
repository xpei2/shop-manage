import axios from "axios";

export function request(config) {
    const instance = axios.create({
        baseURL: "http://shop.xpei.ren:8888/api/private/v1/",
        timeout: 5000
    });

    // 请求拦截
    instance.interceptors.request.use(
        config => {
            // 设置Authorization字段为token指令
            config.headers.Authorization = window.sessionStorage.getItem(
                "token"
            );
            return config;
        },
        err => {
            return Promise.reject(err);
        }
    );

    // 响应拦截
    instance.interceptors.response.use(
        res => {
            return res;
        },
        err => {
            return Promise.reject(err);
        }
    );

    // 发送请求
    return instance(config);
}
