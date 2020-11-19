// table的最大高度
export const tableHeightMixin = {
    data() {
        return {
            tableMaxHeigth: null
        }
    },
    mounted() {
        // 计算视口高度的百分比
        this.tableMaxHeigth = parseInt((document.documentElement.clientHeight || document.body.clientHeight) / 10 * 6)
    }
}
