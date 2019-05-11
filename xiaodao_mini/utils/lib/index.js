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
var numberLengthFormat = require('./numberLengthFormat.js')



var lib = {
	date: date,
  getMsgTime: getMsgTime,
  getRelationType: getRelationType,
	count: count,
	strtotime: strtotime,
	empty: empty,
	isset: isset,
  isPhone: isPhone,
  sprintf: sprintf,
  getImglink: getImglink,
  numberLengthFormat: numberLengthFormat,
  filterResult: filterResult
}

module.exports = lib

