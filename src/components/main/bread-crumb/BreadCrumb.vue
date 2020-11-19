<template>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{$store.state.breadCrumb.nav1}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$store.state.breadCrumb.nav2}}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$store.state.breadCrumb.nav3">{{$store.state.breadCrumb.nav3}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    name: 'BreadCrumb',
};
</script>
