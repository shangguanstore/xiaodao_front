// pages/drawLottery/drawLottery.js
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
    activity_id: 0,
    title: '',
    activity: {},
    lotteryGoods: [],
    lotteryGoodsDisplay: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options)
    let config = app.config
    let activity_id = options.id
    this.setData({
      activity_id: activity_id,
      config: config
    })

    this.getActivity()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getActivity() {
    // this.setData({
    //   Loaded: false
    // })
    let _this = this
    let url = 'api/activity/getlist'
    let data = {
      id: this.data.activity_id,
      queryDetail: true,
    }
    request(url, 'get', data, function (res) {
      //res就是我们请求接口返回的数据
      var activity = res.data.data
      console.log('activity', activity)
      activity = lib.filterResult(activity)[0]
      // var imglink = activity.imglink_format[0]
      var title = activity.name

      _this.setData({
        // imglink: imglink,
        title: title,
        activity: activity
      })

      console.log('activity', activity)

      _this.getLotteryGoods()

      var html = activity.detail
      console.log('html',html)
      WxParse.wxParse('article', 'html', html, _this, 25);

      // _this.setData({
      //   Loaded: true
      // })

      // if (_this.data.produce_mid) {
      //   _this.addShareRecord()
      // }

      // _this.getActivityApplyMemberList()
    }, function () {
      wx.showToast({
        title: '加载数据失败',
        icon: 'none'
      })
    })
  },

  getLotteryGoods() {
    let _this = this
    let url = 'api/lottery/goods/getlist'
    let data = {
      activity_id: this.data.activity_id
    }
    request(url, 'get', data, function (res) {
      //res就是我们请求接口返回的数据
      let lotteryGoods = res.data.data
      let lotteryGoodsDisplay = lotteryGoods

      lotteryGoodsDisplay.map(function(item) {
        if (item.type == _this.data.config.LotteryGoods.TYPE_PHYSICAL) {
          item.img = _this.data.config.Qiniu.STATIC_EXTERNAL_LINK + 'draw-physical.png'
          item.long = false
        } else if (item.type == _this.data.config.LotteryGoods.TYPE_COUPON) {
          item.img = _this.data.config.Qiniu.STATIC_EXTERNAL_LINK + 'draw-coupon.png'
          item.long = true
        } else if (item.type == _this.data.config.LotteryGoods.TYPE_EXPERIENCE) {
          item.img = _this.data.config.Qiniu.STATIC_EXTERNAL_LINK + 'draw-voucher.png'
          item.long = true
        } else {
          item.img = ''
        }
      })

      if (lotteryGoodsDisplay.length < 8) {
        let newDisplay = []
        let len = lotteryGoodsDisplay.length
        for(var i = 0; i < 8; i++) {
          var index = i % len
          newDisplay.push(lotteryGoodsDisplay[index])
        }

        console.log('newDisplay',newDisplay)
      }

      console.log('lotteryGoodsDisplay', lotteryGoodsDisplay)

      _this.setData({
        lotteryGoods: lotteryGoods,
        lotteryGoodsDisplay: lotteryGoodsDisplay
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