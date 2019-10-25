var lib = require('./lib/index.js')
var request = require('./request.js')
var app = getApp()

class UserAuth {
    //构造函数
    constructor(userInfo, userSubmitInfo, onlyCheckApigc = true) {
        this.userInfo = userInfo
        this.userSubmitInfo = userSubmitInfo
        this.onlyCheckApigc = onlyCheckApigc

        if(!lib.empty(userInfo)) {
          wx.setStorage({
            key: 'userInfo',
            data: userInfo,
          })
        }
    }

    xstLogin(loginSuccess) {
        var _this = this
        let hasSubmitInfo = !lib.empty(this.userSubmitInfo) ? true : false
        let url = 'api/member/update'
        let data = this.userSubmitInfo || {}
        data.mid = wx.getStorageSync('mid')
        data.apigc_uid = wx.getStorageSync('apigc_uid')
        data.name = data.name ? data.name : this.userInfo.nickName
        data.sex = this.userInfo.gender
        data.avatar = this.userInfo.avatarUrl
        if (hasSubmitInfo) {
            if (this.userSubmitInfo.phone) data.enforce_change_phone = true
        }

        request(url, 'post', data, function (res) {
            //res就是我们请求接口返回的数据
            console.log('update', res)
            var member = res.data.member
            var UU7 = res.data.UU7
            wx.setStorageSync('member', member)
            wx.setStorageSync('phone', member.phone)
            wx.setStorageSync('uname', member.uname)
            wx.setStorageSync('avatar', member.avatar)
            wx.setStorageSync('UU7', UU7)

            loginSuccess(res)
        }, function (res) {
            wx.showToast({
                title: res.data.errMsg,
                icon: 'none'
            })
        })
    }

    login(loginSuccess) {
        var _this = this
        let token = wx.getStorageSync('token');
        if (token) {
            wx.request({
                url: app.globalData.subDomain + '/user/check-token',
                data: {
                    token: token
                },
                success: function (res) {
                    if (res.data.code != 0) {
                        wx.removeStorageSync('token')
                        _this.login(loginSuccess)
                    } else if(!_this.onlyCheckApigc) {
                        console.log('_this.onlyCheckApigc',_this.onlyCheckApigc)
                        _this.xstLogin(loginSuccess)
                    }
                }
            })
        }else{
            wx.login({
                success: function (res) {
                    wx.request({
                        url: app.globalData.subDomain + '/user/wxapp/login',
                        data: {
                            code: res.code
                        },
                        success: function (res) {
                            if (res.data.code == 10000) {
                                // 去注册
                                _this.registerUser(loginSuccess);
                                return;
                            }
                            if (res.data.code != 0) {
                                // 登录错误
                                wx.hideLoading();
                                wx.showModal({
                                    title: '提示',
                                    content: '无法登录，请重试',
                                    showCancel: false
                                })
                                return;
                            }
                            wx.setStorageSync('token', res.data.data.token)
                            wx.setStorageSync('apigc_uid', res.data.data.uid)
                            if(!_this.onlyCheckApigc) _this.xstLogin(loginSuccess)
                        }
                    })
                }
            })
        }
    }

    registerUser(loginSuccess) {
        var _this = this
        wx.login({
            success: function (res) {
                var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
                wx.getUserInfo({
                    success: function (res) {
                        var iv = res.iv;
                        var encryptedData = res.encryptedData;
                        // 下面开始调用注册接口
                        wx.request({
                            url: app.globalData.subDomain + '/user/wxapp/register/complex',
                            data: {code: code, encryptedData: encryptedData, iv: iv}, // 设置请求的 参数
                            success: (res) => {
                                wx.hideLoading();
                                _this.login(loginSuccess);
                            }
                        })
                    }
                })
            }
        })
    }
}


export {UserAuth}





















