// pages/wxAuth/wxAuth.js
const app = getApp()
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
import { UserAuth } from "../../utils/userAuth";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  inputChange: function(e) {
    var phone = e.detail.value
    if (phone.length == 11) {
      this.setData({
        phone: phone
      })
    }
  },

  tapRegister: function(e) {
    var _this = this
    var userInfo = e.detail.userInfo
    if (!e.detail.userInfo) {
      return;
    }
    wx.setStorageSync('userInfo', e.detail.userInfo)

    var userSubmitInfo = {
      phone: this.data.phone
    }
    var userAuth = new UserAuth(userInfo, userSubmitInfo);
    userAuth.login(function(res) {
        wx.showToast({
            title: '操作成功',
            icon: 'success'
        })
        setTimeout(function () {
            wx.reLaunch({
                url: '../ucenter/ucenter'
            })
        }, 1500)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})