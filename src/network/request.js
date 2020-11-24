import axios from "axios";
import NProgress from "nprogress";

export function request(config) {
    const instance = axios.create({
        baseURL: "http://119.23.53.78:8888/api/private/v1/",
        timeout: 5000
    });

    // 请求拦截
    instance.interceptors.request.use(
        config => {
            // 设置Authorization字段为token指令
            config.headers.Authorization = window.sessionStorage.getItem(
                "token"
            );
            // 展示进度条，NProgress.start()
            NProgress.start();
            return config;
        },
        err => {
            return Promise.reject(err);
        }
    );

    // 响应拦截
    instance.interceptors.response.use(
        res => {
            // 隐藏进度条，NProgress.done()
            NProgress.done();
            NProgress.done();
            return res;
        },
        err => {
            return Promise.reject(err);
        }
    );

    // 发送请求
    return instance(config);
}
