// pages/activityApply/activityApply.js
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
const common = require('../../utils/common.js')
const app = getApp()
import { UserAuth } from "../../utils/userAuth"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activityId: 0,
    groupid: 0,
    activityData: {},
    formValidate: {},
    username: '',
    phone: '',
    age: '',
    relations: ['母亲','父亲','本人','其他'],
    relationIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('apply-options',options)
    let groupid = options.groupid
    let activityData = JSON.parse(options.activityData)
    let activityId = activityData.id

    this.setData({
      activityId: activityId,
      activityData: activityData,
      groupid: groupid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  changeField(e) {
    let formValidate = this.data.formValidate
    let field = e.currentTarget.dataset.field
    let type = e.currentTarget.dataset.type
    formValidate[field] = e.detail
    this.setData({
      formValidate: formValidate
    })
  },

  bindPickerChange(e) {
    let field = e.currentTarget.dataset.field
    let value = e.detail.value
    if (field == 'relation') {
      this.setData({
        relationIndex: value
      })
    }
  },

  tapApply(e) {
    let _this = this
    let userInfo = e.detail.userInfo
    if (!e.detail.userInfo) {
      return;
    }
    wx.setStorageSync('userInfo', e.detail.userInfo)

    let formValidate = this.data.formValidate
    let phone = formValidate.phone
    let name = formValidate.name
    let relationName = this.data.relations[this.data.relationIndex]
    let father_phone, mother_phone, other_phone
    if (relationName == '母亲') {
      mother_phone = phone
    } else if (relationName == '父亲') {
      father_phone = phone
    } else if (relationName == '本人') {

    } else if (relationName == '其他') {
      other_phone = phone
    }
    let relationType = lib.getRelationType(relationName)
    if (lib.empty(name)) {
      wx.showToast({
        title: '请输入孩子姓名',
        icon: 'none'
      })
      return
    }
    if(!lib.isPhone(phone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return
    }

    let url = 'api/member/update'
    let data = {
      mid: wx.getStorageSync('mid'),
      phone: phone,
      other_phone: other_phone ? other_phone : '',
      mother_phone: mother_phone ? mother_phone : '',
      father_phone: father_phone ? father_phone : '',
      name: name,
      relation: relationType,
      avatar: userInfo.avatarUrl,
      enforce_change_phone: true
    }
    request(url, 'post', data, function (res, addition) {
      //res就是我们请求接口返回的数据
      var member = res.data.member
      var UU7 = res.data.UU7
      wx.setStorageSync('member', member)
      wx.setStorageSync('mid', member.mid)
      wx.setStorageSync('phone', member.phone)
      wx.setStorageSync('name', member.uname)
      wx.setStorageSync('avatar', member.avatar)
      wx.setStorageSync('UU7', UU7)
      //_this.joinActivity(name, phone)

      common.toApplyActivity(_this.data.orderType, _this.data.activityData, _this.data.groupid)
    }, function () {
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      })
    })
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
      let id = res.data.id
      wx.showToast({
        title: '成功报名！',
        icon: 'success'
      })

      var that = _this
      setTimeout(function () {
        wx.navigateTo({
          url: `../paySuccess/paySuccess?type=1&activityId=${that.data.activityId}&orderId=${id}`
        })
      }, 3000)
    }, function (res) {
      wx.showToast({
        title: res.data.errMsg,
        icon: 'none'
      })
    })
  },

  smsAuthCodeSend() {
    let url = 'api/sms/send'
    let data = {
      phone: '15335195967',
      type: 1,
      sendType: 1
    }
    var _this = this
    request(url, 'post', data, function (res) {
      //res就是我们请求接口返回的数据
      console.log('codeRes',res)
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