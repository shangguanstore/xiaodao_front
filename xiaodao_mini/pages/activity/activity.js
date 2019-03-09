// pages/activity/activity.js
const lib = require('../../utils/lib/index.js')
const common = require('../../utils/common.js')
const request = require('../../utils/request.js')
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    config: {},
    activityId: 0,
    activityApplyMemberList: [],
    applyTotal: 0,
    Loaded: false,
    imglink: '',
    title: '',
    activity: {},
    produce_mid: 0,
    hasUserInfo: false,
    typeGroupon: false,
    typeNormal: false,
    groupList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let config = app.config
    let _this = this
    var timer = setInterval(function () {
      var UU7 = wx.getStorageSync('UU7')
      if (UU7) {
        clearInterval(timer)
        _this.getData()
        var hasUserInfo = true
        var phone = wx.getStorageSync('phone')
        if (!phone) hasUserInfo = false
        _this.setData({
          hasUserInfo: hasUserInfo
        })
      }
    }, 500)

    if (options.from_mid) {
      this.setData({
        produce_mid: options.from_mid
      })
    }
    this.setData({
      activityId: options.id,
      config: config
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  goHome() {
    wx.switchTab({
      url: '../index/index'
    })
  },

  goApplyList() {
    wx.navigateTo({
      url: `../applyList/applyList?activityId=${this.data.activityId}`,
    })
  },

  toApply(e) {
    let orderType = e.currentTarget.dataset.orderType
    let groupid = e.currentTarget.dataset.groupid
    common.toApplyActivity(orderType, this.data.activity, groupid)
  },

  goToGroupDetail(e) {
    let orderType = e.currentTarget.dataset.orderType
    let groupid = e.currentTarget.dataset.groupid ? e.currentTarget.dataset.groupid : 0
    wx.navigateTo({
      url: `../grouponDetail/grouponDetail?activityData=${JSON.stringify(this.data.activity)}&orderType=${orderType}&groupid=${groupid}`,
    })
  },

  onClose() {
    this.setData({ show: false });
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
        wx.navigateTo({
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
    let _this = this
    let url = 'api/activity/getlist'
    let data = {
      id: this.data.activityId,
      queryDetail: true,
    }
    request(url, 'get', data, function (res) {
      //res就是我们请求接口返回的数据
      var activity = res.data.data
      console.log('activity', activity)
      activity = lib.filterResult(activity)[0]
      var imglink = activity.imglink_format[0]
      var title = activity.name
      var typeGroupon = activity.type == app.config.Activity.TYPE_GROUPON ? true : false
      var typeNormal = activity.type == app.config.Activity.TYPE_NORMAL ? true : false

      if (typeGroupon) _this.getGroupList()

      _this.setData({
        imglink: imglink,
        title: title,
        activity: activity,
        typeNormal: typeNormal,
        typeGroupon: typeGroupon
      })

      var html = activity.detail
      WxParse.wxParse('article', 'html', html, _this, 5);

      _this.setData({
        Loaded: true
      })

      if(_this.data.produce_mid) {
        _this.addShareRecord()
      }

      _this.getActivityApplyMemberList()
    }, function () {
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      })
    })
  },

  getGroupList() {
    let _this = this
    let url = 'api/activity/group/getlist'
    let data = {
      activity_id: this.data.activityId,
      getCaptain: true
    }
    request(url, 'get', data, function (res) {
      //res就是我们请求接口返回的数据
      let groupList = res.data.data
      _this.setData({
        groupList: groupList
      })
    }, function () {
      // console.log('error',error)
      wx.showToast({
        title: '加载数据失败111',
        icon: 'none'
      })
    })
  },

  routeTo(e) {
    console.log('e',e)
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url
    })
  },

  getActivityApplyMemberList() {
    this.setData({
      Loaded: false
    })
    let url = 'api/activity/apply/member/getlist'
    let data = {
      activity_id: this.data.activityId,
      pageIndex: 1,
      pageSize: 7
    }
    var _this = this
    request(url, 'get', data, function (res) {
      //res就是我们请求接口返回的数据
      let activityApplyMemberList = lib.filterResult(res.data.data)
      let applyTotal = res.data.total
      console.log('activityApplyMemberList', activityApplyMemberList)

      _this.setData({
        Loaded: true,
        activityApplyMemberList: activityApplyMemberList,
        applyTotal: applyTotal
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
    var shareInfo = {
      title: this.data.title,
      path: lib.sprintf('pages/activity/activity?id=%s&from_mid=%s', this.data.activityId, wx.getStorageSync('mid')),
      imageUrl: this.data.imglink
    }

    console.log(shareInfo)
    return shareInfo
  }
})