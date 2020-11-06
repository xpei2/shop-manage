<template>
    <!-- 列表添加/编辑的对话框 -->
    <el-dialog
        :title="setTitle"
        :visible="true"
        width="50%"
        :close-on-click-modal="false"
        :show-close="false"
        :top="setTop"
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
    name: 'RightsTree',
    props: {
        // 对话框标题
        setTitle: {
            type: String,
            default: ''
        },
        // 对话框距离顶部距离
        setTop: {
            type: String,
            default: '15vh'
        },
    },
    methods: {
        // 添加用户的表单的取消按钮
        cancelClick() {
            //提交给父组件的关闭事件
            this.$emit('baseCancel', false);
        },
        // 添加用户的表单的确认按钮
        submitClick() {
            // 提交确认事件
            this.$emit('setSubmit');
        }
    }
};
</script>