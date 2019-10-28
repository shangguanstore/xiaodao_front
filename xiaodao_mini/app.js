//app.js
App({
    onLaunch: function () {
        console.log('onLaunch')
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)


        this.userOnline = new Promise((resolve, reject)=> {
            var UU7 = wx.getStorageSync('UU7')
            if (UU7) {
                resolve()
            }else{
                let url = this.config.baseServerUrl + 'api/code2session'
                let cid = this.config.cid
                wx.login({
                    success: function (res) {
                        if (res.code) {
                            wx.request({
                                url: url,
                                data: {
                                    cid: cid,
                                    code: res.code,
                                    XDEBUG_SESSION_START: 'PHPSTORM'
                                },
                                header: {
                                    'content-type': 'application/json' // 默认值
                                },
                                success(res) {
                                    var data = res.data
                                    var member = data.member[0]
                                    wx.setStorageSync('UU7', data.UU7)
                                    wx.setStorageSync('mid', member.mid)
                                    wx.setStorageSync('member', member)
                                    wx.setStorageSync('uname', member.uname)
                                    wx.setStorageSync('phone', member.phone)
                                    wx.setStorageSync('avatar', member.avatar)
                                    resolve(res)
                                },
                                fail(err) {
                                    reject(err)
                                }
                            })
                        }
                    }
                })
            }
        })
    },

    globalData: {
        userInfo: null,
        subDomain: "https://api.it120.cc/xiaost", // 如果你的域名是： https://api.it120.cc/abcd 那么这里只要填写 abcd
        version: "4.0.0",
        shareProfile: '百款精品商品，总有一款适合您' // 首页转发的时候话术
    },

    //配置开始
    config: {
        cid: 100023,
        // baseServerUrl: 'https://api.xiaost.net/',
        baseServerUrl: 'http://hxe.7hu.cn/',

        Qiniu: {
            ACTION_URL: 'http://up.qiniu.com',
            EXTERNAL_LINK: 'http://qiniu.xiaost.net/',
            EXTERNAL_SSL_LINK: 'https://qinius.xiaost.net/',
            STATIC_EXTERNAL_LINK: 'http://static.xiaost.net/',
        },
        ActivityOrder: {
            STATUS_OK: 0,
            STATUS_PAID: 1,
            STATUS_DELETED: -1,
            STATUS_TIMEOUT: 2,

            TYPE_DEFAULT: 100,
            TYPE_GROUP_SINGLE: 201,
            TYPE_GROUP_START_TUAN: 202,
            TYPE_GROUP_JOIN_TUAN: 203
        },
        Share: {
            TYPE_DEFAULT: 0,
            TYPE_ACTIVITY: 1,
            TYPE_LOTTERY: 2,
        },
        Activity: {
            TYPE_NORMAL: 0,
            TYPE_GROUPON: 1,
            TYPE_GET_LIKES: 2,
            TYPE_LOTTERY: 3,
            TYPE_COURSE: 4,
            PUBLISH_OUT: -2,
            PUBLISH_HOLD: 0,
            PUBLISH_ON: 1
        },
        Member: {
            STATUS_OK: 0,
            STATUS_DELETE: -1,
            STATUS_INACTIVE: 1
        },
        LotteryGoods: {
            TYPE_PHYSICAL: 0,
            TYPE_COUPON: 1,
            TYPE_EXPERIENCE: 2
        },
        FrontLoginFrom: {
            FROM_ACTIVITY_APPLY: 1,
            FROM_LOGIN: 2,//个人中心，点击登录
            FROM_LOTTERY_DRAW: 3,//抽奖游戏
            FROM_INDEX_EXPERIENCE: 4,//首页点击 我要体验
        },
        ShopOrderGoods: {
            PAY_TYPE_POINT: 0,
            PAY_TYPE_MONEY: 1,
        },
        ShopOrder: {
            ORDER_STATUS_WAIT_PAY: 0,
            ORDER_STATUS_PAID: 1,
            ORDER_STATUS_WAIT_COMMENT: 11,
            ORDER_STATUS_FINISH: 12,
            ORDER_STATUS_CANCEL: 13,
            ORDER_STATUS_REFUND: 14,
        },


    },
    //配置结束

    //异步完成在线状态更新
    userOnline: null
})