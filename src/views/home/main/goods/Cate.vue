<template>
    <div>
        <bread-crumb />
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addBtnClick">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格数据 -->
            <el-table 
                :data="cateList" 
                stripe 
                border
                row-key="cat_id"
                :max-height="tableMaxHeigth"
                v-loading="isLoading"
                element-loading-text="加载中..."
                element-loading-spinner="el-icon-loading"
                empty-text=" "
                :tree-props="{children: 'children'}"
            >
                <el-table-column label="#" width="50"></el-table-column>
                <el-table-column prop="cat_name" width="200" label="分类名称" class-name="cate-name"></el-table-column>
                <el-table-column label="是否有效">
                    <!-- 自定义插槽 -->
                    <template slot-scope="scope">
                        <i v-if="scope.row.cat_deleted" class="el-icon-success" style="color: limegreen"></i>
                        <i v-else class="el-icon-error" style="color: red"></i>
                    </template>
                </el-table-column>
                <el-table-column label="排序">
                    <!-- 自定义插槽 -->
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
                        <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
                        <el-tag v-else type="warning">三级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="320">
                    <!-- 自定义插槽 -->
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editClick(scope.row.cat_id)">编辑</el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeClick(scope.row.cat_id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 7, 9, 11]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            >
            </el-pagination>
        </el-card>
        <!-- 添加分类对话框 -->
        <operate-dialog 
            v-if="dialogType === 'add'"
            operate-title="添加分类"
            operate-label-width="100px"
            :operate-form-model="cateFormModel"
            :operate-form-rules="cateFormRules"
            @baseCancel="baseCancel"
            @operateSubmit="addSubmit"
        >
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="cateFormModel.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
                <!-- options数据源 -->
                <el-cascader
                v-model="selectdKeys"
                :options="cateParentList"
                clearable
                ref="cateCascaderRef"
                :props="cascaderProps"
                @change="cascaderCateChanged"
                popper-class="cate-cascader"
                ></el-cascader>
            </el-form-item>
        </operate-dialog>
        <!-- 编辑分类对话框 -->
        <operate-dialog 
            v-if="dialogType === 'edit'"
            operate-title="编辑分类信息"
            operate-label-width="100px"
            :operate-form-model="cateFormModel"
            :operate-form-rules="cateFormRules"
            @baseCancel="baseCancel"
            @operateSubmit="editSubmit"
        >
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="cateFormModel.cat_name"></el-input>
            </el-form-item>
        </operate-dialog>
    </div>
</template>

<script>
// 导入公共组件
import BreadCrumb from '_com/main/BreadCrumb';
import OperateDialog from '_com/main/OperateDialog';

// 导入axios方法
import { 
    getCateData,
    postAddCate,
    getCateInfo,
    putCateEdit,
    deleteCate
    } from '_new/goods';

// 导入混入
import { tableHeightMixin } from '_con/mixin';

