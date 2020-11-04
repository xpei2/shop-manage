<template>
    <div class="home-aside">
        <div class="toggle-btn" @click="toggleClick">|||</div>
        <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#ffd04b"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            :default-active="activePath"
            router
        >
            <!-- 一级菜单 -->
            <el-submenu
                v-for="item in menuList"
                :index="item.id + ''"
                :key="item.id"
            >
                <!-- 一级菜单模板区域 -->
                <template slot="title">
                    <!-- 图标 -->
                    <i :class="item.icon"></i>
                    <!-- 文本 -->
                    <span>{{ item.authName }}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item
                    v-for="subItem in item.children"
                    :index="`/${subItem.path}`"
                    :key="subItem.id"
                    @click="menuItemClick(`/${subItem.path}`)"
                >
                    <!-- 二级菜单模板区域 -->
                    <template slot="title">
                        <!-- 图标 -->
                        <i class="el-icon-menu"></i>
                        <!-- 文本 -->
                        <span>{{ subItem.authName }}</span>
                    </template>
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
export default {
    name: 'HomeAside',
    props: {
        menuList: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    data(){
        return {
            isCollapse: false,
            activePath: ''
        }
    },
    created(){
        this.activePath = window.sessionStorage.getItem('menuItemPath');
    },
    methods: {
        // 折叠按钮点击事件
        toggleClick() {
            console.log(this.$route);
            this.isCollapse = !this.isCollapse;
            // 提交折叠按钮点击事件，并传递给父组件折叠状态
            this.$emit('toggleClick', this.isCollapse)
        },
        // 侧栏列表点击的时候保存高亮路径
        menuItemClick(path) {
            window.sessionStorage.setItem('menuItemPath', path);
            // window.sessionStorage.setItem('menuItemPath', this.$route.path);
        }
    }
};
</script>

<style lang="less" scoped>
.el-menu {
    border-right: 0;
}
.toggle-btn {
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: .2em;
    color: #fff;
    background-color: #4a5064;
    cursor: pointer;
}
.iconfont {
    margin-right: 6px;
}
</style>