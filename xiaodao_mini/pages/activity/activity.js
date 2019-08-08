// pages/activity/activity.js
const lib = require('../../utils/lib/index.js')
const common = require('../../utils/common.js')
const request = require('../../utils/request.js')
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js')
import {
    UserAuth
} from "../../utils/userAuth";

Page({
    /**
     * 页面的初始数据
     */
    data: {
        config: {},
        activityId: 0,
        activityApplyMemberList: [],
        applyTotal: 0,
        showAuthBox: false,
        Loaded: false,
        groupIsFinished: false,//团购活动已经结束 group_end_time 已经超过当前时间
        day: 0,
        hour: 0,
        minu: 0,
        sec: 0,
        imglink: '',
        title: '',
        activity: {},
        from_mid: 0,
        hasUserInfo: false,
        groupList: [],
        showShareSelectBox: false,

        shareVisible: false,
        pageUrl: 'pages/activity/activity',
        scene: '',
        shareContent: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('a-o', options)

        app.userOnline.then(res=>{
            //初始化参数
            // options.scene = `id%3D37%26from_mid%3D17425`
            if(!options.scene) {
                initOption.call(this, options)
            }else{
                wx.showToast({
                    title: `[${options.scene}]`,
                    duration: 5000,
                    icon: 'none'
                })
                let queryStringObj = new Object()
                var queryStringArr = decodeURIComponent(options.scene).split('&')

                for(var i in queryStringArr) {
                    queryStringObj[queryStringArr[i].split('=')[0]] = queryStringArr[i].split('=')[1]
                }
                // console.log('queryStringObj',queryStringObj)
                initOption.call(this, queryStringObj)
            }

            //用户在线状态
            let phone = wx.getStorageSync('phone')
            let uname = wx.getStorageSync('uname')
            this.setData({
                hasUserInfo: !!phone,
                showAuthBox: !(!!uname)
            })

            this.getData()
        })

        function initOption(options) {
            if (options.from_mid) {
                this.setData({
                    from_mid: options.from_mid
                })
            }
            let scene = encodeURIComponent(`id=${options.id}&from_mid=${wx.getStorageSync('mid')}`) //分享二维码，以当前用户为 from_mid
            console.log('scene',scene)
            this.setData({
                activityId: options.id,
                scene,
                config: app.config
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    goHome() {
        wx.switchTab({
            url: '../index/index'
        })
    },

    toShare() {
        console.log('hahahhaahah')
        this.setData({
            showShareSelectBox: true
        })
    },
    showShare() {
        this.setData({
            shareVisible: true,
            showShareSelectBox: false
        })
    },
    close() {
        this.setData({
            shareVisible: false
        })
    },

    changeTimeRemaining() {
        if (this.data.activity.group_end_time) {
            var nowMilliseconds = new Date().getTime()
            var groupEndTimeMilliseconds = this.data.activity.group_end_time * 1000
            var timeRemaining = 0
            var day
            var hour
            var minu
            var sec
            var groupHour
            var groupMinu
            var groupSec
            var groupList = this.data.groupList
            if (nowMilliseconds < groupEndTimeMilliseconds) {
                timeRemaining = groupEndTimeMilliseconds - nowMilliseconds
                day = parseInt(timeRemaining / (60 * 60 * 24 * 1000))
                hour = parseInt(timeRemaining / (60 * 60 * 1000) % 24)
                minu = parseInt(timeRemaining / (60 * 1000) % 60)
                sec = parseInt(timeRemaining / 1000 % 60)

                var groupItemTimeRemaining = 0
                groupList.map(function (item) {
                    //一天后截止
                    var limitTime = item.create_time * 1000 + 24 * 60 * 60 * 1 * 1000
                    groupItemTimeRemaining = limitTime - nowMilliseconds
                    if (groupItemTimeRemaining > 0) {
                        groupHour = parseInt(groupItemTimeRemaining / (60 * 60 * 1000) % 24)
                        groupMinu = parseInt(groupItemTimeRemaining / (60 * 1000) % 60)
                        groupSec = parseInt(groupItemTimeRemaining / 1000 % 60)
                        item.timeRemain = `剩余时间${lib.numberLengthFormat(groupHour)}:${lib.numberLengthFormat(groupMinu)}:${lib.numberLengthFormat(groupSec)}结束`
                    } else {//已经超过一天了
                        item.timeRemain = ''
                    }

                    return item
                })

                this.setData({
                    day: day,
                    hour: hour,
                    minu: minu,
                    sec: sec,
                    groupList: groupList
                })
            } else {//已经结束了
                this.setData({
                    groupIsFinished: true
                })
                common.clearPageInterval('timeRemainTimer')
            }
        }
    },

    goApplyList() {
        wx.navigateTo({
            url: `../applyList/applyList?activityId=${this.data.activityId}`,
        })
    },

    toApply(e) {
        let orderType = e.currentTarget.dataset.orderType
        let groupid = e.currentTarget.dataset.groupid
        common.toApplyActivity(orderType, this.data.activity, groupid)
    },

    goToGroupDetail(e) {
        let orderType = e.currentTarget.dataset.orderType
        let groupid = e.currentTarget.dataset.groupid ? e.currentTarget.dataset.groupid : 0
        let activity = this.data.activity
        delete(activity.detail)
        wx.navigateTo({
            url: `../grouponDetail/grouponDetail?activityData=${JSON.stringify(activity)}&orderType=${orderType}&groupid=${groupid}`,
        })
    },

    onClose() {

    },
    onShareSelectClose() {
      this.setData({
          showShareSelectBox: false
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
            wx.showToast({
                title: '成功报名！',
                icon: 'success'
            })
            setTimeout(function () {
                wx.navigateTo({
                    url: '../myJoin/myJoin'
                })
            }, 3000)
        }, function (res) {
            wx.showToast({
                title: res.data.errMsg,
                icon: 'none'
            })
        })
    },

    addShareRecord() {
        let url = 'api/share/add'
        let data = {
            content_id: this.data.activityId,
            produce_mid: this.data.from_mid,
            receive_mid: wx.getStorageSync('mid'),
            type: app.config.Share.TYPE_ACTIVITY
        }
        var _this = this
        request(url, 'post', data, function (res) {
            //res就是我们请求接口返回的数据
            console.log(res)
        }, function (res) {
            console.log('err', res)
        })
    },

    getData() {
        this.setData({
            Loaded: false
        })
        let _this = this
        let url = 'api/activity/getlist'
        let data = {
            id: this.data.activityId,
            queryDetail: true,
        }
        request(url, 'get', data, function (res) {
            //res就是我们请求接口返回的数据
            var activity = res.data.data
            console.log('activity', activity)
            activity = lib.filterResult(activity)[0]
            var imglink = activity.imglink_format
            console.log('imglink', imglink)
            var title = activity.name

            if (activity.type == app.config.Activity.TYPE_GROUPON) {
                _this.getGroupList()
            }

            console.log('activity', activity)
            _this.setData({
                imglink: imglink,
                title: title,
                activity: activity
            })

            var html = activity.detail
            WxParse.wxParse('article', 'html', html, _this, 5);

            _this.setData({
                Loaded: true
            })

            if (_this.data.from_mid) {
                _this.addShareRecord()
            }

            _this.getActivityApplyMemberList()
            _this.getShareContent()
        }, function () {
            wx.showToast({
                title: '加载数据失败',
                icon: 'none'
            })
        })
    },

    getShareContent() {
        let activity = this.data.activity
        let shareContent = {}
        if(activity.type == app.config.Activity.TYPE_GROUPON) {
            shareContent = {
                type: activity.type,
                title: activity.name,
                banner: activity.imglink_format,
                pstart: activity.group_start_time_format,
                pend: activity.group_end_time_format
            }
        }else if(activity.type == app.config.Activity.TYPE_COURSE) {//课程
            shareContent = {
                type: activity.type,
                title: activity.name,
                banner: activity.imglink_format,
            }
        }else if(activity.type == app.config.Activity.TYPE_NORMAL) {//活动
            shareContent = {
                type: activity.type,
                title: activity.name,
                banner: activity.imglink_format,
                start: lib.date('Y-m-d H:i',activity.start_time),
                end: lib.date('Y-m-d H:i',activity.end_time)
            }
        }

        this.setData({
            shareContent
        })
    },

    getGroupList() {
        let _this = this
        let url = 'api/activity/group/getlist'
        let data = {
            activity_id: this.data.activityId,
            getCaptain: true
        }
        request(url, 'get', data, function (res) {
            //res就是我们请求接口返回的数据
            let groupList = res.data.data
            groupList = groupList.filter(function (item) {
                return item.group_num - item.groupTotalPeople
            })

            _this.setData({
                groupList: groupList
            })
        }, function () {
            // console.log('error',error)
            wx.showToast({
                title: '加载数据失败',
                icon: 'none'
            })
        })
    },

    routeTo(e) {
        console.log('e', e)
        let url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: url
        })
    },

    getActivityApplyMemberList() {
        this.setData({
            Loaded: false
        })
        let url = 'api/activity/apply/member/getlist'
        let data = {
            activity_id: this.data.activityId,
            pageIndex: 1,
            pageSize: 7
        }
        var _this = this
        request(url, 'get', data, function (res) {
            //res就是我们请求接口返回的数据
            let activityApplyMemberList = lib.filterResult(res.data.data)
            let applyTotal = res.data.total
            console.log('activityApplyMemberList', activityApplyMemberList)

            _this.setData({
                Loaded: true,
                activityApplyMemberList: activityApplyMemberList,
                applyTotal: applyTotal
            })
        }, function () {
            wx.showToast({
                title: '加载数据失败',
                icon: 'none'
            })
        })
    },

    toAuth: function (e) {
        var _this = this
        var userInfo = e.detail.userInfo
        if (!e.detail.userInfo) {
            return;
        }

        var userAuth = new UserAuth(userInfo, null, false);
        userAuth.login(function (res) {
            console.log('res', res)
            _this.setData({
                showAuthBox: false
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
        var shareInfo = {
            title: this.data.title,
            path: lib.sprintf('pages/activity/activity?id=%s&from_mid=%s', this.data.activityId, wx.getStorageSync('mid')),
            imageUrl: this.data.imglink
        }

        console.log(shareInfo)
        return shareInfo
    }
})