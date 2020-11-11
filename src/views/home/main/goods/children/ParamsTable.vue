<template>
    <!-- 表格内容 -->
    <div>
        <el-button
            type="primary"
            :disabled="isDisabled"
            size="mini"
            @click="addClick"
            >{{ paramsSelTxt.addBtnText }}</el-button
        >
        <!-- 表格数据 -->
        <el-table :data="paramsList" stripe border :max-height="tableMaxHeigth - 100">
            <!-- 插入展开内容 -->
            <slot></slot>
            <el-table-column
                label="#"
                width="50"
                type="index"
            ></el-table-column>
            <el-table-column
                prop="attr_name"
                :label="paramsSelTxt.paramsName"
            ></el-table-column>
            <el-table-column label="操作" width="320">
                <!-- 自定义插槽 -->
                <template slot-scope="scope">
                    <!-- 修改按钮 -->
                    <el-button
                        type="primary"
                        icon="el-icon-edit"
                        size="mini"
                        @click="editClick(scope.row.cat_id, scope.row.attr_id)"
                        >编辑</el-button
                    >
                    <!-- 删除按钮 -->
                    <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        @click="removeClick(scope.row.cat_id, scope.row.attr_id)"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
// 导入混入
import { tableHeightMixin } from '_con/mixin';

export default {
    name: 'ParamsTable',
    props: {
        // 参数数据
        paramsList: {
            type: Array,
            default() {
                return [];
            }
        },
        // 传递过来的参数种类
        paramsSel: {
            type: String,
            default: 'many'
        },
        // 选择的分类数组
        selectdKeys: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    mixins: [tableHeightMixin],
    computed: {
        // 选择参数对应的各种文字
        paramsSelTxt() {
            return this.paramsSel === 'many'
                ? { addBtnText: '添加参数', paramsName: '参数名称' }
                : { addBtnText: '添加属性', paramsName: '属性名称' };
        },
        // 控制是否禁用添加按钮
        isDisabled() {
            return this.selectdKeys.length !== 3 ? true : false;
        }
    },
    methods: {
        // 添加按钮点击事件
        addClick() {
            this.$emit('addClick')
        },
        // 编辑按钮点击事件
        editClick(cateId, attrId){
            this.$emit('editClick', cateId, attrId)
        },
        // 删除按钮点击事件
        removeClick(cateId, attrId){
            this.$emit('removeClick', cateId, attrId)
        }
    }
};
</script>
