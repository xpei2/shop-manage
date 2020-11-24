<template>
    <div id="report">
        <bread-crumb />
        <!-- 卡片视图 -->
        <el-card>
            <div id="echart" class="echarts"></div>
        </el-card>
    </div>
</template>

<script>
import echarts from 'echarts';
// 导入公共组件
import BreadCrumb from '_com/main/bread-crumb/BreadCrumb';

import { getEchartData } from '_new/report';
import _ from 'lodash';

export default {
    name: 'Report',
    components: {
        BreadCrumb,
    },
    data() {
        return {
            options: {
                title: {
                    text: '用户来源',
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3',
                        },
                    },
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                },
                xAxis: [
                    {
                        boundaryGap: false,
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                    },
                ],
            },
        };
    },
    mounted() {
        this.echarts_init();
    },
    methods: {
        // 初始化报表
        async echarts_init() {
            // 基于准备好的dom，初始化charts实例
            var myChart = echarts.init(document.getElementById('echart'));
            const { data: res } = await getEchartData();
            if (res.meta.status !== 200)
                return this.$toast.error(res.data.meta.msg);
            // 将默认参数合并到获取到的数据对象中
            const result = _.merge(res.data, this.options);
            myChart.setOption(result);
        },
    },
};
</script>
<style scoped>
.echarts {
    width: 750px;
    height: 400px;
}
</style>