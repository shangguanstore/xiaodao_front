// pages/activityList/activityList.js
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        Loaded: false,
        config: {},
        activityList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let config = app.config
        this.setData({
            config: config
        })

        this.getData()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    getData() {
        this.getActivityList()
    },

    getActivityList() {
        this.setData({
            Loaded: false
        })
        let url = 'api/activity/getlist'
        let data = {
            pageIndex: 1,
            cid: app.config.cid,
            pageSize: 100,
            type: `${this.data.config.Activity.TYPE_NORMAL},${this.data.config.Activity.TYPE_LOTTERY}`,
            publish: this.data.config.Activity.PUBLISH_ON,
            queryDetail: false
        }
        var _this = this
        request(url, 'get', data, function (res) {
            //res就是我们请求接口返回的数据
            var activityList = res.data.data
            activityList.map(item=>{
                item.imglink_format = lib.getImglink(item.imglink)[0]
                if(item.type == _this.data.config.Activity.TYPE_GROUPON) {
                    item.btnText = '参与拼团'
                }else if(item.type == _this.data.config.Activity.TYPE_LOTTERY){
                    item.btnText = '立即抽奖'
                }else if(item.type == _this.data.config.Activity.TYPE_COURSE && item.course_experience) {
                    item.btnText = '立即体验'
                }

                return item
            })

            _this.setData({
                activityList: activityList,
                Loaded: true
            })
        }, function (res) {
            wx.showToast({
                title: res.data.errMsg,
                icon: 'none'
            })
        })
    },

    routeTo: function (e) {
        let id = e.currentTarget.dataset.id
        let type = e.currentTarget.dataset.type
        let config = this.data.config
        let url
        if (type == config.Activity.TYPE_NORMAL || type == config.Activity.TYPE_GROUPON) {
            url = '../activity/activity?id=' + id
        } else if (type == config.Activity.TYPE_LOTTERY) {
            url = '../drawLottery/drawLottery?id=' + id
        } else {
            url = '../activity/activity?id=' + id
        }

        wx.navigateTo({
            url: url
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
      this.getData()
      wx.stopPullDownRefresh()
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