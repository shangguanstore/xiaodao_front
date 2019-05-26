//app.js
App({
  onLaunch: function () {
    console.log('onLaunch')
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    //获取UU7
    var UU7 = wx.getStorageSync('UU7')
    if(!UU7) {
      let url = this.config.baseServerUrl + 'api/code2session'
      let cid = this.config.cid
      wx.login({
        success: function(res) {
          if(res.code) {
            wx.request({
              url: url, // 仅为示例，并非真实的接口地址
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

              }
            })
          }
        }
      })
    }
  },

  globalData: {
      userInfo: null,
      subDomain: "https://api.it120.cc/xiaost", // 如果你的域名是： https://api.it120.cc/abcd 那么这里只要填写 abcd
      version: "4.0.0",
      shareProfile: '百款精品商品，总有一款适合您' // 首页转发的时候话术
  },

  //配置开始
  config: {
    cid: 100021,
    // baseServerUrl: 'https://api.photoelectric-displaycenter.com/',
    baseServerUrl: 'http://hxe.7hu.cn/',

    Qiniu: {
      ACTION_URL: 'http://up.qiniu.com',
      EXTERNAL_LINK: 'http://qiniu.xiaost.net/',
      STATIC_EXTERNAL_LINK: 'http://static.xiaost.net/',
    },
    ActivityOrder: {
      STATUS_OK: 0,
      STATUS_PAID: 1,
      STATUS_DELETED: -1,
      STATUS_TIMEOUT: 2
    },
    FrontOrderType: {
      TYPE_DEFAULT: 100,
      TYPE_GROUP_SINGLE: 201,
      TYPE_GROUP_START_TUAN: 202,
      TYPE_GROUP_JOIN_TUAN: 203
    },
    Share: {
      TYPE_DEFAULT: 0,
      TYPE_ACTIVITY: 1
    },
    Activity: {
      TYPE_NORMAL: 0,
      TYPE_GROUPON: 1,
      TYPE_GET_LIKES: 2,
      TYPE_LOTTERY: 3
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
    }

  }

  //配置结束
})