// 清除sessionStorage
export function sessionStorageRemove(key) {
    if (typeof key === "string") {
        window.sessionStorage.removeItem(key);
    } else {
        return;
    }
}
//自定义邮箱邮箱验证规则
export function checkEmail(rule, value, callback) {
    if (!value) {
        return callback(new Error("请输入邮箱！"));
    } else {
        //邮箱验证正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if (regEmail.test(value)) {
            return callback();
        }
        callback(new Error("请输入合法的邮箱"));
    }
}

// 自定义手机号验证规则
export function checkMobile(rule, value, callback) {
    if (!value) {
        return callback(new Error("请输入手机！"));
    } else {
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        if (regMobile.test(value)) {
            return callback();
        }
        callback(new Error("请输入合法的手机"));
    }
}
