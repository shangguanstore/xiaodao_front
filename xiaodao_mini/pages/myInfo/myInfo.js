// pages/myInfo/myInfo.js
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    name: '',
    sex: '',
    create_time_format: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var phone = wx.getStorageSync('phone')
    var name = wx.getStorageSync('name')

    this.setData({
      phone: phone,
      name: name
    })

    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getData() {
    let url = 'api/member/getlist'
    let data = {
      mid: wx.getStorageSync('mid'),
    }
    var _this = this
    request(url, 'get', data, function (res) {
      //res就是我们请求接口返回的数据
      console.log('res',res)
      var data = res.data.member[0]
      var  sex = data.sex == 1 ? '男' : '女'
      var create_time_format = lib.date('Y年m月d日',data.create_time)
      _this.setData({
        sex: sex,
        create_time_format: create_time_format
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