// pages/drawLottery/drawLottery.js
import {UserAuth} from "../../utils/userAuth";

const lib = require('../../utils/lib/index.js')
const common = require('../../utils/common.js')
const request = require('../../utils/request.js')
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        config: {},
        showAuthBox: false,
        activity_id: 0,
        title: '',
        activity: {},
        lotteryDrawList: [],
        lotteryGoods: [],
        lotteryGoodsDisplay: [],
        remain: 0,
        imglink: '',
        from_mid: 0,


        showRuleBox: false,
        showNoChanceBox: false,
        showGetBox: false, //已抽中某个奖品
        showPickedBox: false, //已领取

        showGetLotteryDes: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('options', options)
        let config = app.config
        let activity_id = options.id
        this.setData({
            activity_id: activity_id,
            config: config
        })
        if (options.from_mid) {
            this.setData({
                from_mid: options.from_mid
            })
        }

        var timer = setInterval(()=>{
            var UU7 = wx.getStorageSync('UU7')
            var uname = wx.getStorageSync('uname')
            if (UU7) {
                clearInterval(timer)
                this.getActivity()
                this.getLotteryDrawList()
                if(!uname) {
                    this.setData({
                        showAuthBox: true
                    })
                }
            }
        }, 500)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    toAuth: function(e) {
        var _this = this
        var userInfo = e.detail.userInfo
        if (!e.detail.userInfo) {
            return;
        }
        this.setData({
            showAuthBox: false
        })

        var userAuth = new UserAuth(userInfo, null, false);
        userAuth.login(function(res) {
            console.log('res',res)
        })
    },

    addShareRecord() {
        let url = 'api/share/add'
        let data = {
            content_id: this.data.activity_id,
            produce_mid: this.data.from_mid,
            receive_mid: wx.getStorageSync('mid'),
            type: app.config.Share.TYPE_LOTTERY
        }
        var _this = this
        request(url, 'post', data, function (res) {
            //res就是我们请求接口返回的数据
            console.log(res)
        }, function (res) {
            console.log('err',res)
        })
    },

    viewMore() {
        let url = `../lotteryDrawList/lotteryDrawList?activity_id=${this.data.activity_id}`
        wx.navigateTo({
            url: url
        })
    },

    toPick() {
        if (wx.getStorageSync('phone')) {
            this.closeNoticeBox()
            this.setData({
                showPickedBox: true
            })
        } else {
            let url = `../login/login?from=${this.data.config.FrontLoginFrom.FROM_LOTTERY_DRAW}`
            wx.navigateTo({
                url: url
            })
        }
    },

    toCall() {
        wx.makePhoneCall({
            phoneNumber: '0215896789'
        })
    },

    haveGet(e) {
        let lottery = e.detail
        console.log('lottery', lottery)
        let showGetLotteryDes = ''
        let unit
        //
        if (lottery.type == this.data.config.LotteryGoods.TYPE_PHYSICAL) {
            showGetLotteryDes = `获得${lottery.name} ，赶快联系机构到店领取吧~`
        } else if (lottery.type == this.data.config.LotteryGoods.TYPE_COUPON) {//优惠券
            if (!/(一|二|两|三|四|五|六|七|八|九|十|[0-9]+)/.test(lottery.name)) {
                unit = '一张'
            }
            showGetLotteryDes = `获得${lottery.name}${unit}，赶快联系机构到店消费吧~`
        } else if (lottery.type == this.data.config.LotteryGoods.TYPE_EXPERIENCE) {
            if (!/(一|二|两|三|四|五|六|七|八|九|十|[0-9]+)/.test(lottery.name)) {
                unit = '一节'
            }
            showGetLotteryDes = `获得${lottery.name}${unit}，赶快联系机构到店体验吧~`
        }

        this.setData({
            showGetLotteryDes,
            showGetBox: true
        })
        this.getLotteryDrawList()
    },

    //次数用完了
    runOut() {
        console.log('runOut')
        this.setData({
            showNoChanceBox: true
        })
    },


    closeNoticeBox() {
        this.setData({
            showRuleBox: false,
            showNoChanceBox: false,
            showGetBox: false,
            showPickedBox: false
        })
    },

    showRule() {
        this.setData({
            showRuleBox: true
        })
    },

    getActivity() {
        // this.setData({
        //   Loaded: false
        // })
        let _this = this
        let url = 'api/activity/getlist'
        let data = {
            id: this.data.activity_id,
            queryDetail: true,
            type: app.config.Activity.TYPE_LOTTERY
        }
        request(url, 'get', data, function (res) {
            //res就是我们请求接口返回的数据
            var activity = res.data.data
            console.log('activity', activity)
            activity = lib.filterResult(activity)[0]
            var imglink = activity.imglink_format[0]
            var title = activity.name

            _this.setData({
                imglink: imglink,
                title: title,
                activity: activity,
                remain: res.data.remain ? res.data.remain : 0
            })


            _this.getLotteryGoods()

            var html = activity.detail
            console.log('html', html)
            WxParse.wxParse('article', 'html', html, _this, 25);

            if(_this.data.from_mid) {
                _this.addShareRecord()
            }
        }, function (res) {
            console.log('res',res)
            wx.showToast({
                title: '加载数据失败',
                icon: 'none'
            })
        })
    },

    getLotteryDrawList() {
        // this.setData({
        //   Loaded: false
        // })
        let _this = this
        let url = 'api/lottery/draw/getlist'
        let data = {
            activity_id: this.data.activity_id,
            pageIndex: 1,
            pageSize: 6
        }
        request(url, 'get', data, function (res) {
            //res就是我们请求接口返回的数据
            console.log('res', res)
            let lotteryDrawList = res.data.data
            lotteryDrawList.map(item => {
                item.des = `恭喜${item.uname}抽中${item.lottery_goods_name}`
            })

            _this.setData({
                lotteryDrawList
            })
        }, function (res) {
            console.log('res', res)
            wx.showToast({
                title: '加载数据失败',
                icon: 'none'
            })
        })
    },

    getLotteryGoods() {
        let _this = this
        let url = 'api/lottery/goods/getlist'
        let data = {
            activity_id: this.data.activity_id
        }
        request(url, 'get', data, function (res) {
            //res就是我们请求接口返回的数据
            let lotteryGoods = res.data.data
            let lotteryGoodsDisplay = lotteryGoods

            lotteryGoodsDisplay.map(function (item) {
                if (item.type == _this.data.config.LotteryGoods.TYPE_PHYSICAL) {
                    item.img = _this.data.config.Qiniu.STATIC_EXTERNAL_LINK + 'draw-physical.png'
                    item.long = false
                } else if (item.type == _this.data.config.LotteryGoods.TYPE_COUPON) {
                    item.img = _this.data.config.Qiniu.STATIC_EXTERNAL_LINK + 'draw-coupon.png'
                    item.long = true
                } else if (item.type == _this.data.config.LotteryGoods.TYPE_EXPERIENCE) {
                    item.img = _this.data.config.Qiniu.STATIC_EXTERNAL_LINK + 'draw-voucher.png'
                    item.long = true
                } else {
                    item.img = ''
                }
            })

            if (lotteryGoodsDisplay.length < 8) {
                let newDisplay = []
                let len = lotteryGoodsDisplay.length
                for (var i = 0; i < 8; i++) {
                    var index = i % len
                    newDisplay.push(lotteryGoodsDisplay[index])
                }

                console.log('newDisplay', newDisplay)
            }

            console.log('lotteryGoodsDisplay', lotteryGoodsDisplay)

            _this.setData({
                lotteryGoods: lotteryGoods,
                lotteryGoodsDisplay: lotteryGoodsDisplay
            })
        }, function () {
            wx.showToast({
                title: '加载数据失败',
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
        var shareInfo = {
            title: this.data.activity.name,
            path: lib.sprintf('pages/drawLottery/drawLottery?id=%s&from_mid=%s', this.data.activity_id, wx.getStorageSync('mid')),
            imageUrl: this.data.imglink
        }

        console.log(shareInfo)
        return shareInfo
    }
})