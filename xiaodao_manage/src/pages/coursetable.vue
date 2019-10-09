<template>
  <div class="coursetableContainer">
    <div class="calendar-view">
      <div class="calendar-header-view">
        <div class="filter-toggler-wrapper">
          <a class="btn-calendar calendar-filter-toggle cursor"> <Icon type="ios-options" style="font-size: 18px" /> </a>

          <div class="move btn-group btn-calendar">
            <a class="prev btn cursor" style="position: relative;top: -12px;left: 2px"><Icon type="ios-arrow-back" style="font-size: 18px" /></a>
            <a class="next btn cursor" style="position: relative;top: -12px;right: 2px;"><Icon type="ios-arrow-forward" style="font-size: 18px" /> </a>
          </div>

          <div v-if="false" class="btn-group btn-addcalendar">
            <button type="button" class="btn btn-default" id="open-coursetable-btn">添课</button>
            <button type="button" class="btn btn-default" id="show-preweek-btn">复制上周课程</button>
          </div>

        </div>
        <div class="current-day"></div>
      </div>
      <div class="calendar-holder card">
        <div class="calendar-filter-view">

          <div class="calendar-filter-inner">
            <div class="calendar-filter-wrapper projects-wrapper thin-scroll" style="height:20%">
              <ul class="project-list list-underscore thin-scroll">
                <li class="project-item all-projects cursor"><span>所有教室</span>
                </li>
              </ul>
            </div>
            <div class="calendar-filter-wrapper members-wrapper thin-scroll" style="top:20%;height:40%;">
              <ul class="member-list thin-scroll">
                <li class="member-item all-members cursor"><span>所有老师</span>
                </li>
              </ul>
            </div>
            <div class="calendar-filter-wrapper courses-wrapper thin-scroll" style="top:60%;">
              <ul class="course-list thin-scroll">
                <li class="course-item all-courses cursor"><span>所有课程</span></li>
              </ul>
            </div>
          </div>

        </div>
        <div class="calendar-week-view" style="left: 0px">
          <div class="calendar-week-inner">
            <div class="calendar-week-header">
              <div class="week-title">
                <div class="title"></div>
                <div class="title"></div>
                <div class="title"></div>
                <div class="title"></div>
                <div class="title"></div>
                <div class="title"></div>
                <div class="title"></div>
              </div>
            </div>
            <div class="gap">
              <div class="toggle-height"></div>
            </div>
            <div class="week-time thin-scroll" style="height: 391px;">
              <div class="left-side thin-scroll">
              </div>
              <!--event展示-->
              <div class="day-hours thin-scroll" style="height: 900px;">
                <div class="day-col-wrapper current">
                  <div class="day-col"></div>
                </div>
                <div class="day-col-wrapper">
                  <div class="day-col">
                    <div class="event event-default" data-event-id="628ad4517" data-ctid="6" data-clid="1"
                         data-startday="20191008" data-type="1" data-ccid="2" data-coach_id="17165"
                         data-classroom_id="1" data-course_type="0" data-reversible="0" data-book_max_count="20"
                         data-book_min_count="0" data-starttime="1570496400" data-len="60"
                         style="left:0%;top:120px;height:56px;width:100%;">
                      <div class="content-wrapper" style="border-left: 2px solid #f5d795;">
                        <div class="content">南京星栩文化BOSS(张教练)</div>
                        <div class="time">9:0~10:0</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="day-col-wrapper">
                  <div class="day-col"></div>
                </div>
                <div class="day-col-wrapper">
                  <div class="day-col"></div>
                </div>
                <div class="day-col-wrapper">
                  <div class="day-col"></div>
                </div>
                <div class="day-col-wrapper">
                  <div class="day-col"></div>
                </div>
                <div class="day-col-wrapper">
                  <div class="day-col"></div>
                </div>
              </div>
              <div class="day-lines thin-scroll" style="height: 900px;">
                <div class="vertical-line"></div>
                <div class="vertical-line"></div>
                <div class="vertical-line"></div>
                <div class="vertical-line"></div>
                <div class="vertical-line"></div>
                <div class="vertical-line"></div>
                <div class="vertical-line"></div>
              </div>
              <div class="hour-lines thin-scroll" style="height: 900px;">
                <div class="hour-line" data-hour="7"></div>
                <div class="hour-line" data-hour="8"></div>
                <div class="hour-line" data-hour="9"></div>
                <div class="hour-line" data-hour="10"></div>
                <div class="hour-line" data-hour="11"></div>
                <div class="hour-line" data-hour="12"></div>
                <div class="hour-line" data-hour="13"></div>
                <div class="hour-line" data-hour="14"></div>
                <div class="hour-line" data-hour="15"></div>
                <div class="hour-line" data-hour="16"></div>
                <div class="hour-line" data-hour="17"></div>
                <div class="hour-line" data-hour="18"></div>
                <div class="hour-line" data-hour="19"></div>
                <div class="hour-line" data-hour="20"></div>
                <div class="hour-line" data-hour="21"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="event-detail-panel panel-view">
        <div class="panel-layer panel-layer-1">
          <div class="event-detail toggler-parent fade thin-scroll in">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="60" class="mt20">
              <Row>
                <Col span="22">
                <FormItem label="课程">
                  <Input v-model="formValidate.course_name" disabled placeholder=""></Input>
                </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span="22">
                <FormItem label="时间" prop="course_time">
                  <TimePicker :value="formValidate.course_time" format="HH:mm" type="timerange" @on-change="formValidate.course_time=$event"
                              confirm hide-disabled-options
                              :disabled-hours="[0,1,2,3,4,5,6]" :steps="[1, 5, 1]" placement="bottom-end"
                              placeholder="请选择上课时间" style="width: 100%"></TimePicker>
                </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span="22">
                <FormItem label="老师" prop="teacher_mid">
                  <Select v-model="formValidate.teacher_mid">
                    <Option v-for="item in teacherList" :value="item.mid" :key="item.mid">{{ item.uname }}</Option>
                  </Select>
                </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span="22">
                <FormItem label="教室" prop="classroom_id">
                  <Select v-model="formValidate.classroom_id" clearable>
                    <Option v-for="item in classroomList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                  </Select>
                </FormItem>
                </Col>
              </Row>

              <Row class="mt20">
                <Col span="22">
                <FormItem>
                  <Button type="default" style="width: 100px" @click="handleSubmit('formValidate')">保存</Button>
                  <Button type="error" style="margin-left: 8px" @click="handleDel">删除</Button>
                </FormItem>
                </Col>
              </Row>

            </Form>

            <form v-if="false" class="form-horizontal" id="course_form">
              <section class="detail-content scrollable thin-scroll">
                <div class="event-detail-infos-wrap">
                  <div class="form-group">
                    <label class="col-sm-2 control-label">课程</label>

                    <div class="col-sm-10">
                      <div class="btn-group bootstrap-select show-tick">
                        <button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown"
                                data-id="class" title="--请选择课程--"><span class="filter-option pull-left">--请选择课程--</span>&nbsp;<span
                          class="bs-caret"><span class="caret"></span></span></button>


                        <div class="dropdown-menu open">
                          <ul class="dropdown-menu inner" role="menu">
                            <li data-original-index="1"><a tabindex="0" class="" style="" data-tokens="null"><span
                              class="text">南京星栩文化BOSS</span><span class="glyphicon glyphicon-ok check-mark"></span></a>
                            </li>
                          </ul>
                        </div>
                        <select class="selectpicker show-tick" id="class" name="ccid" title="--请选择课程--" tabindex="-98">
                          <option class="bs-title-option" value="">--请选择课程--</option>
                          <option value="2">南京星栩文化BOSS</option>
                        </select></div>
                      <span id="add_class" style="cursor:pointer" data-toggle="modal"
                            data-target="#coursetable-setting-panel">+</span>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-sm-2 control-label">时间</label>

                    <div class="col-sm-10">
                      <p id="coursetime">
                        <input type="text" class="form-control time start ui-timepicker-input"
                               style="display: inline-block;width: 40%" placeholder="课程起始时间" name="starttime"
                               autocomplete="off"> 到
                        <input type="text" class="form-control time end ui-timepicker-input"
                               style="display: inline-block;width: 40%" placeholder="课程结束时间" name="endtime"
                               autocomplete="off">
                      </p>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-sm-2 control-label">教室</label>

                    <div class="col-sm-10" name="classroom">
                      <button type="button" class="btn btn-default btn-sm classroom-select-btn" data-id="1">一号教室
                      </button>
                      <!--<i id="add_classroom" style="cursor:pointer" class="fa fa-plus"></i>-->
                    </div>
                  </div>
                  <div class="form-group hidden">
                    <label class="col-sm-2 control-label">类型</label>
                    <div class="col-sm-10" name="classtype">
                      <button type="button" class="btn btn-success btn-sm classtype-select-btn" data-type="0">预约课
                      </button>
                      <button type="button" class="btn btn-default btn-sm classtype-select-btn" data-type="1">非预约课
                      </button>
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-sm-2 control-label">标记</label>
                    <div class="col-sm-10" name="classreversible">
                      <button type="button" class="btn btn-default btn-sm classcancel-select-btn" data-type="1">课程可取消
                      </button>
                      <button type="button" class="btn btn-success btn-sm classcancel-select-btn" data-type="0">不可取消
                      </button>
                    </div>
                  </div>
                  <div class="form-group hidden">
                    <label class="col-sm-2 control-label">人限</label>
                    <div class="col-sm-10" name="classlimit">
                      <input type="num" name="book_min_count" value="0">人
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="coach" class="col-sm-2 control-label">教练</label>

                    <div class="col-sm-10">
                      <div class="btn-group bootstrap-select">
                        <button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown"
                                data-id="coach" title="--请选择教练--"><span class="filter-option pull-left">--请选择教练--</span>&nbsp;<span
                          class="bs-caret"><span class="caret"></span></span></button>
                        <div class="dropdown-menu open">
                          <div class="bs-searchbox"><input type="text" class="form-control" autocomplete="off"></div>
                          <ul class="dropdown-menu inner" role="menu">
                            <li data-original-index="1"><a tabindex="0" class="" style="" data-tokens="null"><span
                              class="text">张教练</span><span class="glyphicon glyphicon-ok check-mark"></span></a></li>
                          </ul>
                        </div>
                        <select class="selectpicker" data-live-search="true" id="coach" name="coach_id"
                                title="--请选择教练--" tabindex="-98">
                          <option class="bs-title-option" value="">--请选择教练--</option>
                          <option value="17165">张教练</option>
                        </select></div>
                      <span id="add_coach" style="cursor:pointer" data-toggle="modal"
                            data-target="#coursetable-setting-panel">+</span>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="coach" class="col-sm-2 control-label">等级</label>
                    <div class="col-sm-10">
                      <div class="btn-group bootstrap-select show-tick">
                        <button type="button" class="btn dropdown-toggle btn-default" data-toggle="dropdown"
                                data-id="level" title="--请选择等级--"><span class="filter-option pull-left">--请选择等级--</span>&nbsp;<span
                          class="bs-caret"><span class="caret"></span></span></button>
                        <div class="dropdown-menu open">
                          <ul class="dropdown-menu inner" role="menu">
                            <li data-original-index="1"><a tabindex="0" class="" style="" data-tokens="null"><span
                              class="text">不限制等级</span><span class="glyphicon glyphicon-ok check-mark"></span></a></li>
                            <li data-original-index="2"><a tabindex="0" class="" style="" data-tokens="null"><span
                              class="text">lv1</span><span class="glyphicon glyphicon-ok check-mark"></span></a></li>
                          </ul>
                        </div>
                        <select class="selectpicker show-tick" id="level" name="clid" title="--请选择等级--" tabindex="-98">
                          <option class="bs-title-option" value="">--请选择等级--</option>
                          <option value="0">不限制等级</option>
                          <option value="1">lv1</option>
                        </select></div>
                      <span id="add_level" style="cursor:pointer" data-toggle="modal"
                            data-target="#coursetable-setting-panel">+</span>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="coach" class="col-sm-2 control-label">容量</label>
                    <div class="col-sm-6">
                      <select name="book_max_count">
                      </select>
                    </div>
                  </div>
                  <div class="card-allow-detail">
                  </div>

                </div>
              </section>
              <footer class="activity-creator-wrapper">
                <div class="form-group">
                  <input type="hidden" name="eventid">
                  <input type="hidden" name="ctid">
                  <input type="hidden" name="curday">
                  <button type="button" class="btn btn-default" id="form_add_class">保存</button>
                  <button type="button" class="btn btn-danger" name="form_class_del">删除</button>
                </div>
              </footer>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import config from '@/assets/js/config/index.js'
  import lib from '@/assets/js/lib/index.js'

  export default {
    name: 'coursetable',
    data() {
      return {
        classroomList: [],
        teacherList: [],
        formValidate: {
          ctid: '',
          eventId: '',
          course_date: '',
          course_name: '',
          course_time: [],
        },
        ruleValidate: {}
      }
    },
    created() {
      window.courseDetail = this.courseDetail
      this.getTeacherList()
      this.getClassroomList()
    },
    mounted() {
      InitCoursetable(100021)


    },
    methods: {
      getTeacherList() {
        let submitData = {
          roles: [config.UserRole.ROLE_TEACHER]
        }
        let url = lib.getRequestUrl('/api/member/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          this.teacherList = res.data.member
        }).catch(error => {
          this.$Message.error(error.message);
        })
      },
      getClassroomList() {
        let submitData = {}
        let url = lib.getRequestUrl('/api/classroom/my', submitData)
        this.$http.get(url, {}).then(res => {
          this.classroomList = res.data.data
        }).catch(error => {
          this.$Message.error(error.message);
        })
      },


      courseDetail(data) {
        console.log('panel-hahaha',data)

        this.formValidate.ctid = data.ctid
        this.formValidate.eventId = data.eventId
        this.formValidate.course_date = data.course_date
        this.formValidate.course_name = data.course_name
        this.formValidate.course_time = [data.start_time, data.end_time]
        this.formValidate.teacher_mid = data.teacher_mid
        this.formValidate.classroom_id = data.classroom_id
      },

      handleSubmit(inventory) {
        this.$refs[inventory].validate((valid) => {
          if (valid) {
            this.updateCoursetableLoading = true
            let url, successMsg, errMsg
            let submitData = {
              ctid: this.formValidate.ctid,
              start_time: this.formValidate.course_time[0],
              end_time: this.formValidate.course_time[1],
              //course_date: this.formValidate.course_date,
              teacher_mid: this.formValidate.teacher_mid,
              //class_teacher_mid: this.formValidate.class_teacher_mid,
              //assist_teacher_mid: this.formValidate.assist_teacher_mid,
              classroom_id: this.formValidate.classroom_id,
            }

            if (this.formValidate.ctid) {
              url = '/api/coursetable/update'
              successMsg = '更新成功!'
              errMsg = '更新失败，'
            } else {
              url = '/api/coursetable/add'
              successMsg = '新添成功!'
              errMsg = '添加失败，'

              console.log('add-this.formValidate',this.formValidate)
              submitData.course_name = this.formValidate.course_name
              submitData.ccid = this.formValidate.ccid
              submitData.course_schedule_id = this.formValidate.course_schedule_id
              submitData.classes_id = this.formValidate.classes_id
            }

            this.$http.post(url, submitData).then(res => {
              this.$Message.success(successMsg)
              console.log('res',res)

              if(this.formValidate.ctid) {
                publicUpdateCoursetableCallback(res.data)
              }
            }).catch(error => {
              this.$Message.error(errMsg + error.message)
            })
          } else {
            this.$Message.error('请输入完整信息!');
          }
        })
      },
      handleDel() {
        let formValidate = this.formValidate
        this.$Modal.confirm({
          title: '删除',
          content: `确认删除${formValidate.course_date} ${formValidate.course_time[0]}的${formValidate.course_name}课程吗？`,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            let submitData = {
              ids: formValidate.ctid,
            }
            this.$http.post("/api/coursetable/del", submitData).then(res => {
              if(res) {
                this.$Message.success('删除成功!')
                publicDelCoursetableCallback(formValidate.eventId)
              }
            }).catch(error => {
              this.$Message.error(error.message)
            })
          },
          onCancel: () => {
          }
        })
      },
    },


  }
