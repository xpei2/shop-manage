import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mutations";

Vue.use(Vuex);

const state = {
    // 面包屑导航数据
    breadCrumb: {
        nav1: "",
        nav2: "",
        nav3: ""
    }
};

export default new Vuex.Store({
    state,
    mutations
});
