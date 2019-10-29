// shop/goodsDetail/goodsDetail.js

import {UserAuth} from "../../utils/userAuth";

const app = getApp()
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
var WxParse = require('../../wxParse/wxParse.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        config: {},

        autoplay: true,
        interval: 3000,
        duration: 1000,
        goodsDetail: {},
        swiperCurrent: 0,
        hasMoreSelect: false,
        selectSize: "选择：",
        selectSizePrice: 0,
        totalScoreToPay: 0,
        shopNum: 0,
        hideShopPopup: true,
        buyNumber: 0,
        buyNumMin: 1,
        buyNumMax: 0,

        propertyChildIds: "",
        propertyChildNames: "",
        canSubmit: false, //  选中规格尺寸时候是否允许加入购物车
        shopCarInfo: {},
        shopType: "addShopCar",//购物类型，加入购物车或立即购买，默认为加入购物车
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
            // 获取购物车数据
            wx.getStorage({
                key: 'shopCarInfo',
                success: res=>{
                    this.setData({
                        shopCarInfo: res.data,
                        shopNum: res.data.shopNum
                    });
                }
            })

            this.reputation(options.id);
            this.getKanjiaInfo(options.id);

            this.getGoodsData(options.id)
        })
    },

    //事件处理函数
    swiperchange: function (e) {
        //console.log(e.detail.current)
        this.setData({
            swiperCurrent: e.detail.current
        })
    },

    getGoodsData(id) {
        let url = 'api/shop/goods/getlist'
        request(url, 'post', {id,cid: app.config.cid}, res=>{
            let goods = lib.filterResult(res.data.data)[0]

            this.setData({
                goodsDetail: goods,
                selectSizePrice: goods.price_format,
                totalScoreToPay: goods.point_format,
                buyNumMax: goods.inventory,
                buyNumber: (goods.inventory > 0) ? 1 : 0
            });
            WxParse.wxParse('article', 'html', goods.detail, this, 5);
        }, function (res) {
            wx.showToast({
                title: res.data.errMsg,
                icon: 'none'
            })
        })
    },

    goShopCar: function () {
        wx.navigateTo({
            url: "/shop/shopCart/shopCart"
        });
    },
    toAddShopCar: function () {
        this.setData({
            shopType: "addShopCar"
        })
        this.bindGuiGeTap();
    },
    tobuy: function () {
        this.setData({
            shopType: "tobuy",
            selectSizePrice: this.data.goodsDetail.price_format
        });
        this.bindGuiGeTap();
    },
    toPingtuan: function () {
        this.setData({
            shopType: "toPingtuan",
            selectSizePrice: this.data.goodsDetail.basicInfo.pingtuanPrice
        });
        this.bindGuiGeTap();
    },
    /**
     * 规格选择弹出框
     */
    bindGuiGeTap: function () {
        this.setData({
            hideShopPopup: false
        })
    },
    /**
     * 规格选择弹出框隐藏
     */
    closePopupTap: function () {
        this.setData({
            hideShopPopup: true
        })
    },
    numJianTap: function () {
        if (this.data.buyNumber > this.data.buyNumMin) {
            var currentNum = this.data.buyNumber;
            currentNum--;
            this.setData({
                buyNumber: currentNum
            })
        }
    },
    numJiaTap: function () {
        if (this.data.buyNumber < this.data.buyNumMax) {
            var currentNum = this.data.buyNumber;
            currentNum++;
            this.setData({
                buyNumber: currentNum
            })
        }
    },

    /**
     * 加入购物车
     */
    addShopCar: function () {
        if (this.data.buyNumber < 1) {
            wx.showModal({
                title: '提示',
                content: '购买数量不能为0！',
                showCancel: false
            })
            return;
        }
        //组建购物车
        var shopCarInfo = this.bulidShopCarInfo();

        this.setData({
            shopCarInfo: shopCarInfo,
            shopNum: shopCarInfo.shopNum
        });

        // 写入本地存储
        wx.setStorage({
            key: 'shopCarInfo',
            data: shopCarInfo
        })
        this.closePopupTap();
        wx.showToast({
            title: '加入购物车成功',
            icon: 'success',
            duration: 2000
        })
        //console.log(shopCarInfo);

        //shopCarInfo = {shopNum:12,shopList:[]}
    },
    /**
     * 立即购买
     */
    buyNow: function (e) {
        var mid = wx.getStorageSync('mid')
        var apigc_uid = wx.getStorageSync('apigc_uid')
        if (mid && apigc_uid) {
            this.doBuyNow(e)
        } else {
            console.log('eeee222',e)
            var _this = this
            var userInfo = e.detail.userInfo
            if (!e.detail.userInfo){
                return;
            }

            var userAuth = new UserAuth(userInfo);
            userAuth.login(function (res) {
                console.log('res',res)
                _this.doBuyNow(e)
            })
        }
    },

    doBuyNow(e) {
        let that = this
        let shoptype = e.currentTarget.dataset.shoptype
        console.log(shoptype)
        if (this.data.goodsDetail.properties && !this.data.canSubmit) {
            if (!this.data.canSubmit) {
                wx.showModal({
                    title: '提示',
                    content: '请选择商品规格！',
                    showCancel: false
                })
            }
            this.bindGuiGeTap();
            wx.showModal({
                title: '提示',
                content: '请先选择规格尺寸哦~',
                showCancel: false
            })
            return;
        }
        if (this.data.buyNumber < 1) {
            wx.showModal({
                title: '提示',
                content: '购买数量不能为0！',
                showCancel: false
            })
            return;
        }
        //组建立即购买信息
        var buyNowInfo = this.buliduBuyNowInfo(shoptype);
        // 写入本地存储
        wx.setStorage({
            key: "buyNowInfo",
            data: buyNowInfo
        })
        this.closePopupTap();
        if (shoptype == 'toPingtuan') {
            wx.request({
                url: app.globalData.subDomain + '/shop/goods/pingtuan/open',
                data: {
                    token: wx.getStorageSync('token'),
                    goodsId: that.data.goodsDetail.basicInfo.id
                },
                success: function (res) {
                    if (res.data.code != 0) {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 2000
                        })
                        return
                    }
                    wx.navigateTo({
                        url: "/mall/to-pay-order/to-pay-order?orderType=buyNow&pingtuanOpenId=" + res.data.data.id
                    })
                }
            })
        } else {
            wx.navigateTo({
                url: "/shop/toPayOrder/toPayOrder?orderType=buyNow"
            })
        }
    },
    /**
     * 组建购物车信息
     */
    bulidShopCarInfo: function () {
        // 加入购物车
        var shopCarMap = {};
        shopCarMap.goodsId = this.data.goodsDetail.id;
        shopCarMap.imglink_format = this.data.goodsDetail.imglink_format;
        shopCarMap.name = this.data.goodsDetail.name;
        shopCarMap.propertyChildIds = this.data.propertyChildIds;
        shopCarMap.label = this.data.propertyChildNames;
        shopCarMap.price_format = this.data.selectSizePrice;
        shopCarMap.point_format = this.data.totalScoreToPay;
        shopCarMap.left = "";
        shopCarMap.active = true;
        shopCarMap.number = this.data.buyNumber;
        shopCarMap.logisticsType = this.data.goodsDetail.logisticsId;
        shopCarMap.logistics = this.data.goodsDetail.logistics;
        shopCarMap.weight = this.data.goodsDetail.weight;

        var shopCarInfo = this.data.shopCarInfo;
        if (!shopCarInfo.shopNum) {
            shopCarInfo.shopNum = 0;
        }
        if (!shopCarInfo.shopList) {
            shopCarInfo.shopList = [];
        }
        var hasSameGoodsIndex = -1;
        for (var i = 0; i < shopCarInfo.shopList.length; i++) {
            var tmpShopCarMap = shopCarInfo.shopList[i];
            if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
                hasSameGoodsIndex = i;
                shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
                break;
            }
        }

        shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNumber;
        if (hasSameGoodsIndex > -1) {
            shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
        } else {
            shopCarInfo.shopList.push(shopCarMap);
        }
        shopCarInfo.kjId = this.data.kjId;
        return shopCarInfo;
    },
    /**
     * 组建立即购买信息
     */
    buliduBuyNowInfo: function (shoptype) {
        var shopCarMap = {};
        shopCarMap.goodsId = this.data.goodsDetail.id;
        shopCarMap.imglink_format = this.data.goodsDetail.imglink_format;
        shopCarMap.name = this.data.goodsDetail.name;
        // shopCarMap.label=this.data.goodsDetail.id; 规格尺寸
        shopCarMap.propertyChildIds = this.data.propertyChildIds;
        shopCarMap.label = this.data.propertyChildNames;
        shopCarMap.price_format = this.data.selectSizePrice;
        if (shoptype == 'toPingtuan') {
            shopCarMap.price_format = this.data.goodsDetail.pingtuanPrice;
        }
        shopCarMap.point_format = this.data.totalScoreToPay;
        shopCarMap.left = "";
        shopCarMap.active = true;
        shopCarMap.number = this.data.buyNumber;
        shopCarMap.logisticsType = this.data.goodsDetail.logisticsId;
        shopCarMap.logistics = this.data.goodsDetail.logistics;
        shopCarMap.weight = this.data.goodsDetail.weight;

        var buyNowInfo = {};
        if (!buyNowInfo.shopNum) {
            buyNowInfo.shopNum = 0;
        }
        if (!buyNowInfo.shopList) {
            buyNowInfo.shopList = [];
        }
        /*    var hasSameGoodsIndex = -1;
            for (var i = 0; i < toBuyInfo.shopList.length; i++) {
              var tmpShopCarMap = toBuyInfo.shopList[i];
              if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
                hasSameGoodsIndex = i;
                shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
                break;
              }
            }
            toBuyInfo.shopNum = toBuyInfo.shopNum + this.data.buyNumber;
            if (hasSameGoodsIndex > -1) {
              toBuyInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
            } else {
              toBuyInfo.shopList.push(shopCarMap);
            }*/

        buyNowInfo.shopList.push(shopCarMap);
        buyNowInfo.kjId = this.data.kjId;
        return buyNowInfo;
    },
    onShareAppMessage: function () {
        return {
            title: this.data.goodsDetail.basicInfo.name,
            path: '/mall/goods-details/goods-details?id=' + this.data.goodsDetail.basicInfo.id + '&inviter_id=' + wx.getStorageSync('uid'),
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
    reputation: function (goodsId) {
        var that = this;
        wx.request({
            url: app.globalData.subDomain + '/shop/goods/reputation',
            data: {
                goodsId: goodsId
            },
            success: function (res) {
                if (res.data.code == 0) {
                    //console.log(res.data.data);
                    that.setData({
                        reputation: res.data.data
                    });
                }
            }
        })
    },
    pingtuanList: function (goodsId) {
        var that = this;
        wx.request({
            url: app.globalData.subDomain + '/shop/goods/pingtuan/list',
            data: {
                goodsId: goodsId
            },
            success: function (res) {
                if (res.data.code == 0) {
                    that.setData({
                        pingtuanList: res.data.data
                    });
                }
            }
        })
    },
    getVideoSrc: function (videoId) {
        var that = this;
        wx.request({
            url: app.globalData.subDomain + '/media/video/detail',
            data: {
                videoId: videoId
            },
            success: function (res) {
                if (res.data.code == 0) {
                    that.setData({
                        videoMp4Src: res.data.data.fdMp4
                    });
                }
            }
        })
    },
    getKanjiaInfo: function (gid) {
        var that = this;
        if (!app.globalData.kanjiaList || app.globalData.kanjiaList.length == 0) {
            that.setData({
                curGoodsKanjia: null
            });
            return;
        }
        let curGoodsKanjia = app.globalData.kanjiaList.find(ele => {
            return ele.goodsId == gid
        });
        if (curGoodsKanjia) {
            that.setData({
                curGoodsKanjia: curGoodsKanjia
            });
        } else {
            that.setData({
                curGoodsKanjia: null
            });
        }
    },
    goKanjia: function () {
        var that = this;
        if (!that.data.curGoodsKanjia) {
            return;
        }
        wx.request({
            url: app.globalData.subDomain + '/shop/goods/kanjia/join',
            data: {
                kjid: that.data.curGoodsKanjia.id,
                token: wx.getStorageSync('token')
            },
            success: function (res) {
                if (res.data.code == 0) {
                    console.log(res.data);
                    wx.navigateTo({
                        url: "/mall/kanjia/kanjia?kjId=" + res.data.data.kjId + "&joiner=" + res.data.data.uid + "&id=" + res.data.data.goodsId
                    })
                } else {
                    wx.showModal({
                        title: '错误',
                        content: res.data.msg,
                        showCancel: false
                    })
                }
            }
        })
    },
    joinPingtuan: function (e) {
        console.log(e)
        let pingtuanopenid = e.currentTarget.dataset.pingtuanopenid
        wx.navigateTo({
            url: "/mall/to-pay-order/to-pay-order?orderType=buyNow&pingtuanOpenId=" + pingtuanopenid
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