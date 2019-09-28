import strtotime from './strtotime'

/*
 * 获得某个日期的第一秒或者最后一秒 date 格式： yyyy/mm/dd, type : first/last
 */
export default function getDateFirstLastTimestamp(date, type = 'first') {
  let time = strtotime(date)
  if(type == 'first') {
    return time
  }else{
    return time + 24*60*60 - 1
  }
}

