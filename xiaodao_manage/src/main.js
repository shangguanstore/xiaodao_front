// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import '@/assets/css/global.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import qs from 'qs'
import { Message } from 'iview'
import App from './App'
import router from './router'


Vue.use(iView)


Vue.use(VueAxios, axios)


axios.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = "application/x-www-form-urlencoded"
        if(config.method === 'post') {
            console.log('发生post请求,参数为：', JSON.stringify(config.data))
            config.data.XDEBUG_SESSION_START = 'PHPSTORM'
            config.data = qs.stringify(config.data)
        }
        return config
    }
);

axios.interceptors.response.use(
    response => {
        console.log(response)
        if(response.data.errNo !== 100000) {
            Message.error(response.data.errMsg);
        } else {
            return response
        }
    },
    error => { //默认除了2XX之外的都是错误的，就会走这里
        console.log('error',error)
    }
)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
