import { request } from "./request";

// 获取users数据
export function getUsers(query,pagenum,pagesize) {
    return request({
        url: "/users",
        params: {
            query,
            pagenum,
            pagesize
        }
    });
}

// 更新users的状态
export function putUserState(uid, type) {
    return request({
        url:`/users/${uid}/state/${type}`,
        method: 'put'
    })
}

// 添加用户
export function postAddUser(obj) {
    return request({
        url: '/users',
        method: 'post',
        data: {
            username: obj.username,
            password: obj.password,
            email: obj.email,
            mobile: obj.mobile
        }
    })
}

// 获取用户信息
export function getUserInfo(id) {
    return request({
        url: `/users/${id}`,
        method: 'get',
    })
}

// 编辑用户信息
export function putUserEdit(id, obj) {
    return request({
        url: `/users/${id}`,
        method: 'put',
        data: {
            email: obj.email,
            mobile: obj.mobile
        }
    })
}

// 删除用户
export function deleteUser(id){
    return request({
        url: `/users/${id}`,
        method: 'delete'
    })
}