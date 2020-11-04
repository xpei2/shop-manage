<template>
    <div>
        <bread-crumb />
        <!-- 卡片视图 -->
        <el-card>
            <!-- layout布局 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <!-- 搜索框 -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsersList">
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getUsersList"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="openAddDialog">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 表格数据 -->
            <el-table :data="usersList" stripe border>
                <el-table-column label="#" width="60" type="index"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
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
                        <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="openEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                        <!-- 删除按钮 -->
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        </el-tooltip>
                        <!-- 分配角色按钮 -->
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
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
        <add-user-dialog 
            v-if="dialogType === 'add'" 
            @closeDialog="closeDialog"
        />
        <edit-user-dialog 
            v-else-if="dialogType === 'edit'" 
            :user-id="userId" 
            @closeDialog="closeDialog"
        />
    </div>
</template>

<script>
// 导入公共组件
import BreadCrumb from '_com/main/BreadCrumb'

// 导入子组件
import AddUserDialog from './children/AddUserDialog'
import EditUserDialog from './children/EditUserDialog'

// 导入数据请求
import { getUsers, putUserState, deleteUser } from '_new/users';
export default {
    name: 'Users',
        components: {
        BreadCrumb,
        AddUserDialog,
        EditUserDialog,
    },
    data() {
        return {
            // users数据列表
            usersList: [],
            // users数量
            total: 0,
            // users数据请求的参数
            queryInfo: {
                query: '',
                // 当前的页数
                pagenum: 1,
                // 每页显示多少条数据
                pagesize: 2
            },
            // 定义选择用户的id
            userId: '',
            // 对话框类型，判断类型显示那种对话框
            dialogType: ''
        };
    },
    created() {
        // 获取数据
        this.getUsersList();
    },
    methods: {
        // 获取Users数据方法
        async getUsersList() {
            await getUsers(
                this.queryInfo.query,
                this.queryInfo.pagenum,
                this.queryInfo.pagesize
            ).then(res => {
                const usersRes = res.data;
                if (usersRes.meta.status !== 200) {
                    return this.$toast.error(usersRes.meta.msg);
                } else {
                    this.usersList = usersRes.data.users;
                    this.total = usersRes.data.total;
                }
            });
        },

        // 监听用户状态的改变
        async userStateChanged(obj) {
            await putUserState(obj.id, obj.mg_state).then(res => {
                if (res.data.meta.status !== 200) {
                    // 如果更新失败，则还原页面中的状态
                    setTimeout(() => {
                        obj.mg_state = !obj.mg_state;
                    }, 1000);
                    return this.$toast.error('更新用户状态失败！');
                }else{
                    this.$toast.success('更新状态成功！');
                }
            });
        },
        // 添加用户对话框打开事件
        openAddDialog() {
            this.dialogType = 'add'
        },

        // 修改用户对话框打开事件
        openEditDialog(uid) {
            this.userId = `${uid}`;
            this.dialogType = 'edit'
        },
        
        // 对话框关闭事件
        closeDialog() {
            this.dialogType = ''
        },

        // 删除用户事件
        async removeUserById(uid){
            await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteUser(uid).then(res=>{                        
                        if (res.data.meta.status !== 200) {
                            return this.$toast.error(res.data.meta.msg)
                        }else {
                            this.$toast.success(res.data.meta.msg)
                            // 添加数据后，获取数据前如果尾页只剩一个用户，则跳转到前一页
                            if(this.total % this.queryInfo.pagesize == 1){
                                this.queryInfo.pagenum--
                            }
                            this.getUsersList();
                        }
                    })
                }).catch(() => {
                    this.$toast.info('已取消删除')       
            });
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
        }
    }
};
</script>

<style scoped>
</style>