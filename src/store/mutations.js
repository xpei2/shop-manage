import { SET_BREAD_CRUMB, SET_SESSION_ASIDE_NAV } from "./types";
export default {
    // 设置面包屑导航数据
    [SET_BREAD_CRUMB](state, obj) {
        state.breadCrumb = obj;
        // 保存在临时缓存，对象必须转换成字符串保存
        window.sessionStorage.setItem("asideNav", JSON.stringify(obj));
    },
    // 设置缓存的面包屑导航数据至状态管理中
    [SET_SESSION_ASIDE_NAV](state, obj) {
        state.breadCrumb = obj;
    }
};
