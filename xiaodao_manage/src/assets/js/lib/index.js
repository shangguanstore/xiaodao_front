import date from './date.js'
import implode from './implode.js'
import count from './count.js'
import strtotime from './strtotime.js'
import array_sum from './array_sum.js'
import empty from './empty.js'
import str_replace from './str_replace.js'
import isset from './isset.js'
import sprintf from './sprintf.js'
import getRequestUrl from './getRequestUrl.js'
import filterResult from './filterResult.js'
import getRandomString from './getRandomString.js'
import is_array from './is_array.js'

var lib = {
	date: date,
	count: count,
	strtotime: strtotime,
	array_sum: array_sum,
	empty: empty,
	implode: implode,
	isset: isset,
  	sprintf: sprintf,
    getRequestUrl: getRequestUrl,
    filterResult: filterResult,
    is_array: is_array,
    getRandomString: getRandomString,
	str_replace: str_replace
}

export default lib

