/**
 *获取下n个月的输入日期
 *{param:DateTime} date 输入日期(YYYY/MM/DD)
 *{param:number } monthNum 月数 不超过12
 */
module.exports = function getNextMonthDate(date, monthNum)
{
  var dateArr = date.split('/');
  var year = dateArr[0]; //获取当前日期的年份
  var month = dateArr[1]; //获取当前日期的月份
  var day = dateArr[2]; //获取当前日期的日
  var days = new Date(year, month, 0);
  days = days.getDate(); //获取当前日期中的月的天数
  var year2 = parseInt(year);
  var month2 = parseInt(month) + parseInt(monthNum);
  if (month2 >12) {
    year2 = year2 + (month2 % 12 == 0 ? month2 / 12 - 1 : month2 % 12)
    month2 = month2 % 12 == 0 ? 12 : month2 % 12;
  }
  var day2 = day;
  var days2 = new Date(year2, month2, 0);
  days2 = days2.getDate();
  if (day2 > days2) {
    day2 = days2;
  }
  if (month2 < 10) {
    month2 = '0' + month2;
  }

  var t2 = year2 + '/' + month2 + '/' + day2;
  return t2;
}
