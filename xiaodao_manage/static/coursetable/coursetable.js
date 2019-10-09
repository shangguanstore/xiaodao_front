var COMPANY_ID = 0;
var CLASSLIST = {};
var g_curday;
var g_coursetableCalendar;
var g_bookmaxcount_selectize;
var HXE_DOMAIN = 'http://localhost:8080'
/**
 * 根据keyword查询相关课程
 * @param {type} keyword
 * @param {type} searchResult
 * @returns {undefined}
 */
function showCourseAddSearch(keyword, searchResult) {
  var searchList = "";
  var $panel = $('#coursetable-setting-panel');
  $panel.find("input[name=name]").focus(function () {
    $(this).bind("keyup", function () {
      var keyword = $.trim($(this).val());
      if (keyword.length == 0) {
        $panel.find("div[name=search_result]").html("");
        $(this).parent().addClass('has-error');
        return;
      } else {
        $(this).parent().removeClass('has-error');
      }

      //课程表只获取一次，提高速度
      if (searchList) {
        showSearch(keyword, searchList);
      } else {
        $.getJSON(HXE_DOMAIN + "/api/course/search", function (data) {
          searchList = data.data;
          showSearch(keyword, data.data);
        });
      }
    });
  });

  function showSearch(keyword, searchResult) {
    var $result = $panel.find("div[name=search_result]");

    var data = [];
    for (var i in searchResult) {
      if (i.indexOf(keyword) !== -1 || searchResult[i][0].name.indexOf(keyword) !== -1) {
        for (var j in searchResult[i]) {
          data.push(searchResult[i][j]);
        }
      }
    }

    if (data.length == 0) {
      $result.html('');
      return;
    }

    var template = '{{#item}}<button type="button" class="btn btn-default btn-sm" name="item_{{id}}" style="margin-bottom:3px;" data="{{name}}">{{name}} <span class="glyphicon glyphicon-plus"></span></button> {{/item}}';
    var rendered = Mustache.render(template, {"item": data});
    $result.html(rendered).show();


    $result.find("button[name^='item_']").click(function () {
      $panel.find("input[name=name]").data('course_id', $(this).attr("name").replace("item_", "")).val($(this).attr("data"));
    });
  }
}

/**
 * 课程管理
 */
function loadCourseList() {
  $.getJSON(HXE_DOMAIN + '/api/course/my', function (data) {
    refreshSelect(data.data);
    var modal = $('#coursetable-setting-panel');
    modal.find('input[name=name]').val('').prop('disabled', false);
    modal.find('input[name=ccid]').val('');
    var cardTypeList = [];
    if (Object.keys(CardType.cardTypeList).length) {
      for (var i in CardType.cardTypeList) {
        cardTypeList.push(CardType.cardTypeList[i]);
      }
    }
    var item = data.data;
    for (var i in item) {
      CLASSLIST[item[i].ccid] = item[i];
      var text = [];
      var courseInfo = item[i];
      var ccid = courseInfo.ccid;
      if (courseInfo.cardTypeId && courseInfo.cardTypeId.length) {
        for (var j = 0; j < courseInfo.cardTypeId.length; j++) {
          var cardTypeId = courseInfo.cardTypeId[j];
          text.push({
            name: CardType.cardTypeList[cardTypeId].name,
            info: CardType.cardTypeList[cardTypeId].ruleTextAll
          });
        }
      }else{
        text.push({
          name: '所有卡均可上本课程',
          info: ''
        });
      }
      item[i]['rule_text'] = text;
    }
    modal.find('.modal-body').html(Mustache.render($('#temp_add_class').html(), {
      item: item, cardTypeList: cardTypeList
    }));
    modal.find('.modal-title').text('课程管理');
    $('#coursetable-setting-panel').modal('show');
    showCourseAddSearch();
    modal.find('.modal-body .courselist tbody tr').click(function () {
      var courseInfo = $(this).find('td').eq(0);
    });
    //发起新添课程请求
    $('#coursetable-setting-panel button[data-type=submit]').off('click').click(function () {
      if ($.trim(modal.find('input[name=name]').val()).length) {
        modal.find('input[name=name]').parent().removeClass('has-error');
      } else {
        modal.find('input[name=name]').parent().addClass('has-error');
        return;
      }
      var params = {name: $.trim(modal.find('[name=name]').val()), cid: COMPANY_ID};
      if ($('#coursetable-setting-panel input[name=more]')) {
        params['course_permit_card_type_id'] = [];
        $('#cardrules input[type=checkbox]').each(function () {
          if (this.checked)
            params['course_permit_card_type_id'].push($(this).data('cardtype_id'));
        });
      } else {
        params['course_permit_card_type_id'] = '';
      }
      var ccid = modal.find('input[name=ccid]').val();
      var url = '';
      if ($.isNumeric(ccid)) {
        params['ccid'] = ccid;
        url = HXE_DOMAIN + '/api/company/course/rule/update';
      }else{
        params['content'] = modal.find('textarea[name=comment]').val();
        url = HXE_DOMAIN + '/api/company/course/add';
      }
      $.post(url, params, function (data) {
        if (data.errNo == '100000') {
          if(modal.find('textarea[name=comment]').val() != '' && $.isNumeric(ccid)){
            $.post(HXE_DOMAIN + '/api/company/course/update',{ccid:ccid,content:modal.find('textarea[name=comment]').val()}, function(res){
              if(res.errNo == 100000){
                alert('操作成功');
                modal.find('input[name=name]').val('');
                loadCourseList();
              }else{
                alert('操作失败,' + data.errMsg);
              }
            })
          }else{
            alert('操作成功');
            modal.find('input[name=name]').val('');
            loadCourseList();
          }
        } else if (data.errNo == '119001') {
          //公司已存在此课
          ResultAlert.open('操作失败,' + data.errMsg);
        } else {
          ResultAlert.open('操作失败,' + data.errMsg);
        }
      });
    });

    //删除已选课程
    $('#coursetable-setting-panel .courselist button[name=del]').off('click.hxe').on('click.hxe', function () {
      var ccid = $(this).data("ccid");
      if (confirm('确认删除此课程?')) {
        //删除
        $.post(HXE_DOMAIN + "/api/course/del", {id: ccid, cid: COMPANY_ID})
          .done(function (data) {
            if (data.errNo == '100000') {
              loadCourseList();
            } else {
              ResultAlert.open(data.errNo, data.errMsg);
            }
          });
      }

    });

    //编辑课程,不允许修改课程名
    $('#coursetable-setting-panel .courselist  button[name=edit]').off('click.hxe').on('click.hxe', function () {
      var ccid = $(this).data('ccid');
      modal.find('input[name=name]').val($(this).data('name')).prop('disabled', true);
      modal.find('input[name=ccid]').val(ccid);
      modal.find('textarea[name=comment]').val($(this).data('content'));
      if (typeof(CLASSLIST[ccid]) != 'undefined') {
        // $('#cardrules').removeClass('hidden');
        $('#coursetable-setting-panel input[name=more]').prop('checked', true);
        var cardTypeIdArr = CLASSLIST[ccid].cardTypeId;
        if (!cardTypeIdArr || !cardTypeIdArr.length)return;
        $('#cardrules input[type=checkbox]').each(function () {
          if (cardTypeIdArr.indexOf('' + $(this).data('cardtype_id')) >= 0) {
            $(this).prop('checked', true);
          }
        })
      }
    });
  });

  function refreshSelect(data) {
    $('#class').html("");
    if (data != 'undefined') {
      for (var i in data) {
        $('#class').append("<option value='" + data[i].ccid + "'>" + data[i].name + "</option>");
      }
      $('#class').selectpicker('refresh');
    }
  }
}

