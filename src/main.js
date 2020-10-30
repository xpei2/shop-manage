import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// 引入element组件配置
import "./plugins/element";
// 引入图标库
import "./assets/fonts/iconfont.css";

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");