</script>

<style>


  body::-webkit-scrollbar {
    width: 12px
  }

  body::-webkit-scrollbar-track {
    border-left: 1px solid #a6a6a6;
    background: #d9d9d9
  }

  body::-webkit-scrollbar-thumb {
    background: #a6a6a6
  }

  body, h4, h5, li {
    line-height: 20px
  }

  .hint p, ol, p, ul {
    margin: 0;
    padding: 0;
  }

  li {
    list-style: none;
  }

  .card {
    border: 0;
    background-color: #fff;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    -webkit-box-shadow: rgba(0, 0, 0, .0470588) 0 2px 3px 0;
    box-shadow: rgba(0, 0, 0, .0470588) 0 2px 3px 0;
  }

  .thin-scroll::-webkit-scrollbar {
    width: 7px
  }

  .thin-scroll::-webkit-scrollbar-track {
    background-color: #d9d9d9;
    border-left: 2px solid transparent
  }

  .thin-scroll::-webkit-scrollbar-thumb {
    background-color: #a6a6a6;
    border-left: 2px solid transparent
  }

  .thin-scroll::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(0, 0, 0, .1)
  }

  .avatar {
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: center !important
  }

  .img-24 {
  . display: inline-block;
    width: 24px;
    height: 24px;
    background-size: 24px 24px;
    background-color: #eee;
  }

  .calendar-view {
    position: fixed;
    z-index: 51;
    top: 0px;
    /*left: 0;*/
    left: 179px;
    bottom: 0;
    width: calc(100% - 179px);
    background-color: rgba(238, 238, 238, .96)
  }

  .calendar-view .calendar-holder {
    position: absolute;
    overflow: hidden;
    top: 65px;
    left: 15px;
    right: 15px;
    bottom: 15px
  }

  .calendar-header-view {
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #d9d9d9;
    background-color: #eee;
    line-height: 50px;
    padding: 0 15px;
    position: relative;
    -webkit-user-select: none
  }

  .calendar-header-view .filter-toggler-wrapper {
    position: absolute
  }

  .calendar-header-view .btn {
    padding: 2px 12px;
    border: none;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0
  }

  .calendar-header-view .btn.active {
    color: #fff;
    background-color: #a6a6a6
  }

  .calendar-header-view .btn-calendar {
    color: #383838;
    height: 30px;
    background-color: #fff;
    margin-top: 10px;
    text-align: center;
    box-shadow: rgba(0, 0, 0, .16) 0 1px 0;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px
  }

  .calendar-header-view .btn-addcalendar {
    float: left;
    display: inline-block;
    margin-left: 20px;
    padding: 3px 0
  }

  .calendar-header-view .btn-addcalendar button {
    height: 30px;
    margin-top: 6px;
    text-align: center;
    margin-right: 10px;
  }

  .calendar-header-view .btn-calendar .btn:hover, .calendar-header-view .btn-calendar:hover:not(.active) {
    color: #03a9f4
  }

  .calendar-header-view .btn-calendar .btn:first-child {
    border-right: 1px solid rgba(0, 0, 0, .1)
  }

  .calendar-header-view .btn-calendar .btn:nth-child(2) {
    border-left: 1px solid rgba(0, 0, 0, .1)
  }

  .calendar-header-view .calendar-filter-toggle {
    color: grey;
    float: left;
    width: 30px;
    line-height: 32px
  }

  .calendar-header-view .today {
    float: left;
    min-width: 70px;
    margin-left: 20px;
    line-height: 28px
  }

  .calendar-header-view .current-day {
    font-size: 18px;
    min-width: 160px;
    text-align: center
  }

  .calendar-header-view .move {
    float: left;
    display: inline-block;
    margin-left: 20px;
    padding: 3px 0
  }

  .calendar-header-view .move .btn {
    color: grey
  }

  .calendar-header-view .move .btn:hover {
    color: #03a9f4
  }

  .calendar-header-view .move .icon {
    font-size: 12px
  }

  .calendar-header-view .right-navigation {
    position: absolute;
    display: inline-block;
    right: 15px;
    top: 0
  }

  .calendar-header-view .right-navigation .month-or-week-mode-switcher {
    float: left;
    display: inline-block
  }

  .calendar-header-view .right-navigation .month-or-week-mode-switcher .btn {
    border: none;
    margin: 0;
    color: #383838;
    min-width: 70px;
    line-height: 28px;
    height: 30px
  }

  .calendar-header-view .right-navigation .month-or-week-mode-switcher .btn.active {
    color: #fff
  }

  .calendar-header-view .right-navigation .month-or-week-mode-switcher .btn:hover:not(.active) {
    color: #03a9f4
  }

  .calendar-view .calendar-holder {
    position: absolute;
    overflow: hidden;
    top: 65px;
    left: 15px;
    right: 15px;
    bottom: 15px
  }

  .calendar-filter-view {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 160px;
    border-right: 1px solid rgba(0, 0, 0, .1);
    -webkit-user-select: none;
    user-select: none;
    -webkit-transition: left 327ms ease;
    -o-transition: left 327ms ease;
    transition: left 327ms ease;
    left: -160px;
  }

  .calendar-filter-view .calendar-filter-inner {
    position: absolute;
    top: 0px;
    left: 0;
    right: 0;
    bottom: 10px
  }

  .calendar-filter-view .search-form {
    padding: 20px 20px 10px
  }

  .calendar-filter-view .search-form .search-project-or-member {
    height: 30px;
    line-height: 18px;
    padding: 4px 12px
  }

  .calendar-filter-view .calendar-filter-wrapper {
    border-bottom: 1px solid rgba(0, 0, 0, .07)
  }

  .calendar-filter-view .projects-wrapper {
    height: 50%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    overflow-y: auto
  }

  .calendar-filter-view .projects-wrapper .project-list {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch
  }

  .calendar-filter-view .projects-wrapper .group-name {
    padding: 15px 15px 5px
  }

  .calendar-filter-view .projects-wrapper .project-item {
    margin-left: 20px;
    line-height: 36px;
  }

  .calendar-filter-view .projects-wrapper .project-item.selected {
    position: relative
  }

  .calendar-filter-view .projects-wrapper .project-item.active {
    background-color: #f5f5f5;
    font-weight: 700
  }

  .calendar-filter-view .projects-wrapper .project-item .icon {
    font-size: 18px;
    width: 24px;
    height: 24px;
    text-align: center;
    color: #a6a6a6;
    margin-right: 10px;
    float: left
  }

  .calendar-filter-view .projects-wrapper .project-item .project-logo {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    background-color: #74bbd8;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px
  }

  .calendar-filter-view .projects-wrapper .project-item a {
    display: block;
    padding: 6px 50px 6px 20px;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #383838
  }

  .calendar-filter-view .projects-wrapper .project-item a:hover {
    background-color: #f5f5f5;
    text-decoration: none;
    color: #737373
  }

  .calendar-filter-view .members-wrapper {
    position: absolute;
    top: 20%;
    left: 0;
    right: 0;
    height: 50%;
    overflow-y: auto
  }

  .calendar-filter-view .members-wrapper .member-item {
    position: relative;
    line-height: 36px;
    padding-left: 20px;
  }

  .calendar-filter-view .members-wrapper .member-item > a {
    display: block;
    width: 100%;
    height: 36px;
    padding: 6px 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #383838
  }

  .calendar-filter-view .members-wrapper .member-item > a:hover {
    color: #383838;
    background-color: #f3f3f3
  }

  .calendar-filter-view .members-wrapper .member-item.active:after {
    display: block
  }

  .calendar-filter-view .members-wrapper .member-item .avatar {
    margin-top: 6px;
  }

  .calendar-filter-view .members-wrapper .member-item .img-circle {
    border-radius: 50%;
  }

  .calendar-filter-view .members-wrapper .avatar, .calendar-filter-view .members-wrapper .icon-users-bold {
    display: inline-block;
    float: left;
    margin-right: 10px;
    line-height: 24px;
    text-align: center;
    width: 24px;
    height: 24px;
    color: grey;
    font-size: 18px
  }

  .calendar-filter-view .courses-wrapper span {
    line-height: 24px
  }

  .calendar-filter-view .courses-wrapper {
    position: absolute;
    top: 20%;
    left: 0;
    right: 0;
    height: 50%;
    overflow-y: auto
  }

  .calendar-filter-view .courses-wrapper .course-item {
    position: relative;
    padding-left: 20px;
    line-height: 36px;
  }

  .calendar-filter-view .courses-wrapper .course-item > a {
    display: block;
    width: 100%;
    height: 36px;
    padding: 6px 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #383838
  }

  .calendar-filter-view .courses-wrapper .course-item > a:hover {
    color: #383838;
    background-color: #f3f3f3
  }

  .calendar-filter-view .courses-wrapper .course-item.active:after {
    display: block
  }

  .calendar-filter-view .courses-wrapper .avatar, .calendar-filter-view .courses-wrapper .icon-users-bold {
    display: inline-block;
    float: left;
    margin-right: 10px;
    line-height: 24px;
    text-align: center;
    width: 24px;
    height: 24px;
    color: grey;
    font-size: 18px
  }

  .calendar-filter-view .courses-wrapper span {
    line-height: 24px
  }

  .calendar-filter-view .selected {
    color: green;
  }

  .calendar-filter-view .types-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border-bottom: none
  }

  .calendar-filter-view .types-wrapper .check-box {
    margin-right: 6px;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    border: 1px solid #b3b3b3;
    cursor: pointer;
    display: inline-block;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px
  }

  .calendar-filter-view .types-wrapper .check-box:hover {
    border: 1px solid grey
  }

  .calendar-filter-view .types-wrapper .check-box.active {
    border-color: grey
  }

  .calendar-filter-view .types-wrapper .check-box.active .icon.icon-tick {
    visibility: visible
  }

  .calendar-filter-view .types-wrapper .check-box .icon-tick {
    visibility: hidden;
    color: grey;
    font-size: 12px;
    margin-top: -3px
  }

  .calendar-month-view .calendar-month-body .month-day.weekend .date, .calendar-month-view .calendar-month-header .week-name.weekend {
    color: #a6a6a6
  }

  .calendar-filter-view .types-wrapper a {
    display: inline-block;
    float: left;
    margin-right: 48px
  }

  .calendar-filter-view .types-wrapper a:last-child {
    margin-right: 0
  }

  .calendar-month-view, .calendar-week-view {
    bottom: 0;
    -webkit-transition: left 327ms ease;
    -o-transition: left 327ms ease
  }

  .calendar-week-view {
    font-size: 13px;
    position: absolute;
    top: 0;
    left: 265px;
    right: 0;
    transition: left 327ms ease
  }

  .calendar-week-view .loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -35px;
    margin-top: -10px
  }

  .calendar-week-view .calendar-week-header {
    background-color: #fff;
    height: 50px;
    line-height: 50px;
    vertical-align: middle;
    border-bottom: 1px solid rgba(0, 0, 0, .07)
  }

  .calendar-week-view .calendar-week-header .week-title {
    margin-left: 64px;
    position: relative
  }

  .calendar-week-view .calendar-week-header .title {
    width: calc(14.28571% - 1px);
    padding-left: 10px;
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left
  }

  .calendar-week-view .calendar-week-header .title.weekend {
    color: #a6a6a6
  }

  .calendar-week-view .week-top {
    position: relative;
    overflow-y: scroll;
    max-height: 240px
  }

  .calendar-week-view .all-day-text {
    color: #a6a6a6;
    position: absolute;
    top: 50%;
    left: 32px;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%)
  }

  .calendar-week-view .week-days-wrapper {
    width: calc(100% - 64px);
    margin-left: 64px;
    position: relative
  }

  .calendar-week-view .week-days-wrapper .week-day {
    min-height: 34px;
    width: 14.28571%;
    border-right: 1px solid rgba(0, 0, 0, .07);
    float: left;
    position: relative;
    overflow: hidden;
    -webkit-user-select: none;
    user-select: none;
    -webkit-transition: height 327ms ease;
    -o-transition: height 327ms ease;
    transition: height 327ms ease
  }

  .calendar-week-view .week-days-wrapper .week-day .temp {
    position: fixed;
    height: 19px;
    background-color: #03a9f4;
    opacity: .5;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px
  }

  .calendar-week-view .week-days-wrapper .week-day.current {
    background-color: rgba(3, 169, 244, .03)
  }

  .calendar-week-view .week-days-wrapper .week-day:first-child {
    border-left: 1px solid rgba(0, 0, 0, .07)
  }

  .calendar-week-view .week-days-wrapper .week-day:last-child {
    border-right: none
  }

  .calendar-week-view .toggle-height {
    position: absolute;
    left: 50%;
    top: -26px;
    margin-left: -71px;
    z-index: 1000
  }

  .calendar-week-view .toggle-height .expand-or-collapse {
    color: #383838;
    background-color: #f5f5f5;
    border: 1px solid #ededed;
    display: inline-block;
    font-size: 12px;
    height: 26px;
    width: 78px;
    text-align: center;
    line-height: 24px;
    -webkit-user-select: none;
    user-select: none
  }

  .calendar-week-view .tasks, .calendar-week-view .tasks .event-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%
  }

  .calendar-week-view .toggle-height .icon {
    margin-left: 5px
  }

  .calendar-week-view .tasks {
    pointer-events: none
  }

  .calendar-week-view .tasks .event-inner {
    padding: 1px 3px;
    line-height: 16px;
    height: 19px;
    vertical-align: middle
  }

  .calendar-week-view .tasks .event-inner .title {
    display: inline-block;
    width: calc(100% - 20px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 13px;
    vertical-align: middle
  }

  .calendar-week-view .tasks .event-inner .time {
    font-size: 12px;
    display: inline-block;
    text-align: right
  }

  .calendar-week-view .tasks .event-inner .avatar {
    display: inline-block;
    float: right;
    height: 16px;
    width: 16px;
    margin: 0;
    background-color: #a6a6a6;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px
  }

  .calendar-week-view .tasks .rows {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow-y: auto
  }

  .calendar-week-view .tasks .rows .et {
    position: absolute;
    top: 1px;
    height: 21px;
    padding: 1px 0;
    cursor: pointer;
    overflow: hidden;
    pointer-events: auto
  }

  .calendar-week-view .tasks .rows .et.active-event-detail .event-inner, .calendar-week-view .tasks .rows .et.active-task-detail .event-inner {
    background-color: #b8eaff
  }

  .calendar-week-view .tasks .rows .event {
    color: #4982b6;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px
  }

  .calendar-week-view .tasks .rows .event .event-inner {
    background-color: #dcf3fd;
    border-left: 2px solid #03a9f4
  }

  .calendar-week-view .tasks .rows .event .event-inner .title {
    width: calc(100% - 62px)
  }

  .calendar-week-view .tasks .rows .event .event-inner .time {
    width: 58px
  }

  .calendar-week-view .tasks .rows .event .event-inner.all-day .title {
    width: 100%
  }

  .calendar-week-view .tasks .rows .event .event-inner.multi .title {
    width: calc(100% - 104px)
  }

  .calendar-week-view .tasks .rows .event .event-inner.multi .time {
    width: 100px
  }

  @media screen and (max-width: 1264px) {
    .calendar-week-view .tasks .rows .event.length-1 .event-inner > span.title {
      width: 100%
    }

    .calendar-week-view .tasks .rows .event.length-1 .event-inner > span.time {
      width: 0;
      display: none
    }
  }

  .calendar-week-view .tasks .col-0 {
    left: calc(0% + 3px)
  }

  .calendar-week-view .tasks .col-1 {
    left: calc(14.28571% + 3px)
  }

  .calendar-week-view .tasks .col-2 {
    left: calc(28.57142% + 3px)
  }

  .calendar-week-view .tasks .col-3 {
    left: calc(42.85713% + 3px)
  }

  .calendar-week-view .tasks .col-4 {
    left: calc(57.14284% + 3px)
  }

  .calendar-week-view .tasks .col-5 {
    left: calc(71.42855% + 3px)
  }

  .calendar-week-view .tasks .col-6 {
    left: calc(85.71426% + 3px)
  }

  .calendar-week-view .tasks .length-1 {
    width: calc(14.28571% - 6px)
  }

  .calendar-week-view .tasks .length-2 {
    width: calc(28.57142% - 6px)
  }

  .calendar-week-view .tasks .length-3 {
    width: calc(42.85713% - 6px)
  }

  .calendar-week-view .tasks .length-4 {
    width: calc(57.14284% - 6px)
  }

  .calendar-week-view .tasks .length-5 {
    width: calc(71.42855% - 6px)
  }

  .calendar-week-view .tasks .length-6 {
    width: calc(85.71426% - 6px)
  }

  .calendar-week-view .tasks .length-7 {
    width: calc(99.99997% - 6px)
  }

  .calendar-week-view .gap {
    position: relative;
    background-color: #eee;
    height: 4px;
    width: 100%
  }

  .calendar-week-view .week-time {
    position: relative;
    overflow-y: scroll;
    width: 100%;
    background-color: #fff;
    -webkit-transition: height 327ms ease;
    -o-transition: height 327ms ease;
    transition: height 327ms ease
  }

  .calendar-week-view .week-time .left-side {
    height: 1440px;
    width: 64px;
    float: left;
    position: relative
  }

  .calendar-week-view .week-time .left-side .hour {
    color: #a6a6a6;
    font-size: 12px;
    /*height: 60px;*/
    height: 56px;
    width: 100%;
    text-align: center;
    position: relative
  }

  .calendar-week-view .week-time .left-side .hour > div {
    position: relative;
  }

  .calendar-week-view .week-time .left-side .hour.now-time {
    color: #e51c23;
    position: absolute;
    left: 50%;
    margin-top: -8px;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%)
  }

  .calendar-week-view .week-time .day-hours {
    width: calc(100% - 64px);
    height: 1440px;
    position: absolute;
    left: 64px
  }

  .calendar-week-view .week-time .day-hours .now-time {
    width: 100%;
    height: 1px;
    background-color: #e51c23;
    position: absolute;
    left: 0;
    z-index: 1000
  }

  .calendar-week-view .week-time .day-col-wrapper {
    width: 14.28571%;
    float: left;
    height: 100%;
    position: relative;
    z-index: 1000
  }

  .calendar-week-view .week-time .day-col-wrapper .day-col {
    height: 100%;
    width: 90%;
    left: 2px;
    position: relative
  }

  .calendar-week-view .week-time .day-col-wrapper .day-col-select-tip {
    height: 60px;
    width: 100%;
    left: -2px;
    position: absolute;
    border: 1px green dashed;
    text-align: center;
    padding-top: 20px;
    font-weight: 500;
    color: green;
    top: 0px;
  }

  .calendar-week-view .week-time .day-col-wrapper .now-time {
    background-color: #e51c23;
    position: absolute;
    left: 3px;
    height: 10px;
    width: 10px;
    margin-top: -5px;
    margin-left: -5px;
    box-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, 0 1px 0 #fff, -1px 1px 0 #fff;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%
  }

  .calendar-week-view .week-time .day-col-wrapper .event-delete {
    color: #ddd;
  }

  .calendar-week-view .week-time .day-col-wrapper:first-child {
    border-left: 1px solid #f5f5f5
  }

  .calendar-week-view .week-time .day-col-wrapper.current {
    background-color: rgba(3, 169, 244, .02)
  }

  .calendar-week-view .week-time .day-col-wrapper .event {
    color: #4982b6;
    position: absolute;
    border-radius: 1px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: -2px -2px 0 #fff, 2px -2px 0 #fff, 0 2px 0 #fff, -2px 2px 0 #fff
  }

  .calendar-week-view .week-time .day-col-wrapper .event-example {
    color: red;
  }

  .calendar-week-view .week-time .day-col-wrapper .event.active-event-detail .content-wrapper {
    background-color: #b8eaff
  }

  .calendar-week-view .week-time .day-col-wrapper .event .content-wrapper {
    background-color: rgba(214, 241, 253, .85);
    padding-left: 4px;
    padding-top: 2px;
    border-radius: 1px;
    border-left: 2px solid #03a9f4;
    height: 100%
  }

  .calendar-week-view .week-time .day-col-wrapper .event .content-wrapper .content, .calendar-week-view .week-time .day-col-wrapper .event .content-wrapper .time {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
  }

  .calendar-week-view .week-time .day-col-wrapper .event .content-wrapper .time {
    font-size: 12px
  }

  .calendar-week-view .week-time .day-col-wrapper .new-event {
    position: absolute;
    border-radius: 1px;
    overflow: hidden;
    color: #fff;
    background-color: #03a9f4;
    width: 100%;
    padding: 4px;
    opacity: .8
  }

  .calendar-week-view .week-time .day-lines {
    width: calc(100% - 64px);
    height: 1440px;
    position: absolute;
    left: 64px
  }

  .calendar-week-view .week-time .day-lines .vertical-line {
    width: 14.28571%;
    border-right: 1px solid #f5f5f5;
    float: left;
    height: 100%;
    position: relative
  }

  .calendar-week-view .week-time .hour-lines {
    position: absolute;
    top: 0;
    right: 0;
    width: calc(100% - 64px);
    z-index: 1
  }

  .calendar-week-view .week-time .hour-lines .hour-line {
    border-bottom: 1px solid #eee;
    /*height: 60px;*/
    height: 56px;
  }

  .panel-view {
    position: fixed;
    z-index: 60;
    top: 65px;
    right: -520px;
    bottom: 15px;
    background-color: #fff;
    border: 0;
    margin-bottom: 0;
    overflow: hidden;
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;
    backface-visibility: hidden
  }

  .prettybox-container {
    margin: 5px 0;
  }

  .prettybox-container .prettybox-box {
    cursor: pointer;
    vertical-align: text-bottom;
    border: 2px solid #999;
    margin: 0px 0 2px 2px;
    display: inline-block;
    height: 13px;
    width: 13px;
    -moz-background-clip: padding-box;
    -webkit-background-clip: padding-box;
    -o-background-clip: padding-box;
    -ms-background-clip: padding-box;
    -khtml-background-clip: padding-box;
    background-clip: padding-box;
    -moz-border-radius: 13px;
    -webkit-border-radius: 13px;
    -o-border-radius: 13px;
    -ms-border-radius: 13px;
    -khtml-border-radius: 13px;
    border-radius: 13px;
  }

  .prettybox-container .prettybox-box > span {
    margin-right: 0px;
    display: inline-block;
    border-color: rgb(141, 174, 223);
    background-color: rgb(141, 174, 223);
  }

  .prettybox-container div {
    font-weight: 100 !important;
    width: 84px;
    overflow: hidden;
    height: 20px;
  }

  .classroom-select-btn {
    margin-top: 5px;
  }

  #coursetable-setting-panel .modal-dialog {
    width: 800px;
  }

  .coursetable-action .cardrules label {
    font-weight: normal;
  }

  .coursetable-action .cardrules span {
    font-weight: 700;
    font-size: 15px;
  }

  .coursetable-action .cardrules i {
    color: grey;
  }

  .coursetable-action .cardrule-action {
    font-weight: normal;
    border-radius: 3px;
    background-color: #f9f9f9;
    margin-top: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    border: 1px solid #ddd;
  }

  .coursetable-action .suggest {
    padding: 15px;
  }

  .coursetable-action .courselist {
    max-height: 400px;
    overflow-y: scroll;
  }

  .card-allow-detail {
    border: 1px solid rgba(0, 0, 0, .1);
    margin: 10px;
  }

  .card-allow-detail .card-header {
    margin: 10px 15px 10px;
    font-size: 12px;
    line-height: 20px;
    color: grey;
    font-weight: 700;
  }

  .card-allow-detail .card-item {
    padding-left: 15px;
    border-top: 1px solid rgba(0, 0, 0, .1);
    line-height: 30px;
    max-height: 210px;
    overflow-y: scroll;
  }

  .card-allow-detail .card-item i {
    color: #a6a6a6;
  }

  #coursetable-setting-panel .activity-creator-wrapper button {
    width: 20%;
    margin-left: 15px;
  }

  #coursetable-setting-panel .cardinfo i {
    color: grey;
    font-size: 13px;
  }

  /* 定义keyframe动画，命名为blink */
  @keyframes blink {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    50.01% {
      opacity: 0;
    }
    /* 注意这里定义50.01%立刻透明度为０，可以设置闪烁效果 */
    100% {
      opacity: .8;
    }
  }

  /* 添加兼容性前缀 */

  @-webkit-keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    50.01% {
      opacity: 0;
    }
    100% {
      opacity: 0.8;
    }
  }

  @-moz-keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    50.01% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }

  @-ms-keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    50.01% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }

  @-o-keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    50.01% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }

  /* 定义blink类*/
  .blink {
    animation: blink .75s linear infinite;
    /* 其它浏览器兼容性前缀 */
    -webkit-animation: blink .75s ease infinite;
    -moz-animation: blink .75s linear infinite;
    -ms-animation: blink .75s linear infinite;
    -o-animation: blink .75s linear infinite;
  }

  .event-detail-panel {
    width: 365px;
    margin-right: 15px;
    border-left: 1px solid rgba(0, 0, 0, .1);
  }

  .event-detail-panel .panel-layer {
    margin-top: 10px;
  }

  .event-detail-panel footer .form-group {
    margin-left: 10px;
  }

  .event-detail-panel footer #form_add_class {
    width: 30%;
  }

  .courselist tr td i {
    font-size: 30px;
    border: 1px solid #eee;
    width: 45px;
    height: 45px;
    text-align: center;
    line-height: 45px;
  }


</style>
