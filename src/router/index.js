import Vue from "vue";
import VueRouter from "vue-router";

// 重写路由push方法,阻止重复点击报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};
// 重写路由replace方法,阻止重复点击报错
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err);
};
Vue.use(VueRouter);

// 路由组件
import Login from "_vie/login/Login";
import Home from "_vie/home/Home";
import Welcome from "_vie/home/main/Welcome";
import Users from "_vie/home/main/users/Users";

const routes = [
    {
        path: "/",
        redirect: "/home"
    },
    {
        path: "/login",
        name: "login",
        component: Login
    },
    {
        path: "/home",
        name: "home",
        component: Home,
        redirect: '/welcome',
        children: [
            {path: '/welcome', component: Welcome},
            {path: '/users', component: Users},
            {path: '/roles', },
            {path: '/rights', },
            {path: '/goods', },
            {path: '/params', },
            {path: '/categories', },
            {path: '/orders', },
            {path: '/reports', },
        ]
    }
];

const router = new VueRouter({
    routes
});

// 全局挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to 将要访问的路劲
    // from 代表从哪个路径跳转而来
    // next是一个函数，表示放行
    // 获取token
    const tokenStr = window.sessionStorage.getItem("token");
    to.path === "/login" ? next() : !tokenStr ? next("/login") : next();
});
export default router;