function loadLevel() {
  $.getJSON(HXE_DOMAIN + '/api/level/my', function (data) {
    refreshSelect(data.data);
    var modal = $('#coursetable-setting-panel');
    modal.find('.modal-body').html(Mustache.render($('#temp_add_level').html(), data));
    modal.find('.modal-title').text('课程等级管理');
    modal.modal('show');
    $('#colorpicker').colorpicker();
    modal.find('button[name=recommend_color]').off('click').click(function(){
      var color = $(this).data('color');
      $('#colorpicker').colorpicker('setValue',color);
    });
    modal.find('button[data-type=submit]').off('click').click(function () {
      var params = {"name": $.trim(modal.find('input[name=add_item_input]').val()), cid: COMPANY_ID , level_color:modal.find('#colorpicker').find('input').val(),level_info:modal.find('textarea[name=comment]').val()};
      $.post(HXE_DOMAIN + "/api/level/add", params, function (data) {
        if (data.errNo == '100000') {
          alert('操作成功');
          modal.find('input[name=add_item_input]').val('');
          var levelList = {};
          modal.find('button[name=del]').each(function () {
            levelList[$(this).data('clid')] = {clid: $(this).data('clid'), name: $(this).data('name')};
          });
          loadLevel();
        } else if (data.errNo == '119001') {
          //公司已存在此课
          ResultAlert.open(data.errNo, data.errMsg);
        } else {
          ResultAlert.open(data.errNo, data.errMsg);
        }
      });
    });
    modal.find('button[name=del]').off('click').click(function(){
      if(confirm('确认删除该等级？')){
        var $this = $(this);
        var clid = $this.data('clid');
        $.post(HXE_DOMAIN + '/api/level/del',{cid: COMPANY_ID,id: clid},function(data){
          if(data.errNo == 100000){
            alert('操作成功');
            loadLevel();
          }
        })
      }
    })

  });

  function refreshSelect(data) {
    $('#level').html('<option value="0">不限制等级</option>');
    if (data != 'undefined') {
      for (var i in data) {
        $('#level').append("<option value='" + data[i].clid + "'>" + data[i].name + "</option>");
      }
      $('#level').selectpicker('refresh');
    }
  }
}

