// pages/login/login.js
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
const common = require('../../utils/common.js')
const app = getApp()
import {
    UserAuth
} from "../../utils/userAuth"

Page({
    /**
     * 页面的初始数据
     */
    data: {
        config: {},
        activityId: 0,
        groupid: 0,
        orderType: 0,
        activityData: {},
        formValidate: {},
        username: '',
        phone: '',
        age: '',
        relations: ['母亲', '父亲', '本人', '其他'],
        relationIndex: 0,
        from: 0,

        //验证码
        showCodePhoneBox: false,
        codeDisabled: false,
        codeTime: 60,
        getPhoneCode: '发送验证码',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //common.checkWxSession()
        common.updateUserInfo()
        let config = app.config
        if (options.from == app.config.FrontLoginFrom.FROM_ACTIVITY_APPLY) {
            let groupid = options.groupid
            let activityData = JSON.parse(options.activityData)
            let activityId = activityData.id
            let orderType = options.orderType ? options.orderType : app.config.ActivityOrder.TYPE_DEFAULT

            this.setData({
                activityId: activityId,
                activityData: activityData,
                groupid: groupid,
                orderType: orderType
            })
        } else if (options.from == app.config.FrontLoginFrom.FROM_LOGIN) {

        } else if (options.from == app.config.FrontLoginFrom.FROM_LOTTERY_DRAW) {

        } else if(options.from == app.config.FrontLoginFrom.FROM_INDEX_EXPERIENCE) {

        }

        this.setData({
            from: options.from,
            config
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    confirmCodePhone() {
        let url = 'api/vcode/check'
        let formValidate = this.data.formValidate
        let data = {
            phone: formValidate.boxPhone,
            vcode: formValidate.vcode,
        }
        var _this = this
        request(url, 'post', data, function (res) {
            //res就是我们请求接口返回的数据
            // wx.showToast({
            //     title: '验证成功！',
            //     icon: 'success'
            // })
            formValidate.phone = formValidate.boxPhone
            _this.setData({
                showCodePhoneBox: false,
                formValidate
            })
        }, function (res) {
            wx.showToast({
                title: res.data.errMsg,
                icon: 'none'
            })
        })
    },

    cancelCodePhone() {
        this.setData({
            showCodePhoneBox: false
        })
    },

    afterSendCode() {
        let _this = this
        this.setData({
            codeDisabled: true
        })

        let codeTime = this.data.codeTime

        let interval = setInterval(function () {
            if ((codeTime--) <= 0) {
                _this.setData({
                    codeTime: 60,
                    getPhoneCode: '发送验证码',
                    codeDisabled: false
                })
                clearInterval(interval)
            } else {
                _this.setData({
                    getPhoneCode: codeTime + 's'
                })
            }
        }, 1000);
    },

    getPhoneNumber(e) {
        console.log('phone-e', e)
        console.log(e.detail.errMsg)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)

        if (e.detail.iv && e.detail.encryptedData) {
            this.getPhone(e.detail.iv, e.detail.encryptedData)
        } else {
            this.setData({
                showCodePhoneBox: true
            })
        }
    },

    getPhone(iv, encryptedData) {
        let _this = this
        let url = 'api/weixin/decode'
        let data = {
            iv,
            encryptedData
        }
        request(url, 'get', data, function (res) {
            //res就是我们请求接口返回的数据
            console.log('phone-res', res)
            let formValidate = _this.data.formValidate
            formValidate.phone = res.data.data.phoneNumber
            _this.setData({
                formValidate
            })
        }, function () {
            wx.showToast({
                title: '加载数据失败',
                icon: 'none'
            })
        })
    },

    changeField(e) {
        let formValidate = this.data.formValidate
        let field = e.currentTarget.dataset.field
        let type = e.currentTarget.dataset.type
        formValidate[field] = e.detail
        this.setData({
            formValidate: formValidate
        })
    },

    bindPickerChange(e) {
        let field = e.currentTarget.dataset.field
        let value = e.detail.value
        if (field == 'relation') {
            this.setData({
                relationIndex: value
            })
        }
    },

    tapApply(e) {
        let _this = this
        let userInfo = e.detail.userInfo
        if (!e.detail.userInfo) {
            return;
        }

        let formValidate = this.data.formValidate
        let phone = formValidate.phone
        let name = formValidate.name
        let relationName = this.data.relations[this.data.relationIndex]
        let father_phone, mother_phone, other_phone
        if (relationName == '母亲') {
            mother_phone = phone
        } else if (relationName == '父亲') {
            father_phone = phone
        } else if (relationName == '本人') {

        } else if (relationName == '其他') {
            other_phone = phone
        }
        let relationType = lib.getRelationType(relationName)
        if (lib.empty(name)) {
            wx.showToast({
                title: '请输入您孩子姓名',
                icon: 'none'
            })
            return
        }
        if (!lib.isPhone(phone)) {
            wx.showToast({
                title: '手机号码格式错误',
                icon: 'none'
            })
            return
        }

        // let url = 'api/member/update'
        let data = {
            mid: wx.getStorageSync('mid'),
            phone: phone,
            other_phone: other_phone ? other_phone : '',
            mother_phone: mother_phone ? mother_phone : '',
            father_phone: father_phone ? father_phone : '',
            name: name,
            relation: relationType,
            avatar: userInfo.avatarUrl
        }

        var userAuth = new UserAuth(userInfo, data, false);
        userAuth.login(res => {
            if (this.data.from == app.config.FrontLoginFrom.FROM_ACTIVITY_APPLY) {
                common.toApplyActivity(this.data.orderType, this.data.activityData, this.data.groupid)
            } else if (this.data.from == app.config.FrontLoginFrom.FROM_LOGIN || this.data.from == app.config.FrontLoginFrom.FROM_LOTTERY_DRAW) {
                wx.showToast({
                    title: '注册成功~',
                    icon: 'success'
                })
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 2000)
            } else if(this.data.from == app.config.FrontLoginFrom.FROM_INDEX_EXPERIENCE) {
                wx.showToast({
                    title: '您已登记成功！',
                    icon: 'success'
                })
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 1
                    })
                }, 2000)
            }
        })
    },

    smsCodeSend() {
        if(this.data.codeDisabled) return
        let url = 'api/sms/send'
        let data = {
            phone: this.data.formValidate.boxPhone,
            type: 1,
            sendType: 1
        }
        var _this = this
        this.afterSendCode()
        request(url, 'post', data, function (res) {
            //res就是我们请求接口返回的数据
            // wx.showToast({
            //     title: '请求发送验证码成功！',
            //     icon: 'success'
            // })
        }, function (res) {
            wx.showToast({
                title: res.data.errMsg,
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

    }
})