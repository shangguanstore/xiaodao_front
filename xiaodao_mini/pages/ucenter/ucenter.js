// pages/ucenter/ucenter.js
import {UserAuth} from "../../utils/userAuth";
const lib = require('../../utils/lib/index.js')
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hasUserInfo: false,
        phone: '',
        name: '',
        avatar: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.checkApiGcLogin()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    checkApiGcLogin: function () {
        let token = wx.getStorageSync('token')
        let userInfo = wx.getStorageSync('userInfo')
        if (!lib.empty(userInfo) && !lib.empty(token)) {
            var userAuth = new UserAuth(userInfo);
            userAuth.login(function (res) {
                console.log('res-我成功啦！', res)
            })
        }
    },

    toLogin() {
        let url = `../login/login?from=${app.config.FrontLoginFrom.FROM_LOGIN}`
        wx.navigateTo({
            url: url
        })
    },

    initUserInfo() {
        var hasUserInfo = true
        var phone = wx.getStorageSync('phone')
        var name = wx.getStorageSync('uname')
        var avatar = wx.getStorageSync('avatar')

        if (!phone) hasUserInfo = false
        this.setData({
            phone: phone,
            hasUserInfo: hasUserInfo,
            name: name,
            avatar: avatar
        })
    },

    routeTo(event) {
        let url = event.currentTarget.dataset.url
        console.log(url)
        if (url.indexOf('activityList/activityList') != -1 || url.indexOf('index/index') != -1 || url.indexOf('ucenter/ucenter') != -1) {
            wx.switchTab({
                url: url
            })
        } else {
            wx.navigateTo({
                url: url
            })
        }
    },

    toPromote() {
        if (this.data.hasUserInfo) {
            // wx.navigateTo({
            //     url: '../promote/promote'
            // })
            wx.navigateTo({
                url: '../getPointIntro/getPointIntro'
            })
        } else {
            this.toLogin()
            // wx.showToast({
            //   title: '还没登录/注册呢',
            //   icon: 'none'
            // })
        }
    },

    toMyInfo() {
        if (this.data.hasUserInfo) {
            wx.navigateTo({
                url: '../myInfo/myInfo'
            })
        } else {
            this.toLogin()
            // wx.showToast({
            //   title: '还没登录/注册呢',
            //   icon: 'none'
            // })
        }
    },

    toMyPoint() {
        if (this.data.hasUserInfo) {
            wx.navigateTo({
                url: '../myPoint/myPoint'
            })
        } else {
            this.toLogin()
            // wx.showToast({
            //   title: '还没登录/注册呢',
            //   icon: 'none'
            // })
        }
    },

    toMyJoin() {
        if (this.data.hasUserInfo) {
            wx.navigateTo({
                url: '../myJoin/myJoin'
            })
        } else {
            this.toLogin()
            // wx.showToast({
            //   title: '还没登录/注册呢',
            //   icon: 'none'
            // })
        }
    },

    toLotteryList() {
        if (this.data.hasUserInfo) {
            wx.navigateTo({
                url: '../lotteryList/lotteryList'
            })
        } else {
            this.toLogin()
            // wx.showToast({
            //   title: '还没登录/注册呢',
            //   icon: 'none'
            // })
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.initUserInfo()
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