export default {
    name: 'Cate',
    components: {
        BreadCrumb,
        OperateDialog,
    },
    data() {
        return {
            isLoading: true,
            // 分类列表数据
            cateList: [],
            // 数据总数
            total: 0,
            // 分类id
            getId: '',
            // 分类分页参数
            queryInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 对话框类型，判断类型显示那种对话框
            dialogType: '',
            // 编辑/添加功能分类的所有数据
            cateParentList: [],
            // 编辑/添加分类的信息，两个id必须配置初始为0，因为接口要求不能为空
            cateFormModel: {
                cat_pid: 0,
                cat_name: '',
                cat_level: 0
            },
            // 级联选择器选中的父级分类id列表
            selectdKeys: [],
        };
    },
    mixins: [tableHeightMixin],
    created() {
        // 获取商品分类列表数据
        this.getCateList();
    },
    mounted() {
        // 设置级联菜的的span点击事件，隐藏了span标签前面的label
        setInterval(function() {
            document
                .querySelectorAll('.el-cascader-node__label')
                .forEach(el => {
                    el.onclick = function() {
                        // previousElementSibling属性返回指定元素的前一个兄弟元素（相同节点树层中的前一个元素节点）
                        if (this.previousElementSibling)
                            this.previousElementSibling.click();
                    };
                });
        }, 1000);
    },
    computed:{
        // 级联选择器的配置对象
        cascaderProps(){
            return {
                value: 'cat_id',
                label: 'cat_name',
                checkStrictly: true,
                expandTrigger: 'hover'
            }
        },
        // 编辑/添加分类的验证规则
        cateFormRules(){
            return {
                cat_name: [
                    {required: true, message: '请输入分类名', trigger: 'blur'},
                    {min: 1, max: 15, message: '用户名的长度在1-15个字符之间', trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        // 添加按钮点击事件
        addBtnClick(){
            this.dialogType = 'add';
            // 获取父级分类列表数据
            this.getParentCateList()
        },

        // 对话框关闭事件
        baseCancel() {
            this.dialogType = '';
            // 清空数据
            this.selectdKeys = [];
            this.cateFormModel = {}
        },
        // 级联选择器改变事件
        cascaderCateChanged(){
            //dropDownVisible 为element源码中的data属性
            this.$refs.cateCascaderRef.dropDownVisible = false;
            // 判断选中级联的model参数数组长度，如果大于一，说明选中了级别，否则未选级别
            // 如果长度=1，则选择了一级，如果=2则选择了二级
            if(this.selectdKeys.length > 0) {
                this.cateFormModel.cat_pid = this.selectdKeys[this.selectdKeys.length - 1]
                this.cateFormModel.cat_level = this.selectdKeys.length;
                // return
            }else {
                this.cateFormModel.cat_pid = 0;
                this.cateFormModel.cat_level = 0;
            }
        },
        // 添加对话框提交事件
        async addSubmit() {
            await postAddCate(this.cateFormModel).then(res => {
                const addCateRes = res.data;
                if (addCateRes.meta.status !== 201) {
                    return this.$toast.error(addCateRes.meta.msg);
                } else {
                    this.$toast.success(addCateRes.meta.msg);
                    // 对话框隐藏
                    this.baseCancel();
                    // 重新获取数据
                    this.getCateList();
                }
            });
        },
        // 编辑分类信息按钮点击事件，通过id和get请求查询对应信息
        async editClick(id){
            this.dialogType = 'edit';
            this.getId = id;
            await getCateInfo(id).then(res=>{
                const getCateRes = res.data
                if (getCateRes.meta.status !== 200) {
                    return this.$toast.error(getCateRes.meta.msg)
                }else {
                    this.$toast.success(getCateRes.meta.msg);
                    this.cateFormModel = getCateRes.data
                }
            });
        },
        // 编辑按钮提交事件
        async editSubmit() {
            await putCateEdit(this.getId, this.cateFormModel.cat_name).then(
                res => {
                    const editCateRes = res.data;
                    if (editCateRes.meta.status !== 200) {
                        return this.$toast.error(editCateRes.meta.msg);
                    } else {
                        // 提示修改成功
                        this.$toast.success(editCateRes.meta.msg);
                        // 对话框隐藏
                        this.baseCancel();
                        // 父组件重新获取数据
                        this.getCateList();
                    }
                }
            );
        },
        // 删除分类点击事件
        async removeClick(id){
            await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteCate(id).then(res=>{                        
                        if (res.data.meta.status !== 200) {
                            return this.$toast.error(res.data.meta.msg)
                        }else {
                            this.$toast.success(res.data.meta.msg)
                            // 添加数据后，获取数据前如果尾页只剩一个用户，则跳转到前一页
                            if(this.total && this.total % this.queryInfo.pagesize == 1){
                                this.queryInfo.pagenum--
                            }
                            // 重新获取数据
                            this.getCateList();
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
            this.getCateList();
        },
        
        // 监听页码值改变的事件
        handleCurrentChange(val) {
            //显示页面跳转并重新获取数据
            this.queryInfo.pagenum = val;
            this.getCateList();
        },
        
        // 获取Cate数据方法
        async getCateList() {
            await getCateData(this.queryInfo).then(res => {
                const cateRes = res.data;
                if (cateRes.meta.status !== 200) {
                    return this.$toast.error(cateRes.meta.msg);
                } else {
                    this.total = cateRes.data.total;
                    this.isLoading = false
                    this.cateList = cateRes.data.result
                }
            });
        },
        // 获取父级分类数据
        async getParentCateList() {
            await getCateData({type: 2}).then(res => {
                const cateRes = res.data;
                if (cateRes.meta.status !== 200) {
                    return this.$toast.error(cateRes.meta.msg);
                } else {
                    this.cateParentList = cateRes.data
                }
            });
        },
    },
};
</script>

<style lang="less" scoped>
/* 有子节点，未展开 */
.el-table /deep/ .el-table__expand-icon .el-icon-arrow-right:before{
    content: "\e723";
}
/* 有子节点，已展开 */
.el-table /deep/ .el-table__expand-icon--expanded {
    transform: none;
    .el-icon-arrow-right:before{
        content: "\e722";
    }
}
.el-table /deep/ .el-table__expand-icon {
    font-size: 14px;
}
</style>