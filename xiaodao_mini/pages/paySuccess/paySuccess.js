// pages/paySuccess/paySuccess.js
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    Loaded: false,
    type: 0,
    activityId: 0,
    orderId: 0,
    activityOrder: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //type: 1: 普通活动
    console.log('options',options)
    let type = options.type || 0
    let activityId = options.activityId || 0
    let orderId = options.orderId || 0

    this.setData({
      type: type,
      activityId: activityId,
      orderId: orderId
    })
    
    if(type == 1 && activityId) {
      this.getActivity()
    }
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getActivity: function() {
    this.setData({
      Loaded: false
    })
    let url = 'api/activity/order/getlist'
    let data = {
      id: this.data.orderId
    }
    var _this = this
    request(url, 'get', data, function (res) {
      //res就是我们请求接口返回的数据
      console.log('res',res)
      var activityOrder = res.data.data
      activityOrder = lib.filterResult(activityOrder)
      activityOrder = activityOrder[0]

      _this.setData({
        Loaded: true,
        activityOrder: activityOrder
      })
    }, function () {
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      })
    })
  },

  backActivity() {
    console.log(222)
    wx.navigateBack({
      delta: 2
    })
  },

  viewTicket(e) {
    let name = e.currentTarget.dataset.name
    let orderId = e.currentTarget.dataset.order
    let activityId = e.currentTarget.dataset.activity
    let nickname = e.currentTarget.dataset.nickname
    let join_phone = e.currentTarget.dataset.join_phone
    let start_time_format = e.currentTarget.dataset.start_time_format

    wx.navigateTo({
      url: `../eTicket/eTicket?name=${name}&orderId=${orderId}&activityId=${activityId}&join_phone=${join_phone}&nickname=${nickname}&start_time_format=${start_time_format}`,
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