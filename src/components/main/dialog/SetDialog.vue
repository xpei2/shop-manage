<template>
    <!-- 列表添加/编辑的对话框 -->
    <el-dialog
        :title="dialogTitle"
        :visible.sync="isDialog"
        width="50%"
        :close-on-click-modal="false"
        :show-close="false"
        :top="dialogTop"
        @close="dialogClosed"
    >
        <slot></slot>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancelClick">取消</el-button>
            <el-button type="primary" @click="submitClick">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: "SetDialog",
    props: {
        // 是否显示对话框
        isDialog: {
            type: Boolean,
            default: false
        },
        // 对话框标题
        dialogTitle: {
            type: String,
            default: ""
        },
        // 对话框距离顶部距离
        dialogTop: {
            type: String,
            default: "15vh"
        }
    },
    methods: {
        // 添加用户的表单的取消按钮
        cancelClick() {
            //提交给父组件的关闭事件
            this.$emit("cancelClick");
        },
        // 添加用户的表单的确认按钮
        submitClick() {
            // 提交确认事件
            this.$emit("setSubmit");
        },
        // 监听对话框关闭事件
        dialogClosed() {
            this.$emit("setDialogClose");
        }
    }
};
</script>
