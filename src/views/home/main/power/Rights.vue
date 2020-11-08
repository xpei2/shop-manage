<template>
    <div>
        <bread-crumb />
        <!-- 卡片视图 -->
        <el-card>
            <!-- 表格数据 -->
            <el-table :data="rightsList" stripe border :max-height="tableMaxHeigth">
                <el-table-column label="#" width="60" type="index"></el-table-column>
                <el-table-column prop="authName" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="路径"></el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                        <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
                        <el-tag v-else-if="scope.row.level === '2'" type="warning">三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
// 导入公共组件
import BreadCrumb from '_com/main/BreadCrumb';
// 导入axios
import { getRightsData } from '_new/power';

// 导入混入
import { tableHeightMixin } from '_con/mixin';

export default {
    name: 'Rights',
    components: {
        BreadCrumb
    },
    data() {
        return {
            rightsList: []
        };
    },
    mixins: [tableHeightMixin],
    created() {
        this.getRightsList();
    },
    methods: {
        // 获取权限列表树所有数据
        async getRightsList() {
            await getRightsData('list').then(res => {
                const rightsRes = res.data;
                if (rightsRes.meta.status !== 200) {
                    return this.$toast.error(rightsRes.meta.msg);
                } else {
                    this.rightsList = rightsRes.data;
                }
            });
        }
    }
};
</script>