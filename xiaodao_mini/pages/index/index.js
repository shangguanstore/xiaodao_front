//index.js
//获取应用实例
const app = getApp()
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
import {
    UserAuth
} from "../../utils/userAuth";

Page({
    data: {
        config: {},
        company: {},
        showAuthBox: false,
        userInfo: {},
        Loaded: false,
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        
        bannerList: [],
        activityList: []
    },

    onLoad: function (options) {
        console.log('options---',options)

        let config = app.config
        this.setData({
            config: config
        })

        app.userOnline.then(res=>{
            let uname = wx.getStorageSync('uname')
            let phone = wx.getStorageSync('phone')
            let hasUserInfo = !!phone

            this.getData()
            this.setData({
                hasUserInfo,
                // showAuthBox: !(!!uname)
            })
        })
    },

    getData() {
      this.getCompany()
      this.getBannerList()
      this.getActivityList()
    },

    routeTo: function (e) {
        let id = e.currentTarget.dataset.id
        let type = e.currentTarget.dataset.type
        let config = this.data.config
        let url
        if (type == config.Activity.TYPE_NORMAL || type == config.Activity.TYPE_GROUPON) {
            url = '../activity/activity?id=' + id
        } else if (type == config.Activity.TYPE_LOTTERY) {
            url = '../drawLottery/drawLottery?id=' + id
        } else {
            url = '../activity/activity?id=' + id
        }

        wx.navigateTo({
            url: url
        })
    },

    toLogin() {
        let url = `../login/login?from=${app.config.FrontLoginFrom.FROM_INDEX_EXPERIENCE}`
        wx.navigateTo({
            url: url
        })
    },

    routeToArticle(e) {
        let url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: url
        })
    },

    routeToShop(e) {
        let url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: url
        })
    },

    callPhone() {
      let company = this.data.company
      let tel = company.phone ? company.phone : company.fixphone
      wx.makePhoneCall({
        phoneNumber: tel,
      })
    },

    viewMap() {
      console.log('this.company', this.company)
      if (this.data.company.geo) {
        var e = this.data.company.geo.split(",");
        wx.openLocation({
          latitude: e[0] - 0,
          longitude: e[1] - 0,
          name: this.data.company.name,
          address: this.data.company.address
        });
      }
    },

    getCompany() {
      // wx.showLoading()
      let url = 'api/company/getlist'
      var _this = this
      request(url, 'get', {}, function (res) {
        //res就是我们请求接口返回的数据
        var company = res.data.data
        lib.filterResult(company)

        _this.setData({
          company: company[0],
          Loaded: true
        })
        // wx.hideLoading()
      }, function () {
        wx.showToast({
          title: '加载数据失败',
          icon: 'none'
        })
      })
    },

    getBannerList() {
        let url = 'api/mbanner/getlist'
        let data = {
            pageIndex: 1,
            pageSize: 10
        }
        var _this = this
        request(url, 'get', data, function (res) {
            //res就是我们请求接口返回的数据
            var bannerList = res.data.Data
            bannerList.map(function (item) {
                item.imglink_format = lib.getImglink(item.imglink)[0]
                return item
            })

            _this.setData({
                bannerList: bannerList
            })
        }, function () {
            wx.showToast({
                title: '加载数据失败',
                icon: 'none'
            })
        })
    },

    getActivityList() {
        let url = 'api/activity/getlist'
        let data = {
            pageIndex: 1,
            pageSize: 100,
            type: `${this.data.config.Activity.TYPE_COURSE},${this.data.config.Activity.TYPE_GROUPON}`,
            publish: `${this.data.config.Activity.PUBLISH_ON}`,
            queryDetail: false
        }
        var _this = this
        request(url, 'get', data, function (res) {
            //res就是我们请求接口返回的数据
            let activityList = res.data.data
            let that = _this
            console.log('that.config', that.config)
            activityList.map(function (item) {
                item.imglink_format = lib.getImglink(item.imglink)[0]
                if (item.type == that.data.config.Activity.TYPE_GROUPON) {
                    item.btnText = '参与拼团'
                } else if (item.type == that.data.config.Activity.TYPE_LOTTERY) {
                    item.btnText = '立即抽奖'
                } else if (item.type == that.data.config.Activity.TYPE_COURSE && item.course_experience) {
                    item.btnText = '立即体验'
                }

                return item
            })

            console.log('activityList', activityList)
            _this.setData({
                activityList: activityList,
            })
        }, function () {
            wx.showToast({
                title: '加载数据失败',
                icon: 'none'
            })
        })
    },

    onClose() {
        this.setData({
            showAuthBox: false
        })
    },

    toAuth: function (e) {
        var _this = this
        var userInfo = e.detail.userInfo
        if (!e.detail.userInfo) {
            return;
        }
        this.setData({
            showAuthBox: false
        })

        var userAuth = new UserAuth(userInfo, null, false);
        userAuth.login(function (res) {
            console.log('res', res)
        })
    },

    print() {
        console.log(app.globalData.userInfo)
    },

    onShow() {
        let phone = wx.getStorageSync('phone')
        let hasUserInfo = false
        if(phone) hasUserInfo = true
        this.setData({
            hasUserInfo
        })
    },

    onShareAppMessage: function () {

    },

    onPullDownRefresh: function() {
      console.log(2222)
      wx.stopPullDownRefresh()
      this.getData()
    }

})