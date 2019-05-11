// pages/orderDetail/orderDetail.js
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: {},
    formValidate: {},
    activity: {},
    order: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let config = app.config
    let activityId = options.activityId
    let orderId = options.orderId
    let formValidate = {}
    let member = wx.getStorageSync('member')
    formValidate.uname = member.uname
    formValidate.phone = member.phone
    this.setData({
      activityId: activityId,
      config: config,
      orderId: orderId,
      formValidate: formValidate
    })

    this.getActivityData()
    this.getOrderData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getActivityData() {
    this.setData({
      Loaded: false
    })
    let _this = this
    let url = 'api/activity/getlist'
    let data = {
      id: this.data.activityId,
      queryDetail: false
    }
    request(url, 'get', data, function (res) {
      //res就是我们请求接口返回的数据
      let activity = res.data.data || []
      activity = lib.filterResult(activity)[0]

      _this.setData({
        activity: activity
      })
    }, function () {
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      })
    })
  },

  getOrderData() {
    this.setData({
      Loaded: false
    })
    let _this = this
    let url = 'api/activity/order/getlist'
    let data = {
      id: this.data.orderId
    }
    request(url, 'get', data, function (res) {
      //res就是我们请求接口返回的数据
      let order = res.data.data || []
      order = lib.filterResult(order)[0]

      _this.setData({
        order: order
      })
    }, function () {
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      })
    })
  },

  // handlePay() {
  //   wx.navigateTo({
  //     url: `../paySuccess/paySuccess?type=1&activityId=${this.data.activityId}&orderId=${this.data.orderId}`
  //   })
  // },

  handlePay() {
    let url = 'api/weixin/pay'
    let data = {
        order_id: this.data.order.id,
        order_sn: this.data.order.sn
    }
    var _this = this
    request(url, 'post', data, function (res) {
      //res就是我们请求接口返回的数据
      console.log('res',res)
      let unifiedorderData = res.data.data.unifiedorderData
      let miniRequestData = res.data.data.miniRequestData

      if (unifiedorderData.result_code == 'SUCCESS') {
        wx.requestPayment({
          timeStamp: miniRequestData.timeStamp,
          nonceStr: miniRequestData.nonceStr,
          package: miniRequestData.package,
          signType: miniRequestData.signType,
          paySign: miniRequestData.paySign,
          success(res) {
            console.log('pay-res', res)
            wx.navigateTo({
              url: `../paySuccess/paySuccess?activityId=${_this.data.activityId}&orderId=${_this.data.orderId}`
            })
          },
          fail(res) {
            console.log('pay-fail', res)
          }
        })
      }else{
        wx.showToast({
          title: unifiedorderData.err_code_des,
          icon: 'none'
        })
      }
    }, function () {
      wx.showToast({
        title: '加载数据失败',
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