function loadCoach() {
  $.getJSON(HXE_DOMAIN + '/api/coach/my', function (data) {
    refreshSelect(data.data);
    var modal = $('#coursetable-setting-panel');
    modal.find('.modal-body').html('');
    for(var i in data.data){
      data.data[i].new_avatar = data.data[i].user.avatar != '' ? data.data[i].user.avatar : '';
      data.data[i].new_sex = data.data[i].user.sex == 0 ? '男' : '女'
    }
    modal.find('.modal-body').append(Mustache.render($('#temp_add_coach').html(), data));
    modal.find('.modal-title').text('教练信息管理');
    modal.modal('show');
    //开始提交信息
    modal.find('button[data-type=submit]').off('click').click(function () {
      var phone = modal.find('input[name=phone]').val();
      var name = modal.find('input[name=name]').val();
      var sex = modal.find('input[name=sex]:checked').val();
      if(name == '')modal.find('input[name=phone]').focus();
      if(!Vali.isPhone(phone))modal.find('input[name=name]').focus();
      var params = {name:name,phone:phone,type:1,sex:sex,imgurl:''};
      $.post(HXE_DOMAIN + "/api/member/add", params, function (data) {
        if (data.errNo == '100000') {
          alert('操作成功');
          modal.find('input[name=phone]').val('');
          modal.find('input[name=name]').val('');
          loadCoach();
        }
      });
    });
  });
  function refreshSelect(data) {
    $('#coach').html('<option value="0">--请选择教练--</option>');
    if (data != 'undefined') {
      for (var i in data) {
        $('#coach').append("<option value='" + data[i].mid + "'>" + data[i].uname + "</option>");
      }
      $('#coach').selectpicker('refresh');
    }
  }
}

function loadWeekEvent(startDate) {

  var monday = Util.getWeekMonday(startDate);
  var sunday = Util.getWeekSunday(startDate);
  var start_time = parseInt(monday.getTime() / 1000);
  var end_time = parseInt(sunday.getTime() / 1000);

  g_coursetableCalendar.showHeader(startDate);
  g_coursetableCalendar.render();

  $.post(HXE_DOMAIN + '/api/coursetable/getlist?XDEBUG_SESSION_START=PHPSTORM', {
    start_time: start_time,
    end_time: end_time,
    cid: COMPANY_ID
  }, function (data) {
    if (data.errNo == 100000) {
      if(data.have_big_course_rule == 1){
        $('div[name=classtype]').parent().removeClass('hidden');
      }
      for (var i in data.data) {
        if (data.data[i].status == '-1' || data.data[i].status == '-2')continue;
        var eventInfo = new EventInfo(data.data[i]);
        g_coursetableCalendar.addEventInfo(eventInfo);
      }
      g_coursetableCalendar.render();
    } else {
      ResultAlert(data.errNo, data.errMsg);
    }
  });
}
function openWeekView() {
  loadWeekEvent(new Date());
}

function openMonthView() {

}
function reloadWeekData(curday, monday, sunday) {
  g_coursetableCalendar.removeEventInfoAll();
  g_coursetableCalendar.render();
  $.post(HXE_DOMAIN + '/api/coursetable/getlist?XDEBUG_SESSION_START=PHPSTORM', {
    start_time: parseInt(monday.getTime() / 1000),
    end_time: parseInt(sunday.getTime() / 1000),
    cid: COMPANY_ID
  }, function (data) {
    if (data.errNo == 100000) {
      for (var i in data.data) {
        if (data.data[i].status == '-1')continue;
        var eventInfo = new EventInfo(data.data[i]);
        g_coursetableCalendar.addEventInfo(eventInfo);
      }
      g_coursetableCalendar.showHeader(curday);
      g_coursetableCalendar.render();
    } else {
      ResultAlert(data.errNo, data.errMsg);
    }
  });
}

function showCourseLimit(ccid) {
  if(typeof(CLASSLIST[ccid]) == 'undefined')
  {
    $('.card-allow-detail').html('').hide();
    return;
  }
  var cardTypeIdArr = CLASSLIST[ccid].cardTypeId;
  if (typeof(cardTypeIdArr) != 'undefined' && cardTypeIdArr.length) {
    var data = [];
    for (var i = 0; i < cardTypeIdArr.length; i++) {
      var cardTypeId = cardTypeIdArr[i];
      data.push(CardType.cardTypeList[cardTypeId]);
    }
    var html = Mustache.render($('#temp_card_allow_detail').html(), {item: data});
    $('.card-allow-detail').html(html).show();
  } else {
    $('.card-allow-detail').html('').hide();
  }
}

