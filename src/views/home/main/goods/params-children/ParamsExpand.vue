<template>
    <!-- 表格展开的内容 -->
    <el-table-column width="50" type="expand">
        <template slot-scope="props">
            <el-tag
                v-for="(tag, i) in props.row.attr_vals"
                :key="i"
                closable
                @close="removeParams(props.row, i)"
                >{{ tag }}</el-tag
            >
            <!-- 输入文本框 -->
            <el-input
                class="input-new-tag"
                v-if="props.row.inputVisible"
                v-model="props.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(props.row)"
                @blur="handleInputConfirm(props.row)"
            ></el-input>
            <!-- 添加按钮 -->
            <el-tooltip
                v-else
                effect="dark"
                content="不能是纯空格！"
                placement="top"
            >
                <el-button
                    class="button-new-tag"
                    size="small"
                    @click="showInput(props.row)"
                    >+添加标签</el-button
                >
            </el-tooltip>
        </template>
    </el-table-column>
</template>

<script>
export default {
    name: 'ParamsExpand',
    props: {},
    methods: {
        // 删除对应的参数标签
        removeParams(item, i) {
            this.$confirm('是否永久删除该标签？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    item.attr_vals.splice(i, 1);
                    // 提交删除事件给父组件
                    this.$emit('removeParamsAttr', item);
                })
                .catch(() => {
                    this.$toast.info('已取消删除');
                });
        },
        // 展示文本输入框
        showInput(item) {
            item.inputVisible = true;
            this.$nextTick(() => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm(item) {
            if (item.inputValue.trim().length !== 0) {
                item.attr_vals.push(item.inputValue.trim());
                this.$emit('addParamsAttr', item);
            }
            item.inputVisible = false;
            item.inputValue = '';
        }
    }
};
</script>

<style scoped>
.el-tag {
    margin: 10px 10px 10px 0;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 130px;
    margin-left: 10px;
}
</style>