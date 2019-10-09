
/**Util**/
function Util() {
};
Util.TYPE_STARTTIME = 1;
Util.TYPE_ENDTIME = 2;
/**
 *
 * @param {type} microtime
 * @param {type} type TYPE_STARTTIME 获取microtime，0时0分0秒的unixtime TYPE_ENDTIME 获取获取microtime，23时59分59秒的数据
 * @returns {undefined}
 */
Util.getTime = function (microtime, type) {
  var isStart = (type == Util.TYPE_STARTTIME);
  var date = new Date();
  date.setTime(microtime);
  date.setHours(isStart ? 0 : 23);
  date.setMinutes(isStart ? 0 : 59);
  date.setSeconds(isStart ? 0 : 59);
  return _.parseInt(date.getTime() / 1000);
}
/**
 * 获取指定日期所在周周一0:0:0:0日期
 * 按国人习惯一周从周一开始.周日算做上周
 * @param date
 */
Util.getWeekMonday = function (date) {
  var d = new Date();
  d.setTime(date.getTime());
  var week = d.getDay();
  if (week == 0) {
    week = 7;
  }

  d.setTime(d.getTime() - (week - 1) * 86400000);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * 获取指定日期所在周周日23:59:59:999
 * 按国人习惯一周从周一开始.周日算做上周
 * @param date
 * @returns {*}
 */
Util.getWeekSunday = function (date) {
  var d = new Date();
  d.setTime(date.getTime());
  var week = d.getDay();
  if (week == 0) {
    week = 7;
  }
  d.setTime(d.getTime() + (7 - week) * 86400000);
  d.setHours(23, 59, 59, 999);
  return d;
}

Util.getPreviousWeek = function (date) {
  var d = new Date();
  d.setTime(date.getTime());
  var week = d.getDay();
  var monday;
  var sunday;
  var curday;
  if (week == 0) {
    week = 7;
    d.setTime(d.getTime() - 7 * 86400000);
    curday = new Date();
    curday.setTime(d.getTime());
    d.setHours(23, 59, 59, 999);
    sunday = d;

    monday = Util.getWeekMonday(d);
  } else {
    d.setTime(d.getTime() - 7 * 86400000);
    curday = new Date();
    curday.setTime(d.getTime());
    monday = Util.getWeekMonday(d);
    sunday = Util.getWeekSunday(d);
  }
  return {curday: curday, monday: monday, sunday: sunday};
}
Util.getWeek = function (date) {
  var d = new Date(parseInt(date) * 1000);
  var week = d.getDay();
  var monday;
  var sunday;
  var curday;
  if (week == 0) {
    week = 7;
    d.setTime(d.getTime());
    curday = new Date();
    curday.setTime(d.getTime());
    d.setHours(23, 59, 59, 999);
    sunday = d;

    monday = Util.getWeekMonday(d);
  } else {
    d.setTime(d.getTime());
    curday = new Date();
    curday.setTime(d.getTime());
    monday = Util.getWeekMonday(d);
    sunday = Util.getWeekSunday(d);
  }
  return {curday: curday, monday: monday, sunday: sunday};
}
Util.getCurrentWeek = function (date) {
  var d = new Date();
  d.setTime(date.getTime());
  var week = d.getDay();
  var monday;
  var sunday;
  var curday;
  if (week == 0) {
    week = 7;
    d.setTime(d.getTime());
    curday = new Date();
    curday.setTime(d.getTime());
    d.setHours(23, 59, 59, 999);
    sunday = d;

    monday = Util.getWeekMonday(d);
  } else {
    d.setTime(d.getTime());
    curday = new Date();
    curday.setTime(d.getTime());
    monday = Util.getWeekMonday(d);
    sunday = Util.getWeekSunday(d);
  }
  return {curday: curday, monday: monday, sunday: sunday};
}
Util.getNextWeek = function (date) {
  var d = new Date();
  d.setTime(date.getTime());
  var week = d.getDay();
  var monday;
  var sunday;
  var curday;
  if (week == 0) {
    week = 7;
    d.setTime(d.getTime() + 7 * 86400000);
    curday = new Date();
    curday.setTime(d.getTime());
    d.setHours(23, 59, 59, 999);
    sunday = d;

    monday = Util.getWeekMonday(d);
  } else {
    d.setTime(d.getTime() + 7 * 86400000);
    curday = new Date();
    curday.setTime(d.getTime());
    monday = Util.getWeekMonday(d);
    sunday = Util.getWeekSunday(d);
  }
  return {curday: curday, monday: monday, sunday: sunday};
}

Util.checkDate = function (dataStr) {
  var tmp = dataStr.split('/');
  if (tmp[0].length != 4 || tmp.length != 3)return false;
  var year = parseInt(tmp[0]);
  var month = parseInt(tmp[1]);
  var day = parseInt(tmp[2]);

  if (year < 1970 || (month > 12 || month <= 0) || (day > 31 || day <= 0))return false;

  return [year, month, day];
}

Util.getHexColor = function (color) {
  if (/^#[a-zA-Z0-9]{6}$/.test(color))return color;
  var rgb = color;
  if (rgb >= 0) return rgb;//如果是一个hex值则直接返回
  else {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgb == null) {
      return;
    }
    function hex(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
    }

    rgb = "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
  }
  return rgb;
}

/**Util end**/
