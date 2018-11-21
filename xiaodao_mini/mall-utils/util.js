var app = getApp()

function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function sendTempleMsg(orderId, trigger, template_id, form_id, page, postJsonString) {
    var that = this;
    wx.request({
        url: app.globalData.subDomain + '/template-msg/put',
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
            token: wx.getStorageSync('token'),
            type: 0,
            module: 'order',
            business_id: orderId,
            trigger: trigger,
            template_id: template_id,
            form_id: form_id,
            url: page,
            postJsonString: postJsonString
        },
        success: (res) => {
            //console.log('*********************');
            //console.log(res.data);
            //console.log('*********************');
        }
    })
}

function sendTempleMsgImmediately(template_id, form_id, page, postJsonString) {
    var that = this;
    wx.request({
        url: app.globalData.subDomain + '/template-msg/put',
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
            token: wx.getStorageSync('token'),
            type: 0,
            module: 'immediately',
            template_id: template_id,
            form_id: form_id,
            url: page,
            postJsonString: postJsonString
        },
        success: (res) => {
            console.log(res.data);
        }
    })
}

function goNav(curNav, switchNav) {
    if(curNav == switchNav) return
    if(switchNav == 'index') {
        wx.switchTab({
            url: '../../pages/index/index'
        })
    }else if(switchNav == 'mall') {
        wx.redirectTo({
            url: '../mall/mall'
        })
    }else if(switchNav == 'cart') {
        wx.navigateTo({
            url: '../shop-cart/shop-cart'
        })
    }else if(switchNav == 'ucenter') {
        wx.switchTab({
            url: '../../pages/ucenter/ucenter'
        })
    }
}

module.exports = {
    formatTime: formatTime,
    sendTempleMsg: sendTempleMsg,
    sendTempleMsgImmediately: sendTempleMsgImmediately,
    goNav: goNav
}
