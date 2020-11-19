<template>
    <div id="add_goods">
        <bread-crumb />
        <el-button v-show="!isSubmit" type="primary" class="back-goods" @click="backClick" size="mini">返回商品列表</el-button>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 警告区域 -->
            <el-alert :title="alertTitle" type="info" show-icon center :closable="false"/>
            <!-- 步骤条 -->
            <el-steps :active="activeIndex - 0" align-center process-status="finish" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
            </el-steps>
            <el-form 
            v-if="!isSubmit"
            :model="addGoodsForm" 
            :rules="addGoodsRule"
            label-position="top"
            ref="addGoodsRef"
            >
                <el-tabs 
                :tab-position="'left'" 
                v-model="activeIndex" 
                :before-leave="beforeTabLeave">
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
                        <el-form-item v-if="goodsType === 'add'" label="商品分类" prop="goods_cat">
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
                            <el-checkbox-group v-model="item.checkedMany">
                                <el-checkbox  border v-for="(value, i) in item.attr_vals" :label="value" :key="i" />
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item v-for="item in onlyParamsList" :label="item.attr_name" :key="item.attr_id">
                            <el-input v-model="item.inputOnly" clearable></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- active表示图片要上传到的后台API地址 -->
                        <el-upload
                            :action="uploadURL"
                            :headers="headerObj"
                            :file-list="defaultPic"
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
                        <el-button type="primary" class="add-submit" @click="addSubmit">验证提交</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <el-row v-else class="submit-success">
                <el-row class="success-cont">
                    <el-col :span="4">
                        <i class="el-icon-success"></i>
                    </el-col>
                    <el-col>
                        <div class="success-msg">   
                            <strong>提交成功</strong>
                            <p v-if="goodsType === 'add'">添加新商品成功，请选择是否继续添加！</p>
                            <p v-else>商品信息更新成功！</p>
                        </div>
                        <div>
                            <el-button type="primary" v-if="goodsType === 'add'" size="small" @click="againAddClick">继续添加</el-button>
                            <el-button type="primary" size="small" @click="backClick">返回</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-row>
        </el-card>
        <!-- 图片预览对话框 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="48%" show-close>
            <img :src="previewPath" alt="" width="100%">
        </el-dialog>
    </div>
</template>

<script>
// 导入公共组件
import BreadCrumb from '_com/main/bread-crumb/BreadCrumb';
// 导入axios，获取分类数据
import { getCateData, getParamsData, postAddGoods, getGoodsInfo, putGoodsEdit } from '_new/goods';

// 导入公共方法判断上传文件类型和后缀
import { imageRegExp } from '_con/utils'

