import in_array from './in_array'

/* 获取时间段内属于星期一(*)的日期们
 * begin: 开始时间
 * end：结束时间
 * weekNumArr：星期几 [number]
 */
export default function getWeekdayDate(begin, end, weekNumArr) {
  var dateArr = new Array();
  var stimeArr = begin.split("-");//=>["2018", "01", "01"]
  var etimeArr = end.split("-");//=>["2018", "01", "30"]

  var stoday = new Date();
  stoday.setUTCFullYear(stimeArr[0], stimeArr[1]-1, stimeArr[2]);
  var etoday = new Date();
  etoday.setUTCFullYear(etimeArr[0], etimeArr[1]-1, etimeArr[2]);

  var unixDb = stoday.getTime();//开始时间的毫秒数
  var unixDe = etoday.getTime();//结束时间的毫秒数

  for (var k = unixDb; k <= unixDe;) {
    let needJudgeDate = msToDate(parseInt(k)).withoutTime;
    //不加这个if判断直接push的话就是已知时间段内的所有日期
    if (in_array(new Date(needJudgeDate).getDay(), weekNumArr)) {
      dateArr.push(needJudgeDate);
    }
    k = k + 24*60*60*1000;
  }
  return dateArr;
}

//根据毫秒数获取日期
function msToDate (msec) {
  let datetime = new Date(msec);
  let year = datetime.getFullYear();
  let month = datetime.getMonth();
  let date = datetime.getDate();
  let hour = datetime.getHours();
  let minute = datetime.getMinutes();
  let second = datetime.getSeconds();

  let result1 = year +
    '-' +
    ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) +
    '-' +
    ((date + 1) < 10 ? '0' + date : date) +
    ' ' +
    ((hour + 1) < 10 ? '0' + hour : hour) +
    ':' +
    ((minute + 1) < 10 ? '0' + minute : minute) +
    ':' +
    ((second + 1) < 10 ? '0' + second : second);

  let result2 = year +
    '-' +
    ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) +
    '-' +
    ((date + 1) < 11 ? '0' + date : date);

  let result = {
    hasTime: result1,
    withoutTime: result2
  };

  return result;
}
