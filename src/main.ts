import router from './router';
import store from './store';
import { app } from '@/app';
// 公共的类与方法
import moment from 'moment';
import { numberToAbbr } from './app/services/NumberAbbr';
import { Timestamp } from '@/utils/formatTimestamp';
import { preview } from '@/app/services/preview';
import { useAuthData } from '@/app/services/auth/auth.provider';
import { toUniversalURL } from '@/config/menu-redirect';
import { toPublicURL } from '@/app/services/toPublicURL';
import { validatorRules } from '@/utils/ValidatorRules';
import { numberToCurrencyText } from '@/utils/numberToCurrencyText';
// 公共的组件们
import MainLayout from '@/components/main-layout/MainLayout.vue';
import Antd from 'ant-design-vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import SvgIcon from '@/components/SvgIcon.vue';
import ContextMenu from 'v-contextmenu'; // 用来实现鼠标右键的组件
import BcRow from '@/components/row/index.vue'
import MShowMore from '@/components/m-show-more.vue'
import ContentCard from '@/components/layouts/content-card.vue'
import searchTablePagerV2 from '@/components/SearchTablePagerV2.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
// 太多公共样式了 以后icon相关全部使用svg-icon组件哦
import './assets/css/vars.styl';
import './assets/css/base.css';
import './assets/css/site.styl';
import './assets/css/antd-reset.less';
import './assets/css/element-plus-reset.scss';
import 'nprogress/nprogress.css';
import 'v-contextmenu/dist/themes/default.css';
import './style/public.scss'
import './assets/iconfont-crm/iconfont.css';
// 让控制台少一些无意义的warning
import './dev-conf.ts';
// 富文本静态资源引入
import "./statics/index";

app.use(ContextMenu)
  .use(Antd as any)
  .use(store)
  .use(router)
  .use(ElementPlus, { locale: zhCn })
  .component('mainLayout', MainLayout)
  .component('svg-icon', SvgIcon)
  .component('bc-row', BcRow)
  .component('m-show-more', MShowMore)
  .component('content-card', ContentCard)
  .component('search-table-pager-v2',searchTablePagerV2)
  .mount('#app');

const asPublic = (name, obj) => {
  app.use(app => app.config.globalProperties[name] = obj)
}
/**
 * 全局函数的注册
 */
asPublic('$timestamp', Timestamp)
asPublic('$previewImage', (url, urls = []) => {
  preview.value.url = url;
  preview.value.urls = urls;
})
asPublic('$auth', useAuthData().hasPermission)
asPublic('$hasPermission', useAuthData().hasPermission)
asPublic('$pageAuth', useAuthData().pageHasPermission)
asPublic('$isMe', useAuthData().isMe)
asPublic('$me', () => useAuthData().username)
asPublic('$universalURL', toUniversalURL)
asPublic('$toPublicURL', toPublicURL)
asPublic('$rules', validatorRules)
asPublic('$toCurrency', numberToCurrencyText)
asPublic('$hideBiliScore', true) // 隐藏电磁力、等级
asPublic('$numberToAbbr', numberToAbbr)
asPublic('$moment', moment)
asPublic('$message', ElMessage)
asPublic('$msgbox', ElMessageBox)