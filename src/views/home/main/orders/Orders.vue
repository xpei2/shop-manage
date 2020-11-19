<template>
    <div id="orders">
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
                    @clear="getOrdersList" 
                    @keyup.enter.native="getOrdersList">
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="getOrdersList"
                        ></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 表格数据 -->
            <el-table :data="ordersList" stripe border :max-height="tableMaxHeigth">
                <el-table-column label="#" width="50" type="index"></el-table-column>
                <el-table-column prop="order_number" label="订单编号"></el-table-column>
                <el-table-column prop="order_price" width="130" label="订单价格(元)"></el-table-column>
                <el-table-column prop="pay_status" width="140" label="是否付款" align="center">
                    <template slot-scope="scope">
                       <el-radio-group v-model="scope.row.pay_status">
                            <el-radio :label="'0'">否</el-radio>
                            <el-radio :label="'1'">是</el-radio>
                        </el-radio-group>
                    </template>
                </el-table-column>
                <el-table-column prop="order_pay" width="320" label="支付方式" align="center">
                    <template slot-scope="scope">
                        <el-radio-group v-model="scope.row.order_pay">
                            <el-radio :label="'0'" size="mini"><i class="iconfont iconweizhifu"></i></el-radio>
                            <el-radio :label="'1'"><i class="iconfont iconzhifubao"></i></el-radio>
                            <el-radio :label="'2'"><i class="iconfont iconweixin"></i></el-radio>
                            <el-radio :label="'3'"><i class="iconfont icon-"></i></el-radio>
                        </el-radio-group>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" width="140" label="是否发货" align="center">
                    <template slot-scope="scope">
                        <el-radio-group v-model="scope.row.is_send">
                            <el-radio :label="'否'">否</el-radio>
                            <el-radio :label="'是'">是</el-radio>
                        </el-radio-group>
                    </template>
                </el-table-column>
                <el-table-column width="200" label="下单时间">
                    <template slot-scope="scope">{{scope.row.create_time | rateDate}}</template>
                </el-table-column>
                <el-table-column label="操作" width="130">
                    <!-- 自定义插槽 -->
                    <template>
                        <!-- 修改按钮 -->
                        <el-tooltip effect="dark" content="修改订单地址" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogShow"></el-button>
                        </el-tooltip>
                        <!-- 物流按钮 -->
                        <el-tooltip effect="dark" content="查看物流进度" placement="top" :enterable="false">
                            <el-button type="success" icon="el-icon-location" size="mini" @click="progressClick"></el-button>
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
        <!-- 修改地址对话框 -->
        <from-dialog 
            :is-dialog="isDialog"
            dialog-label-width="100px"
            dialog-title="修改地址信息"
            :dialog-form-model="addressModel"
            :dialog-form-rules="addressRules"
            @cancelClick="dialogClose"
            @submitClick="editSubmit"
        >
            <el-form-item label="省市区/县" prop="address1">
                <!-- options数据源 -->
                <el-cascader
                v-model="addressModel.address1"
                :options="citydata"
                clearable
                filterable
                placeholder="可直接在选择框内搜索"
                ref="cateCascaderRef"
                popper-class="address-cascader"
                ></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address2">
                <el-input v-model="addressModel.address2"></el-input>
            </el-form-item>
        </from-dialog>
        <!-- 时间线对话框 -->
        <el-dialog
        title="修改地址信息"
        width="50%"
        :visible.sync="isProgressDialog"
        >
            <el-timeline>
                <el-timeline-item
                v-for="(activity, index) in progressInfo"
                :key="index"
                :icon="activity.icon"
                :color="activity.color"
                :size="activity.size"
                :timestamp="activity.time">
                {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
// 导入公共组件
import BreadCrumb from '_com/main/bread-crumb/BreadCrumb'
import FromDialog from '_com/main/dialog/FromDialog';

import { 
    getOrdersData, 
    getProgressData
} from '_new/orders';

// 导入城市数据
import citydata from './citydata'
// 导入模拟物流假数据
import progress from './progress'

// 导入混入
import { tableHeightMixin } from '_con/mixin';

// 导入时间处理函数
import { formatDate } from '_con/utils'

export default {
    name: 'Orders',
    components: {
        BreadCrumb,
        FromDialog
    },
    data() {
        return {
            // order数据列表
            ordersList: [],
            // 城市数据
            citydata,
            // 物流进度数据
            progressInfo: [],
            // order数据请求的参数
            queryInfo: {
                query: '',
                // 当前的页数
                pagenum: 1,
                // 每页显示多少条数据
                pagesize: 10
            },
            // 地址表单
            addressModel: {
                address1: [],
                address2: ''
            },
            // order数量
            total: 0,
            // 编辑对话框的显示与隐藏
            isDialog: false,
            isProgressDialog: false
        };
    },
    mixins: [tableHeightMixin],
    created() {
        // 获取商品列表数据
        this.getOrdersList();
    },
    computed: {        
        // 选中用户的表单验证规则，添加/编辑对话框的规则
        addressRules(){
            return {
                address1: [
                    {required: true, message: '请选择省市区！', trigger: 'change'},
                ],
                address2: [
                    {required: true, message: '请输入详细地址！', trigger: 'blur'},
                ]
            }
        }
    },
    methods: {       
        // 对话框显示事件
        dialogShow() {
            this.isDialog = true;
        },
        // 对话框关闭事件
        dialogClose() {
            this.isDialog = false;
        },

        // 编辑提交事件
        editSubmit(){
            this.dialogClose()
        },
        // 查看物流点击事件
        progressClick(){
            this.isProgressDialog = true;
            this.progressInfo = progress.data
            // this.getProgressData('快递单号')
        },
        // 监听pagesize改变的事件
        handleSizeChange(val) {
            //设置每页显示多少条，并重新获取数据
            this.queryInfo.pagesize = val;
            this.getOrdersList();
        },
        
        // 监听页码值改变的事件
        handleCurrentChange(val) {
            //显示页面跳转并重新获取数据
            this.queryInfo.pagenum = val;
            this.getOrdersList();
        },

        // 获取Goods数据方法
        async getOrdersList() {
            await getOrdersData(
                this.queryInfo.query,
                this.queryInfo.pagenum,
                this.queryInfo.pagesize
            ).then(res => {
                const orderRes = res.data;
                if (orderRes.meta.status !== 200) {
                    return this.$toast.error(orderRes.meta.msg);
                } else {
                    this.ordersList = orderRes.data.goods;
                    this.total = orderRes.data.total;
                }
            });
        },
        // 获取物流数据
        async getProgressData(id) {
           await getProgressData(id).then(res => {
                const progressRes = res.data;
                if (progressRes.meta.status !== 200) {
                    return this.$toast.error(progressRes.meta.msg);
                } else {
                    console.log(progressRes);
                    this.$toast.success(progressRes.meta.msg);
                    this.progressInfo = progressRes.data;
                }
            })
        }
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
.el-cascader {
    width: 100%;
}
.el-radio-group {
    display: flex;
    align-items: center;
    justify-content: center;
}
.el-radio {
    margin-right: 0;
    display: flex;
    align-items: center;
}
.el-radio:nth-of-type(n+2) {
    margin-left: 20px;
}
.iconfont {
    font-size: 24px;
}
</style>