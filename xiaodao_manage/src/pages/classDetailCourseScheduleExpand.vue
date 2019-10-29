<template>
  <div>
    <Button type="primary" @click="add">添加排课</Button>

    <Table class="mt10" border stripe ref="selection" :loading="loading" :columns="columns" :data="tableData"></Table>

    <Modal
      v-model="showCoursetableBox"
      width:="480"
      :styles="{top: '100px'}"
    >
      <p slot="header">
        <span>{{coursetableBoxTitle}}</span>
      </p>

      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate"
            :label-width="80">
        <FormItem label="上课日期" prop="course_date">
          <DatePicker :value="formValidate.course_date" type="date"
                      @on-change="formValidate.course_date=$event" format="yyyy-MM-dd" placeholder="选择开始日期"
                      style="width: 200px"></DatePicker>
        </FormItem>

        <FormItem label="上课时间" prop="course_time">
          <TimePicker :value="formValidate.course_time" format="HH:mm" type="timerange" @on-change="formValidate.course_time=$event"
                      confirm hide-disabled-options
                      :disabled-hours="[0,1,2,3,4,5,6]" :steps="[1, 5, 1]" placement="bottom-end"
                      placeholder="请选择上课时间" style="width: 200px"></TimePicker>
        </FormItem>

        <FormItem label="授课老师" prop="teacher_mid">
          <Select v-model="formValidate.teacher_mid" style="width: 200px">
            <Option v-for="item in teacherList" :value="item.mid" :key="item.mid">{{ item.uname }}</Option>
          </Select>
        </FormItem>

        <FormItem label="班主任" clearable prop="class_teacher_mid">
          <Select v-model="formValidate.class_teacher_mid" style="width: 200px">
            <Option v-for="item in classTeacherList" :value="item.mid" :key="item.mid">{{ item.uname }}</Option>
          </Select>
        </FormItem>

        <FormItem label="上课教室" prop="classroom_id">
          <Select v-model="formValidate.classroom_id" clearable style="width: 200px">
            <Option v-for="item in classroomList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="default" @click="handleCancel" style="margin-left: 8px">取消</Button>
        <Button type="primary" :loading="updateCoursetableLoading" @click="handleSubmit('formValidate')">
          提交
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'

  export default {
    props: ['row', 'classes'],
    data() {
      return {
        loading: true,
        current: 1,
        pageSize: 10,
        sort: "",
        Search: "",
        total: 0,

        teacherList: [],
        classTeacherList: [],
        classroomList: [],

        showCoursetableBox: false,
        coursetableBoxTitle: '',

        updateCoursetableLoading: false,

        formValidate: {
          ccid: '',
          course_name: '',
          classroom_id: '',
          classes_id: '',
          course_schedule_id: '',
          course_date: '',
          course_time: '',
          teacher_mid: '',
          class_teacher_mid: '',
        },
        ruleValidate: {},

        tableData: [],
        columns: [
          {
            title: '上课日期',
            key: 'course_date'
          },
          {
            title: '上课时间',
            key: 'start_time'
          },
          {
            title: '课时',
            key: '课时'
          },
          {
            title: '老师',
            key: 'teacher_name',
          },
          {
            title: '助教',
            key: 'assist_teacher_name',
          },
          {
            title: '班主任',
            key: 'class_teacher_name',
          },
          {
            title: '状态',
            key: 'status_format',
          },
          {
            title: '课消课时',
            key: '课消课时',
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
                      this.update(params)
                    }
                  }
                }, '修改'),
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
    created() {
      console.log('row', this.row)
      console.log('classes', this.classes)
      this.getTableData(
        {
          page: this.current,
          size: this.pageSize,
        }
      )
    },
    methods: {
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

      getTableData(option) {
        let submitData = {
          course_schedule_id: this.row.id,
          // pageIndex: option.page,
          // pageSize: option.size,
        }
        let url = '/api/coursetable/getlist'
        this.$http.post(url, submitData).then(res => {
          if (res) {
            this.loading = false
            this.current = option.page

            this.total = res.data.total
            let tableData = res.data.data ? res.data.data : []

            tableData = lib.filterResult(tableData)

            this.tableData = tableData
          }
        }).catch(error => {
          this.loading = false
          console.log('error', error)

          this.$Message.error(error.message);
        })
      },
      add() {
        this.showCoursetableBox = true
        this.coursetableBoxTitle = '添加课程'
        this.$refs['formValidate'].resetFields();

        if (this.teacherList.length == 0) this.getTeacherList()
        if (this.classTeacherList.length == 0) this.getClassTeacherList()
        if (this.classroomList.length == 0) this.getClassroomList()

        let formValidate = {}
        let row = this.row
        formValidate.ccid = row.ccid
        formValidate.course_name = row.name
        formValidate.course_time = [row.start_time, row.end_time]
        formValidate.course_date = ''
        formValidate.classroom_id = row.classroom_id
        formValidate.teacher_mid = row.teacher_mid
        formValidate.class_teacher_mid = row.class_teacher_mid
        formValidate.assist_teacher_mid = row.assist_teacher_mid
        formValidate.course_schedule_id = row.id
        formValidate.classes_id = row.classes_id

        this.formValidate = formValidate

        console.log('this.formValidate',this.formValidate)
      },
      update(params) {
        this.showCoursetableBox = true
        this.coursetableBoxTitle = '修改课程'

        if (this.teacherList.length == 0) this.getTeacherList()
        if (this.classTeacherList.length == 0) this.getClassTeacherList()
        if (this.classroomList.length == 0) this.getClassroomList()

        let row = params.row
        let course_time = [row.start_time, row.end_time]

        this.formValidate.ctid = row.ctid
        this.formValidate.course_date = row.course_date
        this.formValidate.course_time = course_time
        this.formValidate.teacher_mid = row.teacher_mid
        this.formValidate.class_teacher_mid = row.class_teacher_mid
        this.formValidate.assist_teacher_mid = row.assist_teacher_mid
        this.formValidate.classroom_id = row.classroom_id
      },
      remove(params) {
        this.$Modal.confirm({
          title: '删除',
          content: `确认删除 ${params.row.course_date} ${params.row.start_time} 课程吗？`,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            let submitData = {
              ids: params.row.ctid,
            }
            this.$http.post("/api/coursetable/del", submitData).then(res => {
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
      changeFormvalidateCourseDate(e) {
        this.formValidate.course_date = e
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
              course_date: this.formValidate.course_date,
              teacher_mid: this.formValidate.teacher_mid,
              class_teacher_mid: this.formValidate.class_teacher_mid,
              assist_teacher_mid: this.formValidate.assist_teacher_mid,
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
              this.showCoursetableBox = false
              this.updateCoursetableLoading = false
              this.getTableData({
                page: this.current,
                size: this.pageSize
              })
            }).catch(error => {
              this.$Message.error(errMsg + error.message)
            })
          } else {
            this.$Message.error('请输入完整信息!');
          }
        })
      },
      handleCancel() {
        this.showCoursetableBox = false
      },
    }
  }
</script>

<style>

</style>
