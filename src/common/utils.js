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

// 递归调用数组给子数据添加属性和值
// 四个api参数：data：数组， subData：子数组，key：添加的属性，value：添加的属性值
export function setAttribute(obj) {
    if (obj.data && Array.isArray(obj.data)) {
        obj.data.map(item => {
            if (item[obj.subData] && item[obj.subData][length] !== 0) {
                item[obj.key] = obj.value;
                setAttribute({
                    data: item[obj.subData],
                    subData: obj.subData,
                    key: obj.key,
                    value: obj.value
                });
            }
            return item;
        });
    }
    return obj.data;
}

// 时间格式化
export function formatDate(date, fmt) {
    // 获取年份
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }

    let o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds()
    };

    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + "";
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? str : padLeftZero(str)
            );
        }
    }

    return fmt;
}

function padLeftZero(str) {
    return ("00" + str).substr(str.length);
}

// 图片类型的正则判断
export function imageRegExp(str) {
    const pattern = /^image\/(jpg|jpeg|png)$/;
    return pattern.test(str);
}
