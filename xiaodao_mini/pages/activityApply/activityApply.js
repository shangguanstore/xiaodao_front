// pages/activityApply/activityApply.js
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
const app = getApp()
import { UserAuth } from "../../utils/userAuth"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activityId: 0,
    username: '',
    phone: '',
    age: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var activityId = options.id
    console.log(activityId)
    this.setData({
      activityId: activityId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  inputName(e) {
    this.data.username = e.detail
  },

  inputAge(e) {
    this.data.age = e.detail
  },

  inputPhone(e) {
    this.data.phone = e.detail
  },

  tapApply() {
    let phone = this.data.phone
    let name = this.data.username
    let _this = this
    if (lib.empty(name)) {
      wx.showToast({
        title: '请输入孩子姓名',
        icon: 'none'
      })
      return
    }
    if(!lib.isPhone(phone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return
    }

    let url = 'api/member/update'
    let data = {
      mid: wx.getStorageSync('mid'),
      phone: phone,
      name: name,
      enforce_change_phone: true
    }
    request(url, 'post', data, function (res, addition) {
      //res就是我们请求接口返回的数据
      var member = res.data.member
      var UU7 = res.data.UU7
      wx.setStorageSync('mid', member.mid)
      wx.setStorageSync('phone', member.phone)
      wx.setStorageSync('name', member.uname)
      wx.setStorageSync('avatar', member.avatar)
      wx.setStorageSync('UU7', UU7)

      _this.joinActivity(name, phone)
    }, function () {
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      })
    })
  },

  joinActivity(nickname, join_phone) {
    let url = 'api/activity/order/add'
    let data = {
      activity_id: this.data.activityId,
      nickname: nickname,
      join_phone: join_phone
      // join_phone: '15335195967'
    }
    var _this = this
    request(url, 'post', data, function (res) {
      //res就是我们请求接口返回的数据
      wx.showToast({
        title: '成功报名！',
        icon: 'success'
      })
      setTimeout(function () {
        wx.navigateTo({
          url: '../myJoin/myJoin'
        })
      }, 3000)
    }, function (res) {
      wx.showToast({
        title: res.data.errMsg,
        icon: 'none'
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})