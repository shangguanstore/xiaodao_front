import empty from './empty.js'
var app = getApp()

var getImglink = function (picStr, addExternal = true) {
  if (picStr) {
    var picArr = picStr.split('|')
    picArr = picArr.filter(function (item) {
      if (!empty(item)) {
        return item
      }
    })
    if (addExternal) {
      picArr = picArr.map(function (item) {
        return app.config.Qiniu.EXTERNAL_SSL_LINK + item
      })
    }

    return picArr
  } else {
    return false
  }
}

module.exports = getImglink