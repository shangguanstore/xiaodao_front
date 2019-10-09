function CoursetableCalendar() {
  this.rowHeight = 60;
  this.startHour = 7;//从上午7点到晚上21点
  this.endHour = 21;
  this.events = [];
  this.rows = {};
  this.colNum = 7;
  for (var i = this.startHour; i <= this.endHour; i++) {
    this.rows[i] = {visable: true};
  }
  this.hourText = {
    7: '早上',
    8: '早上',
    9: '上午',
    10: '上午',
    11: '上午',
    12: '中午',
    13: '下午',
    14: '下午',
    15: '下午',
    16: '下午',
    17: '下午',
    18: '晚上',
    19: '晚上',
    20: '晚上',
    21: '晚上'
  };
  this.classroomList = {};
  this.teacherList = {};
  this.courseList = {};
  this.rowsHideNum = {};//当前行之前已隐藏的行数
  this.weekTime = $('div[class~=week-time]');

  console.log("this.weekTime.find('div[class~=left-side]')",this.weekTime.find('div[class~=left-side]'))
  console.log("this.weekTime",this.weekTime)

  this.leftSideWidth = parseFloat(this.weekTime.find('div[class~=left-side]').css('width').replace('px', ''));
  this.onCallBack = {};
}

CoursetableCalendar.prototype.showHeader = function (curDate) {
  var monthText = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  $('.current-day').html(monthText[curDate.getMonth()] + ' ' + curDate.getFullYear() + '年');

  var monday = Util.getWeekMonday(curDate);
  var tmp = monday;
  var weekInfo = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  for (var i = 0; i < 7; i++) {
    $('.week-title > div').eq(i).data('time', tmp.getTime()).html((tmp.getMonth() + 1) + '.' + tmp.getDate() + ' ' + weekInfo[tmp.getDay()]);
    tmp = new Date();
    tmp.setTime(monday.getTime() + (i + 1) * 86400000);
  }
  this.refreshCurDate();
}

CoursetableCalendar.prototype.refreshCurDate = function (curDate) {
  curDate = typeof(curDate) == 'undefined' ? new Date() : curDate;
  var weekIndex = curDate.getDay();
  weekIndex = (weekIndex == 0) ? 6 : weekIndex - 1;
  this.weekTime.find('.day-col-wrapper').removeClass('current').eq(weekIndex).addClass('current');
}

CoursetableCalendar.prototype.getHourText = function (hour) {
  //早上,上午,中午,下午,晚上
  return this.hourText[hour] + (hour > 12 ? hour - 12 : hour) + '时';
}
CoursetableCalendar.prototype.addEventInfo = function (eventInfo) {
  var week = eventInfo.data.starttime.getDay();
  var hour = eventInfo.data.starttime.getHours();
  this.events.push(new CoursetableEvent(eventInfo, hour, week));

  console.log('eventInfo.hahaha',eventInfo)

  if (typeof(eventInfo.data.teacher_mid) != 'undefined' && typeof(this.teacherList[eventInfo.data.teacher_mid]) == 'undefined') {
    this.teacherList[eventInfo.data.teacher_mid] = eventInfo.data.teacher_name;
    this.callback('e.filterChange', {
      classroom: this.classroomList,
      coach: this.teacherList,
      course: this.courseList
    });
  }

  if (typeof(eventInfo.data.classroom_id) != 'undefined' && typeof(this.classroomList[eventInfo.data.classroom_id]) == 'undefined') {
    this.classroomList[eventInfo.data.classroom_id] = eventInfo.data.classroom_name;
    this.callback('e.filterChange', {
      classroom: this.classroomList,
      coach: this.teacherList,
      course: this.courseList
    });
  }

  if (typeof(eventInfo.data.ccid) != 'undefined' && typeof(this.courseList[eventInfo.data.ccid]) == 'undefined') {
    console.log('eventInfo.data.course_name',eventInfo.data.course_name)

    this.courseList[eventInfo.data.ccid] = eventInfo.data.course_name;
    this.callback('e.filterChange', {
      classroom: this.classroomList,
      coach: this.teacherList,
      course: this.courseList
    });
  }
}

CoursetableCalendar.prototype.updateEventInfo = function (eventInfo) {
  for (var i = 0; i < this.events.length; i++) {
    if (this.events[i].eventInfo.data.ctid == eventInfo.data.ctid) {
      this.events[i].eventInfo = eventInfo;
      break;
    }
  }
}


