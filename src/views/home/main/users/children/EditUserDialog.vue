<template>
   <!-- 编辑用户的对话框 -->
    <el-dialog
        title="编辑用户信息"
        :visible="true"
        width="50%"
        :close-on-click-modal="false"
        :show-close="false"
    >
        <!-- 内容主体区 -->
        <el-form
            :model="editForm"
            :rules="editFormRules"
            ref="editFormRef"
            label-width="70px"
            status-icon
        >
            <el-form-item label="用户名" prop="username">
                <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model.number="editForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="resetEditForm">取消</el-button>
            <el-button type="primary" @click="editUserClick">确认修改</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { getUserInfo, putUserEdit } from '_new/users';

export default {
    name: 'EditUserDialog',
    props: {
        userId: String
    },
    data() {
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
            //  查询到的用户信息
            editForm: {},
            // 编辑用户信息的验证规则
            editFormRules:{
                username: [
                    {message: '请输入用户名', trigger: 'blur'},
                    {min: 3, max: 10, message: '用户名的长度在3-10个字符之间', trigger: 'blur'}
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
    created(){
        this.getUserInfo()
    },
    methods: {      
        // 添加用户的表单的取消按钮
        resetEditForm() {
            this.$emit('closeDialog', false);
            this.$refs.editFormRef.resetFields();
        },
        // 监听对话框显示通过id和get请求查询用户信息
        async getUserInfo() {
            await getUserInfo(this.userId).then(res=>{
                const getUserRes = res.data
                if (getUserRes.meta.status !== 200) {
                    return this.$toast.error(getUserRes.meta.msg)
                }else {
                    this.$toast.success(getUserRes.meta.msg)
                    this.editForm = getUserRes.data
                }
            })
        },
        // 修改用户的表单的确认按钮
        async editUserClick() {
            await this.$refs.editFormRef.validate(valid => {
                if(!valid) return;
                // 可以发起修改用户的请求
                putUserEdit(parseInt(this.userId), this.editForm).then(res=>{
                     const editUserRes = res.data;
                     if (editUserRes.meta.status !== 200) {
                        return this.$toast.error(editUserRes.meta.msg)
                     }else {
                        // 提示修改成功
                        this.$toast.success(editUserRes.meta.msg)
                        // 对话框隐藏
                        this.$emit('closeDialog', false);
                        // 父组件重新获取数据
                        this.$parent.getUsersList()
                     }
                })
            })
        },
    }
}
</script>