function coursetablePanel(isOpen, defaultData) {
  if (isOpen == true) {
    $('.calendar-holder').css('right', 380);
    $('.event-detail-panel').css('right', 0);
    console.log(window)
    console.log(window.courseDetail)

    window.courseDetail(defaultData)

    return;
    if(defaultData.reversible == 1){
      $('input[name=book_min_count]').parent().parent().removeClass('hidden');
    }else{
      $('input[name=book_min_count]').parent().parent().addClass('hidden');
    }
    $('#class').off('change.hxe').on('change.hxe', null, function () {
      showCourseLimit($(this).val());
      var len = CoursetableHistory.getClass(parseInt($(this).val()));
      if (len == false) {
        len = 60;
      }
      updateClassStartEndTime(defaultData.curdate, len);
    });
    $('div[name=classroom] button').click(function () {
      $(this).parent().find('button').removeClass('btn-success').addClass('btn-default');
      $(this).addClass('btn-success');
      var bookMaxCount = CoursetableHistory.getClassroom($(this).data('id'));
      if (bookMaxCount != false) {
        bookMaxCountSelect(bookMaxCount);
      }
    });
    $('div[name=classtype] button').click(function () {
      $(this).parent().find('button').removeClass('btn-success').addClass('btn-default');
      $(this).addClass('btn-success');
    });
    $('div[name=classreversible] button').click(function () {
      $(this).parent().find('button').removeClass('btn-success').addClass('btn-default');
      $(this).addClass('btn-success');
      if($(this).data('type') == 1){
        $('input[name=book_min_count]').parent().parent().removeClass('hidden');
      }else{
        $('input[name=book_min_count]').parent().parent().addClass('hidden');
        $('input[name=book_min_count]').val(0);
      }
    });
    var countHistory = CoursetableHistory.getBookMaxCountList();
    var $tmp = $('select[name=book_max_count]').selectize({
      create: true,
      valueField: 'id',
      labelField: 'title',
      searchField: 'title',
      sortField: 'title',
      maxItems: 1
    });
    g_bookmaxcount_selectize = $tmp[0].selectize;
    g_bookmaxcount_selectize.clear(true);
    for (var i = 0; i < countHistory.length; i++) {
      var val = countHistory[i];
      var val = $.isNumeric(val) ? parseInt(val) : val;
      g_bookmaxcount_selectize.addOption({id: val, title: val + '人'});
    }
    g_bookmaxcount_selectize.addItem(20, true);
    if (typeof(defaultData) != 'undefined') {
      setCoursetablePanelDefaultData(defaultData);
    }
    $('#coursetime input[name=starttime]').off('change').change(function(){
      var len = 60;
      var curdate = $(this).timepicker('getTime');

      var hours = curdate.getHours();
      var minutes = curdate.getMinutes();
      defaultData.curdate.setHours(hours);
      defaultData.curdate.setMinutes(minutes);
      updateClassStartEndTime(defaultData.curdate, len);
    })
    $('#course_form').find('button[name=form_class_del]').off('click').click(function (e) {
      var ctid = $(e.currentTarget).parent().find('input[name=ctid]').val();
      var eventId = $(e.currentTarget).parent().find('input[name=eventid]').val();
      if ($.isNumeric(ctid) && confirm('确认删除?')) {
        $.post(HXE_DOMAIN + '/api/coursetable/del', {
          ids: ctid,
          cid: COMPANY_ID
        }, function (data) {
          if (data.errNo == '100000') {
            alert('删除成功');
            g_coursetableCalendar.removeEventInfo(eventId);
            g_coursetableCalendar.render();
            coursetablePanel(false);
          } else {
            ResultAlert.open(data.errNo, data.errMsg);
          }
        });
      }
    });
  } else {
    $('#open-coursetable-btn').removeClass('.btn-success');
    $('.calendar-holder').css('right', 0);
    $('.event-detail-panel').css('right', -380);
    g_coursetableCalendar.clearSelectedClass();
  }
}

function updateClassStartEndTime(startDate, len) {
  $courseForm = $('#course_form');
  $courseForm.find('input[name=starttime]').timepicker('setTime',startDate);
  var endDate = new Date(startDate.getTime() + parseInt(len) * 60000);
  $courseForm.find('input[name=endtime]').timepicker('setTime',endDate);
  $courseForm.find('input[name=curday]').val(parseInt(startDate.getTime() / 1000));
}

function setCoursetablePanelDefaultData(defaultData) {
  $courseForm = $('#course_form');
  if (typeof(defaultData.starttime) != 'undefined') {
    defaultData.curdate = new Date();
    defaultData.curdate.setTime(parseInt(defaultData.starttime) * 1000);
  }

  if (typeof(defaultData.ccid) != 'undefined') {
    $courseForm.find('select[name=ccid]').selectpicker('val', defaultData.ccid);
  }
  if (typeof(defaultData.len) == 'undefined') {
    var ccid = $courseForm.find('select[name=ccid]').val();
    var len = CoursetableHistory.getClass(parseInt(ccid));
    if (len == false) {
      len = 60;
    }
    updateClassStartEndTime(defaultData.curdate, len);
  } else {
    updateClassStartEndTime(defaultData.curdate, defaultData.len);
  }


  showCourseLimit($courseForm.find('select[name=ccid]').val());

  if (typeof(defaultData.ctid) == 'undefined') {
    $courseForm.find('input[name=ctid]').val('');
    $courseForm.find('button[name=form_class_del]').hide();
  } else {
    $courseForm.find('input[name=ctid]').val(defaultData.ctid);
    $courseForm.find('button[name=form_class_del]').show();
  }

  if (typeof(defaultData.classroom_id) == 'undefined') {
    $courseForm.find('div[name=classroom] button').removeClass('btn-success').addClass('btn-default');
  } else {
    $courseForm.find('div[name=classroom] button[class~=btn-success]').removeClass('btn-success').addClass('btn-default');
    $courseForm.find('div[name=classroom] button[data-id=' + defaultData.classroom_id + ']').removeClass('btn-default').addClass('btn-success');
  }

  if (typeof(defaultData.course_type) != 'undefined') {
    $courseForm.find('div[name=classtype] button[class~=btn-success]').removeClass('btn-success').addClass('btn-default');
    $courseForm.find('div[name=classtype] button[data-type=' + defaultData.course_type + ']').removeClass('btn-default').addClass('btn-success');
  }

  if (typeof(defaultData.reversible) != 'undefined') {
    $courseForm.find('div[name=classreversible] button[class~=btn-success]').removeClass('btn-success').addClass('btn-default');
    $courseForm.find('div[name=classreversible] button[data-type=' + defaultData.reversible + ']').removeClass('btn-default').addClass('btn-success');
  }

  if (typeof(defaultData.book_min_count) != 'undefined') {
    $courseForm.find('input[name=book_min_count]').val(defaultData.book_min_count);
  }

  if (typeof(defaultData.coach_id) != 'undefined') {
    $courseForm.find('select[name=coach_id]').selectpicker('val', defaultData.coach_id);
  }

  if (typeof(defaultData.clid) == 'undefined') {
    $courseForm.find('select[name=clid]').selectpicker('val', '');
  } else {
    $courseForm.find('select[name=clid]').selectpicker('val', defaultData.clid);
  }

  if (typeof(defaultData.eventId) == 'undefined') {
    $courseForm.find('input[name=eventid]').val('');
  } else {
    $courseForm.find('input[name=eventid]').val(defaultData.eventId);
  }

  if (typeof(defaultData.book_max_count) != 'undefined') {
    bookMaxCountSelect(defaultData.book_max_count);
  }

}

