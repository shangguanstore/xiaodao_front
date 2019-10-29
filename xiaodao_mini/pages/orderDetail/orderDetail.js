// pages/orderDetail/orderDetail.js
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
const common = require('../../utils/common.js')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        config: {},
        formValidate: {},
        activity: {},
        order: {},
        orderIsTimeOut: false,
        minu: 0,
        sec: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        let config = app.config
        let activityId = options.activityId
        let orderId = options.orderId
        let formValidate = {}
        let member = wx.getStorageSync('member')
        formValidate.uname = member.uname
        formValidate.phone = member.phone
        this.setData({
            activityId: activityId,
            config: config,
            orderId: orderId,
            formValidate: formValidate
        })

        this.getActivityData()
        this.getOrderData()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    getActivityData() {
        this.setData({
            Loaded: false
        })
        let _this = this
        let url = 'api/activity/getlist'
        let data = {
            id: this.data.activityId,
            cid: app.config.cid,
            queryDetail: false
        }
        request(url, 'get', data, function (res) {
            //res就是我们请求接口返回的数据
            let activity = res.data.data || []
            activity = lib.filterResult(activity)[0]

            _this.setData({
                activity: activity
            })
        }, function (res) {
            wx.showToast({
                title: res.data.errMsg,
                icon: 'none'
            })
        })
    },

    getOrderData() {
        this.setData({
            Loaded: false
        })
        let _this = this
        let url = 'api/activity/order/getlist'
        let data = {
            id: this.data.orderId
        }
        request(url, 'get', data, function (res) {
            //res就是我们请求接口返回的数据
            let order = res.data.data || []
            order = lib.filterResult(order)[0]

            _this.setData({
                order: order
            })
        }, function (res) {
            wx.showToast({
                title: res.data.errMsg,
                icon: 'none'
            })
        })
    },

    changeTimeRemaining() {
        if (this.data.order.create_time) {
            var nowMilliseconds = new Date().getTime()
            var createTimeMilliseconds = this.data.order.create_time * 1000
            var deadLineTimeMilliseconds = (parseInt(this.data.order.create_time) + 15 * 60) * 1000;
            var timeRemaining = 0
            var minu
            var sec
            if (nowMilliseconds < deadLineTimeMilliseconds) {
                timeRemaining = deadLineTimeMilliseconds - nowMilliseconds
                minu = parseInt(timeRemaining / (60 * 1000) % 60)
                sec = parseInt(timeRemaining / 1000 % 60)

                this.setData({
                    minu: lib.numberLengthFormat(minu),
                    sec: lib.numberLengthFormat(sec)
                })
            } else {//已经结束了
                this.setData({
                    orderIsTimeOut: true
                })
                common.clearPageInterval('timeRemainTimer')
            }
        }
    },

    // handlePay() {
    //   wx.navigateTo({
    //     url: `../paySuccess/paySuccess?type=1&activityId=${this.data.activityId}&orderId=${this.data.orderId}`
    //   })
    // },

    handlePay() {
        if (this.data.order.payment_money > 0) {
            this.requestWeixinPay()
        } else {
            let url = 'api/activity/order/zero/pay'
            let data = {
                order_id: this.data.order.id
            }
            let _this = this

            request(url, 'post', data, function (res) {
                //res就是我们请求接口返回的数据
                wx.navigateTo({
                    url: `../paySuccess/paySuccess?activityId=${_this.data.activityId}&orderId=${_this.data.orderId}`
                })
            }, function (res) {
                console.log('fail-res', res)
                wx.showToast({
                    title: res.data.errMsg,
                    icon: 'none'
                })
            })
        }
    },

    requestWeixinPay() {
        let url = 'api/weixin/pay'
        let data = {
            order_id: this.data.order.id,
            order_sn: this.data.order.sn
        }
        var _this = this
        request(url, 'post', data, function (res) {
            //res就是我们请求接口返回的数据
            console.log('res', res)
            let unifiedorderData = res.data.data.unifiedorderData
            let miniRequestData = res.data.data.miniRequestData

            if (unifiedorderData.result_code == 'SUCCESS') {
                wx.requestPayment({
                    timeStamp: miniRequestData.timeStamp,
                    nonceStr: miniRequestData.nonceStr,
                    package: miniRequestData.package,
                    signType: miniRequestData.signType,
                    paySign: miniRequestData.paySign,
                    success(res) {
                        console.log('pay-res', res)
                        _this.afterFrontPay()

                        wx.navigateTo({
                            url: `../paySuccess/paySuccess?activityId=${_this.data.activityId}&orderId=${_this.data.orderId}`
                        })
                    },
                    fail(res) {
                        console.log('pay-fail', res)
                    }
                })
            } else {
                wx.showToast({
                    title: unifiedorderData.err_code_des,
                    icon: 'none'
                })
            }
        }, function (res) {
            console.log('fail-res', res)
            wx.showToast({
                title: res.errMsg,
                icon: 'none'
            })
        })
    },

    afterFrontPay() {
        let url = 'api/after/front/order/pay'
        let data = {
            activity_order_id: this.data.order.id
        }
        let _this = this

        request(url, 'post', data, function (res) {
            //res就是我们请求接口返回的数据

        }, function (res) {
            console.log('fail-res', res)
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
        let _this = this
        common.clearPageInterval('timeRemainTimer')
        common.setPageInterval('timeRemainTimer', function () {
            _this.changeTimeRemaining()
            console.log(222222222222)
        }, 1000)
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        console.log('哈哈哈哈哈')
        common.clearPageInterval('timeRemainTimer')
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