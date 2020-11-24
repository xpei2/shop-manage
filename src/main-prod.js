import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 引入图标库
import "./assets/fonts/iconfont.css";

// 引入富文本编辑器
import VueQuillEditor from "vue-quill-editor";

Vue.use(VueQuillEditor);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
