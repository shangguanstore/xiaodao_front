// shop/shop/shop.js

const app = getApp()
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 1000,

        config: {},
        goodsList: [],
        bannerList: [],
        noGoods: false,
        loadingMoreHidden: true,
        Loaded: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let config = app.config
        this.setData({
            config: config
        })
        app.userOnline.then(res => {
            this.getGoodsList()
            this.getBannerList()
        })
    },

    getGoodsList() {
        let url = 'api/shop/goods/getlist'
        request(url, 'post', {cid: app.config.cid}, res=>{
            var goodsList = res.data.data
            lib.filterResult(goodsList)

            if(goodsList.length == 0) var noGoods = true
            this.setData({
                goodsList: goodsList,
                loadingMoreHidden: true,
                Loaded: true,
                noGoods
            })
        }, res=>{
            wx.showToast({
                title: res.data.errMsg,
                icon: 'none'
            })
        })
    },

    getBannerList() {
        let url = 'api/shop/banner/getlist'
        request(url, 'post', {cid: app.config.cid}, res=>{
            var bannerList = res.data.data
            lib.filterResult(bannerList)

            this.setData({
                bannerList
            })
        }, res=>{
            wx.showToast({
                title: res.data.errMsg,
                icon: 'none'
            })
        })
    },


    //事件处理函数
    swiperchange: function (e) {
        //console.log(e.detail.current)
        this.setData({
            swiperCurrent: e.detail.current
        })
    },
    tapBanner: function (e) {
        if (e.currentTarget.dataset.id != 0) {
            wx.navigateTo({
                url: "/shop/goodsDetail/goodsDetail?id=" + e.currentTarget.dataset.id
            })
        }
    },

    toDetailsTap: function (e) {
        wx.navigateTo({
            url: "/shop/goodsDetail/goodsDetail?id=" + e.currentTarget.dataset.id
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

    }
})