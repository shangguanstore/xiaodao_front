import date from './date'

/*
 * 获得本周 周一和周日的 日期
 */
export default function getCurWeekStartEndDate() {
  var now = new Date()
  var nowTime = now.getTime()
  var day = now.getDay()
  var oneDayLong = 24*60*60*1000

  var MondayTime = nowTime - (day-1)*oneDayLong
  var SundayTime =  nowTime + (7-day)*oneDayLong

  return [date('Y/m/d',MondayTime / 1000),date('Y/m/d',SundayTime / 1000)]
}

