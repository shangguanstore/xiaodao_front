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
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // 示例代码开始
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log('ready')
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }


    var UU7 = wx.getStorageSync('UU7')
    if (UU7) {
      this.getBannerList()
      this.getActivityList()
    } else {
      this.weixinAuth()
    }
  },

  routeTo: function(e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url
    })
  },

  weixinAuth() {
    var _this = this
    wx.login({
      success: function (res) {
        if (res.code) {
          let url = 'api/code2session'
          let data = {
            cid: 100021,
            code: res.code,
          }
          request(url, 'get', data, function (res) {
            //res就是我们请求接口返回的数据
            var UU7 = res.data.UU7
            var member = res.data.member[0]
            wx.setStorageSync('UU7', UU7)
            wx.setStorageSync('mid', member.mid)
            wx.setStorageSync('name', member.uname)
            wx.setStorageSync('phone', member.phone)

            _this.getBannerList()
            _this.getActivityList()
          }, function () {
            wx.showToast({
              title: '加载数据失败',
              icon: 'none'
            })
          })
        }
      }
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
      var activityList = res.data.activity
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