function bookMaxCountSelect(bookMaxCount) {
  g_bookmaxcount_selectize.addOption({id: bookMaxCount, title: bookMaxCount + '人'});
  g_bookmaxcount_selectize.clear(true);
  g_bookmaxcount_selectize.addItem(bookMaxCount, true);
}
function addClassFormCheck() {
  $form = $('#course_form');
  $classInput = $form.find('select[id=class]');
  $coachSelect = $form.find('select[id=coach]');
  $startime = $form.find('input[name=starttime]');
  var ccid = $classInput.val();
  var start = $form.find('input[name=starttime]').val();
  var eventid = $form.find('input[name=eventid]').val();
  var ctid = $form.find('input[name=ctid]').val();
  var end = $form.find('input[name=endtime]').val();
  var book_max_count = $form.find('select[name=book_max_count]').val().replace('人', '');
  book_max_count = (book_max_count == '不限') ? 0 : book_max_count;
  var classroom_id = $form.find('button[class~=classroom-select-btn][class~=btn-success]').data('id');
  var course_type = $form.find('button[class~=classtype-select-btn][class~=btn-success]').data('type');
  var reversible = $form.find('button[class~=classcancel-select-btn][class~=btn-success]').data('type');
  var book_min_count = $form.find('input[name=book_min_count]').val();
  var coach_id = $coachSelect.val();
  var curday = $form.find('input[name=curday]').val();
  var clid = $form.find('select[name=clid]').val();
  var len = 0;

  $form.find('[class~=has-error]').removeClass("has-error");
  do {
    if(!$.isNumeric(ccid) || !ccid){
      $form.find('select[name=ccid]').parent().parent().addClass("has-error");
      break;
    }
    if (!$.isNumeric(clid) || !clid) {
      $form.find('select[name=clid]').parent().parent().addClass("has-error");
      break;
    }
    if (start.length && end.length) {
      var startArr = start.split(':');
      var endArr = end.split(':');
      len = (parseInt(endArr[0]) * 60 + parseInt(endArr[1])) - (parseInt(startArr[0]) * 60 + parseInt(startArr[1]));
      if (!len) {
        $startime.parent().parent().addClass('has-error');
        break;
      }
    } else {
      $startime.parent().parent().addClass('has-error');
      break;
    }

    if (!$.isNumeric(classroom_id)) {
      $form.find('div[name=classroom]').parent().addClass('has-error');
      break;
    }

    if (!$.isNumeric(course_type)) {
      $form.find('div[name=classtype]').parent().addClass('has-error');
      break;
    }

    if (!$.isNumeric(reversible)) {
      $form.find('div[name=classreversible]').parent().addClass('has-error');
      break;
    }

    if (!$.isNumeric(coach_id)) {
      $form.find('select[id=coach]').parent().parent().addClass('has-error');
      break;
    }

    if (!$.isNumeric(book_max_count)) {
      $(this).parent().addClass("has-error");
      break;
    }

    if (!$.isNumeric(book_min_count) || parseInt(book_min_count) > parseInt(book_max_count)) {
      $form.find('div[name=classlimit]').parent().addClass('has-error');
      break;
    }

    if (!$.isNumeric(curday)) {
      alert('请点选左面选择时间');
      break;
    }

    if (ctid.length && !$.isNumeric(ctid)) {
      alert('数据异常,请刷新后操作');
    }

    return {
      ccid: ccid,
      curday: curday,
      starttime: start,
      classroom_id: classroom_id,
      course_type: course_type,
      reversible: reversible,
      book_min_count: book_min_count,
      len: len,
      clid: clid,
      ctid: ctid,
      coach_id: coach_id,
      book_max_count: parseInt(book_max_count),
      eventid: eventid
    };
  } while (false);
  return false;
}

