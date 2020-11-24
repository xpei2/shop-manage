<template>
    <div id="users">
        <bread-crumb />
        <!-- 卡片视图 -->
        <el-card>
            <!-- layout布局 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <!-- 搜索框 -->
                    <el-input
                        placeholder="请输入内容"
                        v-model="queryInfo.query"
                        clearable
                        @clear="getUsersList"
                        @keyup.enter.native="getUsersList"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getUsersList"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="addClick"
                        >添加用户</el-button
                    >
                </el-col>
            </el-row>
            <!-- 表格数据 -->
            <el-table
                :data="usersList"
                stripe
                border
                :max-height="tableMaxHeigth"
            >
                <el-table-column
                    label="#"
                    width="50"
                    type="index"
                ></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column
                    prop="role_name"
                    label="角色"
                ></el-table-column>
                <el-table-column label="状态">
                    <!-- 自定义插槽 -->
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.mg_state"
                            active-color="#409EFF"
                            @change="userStateChanged(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <!-- 自定义插槽 -->
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="编辑"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="primary"
                                icon="el-icon-edit"
                                size="mini"
                                @click="editClick(scope.row.id)"
                            ></el-button>
                        </el-tooltip>
                        <!-- 删除按钮 -->
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="删除"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                @click="removeClick(scope.row.id)"
                            ></el-button>
                        </el-tooltip>
                        <!-- 分配角色按钮 -->
                        <el-tooltip
                            class="item"
                            effect="dark"
                            content="分配角色"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="warning"
                                icon="el-icon-setting"
                                size="mini"
                                @click="roleClick(scope.row)"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[2, 4, 6, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>
        <!-- 添加/编辑用户对话框 -->
        <from-dialog
            :is-dialog="isDialog"
            :dialog-title="userDialogTitle"
            :dialog-type="dialogType"
            :dialog-form-model="userFormModel"
            :dialog-form-rules="userFormRules"
            @cancelClick="dialogClose"
            @addSubmitClick="addSubmit"
            @editSubmitClick="editSubmit"
        >
            <!-- 插槽的表单内容 -->
            <el-form-item label="用户名" prop="username">
                <el-input
                    v-model="userFormModel.username"
                    :disabled="dialogType === 'edit'"
                ></el-input>
            </el-form-item>
            <el-form-item
                v-if="dialogType === 'add'"
                label="密码"
                prop="password"
            >
                <el-input
                    v-model="userFormModel.password"
                    type="password"
                ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-autocomplete
                    v-model="userFormModel.email"
                    :fetch-suggestions="querySearch"
                    :trigger-on-focus="false"
                    :hide-loading="true"
                ></el-autocomplete>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input v-model.number="userFormModel.mobile"></el-input>
            </el-form-item>
        </from-dialog>
        <!-- 分配角色对话框 -->
        <set-dialog
            :is-dialog="isRoleDialog"
            dialog-title="分配角色"
            dialog-top="25vh"
            @cancelClick="setRoleClose"
            @setSubmit="setRoleSubmit"
        >
            <!-- 内容主体区 -->
            <div class="set-role">
                <p>当前用户名：{{ setRoleInfo.username }}</p>
                <p>当前角色名：{{ setRoleInfo.role_name }}</p>
                <div>
                    <span>分配新角色：</span>
                    <el-select v-model="setRoleValue" placeholder="请选择">
                        <el-option
                            v-for="item in rolesNameList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </div>
            </div>
        </set-dialog>
    </div>
</template>

<script>
// 导入公共组件
import BreadCrumb from "_com/main/bread-crumb/BreadCrumb";
import FromDialog from "_com/main/dialog/FromDialog";
import SetDialog from "_com/main/dialog/SetDialog";

// 导入数据请求
import {
    getUsersData,
    postAddUser,
    putUserState,
    getUserInfo,
    putUserEdit,
    deleteUser,
    putSetRole
} from "_new/users";
import { getRolesData } from "_new/power";

// 导入混入
import { tableHeightMixin } from "_con/mixin";

// 导入自定义表单手机验证规则
import { checkMobile } from "_con/utils";

export default {
    name: "Users",
    components: {
        BreadCrumb,
        FromDialog,
        SetDialog
    },
    data() {
        return {
            // users数据列表
            usersList: [],
            // users数量
            total: 0,
            // users数据请求的参数
            queryInfo: {
                query: "",
                // 当前的页数
                pagenum: 1,
                // 每页显示多少条数据
                pagesize: 2
            },
            // 定义选择用户的id
            getId: "",
            // 编辑/添加用户的信息
            userFormModel: {},
            // 角色列表所有数据
            rolesNameList: [],
            // 需要分配角色用户的信息
            setRoleInfo: {},
            // 需要分配的角色
            setRoleValue: "",
            // 对话框类型，判断类型显示那种对话框
            dialogType: "",
            // 添加/编辑对话框是否显示
            isDialog: false,
            // 添加对话框是否显示
            isRoleDialog: false
        };
    },
    mixins: [tableHeightMixin],
    created() {
        // 获取用户列表数据
        this.getUsersList();
        // 获取角色列表数据
        this.getRolesList();
    },
    computed: {
        // 对话框标题名字
        userDialogTitle() {
            return this.dialogType === "add" ? "添加用户" : "编辑用户信息";
        },
        // 选中用户的表单验证规则，添加/编辑对话框的规则
        userFormRules() {
            return {
                username: [
                    {
                        required: true,
                        message: "请输入用户名",
                        trigger: "blur"
                    },
                    {
                        min: 3,
                        max: 10,
                        message: "用户名的长度在3-10个字符之间",
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "密码不能为空",
                        trigger: "blur"
                    },
                    {
                        pattern: /^(\w){6,15}$/,
                        message: "密码由6-15个字母、数字、下划线组成",
                        trigger: "blur"
                    }
                ],
                email: [
                    { required: true, message: "请输入邮箱", trigger: "blur" },
                    {
                        type: "email",
                        message: "请输入合法的邮箱",
                        trigger: "submit"
                    }
                ],
                mobile: [
                    { required: true, validator: checkMobile, trigger: "blur" }
                ]
            };
        }
    },
    methods: {
        // 添加/编辑对话框显示事件
        dialogShow() {
            this.isDialog = true;
        },

        // 对话框关闭事件
        dialogClose() {
            this.isDialog = this.isDialog && false;
            this.isRoleDialog = this.isRoleDialog && false;
        },

        // 添加点击事件
        addClick() {
            // 设置对话框类型为add
            this.dialogType = "add";
            // 对话框显示
            this.dialogShow();
        },

        // 邮箱提示规则
        querySearch(queryString, callback) {
            const restaurants = [
                { value: "@qq.com" },
                { value: "@126.com" },
                { value: "@163.com" },
                { value: "@sohu.com" }
            ];
            let results = JSON.parse(JSON.stringify(restaurants));
            results.forEach(item => {
                item.value = `${queryString}${item.value}`;
            });
            // 调用 callback 返回建议列表的数据
            callback(results);
        },

        // 添加用户提交事件
        addSubmit() {
            this.postAddUser(this.userFormModel);
        },

        // 监听用户状态的改变
        userStateChanged(obj) {
            this.putUserState(obj.id, obj.mg_state);
        },

        // 编辑按钮点击事件
        editClick(userId) {
            // 设置对话框类型为edit
            this.dialogType = "edit";
            // 对话框显示
            this.dialogShow();
            // 点击更新当前userId
            this.getId = userId;
            // 获取用户信息
            this.getUserInfo(userId);
        },

        // 编辑提交事件
        editSubmit() {
            this.putUserEdit(this.getId, this.userFormModel);
        },

        // 删除用户点击事件
        removeClick(userId) {
            this.deleteUser(userId);
        },

        // 分配角色按钮点击事件
        roleClick(info) {
            this.isRoleDialog = true;
            this.setRoleInfo = info;
        },

        // 分配角色按钮取消事件，注意取消不是提交的dialogClose事件了
        setRoleClose() {
            // 关闭对话框
            this.dialogClose();
            // 清空获取到的用户信息
            this.setRoleInfo = {};
            // 清空选择的角色id
            this.setRoleValue = "";
        },

        // 分配角色提交按钮
        setRoleSubmit() {
            this.putSetRole(this.setRoleInfo.id, this.setRoleValue);
        },

        // 监听pagesize改变的事件
        handleSizeChange(val) {
            //设置每页显示多少条，并重新获取数据
            this.queryInfo.pagesize = val;
            this.getUsersList();
        },

        // 监听页码值改变的事件
        handleCurrentChange(val) {
            //显示页面跳转并重新获取数据
            this.queryInfo.pagenum = val;
            this.getUsersList();
        },

        // 添加用户方法
        async postAddUser(obj) {
            await postAddUser(obj).then(res => {
                const addUserRes = res.data;
                if (addUserRes.meta.status !== 201) {
                    return this.$message.error(addUserRes.meta.msg);
                } else {
                    this.$message.success(addUserRes.meta.msg);
                    // 关闭对话框
                    this.dialogClose();
                    // 重新获取数据
                    this.getUsersList();
                }
            });
        },

        // 更新用户状态方法
        async putUserState(userId, userState) {
            await putUserState(userId, userState).then(res => {
                if (res.data.meta.status !== 200) {
                    // 如果更新失败，则还原页面中的状态
                    setTimeout(() => {
                        userState = !userState;
                    }, 1000);
                    return this.$message.error("更新用户状态失败！");
                } else {
                    this.$message.success("更新状态成功！");
                }
            });
        },

        // 通过id和get请求查询对应信息
        async getUserInfo(userId) {
            await getUserInfo(userId).then(res => {
                const getUserRes = res.data;
                if (getUserRes.meta.status !== 200) {
                    return this.$message.error(getUserRes.meta.msg);
                } else {
                    this.$message.success(getUserRes.meta.msg);
                    this.userFormModel = getUserRes.data;
                }
            });
        },

        // 编辑用户提交方法
        async putUserEdit(userId, obj) {
            await putUserEdit(userId, obj).then(res => {
                const editUserRes = res.data;
                if (editUserRes.meta.status !== 200) {
                    return this.$message.error(editUserRes.meta.msg);
                } else {
                    // 提示修改成功
                    this.$message.success(editUserRes.meta.msg);
                    // 关闭对话框
                    this.dialogClose();
                    // 重新获取数据
                    this.getUsersList();
                }
            });
        },

        // 删除用户方法
        async deleteUser(userId) {
            await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    deleteUser(userId).then(res => {
                        if (res.data.meta.status !== 200) {
                            return this.$message.error(res.data.meta.msg);
                        } else {
                            this.$message.success(res.data.meta.msg);
                            // 添加数据后，获取数据前如果尾页只剩一个用户，则跳转到前一页
                            if (
                                this.total &&
                                this.total % this.queryInfo.pagesize == 1
                            ) {
                                this.queryInfo.pagenum--;
                            }
                            // 重新获取数据
                            this.getUsersList();
                        }
                    });
                })
                .catch(() => {
                    this.$message.info("已取消删除");
                });
        },

        // 分配角色提交按钮
        async putSetRole(userId, roleId) {
            if (!roleId) {
                return this.$message.warning("请选择需要分配的角色！");
            } else {
                await putSetRole(userId, roleId).then(res => {
                    const putRoleRes = res.data;
                    if (putRoleRes.meta.status !== 200) {
                        return this.$message.error(putRoleRes.meta.msg);
                    } else {
                        this.$message.success(putRoleRes.meta.msg);
                        // 关闭对话框，且情况选择器
                        this.setRoleClose();
                        // 重新获取数据
                        this.getUsersList();
                    }
                });
            }
        },

        // 获取Users数据方法
        async getUsersList() {
            await getUsersData(
                this.queryInfo.query,
                this.queryInfo.pagenum,
                this.queryInfo.pagesize
            ).then(res => {
                const usersRes = res.data;
                if (usersRes.meta.status !== 200) {
                    return this.$message.error(usersRes.meta.msg);
                } else {
                    this.$message.success("获取用户列表成功！");
                    this.usersList = usersRes.data.users;
                    this.total = usersRes.data.total;
                }
            });
        },

        // 获取角色列表数据
        async getRolesList() {
            await getRolesData().then(res => {
                const rolesRes = res.data;
                if (rolesRes.meta.status !== 200) {
                    return this.$message.error(rolesRes.meta.msg);
                } else {
                    this.rolesNameList = rolesRes.data.map(item => {
                        // 过滤其他多余属性
                        return (({ roleName, id }) => ({ roleName, id }))(item);
                    });
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.set-role {
    p {
        margin: 15px 0;
    }
}
</style>
