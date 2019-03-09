//index.js
//获取应用实例
const app = getApp()
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')

Page({
  data: {
    userInfo: {},
    Loaded:false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bannerList: [],
    activityList: []
  },

  onLoad: function () {
    let _this = this
    var timer = setInterval(function() {
      var UU7 = wx.getStorageSync('UU7')
      if(UU7) {
        clearInterval(timer)
        _this.getBannerList()
        _this.getActivityList()
      }
    },500)
  },

  routeTo: function(e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url
    })
  },

  getBannerList() {
    let url = 'api/mbanner/getlist'
    let data = {
      pageIndex: 1,
      pageSize: 10
    }
    var _this = this
    request(url, 'get', data, function (res) {
      //res就是我们请求接口返回的数据
      var bannerList = res.data.Data
      bannerList.map(function(item){
        item.imglink_format = lib.getImglink(item.imglink)[0]
        return item
      })

      _this.setData({
         bannerList: bannerList
      })
    }, function () {
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      })
    })
  },

  getActivityList() {
    this.setData({
      Loaded: false
    })
    let url = 'api/activity/getlist'
    let data = {
      pageIndex: 1,
      pageSize: 100,
      queryDetail: false
    }
    var _this = this
    request(url, 'get', data, function (res) {
      //res就是我们请求接口返回的数据
      var activityList = res.data.data
      activityList.map(function (item) {
        item.imglink_format = lib.getImglink(item.imglink)[0]
        return item
      })

      _this.setData({
        activityList: activityList,
        Loaded: true
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

  getUserInfo: function(e) {
    console.log('aaabbbccc',e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  print() {
    console.log(app.globalData.userInfo)
  },

  onShareAppMessage: function () {
    
  }
})
