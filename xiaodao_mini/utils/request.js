var lib = require('./lib/index.js')
var app = getApp()


var request = function (url, method, params, success, fail, message = '') {
    url = app.config.baseServerUrl + url + '?XDEBUG_SESSION_START=PHPSTORM'

    var addition
    for (var key in params) {
        if (key == 'addition') {
            addition = params[key]
            delete params[key]
        }
    }

    var UU7 = wx.getStorageSync('UU7')
    params.UU7 = UU7
    params.cid = app.config.cid

    wx.showNavigationBarLoading()
    if (message != "") {
        wx.showLoading({
            title: message,
        })
    }

    wx.request({
        url: url,
        data: params,
        header: {
            // 'content-type': 'application/json' // 默认值
            'content-type': 'application/json; charset=utf-8'
            // 'content-type': 'application/x-www-form-urlencoded',
        },
        method: method,
        success: function (res) {
            wx.hideNavigationBarLoading()
            if (message != "") {
                wx.hideLoading()
            }
            if (res.statusCode == 200) {
                if (res.data.StatusCode == 403) {
                    login()
                } else if (res.data.errNo != 100000) {
                    fail(res)
                } else {
                    success(res, addition)
                }
            } else {
                fail(res)
            }
        },
        fail: function (res) {
            wx.hideNavigationBarLoading()
            if (message != "") {
                wx.hideLoading()
            }
            fail(res)
        },
        complete: function (res) {

        },
    })
}

var login = function () {
    //以code换取身份
    wx.login({
        success: function (res) {
            if (res.code) {
                //发起网络请求
                wx.request({
                    url: app.config.baseServerUrl + 'api/wechat/onloginapp?code=' + res.code,
                    header: {
                        // 'content-type': 'application/json' // 默认值
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                    data: {},
                    method: 'post',
                    success: function (response) {
                        var data = JSON.parse(response.data)
                        if (lib.isset(data.token)) { //以前绑定过
                            wx.setStorageSync('session_id', data.session_id)
                            wx.setStorageSync('token', data.token)
                            wx.setStorageSync('username', data.username)
                            wx.redirectTo({
                                url: '../index/index'
                            })
                        } else { //从未绑定过
                            wx.setStorageSync('session_id', data.session_id)
                            //去往授权登录页
                            wx.redirectTo({
                                url: '../login/index'
                            })
                        }
                    }
                })
            } else {
                console.log('登录失败！' + res.errMsg)
            }
        }
    });
}

module.exports = request