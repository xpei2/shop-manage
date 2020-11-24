import { request } from "./request";

// 获取users数据
export function getUsersData(query, pagenum, pagesize) {
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
export function putUserState(uuserId, type) {
    return request({
        url: `/users/${uuserId}/state/${type}`,
        method: "put"
    });
}

// 添加用户
export function postAddUser(obj) {
    return request({
        url: "/users",
        method: "post",
        data: {
            username: obj.username,
            password: obj.password,
            email: obj.email,
            mobile: obj.mobile
        }
    });
}

// 获取用户信息
export function getUserInfo(userId) {
    return request({
        url: `/users/${userId}`,
        method: "get"
    });
}

// 编辑用户信息
export function putUserEdit(userId, obj) {
    return request({
        url: `/users/${userId}`,
        method: "put",
        data: {
            email: obj.email,
            mobile: obj.mobile
        }
    });
}

// 删除用户
export function deleteUser(userId) {
    return request({
        url: `/users/${userId}`,
        method: "delete"
    });
}

// 分配角色提交
export function putSetRole(userId, rid) {
    return request({
        url: `/users/${userId}/role`,
        method: "put",
        data: {
            rid
        }
    });
}
