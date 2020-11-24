const path = require("path");

function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    // productionSourceMap：{ type:Bollean,default:true } 生产源映射，如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
    productionSourceMap: false,
    // 配置规则
    chainWebpack: config => {
        // 自定义打包入口，发布模式
        config.when(process.env.NODE_ENV === "production", config => {
            config
                .entry("app")
                .clear()
                .add("./src/main-prod.js");

            config.set("externals", {
                vue: "Vue",
                "vue-router": "VueRouter",
                axios: "axios",
                lodash: "_",
                echarts: "echarts",
                nprogress: "NProgress",
                "vue-quill-editor": "VueQuillEditor"
            });
            // 配置 html-webpack-plugin 插件
            config.plugin("html").tap(args => {
                args[0].isProd = true;
                return args;
            });
        });
        // 开发模式
        config.when(process.env.NODE_ENV === "development", config => {
            config
                .entry("app")
                .clear()
                .add("./src/main-dev.js");

            // 配置 html-webpack-plugin 插件
            config.plugin("html").tap(args => {
                args[0].isProd = false;
                return args;
            });
        });
        // 文件夹简写
        config.resolve.alias
            .set("_ats", resolve("src/assets"))
            .set("_con", resolve("src/common"))
            .set("_com", resolve("src/components"))
            .set("_vie", resolve("src/views"))
            .set("_new", resolve("src/network"));
        //图片格式
        config.module
            .rule("images")
            .test(/\.(png|jpe?g|gif|webp|jfif)(\?.*)?$/);
    }
};
