<template>
    <div id="cate">
        <bread-crumb />
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addClick">添加分类</el-button>
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
        <!-- 添加编辑分类对话框 -->
        <from-dialog 
            :is-dialog="isDialog"
            dialog-label-width="100px"
            :dialog-title="cateDialogTitle"
            :dialog-type="dialogType"
            :dialog-form-model="cateFormModel"
            :dialog-form-rules="cateFormRules"
            @cancelClick="dialogClose"
            @addSubmitClick="addSubmit"
            @editSubmitClick="editSubmit"
        >
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="cateFormModel.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类" v-if="dialogType === 'add'">
                <!-- options数据源 -->
                <el-cascader
                v-model="goods_cat"
                :options="cateParentList"
                clearable
                ref="cateCascaderRef"
                :props="cateCasProps"
                @change="cascaderCateChanged"
                popper-class="cate-cascader"
                ></el-cascader>
            </el-form-item>
        </from-dialog>
    </div>
</template>

<script>
// 导入公共组件
import BreadCrumb from '_com/main/BreadCrumb';
import FromDialog from '_com/main/FromDialog';

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
        FromDialog,
    },
    data() {
        return {
            isLoading: true,
            // 添加/编辑对话框是否显示
            isDialog: false,
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
            goods_cat: [],
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
        // 对话框标题名字
        cateDialogTitle() {
            return this.dialogType === 'add' ? '添加分类' : '编辑分类信息'
        },
        // 级联选择器的配置对象
        cateCasProps(){
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
        // 添加/编辑对话框显示事件
        dialogShow() {
            this.isDialog = true;
        },
        // 对话框关闭事件
        dialogClose() {
            this.isDialog = false;
            // 清空数据
            this.goods_cat = [];
            this.cateFormModel = {}
        },

        // 添加点击事件
        addClick(){
            // 设置对话框类型为add
            this.dialogType = 'add';
            // 对话框显示
            this.dialogShow();
            // 获取父级分类列表数据
            this.getParentCateList()
        },

        // 级联选择器改变事件
        cascaderCateChanged(){
            //dropDownVisible 为element源码中的data属性
            this.$refs.cateCascaderRef.dropDownVisible = false;
            // 判断选中级联的model参数数组长度，如果大于一，说明选中了级别，否则未选级别
            // 如果长度=1，则选择了一级，如果=2则选择了二级
            if(this.goods_cat.length > 0) {
                this.cateFormModel.cat_pid = this.goods_cat[this.goods_cat.length - 1]
                this.cateFormModel.cat_level = this.goods_cat.length;
                // return
            }else {
                this.cateFormModel.cat_pid = 0;
                this.cateFormModel.cat_level = 0;
            }
        },
        // 添加对话框提交事件
        addSubmit() {
            this.postAddCate(this.cateFormModel)
        },

        // 编辑分类信息点击事件
        editClick(cateId){
            // 设置对话框类型为edit
            this.dialogType = 'edit';
            // 对话框显示
            this.dialogShow();
            this.getId = cateId;
            this.getCateInfo(cateId)
        },

        // 编辑分类提交事件
        editSubmit() {
            this.putCateEdit(this.getId, this.cateFormModel.cat_name)
        },

        // 删除点击事件
        removeClick(cateId){
            this.deleteCate(cateId)
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
        
        // 添加提交方法
        async postAddCate(obj) {
            await postAddCate(obj).then(res => {
                const addCateRes = res.data;
                if (addCateRes.meta.status !== 201) {
                    return this.$toast.error(addCateRes.meta.msg);
                } else {
                    this.$toast.success(addCateRes.meta.msg);
                    // 关闭对话框
                    this.dialogClose();
                    // 重新获取数据
                    this.getCateList();
                }
            });
        },

        // 通过id和get请求查询对应信息
        async getCateInfo(cateId){
            await getCateInfo(cateId).then(res=>{
                const getCateRes = res.data
                if (getCateRes.meta.status !== 200) {
                    return this.$toast.error(getCateRes.meta.msg)
                }else {
                    this.$toast.success(getCateRes.meta.msg);
                    this.cateFormModel = getCateRes.data
                }
            });
        },

        // 编辑分类方法
        async putCateEdit(cateId, cateName) {
            await putCateEdit(cateId, cateName).then(
                res => {
                    const editCateRes = res.data;
                    if (editCateRes.meta.status !== 200) {
                        return this.$toast.error(editCateRes.meta.msg);
                    } else {
                        // 提示修改成功
                        this.$toast.success(editCateRes.meta.msg);
                        // 关闭对话框
                        this.dialogClose();
                        // 重新获取数据
                        this.getCateList();
                    }
                }
            );
        },

        // 删除分类方法
        async deleteCate(cateId){
            await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteCate(cateId).then(res=>{                        
                        if (res.data.meta.status !== 200) {
                            return this.$toast.error(res.data.meta.msg)
                        }else {
                            this.$toast.success(res.data.meta.msg)
                            // 添加数据后，获取数据前如果尾页只剩一个用户，则跳转到前一页
                            if(this.total && this.total % this.queryInfo.pagesize == 0){
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
        
        // 获取Cate数据方法
        async getCateList() {
            await getCateData(this.queryInfo.type, this.queryInfo.pagenum, this.queryInfo.pagesize).then(res => {
                const cateRes = res.data;
                if (cateRes.meta.status !== 200) {
                    return this.$toast.error(cateRes.meta.msg);
                } else {
                    this.$toast.success('获取商品分类列表成功！');
                    this.total = cateRes.data.total;
                    this.isLoading = false
                    this.cateList = cateRes.data.result
                }
            });
        },
        // 获取父级分类数据
        async getParentCateList() {
            await getCateData(2).then(res => {
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
.el-cascader {
    width: 100%;
}
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