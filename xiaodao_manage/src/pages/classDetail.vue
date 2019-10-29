<template>
  <div class="class_detail_container">
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>教务中心</BreadcrumbItem>
        <BreadcrumbItem>班级管理</BreadcrumbItem>
        <BreadcrumbItem>班级详情</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div class="container detail_info mt20">
      <p class="content_title">班级信息</p>
      <Row :gutter="60" class="mt20">
        <Col span="6">
        <p class="item">
          <span>班级名称：</span>
          <span>{{classesInfo.name}}</span>
        </p>
        </Col>

        <Col span="6">
        <p class="item">
          <span>课程：</span>
          <span>{{classesInfo.company_course_name}}</span>
        </p>
        </Col>

        <Col span="6">
        <p class="item">
          <span>班级老师：</span>
          <span>{{classesInfo.teacher_uname ? classesInfo.teacher_uname : '--'}}</span>
        </p>
        </Col>

        <Col span="6">
        <p class="item">
          <span>在读人数：</span>
          <span>1</span>
        </p>
        </Col>
      </Row>
      <Row :gutter="60" class="mt20">
        <Col span="6">
        <p class="item">
          <span>班级容量：</span>
          <span>{{classesInfo.max_num}}</span>
        </p>
        </Col>

        <Col span="6">
        <p class="item">
          <span>上课教室：</span>
          <span>{{classesInfo.classroom_name ? classesInfo.classroom_name : '--'}}</span>
        </p>
        </Col>

        <Col span="6">
        <p class="item">
          <span>备注信息：</span>
          <span>无</span>
        </p>
        </Col>
      </Row>
    </div>

    <div class="container mt20">
      <Tabs value="name1">
        <TabPane label="排课信息" name="name1">
          <div class="mt20">
            <Button type="info" icon="ios-plus-empty" @click="addCourse">一键排课</Button>
            <!--<Button type="default" class="ml20">批量修改</Button>-->
            <!--<Button type="default" class="ml20">批量删除</Button>-->
          </div>

          <Table border ref="selection" :loading="loadingCourseSchedule" @on-selection-change="checkNum"
                 :columns="courseTableColumns"
                 :data="tableDataCourseSchedule" class="mt20">
          </Table>

          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page :total="totalCourseSchedule" show-total show-sizer show-elevator :current="currentCourseSchedule"
                    @on-change="changePageCourseSchedule"
                    @on-page-size-change="changepageSizeCourseSchedule"></Page>
            </div>
          </div>

        </TabPane>
        <TabPane label="班级学员" name="name2">
          <div class="mt20">
            <Button type="info" icon="ios-plus-empty" @click="preJoinClass">添加学员</Button>
            <!--<Button type="default" class="ml20">调至其他班</Button>-->
            <!--<Button type="default" class="ml20">移出本班</Button>-->
          </div>

          <Table border ref="selection" :loading="loading" @on-selection-change="checkNum"
                 :columns="studentTableColumns"
                 :data="studentTableData" class="mt20">>
          </Table>
        </TabPane>


        <!--<TabPane label="点名情况" name="name3">标签三的内容</TabPane>-->
      </Tabs>
    </div>

    <Modal
      v-model="showCourseSchedulBox"
      width:="480"
      :styles="{top: '100px'}"
    >
      <p slot="header">
        <span>排课</span>
      </p>

      <div>
        <div class="tabBar float-wrap mb10 ml10">
          <div class="item fl" :class="courseTabBar == 0 ? 'active' : ''"
               @click="changeCourseTabBar(0)">规则排课
          </div>
          <div class="item fl" :class="courseTabBar == 1 ? 'active' : ''"
               @click="changeCourseTabBar(1)">日历排课
          </div>
        </div>

        <Form v-if="courseTabBar == 0" ref="courseFormValidate" :model="courseFormValidate" :rules="courseRuleValidate"
              :label-width="80">

          <FormItem label="班课名称" prop="name">
            <Input v-model="courseFormValidate.name" style="width:200px;"
                   placeholder="请输入班级名称"></Input>
          </FormItem>

          <FormItem label="开始日期" prop="start_date">
            <DatePicker v-model="courseFormValidate.start_date" type="date"
                        @on-change="changeCourseFormValidateStartDate" format="yyyy-MM-dd" placeholder="选择开始日期"
                        style="width: 200px"></DatePicker>
          </FormItem>

          <Row :gutter="10">
            <Col span="10">
            <FormItem label="结束方式" prop="end_type">
              <Select v-model="courseFormValidate.end_type" @on-change="changeEndType" style="width: 100%">
                <Option v-for="item in endTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            </Col>

            <Col span="8">
            <FormItem v-if="courseFormValidate.end_type == 1" prop="end_date" :label-width="10">
              <DatePicker v-model="courseFormValidate.end_date" type="date" @on-change="changeCourseFormValidateEndDate"
                          format="yyyy-MM-dd" placeholder="选择日期" style="width: 1.3rem"></DatePicker>
            </FormItem>

            <FormItem v-if="courseFormValidate.end_type == 2" prop="end_count" :label-width="10"
                      style="position: relative;">
              <Input v-model="courseFormValidate.end_count"
                     placeholder="" style="width: 1.3rem"></Input>
              <span class="fieldUnit" style="right: -.37rem;">次之后</span>
            </FormItem>
            </Col>
          </Row>

          <!--<FormItem label="是否重复" prop="repetition_type">-->
          <!--<Select v-model="courseFormValidate.repetition_type" @on-change="changeEndType" style="width: 200px">-->
          <!--<Option v-for="item in repetitionTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
          <!--</Select>-->
          <!--</FormItem>-->

          <FormItem label="周几上课">
            <div class="tabBar float-wrap mb10 ml10" style="line-height: 100%;">
              <div v-for="(item,index) in courseWeekTabBarList" class="item fl" :class="item.value ? 'active' : ''"
                   @click="changeWeekTabBar(index)" style="padding: 10px;">{{item.label}}
              </div>
            </div>
          </FormItem>

          <FormItem label="上课时间" prop="course_time">
            <TimePicker format="HH:mm" type="timerange" @on-change="changeCourseTime" confirm hide-disabled-options
                        :disabled-hours="[0,1,2,3,4,5,6]" :steps="[1, 5, 1]" placement="bottom-end"
                        placeholder="请选择上课时间" style="width: 200px"></TimePicker>
          </FormItem>

          <FormItem label="授课老师" prop="teacher_mid">
            <Select v-model="courseFormValidate.teacher_mid" style="width: 200px">
              <Option v-for="item in teacherList" :value="item.mid" :key="item.mid">{{ item.uname }}</Option>
            </Select>
          </FormItem>

          <FormItem label="班主任" clearable prop="class_teacher_mid">
            <Select v-model="courseFormValidate.class_teacher_mid" style="width: 200px">
              <Option v-for="item in classTeacherList" :value="item.mid" :key="item.mid">{{ item.uname }}</Option>
            </Select>
          </FormItem>

          <FormItem label="上课教室" prop="classroom_id">
            <Select v-model="courseFormValidate.classroom_id" clearable style="width: 200px">
              <Option v-for="item in classroomList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>

          <FormItem label="上课内容" prop="comment">
            <Input v-model="courseFormValidate.comment" type="textarea" :autosize="{minRows: 3,maxRows: 8}"
                   placeholder="最多20字" style="width:calc(100% - 60px);"></Input>
          </FormItem>

        </Form>

        <Form v-if="courseTabBar == 1" ref="courseFormValidate" :model="courseFormValidate" :rules="courseRuleValidate"
              :label-width="80">
          <FormItem label="班课名称" prop="name">
            <Input v-model="courseFormValidate.name" style="width:200px;"
                   placeholder="请输入班级名称"></Input>
          </FormItem>

          <FormItem label="上课日期" prop="start_date">
            <DatePicker v-model="courseFormValidate.start_date" type="date" format="yyyy-MM-dd" placeholder="选择开始日期"
                        style="width: 200px"></DatePicker>
          </FormItem>

          <FormItem label="上课时间" prop="end_type">
            <Select v-model="courseFormValidate.course_time" @on-change="changeEndType" style="width: 200px">
              <Option v-for="item in courseTimeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="授课老师" prop="teacher_mid">
            <Select v-model="courseFormValidate.teacher_mid" style="width: 200px">
              <Option v-for="item in teacherList" :value="item.mid" :key="item.mid">{{ item.uname }}</Option>
            </Select>
          </FormItem>

          <FormItem label="班主任" clearable prop="class_teacher_mid">
            <Select v-model="courseFormValidate.class_teacher_mid" style="width: 200px">
              <Option v-for="item in classTeacherList" :value="item.mid" :key="item.mid">{{ item.uname }}</Option>
            </Select>
          </FormItem>

          <FormItem label="上课教室" prop="classroom_id">
            <Select v-model="courseFormValidate.classroom_id" clearable style="width: 200px">
              <Option v-for="item in classroomList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>

          <FormItem label="上课内容" prop="comment">
            <Input v-model="courseFormValidate.comment" type="textarea" :autosize="{minRows: 3,maxRows: 8}"
                   placeholder="最多20字" style="width:calc(100% - 60px);"></Input>
          </FormItem>

        </Form>
      </div>

      <div slot="footer">
        <Button type="default" @click="handleCourseCancel" style="margin-left: 8px">取消</Button>
        <Button type="primary" :loading="addCourseScheduleLoading" @click="handleCourseSubmit('courseFormValidate')">
          提交
        </Button>
      </div>
    </Modal>

    <Modal
      v-model="showCourseJoinBox"
      :width="780"
      :styles="{top: '100px'}"
    >
      <p slot="header">
        <span>班课报班</span>
      </p>

      <div>
        <Transfer
          :data="classesSignAble"
          :list-style="{width: '340px', height: '300px'}"
          :titles="['已报读学员','在读学员']"
          :target-keys="classesSignIngKeys"
          :render-format="render1"
          @on-change="changeClassSign">
        </Transfer>
      </div>

      <div slot="footer">
        <Button type="default" @click="getClassesSign" style="margin-left: 8px">重置</Button>
        <Button type="primary" :loading="addCourseScheduleLoading" @click="handleClassesSignSubmit()">
          提交
        </Button>
      </div>
    </Modal>


  </div>
