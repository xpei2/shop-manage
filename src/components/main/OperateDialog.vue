<template>
    <!-- 列表添加/编辑的对话框 -->
    <el-dialog
        :title="operateTitle"
        :visible="true"
        width="50%"
        :close-on-click-modal="false"
        :show-close="false"
    >
        <!-- 内容主体区 -->
        <el-form
            :model="operateFormModel"
            :rules="operateFormRules"
            ref="operateFormRef"
            :label-width="operateLabelWidth"
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
    name: 'OperateDialog',
    props: {
        operateTitle: {
            type: String,
            default: '添加'
        },
        operateFormRules: {
            type: Object,
            default(){
                return {}
            }
        },
        operateFormModel: {
            type: Object,
            default() {
                return {}
            }
        },
        operateLabelWidth: {
            type: String,
            default: '70px'
        }
    },
    methods: {      
        // 对话框的取消按钮
        cancelClick() {
            //提交给父组件的关闭事件
            this.$emit('baseCancel', false);
            this.resetFields();
        },
        // 对话框的确认按钮
        submitClick() {
            this.$refs.operateFormRef.validate(valid => {
                if(!valid) return;
                // 提交确认事件
                this.$emit('operateSubmit');
                this.resetFields();
            })
        },
        // 表单重置方法
        resetFields(){
            //resetFields表单自带的重置方法
            this.$refs.operateFormRef.resetFields();
        }
    }
};
</script>