CoursetableCalendar.prototype.removeEventInfo = function (eventId) {
  for (var i = 0; i < this.events.length; i++) {
    if (this.events[i].eventInfo.eventId == eventId) {
      this.events.splice(i, 1);
      break;
    }
  }
}

CoursetableCalendar.prototype.removeExampleEventInfo = function () {
  var removeNum = 0;
  var newEvents = [];
  for (var i = 0; i < this.events.length; i++) {
    if (this.events[i].eventInfo.type == EventInfo.TYPE_EVENT_DEFAULT) {
      newEvents.push(this.events[i]);
    }
  }
  this.events = newEvents;
}

CoursetableCalendar.prototype.removeEventInfoAll = function () {
  this.events = [];
}


//展示指定条件的课程
CoursetableCalendar.prototype.filter = function (classRoomArr, coachArr, classArr) {
  classRoomArr = (typeof(classRoomArr) == 'undefined' && !$.isArray(classRoomArr)) ? [] : classRoomArr;
  coachArr = (typeof(coachArr) == 'undefined' && !$.isArray(coachArr)) ? [] : coachArr;
  classArr = (typeof(classArr) == 'undefined' && !$.isArray(classArr)) ? [] : classArr;

  if (!this.events.length)return;
  for (var i = 0; i < this.events.length; i++) {
    var eventInfo = this.events[i].eventInfo;
    if (eventInfo.type == EventInfo.TYPE_EVENT_EXAMPLE)continue;
    if (classRoomArr.indexOf(parseInt(eventInfo.data.classroom_id)) >= 0 &&
      coachArr.indexOf(parseInt(eventInfo.data.teacher_mid)) >= 0 &&
      classArr.indexOf(parseInt(eventInfo.data.ccid)) >= 0
    ) {
      this.events[i].display = true;
    } else {
      this.events[i].display = false;
    }

  }
  for(var i = 0;i < this.events.length;i ++)
  {
    var eventInfo = this.events[i].eventInfo;
    if(this.events[i].display) {
      this.weekTime.find('div[class~=event][data-ctid='+eventInfo.data.ctid+']').show();
    }else{
      this.weekTime.find('div[class~=event][data-ctid='+eventInfo.data.ctid+']').hide();
    }
  }
}
CoursetableCalendar.prototype.render = function () {
  var leftSideHtml = '';
  var hourLinesHtml = '';
  var dayHours = '';
  var parent = this;

  //调整窗口高度
  var height = $(window).height() - this.weekTime.offset().top - 15;
  this.weekTime.css('height', height + 'px');
  //重新初始化rows
  for (var i = this.startHour; i <= this.endHour; i++) {
    this.rows[i] = {visable: true};
  }
  //展示课表基础时间表格部分
  for (var i  in  this.rows) {
    var row = this.rows[i];
    if (row.visable) {
      leftSideHtml += '<div class="hour"><div data-hour="' + i + '">' + this.getHourText(i) + '</div></div>';
      hourLinesHtml += '<div class="hour-line" data-hour="' + i + '"></div>';
    }
  }
  for (var i = 0; i <= 6; i++) {
    dayHours += '<div class="day-col-wrapper "><div class="day-col"></div></div>';
  }
  $('.left-side').html(leftSideHtml);
  $('.hour-lines').html(hourLinesHtml);
  $('.day-hours').html(dayHours);
  var rowHeight = parseInt($('.hour-lines div:first-child').css('height').replace('px', ''));
  $('.left-side').css('height', rowHeight * Object.keys(this.rows).length);
  $('.hour-lines').css('height', rowHeight * Object.keys(this.rows).length);
  $('.day-hours').css('height', rowHeight * Object.keys(this.rows).length);
  $('.day-lines').css('height', rowHeight * Object.keys(this.rows).length);

  //计算课程具体的行,列位置
  var rowEvents = {};//{小时:{周一:[课程1,课程2]},...}
  this.events = _.sortBy(this.events, 'hour');
  for (var i = 0; i < this.events.length; i++) {
    var event = this.events[i];
    var week = event.week;
    if (typeof(rowEvents[event.hour]) == 'undefined') {
      var tmp = {};
      tmp[week] = [i];
      rowEvents[event.hour] = tmp;
    } else {
      if (typeof(rowEvents[event.hour][week]) == 'undefined') {
        rowEvents[event.hour][week] = [i];
      } else {
        rowEvents[event.hour][week].push(i);
      }
    }
  }

  //标记需要隐藏的行
  if (Object.keys(rowEvents).length) {
    //如果课程展示超过可视范围,隐藏空行以显示课程
    var maxShowHeight = this.weekTime.height();
    var maxVisableHourIndex = Math.floor(maxShowHeight / rowHeight) + this.startHour;

    this.rowsHideNum = {};
    var eventMaxHour = this.events[this.events.length - 1].hour;//获取最晚课程所处行

    var hideNums = 0;//当前已隐藏的行数
    var needHideNums = eventMaxHour - maxVisableHourIndex;
    for (var i in  this.rows) {
      this.rowsHideNum[i] = hideNums;
      if (needHideNums > 0 && (eventMaxHour > maxVisableHourIndex) && (typeof(rowEvents[i]) == 'undefined')) {
        this.rows[i].visable = false;
        hideNums++;
        needHideNums--;
      }
    }


    //刷新课程信息
    $('.day-hours > div > div').html('');
    for (var i in  this.rows) {
      if (this.rows[i].visable) {
        if (typeof(rowEvents[i]) == 'undefined')continue;
        var perRowEvents = rowEvents[i];
        for (var j = 0; j < this.colNum; j++) {
          if (typeof(perRowEvents[j]) != 'undefined') {
            var sameHoursEventsNum = perRowEvents[j].length;//当天同一小时内的并发课程
            var width = 100 / sameHoursEventsNum;
            //处理并列event
            for (var k = 0; k < sameHoursEventsNum; k++) {
              var positionInfo = {
                left: (width * k) + '%',
                top: (i - this.rowsHideNum[i] - this.startHour) * rowHeight,
                width: width + '%',
                // height: 56
                height: 50
              };
              var eventIndex = perRowEvents[j][k];
              var eventHtml = this.events[eventIndex].eventInfo.getHtml(positionInfo);
              this.weekTime.find('.day-hours > div > div').eq(j).append(eventHtml);
            }
          }
        }
      } else {
        this.weekTime.find('.left-side div[data-hour=' + i + ']').parent().remove();
        this.weekTime.find('.hour-line[data-hour=' + i + ']').remove();
      }
    }

    //课程信息注册事件
    this.weekTime.find('.event').mouseover(function () {
      $(this).addClass('event-delete');
    }).mouseout(function () {
      $(this).removeClass('event-delete');
    });
    this.addEventClick();

  }

  this.refreshCurDate();
}
CoursetableCalendar.prototype.addEventClick = function(){
  var parent = this;
  this.weekTime.find('.event').off('click').click(function(){
    if($(this).is('.active-event-detail')) {
      parent.clearSelectedClass();
      parent.callback('e.closeEvent', $(this).data());
    }else{
      parent.clearSelectedClass();
      $(this).addClass('active-event-detail');
      parent.callback('e.clickEvent', $(this).data());
    }
  });
}
CoursetableCalendar.prototype.removeEventClick = function(){
  this.clearSelectedClass();
  this.weekTime.find('.event').off('click');
}