</template>

<script>
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'
  import classDetailCourseScheduleExpand from './classDetailCourseScheduleExpand.vue'

  export default {
    name: 'classDetail',
    components: {
      classDetailCourseScheduleExpand
    },
    data() {
      return {
        classesSignData: {},
        classesSignAble: [],
        classesSignIngKeys: [],
        showCourseSchedulBox: false,
        showCourseJoinBox: false,
        classesInfo: {},
        courseTabBar: 0,
        courseWeekTabBarList: [
          {
            label: '一',
            value: 1,
          },
          {
            label: '二',
            value: 0,
          },
          {
            label: '三',
            value: 0,
          },
          {
            label: '四',
            value: 0,
          },
          {
            label: '五',
            value: 0,
          },
          {
            label: '六',
            value: 0,
          },
          {
            label: '日',
            value: 0,
          },
        ],
        loading: false,
        addCourseScheduleLoading: false,
        tableData: [],
        endTypeList: [
          {
            value: 1,
            label: '限日期'
          },
          {
            value: 2,
            label: '限次数'
          },
        ],
        repetitionTypeList: [
          {
            value: 1,
            label: '每周'
          },
          {
            value: 2,
            label: '隔周'
          },
        ],
        courseTimeList: [
          {
            value: 1,
            label: '08:00~09:00'
          },
        ],

        tableDataCourseSchedule: [],
        loadingCourseSchedule: true,
        currentCourseSchedule: 1,//咨询记录
        pageSizeCourseSchedule: 10,
        sortCourseSchedule: "",
        SearchCourseSchedule: "",
        totalCourseSchedule: 0,

        checkNums: 0,
        sels: [],

        teacherList: [],
        classTeacherList: [],
        classroomList: [],
        courseFormValidate: {
          name: '',
          start_date: '',
          end_date: '',
          end_type: '',
          end_count: 1,
          repetition_type: 1,
          course_time: '',


          teacher_mid: '',
          class_teacher_mid: '',
          classroom_id: '',
        },
        courseRuleValidate: {},

        courseTableColumns: [
          {
            type: 'expand',
            width: 60,
            render: (h, params) => {
              return h(classDetailCourseScheduleExpand, {
                props: {
                  row: params.row,
                },
                on: {
                  // 'refreshData': (str) => {
                  //   this.tableRefresh(str)
                  // }
                }
              })
            }
          },
          {
            title: '排课方式',
            key: 'schedule_type_format'
          },
          {
            title: '开班日期',
            key: 'start_date'
          },
          {
            title: '上课时间',
            key: 'classTime'
          },
          {
            title: '上课教室',
            key: 'classroom_name',
          },
          {
            title: '上课老师',
            key: 'teacher_name'
          },
          {
            title: '上课内容',
            key: '上课内容'
          },
          {
            title: '创建日期',
            key: 'create_time_format'
          },
          {
            title: '操作',
            key: 'operation',
            render: (h, params) => {
              return h('div', [
                // h('Button', {
                //   props: {
                //     type: 'text',
                //     size: 'small',
                //   },
                //   style: {
                //     color: '#2db7f5'
                //   },
                //   on: {
                //     click: () => {
                //       params.row._expanded = true
                //       //this.update(params)
                //       this.tableDataCourseSchedule.map(item=>{
                //         if(item.id == params.row.id) {
                //           item._expanded = true
                //         }
                //       })
                //     }
                //   }
                // }, '详细'),

                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small',
                  },
                  style: {
                    color: '#2db7f5'
                  },
                  on: {
                    click: () => {
                      this.removeCourseSchedule(params)
                    }
                  }
                }, '删除'),
              ])
            }
          }
        ],

        studentTableData: [],
        studentTableColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '姓名',
            key: 'uname'
          },
          // {
          //   title: '性别',
          //   key: 'sex_format'
          // },
          {
            title: '手机号',
            key: 'phone'
          },
          {
            title: '操作',
            key: 'operation',
            render: (h, params) => {
              return h('div', [
                // h('Button', {
                //   props: {
                //     type: 'text',
                //     size: 'small',
                //   },
                //   style: {
                //     color: '#2db7f5'
                //   },
                //   on: {
                //     click: () => {
                //       this.update(params)
                //     }
                //   }
                // }, '调至其他班'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small',
                  },
                  style: {
                    color: '#2db7f5'
                  },
                  on: {
                    click: () => {
                      this.removeClassesMember(params)
                    }
                  }
                }, '移出本班'),
              ])
            }
          }
        ],
      }
    },
    created() {
      this.getClassesInfo()

      this.getClassesSign()
    },
    mounted() {

    },
    methods: {
      removeClassesMember(params) {
        this.$Modal.confirm({
          title: '删除',
          content: "确认将" + params.row.uname + "移出本班吗？",
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            console.log('params', params)
            let submitData = {
              mid: params.row.mid,
              classes_id: this.$route.query.id
            }
            this.$http.post("/api/classes/member/del", submitData).then(res => {
              if (res) {
                this.$Message.success('操作成功!')
                this.getClassesSign()
              }
            }).catch(error => {
              this.$Message.error(error.message)
            })
          },
          onCancel: () => {
          }
        })
      },
      render1 (item) {
        return item.label + item.description;
      },
      changeClassSign (newTargetKeys, direction, moveKeys) {
        this.classesSignIngKeys = newTargetKeys;
      },
      handleClassesSignSubmit() {
        let keys = this.classesSignIngKeys
        let mids = []

        // console.log('this.classesSignAble',this.classesSignAble)
        //
        // this.classesSignAble.map((item,index)=>{
        //   if(lib.in_array(index,keys)) mids.push(item.mid)
        // })
        let submitData = {
          mids: this.classesSignIngKeys,
          classes_id: this.$route.query.id
        }
        let url = '/api/classes/member/add'
        this.$http.post(url, submitData).then(res => {
          this.$Message.success('操作成功！')
          this.showCourseJoinBox = false
          this.getClassesSign()
        }).catch(error => {
          this.showCourseJoinBox = false
          this.$Message.error(error.message)
        })
      },

      getTableDataCourseSchedule(option) {
        let submitData = {
          classes_id: this.$route.query.id,
          pageIndex: option.page,
          pageSize: option.size,
        }
        let url = '/api/course/schedule/getlist'
        this.$http.post(url, submitData).then(res => {
          if (res) {
            this.loadingCourseSchedule = false
            this.currentCourseSchedule = option.page

            this.totalCourseSchedule = res.data.total
            let tableData = res.data.data ? res.data.data : []
            tableData = lib.filterResult(tableData)
            tableData.map(item => {
              item.weekdays_format = lib.getWeekdaysFormat(item.weekdays).join(',')
              item.classTime = `${item.weekdays_format} ${item.start_time}~${item.end_time}`

              if (item.schedule_type == config.CourseSchedule.SCHEDULE_TYPE_REGULAR_WEEK) {
                item.schedule_type_format = '按周'
              } else if (item.schedule_type == config.CourseSchedule.SCHEDULE_TYPE_REGULAR_BIWEEKLY) {
                item.schedule_type_format = '隔周'
              } else if (item.schedule_type == config.CourseSchedule.SCHEDULE_TYPE_NOT_REGULAR) {
                item.schedule_type_format = '日历排课'
              }
            })

            this.tableDataCourseSchedule = tableData
          }
        }).catch(error => {
          this.loadingCourseSchedule = false
          this.$Message.error(error.message);
        })
      },
      changePageCourseSchedule(page) {
        this.currentCourseSchedule = page
        this.getTableData(
          {
            page: this.currentCourseSchedule,
            size: this.pageSizeCourseSchedule,
          }
        )
      },
      changepageSizeCourseSchedule(size) {
        this.pageSizeCourseSchedule = size
        this.getTableDataCourseSchedule(
          {
            page: this.currentCourseSchedule,
            size: this.pageSizeCourseSchedule,
          }
        )
      },
      getTeacherList() {
        let submitData = {
          roles: [config.UserRole.ROLE_TEACHER]
        }
        let url = lib.getRequestUrl('/api/member/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          this.teacherList = res.data.data
        }).catch(error => {
          this.$Message.error(error.message);
        })
      },
      getClassTeacherList() {
        let submitData = {
          roles: [config.UserRole.ROLE_CLASS_TEACHER]
        }
        let url = lib.getRequestUrl('/api/member/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          this.classTeacherList = res.data.data
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
      changeCourseFormValidateStartDate(e) {
        this.courseFormValidate.start_date = e
      },
      changeCourseFormValidateEndDate(e) {
        this.courseFormValidate.end_date = e
      },
      changeCourseTime(e) {
        this.courseFormValidate.course_time = e
      },
      getClassesInfo() {
        let submitData = {
          id: this.$route.query.id
        }
        let url = '/api/classes/getlist'
        this.$http.post(url, submitData).then(res => {
          let classesData = res.data.data ? res.data.data : []

          classesData = lib.filterResult(classesData)
          this.classesInfo = classesData[0]

          this.getTableDataCourseSchedule({
            page: this.currentCourseSchedule,
            size: this.pageSizeCourseSchedule,
          })
        }).catch(error => {
          this.loading = false
          console.log('error', error)

          this.$Message.error(error.message);
        })
      },

      getClassesSign() {
        let submitData = {
          classes_id: this.$route.query.id,
          able: true,
          pre: true,
          ing: true
        }
        let url = '/api/classes/purchase/list'
        this.$http.post(url, submitData).then(res => {
          let classesSignData = res.data.data
          let able = classesSignData.able
          let ing = classesSignData.ing

          let classesSignAble = []
          let classesSignIngKeys = []
          able.map((item,index)=>{
            let key = item.mid
            for(var i = 0; i < ing.length; i++) {
              if(ing[i]['mid'] == item.mid) {
                classesSignIngKeys.push(key)
              }
            }
            classesSignAble.push({
              key: key,
              label: item.uname,
              description: `(${item.phone})`,
              //disabled: Math.random() * 3 < 1
            });
          })

          this.classesSignData = classesSignData
          this.classesSignAble = classesSignAble
          this.classesSignIngKeys = classesSignIngKeys
          this.studentTableData = lib.filterResult(ing)
        }).catch(error => {
          this.loading = false
          console.log('error', error)

          this.$Message.error(error.message);
        })
      },

      removeCourseSchedule(params) {
        this.$Modal.confirm({
          title: '删除',
          content: `确认删除 ${params.row.start_date} 课程吗？`,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            let submitData = {
              id: params.row.id,
            }
            this.$http.post("/api/course/schedule/del", submitData).then(res => {
              if (res) {
                this.$Message.success('删除成功!')
                this.getTableDataCourseSchedule(
                  {
                    page: this.current,
                    size: this.pageSize,
                  }
                )
              }
            }).catch(error => {
              this.$Message.error(error.message)
            })
          },
          onCancel: () => {
          }
        })
      },

      preJoinClass() {
        this.showCourseJoinBox = true
      },
      addCourse() {
        this.showCourseSchedulBox = true
        if (this.teacherList.length == 0) this.getTeacherList()
        if (this.classTeacherList.length == 0) this.getClassTeacherList()
        if (this.classroomList.length == 0) this.getClassroomList()
      },
      changeCourseTabBar(tab) {
        this.courseTabBar = tab
      },
      changeWeekTabBar(index) {
        this.courseWeekTabBarList[index].value = this.courseWeekTabBarList[index].value ? 0 : 1
      },
      checkNum(selection) {
        this.checkNums = selection.length
        this.sels = selection
      },
      changeEndType() {
        console.log('end-type', this.courseFormValidate.end_type)

      },
      getWeekListDayNumber() {
        // weekday[0]="Sunday"
        // weekday[1]="Monday"
        // weekday[2]="Tuesday"
        // weekday[3]="Wednesday"
        // weekday[4]="Thursday"
        // weekday[5]="Friday"
        // weekday[6]="Saturday"

        let weekDayNum = []
        this.courseWeekTabBarList.map((item, index) => {
          if (item.value) {
            if (index == 0) {
              weekDayNum.push(1)
            } else if (index == 1) {
              weekDayNum.push(2)
            } else if (index == 2) {
              weekDayNum.push(3)
            } else if (index == 3) {
              weekDayNum.push(4)
            } else if (index == 4) {
              weekDayNum.push(5)
            } else if (index == 5) {
              weekDayNum.push(6)
            } else if (index == 6) {
              weekDayNum.push(0)
            }
          }
        })

        return weekDayNum
      },
      handleCourseCancel() {

      },
      handleCourseSubmit(inventory) {
        console.log('courseFormvalidate', this.courseFormValidate)

        this.$refs[inventory].validate((valid) => {
          if (valid) {
            this.addCourseScheduleLoading = true
            let course_dates, submitData
            let courseFormValidate = this.courseFormValidate

            submitData = {
              name: courseFormValidate.name,
              ccid: this.classesInfo.ccid,
              classes_id: this.classesInfo.id,
              classroom_id: courseFormValidate.classroom_id,
              teacher_mid: courseFormValidate.teacher_mid,
              class_teacher_mid: courseFormValidate.class_teacher_mid,
              start_time: courseFormValidate.course_time[0],
              end_time: courseFormValidate.course_time[1]
            }

            if (this.courseTabBar == 0) {//规律排课
              if (courseFormValidate.end_type == 1) {//结束方式： 限日期
                let weekDayNumArr = this.getWeekListDayNumber()
                course_dates = lib.getWeekdayDate(courseFormValidate.start_date, courseFormValidate.end_date, weekDayNumArr)
                if (course_dates.length == 0) {
                  this.$Message.error('当前条件未匹配到日期！')
                  return
                }

                submitData.schedule_type = config.CourseSchedule.SCHEDULE_TYPE_REGULAR_WEEK
                submitData.course_dates = course_dates.join(',')
                submitData.weekdays = weekDayNumArr.join(',')
                submitData.start_date = course_dates[0]
              } else {//结束方式： 限次数

              }
            } else {//非规律排课

            }

            let url = '/api/course/schedule/add'
            this.$http.post(url, submitData).then(res => {
              this.$Message.success('添加排课成功！')
              this.addCourseScheduleLoading = false

              this.showCourseSchedulBox = false
              this.$refs[inventory].resetFields()

              this.getTableDataCourseSchedule({
                page: this.currentCourseSchedule,
                size: this.pageSizeCourseSchedule,
              })
            }).catch(error => {
              this.addCourseScheduleLoading = false
              this.$Message.error(error.message)
            })

          } else {
            this.$Message.error('请输入完整信息!');
          }
        })
      },
    },
  }
</script>
<style>

</style>
