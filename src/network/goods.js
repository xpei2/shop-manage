import { request } from "./request";

// 获取users数据
export function getCateData(obj) {
    return request({
        url: "/categories",
        params: {
            type: obj.type,
            pagenum: obj.pagenum ? obj.pagenum : '',
            pagesize: obj.pagesize ? obj.pagesize : ''
        }
    });
}


// 添加分类
export function postAddCate(obj) {
    return request({
        url: '/categories',
        method: 'post',
        data: {
            cat_pid: obj.cat_pid,
            cat_name: obj.cat_name,
            cat_level: obj.cat_level,
        }
    })
}

// 获取分类信息
export function getCateInfo(id) {
    return request({
        url: `/categories/${id}`,
        method: 'get',
    })
}

// 编辑用户信息
export function putCateEdit(id, cat_name) {
    return request({
        url: `/categories/${id}`,
        method: 'put',
        data: {
            cat_name
        }
    })
}

// 删除用户
export function deleteCate(id){
    return request({
        url: `/categories/${id}`,
        method: 'delete'
    })
}
