<template>
    <!-- 列表添加/编辑的对话框 -->
    <el-dialog
        :title="dialogTitle"
        :visible.sync="isDialog"
        width="50%"
        :close-on-click-modal="false"
        :show-close="false"
        @close="dialogClosed"
        :top="dialogTop"
    >
        <!-- 内容主体区 -->
        <el-form
            :model="dialogFormModel"
            :rules="dialogFormRules"
            ref="dialogFormRef"
            :label-width="dialogLabelWidth"
            status-icon
        >
            <slot></slot>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancelClick">取消</el-button>
            <el-button type="primary" @click="submitClick">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: "FromDialog",
    props: {
        // 是否显示对话框
        isDialog: {
            type: Boolean,
            default: false
        },
        // 对话框标题
        dialogTitle: {
            type: String,
            default: "暂无标题名"
        },
        // 对话框表单规则
        dialogFormRules: {
            type: Object,
            default() {
                return {};
            }
        },
        // 对话框表单数据
        dialogFormModel: {
            type: Object,
            default() {
                return {};
            }
        },
        // 对话框label宽度
        dialogLabelWidth: {
            type: String,
            default: "70px"
        },
        // 判断是编辑还是添加对话框，无值则默认普通对话框
        dialogType: {
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
        // 对话框取消按钮点击事件
        cancelClick() {
            //提交取消事件
            this.$emit("cancelClick");
        },
        // 对话框确认按钮点击事件
        submitClick() {
            this.$refs.dialogFormRef.validate(valid => {
                if (!valid) return;
                if (this.dialogType === "add") {
                    // 添加提交确认事件
                    this.$emit("addSubmitClick");
                    return;
                } else if (this.dialogType === "edit") {
                    // 编辑提交确认事件
                    this.$emit("editSubmitClick");
                    return;
                } else {
                    // 直接提交确认事件，无需判断是编辑框还是添加框
                    this.$emit("submitClick");
                }
            });
        },
        // 监听对话框关闭事件
        dialogClosed() {
            // 重置表单
            this.$refs.dialogFormRef.resetFields();
        }
    }
};
</script>
