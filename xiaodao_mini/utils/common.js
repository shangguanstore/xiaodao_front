var lib = require('./lib/index.js')
var app = getApp()

function toApplyActivity(type, activityData, groupid) {
  console.log('arguments',arguments)
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
  console.log('timeK',key)
  // wx.getStorage({
  //   key: key,
  //   success: function(res) {
  //     console.log(res)
  //   },
  // })
  clearInterval(wx.getStorageSync(key))
  wx.removeStorageSync(key)
}

module.exports = {
  toApplyActivity: toApplyActivity,
  setPageInterval: setPageInterval,
  clearPageInterval: clearPageInterval
}