// 导入lodash
import _ from 'lodash';
export default {
    // 注入依赖
    inject: ['againAddGoods'],
    name: 'HandleGoods',
    data(){
        return {
            // 是否已经提交
            isSubmit: false,
            // 商品id
            goodsId: '',
            // 商品表单类型
            goodsType: '',
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
            // 已上传的图片列表
            defaultPic: [],
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
        // 警告标题文字
        alertTitle(){
            return this.goodsType === 'add' ? '添加商品信息' : '编辑商品信息'
        },
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
        // 设置功能类型和商品id
        this.goodsId = this.$route.params.id ? this.$route.params.id : '';
        this.goodsType = this.$route.params.type;
        // 获取参数信息
        if(this.goodsType === 'add') {
            // 如果是添加功能，获取商品分类列表数据
            this.getCateList();
        }else {
            // 如果是编辑功能，获取商品信息
            this.getGoodsInfo()
        }
    },
    methods: {
        // 级联选择器改变事件
        cascaderCateChanged() {
            // 证明选中的不是三级分类
            if (this.addGoodsForm.goods_cat.length !== 3) {
                this.$toast.warning('只允许选择三级分类！');
                // 清空级联选择器数据
                this.addGoodsForm.goods_cat = [];
                return
            }else {
                // 获取商品参数信息
                this.getParamsList('many');
                this.getParamsList('only');
            }
        },
        // 页签的切换规则，如果基本信息有一个为空，则不能点击其他页签
        beforeTabLeave(activeName, oldActiveName) {
            if (oldActiveName === '0' && this.goodsType === 'add' && this.addGoodsForm.goods_cat.length !== 3) {
                this.$toast.error('请检查是否选择了商品分类！')
                return false
            }
        },

        // 图片预览效果点击事件
        handlePreview(file){
            if(file) {
                this.previewVisible = true
                this.previewPath = file.response ? file.response.data.url : file.url
            }
        },
        // 删除图片点击事件
        handleRemove(file){
            // file.response是新上传的图片独有的回调
            // 且每次上传不知道为什么会执行删除点击事件，所以需要判断一下
            if(file.response) {
                // 获取将要删除的图片的临时路径
                // 从pics数组中过滤这个路径
                let filePath = file.response.data.tmp_path
                this.addGoodsForm.pics = this.addGoodsForm.pics.filter(item => item.pic !== filePath)
            }else if(file && this.goodsType === 'edit'){
                this.addGoodsForm.pics = this.addGoodsForm.pics.filter(item => item.pic !== file.tmp_path)
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
        // 上传之前判断文件类型和大小，imageRegExp为导入的公共方法
        beforeUpload(file) {
            if(parseInt(file.size / 1024) > 500) {
                this.$toast.error('上传失败，图片超过规定大小！')
                return false
            }else if(!imageRegExp(file.type)) {
                this.$toast.error('上传失败，只允许上传jpg/png/jpeg类型的图片！')
                return false
            }
        },
        // 提交事件
        addSubmit(){
            this.$refs.addGoodsRef.validate(valid =>{
                if(!valid) {
                    return this.$toast.error('请检查必填项是否都填写完成！')
                }else {
                    // 深拷贝处理分类
                    const form = _.cloneDeep(this.addGoodsForm)
                    // 判断分类参数是否是数组，如果是则转换为字符串
                    form.goods_cat = Object.prototype.toString.call(form.goods_cat) === "[object Array]" ? form.goods_cat.join(',') : form.goods_cat;
                    // 清空参数列表并处理动态参数
                    form.attrs = [];
                    this.handleParams(this.manyParamsList, form.attrs)
                    this.handleParams(this.onlyParamsList, form.attrs)
                    this.goodsType === 'add' ? this.postAddGoods(form) : this.putGoodsEdit(form)
                }
            })
        },
        // 提交商品表单时处理参数的方法
        handleParams(arr, pushArr) {
            arr.forEach(item => {
                let newInfo = {attr_id: item.attr_id}
                
                if(item.attr_sel === 'many') {
                    newInfo.attr_value = item.checkedMany;
                    newInfo.attr_value = newInfo.attr_value.join(' ')
                }else {
                    newInfo.attr_value = item.inputOnly;
                }
                pushArr.push(newInfo)
            })
        },
        // 提交之后，跳转到完成步骤的操作
        // 继续添加商品
        againAddClick(){
            // 调用Home组件中的刷新路由页面依赖
            this.againAddGoods()
        },
        // 返回商品列表页面
        backClick(){
            this.$router.back()
        },
        // 添加功能——提交方法
        async postAddGoods(obj) {
            await postAddGoods(obj).then(res => {
                const addGoodsRes = res.data;
                if (addGoodsRes.meta.status !== 201) {
                    return this.$toast.error(addGoodsRes.meta.msg);
                } else {
                    this.$toast.success(addGoodsRes.meta.msg);
                    this.isSubmit = true;
                }
            })
        },

        // 编辑功能——通过id和get请求查询对应信息
        async getGoodsInfo(){
            await getGoodsInfo(this.goodsId).then(res=>{
                const getGoodsRes = res.data
                if (getGoodsRes.meta.status !== 200) {
                    return this.$toast.error(getGoodsRes.meta.msg)
                }else {
                    this.$toast.success(getGoodsRes.meta.msg);
                    // 处理参数信息
                    if(getGoodsRes.data.attrs) {
                        getGoodsRes.data.attrs.forEach(item => {
                            if(item.attr_sel === 'many') {
                                // 处理动态参数转换为数组并创建已有参数的对象
                                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
                                item.checkedMany = item.attr_value ? item.attr_value.split(' ') : [];
                                this.manyParamsList.push(item)
                            }else {
                                // attr_value才是商品真正的参数，attr_vals是默认参数
                                item.inputOnly = item.attr_value ? item.attr_value : ''
                                this.onlyParamsList.push(item)
                            }
                        })
                    }
                    // 处理图片信息
                    if(getGoodsRes.data.pics) {
                        getGoodsRes.data.pics.forEach(item => {
                            // 创建新对象并将图片信息赋值给默认上传图片的数组
                            let newPic = {}
                            newPic.name = item.pics_id
                            newPic.url = item.pics_big_url
                            newPic.tmp_path = item.pics_big
                            this.defaultPic.push(newPic)
                            // 将表单中已上传图片的临时路径赋值给pic对象，便于提交
                            item.pic = item.pics_big
                        })
                    }
                    
                    this.addGoodsForm = getGoodsRes.data
                }
            });
        },
        
        // 编辑功能——提交方法
        async putGoodsEdit(obj){
            await putGoodsEdit(this.goodsId, obj).then(res => {
                const editGoodsRes = res.data;
                console.log(editGoodsRes);
                if (editGoodsRes.meta.status !== 200) {
                    return this.$toast.error(editGoodsRes.meta.msg);
                } else {
                    this.$toast.success('更新成功！');
                    this.isSubmit = true;
                }
            })
        },
        // 添加功能——获取所有分类数据
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
        // 添加功能——获取参数数据
        async getParamsList(paramsSel) {
            await getParamsData(this.getCateId, paramsSel).then((res) => {
                const paramsRes = res.data;
                if (paramsRes.meta.status !== 200) {
                    return this.$toast.error('获取默认参数失败！');
                } else {
                    switch (paramsSel) {
                        case 'many':
                            paramsRes.data.forEach((item) => {
                                // 将attr_vals属性转换为数组，便于展示
                                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [];
                                item.checkedMany = []
                            });
                            this.manyParamsList = paramsRes.data;
                            break;
                        case 'only':
                            paramsRes.data.forEach((item) => {
                                item.inputOnly = item.attr_vals ? item.attr_vals: ''
                            })
                            this.onlyParamsList = paramsRes.data;
                            break;
                    }
                }
            });
        },
    },
    watch: {
        // 监听是否已经提交，是则所有步骤均完成
        isSubmit(bol){
            if(bol) {
                this.activeIndex = '5'
            }
        }
    }
};
</script>

<style scoped>
#add_goods {
    position: relative;
}
.back-goods {
    position: absolute;
    right: 0;
    top: 0;
    margin-top: -7px;
}
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
.submit-success {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
}
.success-cont {
    display: flex;
    min-width: 320px;
}
.submit-success .el-icon-success {
    font-size: 40px;
    color: #409eff;
    margin-right: 7px;
 }
 .success-msg p{
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 200%;
    color: #909399;
 }
</style>