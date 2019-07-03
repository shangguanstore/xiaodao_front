var lib = require('./lib/index.js')
var app = getApp()

function toApplyActivity(type, activityData, groupid) {
    console.log('arguments', arguments)
    type = type ? type : app.config.ActivityOrder.TYPE_DEFAULT
    groupid = groupid ? groupid : 0
    //不传详细数据，有可能导致下个页面JSON.parse的时候报错
    activityData.detail = undefined
    let member = wx.getStorageSync('member')
    if (member.phone) {
        // 跳到订单确认页
        wx.navigateTo({
            url: `../orderConfirm/orderConfirm?orderType=${type}&activityData=${JSON.stringify(activityData)}&groupid=${groupid}`
        })
    } else {
        //跳到填写信息页面
        wx.navigateTo({
            url: `../login/login?from=${app.config.FrontLoginFrom.FROM_ACTIVITY_APPLY}&orderType=${type}&activityData=${JSON.stringify(activityData)}&groupid=${groupid}`
        })
    }

    // if (lib.in_array(type, [app.config.ActivityOrder.TYPE_DEFAULT, app.config.FrontOrderType.TYPE_GROUP_SINGLE])) {

    // } else if (lib.in_array(type, [app.config.ActivityOrder.TYPE_GROUP_START_TUAN, app.config.FrontOrderType.TYPE_GROUP_JOIN_TUAN])) {

    // }
}

function setPageInterval(key, fn, t) {
    clearPageInterval(key)
    let timer = setInterval(fn, t)
    wx.setStorage({
        key: key,
        data: timer,
    })
}

function clearPageInterval(key) {
    console.log('timeK', key)
    // wx.getStorage({
    //   key: key,
    //   success: function(res) {
    //     console.log(res)
    //   },
    // })
    clearInterval(wx.getStorageSync(key))
    wx.removeStorageSync(key)
}

function checkWxSession() {
    wx.checkSession({
        success() {
            //session_key 未过期，并且在本生命周期一直有效
            console.log('session_key未过期')
        },
        fail() {
            // session_key 已经失效，需要重新执行登录流程
            updateUserInfo()
        }
    })
}

function updateUserInfo() {
    wx.login({
        success: function (res) {
            if (res.code) {
                let url = app.config.baseServerUrl + 'api/code2session'
                wx.request({
                    url: url,
                    data: {
                        cid: app.config.cid,
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

                    }
                })
            }
        }
    })
}

module.exports = {
    toApplyActivity: toApplyActivity,
    setPageInterval: setPageInterval,
    clearPageInterval: clearPageInterval,
    checkWxSession,
    updateUserInfo
}