import { request } from "./request";

// 获取orders数据
export function getOrdersData(query,pagenum,pagesize) {
    return request({
        url: "/orders",
        params: {
            query,
            pagenum,
            pagesize
        }
    });
}

// 获取物流信息
export function getProgressData(id) {
    return request({
        url: `/kuaidi/${id}`
    })
}
