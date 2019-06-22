// pages/login/login.js
const lib = require('../../utils/lib/index.js')
const request = require('../../utils/request.js')
const common = require('../../utils/common.js')
const app = getApp()
import {UserAuth} from "../../utils/userAuth"

Page({
    /**
     * 页面的初始数据
     */
    data: {
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
        from: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('apply-options', options)
        if(options.from == app.config.FrontLoginFrom.FROM_ACTIVITY_APPLY) {
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
        }else if(options.from == app.config.FrontLoginFrom.FROM_LOGIN) {

        }

        this.setData({
            from: options.from
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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
        wx.setStorageSync('userInfo', e.detail.userInfo)

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

        var userAuth = new UserAuth(userInfo, data);
        userAuth.login(res=>{
            if(this.data.from == app.config.FrontLoginFrom.FROM_ACTIVITY_APPLY) {
                common.toApplyActivity(this.data.orderType, this.data.activityData, this.data.groupid)
            }else if(this.data.from == app.config.FrontLoginFrom.FROM_LOGIN) {
                wx.showToast({
                    title: '您已成功注册哦~',
                    icon: 'success'
                })
                setTimeout(()=>{
                    wx.navigateBack({
                        delta: 1
                    })
                },2000)
            }
        })

    },

    smsAuthCodeSend() {
        let url = 'api/sms/send'
        let data = {
            phone: '15335195967',
            type: 1,
            sendType: 1
        }
        var _this = this
        request(url, 'post', data, function (res) {
            //res就是我们请求接口返回的数据
            console.log('codeRes', res)
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