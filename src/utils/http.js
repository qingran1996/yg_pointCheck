import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'
import router from '../router/index.js'

let loading // 定义loading变量

const baseURL = process.env.NODE_ENV==='development'?'http://192.168.10.152:10005':'http://192.168.10.153:10005' //开发模式 为152,build时为153
axios.defaults.timeout = 50000
axios.defaults.baseURL = baseURL // 关键步骤–填写后台请求统一的地址   外网地址头:http://61.177.60.14:10005/a 内网:http://192.168.1.184:10005/a
axios.defaults.withCredentials = true

// axios.defaults.headers = {
//   "content-type": "application/json",           // 设置传输类型(json,form表单)
//   "token": sessionStorage.getItem('token')      // token
// }

const showMessage = Symbol('showMessage')
// 重写
class DonMessage {
  success(options, single = true) {
    this[showMessage]('success', options, single)
  }
  warning(options, single = true) {
    this[showMessage]('warning', options, single)
  }
  info(options, single = true) {
    this[showMessage]('info', options, single)
  }
  error(options, single = true) {
    this[showMessage]('error', options, single)
  }

  [showMessage](type, options, single) {
    if (single) {
      // 判断是否已存在Message
      if (document.getElementsByClassName('el-message').length === 0) {
        Message[type](options)
      }
    } else {
      Message[type](options)
    }
  }
}
// 使用这个
var MessageOnce = new DonMessage()

// function startLoading() {
//   // 使用Element loading-start 方法
//   loading = Loading.service({
//     lock: true,
//     text: '加载中...',
//     background: 'rgba(0, 0, 0, 0.7)'
//   })
// }

// function endLoading() {
//   // 使用Element loading-close 方法
//   loading.close()
// }

// 请求拦截  设置统一header
axios.interceptors.request.use(
  config => {
    // 加载
    // startLoading();
    if (localStorage.eleToken) {
      config.headers.Authorization = 'Bearer ' + localStorage.eleToken
    }
    // console.log(config.url)
    return config
  },
  error => {
    loading.close()
    Message.error({
      message: '加载超时'
    })
    return Promise.reject(error)
  }
)

// 响应拦截  401 token过期处理
axios.interceptors.response.use(
  response => {
    // endLoading();
    // console.log(1)
    return response
  },
  error => {
    switch (error.response.status) {
      case 401:
        // console.log(error.response.status)
        // Message.error({
        // 	message: "登录信息已失效,请重新登录"
        // });
        // localStorage.removeItem("eleToken");
        // 	localStorage.removeItem('username');
        // 	localStorage.removeItem('userMenu');
        if (document.getElementsByClassName('el-message-box').length === 0) {
          // console.log(2)
          // localStorage.removeItem("eleToken");
          // localStorage.removeItem('username');
          // localStorage.removeItem('userMenu');
          MessageBox({
            title: '提示',
            message: '登录信息已失效，请重新登录',
            confirmButtonText: '确定',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                instance.confirmButtonLoading = true
                instance.confirmButtonText = '退出登陆中...'
                setTimeout(() => {
                  done()
                  setTimeout(() => {
                    instance.confirmButtonLoading = false
                  }, 300)
                }, 3000)
              } else {
                done()
              }
            }
          }).then(action => {
            router.push('/login')
            location.reload()
            localStorage.removeItem('eleToken')
            // localStorage.removeItem('username')
            // localStorage.removeItem('userMenu')
          })
            .catch(action => {
              Message({
                type: 'warning',
                message: '登录信息已失效，请刷新页面'
              })
            })
        }
        break
      case 500:
        MessageOnce.error({
          message: '系统繁忙'
        })
        break
      case 404:
        MessageOnce.error({
          message: '地址请求错误'
        })
        break
      case 403:
        MessageOnce.error({
          message: '权限不足,请联系管理员!'
        })
        break
    }

    return Promise.reject(error)
  }
)

export default axios
