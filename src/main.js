import Vue from 'vue'
import App from './App'
import router from './router'

//  引入全局global css 样式
import './assets/css/global.css'

// 引入element ui组件
import ElementUi from 'element-ui'
//  把引入好的element-ui 放到vue中
Vue.use(ElementUi)

//  引入图标样式
import './assets/font/iconfont.css'

//  引入axios并且做相关配置
import axios from 'axios'
//  axios请求根地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//  给axios配置给vue的￥http成员
Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
