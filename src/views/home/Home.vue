<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <home-header />
        </el-header>
        <!-- 页面主体区 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isAsideTogglet ? '64px' : '200px'">
                <home-aside :menu-list="menuList" @toggleClick="toggleClick"/>
            </el-aside>
            <!-- 右侧主体 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
// 导入子组件
import HomeHeader from './header/HomeHeader';
import HomeAside from './aside/HomeAside';

// 导入数据请求
import { getMenus } from '_new/menus';

export default {
    name: 'Home',
    data() {
        return {
            menuList: [],
            // 第三方图标数组
            iconList: [
                'iconfont iconusers',
                'iconfont icontijikongjian',
                'iconfont iconshangpin',
                'iconfont icondanju',
                'iconfont iconbaobiao'
            ],
            isAsideTogglet: false
        };
    },
    components: {
        HomeHeader,
        HomeAside
    },
    created() {
        // 获取菜单数据
        this.getMenus();
    },
    methods: {
        // 接受子组件折叠点击事件，判断状态设置aside的宽度
        toggleClick(bol){
            this.isAsideTogglet = bol
        },
        // 获取左侧导航列表数据
        async getMenus() {
            await getMenus().then(res => {
                const menuRes = res.data;
                if (menuRes.meta.status !== 200) {
                   return this.$toast.error(menuRes.meta.msg);
                } else {
                    // 处理获取到的数据，添加导航图标名
                    this.menuList = menuRes.data.map((item, index) => {
                        item.icon = this.iconList[index];
                        return item;
                    });
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
.home-container {
    height: 100%;
}
.el-header {
    padding-left: 0;
    background-color: #373d41;
}
.el-aside {
    transition: width .3s;
    background-color: #333744;
}
.el-main {
    background-color: #eaedf1;
}
</style>