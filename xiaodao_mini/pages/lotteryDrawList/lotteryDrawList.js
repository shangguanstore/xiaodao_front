// pages/lotteryDrawList/lotteryDrawList.js
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_id: 0,
    list: [],
    Loaded: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let activity_id = options.activity_id
    this.setData({
      activity_id: activity_id
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
    let url = 'api/lottery/draw/getlist'
    let data = {
      activity_id: this.data.activity_id,
      pageIndex: 1,
      pageSize: 1000
    }
    var _this = this
    request(url, 'get', data, function (res) {
      //res就是我们请求接口返回的数据
      let list = res.data.data || []
      list = lib.filterResult(list)
      list.map(item => {
        item.des = `${item.uname}抽中${item.lottery_goods_name}`
      })
      _this.setData({
        list
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