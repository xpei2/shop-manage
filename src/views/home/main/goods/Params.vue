<template>
    <div id="params">
        <bread-crumb />
        <!-- 卡片视图 -->
        <el-card>
            <!-- 警告 -->
            <el-alert
                title="注意：只允许为第三级分类设置相关参数"
                show-icon
                :closable="false"
                type="warning"
            >
            </el-alert>
            <el-row class="cate-select">
                <el-col>
                    <span>选择商品分类：</span>
                    <!-- 选择商品分类 -->
                    <el-cascader
                        v-model="selectdKeys"
                        :options="cateList"
                        clearable
                        ref="cateCascaderRef"
                        :props="cateCasProps"
                        @change="cascaderCateChanged"
                        popper-class="cate-cascader"
                    ></el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="paramsSel" @tab-click="handleClick">
                <!-- 添加动态参数页签 -->
                <el-tab-pane label="动态参数" name="many"></el-tab-pane>
                <!-- 添加静态属性页签 -->
                <el-tab-pane label="静态属性" name="only"></el-tab-pane>
            </el-tabs>
            <!-- 表格数据，动态参数和静态属性公用 -->
            <params-table
                :params-list="paramsList"
                :params-sel="paramsSel"
                :selectd-keys="selectdKeys"
                @addClick="addClick"
                @editClick="editClick"
                @removeClick="removeParams"
            >
                <params-expand @addParamsAttr="addParamsAttr" @removeParamsAttr="removeParamsAttr"/>
            </params-table>
        </el-card>
        <!-- 添加/编辑参数对话框公用 -->
        <from-dialog
            :is-dialog="isDialog"
            dialog-label-width="100px"
            :dialog-title="paramsDialogInfo.dialogTitle"
            :dialog-type="dialogType"
            :dialog-form-model="paramsFormModel"
            :dialog-form-rules="paramsFormRules"
            @cancelClick="dialogClose"
            @addSubmitClick="addSubmit"
            @editSubmitClick="editSubmit"
        >
            <el-form-item
                :label="paramsDialogInfo.labelName"
                prop="attr_name"
            >
                <el-input v-model="paramsFormModel.attr_name"></el-input>
            </el-form-item>
        </from-dialog>
    </div>
</template>

<script>
// 导入公共组件
import BreadCrumb from '_com/main/BreadCrumb';
import FromDialog from '_com/main/FromDialog';

// 导入子组件
import ParamsTable from './children/ParamsTable';
import ParamsExpand from './children/ParamsExpand';

// 导入axios方法
import {
    getCateData,
    getParamsData,
    postAddParams,
    getParamsInfo,
    putParamsEdit,
    deleteParams
} from '_new/goods';

