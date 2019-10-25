// shop/shopOrderList/shopOrderList.js
const wxpay = require('../../mall-utils/pay.js')
const app = getApp()
const config = app.config
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')

Page({
    data: {
        config: {},
        statusType: [
            {
                label: '未付款',
                value: config.ShopOrder.ORDER_STATUS_WAIT_PAY
            },
            {
                label: '待领取',
                value: config.ShopOrder.ORDER_STATUS_PAID
            },
            {
                label: '已完成',
                value: config.ShopOrder.ORDER_STATUS_FINISH
            },
        ],
        currentType: 0,
        tabClass: ["", "", ""],
        orderList: [],
    },
    statusTap: function (e) {
        var curType = e.currentTarget.dataset.status;
        this.data.currentType = curType
        this.setData({
            currentType: curType
        });
        this.onShow();
    },
    orderDetail: function (e) {
        var orderId = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/shop/shopOrderDetail/shopOrderDetail?id=" + orderId
        })
    },
    cancelOrderTap: function (e) {
        var that = this;
        var orderId = e.currentTarget.dataset.id;
        wx.showModal({
            title: '确定要取消该订单吗？',
            content: '',
            success: res => {
                if (res.confirm) {
                    wx.showLoading();
                    let url = 'api/shop/order/cancel'
                    let submitData = {
                        id: orderId
                    }
                    request(url, 'post', submitData, res => {
                        wx.hideLoading()
                        this.onShow()
                    }, res => {
                        wx.hideLoading();
                        wx.showToast({
                            title: '加载数据失败',
                            icon: 'none'
                        })
                    })
                }
            }
        })
    },
    toPayTap: function (e) {
        var that = this;
        var orderId = e.currentTarget.dataset.id;
        var money = e.currentTarget.dataset.money;
        var needScore = e.currentTarget.dataset.score;
        wx.request({
            url: app.globalData.subDomain + '/user/amount',
            data: {
                token: wx.getStorageSync('token')
            },
            success: function (res) {
                if (res.data.code == 0) {
                    // res.data.data.balance
                    money = money - res.data.data.balance;
                    if (res.data.data.score < needScore) {
                        wx.showModal({
                            title: '错误',
                            content: '您的积分不足，无法支付',
                            showCancel: false
                        })
                        return;
                    }
                    if (money <= 0) {
                        // 直接使用余额支付
                        wx.request({
                            url: app.globalData.subDomain + '/order/pay',
                            method: 'POST',
                            header: {
                                'content-type': 'application/x-www-form-urlencoded'
                            },
                            data: {
                                token: wx.getStorageSync('token'),
                                orderId: orderId
                            },
                            success: function (res2) {
                                that.onShow();
                            }
                        })
                    } else {
                        wxpay.wxpay(app, money, orderId, "/mall/order-list/order-list");
                    }
                } else {
                    wx.showModal({
                        title: '错误',
                        content: '无法获取用户资金信息',
                        showCancel: false
                    })
                }
            }
        })
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        if(lib.isset(options.currentType)) {
            this.setData({
                currentType: options.currentType
            })
        }

        // if(options.timeoutCheck){
        //     setTimeout(()=>{
        //         this.onShow()
        //     },1500)
        // }

        this.setData({
            config: config
        })
    },
    onReady: function () {
        // 生命周期函数--监听页面初次渲染完成

    },
    getOrderStatistics: function () {
        let url = `api/shop/order/statistics`
        let submitData = {}
        request(url, 'post', submitData, res => {
            let statusNum = res.data.data
            var tabClass = this.data.tabClass;
            if (statusNum[config.ShopOrder.ORDER_STATUS_WAIT_PAY] > 0) {
                tabClass[0] = "red-dot"
            } else {
                tabClass[0] = ""
            }
            if (statusNum[config.ShopOrder.ORDER_STATUS_PAID] >  0) {
                tabClass[1] = "red-dot"
            } else {
                tabClass[1] = ""
            }
            if (statusNum[config.ShopOrder.ORDER_STATUS_FINISH] >  0) {
                tabClass[2] = "red-dot"
            } else {
                tabClass[2] = ""
            }
            this.setData({
                tabClass: tabClass,
            });
        }, res => {
            wx.hideLoading();
            wx.showToast({
                title: '加载数据失败',
                icon: 'none'
            })
        })
    },
    onShow: function () {
        // 获取订单列表
        this.getOrderStatistics();
        wx.showLoading();
        let url = 'api/shop/order/getlist'
        let submitData = {
            order_status: [this.data.currentType],
            getOrderGoods: true,
        }
        request(url, 'post', submitData, res => {
            wx.hideLoading()
            let orderList = lib.filterResult(res.data.data)
            orderList.map(item => {
                item.order_status_format = lib.getShopOrderStatusName(item.order_status);
                item.orderGoods = lib.filterResult(item.orderGoods)
            })

            this.setData({
                orderList,
            })
            console.log('this.data.orderList',this.data.orderList)
        }, res => {
            wx.hideLoading();
            wx.showToast({
                title: '加载数据失败',
                icon: 'none'
            })
        })
    },
    onHide: function () {
        // 生命周期函数--监听页面隐藏

    },
    onUnload: function () {
        // 生命周期函数--监听页面卸载

    },
    onPullDownRefresh: function () {
        // 页面相关事件处理函数--监听用户下拉动作

    },
    onReachBottom: function () {
        // 页面上拉触底事件的处理函数

    }
})