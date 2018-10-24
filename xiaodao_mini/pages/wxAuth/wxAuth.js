// pages/wxAuth/wxAuth.js
const app = getApp()
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  formSubmit: function (e) {
    var userSubmitInfo = e.detail.value

    // 提交后，设置定时任务监测授权完成
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
                  enforce_change_phone: true
                }
                request(url, 'post', data, function (res) {
                  //res就是我们请求接口返回的数据
                  console.log('update',res)
                  var member = res.data.member
                  var UU7 = res.data.UU7
                  wx.setStorageSync('mid', member.mid)
                  wx.setStorageSync('phone', member.phone)
                  wx.setStorageSync('name', member.uname)
                  wx.setStorageSync('avatar', member.avatar)
                  wx.setStorageSync('UU7', UU7)

                  wx.showToast({
                    title: '操作成功',
                    icon: 'success'
                  })

                  setTimeout(function(){
                    wx.reLaunch({
                      url: '../ucenter/ucenter'
                    })
                  },1500)
                }, function (res) {
                  wx.showToast({
                    title: res.data.errMsg,
                    icon: 'none'
                  })
                })

              }
            })
          }
        }
      })
    }, 500)
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