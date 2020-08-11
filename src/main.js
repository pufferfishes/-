import Vue from 'vue'
import App from './App'
import router from './router'

// 引入当前项目的全局css样式控制
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
// 引入axios
import axios from 'axios'
// 引入element-ui
import ElementUI from 'element-ui'
Vue.use(ElementUI)
// 给axios做配置
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
