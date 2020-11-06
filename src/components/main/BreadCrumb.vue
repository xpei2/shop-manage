<template>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{$store.state.breadCrumbTxt.secondNav}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$store.state.breadCrumbTxt.thirdNav}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
    name: 'BreadCrumb',
};
</script>

<style scoped>
</style>