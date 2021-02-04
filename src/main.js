import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/zh-CN'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css
import XLSX from 'xlsx'
import App from './App'
import store from './store'
import router from './router'
import axios from './utils/http.js'
import VueBus from 'vue-bus'
import config from './utils/config.js'
import axiosUser from './utils/axiosUser.js' //全局挂载axios post 方法
import Print from 'vue-print-nb'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import './utils/diagio'

import * as filters from './filters' // global filters
import preventReClick from '@/utils/preventReClick' //防止双击操作导入
Vue.use(VueBus)
Vue.use(config)
Vue.use(axiosUser)
Vue.use(XLSX)
Vue.use(Print)
Vue.prototype.$axios = axios
// const baseURL = 'http://192.168.10.153:10005'
// axios.defaults.timeout = 50000
// axios.defaults.baseURL = baseURL // 关键步骤–填写后台请求统一的地址   外网地址头:http://61.177.60.14:10005/a 内网:http://192.168.1.184:10005/a
// axios.defaults.withCredentials = true

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale: enLang // 如果使用中文，无需设置，请删除
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
