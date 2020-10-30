<template>
    <div>
        <div class="login-out" @click="loginOut">退出</div>
    </div>
</template>

<script>
// 导入清除sessionStorage的方法
import { sessionStorageRemove } from "_con/utils";

export default {
    name: "Home",
    methods: {
        loginOut() {
            // 清除token
            sessionStorageRemove("token");
            // 跳转到登录页
            this.$router.push("/login");
        }
    }
};
</script>
