var date = require('./date.js')
var count = require('./count.js')
var strtotime = require('./strtotime.js')
var empty = require('./empty.js')
var str_replace = require('./str_replace.js')
var isset = require('./isset.js')
var sprintf = require('./sprintf.js')
var getImglink = require('./getImglink.js')
var isPhone = require('./isPhone.js')



var lib = {
	date: date,
	count: count,
	strtotime: strtotime,
	empty: empty,
	isset: isset,
  isPhone: isPhone,
  sprintf: sprintf,
  getImglink: getImglink,
	str_replace: str_replace
}

module.exports = lib