export default {
    name: 'Params',
    components: {
        BreadCrumb,
        FromDialog,
        ParamsTable,
        ParamsExpand
    },
    data() {
        return {
            // 分类列表数据
            cateList: [],
            // 添加/编辑对话框是否显示
            isDialog: false,
            // 参数/属性的id
            getId: '',
            // 默认tab页签和获取数据的sel参数
            paramsSel: 'many',
            // 页签参数数据
            paramsList: [],
            // 对话框类型，判断类型显示那种对话框
            dialogType: 'add',
            // 编辑/添加参数的信息，两个id必须配置初始为0，因为接口要求不能为空
            paramsFormModel: {},
            // 级联选择器选中的父级分类id列表
            selectdKeys: []
        };
    },
    created() {
        // 获取商品分类列表数据
        this.getCateList();
    },
    computed: {
        // 级联选择器的配置对象
        cateCasProps() {
            return {
                value: 'cat_id',
                label: 'cat_name',
                expandTrigger: 'hover'
            };
        },
        // 对话框文字信息
        paramsDialogInfo() {
            let titleType = this.dialogType === 'add' ? '添加' : '编辑';
            let titleSel =
                this.paramsSel === 'many'
                    ? { title: '动态参数', itemName: '参数名称' }
                    : { title: '静态属性', itemName: '属性名称' };

            return {
                dialogTitle: `${titleType}${titleSel.title}`,
                labelName: titleSel.itemName
            };
        },

        // 获取分类id
        getCateId() {
            return this.selectdKeys.length === 3 ? this.selectdKeys[2] : null;
        },
        // 编辑/添加参数的验证规则
        paramsFormRules() {
            return {
                attr_name: [
                    {
                        required: true,
                        message: '请输入名称',
                        trigger: 'blur'
                    },
                    {
                        min: 1,
                        max: 15,
                        message: '名称长度在1-15个字符之间',
                        trigger: 'blur'
                    }
                ]
            };
        }
    },
    methods: {
        // 级联选择器改变事件
        cascaderCateChanged() {
            // 证明选中的不是三级分类
            if (this.selectdKeys.length !== 3) {
                this.$toast.warning('只允许选择三级分类！');
                // 清空级联选择器数据
                this.selectdKeys = [];
                // 清空表格数据
                this.paramsList = [];
                return;
            } else {
                // 根据所选分类id，和当前所处的面板，获取对应参数
                this.getParamsList();
            }
        },

        // 页签点击事件
        handleClick() {
            // 根据所选分类id，和当前所处的面板，获取对应参数
            this.getParamsList();
        },

        // 对话框显示事件
        dialogShow() {
            this.isDialog = true;
        },

        // 对话框关闭事件
        dialogClose() {
            this.isDialog = false;
        },

        // 添加点击事件
        addClick() {
            // 设置对话框类型为add
            this.dialogType = 'add';
            // 对话框显示
            this.dialogShow();
        },

        // 添加参数提交事件
        addSubmit() {
           this.postAddParams(this.getCateId, {
                attr_name: this.paramsFormModel.attr_name,
                attr_sel: this.paramsSel
            })
        },

        // 编辑按钮点击事件
        editClick(cateId, attrId) {
            // 设置对话框类型为edit
            this.dialogType = 'edit';
            // 对话框显示
            this.dialogShow();
            this.getId = attrId;
            // 获取参数信息
            this.getParamsInfo(cateId, attrId, this.paramsSel)
        },

        // 编辑参数提交事件
        editSubmit() {
            this.putParamsEdit(this.getCateId, this.getId, this.paramsFormModel)
        },

        // 添加标签事件
        addParamsAttr(item){
            this.putParamsEdit(item.cat_id, item.attr_id, item, false)
        },
        
        // 删除参数事件
        removeParams(cateId, attrId) {
            this.deleteParams(cateId, attrId)
        },
        // 删除标签事件
        removeParamsAttr(item){
            this.putParamsEdit(item.cat_id, item.attr_id, item, false)
        },

        // 添加参数方法
        async postAddParams(cateId, obj) {
            await postAddParams(cateId, obj).then(res => {
                const addParamsRes = res.data;
                if (addParamsRes.meta.status !== 201) {
                    return this.$toast.error(addParamsRes.meta.msg);
                } else {
                    this.$toast.success(addParamsRes.meta.msg);
                    // 对话框隐藏
                    this.dialogClose();
                    // 重新获取数据
                    this.getParamsList();
                }
            });
        },

        // 通过id和get请求查询参数信息
        async getParamsInfo(cateId, attrId, sel) {
            await getParamsInfo(cateId, attrId, sel).then(res=>{
                const getParamsRes = res.data
                if (getParamsRes.meta.status !== 200) {
                    return this.$toast.error(getParamsRes.meta.msg)
                }else {
                    this.$toast.success(getParamsRes.meta.msg);
                    this.paramsFormModel = getParamsRes.data
                }
            });
        },

        // 修改参数/标签方法
        async putParamsEdit(cateId, attrId, obj, isRefresh = true) {
            await putParamsEdit(cateId, attrId, obj).then(
                res => {
                    const editCateRes = res.data;
                    if (editCateRes.meta.status !== 200) {
                        return this.$toast.error(editCateRes.meta.msg);
                    } else {
                        // 提示修改成功
                        this.$toast.success(editCateRes.meta.msg);
                        if(isRefresh){
                            // 对话框隐藏
                            this.dialogClose();
                            // 重新获取数据
                            this.getParamsList();
                        }
                    }
                }
            );
        },

        // 删除参数方法
        async deleteParams(cateId, attrId) {
            await this.$confirm(
                '是否永久删除该参数信息/属性信息？',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(() => {
                deleteParams(cateId, attrId).then(res => {
                    if (res.data.meta.status !== 200) {
                        return this.$toast.error(res.data.meta.msg);
                    } else {
                        this.$toast.success(res.data.meta.msg);
                        this.getParamsList();
                    }
                });
            })
            .catch(() => {
                this.$toast.info('已取消删除');
            });
        },

        // 获取所有分类数据
        async getCateList() {
            await getCateData().then(res => {
                const cateRes = res.data;
                if (cateRes.meta.status !== 200) {
                    return this.$toast.error(cateRes.meta.msg);
                } else {
                    this.cateList = cateRes.data;
                }
            });
        },

        // 获取参数数据
        async getParamsList() {
            await getParamsData(this.getCateId, this.paramsSel).then(res => {
                const paramsRes = res.data;
                if (paramsRes.meta.status !== 200) {
                    return this.$toast.error(
                        '获取数据失败，请检查是否选择了分类！'
                    );
                } else {
                    paramsRes.data.forEach(item => {
                        // 将attr_vals属性转换为数组，便于展示
                        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
                        // 添加文本框显示隐藏的属性
                        item.inputVisible = false;
                        // 添加文本框value值
                        item.inputValue = ''
                    })
                    this.paramsList = paramsRes.data;
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
.cate-select {
    margin: 15px 0;
}
</style>