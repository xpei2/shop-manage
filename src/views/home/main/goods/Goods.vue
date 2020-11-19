<template>
    <div id="goods">
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
                    @clear="getGoodsList" 
                    @keyup.enter.native="getGoodsList">
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getGoodsList"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="addClick">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 表格数据 -->
            <el-table :data="goodsList" stripe border :max-height="tableMaxHeigth">
                <el-table-column label="#" width="50" type="index"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" width="130" label="商品价格(元)"></el-table-column>
                <el-table-column prop="goods_weight" width="100" label="商品重量"></el-table-column>
                <el-table-column width="160" label="创建时间">
                    <template slot-scope="scope">{{scope.row.add_time | rateDate}}</template>
                </el-table-column>
                <el-table-column label="操作" width="130">
                    <!-- 自定义插槽 -->
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editClick(scope.row.goods_id)"></el-button>
                        </el-tooltip>
                        <!-- 删除按钮 -->
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeClick(scope.row.goods_id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                background
            >
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
// 导入公共组件
import BreadCrumb from '_com/main/bread-crumb/BreadCrumb'

import { 
    getGoodsData, 
    deleteGoods
} from '_new/goods';

// 导入Vuex
import { mapMutations } from 'vuex';

// 导入混入
import { tableHeightMixin } from '_con/mixin';

// 导入时间处理函数
import { formatDate } from '_con/utils'

export default {
    name: 'Goods',
    components: {
        BreadCrumb
    },
    data() {
        return {
            // goods数据列表
            goodsList: [],
            // goods数量
            total: 0,
            // goods数据请求的参数
            queryInfo: {
                query: '',
                // 当前的页数
                pagenum: 1,
                // 每页显示多少条数据
                pagesize: 10
            },
        };
    },
    mixins: [tableHeightMixin],
    created() {
        // 获取商品列表数据
        this.getGoodsList();
    },
    methods: {
        ...mapMutations([
            'setBreadCrumb'
        ]),
        // 添加点击事件
        addClick(){
            let asideNav = {
                nav1: this.$store.state.breadCrumb.nav1,
                nav2: this.$store.state.breadCrumb.nav2,
                nav3: '添加商品',
            }
            //提交改变状态管理
            this.setBreadCrumb(asideNav);
            // 跳转到添加页面
            this.$router.push(`/goods/add`)
        },
        // 编辑商品点击事件
        editClick(goodsId){
            let asideNav = {
                nav1: this.$store.state.breadCrumb.nav1,
                nav2: this.$store.state.breadCrumb.nav2,
                nav3: '修改信息',
            }
            //提交改变状态管理
            this.setBreadCrumb(asideNav);
            // 跳转到编辑页面且传过去商品id
            this.$router.push(`/goods/edit/${goodsId}`)
        },
        // 删除商品点击事件
        removeClick(goodsId){
            this.deleteGoods(goodsId)
        },

        // 监听pagesize改变的事件
        handleSizeChange(val) {
            //设置每页显示多少条，并重新获取数据
            this.queryInfo.pagesize = val;
            this.getGoodsList();
        },
        
        // 监听页码值改变的事件
        handleCurrentChange(val) {
            //显示页面跳转并重新获取数据
            this.queryInfo.pagenum = val;
            this.getGoodsList();
        },

        // 删除商品方法
        async deleteGoods(goodsId){
            await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    deleteGoods(goodsId).then(res=>{                        
                        if (res.data.meta.status !== 200) {
                            return this.$toast.error(res.data.meta.msg)
                        }else {
                            this.$toast.success(res.data.meta.msg)
                            // 添加数据后，获取数据前如果尾页只剩一个商品，则跳转到前一页
                            if(this.total && this.total % this.queryInfo.pagesize == 1){
                                this.queryInfo.pagenum--
                            }
                            // 重新获取数据
                            this.getGoodsList();
                        }
                    })
                }).catch(() => {
                    this.$toast.info('已取消删除')       
            });
        },
        
        // 获取Goods数据方法
        async getGoodsList() {
            await getGoodsData(
                this.queryInfo.query,
                this.queryInfo.pagenum,
                this.queryInfo.pagesize
            ).then(res => {
                const goodsRes = res.data;
                if (goodsRes.meta.status !== 200) {
                    return this.$toast.error(goodsRes.meta.msg);
                } else {
                    this.goodsList = goodsRes.data.goods;
                    this.total = goodsRes.data.total;
                }
            });
        },
    },
    filters: {
        rateDate(value) {
            const date = new Date(value * 1000);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss') 
        }
    }
};
</script>

<style lang="less" scoped>
.set-role {
    p{
        margin: 15px 0;
    }
}
</style>