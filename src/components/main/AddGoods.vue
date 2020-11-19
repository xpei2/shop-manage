<template>
    <div id="add_goods">
        <bread-crumb />
        <!-- 卡片视图 -->
        <el-card>
            <!-- 警告区域 -->
            <el-alert title="添加商品信息" type="info" show-icon center :closable="false"/>
            <!-- 步骤条 -->
            <el-steps :active="activeIndex - 0" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <el-form 
            :model="addGoodsForm" 
            :rules="addGoodsRule"
            label-position="top"
            ref="addGoodsRef"
            >
                <el-tabs 
                :tab-position="'left'" 
                v-model="activeIndex" 
                :before-leave="beforeTabLeave"
                @tab-click="tabClick">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addGoodsForm.goods_name" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格(元)" prop="goods_price">
                            <el-input v-model="addGoodsForm.goods_price" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model.number="addGoodsForm.goods_number" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量(kg)" prop="goods_weight">
                            <el-input v-model="addGoodsForm.goods_weight" clearable></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <!-- 选择商品分类 -->
                            <el-cascader
                                v-model="addGoodsForm.goods_cat"
                                :options="cateList"
                                clearable
                                ref="cateCascaderRef"
                                :props="cateCasProps"
                                @change="cascaderCateChanged"
                                popper-class="cate-cascader"
                            ></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item v-for="item in manyParamsList" :label="item.attr_name" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox  border v-for="(value, i) in item.attr_vals" :label="value" :key="i" />
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item v-for="item in onlyParamsList" :label="item.attr_name" :key="item.attr_id">
                            <el-input v-model="item.attr_vals" clearable></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- active表示图片要上传到的后台API地址 -->
                        <el-upload
                            :action="uploadURL"
                            :headers="headerObj"
                            multiple
                            :before-upload="beforeUpload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            list-type="picture"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
                        <el-button type="primary" class="add-submit" @click="addSubmit">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 图片预览对话框 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="48%" show-close>
            <img :src="previewPath" alt="" width="100%">
        </el-dialog>
    </div>
</template>

<script>
// 导入公共组件
import BreadCrumb from '_com/main/BreadCrumb';
// 导入axios，获取分类数据
import { getCateData, getParamsData, postAddGoods } from '_new/goods';

// 导入公共方法判断上传文件类型和后缀
import { imageRegExp } from '_con/utils'

