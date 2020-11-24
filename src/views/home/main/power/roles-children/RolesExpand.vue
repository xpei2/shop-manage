<template>
    <el-table-column width="50" type="expand">
        <template slot-scope="scope">
            <el-row
                v-for="(item1, index1) in scope.row.children"
                :key="item1.id"
                :class="['bdbottom', index1 === 0 ? 'bdtop' : '']"
            >
                <!-- 渲染一级权限 -->
                <el-col :span="5"
                    ><el-tag
                        closable
                        @close="removeRight(scope.row, item1.id)"
                        >{{ item1.authName }}</el-tag
                    ><i class="el-icon-caret-right"></i
                ></el-col>
                <!-- 二级以下权限 -->
                <el-col :span="19">
                    <el-row
                        v-for="(item2, index2) in item1.children"
                        :key="item2.id"
                        :class="index2 === 0 ? '' : 'bdtop'"
                    >
                        <!-- 二级权限 -->
                        <el-col :span="6"
                            ><el-tag
                                type="success"
                                closable
                                @close="removeRight(scope.row, item2.id)"
                                >{{ item2.authName }}</el-tag
                            ><i class="el-icon-caret-right"></i
                        ></el-col>
                        <!-- 三级权限 -->
                        <el-col :span="18">
                            <el-tag
                                v-for="item3 in item2.children"
                                :key="item3.id"
                                type="warning"
                                closable
                                @close="removeRight(scope.row, item3.id)"
                                >{{ item3.authName }}</el-tag
                            >
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </template>
    </el-table-column>
</template>

<script>
export default {
    name: "RightExpand",
    methods: {
        //将当前点击的角色数据和权限id传给父组件
        removeRight(data, id) {
            this.$emit("removeRightById", data, id);
        }
    }
};
</script>

<style lang="less" scoped>
.el-table .el-row {
    display: flex;
    align-items: center;
}
.bdtop {
    border-top: 1px solid #eee;
}
.bdbottom {
    border-bottom: 1px solid #eee;
}
.el-table .el-row .el-tag {
    margin: 10px 10px 10px 0;
}
</style>
