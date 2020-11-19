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
export function getCateInfo(goodsId) {
    return request({
        url: `/categories/${goodsId}`,
        method: 'get',
    })
}

// 编辑分类信息
export function putCateEdit(goodsId, cat_name) {
    return request({
        url: `/categories/${goodsId}`,
        method: 'put',
        data: {
            cat_name
        }
    })
}

// 删除分类
export function deleteCate(goodsId){
    return request({
        url: `/categories/${goodsId}`,
        method: 'delete'
    })
}


// 获取参数数据
export function getParamsData(goodsId, sel){
    return request({
        url: `categories/${goodsId}/attributes`,
        params:{
            sel
        }
    })
}

// 添加动态参数或者静态属性
export function postAddParams(goodsId, obj){
    return request({
        url: `categories/${goodsId}/attributes`,
        method: 'post',
        data:{
            attr_name: obj.attr_name,
            attr_sel: obj.attr_sel,
            attr_vals: obj.attr_vals ? obj.attr_vals : '',
        }
    })
}

// 获取参数信息
export function getParamsInfo(goodsId, attrId, attr_sel, attr_vals) {
    return request({
        url: `/categories/${goodsId}/attributes/${attrId}`,
        method: 'get',
        params: {
            attr_sel,
            attr_vals
        }
    })
}

// 编辑参数信息
export function putParamsEdit(goodsId, attrId, obj) {
    return request({
        url:  `/categories/${goodsId}/attributes/${attrId}`,
        method: 'put',
        data: {
            attr_name: obj.attr_name,
            attr_sel: obj.attr_sel,
            attr_vals: Array.isArray(obj.attr_vals) ? obj.attr_vals.join(' ') : obj.attr_vals
        }
    })
}


// 删除参数
export function deleteParams(goodsId, attrId){
    return request({
        url: `/categories/${goodsId}/attributes/${attrId}`,
        method: 'delete'
    })
}

// 获取商品数据
export function getGoodsData(query, pagenum, pagesize) {
    return request({
        url: "/goods",
        params: {
            query,
            pagenum,
            pagesize
        }
    });
}

// 添加商品
export function postAddGoods(obj) {
    return request({
        url: '/goods',
        method: 'post',
        data: obj
    })
}

// 获取商品信息
export function getGoodsInfo(goodsId) {
    return request({
        url: `/goods/${goodsId}`,
        method: 'get',
    })
}

// 编辑商品信息
export function putGoodsEdit(goodsId, obj) {
    return request({
        url: `/goods/${goodsId}`,
        method: 'put',
        data: obj
    })
}

// 删除商品
export function deleteGoods(goodsId){
    return request({
        url: `/goods/${goodsId}`,
        method: 'delete'
    })
}