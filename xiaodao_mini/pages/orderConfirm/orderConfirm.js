// pages/orderConfirm /orderConfirm.js
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    config: {},
    activityId: 0,
    orderType: 203,
    groupid: 0,
    activity: {},
    paymentIndex: 0,
    paymentArr: ['微信支付'],
    formValidate: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //订单确认页的活动信息，从后台拉取最新信息
    console.log('订单确认页参数：',options)
    let config = app.config
    let activityData = JSON.parse(options.activityData)
    console.log('activityData', activityData)
    let activityId = activityData.id
    let orderType = options.orderType
    let groupid = options.groupid
    let member = wx.getStorageSync('member')
    let formValidate = {}
    formValidate.uname = member.uname
    formValidate.phone = member.phone

    this.setData({
      config: config,
      formValidate: formValidate,
      activityId: activityId,
      orderType: orderType,
      groupid: groupid
    })

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

  joinActivity() {
    let url = 'api/activity/order/add'
    let formValidate = this.data.formValidate
    let data = {
      activity_id: this.data.activityId,
      pay_type: this.data.orderType,
      groupid: this.data.groupid,
      nickname: wx.getStorageSync('userInfo').nickName,
      uname: formValidate.uname,
      join_phone: formValidate.phone
    }
    var _this = this
    request(url, 'post', data, function (res) {
      //res就是我们请求接口返回的数据
      let id = res.data.id
      wx.showToast({
        title: '创建订单成功！',
        icon: 'success'
      })

      setTimeout(()=>{
        wx.navigateTo({
          url: `../orderDetail/orderDetail?activityId=${_this.data.activityId}&orderId=${id}`
        })
      }, 3000)
    }, function (res) {
      if(res.data.errNo === 147004) {
        if(res.data.id) {
            setTimeout(() => {
                wx.navigateTo({
                    url: `../orderDetail/orderDetail?activityId=${_this.data.activityId}&orderId=${res.data.id}`
                })
            }, 3000)
        }else{
            wx.showToast({
                title: res.data.errMsg,
                icon: 'none'
            })
        }
      }else{
        wx.showToast({
          title: res.data.errMsg,
          icon: 'none'
        })
      }
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