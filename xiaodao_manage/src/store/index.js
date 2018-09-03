//store index.js
import Vue from 'vue'
import Vuex from 'vuex'
import cookie from '@/assets/js/cookie.js'

Vue.use(Vuex)
//初始化时用sessionStore.getItem('token'),这样子刷新页面就无需重新登录
const state = {
  //改为从cookie获取数据
  UU7: cookie.getCookie('UU7'),
  uname: cookie.getCookie('uname'),
};
const mutations = {
  LOGIN: (state, data) => {
    //更改token的值
    state.UU7 = data
    cookie.setCookie('UU7', data, 7)
  },
  LOGOUT: (state) => {
    //登出的时候要清除token
    state.token = null
    window.sessionStorage.removeItem('usermoudle')
    window.sessionStorage.removeItem('useraction')
    cookie.delCookie('token')
    cookie.delCookie('username')
    cookie.delCookie('rolelevel')
    cookie.delCookie('usercompanyid')
    cookie.delCookie('usercompanyname')
    cookie.delCookie('userpic')
  },
  USERNAME: (state, data) => {
    //把用户名存起来
    state.uname = data
    // window.sessionStorage.setItem('username', data)
    cookie.setCookie('uname', data, 7)
  },
  ROLELEVEL: (state, data) => {
    // 把用户的角色级别存起来
    state.rolelevel = data
    //window.sessionStorage.setItem('rolelevel', data)
    cookie.setCookie('rolelevel', data, 7)
  },
  USERCOMPANYID: (state, data) => {
    state.usercompanyid = data
    //window.sessionStorage.setItem('usercompanyid', data)
    cookie.setCookie('usercompanyid', data, 7)
  },
  USERMOUDLE: (state, data) => {
    // 存储管辖公司后的可用模块列表
    state.usermoudle = data
    window.sessionStorage.setItem('usermoudle', JSON.stringify(data))
    //cookie.setCookie('usermoudle', JSON.stringify(data), 7)
  },
  USERACTION: (state, data) => {
    // 存储管辖公司后的可用模块列表
    state.useraction = data
     window.sessionStorage.setItem('useraction', JSON.stringify(data))
    //cookie.setCookie('useraction', JSON.stringify(data), 7)
  },
	COMPANYNAME: (state, data) => {
    // 存储管辖公司后的可用模块列表
    state.usercompanyname = data
    //window.sessionStorage.setItem('usercompanyname', JSON.stringify(data))
    cookie.setCookie('usercompanyname', data, 7)
  },
  USERPIC: (state, data) => {
    // 存储管辖公司后的可用模块列表
    state.userpic = data
    //window.sessionStorage.setItem('usercompanyname', JSON.stringify(data))
    cookie.setCookie('userpic', data, 7)
  },
};
const actions = {
  UserLogin({
              commit
            }, data) {
    commit('LOGIN', data)
  },
  UserLogout({
               commit
             }) {
    commit('LOGOUT')
  },
  UserName({
             commit
           }, data) {
    commit('USERNAME', data)
  },
  RoleLevel({
              commit
            }, data) {
    commit('ROLELEVEL', data)
  },
  UserCompanyId({
                  commit
                }, data) {
    commit('USERCOMPANYID', data)
  },
  // 获取管辖公司之后得模块列表
  UserMoudle({
               commit
             }, data) {
    commit('USERMOUDLE', data)
  },
  UserAction({
               commit
             }, data) {
    commit('USERACTION', data)
  },
  UserCompanyName({
               commit
             }, data) {
    commit('COMPANYNAME', data)
  },
  UserPic({
               commit
             }, data) {
    commit('USERPIC', data)
  },
};
export default new Vuex.Store({
  state,
  mutations,
  actions
});
