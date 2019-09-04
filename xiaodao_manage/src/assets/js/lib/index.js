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
import getUploadPicStr from './getUploadPicStr.js'
import getUpdateUploadPicStr from './getUpdateUploadPicStr.js'
import is_array from './is_array.js'
import in_array from './in_array.js'
import is_int from './is_int.js'
import is_string from './is_string.js'
import chinese2pinyin from './chinese2pinyin.js'
import getImglink from './getImglink.js'

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
  in_array: in_array,
  is_int: is_int,
  is_string: is_string,
  chinese2pinyin: chinese2pinyin,
  getRandomString: getRandomString,
  getUploadPicStr: getUploadPicStr,
  getUpdateUploadPicStr: getUpdateUploadPicStr,
  getImglink: getImglink,
  str_replace: str_replace
}

export default lib

