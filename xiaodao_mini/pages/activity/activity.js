// pages/activity/activity.js
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
var WxParse = require('../../wxParse/wxParse.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var UU7 = wx.getStorageSync('UU7')
    if(UU7) {
      this.getData()
    }else{
      this.weixinAuth()
    }
    
    // this.test()
  },

  weixinAuth() {
    var _this = this
    wx.login({
      success: function(res) {
        if (res.code) {
          let url = 'api/code2session'
          let data = {
            cid: 100021,
            code: res.code,
          }
          request(url, 'get', data, function (res) {
            //res就是我们请求接口返回的数据
            wx.setStorageSync('UU7', res.data.UU7)
            _this.getData()
          }, function () {
            wx.showToast({
              title: '加载数据失败',
              icon: 'none'
            })
          })
        }
      }
    })

    
  },

  getData() {
    let url = 'api/activity/getlist'
    let data = {
      id: 8,
      queryDetail: true,
    }
    var _this = this
    request(url, 'get', data, function (res) {
      //res就是我们请求接口返回的数据
      var activity = res.data.activity
      var activityDetail = res.data.activity.activity_detail || []

      var html = activityDetail[0].detail

      WxParse.wxParse('article', 'html', html, _this, 5);

    }, function () {
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      })
    })
  },

  test() {
    let url = 'api/qiniu/token/get'
    let data = {
    }
    var _this = this
    request(url, 'post', data, function (res) {
      console.log('res',res)

    }, function () {
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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