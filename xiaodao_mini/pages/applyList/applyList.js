// pages/applyList/applyList.js
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityId: 0,
    activityApplyMemberList: [],
    Loaded: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let activityId = options.activityId
    this.setData({
      activityId: activityId
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
    let url = 'api/activity/apply/member/getlist'
    let data = {
      activity_id: this.data.activityId,
      pageIndex: 1,
      pageSize: 1000
    }
    var _this = this
    request(url, 'get', data, function (res) {
      //res就是我们请求接口返回的数据
      let activityApplyMemberList = lib.filterResult(res.data.data)
      let applyTotal = res.data.total

      activityApplyMemberList.map(function(item) {
        item.create_time_format = lib.getMsgTime(item.create_time * 1000)
        return item
      })

      _this.setData({
        Loaded: true,
        activityApplyMemberList: activityApplyMemberList,
      })
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