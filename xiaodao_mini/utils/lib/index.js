var date = require('./date.js')
var count = require('./count.js')
var strtotime = require('./strtotime.js')
var empty = require('./empty.js')
var str_replace = require('./str_replace.js')
var isset = require('./isset.js')
var sprintf = require('./sprintf.js')
var getImglink = require('./getImglink.js')
var isPhone = require('./isPhone.js')
var filterResult = require('./filterResult.js')
var getRelationType = require('./getRelationType.js')
var getMsgTime = require('./getMsgTime.js')
var in_array = require('./in_array.js')
var getShopOrderStatusName = require('./getShopOrderStatusName.js')
var numberLengthFormat = require('./numberLengthFormat.js')



var lib = {
	date: date,
  getMsgTime: getMsgTime,
  getRelationType: getRelationType,
    getShopOrderStatusName: getShopOrderStatusName,
	count: count,
	strtotime: strtotime,
	empty: empty,
	isset: isset,
  isPhone: isPhone,
  sprintf: sprintf,
    in_array: in_array,
  getImglink: getImglink,
  numberLengthFormat: numberLengthFormat,
  filterResult: filterResult
}

module.exports = lib

