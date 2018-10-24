// pages/myJoin/myJoin.js
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Loaded: false,
    activityOrderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getActivityOrderList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getActivityOrderList() {
    this.setData({
      Loaded: false
    })
    let url = 'api/activity/order/getlist'
    let data = {
      mid: wx.getStorageSync('mid'),
      pageIndex: 1,
      pageSize: 100
    }
    var _this = this
    request(url, 'get', data, function (res) {
      //res就是我们请求接口返回的数据
      var activityOrderList = res.data.data
      activityOrderList.map(function (item) {
        item.imglink_format = lib.getImglink(item.imglink)[0]
        return item
      })

      _this.setData({
        Loaded: true,
        activityOrderList: activityOrderList
      })
    }, function () {
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      })
    })
  },

  routeTo(event) {
    console.log(event)
    wx.navigateTo({
      url: event.currentTarget.dataset.url
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