// pages/article/article.js
const lib = require('../../utils/lib/index.js')
const app = getApp()
const request = require('../../utils/request.js')
var WxParse = require('../../wxParse/wxParse.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        articleId: 0,
        Loaded: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            articleId: options.id
        })
        this.getData()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    getData() {
        let url = 'api/article/getlist'
        let submitData = {
            cid: app.config.cid,
            id: this.data.articleId
        }
        request(url, 'post', submitData, res => {
            var article = res.data.data
            // lib.filterResult(article)
            this.setData({
                Loaded: true
            })
            let detail = article[0].detail
            WxParse.wxParse('article', 'html', detail, this, 5);
        }, function (res) {
            wx.showToast({
                title: res.data.errMsg,
                icon: 'none'
            })
        })

        // var _this = this
        // wx.request({
        //     url: app.globalData.subDomain + '/cms/news/detail',
        //     data: {
        //         token: wx.getStorageSync('token'),
        //         // id: this.data.articleId
        //         id: 9862
        //     },
        //     success: function (res) {
        //         var articleDetail = res.data.data.content
        //         WxParse.wxParse('article', 'html', articleDetail, _this, 5);
        //     }
        // })
    },

    reload: function () {
        wx.reLaunch({
            url: '../article/article'
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