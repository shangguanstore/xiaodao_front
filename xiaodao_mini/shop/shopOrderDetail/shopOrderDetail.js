// shop/shopOrderDetail/shopOrderDetail.js
const app = getApp()
const config = app.config
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        config: {},
        goodsList: [],
        order: {},
        orderId: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            orderId: options.id,
            config
        })

        app.userOnline.then(res => {
            this.getOrder()
        })
    },

    getOrder() {
        wx.showLoading()
        let url = 'api/shop/order/getlist'
        let submitData = {
            id: this.data.orderId,
            getOrderGoods: true
        }
        request(url, 'post', submitData, res => {
            wx.hideLoading()
            let order = lib.filterResult(res.data.data)[0]
            let orderGoods = lib.filterResult(order.orderGoods)

            console.log('order',order)
            console.log('orderGoods',orderGoods)

            this.setData({
                goodsList: orderGoods,
                order
            })
        }, res => {
            wx.hideLoading();
            wx.showToast({
                title: res.data.errMsg,
                icon: 'none'
            })
        })
    },

    copyText: function (e) {
        console.log(e)
        wx.setClipboardData({
            data: e.currentTarget.dataset.text,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
                        wx.showToast({
                            title: '复制成功',
                            icon: 'none'
                        })
                    }
                })
            }
        })
    },

    handlePay() {
        let url = 'api/shop/pay'
        let data = {
            order_id: this.data.order.id,
        }
        var _this = this
        request(url, 'post', data, function (res) {
            if(res.data.data) {
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
                            wx.showToast({
                                title: '支付成功！',
                                icon: 'success'
                            })
                            wx.redirectTo({
                                url: `/shop/shopOrderList/shopOrderList?currentType=${config.ShopOrder.ORDER_STATUS_PAID}`
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
            }else{
                wx.showToast({
                    title: '兑换成功！',
                    icon: 'success'
                })
                wx.redirectTo({
                    url: `/shop/shopOrderList/shopOrderList?currentType=${config.ShopOrder.ORDER_STATUS_PAID}`
                })
            }
        }, function (res) {
            wx.showToast({
                title: res.data.errMsg,
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

    }
})