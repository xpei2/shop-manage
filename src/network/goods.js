import { request } from "./request";

// 获取Cate数据
export function getCateData(type, pagenum, pagesize) {
    return request({
        url: "/categories",
        params: {
            type,
            pagenum,
            pagesize
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
export function getCateInfo(cateId) {
    return request({
        url: `/categories/${cateId}`,
        method: 'get',
    })
}

// 编辑分类信息
export function putCateEdit(cateId, cat_name) {
    return request({
        url: `/categories/${cateId}`,
        method: 'put',
        data: {
            cat_name
        }
    })
}

// 删除分类
export function deleteCate(cateId){
    return request({
        url: `/categories/${cateId}`,
        method: 'delete'
    })
}


// 获取参数数据
export function getParamsData(cateId, sel){
    return request({
        url: `categories/${cateId}/attributes`,
        params:{
            sel
        }
    })
}

// 添加动态参数或者静态属性
export function postAddParams(cateId, obj){
    return request({
        url: `categories/${cateId}/attributes`,
        method: 'post',
        data:{
            attr_name: obj.attr_name,
            attr_sel: obj.attr_sel,
            attr_vals: obj.attr_vals ? obj.attr_vals : '',
        }
    })
}

// 获取参数信息
export function getParamsInfo(cateId, attrId, attr_sel, attr_vals) {
    return request({
        url: `/categories/${cateId}/attributes/${attrId}`,
        method: 'get',
        params: {
            attr_sel,
            attr_vals
        }
    })
}

// 编辑参数信息
export function putParamsEdit(cateId, attrId, obj) {
    return request({
        url:  `/categories/${cateId}/attributes/${attrId}`,
        method: 'put',
        data: {
            attr_name: obj.attr_name,
            attr_sel: obj.attr_sel,
            attr_vals: Array.isArray(obj.attr_vals) ? obj.attr_vals.join(' ') : obj.attr_vals
        }
    })
}


// 删除参数
export function deleteParams(cateId, attrId){
    return request({
        url: `/categories/${cateId}/attributes/${attrId}`,
        method: 'delete'
    })
}