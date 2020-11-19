import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 引入element组件配置
import "./plugins/element";
// 引入图标库
import "./assets/fonts/iconfont.css";
// 引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
