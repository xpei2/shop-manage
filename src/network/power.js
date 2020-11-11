import { request } from './request'

// 获取权限列表数据
export function getRightsData(type){
    return request({
        url: `/rights/${type}`
    })
}

// 获取角色列表数据
export function getRolesData(){
    return request({
        url: '/roles',
    })
}

// 添加角色
export function postAddRoles(obj){
    return request({
        url: '/roles',
        method: 'post',
        data: {
            roleName: obj.roleName,
            roleDesc: obj.roleDesc
        }
    })
}

// 获取角色信息
export function getRolesInfo(roleId) {
    return request({
        url: `/roles/${roleId}`,
        method: 'get',
    })
}

// 编辑角色信息
export function putEditRoles(roleId, obj) {
    return request({
        url: `/roles/${roleId}`,
        method: 'put',
        data: {
            roleName: obj.roleName,
            roleDesc: obj.roleDesc
        }
    })
}

// 删除角色
export function deleteRoles(roleId){
    return request({
        url: `/roles/${roleId}`,
        method: 'delete'
    })
}

// 删除指定id权限
export function deleteRights(roleId, rightId){
    return request({
        url: `/roles/${roleId}/rights/${rightId}`,
        method: 'delete'
    })
}

// 角色授权
export function postSetRight(roleId, rids){
    return request({
        url: `/roles/${roleId}/rights`,
        method: 'post',
        data: {
            rids
        }
    })
}