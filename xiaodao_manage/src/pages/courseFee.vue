<template>
  <div class="course_fee_container">
    <ul class="top_nav_bar float-wrap">
      <li class="title">
        <img src="http://static.xiaost.net/zixunben-icon.png" style="top: 14px;left: 16px" alt="">
        <span>课程/收费</span>
      </li>
      <li class="item" :class="{current: currentNavIndex == 0}" @click="changeNav(0)">
        课程管理
      </li>
      <li class="item" :class="{current: currentNavIndex == 1}" @click="changeNav(1)">
        收费项管理
      </li>
      <li class="item" :class="{current: currentNavIndex == 2}" @click="changeNav(2)">
        套餐管理
      </li>
    </ul>

    <div class="container mt20">
      <div v-show="currentNavIndex == 0">
        <div class="search_container">
          <Row :gutter="20">
            <Col span="6">
            <span>搜索课程：</span>
            <Input v-model="searchValue" placeholder="请输入课程名称" style="width: 200px"
                   @on-change="changeName"></Input>
            <Button class="ml20" type="info" @click="search">查询</Button>
            </Col>

            <Col span="6">
            <span>课程状态：</span>
            <Select v-model="model1" style="width:calc(100% - 120px);">
              <Option v-for="item in teacherList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>

          </Row>
        </div>

        <div class="mt20">
          <Button type="info" icon="ios-plus-empty" @click="add">新建课程</Button>
          <Button type="default" class="ml20" @click="exportDataDilog()">新建通用课程</Button>
        </div>

        <Table border ref="selection" :loading="loading" @on-selection-change="checkNum" :columns="tableColumns"
               :data="tableData" class="mt20">
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
        <div class="comment-tip">
          <i class="icon iconfont icon-tishi"></i>
          <span>一对一课程在报名时创建班级</span>
        </div>
        <Form ref="classFormValidate" :model="classFormValidate" :rules="classRuleValidate" :label-width="80">
          <FormItem label="所属课程" prop="class_id">
            <Select v-model="classFormValidate.class_id" style="width:calc(100% - 60px);">
              <Option v-for="item in courseList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="班级名称" prop="name">
            <Input v-model="classFormValidate.name" style="width:calc(100% - 60px);"
                   placeholder="请输入班级名称"></Input>
          </FormItem>

          <FormItem label="班级容量" prop="capacity">
            <Input v-model="classFormValidate.capacity" style="width: calc(100% - 60px)"
                   placeholder="请输入班级容量"></Input>

            <Tooltip content="班级容量即班级人数上限" placement="top">
              <i class="icon iconfont icon-tishi ml10"></i>
            </Tooltip>
          </FormItem>

          <FormItem label="上课教室" prop="classroom">
            <Select v-model="classFormValidate.classroom" style="width:calc(100% - 60px);">
              <Option v-for="item in courseList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="班级老师" prop="teacher_id">
            <Select v-model="classFormValidate.teacher_id" style="width:calc(100% - 60px);">
              <Option v-for="item in teacherList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>

          <FormItem label="备注" prop="comment">
            <Input v-model="classFormValidate.comment" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder="请输入备注" style="width:calc(100% - 60px);"></Input>
          </FormItem>

        </Form>
      </div>

      <div slot="footer">
        <Button type="default" @click="handleTrackCancel" style="margin-left: 8px">取消</Button>
        <Button type="primary" @click="handleTrackSubmit('classFormValidate')">提交</Button>
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
        courseList: [
          {
            value: 1,
            label: '芭蕾舞'
          },
          {
            value: 2,
            label: '硬笔书画'
          }
        ],

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
          class_id: 0,
          name: '',
          capacity: '',
          classroom: '',
          teacher_id: '',
          comment: '',
        },
        classRuleValidate: {
          class_id: [
            {required: true, message: '请选择课程', trigger: 'change'}
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
              title: '课程名称',
              key: 'name'
            },
            {
              title: '类型',
              key: 'type'
            },
            {
              title: '单价(元/课时)',
              key: 'unit_price_format'
            },
            {
              title: '在读学员数',
              key: '在读学员数'
            },
          {
            title: '启用状态',
            key: '启用状态'
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
      var uname = store.state.uname
    },
    created() {
      this.getTableData(
        {
          page: this.current,
          size: this.pageSize,
        }
      )
      // this.test()
    },
    methods: {
      add() {
        // this.showClassBox = true
        this.$router.push({
          path: 'courseEdit',
          query: {
            isAdd: true
          },
        })
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
      handleTrackSubmit(inventory) {
        this.$refs[inventory].validate((valid) => {
          if (valid) {
            let url = '/api/line/comment/add'
            let submitData = {
              type: config.LineComment.TYPE_TRACK,
              thread_id: this.curMid,
              content: this.classFormValidate.content
            }
            this.$http.post(url, submitData).then(res => {
              if (res) {
                this.$Message.success('新添沟通记录成功!')
                this.showClassBox = false
                this.getTableData({
                  page: this.current,
                  size: this.pageSize
                })
              }
            }).catch(error => {
              this.$Message.error('添加失败,' + error.message)
            })
          } else {
            this.$Message.error('请输入完整信息!');
          }
        })
      },
      handleTrackCancel() {
        this.showClassBox = false
      },
      checkNum(selection) {
        this.checkNums = selection.length
        this.sels = selection
      },
      getTableData(option) {
        let submitData = {
          search: this.searchValue,
          pageIndex: option.page,
          pageSize: option.size
        }
        let url = lib.getRequestUrl('/api/company/course/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          if(res) {
            this.loading = false
            this.current = option.pageIndex

            this.total = res.data.total
            this.tableData = lib.filterResult(res.data.data)
          }
        }).catch(error => {
          console.log('error',error)
          this.loading = false
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
      showDetail() {
        this.$router.push({
          path: 'classDetail',
          query: {
            // cid: params.row.cid,
            // mid: params.row.mid
          }
        })
      },
      // 编辑页面
      update(params) {
        this.$router.push({
          path: 'studentEdit',
          query: {
            cid: params.row.cid,
            mid: params.row.mid
          }
        })
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
