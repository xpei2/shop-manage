import Vue from "vue";
import {
    Button,
    Form,
    FormItem,
    Input,
    Radio,
    RadioGroup,
    CheckboxGroup,
    Checkbox,
    Select,
    Option,
    Autocomplete,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Loading,
    Tag,
    Tree,
    Cascader,
    Alert,
    Tabs,
    TabPane,
    Step,
    Steps,
    Upload,
    Timeline,
    TimelineItem
} from "element-ui";

Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Select);
Vue.use(Option);
Vue.use(Autocomplete)
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Loading);
Vue.use(Cascader);
Vue.use(Alert);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Step);
Vue.use(Steps);
Vue.use(Upload);
Vue.use(Timeline);
Vue.use(TimelineItem);

// 全局注册提示框
Vue.prototype.$toast = Message;
Vue.prototype.$confirm = MessageBox.confirm;

