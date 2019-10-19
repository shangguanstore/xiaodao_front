<template>
  <div class="checking_in_container">
    <div class="manage_title">
    <Breadcrumb>
      <BreadcrumbItem>教务中心</BreadcrumbItem>
      <BreadcrumbItem>考勤</BreadcrumbItem>
    </Breadcrumb>
  </div>

    <div class="container mt20">
      <div>
        <div class="search_container">
          <Row :gutter="20">
            <Col span="4">
            <DatePicker type="daterange" :value="dateRange" format="yyyy/MM/dd" @on-change="changeDateRange" placement="bottom-end" placeholder="请选择日期" style="width: 100%"></DatePicker>
            </Col>

            <Col span="4">
            <Input v-model="searchValue" placeholder="请输入班课名称"
                   @on-change="changeName"></Input>
            </Col>

            <!--<Col span="4">-->
            <!--&lt;!&ndash;<span>班级老师：</span>&ndash;&gt;-->
            <!--<Select v-model="model1">-->
              <!--<Option v-for="item in teacherList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
            <!--</Select>-->
            <!--</Col>-->

            <Col span="2">
            <Button class="ml20" type="info" @click="search">查询</Button>
            </Col>

          </Row>
        </div>

        <div class="mt20">
          <!--<Button type="info" icon="ios-plus-empty" @click="add">添加班级</Button>-->
          <!--<Button type="default" class="ml20" @click="exportDataDilog()">导出Excel</Button>-->
        </div>

        <Checkbox-group v-model="showCategory" @on-change="changeShowCategory">
          <Checkbox label="preCheck">待考勤</Checkbox>
          <Checkbox label="checked" class="ml20">已考勤</Checkbox>
        </Checkbox-group>

        <Table border ref="selection" :loading="loading" @on-selection-change="checkNum" :columns="tableColumns"
               :data="tableData" class="mt20">>
        </Table>

        <div v-if="false" style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="total" show-total show-sizer show-elevator :current="current" @on-change="changePage"
                  @on-page-size-change="changepageSize"></Page>
          </div>
        </div>
      </div>
    </div>

    <Modal
      v-model="attendanceBox"
      width="60"
      :styles="{top: '200px'}"
    >
      <p slot="header">
        <span>课程考勤与扣课时</span>
      </p>

      <div class="check_nums mt20">
        已选择<span>{{attendanceCheckNums}}</span>项
      </div>
      <div>
        <Table border ref="attend" style="overflow: visible" :loading="attendanceLoading" :columns="attendanceTableColumns"
               :data="attendanceTableData" @on-selection-change="attendanceCheckNum" class="mt20">>
        </Table>
      </div>

      <div slot="footer">
        <Button type="default" @click="handleCancel" style="margin-left: 8px">取消</Button>
        <Button type="info" :loading="checkingCancelLoading" @click="handleCancelAttendance" style="margin-left: 8px">取消考勤</Button>
        <Button type="primary" :loading="checkingSubmitLoading" @click="handleSubmit">考勤并扣费</Button>
      </div>
    </Modal>

    <Modal v-model="exportDataShow">
      <p slot="header">
        <span>导出数据</span>
      </p>
      <div>
        <Form ref="exportLis" :model="exportData" :rules="exportRule" :label-width="80">
          <FormItem label="导出条数" prop="exportNum">
            <Input v-model="exportData.exportNum" @on-change="getExportValue" number
                   placeholder="请输入你需要导出的数据，不大于5000条"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="exportSubmit('exportLis')">导出</Button>
        <Button type="default" @click="exportCancle" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import store from '../store'
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'


  // 检验手机号码
  const validatePhone = function (rule, value, callback) {
    if (!(/^1[34578]\d{9}$/.test(value))) {
      return callback(new Error('您输入的手机号码有误'))
    } else {
      callback()
    }
  }
  export default {
    name: 'checkingIn',
    data() {
      return {
        model1: '',
        showCategory: ['preCheck'],

        dateRange: [],
        ctid: '',
        courseList: [],
        classroomList: [],

        attendanceBox: false,
        attendanceLoading: true,
        attendanceTableColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '学员姓名',
            key: 'uname'
          },
          {
            title: '考勤状态',
            key: 'KQflag',
            render: (h, params) => {
              const row = params.row;
              const color = row.KQflag === 0 ? 'primary' : row.KQflag === 1 ? 'success' : 'error';
              const text = row.KQflag === 0 ? '未考勤' : row.KQflag === 1 ? '已考勤' : '状态错误';

              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text);
            }
          },
          {
            title: '扣费课程',
            key: 'company_course_name'
          },
          {
            title: '剩余课时',
            key: 'card_num'
          },
          {
            title: '出勤情况',
            key: '出勤情况',
            width: '150px',
            render: (h, params) => {
              return h('div', [
                h('RadioGroup', {
                  props: {
                    value: params.row.status_show,
                    //vertical: true
                  },
                  style: {
                  },
                  on: {
                    'on-change': (e) => {
                      this.changeAttendanceStatus(params, e)
                    }
                  }
                }, [
                  h('Radio', {
                    props:{
                      "label":config.Attendance.STATUS_ATTENDANCE
                    },
                  }, '出勤'),
                  h('Radio', {
                    props:{
                      "label":config.Attendance.STATUS_ABSENCE
                    },
                  }, '缺勤')
                ]),

              ])
            }
          },
          {
            title: '扣课时',
            key: 'num'
          },
          {
            title: '出勤详情',
            key: '出勤详情',
            render: (h, params) => {
              return h('Select', {
                props: {
                  value: params.row.type_show,
                  //vertical: true
                },
                style: {
                },
                on: {
                  'on-change': (e) => {
                    this.changeAttendanceType(params, e)
                  }
                }
              }, params.row.typeList.map(op=>{
                  console.log('op',op)
                  return h('Option', {
                    props: {
                      value: op.value
                    }
                  }, op.label)
                }
              ))
            }
          },
          // {
          //   title: '备注',
          //   key: '备注'
          // },
          {
            title: '操作',
            key: 'operation',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'md-trash',
                  },
                  style: {
                    fontSize: '16px'
                  },
                  on: {
                    click: () => {
                      this.removeAttend(params)
                    }
                  }
                }, '删除'),
              ])
            }
          }
        ],
        attendanceTableData: [],
        attendList: [],
        checkingSubmitLoading: false,
        checkingCancelLoading: false,
        attendanceCheckNums: 0,
        attendanceSels: [],

        teacherList: [
          {
            value: 1,
            label: '张浩'
          },
          {
            value: 2,
            label: '朱标'
          }
        ],
        classFormValidate: {
          ccid: 0,
          name: '',
          max_num: '',
          classroom_id: '',
          // teacher_id: '',
          comment: '',
        },
        classRuleValidate: {
          ccid: [
            {required: true, type: 'number', message: '请选择课程', trigger: 'change'}
          ],
          name: [{
            required: true,
            message: '班级名称不能为空',
            trigger: 'blur'
          }],

        },

        searchValue: "",
        editUser: "新建用户",
        curMid: 0,
        showClassBox: false,

        current: 1,
        pageSize: 10,
        sort: "",
        Search: "",
        total: 0,

        checkNums: 0,
        sels: [],
        loading: true,
        exportDataShow: false,
        tableData: [],
        showMessage: false,

        exportData: {
          exportNum: "",
        },
        exportRule: {
          exportNum: [{
            required: true,
            type: 'number',
            message: '导出数据不能为空',
            trigger: 'blur'
          },
            {type: 'number', max: 5000, message: '输入大于5000', trigger: 'blur'}],
        },

        tableColumns: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '上课日期',
              key: 'course_date'
            },
            {
              title: '班课名称',
              key: 'course_name'
            },
            {
              title: '教室',
              key: 'classroom_name'
            },
            {
              title: '老师',
              key: 'teacher_name'
            },
            {
              title: '班主任',
              key: 'class_teacher_name'
            },
            {
              title: '应到',
              key: 'courseMemberNum'
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
                        this.preAttendance(params)
                      }
                    }
                  }, '考勤'),
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
                        this.update(params)
                      }
                    }
                  }, '编辑'),
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
                        this.remove(params)
                      }
                    }
                  }, '删除'),
                ])
              }
            }
          ],

      }
    },
    mounted() {

    },
    created() {
      this.dateRange = lib.getCurWeekStartEndDate()
      this.getTableData(
        {
          page: this.current,
          size: this.pageSize,
        }
      )

      // this.getCourseList()
      // this.getClassroomList()
    },
    methods: {
      changeDateRange(e) {
        this.dateRange = e
        this.getTableData({
          page: this.current,
          size: this.pageSize,
        })
      },
      changeShowCategory(e) {
        this.getTableData({
          page: this.current,
          size: this.pageSize,
        })
      },

      changeAttendanceType(params, e) {
        params.row.type_show = e
        this.attendList[params.index].type = e
      },
      changeAttendanceStatus(params, e) {
        this.attendList[params.index].status = e

        if(e == config.Attendance.STATUS_ATTENDANCE) {
          params.row.type_show = config.Attendance.TYPE_ATTEND
          params.row.typeList = [
            {
              label: '上课',
              value: config.Attendance.TYPE_ATTEND,
            },
            {
              label: '迟到',
              value: config.Attendance.TYPE_LATE,
            },
            {
              label: '早退',
              value: config.Attendance.TYPE_ERALY_GO,
            },
          ]
        }else if(e == config.Attendance.STATUS_ABSENCE) {
          params.row.type_show = config.Attendance.TYPE_LEAVE_PERSONAL_AFFAIRS
          params.row.typeList = [
            {
              label: '事假',
              value: config.Attendance.TYPE_LEAVE_PERSONAL_AFFAIRS,
            },
            {
              label: '病假',
              value: config.Attendance.TYPE_LEAVE_SICK,
            },
            {
              label: '旷课',
              value: config.Attendance.TYPE_TRUANCY,
            },
            {
              label: '其他',
              value: config.Attendance.TYPE_OTHERS,
            },
          ]
        }
      },

      preAttendance(params) {
        this.ctid = params.row.ctid
        this.attendanceBox = true
        this.attendanceCheckNums = 0
        this.attendanceSels = []
        this.getAttendance()
      },
      getAttendance() {
        this.attendanceLoading = true
        this.attendanceTableData = []
        let submitData = {
          ctid: this.ctid
        }
        let url = '/api/coursetable/attendance/list'
        this.$http.post(url, submitData).then(res => {
          this.attendanceLoading = false
          let attendanceTableData = res.data.data
          attendanceTableData.map(item=>{
            if(item.status == config.Attendance.STATUS_INIT || item.status == config.Attendance.STATUS_CANCEL) {
              item['KQflag'] = 0
            }else{
              item['KQflag'] = 1
            }
            item.status_show = item.status == config.Attendance.STATUS_INIT ? config.Attendance.STATUS_ATTENDANCE : item.status
            item.type_show = item.type == config.Attendance.TYPE_INIT ? config.Attendance.TYPE_ATTEND : item.type

            if(item.status_show == config.Attendance.STATUS_ATTENDANCE) {
              item.typeList = [
                {
                  label: '上课',
                  value: config.Attendance.TYPE_ATTEND,
                },
                {
                  label: '迟到',
                  value: config.Attendance.TYPE_LATE,
                },
                {
                  label: '早退',
                  value: config.Attendance.TYPE_ERALY_GO,
                },
              ]
            }else if(item.status_show == config.Attendance.STATUS_ABSENCE) {
              item.typeList = [
                {
                  label: '事假',
                  value: config.Attendance.TYPE_LEAVE_PERSONAL_AFFAIRS,
                },
                {
                  label: '病假',
                  value: config.Attendance.TYPE_LEAVE_SICK,
                },
                {
                  label: '旷课',
                  value: config.Attendance.TYPE_TRUANCY,
                },
                {
                  label: '其他',
                  value: config.Attendance.TYPE_OTHERS,
                },
              ]
            }
          })

          this.attendanceTableData = attendanceTableData

          //渲染的select组件中，数据改变后，改变params和attendanceTableData均会出bug，取一个中介数来做最终的数据传递
          let attendList = []
          this.attendanceTableData.map(item=>{
            attendList.push({
              id: item.id,
              card_id: item.card_id,
              mid: item.mid,
              ctid: item.ctid,
              status: item.status_show,
              type: item.type_show,
            })
          })
          this.attendList = attendList
        }).catch(error => {
          this.attendanceLoading = false
          this.$Message.error(error.message);
        })
      },


      getCourseList() {
        let submitData = {}
        let url = lib.getRequestUrl('/api/company/course/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          this.courseList = res.data.data
        }).catch(error => {
          this.$Message.error(error.message);
        })
      },
      getClassroomList() {
        let submitData = {
        }
        let url = lib.getRequestUrl('/api/classroom/my', submitData)
        this.$http.get(url, {}).then(res => {
          this.classroomList = res.data.data
        }).catch(error => {
          this.$Message.error(error.message);
        })
      },

      add() {
        this.showClassBox = true
      },
      exportDataDilog() {
        this.exportDataShow = true
      },
      exportCancle() {
        this.exportDataShow = false
        this.getTableData({
          page: this.current,
          size: this.pageSize,
        })
      },
      getExportValue(value) {
        this.getTableData({
          page: this.current,
          size: this.exportData.exportNum,
        })
      },
      // 导出数据
      exportSubmit(inventory) {
        this.$refs[inventory].validate((valid) => {
          if (valid) {
            this.$refs.selection.exportCsv({
              filename: '用户列表数据',
              columns: this.tableColumns.filter((col, index) => index < 6),
              data: this.tableData.filter((data, index) => index < 9999)
            })
          }
        })
      },
      closeDialog() {
        let timer = null;
        clearTimeout(timer)
        if (this.showMessage) {
          timer = setTimeout(() => {
            this.showMessage = false
          }, 2000)
        }
      },

      getAttendanceCheckList() {
        let list = []
        let attendIds = lib.array_column(this.attendanceSels,'id')
        for(var i = 0; i < this.attendList.length; i++) {
          if(lib.in_array(this.attendList[i].id, attendIds)) {
            list.push(this.attendList[i])
          }
        }
        return list
      },
      handleSubmit() {
        if(this.attendanceCheckNums == 0) {
          this.$Message.error('请先在列表栏中勾选要更改的条目。')
          return
        }

        this.checkingSubmitLoading = true
        let url = '/api/coursetable/attendance/update'
        let submitData = {
          ctid: this.ctid,
          attendList: this.getAttendanceCheckList()
        }
        this.$http.post(url, submitData).then(res => {
          this.$Message.success('考勤操作成功！')
          this.checkingSubmitLoading = false
          this.attendanceBox = false

          this.getTableData({
            page: this.current,
            size: this.pageSize,
          })
        }).catch(error => {
          this.attendanceBox = false
          this.checkingSubmitLoading = false
          this.$Message.error('操作失败，' + error.message)
        })
      },
      handleCancel() {
        this.attendanceBox = false
      },
      handleCancelAttendance() {
        if(this.attendanceCheckNums == 0) {
          this.$Message.error('请先在列表栏中勾选要更改的条目。')
          return
        }

        this.checkingCancelLoading = true
        let url = '/api/coursetable/attendance/cancel'
        let submitData = {
          ctid: this.ctid,
          attendList: this.getAttendanceCheckList()
        }
        this.$http.post(url, submitData).then(res => {
          this.$Message.success('取消考勤操作成功！')
          this.checkingCancelLoading = false
          this.attendanceBox = false

          this.getTableData({
            page: this.current,
            size: this.pageSize,
          })
        }).catch(error => {
          this.attendanceBox = false
          this.checkingCancelLoading = false
          this.$Message.error('操作失败，' + error.message)
        })
      },
      attendanceCheckNum(selection) {
        console.log('selection',selection)
        this.attendanceCheckNums = selection.length
        this.attendanceSels = selection
      },
      checkNum(selection) {
        this.checkNums = selection.length
        this.sels = selection
      },
      getTableData(option) {
        this.loading = true
        let submitData = {
          // pageIndex: option.page,
          // pageSize: option.size,
          preCheck: lib.in_array('preCheck', this.showCategory) ? true : false,
          checked: lib.in_array('checked', this.showCategory) ? true : false,
          start_time: lib.getDateFirstLastTimestamp(this.dateRange[0]),
          end_time: lib.getDateFirstLastTimestamp(this.dateRange[1], 'last')
        }
        let url = '/api/coursetable/getlist'
        this.$http.post(url, submitData).then(res => {
          if (res) {
            this.loading = false
            this.current = option.page

            this.total = res.data.total
            let tableData = res.data.data ? res.data.data : []

            tableData = lib.filterResult(tableData)
            tableData.map(item=>{
              item.capacity = item.max_num ? `0/${item.max_num}` : 0
            })

            // tableData = [
            //   {
            //     name: '芭蕾舞一班',
            //     company_course_name: '芭蕾舞',
            //     teacher_name: '张勇',
            //     capacity: '0/12',
            //     process: '0/48',
            //     category: '小组课',
            //   },
            //   {
            //     name: '芭蕾舞一班',
            //     company_course_name: '芭蕾舞',
            //     teacher_name: '张勇',
            //     capacity: '0/12',
            //     process: '0/48',
            //     category: '小组课',
            //   },
            //   {
            //     name: '芭蕾舞一班',
            //     company_course_name: '芭蕾舞',
            //     teacher_name: '张勇',
            //     capacity: '0/12',
            //     process: '0/48',
            //     category: '小组课',
            //   },
            // ]

            this.tableData = tableData
          }
        }).catch(error => {
          this.loading = false
          this.$Message.error(error.message);
        })
      },
      test() {
        let url = "/api/apigc/order/push"
        this.$http.post(url, {}).then(res => {
          if (res) {

          }
        }).catch(error => {
          this.$Message.error(error.message)
        })
      },
      changePage(page) {
        this.current = page
        this.getTableData(
          {
            page: this.current,
            size: this.pageSize,
          }
        )
      },
      changepageSize(size) {
        this.pageSize = size
        this.getTableData(
          {
            page: this.current,
            size: this.pageSize,
          }
        )
      },
      showDetail(params) {
        this.$router.push({
          path: 'classDetail',
          query: {
            id: params.row.id
          }
        })
      },
      // 编辑页面
      update(params) {
        this.showClassBox = true
        this.classFormValidate = params.row

      },
      remove(params) {
        this.$Modal.confirm({
          title: '删除',
          content: "确认删除" + params.row.uname + "吗？",
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            console.log('params', params)
            let submitData = {
              mid: params.row.mid,
              cid: params.row.cid,
              roles: params.row.role_id,
            }
            this.$http.post("/api/member/del", submitData).then(res => {
              if (res) {
                this.$Message.success('删除成功!')
                this.getTableData(
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
      removeAttend(params) {
        this.$Modal.confirm({
          title: '删除',
          content: "确认移除" + params.row.uname + "吗？",
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            let submitData = {
              id: params.row.id,
            }
            this.$http.post("/api/coursetable/attendance/del", submitData).then(res => {
              if (res) {
                this.$Message.success('操作成功!')
                this.getAttendance()
              }
            }).catch(error => {
              this.$Message.error(error.message)
            })
          },
          onCancel: () => {
          }
        })
      },
      search() {
        this.getTableData({
          page: this.current,
          size: this.pageSize,
        })
      },
      changeName(changeValue) {
        if (this.searchValue.length === 0) {
          this.getTableData({
            page: this.current,
            size: this.pageSize,
          })
        }
      },
    },
  }
</script>

<style>
/*.checking_in_container .ivu-table-wrapper {*/
  /*overflow: auto;*/
/*}*/
</style>
