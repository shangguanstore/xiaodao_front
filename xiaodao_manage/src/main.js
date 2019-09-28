// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import '@/assets/css/global.css'
import '@/assets/css/colors.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import qs from 'qs'
import {Message} from 'iview'
import App from './App'
import router from './router'
import store from './store'
import lib from '@/assets/js/lib'
import 'babel-polyfill'


Vue.use(iView)
Vue.use(lib)


Vue.use(VueAxios, axios)


axios.interceptors.request.use(
  config => {
    // config.headers['Content-Type'] = "application/x-www-form-urlencoded"
    config.headers['Content-Type'] = "application/json; charset=utf-8"
    if (config.method === 'post') {
      //config.data.XDEBUG_SESSION_START = 'PHPSTORM'
      config.url = `${config.url}?XDEBUG_SESSION_START=PHPSTORM`
    }
    console.log('请求config',config)
    console.log('请求config.data',config.data)
    return config
  }
);

axios.interceptors.response.use(
  response => {
    if (response.data.errNo !== 100000) {
      // Message.error(response.data.errMsg)
      throw new Error(response.data.errMsg)
      // return response
    } else {
      return response
    }
  },
  error => { //默认除了2XX之外的都是错误的，就会走这里
    console.log('error', error)
  }
)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