CoursetableCalendar.prototype.clearSelectedClass = function(){
  this.weekTime.find('.active-event-detail').removeClass('active-event-detail');
}

CoursetableCalendar.prototype.getTipPos = function (offsetX, offsetY) {
  var colWidth = parseFloat(this.weekTime.find('div[class~=day-col-wrapper]').eq(0).css('width').replace('px', ''));
  var row = Math.floor(offsetY / this.rowHeight);
  var col = Math.max(0, Math.floor((offsetX - this.leftSideWidth) / colWidth));

  return {row: row, col: col, top: row * 60 - 1};
}
CoursetableCalendar.prototype.getOffestXY = function (e) {
  return {offsetX: e.pageX - $(e.currentTarget).offset().left, offsetY: e.pageY - $(e.currentTarget).offset().top+$(e.currentTarget)[0].scrollTop};
}
CoursetableCalendar.prototype.refreshSelectTip = function (offsetX, offsetY) {
  $dayCol = this.weekTime.find('div[class~=day-col-wrapper]');
  var parent = this;
  var tipPos = this.getTipPos(offsetX, offsetY);
  $dayCol.eq(0).parent().find('[class~=day-col-select-tip]').remove();
  $dayCol.eq(tipPos.col).append('<div class="day-col-select-tip blink cursor" style="top:' + tipPos.top + 'px">请选择课程时间</div>');
  this.weekTime.off('click').click(function (e) {
    $(this).find('div[class~=day-col-select-tip]').remove();
    var offset = parent.getOffestXY(e);
    var tipPos = parent.getTipPos(offset.offsetX, offset.offsetY);
    $dayCol.eq(tipPos.col).append('<div class="day-col-select-tip cursor" style="top:' + tipPos.top + 'px"></div>');
    parent.weekTime.off('mousemove');
    var curdate = new Date();
    curdate.setTime($('.week-title div').eq(tipPos.col).data('time'));
    curdate.setHours(parent.weekTime.find('.hour-line').eq(tipPos.row).data('hour'));
    parent.callback('e.clickAddNew', {curdate: curdate});
  });
}

