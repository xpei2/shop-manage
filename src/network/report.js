import { request } from "./request";

// 获取数据报表数据
export function getEchartData() {
    return request({
        url: `/reports/type/1`
    });
}