// 导入lodash
import _ from 'lodash';
export default {
    name: 'AddGoods',
    data(){
        return {
            // 分类列表数据
            cateList: [],
            // 页签和步骤导航的绑定值
            activeIndex: '0',
            // 表单数据
            addGoodsForm: {
                goods_name: '',
                // 商品所属分类
                goods_cat: [],
                goods_price: 0,
                goods_number: 0,
                goods_weight: 0,
                goods_introduce: '',
                // 图片上传成功的临时路径
                pics: [],
                // 参数
                attrs: []
            },
            // 动态参数列表
            manyParamsList: [],
            // 静态属性列表
            onlyParamsList: [],
            // 上传图片的后台API地址
            uploadURL: 'http://shop.xpei.ren:8888/api/private/v1/upload',
            // 图片上传组件的请求头对象
            headerObj: {
                Authorization: window.sessionStorage.getItem("token")
            },
            // 图片预览对话框隐藏与显示
            previewVisible: false,
            // 图片预览地址
            previewPath: ''
        }
    },
    components: {
        BreadCrumb
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
        // 表单验证规则
        addGoodsRule() {
            return {
                goods_name: [
                    {required: true, message: '请输入商品名称！', trigger: 'blur'},
                    {min: 2, max: 15, message: '名称长度在2-15个字符之间！', trigger: 'blur'}
                ],
                goods_price: [
                    {required: true, message: '请输入商品价格！', trigger: 'blur'},
                    {pattern: /^\d{1,5}(\.\d{1,2})?$/, message: '请输入正确的格式：数字、最多两位小数、大于0！', trigger: 'blur'}
                ],
                goods_number: [
                    {required: true, message: '请输入商品数量！', trigger: 'blur'},
                    {type: 'integer', min: 0, message: '数量必须是不小于0的整数！', trigger: 'blur'}
                ],
                goods_weight: [
                    {required: true, message: '请输入商品重量！', trigger: 'blur'},
                    {pattern: /^\d{1,5}(\.\d{1,2})?$/, message: '请输入正确的格式：数字、最多两位小数、大于0！', trigger: 'blur'}
                ],
                goods_cat: [
                    {required: true, type: 'array', message: '请选择商品分类', trigger: 'blur'},
                ]
            };
        },
        // 获取商品分类id
        getCateId(){
            return this.addGoodsForm.goods_cat.length === 3 ? this.addGoodsForm.goods_cat[2] : null;
        }
    },
    created() {
        // 获取商品分类列表数据
        this.getCateList();
    },
    methods: {
        // 级联选择器改变事件
        cascaderCateChanged() {
            // 证明选中的不是三级分类
            if (this.addGoodsForm.goods_cat.length !== 3) {
                this.$toast.warning('只允许选择三级分类！');
                // 清空级联选择器数据
                this.addGoodsForm.goods_cat = [];
            }
        },
        // 页签的切换规则，如果基本信息有一个为空，则不能点击其他页签
        beforeTabLeave(activeName, oldActiveName) {
            if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
                this.$toast.error('请检查是否选择了商品分类！')
                return false
            }
        },
        // 页签点击事件
        tabClick(){
            // 证明访问的是动态参数面板
            if(this.activeIndex === '1') {
                this.getParamsList('many')
            }else if(this.activeIndex === '2') {
                this.getParamsList('only')
            }
        },
        // 图片预览效果点击事件
        handlePreview(file){
            if(file.response) {
                this.previewVisible = true
                this.previewPath = file.response.data.url
            }
        },
        // 删除图片点击事件
        handleRemove(file){
            if(file.response) {
                // 获取将要删除的图片的临时路径
                // 从pics数组中过滤这个路径
                let filePath = file.response.data.tmp_path
                this.addGoodsForm.pics = this.addGoodsForm.pics.filter(item => item.pic !== filePath)
            }
        },
        // 图片上传成功事件
        handleSuccess(response) {
            if(response.meta.status !== 200) {
                return this.$toast.err('上传失败！')
            }else {
                this.$toast.success(response.meta.msg);
                const picInfo = {pic: response.data.tmp_path}
                // 将上传的图片临时路径添加到数组中
                this.addGoodsForm.pics.push(picInfo)
            }
        },
        // 上传之前判断文件类型和大小
        beforeUpload(file) {
            if(parseInt(file.size / 1024) > 500) {
                this.$toast.error('上传失败，图片超过规定大小！')
                return false
            }else if(!imageRegExp(file.type)) {
                this.$toast.error('上传失败，只允许上传jpg/png/jpeg类型的图片！')
                return false
            }
        },
        // 添加提交事件
        addSubmit(){
            this.$refs.addGoodsRef.validate(valid =>{
                if(!valid) {
                    return this.$toast.error('请检查必填项是否都填写完成！')
                }else {
                    // 深拷贝处理分类
                    const form = _.cloneDeep(this.addGoodsForm)
                    form.goods_cat = form.goods_cat.join(',');
                    // 处理动态参数
                    this.handleParams(this.manyParamsList, form.attrs)
                    this.handleParams(this.onlyParamsList, form.attrs)
                    console.log(form);
                    this.postAddGoods(form)
                }
            })
        },
        // 处理参数方法
        handleParams(arr, pushArr) {
            arr.forEach(item => {
                const newInfo = {attr_id: item.attr_id, attr_value: item.attr_vals};
                if(Object.prototype.toString.call(newInfo.attr_value) === "[object Array]"){
                    newInfo.attr_value = newInfo.attr_value.join(' ')
                }
                pushArr.push(newInfo)
            })
        },
        // 添加提交方法
        async postAddGoods(obj) {
            await postAddGoods(obj).then(res => {
                const addGoodsRes = res.data;
                if (addGoodsRes.meta.status !== 201) {
                    return this.$toast.error(addGoodsRes.meta.msg);
                } else {
                    this.$toast.success(addGoodsRes.meta.msg);
                    // 跳转到商品列表页面
                    this.$router.back()
                }
            })
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
        async getParamsList(paramsSel) {
            await getParamsData(this.getCateId, paramsSel).then((res) => {
                const paramsRes = res.data;
                if (paramsRes.meta.status !== 200) {
                    return this.$toast.error('获取默认参数失败！');
                } else {
                    this.$toast.success('获取默认参数成功！');
                    switch (paramsSel) {
                        case 'many':
                            paramsRes.data.forEach((item) => {
                                // 将attr_vals属性转换为数组，便于展示
                                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
                            });
                            this.manyParamsList = paramsRes.data;
                            break;
                        case 'only':
                            this.onlyParamsList = paramsRes.data;
                            break;
                    }
                }
            });
        },
    }
};
</script>

<style scoped>
.el-steps {
    margin: 15px 0;
}
.el-tabs,.add-submit {
    margin-top: 15px;
}
.el-cascader {
    width: 100%;
}
.el-checkbox {
    margin: 0 10px 10px 0 !important;
}

</style>