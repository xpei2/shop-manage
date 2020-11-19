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
const Login = ()=>import("_vie/login/Login");
const Home = ()=>import("_vie/home/Home");
const Welcome = ()=>import("_vie/home/main/Welcome");
const Users = ()=>import("_vie/home/main/users/Users");
const Rights = ()=>import("_vie/home/main/power/Rights");
const Roles = ()=>import("_vie/home/main/power/Roles");
const Goods = ()=>import("_vie/home/main/goods/Goods");
const Params = ()=>import("_vie/home/main/goods/Params");
const HandleGoods = ()=>import("_com/main/HandleGoods");
const Cate = ()=>import("_vie/home/main/goods/Cate");
const Orders = ()=>import("_vie/home/main/orders/Orders");
const Reports = ()=>import("_vie/home/main/reports/Reports");

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
            {path: '/roles', component: Roles},
            {path: '/rights', component: Rights},
            {path: '/goods', component: Goods},
            {path: '/goods/:type/:id?', component: HandleGoods},
            {path: '/params', component: Params},
            {path: '/categories', component: Cate},
            {path: '/orders', component: Orders},
            {path: '/reports', component: Reports},
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
