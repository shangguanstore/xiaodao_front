<template>
  <div class="class_container">
    <div class="manage_title">
    <Breadcrumb>
    <BreadcrumbItem>招生中心</BreadcrumbItem>
    <BreadcrumbItem>班级/排课</BreadcrumbItem>
    </Breadcrumb>
    </div>

    <ul v-if="false" class="top_nav_bar float-wrap">
      <li class="title">
        <img src="http://static.xiaost.net/zixunben-icon.png" style="top: 14px;left: 16px" alt="">
        <span>班级管理</span>
      </li>
      <li class="item" :class="{current: currentNavIndex == 0}" @click="changeNav(0)">
        班课
      </li>
      <li class="item" :class="{current: currentNavIndex == 1}" @click="changeNav(1)">
        一对一
      </li>
    </ul>

    <div class="container mt20">
      <div v-show="currentNavIndex == 0">
        <div class="search_container">
          <Row :gutter="20">
            <Col span="4">
            <!--<span>搜索班级：</span>-->
            <Input v-model="searchValue" placeholder="请输入班级名称"
                   @on-change="changeName"></Input>
            </Col>

            <!--<Col span="4">-->
            <!--&lt;!&ndash;<span>所属课程：</span>&ndash;&gt;-->
            <!--<Select v-model="model1">-->
              <!--<Option v-for="item in courseList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
            <!--</Select>-->
            <!--</Col>-->

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
          <Button type="info" icon="ios-plus-empty" @click="add">添加班级</Button>
          <Button type="default" class="ml20" @click="exportDataDilog()">导出Excel</Button>
        </div>

        <Table border ref="selection" :loading="loading" @on-selection-change="checkNum" :columns="tableColumns"
               :data="tableData" class="mt20">>
        </Table>

        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="total" show-total show-sizer show-elevator :current="current" @on-change="changePage"
                  @on-page-size-change="changepageSize"></Page>
          </div>
        </div>
      </div>


      <div v-show="currentNavIndex == 1">
        <Table border :loading="trackTableLoading" :columns="trackTableColumns"
               :data="trackTableData" class="mt20">>
        </Table>

        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="total1" show-total show-sizer show-elevator :current="current1" @on-change="changePage1"
                  @on-page-size-change="changepageSize1"></Page>
          </div>
        </div>
      </div>
    </div>

    <Modal
      v-model="showClassBox"
      width:="480"
      :styles="{top: '200px'}"
    >
      <p slot="header">
        <span>新增班级</span>
      </p>

      <div>
        <!--<div class="comment-tip">-->
          <!--<i class="icon iconfont icon-tishi"></i>-->
          <!--<span>一对一课程在报名时创建班级</span>-->
        <!--</div>-->
        <Form ref="classFormValidate" :model="classFormValidate" :rules="classRuleValidate" :label-width="80">
          <FormItem label="所属课程" prop="ccid">
            <Select v-model="classFormValidate.ccid" :disabled="classFormValidate.id ? true : false" style="width:calc(100% - 60px);">
              <Option v-for="item in courseList" :value="item.ccid" :key="item.ccid">{{ item.name }}</Option>
            </Select>
          </FormItem>

          <FormItem label="班级名称" prop="name">
            <Input v-model="classFormValidate.name" style="width:calc(100% - 60px);"
                   placeholder="请输入班级名称"></Input>
          </FormItem>

          <FormItem label="班级容量" prop="max_num">
            <Input v-model="classFormValidate.max_num" style="width: calc(100% - 60px)"
                   placeholder="请输入班级容量,不填表示不限制"></Input>

            <Tooltip content="班级容量即班级人数上限" placement="top">
              <i class="icon iconfont icon-tishi ml10"></i>
            </Tooltip>
          </FormItem>

          <FormItem label="上课教室" prop="classroom_id">
            <Select v-model="classFormValidate.classroom_id" style="width:calc(100% - 60px);">
              <Option v-for="item in classroomList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>

          <!--<FormItem label="班级老师" prop="teacher_id">-->
            <!--<Select v-model="classFormValidate.teacher_id" style="width:calc(100% - 60px);">-->
              <!--<Option v-for="item in teacherList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
            <!--</Select>-->
          <!--</FormItem>-->

          <FormItem label="备注" prop="comment">
            <Input v-model="classFormValidate.comment" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder="请输入备注" style="width:calc(100% - 60px);"></Input>
          </FormItem>

        </Form>
      </div>

      <div slot="footer">
        <Button type="default" @click="handleCancel" style="margin-left: 8px">取消</Button>
        <Button type="primary" @click="handleSubmit('classFormValidate')">提交</Button>
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
    name: 'student',
    data() {
      return {
        model1: '',
        courseList: [],
        classroomList: [],

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
        currentNavIndex: 0,
        curMid: 0,
        showClassBox: false,
        trackTableLoading: true,
        trackList: [],//弹出框，选定用户跟踪记录
        trackTableData: [],//跟踪记录表格数据

        current: 1,//咨询记录
        pageSize: 10,
        sort: "",
        Search: "",
        total: 0,

        current1: 1,//沟通记录
        pageSize1: 10,
        sort1: "",
        Search1: "",
        total1: 0,

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
        trackTableColumns: [
          {
            title: '学员姓名',
            key: 'uname'
          },
          {
            title: '联系电话',
            key: 'phone'
          },
          {
            title: '沟通内容',
            key: 'content'
          },
          {
            title: '创建时间',
            key: 'create_time_format'
          },
        ],

        tableColumns: [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '班级名称',
              key: 'name',
              render: (h, params) => {
                return h('div', [
                  h('div', {
                    style: {
                      fontSize: "13px",
                      color: "rgb(45, 183, 245)",
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
                        this.showDetail(params)
                      }
                    }
                  }, (params.row.name)),
                ])
              }
            },
            {
              title: '课程名称',
              key: 'company_course_name'
            },
            // {
            //   title: '班级老师',
            //   key: 'teacher_name'
            // },
            {
              title: '教室',
              key: 'classroom_name'
            },
            {
              title: '人数/容量',
              key: 'capacity'
            },
            {
              title: '已上/排课课次',
              key: 'process',
            },
            // {
            //   title: '班级分类',
            //   key: 'catetory'
            // },
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
                        this.showDetail(params)
                      }
                    }
                  }, '排课/查看'),
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
      this.getTableData(
        {
          page: this.current,
          size: this.pageSize,
        }
      )

      this.getCourseList()
      this.getClassroomList()
    },
    methods: {
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

      changeNav(index) {
        if (index == 0) {

        } else if (index == 1) {
          this.getTrackTableData({
            page: this.current1,
            size: this.pageSize1
          })
        }

        this.currentNavIndex = index
      },
      handleSubmit(inventory) {
        this.$refs[inventory].validate((valid) => {
          if (valid) {
            let url,successMsg,errMsg
            let submitData = {
              name: this.classFormValidate.name,
              ccid: this.classFormValidate.ccid,
              max_num: this.classFormValidate.max_num,
              classroom_id: this.classFormValidate.classroom_id ? this.classFormValidate.classroom_id : null,
            }
            if(this.classFormValidate.id) {
              submitData.id = this.classFormValidate.id
              url = '/api/classes/update'
              successMsg = '更新班级成功!'
              errMsg = '更新班级失败，'
            }else{
              url = '/api/classes/add'
              successMsg = '新添班级成功!'
              errMsg = '添加班级失败，'
            }

            this.$http.post(url, submitData).then(res => {
              this.$Message.success(successMsg)
              this.showClassBox = false
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
        this.showClassBox = false
      },
      checkNum(selection) {
        this.checkNums = selection.length
        this.sels = selection
      },
      getTableData(option) {
        let submitData = {
          pageIndex: option.page,
          pageSize: option.size,
        }
        let url = '/api/classes/getlist'
        this.$http.post(url, submitData).then(res => {
          if (res) {
            this.loading = false
            this.current = option.page

            this.total = res.data.total
            let tableData = res.data.data ? res.data.data : []

            tableData = lib.filterResult(tableData)
            tableData.map(item=>{
              item.capacity = item.max_num ? `${item.num} / ${item.max_num}` : `${item.num} / 无限制`
              item.process = `${item.isCheckAttendanceNum} / ${item.allCoursetableNum}`
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
          console.log('error', error)

          this.$Message.error(error.message);
        })
      },
      getTrackTableData(option) {
        let submitData = {
          type: config.LineComment.TYPE_TRACK,
          pageIndex: option.page,
          pageSize: option.size,
        }
        let url = lib.getRequestUrl('/api/line/comment/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          if (res) {
            this.trackTableLoading = false
            this.trackTableData = res.data.data ? lib.filterResult(res.data.data) : []
          }
        }).catch(error => {
          this.trackTableLoading = false
          this.$Message.error(error.message);
        })
      },
      getTrackList() {
        let submitData = {
          type: config.LineComment.TYPE_TRACK,
          thread_id: this.curMid
        }
        let url = lib.getRequestUrl('/api/line/comment/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          if (res) {
            this.trackListLoading = false
            this.trackList = res.data.data ? lib.filterResult(res.data.data) : []
          }
        }).catch(error => {
          this.trackListLoading = false
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
      changePage1(page) {
        this.current1 = page
        this.getTrackTableData(
          {
            page: this.current1,
            size: this.pageSize1,
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
      changepageSize1(size) {
        this.pageSize1 = size
        this.getTrackTableData(
          {
            page: this.current1,
            size: this.pageSize1,
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
          content: "确认删除" + params.row.name + "吗？",
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            console.log('params', params)
            let submitData = {
              id: params.row.id,
            }
            this.$http.post("/api/classes/del", submitData).then(res => {
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
      search() {
        if (this.searchValue.length == 0) {
          this.$Message.warning('请输入你要查询的店铺全称！');
        } else {
          let searchName = "UserName=\"" + this.searchValue + "\" "
          this.sort = "UserName asc, Id desc"
          this.getTableData({
            page: this.current,
            size: this.pageSize,
          })
        }
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

</style>
