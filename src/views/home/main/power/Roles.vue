<template>
    <div id="roles">
        <bread-crumb />
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addClick">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 表格数据 -->
            <el-table :data="rolesList" stripe border :max-height="tableMaxHeigth">
                <roles-expand @removeRightById="removeRightById" />
                <el-table-column label="#" width="50" type="index"></el-table-column>
                <el-table-column prop="roleName" width="200" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作" width="320">
                    <!-- 自定义插槽 -->
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editClick(scope.row.id)">编辑</el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeClick(scope.row.id)">删除</el-button>
                        <!-- 分配权限按钮 -->
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="setClick(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加/编辑对话框 -->
        <from-dialog 
            :is-dialog="isDialog"
            dialog-label-width="100px"
            :dialog-title="fromDialogTitle"
            :dialog-type="dialogType"
            :dialog-form-model="roleFormModel"
            :dialog-form-rules="roleFormRules"
            @cancelClick="dialogClose"
            @addSubmitClick="addSubmit"
            @editSubmitClick="editSubmit"
        >
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="roleFormModel.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="roleFormModel.roleDesc"></el-input>
            </el-form-item>
        </from-dialog>
        <!-- 分配权限对话框 -->
        <set-dialog 
            v-if="isRightDialog"
            :is-dialog="isRightDialog"
            dialog-title="权限列表树"
            @cancelClick="dialogClose" 
            @setSubmit="setRightSubmit"
        >
            <!-- 内容主体区 -->
            <el-tree 
            :data="rightsTree" 
            :props="rightsProps" 
            show-checkbox 
            node-key="id"
            ref="rightsTreeRef"
            :default-expanded-keys="defRightKeys"
            :default-checked-keys="defRightKeys"
            ></el-tree>
        </set-dialog>
    </div>
</template>

<script>
// 导入公共组件
import BreadCrumb from '_com/main/bread-crumb/BreadCrumb';
import FromDialog from '_com/main/dialog/FromDialog';
import SetDialog from '_com/main/dialog/SetDialog';

// 子组件
import RolesExpand from './roles-children/RolesExpand'
import { 
    getRolesData, 
    postAddRoles, 
    getRolesInfo, 
    putEditRoles, deleteRoles, 
    deleteRights, 
    getRightsData, 
    postSetRight 
    } from '_new/power';

// 导入混入
import { tableHeightMixin } from '_con/mixin';

