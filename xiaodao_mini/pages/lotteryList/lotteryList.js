// pages/lotteryList/lotteryList.js
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getData() {
    this.setData({
      Loaded: false
    })
    let _this = this
    let url = 'api/lottery/draw/getlist'
    let data = {
      getActivityInfo: true,
      self: true
    }
    request(url, 'get', data, function (res) {
      //res就是我们请求接口返回的数据
      let list = res.data.data || []
      list.map(item=>{
        item.lottery_gift_limit_time_format = lib.date('Y-m-d', item.lottery_gift_limit_time)
      })

      _this.setData({
        Loaded: true,
        list
      })
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