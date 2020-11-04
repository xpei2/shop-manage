<template>
    <!-- 添加用户的对话框 -->
    <el-dialog
        title="添加用户"
        :visible="true"
        width="50%"
        :close-on-click-modal="false"
        :show-close="false"
    >
        <!-- 内容主体区 -->
        <el-form
            :model="addForm"
            :rules="addFormRules"
            ref="addFormRef"
            label-width="70px"
            status-icon
        >
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model.number="addForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="resetAddForm">取消</el-button>
            <el-button type="primary" @click="addUserClick">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { postAddUser } from '_new/users';

export default {
    name: 'AddUserDialog',
    data() {
        //自定义邮箱邮箱验证规则
        // var checkEmail = (rule, value, callback) => {
        //     if (!value) {
        //         return callback(new Error('请输入邮箱！'));
        //     }else {
        //         //邮箱验证正则表达式
        //         const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        //         if(regEmail.test(value)) {
        //             return callback()
        //         }
        //         callback(new Error('请输入合法的邮箱'))
        //     }
        // }
        // 自定义手机号验证规则
        var checkMobile = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入手机！'));
            }else {
                const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if(regMobile.test(value)){
                    return callback()
                }
                callback(new Error('请输入合法的手机'))
            }
        }
        return {
            // 添加用户的表单数据
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 添加用户的验证规则
            addFormRules:{
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {min: 3, max: 10, message: '用户名的长度在3-10个字符之间', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '密码不能为空', trigger: 'blur'},
                    { pattern: /^(\w){6,15}$/, message: '密码由6-15个字母、数字、下划线组成', trigger: 'blur'},
                ],
                email: [
                    {required: true, message: '请输入邮箱', trigger: 'blur'},
                    {type: 'email', message: '请输入合法的邮箱', trigger: 'blur'}
                ],
                mobile: [
                    { required: true,  validator: checkMobile, trigger: 'blur'}
                ]
            }
        }
    },
    methods: {      
        // 添加用户的表单的取消按钮
        resetAddForm() {
            //提交给父组件的关闭事件
            this.$emit('closeDialog', false);
            //resetFields表单自带的重置方法
            this.$refs.addFormRef.resetFields();
        },
        // 添加用户的表单的确认按钮
        async addUserClick() {
            await this.$refs.addFormRef.validate(valid => {
                if(!valid) return;
                // 可以发起添加用户的请求
                postAddUser(this.addForm).then(res=>{
                     const addUserRes = res.data;
                     if (addUserRes.meta.status !== 201) {
                        return this.$toast.error(addUserRes.meta.msg)
                     }else {
                        this.$toast.success(addUserRes.meta.msg)
                        // 对话框隐藏
                        this.$emit('closeDialog', false);
                        // 父组件重新获取数据
                        this.$parent.getUsersList();
                    }
                })
            })
        },
    }
};
</script>

<style scoped>
</style>