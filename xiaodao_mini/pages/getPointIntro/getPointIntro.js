// pages/getPointIntro/getPointIntro.js
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Loaded: false,
    pointList: [],
    curPoint: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPointList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getPointList() {
    this.setData({
      Loaded: false
    })
    let url = 'api/point/detail/getbymid'
    let data = {
      mid: wx.getStorageSync('mid')
    }
    var _this = this
    request(url, 'get', data, function (res) {
      //res就是我们请求接口返回的数据
      var pointList = res.data.data
      var curPoint = !lib.empty(pointList[0]) ? pointList[0].cur_point_num : 0
      pointList = pointList.map(function (item) {
        item.create_time_format = lib.date('Y-m-d', item.create_time)
        return item
      })

      _this.setData({
        curPoint: curPoint,
        pointList: pointList,
        Loaded: true
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