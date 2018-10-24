// pages/activity/activity.js
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activityId: 0,
    Loaded: false,
    imglink: '',
    title: '',
    produce_mid: 0,
    hasUserInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.from_mid) {
      this.setData({
        produce_mid: options.from_mid
      })
    }
    this.setData({
      activityId: options.id
    })

    var UU7 = wx.getStorageSync('UU7')
    if (UU7) {
      this.getData()
    } else {
      this.weixinAuth()
    }

    var hasUserInfo = true
    var phone = wx.getStorageSync('phone')
    if (!phone) hasUserInfo = false
    this.setData({
      hasUserInfo: hasUserInfo
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

            _this.getData()
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

  formSubmit: function (e) {
    var userSubmitInfo = e.detail.value

    // 提交后，设置定时任务监测授权完成
    if (this.data.hasUserInfo) {
      var name = wx.getStorageSync('name')
      this.joinActivity(name, userSubmitInfo.phone)
    } else {
      var _this = this
      var timerid = setInterval(function () {
        wx.getSetting({
          success: res => {
            console.log('res.authSetting', res.authSetting)
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              clearInterval(timerid)
              wx.getUserInfo({
                success: res => {
                  console.log('res', res)
                  var userInfo = res.userInfo

                  let url = 'api/member/update'
                  let data = {
                    mid: wx.getStorageSync('mid'),
                    phone: userSubmitInfo.phone,
                    // phone: '15335195967',
                    name: userInfo.nickName,
                    sex: userInfo.gender,
                    imgurl: userInfo.avatarUrl,
                    enforce_change_phone: true,
                    addition: {
                      nickname: userInfo.nickName,
                      join_phone: userSubmitInfo.phone
                    }
                  }
                  request(url, 'post', data, function (res, addition) {
                    //res就是我们请求接口返回的数据
                    console.log('update', res)
                    var member = res.data.member
                    var UU7 = res.data.UU7
                    wx.setStorageSync('mid', member.mid)
                    wx.setStorageSync('phone', member.phone)
                    wx.setStorageSync('name', member.uname)
                    wx.setStorageSync('avatar', member.avatar)
                    wx.setStorageSync('UU7', UU7)

                    _this.joinActivity(addition.nickname, addition.join_phone)
                  }, function () {
                    wx.showToast({
                      title: '操作失败',
                      icon: 'none'
                    })
                  })

                }
              })
            }
          }
        })
      }, 500)
    }

  },

  joinActivity(nickname, join_phone) {
    let url = 'api/activity/order/add'
    let data = {
      activity_id: this.data.activityId,
      nickname: nickname,
      join_phone: join_phone
      // join_phone: '15335195967'
    }
    var _this = this
    request(url, 'post', data, function (res) {
      //res就是我们请求接口返回的数据
      wx.showToast({
        title: '成功报名！',
        icon: 'success'
      })
      setTimeout(function () {
        wx.reLaunch({
          url: '../myJoin/myJoin'
        })
      }, 3000)
    }, function (res) {
      wx.showToast({
        title: res.data.errMsg,
        icon: 'none'
      })
    })
  },

  addShareRecord() {
    let url = 'api/share/add'
    let data = {
      content_id: this.data.activityId,
      produce_mid: this.data.produce_mid,
      receive_mid: wx.getStorageSync('mid'),
      type: app.config.Share.TYPE_ACTIVITY
    }
    var _this = this
    request(url, 'post', data, function (res) {
      //res就是我们请求接口返回的数据
      console.log(res)
    }, function (res) {
      console.log('err',res)
    })
  },

  getData() {
    this.setData({
      Loaded: false
    })
    let url = 'api/activity/getlist'
    let data = {
      id: this.data.activityId,
      queryDetail: true,
    }
    var _this = this
    request(url, 'get', data, function (res) {
      //res就是我们请求接口返回的数据
      var activity = res.data.activity
      var imglink = lib.getImglink(activity.imglink)[0]
      var title = activity.name
      _this.setData({
        imglink: imglink,
        title: title
      })

      var activityDetail = res.data.activity.activity_detail || []
      var html = activityDetail[0].detail
      WxParse.wxParse('article', 'html', html, _this, 5);

      _this.setData({
        Loaded: true
      })

      if(_this.data.produce_mid) {
        _this.addShareRecord()
      }
    }, function () {
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    var shareInfo = {
      title: this.data.title,
      path: lib.sprintf('pages/activity/activity?id=%s&from_mid=%s', this.data.activityId, wx.getStorageSync('mid')),
      imageUrl: this.data.imglink
    }

    console.log(shareInfo)
    return shareInfo
  }
})