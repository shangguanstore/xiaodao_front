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
  cid: cookie.getCookie('cid'),
  uid: cookie.getCookie('uid'),
  mid: cookie.getCookie('mid'),
  company_name: cookie.getCookie('company_name'),
  role_name: cookie.getCookie('role_name'),
  role_id: cookie.getCookie('role_id'),
};
const mutations = {
  LOGIN: (state, data) => {
    //更改token的值
    state.UU7 = data
    cookie.setCookie('UU7', data, 7)
  },
  LOGOUT: (state) => {
    //登出的时候要清除token
    cookie.delCookie('uname')
    cookie.delCookie('cid')
    cookie.delCookie('uid')
    cookie.delCookie('mid')
    cookie.delCookie('company_name')
    cookie.delCookie('role_name')
    cookie.delCookie('role_id')
  },
  Uname: (state, data) => {
    //把用户名存起来
    state.uname = data
    cookie.setCookie('uname', data, 7)
  },
  ROLELEVEL: (state, data) => {
    // 把用户的角色级别存起来
    state.rolelevel = data
    //window.sessionStorage.setItem('rolelevel', data)
    cookie.setCookie('rolelevel', data, 7)
  },
  Cid: (state, data) => {
    state.cid = data
    cookie.setCookie('cid', data, 7)
  },
  Uid: (state, data) => {
    state.uid = data
    cookie.setCookie('uid', data, 7)
  },
  Mid: (state, data) => {
    state.mid = data
    cookie.setCookie('mid', data, 7)
  },
  RoleName: (state, data) => {
    state.role_name = data
    cookie.setCookie('role_name', data, 7)
  },
  RoleId: (state, data) => {
    state.role_id = data
    cookie.setCookie('role_id', data, 7)
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
	CompanyName: (state, data) => {
    // 存储管辖公司后的可用模块列表
    state.company_name = data
    cookie.setCookie('company_name', data, 7)
  },
  USERPIC: (state, data) => {
    // 存储管辖公司后的可用模块列表
    state.userpic = data
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
  Uname({
             commit
           }, data) {
    commit('Uname', data)
  },
  RoleLevel({
              commit
            }, data) {
    commit('ROLELEVEL', data)
  },
  Cid({
                  commit
                }, data) {
    commit('Cid', data)
  },
  Uid({
        commit
      }, data) {
    commit('Uid', data)
  },
  Mid({
        commit
      }, data) {
    commit('Mid', data)
  },
  RoleName({
                  commit
                }, data) {
    commit('RoleName', data)
  },
  RoleId({
             commit
           }, data) {
    commit('RoleId', data)
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

  CompanyName({
               commit
             }, data) {
    commit('CompanyName', data)
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