export default {
    name: 'Roles',
    components: {
        BreadCrumb,
        FromDialog,
        RolesExpand,
        SetDialog
    },
    data() {
        return {
            // 角色列表数据
            rolesList: [],
            // 权限树所有数据
            rightsTree: [],
            // 被点击id的已拥有权限树
            defRightKeys: [],
            // 被点击的角色id
            getId: '',
            // 添加/编辑角色数据
            roleFormModel:{},
            // 对话框类型
            dialogType: 'add',
            // 添加/编辑对话框是否显示
            isDialog: false,
            // 分配全选对话框是否显示
            isRightDialog: false,
        };
    },
    mixins: [tableHeightMixin],
    created() {
        // 获取角色列表数据
        this.getRolesList();
        // 获取权限树
        this.getRightsTree()
    },
    computed:{
        // 对话框标题名字
        fromDialogTitle() {
            return this.dialogType === 'add' ? '添加角色' : '编辑角色信息'
        },
        // 权限树匹配键
        rightsProps(){
            return {
                label: 'authName',
                children: 'children'
            }
        },
        // 添加角色的验证规则
        roleFormRules(){
            return {
                roleName: [
                    {required: true, message: '请输入角色名', trigger: 'blur'},
                    {min: 2, max: 10, message: '角色名的长度在2-10个字符之间', trigger: 'blur'}
                ],
                roleDesc: [
                    {required: true, message: '描述不能为空', trigger: 'blur'},
                    { min: 2, max: 20, message: '描述的长度在2-20个字符之间', trigger: 'blur'},
                ]
            }
        },
    },
    methods: {
        // 添加/编辑对话框显示事件
        dialogShow() {
            this.isDialog = true;
        },

        // 对话框关闭事件
        dialogClose() {
            this.isDialog = this.isDialog && false;
            this.isRightDialog = this.isRightDialog && false;
        },

        // 添加点击事件
        addClick(){
            // 设置对话框类型为add
            this.dialogType = 'add'
            // 对话框显示
            this.dialogShow();
        },

        // 添加角色提交事件
        addSubmit(){
            this.postAddRoles(this.roleFormModel)
        },

        // 编辑按钮点击事件
        editClick(roleId){
            // 设置对话框类型为edit
            this.dialogType = 'edit';
            // 对话框显示
            this.dialogShow();
            // 点击更新当前roleId
            this.getId = roleId;
            // 获取角色信息
            this.getRolesInfo(roleId)
        },

        // 编辑提交事件
        editSubmit(){
            this.putEditRoles(this.getId, this.roleFormModel)
        },

        // 删除点击事件
        removeClick(roleId){
            this.deleteRoles(roleId)
        },

        // 分配权限点击事件
        setClick(role){
            // 点击清空权限数组
            this.defRightKeys = []
            // 点击更新当前id
            this.getId = role.id;
            // 分配权限对话框显示
            this.isRightDialog = true
            if(this.rightsTree.length !== 0) {
                this.$toast.success('权限列表获取成功！');
                this.getLeafKeys(role, this.defRightKeys)
            }else {
                this.$toast.success('权限列表获取失败！');
            }
        },

        // 分配权限提交事件
        setRightSubmit(){
            // 将获取到的两个数组合并成一个数组，且通过join方法转换成逗号分隔的字符串
            const keys = [
                ...this.$refs.rightsTreeRef.getCheckedKeys(), 
                ...this.$refs.rightsTreeRef.getHalfCheckedKeys()
                ].join(',');
            this.postSetRight(this.getId, keys)
        },

        // 删除指定id的权限事件
        removeRightById(role, rightId){
            this.deleteRights(role, rightId)
        },

        // 递归遍历角色下所有三级权限id，并保存到defRightKeys中
        getLeafKeys(node, arr) {
            if(!node.children) {
                return arr.push(node.id)
            }else {
                node.children.forEach(item => this.getLeafKeys(item, arr))
            }
        },

        // 添加角色方法
        async postAddRoles(obj){
            await postAddRoles(obj).then(res=>{
                    const addRes = res.data;
                    if (addRes.meta.status !== 201) {
                        return this.$toast.error(addRes.meta.msg)
                    }else {
                    this.$toast.success(addRes.meta.msg)
                    // 对话框隐藏
                    this.dialogClose();
                    // 重新获取数据
                    this.getRolesList();
                }
            })
        },

        // 通过id和get请求查询对应信息
        async getRolesInfo(roleId){
            await getRolesInfo(roleId).then(res=>{
                const getRoleRes = res.data
                if (getRoleRes.meta.status !== 200) {
                    return this.$toast.error(getRoleRes.meta.msg)
                }else {
                    this.$toast.success(getRoleRes.meta.msg)
                    this.roleFormModel = getRoleRes.data
                }
            })
        },

        // 修改角色信息方法
        async putEditRoles(id, obj){
            await putEditRoles(id, obj).then(res => {
                const editRoleRes = res.data;
                if (editRoleRes.meta.status !== 200) {
                    return this.$toast.error('更新失败！');
                } else {
                    // 提示修改成功
                    this.$toast.success('更新成功！');
                    // 对话框隐藏
                    this.dialogClose();
                    // 重新获取数据
                    this.getRolesList();
                }
            });
        },

        // 删除角色方法
        async deleteRoles(roleId){
            await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteRoles(roleId).then(res=>{                        
                        if (res.data.meta.status !== 200) {
                            return this.$toast.error(res.data.meta.msg)
                        }else {
                            this.$toast.success(res.data.meta.msg);
                            // 重新获取数据
                            this.getRolesList();
                        }
                    })
                }).catch(() => {
                    this.$toast.info('已取消删除')       
            });
        },

        // 分配权限方法
        async postSetRight(roleId, keys){
            await postSetRight(roleId, keys).then(res => {
                const setRightRes = res.data;
                if (setRightRes.meta.status !== 200) {
                    return this.$toast.error(setRightRes.meta.msg);
                } else {
                    this.$toast.success(setRightRes.meta.msg);
                    //关闭对话框
                    this.dialogClose();
                    //重新获取数据
                    this.getRolesList();
                }
            });
        },

        // 删除指定id的权限方法，通过id请求和传过来的数据进行渲染
        async deleteRights(role, rightId){
            await this.$confirm('是否移除此权限？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteRights(role.id, rightId).then(res=>{ 
                        const removeRightRes = res.data                      
                        if (removeRightRes.meta.status !== 200) {
                            return this.$toast.error(removeRightRes.meta.msg)
                        }else {
                            this.$toast.success(removeRightRes.meta.msg)
                            // 不需要重新获取数据，直接将新的数据赋值给保存的数据即可
                            role.children = removeRightRes.data;
                        }
                    })
                }).catch(() => {
                    this.$toast.info('已取消移除')       
            });
        },

        // 获取角色列表数据
        async getRolesList() {
            await getRolesData().then(res => {
                const rolesRes = res.data;
                if (rolesRes.meta.status !== 200) {
                    return this.$toast.error(rolesRes.meta.msg);
                } else {
                    this.$toast.success('获取角色列表成功！');
                    this.rolesList = rolesRes.data;
                }
            });
        },
        // 获取权限列表树所有数据
        async getRightsTree(){
            await getRightsData('tree').then(res=>{
                const rightsRes = res.data;
                if (rightsRes.meta.status !== 200) {
                    return this.$toast.error(rightsRes.meta.msg);
                } else {
                    this.rightsTree = rightsRes.data;
                }
            })
        }
    }
};
</script>