function updateLeftFilterPanel(data) {
  $leftFiter = $('.calendar-filter-view');
  $leftFiter.find('[class~=project-list] li:not([class~=all-projects])').remove();
  $leftFiter.find('[class~=member-list] li:not([class~=all-members])').remove();
  $leftFiter.find('[class~=course-list] li:not([class~=all-courses])').remove();
  if (typeof(data.classroom) != 'undefined') {
    var html = '';
    for (var i in data.classroom) {
      html += '<li class="project-item cursor selected" data-id="' + i + '"><span class="project-name">' + data.classroom[i] + '</span></li>';
    }
    $leftFiter.find('[class~=project-list]').append(html);
  }

  if (typeof(data.coach) != 'undefined') {
    var html = '';
    for (var i in data.coach) {
      html += '<li class="member-item cursor selected " data-id="' + i + '"> <span class="avatar img-circle img-24 no-avatar"></span> <span class="member-name">' + data.coach[i] + '</span></li>';
    }
    $leftFiter.find('[class~=member-list]').append(html);
  }

  if (typeof(data.course) != 'undefined') {
    var html = '';
    var courseData = [];
    for (var i in data.course) {
      courseData.push({ccid: i, course_name: data.course[i]});
    }

    console.log('data',data)
    console.log('courseData',courseData)
    var html = Mustache.render($('#temp_filter_course').html(), {item: courseData});
    $leftFiter.find('[class~=course-list]').append(html);
  }

  //左侧栏点击筛选
  $leftFiter.find('li').off('click').click(function () {
    console.log('hahah')
    if ($(this).is('[data-id]')) {
      $(this).is('[class~=selected]') ? $(this).removeClass('selected') : $(this).addClass('selected');
    } else {
      $(this).parent().children().addClass('selected');
      $(this).removeClass('selected');
    }
    var classRoomArr = [];
    var coachArr = [];
    var classArr = [];
    $leftFiter.find('[class~=project-item][class~=selected]').each(function () {
      classRoomArr.push($(this).data('id'));
    });
    $leftFiter.find('[class~=member-item][class~=selected]').each(function () {
      coachArr.push($(this).data('id'));
    });
    $leftFiter.find('[class~=course-item][class~=selected]').each(function () {
      classArr.push($(this).data('id'));
    });
    g_coursetableCalendar.filter(classRoomArr, coachArr, classArr);
  })
}

function CoursetableHistory() {
}
/**
 * 将数据缓存到localstorage,{type:{subType:1..}}
 * @param key
 * @param type
 * @param subType
 * @returns {*}
 */
CoursetableHistory.write = function (key, type, subType) {
  var key = LocalStorageKey.getKey('coursetable', key);
  var data = store.get(key);
  if (typeof(data) == 'object') {
    if (typeof(data[type]) == 'object') {
      if (typeof(data[type][subType]) == 'object') {
        data[type][subType] += 1;
      } else {
        data[type][subType] = 1;
      }
    } else {
      data[type] = {};
      data[type][subType] = 1;
    }
  } else {
    data = {};
    data[type] = {};
    data[type][subType] = 1;
  }
  return store.set(key, data);
}

/**
 * 获取最常用的
 * @param key
 * @param type
 * @param subType
 * @return false 说明不存在记录,
 */
CoursetableHistory.getMostUse = function (key, type) {
  var key = LocalStorageKey.getKey('coursetable', key);
  var data = store.get(key);
  if (typeof(data) != 'object')
    return false;

  if (typeof(data[type]) != 'object')
    return false;

  var maxVal = 0;
  var maxKey;
  for (var i in data[type]) {
    if (maxVal <= data[type][i]) {
      maxVal = data[type][i];
      maxKey = i;
    }
  }

  return maxKey;
}

CoursetableHistory.saveClass = function (ccid, timeLen) {
  CoursetableHistory.write('history_class', ccid, timeLen);
}
CoursetableHistory.getClass = function (ccid) {
  return CoursetableHistory.getMostUse('history_class', ccid);
}
CoursetableHistory.saveClassroom = function (classroomId, pepoleLimitNum) {
  CoursetableHistory.write('history_classroom', classroomId, pepoleLimitNum);
}
CoursetableHistory.getClassroom = function (classroomId) {
  return CoursetableHistory.getMostUse('history_classroom', classroomId);
}
CoursetableHistory.saveBookMaxCount = function (bookMaxCount) {
  if (!$.isNumeric(bookMaxCount))return;
  bookMaxCount = parseInt(bookMaxCount);
  var key = LocalStorageKey.getKey('coursetable', 'book_max_count');
  var countHistory = store.get(key);
  if ($.isArray(countHistory)) {
    if (countHistory.indexOf(bookMaxCount) < 0)countHistory.push(bookMaxCount);
  } else {
    countHistory = [bookMaxCount];
  }
  store.set(key, countHistory);
}
CoursetableHistory.getBookMaxCountList = function () {
  var baseCount = [10, 15, 20, 24, '不限'];
  var key = LocalStorageKey.getKey('coursetable', 'book_max_count');
  var countHistory = store.get(key);
  if ($.isArray(countHistory)) {
    return $.isArray(countHistory) ? _.uniq(countHistory.concat(baseCount), true) : baseCount;
  } else {
    return baseCount;
  }
}

//更新课程调用此函数
function publicUpdateCoursetableCallback(data) {
  g_coursetableCalendar.removeSelectTip();
  var eventInfo = new EventInfo(data.courseList, EventInfo.TYPE_EVENT_DEFAULT);
  g_coursetableCalendar.updateEventInfo(eventInfo);
  g_coursetableCalendar.render();
  coursetablePanel(false);
}
//删除课程调用此函数
function publicDelCoursetableCallback(eventId) {
  g_coursetableCalendar.removeEventInfo(eventId);
  g_coursetableCalendar.render();
  coursetablePanel(false);
}

