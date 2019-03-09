// pages/grouponDetail/grouponDetail.js
const lib = require('../../utils/lib/index.js')
const common = require('../../utils/common.js')
const request = require('../../utils/request.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activityId: 0,
    config: {},
    orderType: 203,
    groupid: 0,
    activityData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options',options)
    let config = app.config
    let orderType = options.orderType
    let groupid = options.groupid
    let activityData = JSON.parse(options.activityData)
    let activityId = activityData.id
    this.setData({
      config: config,
      orderType: orderType,
      groupid: groupid,
      activityId: activityId,
      activityData: activityData
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  toApply() {
    common.toApplyActivity(this.data.orderType, this.data.activityData, this.data.groupid)
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