CoursetableCalendar.prototype.getSelectedDate = function (weekIndex, hour) {
  var date = new Date();
}

CoursetableCalendar.prototype.showSelectTip = function () {
  var parent = this;
  this.removeEventClick();
  $('div[class~=day-col-wrapper]').eq(0).children('div').before('<div class="day-col-select-tip blink">请选择课程时间</div>');
  $('div[class~=week-time]').off('mousemove').mousemove(function (e) {
    var offset = parent.getOffestXY(e);
    parent.refreshSelectTip(offset.offsetX, offset.offsetY);
  })
}

CoursetableCalendar.prototype.removeSelectTip = function () {
  this.weekTime.off('mousemove');
  this.weekTime.off('click');
  this.weekTime.find('div[class~=day-col-select-tip]').remove();
  this.addEventClick();
}

CoursetableCalendar.prototype.callback = function (eventName, data) {
  if (typeof(this.onCallBack[eventName]) == 'undefined')return;
  if (eventName == 'e.clickEvent') {
    this.onCallBack[eventName](data);
  } else if (eventName == 'e.clickAddNew') {
    this.onCallBack[eventName](data);
  } else if (eventName == 'e.filterChange') {
    this.onCallBack[eventName](data);
  }else if(eventName == 'e.closeEvent'){
    this.onCallBack[eventName](data);
  }
}

CoursetableCalendar.prototype.on = function (eventName, eventFunc) {
  this.onCallBack[eventName] = eventFunc;
}

/**
 *
 * @param eventInfo
 * @param hour 小时,从0开始
 * @param week 星期,周一为0,周日为6
 * @param display
 * @constructor
 */
function CoursetableEvent(eventInfo, hour, week, display) {
  display = typeof(display) == 'undefined' ? true : display;
  this.eventInfo = eventInfo;
  this.hour = hour;
  this.week = week == 0 ? 6 : week - 1;
  this.display = display;
}

function EventInfo(data, type) {
  var startDate = new Date();
  startDate.setTime(parseInt(data.starttime) * 1000);

  var endDate = new Date();
  endDate.setTime(parseInt(data.starttime) * 1000 + parseInt(data.len) * 60 * 1000);

  this.type = (typeof(type) == 'undefined' || type == EventInfo.TYPE_EVENT_DEFAULT) ? EventInfo.TYPE_EVENT_DEFAULT : EventInfo.TYPE_EVENT_EXAMPLE;
  this.eventId = parseInt(Math.random()*100000000000).toString(16);

  this.data = data;
  this.data.eventId = this.eventId;
  this.data.class_type = (this.type == EventInfo.TYPE_EVENT_EXAMPLE) ? 'event-example' : 'event-default';
  this.data.start = this.data.starttime;
  this.data.starttime = startDate;
  this.data.endtime = endDate;
  this.data.startdate = this.data.starttime.getFullYear() + this.data.starttime.getHours() + this.data.starttime.getMinutes();
  this.data.course_time = this.data.starttime.getHours() + ':' + this.data.starttime.getMinutes() + '~' + this.data.endtime.getHours() + ':' + this.data.endtime.getMinutes();
  this.data.type = this.type;
  if (this.type == EventInfo.TYPE_EVENT_EXAMPLE) {
    delete  this.data.ctid;
  }
  if(this.data.status == -2){
    this.data.cancel = true;
  }else{
    this.data.cancel = false;
  }
}

EventInfo.TYPE_EVENT_DEFAULT = 1;
EventInfo.TYPE_EVENT_EXAMPLE = 2;//添加参照
EventInfo.prototype.getHtml = function (data) {
  for (var i in data) {
    this.data[i] = data[i];
  }
  return Mustache.render($('#temp_event').html(), this.data);
}
