//index.js
//获取应用实例
const app = getApp()
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')

Page({
  data: {
    config: {},
    userInfo: {},
    Loaded:false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bannerList: [],
    activityList: []
  },

  onLoad: function () {
    let config = app.config
    this.setData({
      config: config
    })

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
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    let config = this.data.config
    let url
    if (type == config.Activity.TYPE_NORMAL || type == config.Activity.TYPE_GROUPON) {
      url = '../activity/activity?id=' + id
    }else if(type == config.Activity.TYPE_LOTTERY) {
      url = '../drawLottery/drawLottery?id=' + id
    }else{
      url = '../activity/activity?id=' + id
    }

    wx.navigateTo({
      url: url
    })
  },

  routeToArticle(e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url
    })
  },

  routeToShop(e) {
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

      console.log('activityList', activityList)
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