function InitCoursetable(companyId, cardTypeList, classList) {
  console.log('companyId',companyId)
  cardTypeList = []
  classList = []

  // cardTypeList = [{
  //   "id": "1700",
  //   "name": "\u5e74\u53612998",
  //   "rule": {
  //     "ccid": [{
  //       "courseId": "2",
  //       "courseName": "\u5357\u4eac\u661f\u6829\u6587\u5316BOSS"
  //     }]
  //   },
  //   "originalRule": {
  //     "5": ["2"]
  //   }
  // }, {
  //   "id": "1701",
  //   "name": "\u5e74\u53612999",
  //   "rule": {
  //     "ccid": [{
  //       "courseId": "2",
  //       "courseName": "\u5357\u4eac\u661f\u6829\u6587\u5316BOSS"
  //     }]
  //   },
  //   "originalRule": {
  //     "5": ["2"]
  //   }
  // }, {
  //   "id": "1702",
  //   "name": "\u5e74\u53613000",
  //   "rule": {
  //     "ccid": [{
  //       "courseId": "2",
  //       "courseName": "\u5357\u4eac\u661f\u6829\u6587\u5316BOSS"
  //     }]
  //   },
  //   "originalRule": {
  //     "5": ["2"]
  //   }
  // }, {
  //   "id": "1703",
  //   "name": "20\u6b21\u5361",
  //   "rule": [],
  //   "originalRule": false
  // }]
  //
  // classList = [{
  //   "ccid": "2",
  //   "name": "\u5357\u4eac\u661f\u6829\u6587\u5316BOSS",
  //   "cid": "100003",
  //   "content": "",
  //   "course_id": "2147483647",
  //   "type": "0",
  //   "status": "0",
  //   "create_time": "1566008593",
  //   "course_type": "0",
  //   "book_min_count": "0",
  //   "reversible": "0",
  //   "cardTypeId": ["1700", "1701", "1702"]
  // }]



  COMPANY_ID = companyId;
  //CardType.parseRule(cardTypeList);
  g_curday = new Date();
  g_coursetableCalendar = new CoursetableCalendar();
  g_coursetableCalendar.render();
  g_coursetableCalendar.on('e.clickAddNew', function (data) {
    coursetablePanel(true, data);
  });
  g_coursetableCalendar.on('e.clickEvent', function (data) {
    console.log('点击打开右侧栏！')
    coursetablePanel(true, data);
  });
  g_coursetableCalendar.on('e.filterChange', function (data) {
    updateLeftFilterPanel(data);
  });
  g_coursetableCalendar.on('e.closeEvent', function (data) {
    coursetablePanel(false);
  });


  for (var i in classList) {
    CLASSLIST[classList[i].ccid] = classList[i];
  }

  $("#add_class").click(function () {
    loadCourseList(cardTypeList);
  });

  openWeekView();
  $('.calendar-filter-toggle').click(function () {
    console.log('打开左侧栏筛选')
    var left = $('.calendar-week-view').css('left').replace('px', '');
    if (left == 0) {
      $('.calendar-week-view').css('left', 160);
      $('.calendar-filter-view').css('left', 0);
    } else {
      coursetablePanel(false);
      g_coursetableCalendar.removeSelectTip();
      $('.calendar-week-view').css('left', 0);
      $('.calendar-filter-view').css('left', -160);
    }
  });

  $('.month-or-week-mode-switcher a').click(function () {
    if ($(this).is(".active"))return;
    if ($(this).is(":first-child")) {
      $('.calendar-month-view').remove();
      openWeekView();
      $(this).addClass('active');
      $(this).next().removeClass('active');
    } else {
      $('.calendar-week-view').remove();
      openMonthView();
      $(this).addClass('active');
      $(this).prev().removeClass('active');
    }
  });

  $('#show-preweek-btn').click(function () {
    var com = confirm('确认要将上周的所有课程全部复制到本周吗？');
    if ($(this).is('.btn-default') && com) {
      $('#show-preweek-btn').html('复制中。。。').attr('disabled',true);
      g_coursetableCalendar.removeSelectTip();
      var weekInfo = Util.getPreviousWeek(g_curday);

      var start_time = parseInt(weekInfo.monday.getTime() / 1000);
      var end_time = parseInt(weekInfo.sunday.getTime() / 1000);

      $.post(HXE_DOMAIN + '/api/coursetable/getlist?XDEBUG_SESSION_START=PHPSTORM', {
        start_time: start_time,
        end_time: end_time,
        cid: COMPANY_ID
      }, function (data) {
        if (data.errNo == 100000) {
          var param = [];
          for (var i in data.data) {
            if (data.data[i].status == '-1')continue;
            var newData = data.data[i];
            var date = new Date();
            date.setTime(parseInt(newData.starttime) * 1000 + 7 * 86400000)
            var curday = parseInt(date.getTime() / 1000);
            var hours = date.getHours();
            var minutes = date.getMinutes();
            if(parseInt(minutes) < 10){
              minutes = '0' + minutes;
            }
            newData.starttime = hours + ':' + minutes;
            var tempObj = {};
            tempObj.ccid = newData.ccid;
            tempObj.curday = curday;
            tempObj.starttime = newData.starttime; //时间应该是14:12
            tempObj.classroom_id = newData.classroom_id;
            tempObj.course_type = newData.course_type;
            tempObj.reversible = newData.reversible;
            tempObj.book_min_count = newData.book_min_count;
            tempObj.len = newData.len;
            tempObj.clid =  newData.clid;
            tempObj.coach_id = newData.coach_id;
            tempObj.book_max_count = newData.book_max_count;
            tempObj.eventid = newData.eventid;
            param.push(tempObj);
          }
          var data = {};
          data.course = param;
          var curday = data.course[0].curday;
          var weekday = Util.getWeek(curday);
          $.post(HXE_DOMAIN + '/api/coursetable/many/add', data, function (res) {
            if(res.errNo == 100000){
              alert('复制成功！');
              var curday = data.course[0].curday;
              var weekday = Util.getWeek(curday);
              curday = new Date(parseInt(curday) * 1000);
              $('#show-preweek-btn').removeClass('btn-success').addClass('btn-default');
              reloadWeekData(curday, weekday.monday, weekday.sunday);
            }
          })
        } else {
          ResultAlert(data.errNo, data.errMsg);
        }
        $('#show-preweek-btn').html('复制上周课程').removeAttr('disabled',true);
      });
      $(this).removeClass('btn-default').addClass('btn-success');
    } else {
      coursetablePanel(false);
      g_coursetableCalendar.removeExampleEventInfo();
      g_coursetableCalendar.render();
      $(this).removeClass('btn-success').addClass('btn-default');
    }
  });
  $('#open-coursetable-btn').click(function () {
    if ($(this).is('.btn-default')) {
      g_coursetableCalendar.showSelectTip();
      $(this).removeClass('btn-default').addClass('btn-success');
    } else {
      coursetablePanel(false);
      g_coursetableCalendar.removeSelectTip();
      $(this).removeClass('btn-success').addClass('btn-default');
    }
  });

  $('#add_level').click(function () {
    loadLevel();
  });
  $('#add_coach').click(function () {
    loadCoach();
  });

  //右侧栏上课时间范围
  // $('#coursetime input[name=starttime]').timepicker({
  //   'step': 5, 'timeFormat': 'H:i', 'minTime': '07:00', 'maxTime': '22:00', show2400: true, durationTime: 60
  // });
  // $('#coursetime input[name=endtime]').timepicker({
  //   'step': 5, 'timeFormat': 'H:i', 'minTime': '07:00', 'maxTime': '22:00', show2400: true, durationTime: 60
  // });

  $('#form_add_class').click(function (event) {
    var params = addClassFormCheck();
    if (params != false) {
      if (typeof(params.ctid) == 'undefined' || params.ctid.length == 0) {
        $.post(HXE_DOMAIN + '/api/coursetable/add', params, function (data) {
          if (data.errNo == '100000') {
            alert('操作成功');
            $('#open-coursetable-btn').removeClass('btn-success');
            g_coursetableCalendar.removeSelectTip();
            var eventInfo = new EventInfo(data.courseList[0], EventInfo.TYPE_EVENT_DEFAULT);
            g_coursetableCalendar.addEventInfo(eventInfo);
            g_coursetableCalendar.removeEventInfo(params.eventid);
            g_coursetableCalendar.render();
            coursetablePanel(false);
          } else {
            ResultAlert.open(data.errNo, data.errMsg);
          }
        });
      } else {
        $.post(HXE_DOMAIN + '/api/coursetable/update', params, function (data) {
          if (data.errNo == '100000') {
            alert('操作成功');
            $('#open-coursetable-btn').removeClass('btn-success');
            g_coursetableCalendar.removeSelectTip();
            var eventInfo = new EventInfo(data.courseList, EventInfo.TYPE_EVENT_DEFAULT);
            g_coursetableCalendar.updateEventInfo(eventInfo);
            g_coursetableCalendar.render();
            coursetablePanel(false);
          } else {
            ResultAlert.open(data.errNo, data.errMsg);
          }
        });
      }
      CoursetableHistory.saveClass(params.ccid, params.len);
      CoursetableHistory.saveClassroom(params.classroom_id, params.book_max_count);
      CoursetableHistory.saveBookMaxCount(params.book_max_count);
    }
  });


  $('input[name=len],input[name=book_max_count]').click(function () {
    $(this).val('');
  });

  $('div[name=len_quick] button').click(function () {
    $('input[name=len]').val($(this).data('val'));
  });

  $('div[name=book_max_count_quick] button').click(function () {
    $('input[name=book_max_count]').val($(this).data('val'));
  });


  //reloadWeekData(g_curday,Util.getWeekMonday(g_curday),Util.getWeekSunday(g_curday));
  $('div[class~=btn-calendar] a').click(function () {
    console.log('点击上下周切换')
    var newWeek;
    if ($(this).is('[class~=next]')) {
      newWeek = Util.getNextWeek(g_curday);
    } else {
      newWeek = Util.getPreviousWeek(g_curday);
    }
    g_curday = newWeek.curday;
    reloadWeekData(g_curday, newWeek.monday, newWeek.sunday);
    coursetablePanel(false);
    $('#open-coursetable-btn').removeClass('btn-success');
    $('#show-preweek-btn').removeClass('btn-success').addClass('btn-default');
  })
}
