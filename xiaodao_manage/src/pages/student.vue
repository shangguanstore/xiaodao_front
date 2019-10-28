<template>
  <div class="student_container">
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>学员</BreadcrumbItem>
        <BreadcrumbItem>学员列表</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div class="container mt20">
      <div class="search_container">
        <div class="fl">
          <span>搜索查询：</span>
          <Input v-model="searchValue" placeholder="请输入手机号、用户名查询" style="width: 200px" @on-change="changeName"></Input>
          <Button class="ml20" type="info" @click="search">查询</Button>
        </div>
        <div class="fr">
          <!--<Button type="info" icon="ios-plus-empty" @click="addUser">新建咨询</Button>-->
          <!--<Button type="default" class="ml20" @click="exportDataDilog()">导出Excel</Button>-->
        </div>
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

    <Modal
      v-model="showTrackBox"
      width:="480"
      :styles="{top: '200px'}"
    >
      <p slot="header">
        <span>沟通记录</span>
      </p>
      <div>
        <Form ref="trackFormValidate" :model="trackFormValidate" :rules="trackRuleValidate" :label-width="120">
          <FormItem label="新增沟通记录" prop="content">
            <Input v-model="trackFormValidate.content" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder="请输入沟通记录"></Input>
          </FormItem>
        </Form>
        <Table border :columns="trackListColumns" :loading="trackListLoading"
               :data="trackList" class="mt20">
        </Table>
      </div>

      <div slot="footer">
        <Button type="default" @click="handleTrackCancel" style="margin-left: 8px">取消</Button>
        <Button type="primary" @click="handleTrackSubmit('trackFormValidate')">提交</Button>
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
        searchValue: "",
        editUser: "新建用户",
        currentNavIndex: 0,
        curMid: 0,
        showTrackBox: false,
        trackListLoading: true,
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
        trackFormValidate: {
          content: ''
        },
        trackRuleValidate: {
          content: [{
            required: true,
            message: '跟踪记录不能为空',
            trigger: 'blur'
          }],
        },
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
        trackListColumns: [
          {
            title:'历史沟通记录',
            key:'content'
          },
          {
            title:'创建时间',
            key:'create_time_format'
          },
        ],
        trackTableColumns: [
          {
            title:'学员姓名',
            key:'uname'
          },
          {
            title:'联系电话',
            key:'phone'
          },
          {
            title:'沟通内容',
            key:'content'
          },
          {
            title:'创建时间',
            key:'create_time_format'
          },
        ],
        tableColumns:
          [
            {
              type: 'selection',
              width: 60,
              align: 'center'
            },
            {
              title: '姓名/编号',
              key: 'uname',
              render: (h, params) => {
                return h('div', [
                  h('img', {
                    attrs: {
                      src: params.row.avatar ? params.row.avatar : config.Qiniu.EXTERNAL_LINK + 'Fnv8Hshkyhgmv_P6yVlL290xikd7',
                    },
                    style: {
                      width: '40px',
                      height: '40px',
                      backgroundColor: "#c6cfe1",
                      borderRadius: "20px",
                      margin: "6px 0",
                      float: "left",
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
                        this.showDetail(params)
                      }
                    }
                  }),
                  h('div', {
                    style: {
                      marginTop: "12px",
                      marginLeft: "48px",
                      fontSize: "16px",
                      position: "absolute",
                      color: "rgb(45, 183, 245)",
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
                        this.showDetail(params)
                      }
                    }
                  }, (params.row.uname)),
                ])
              }
            },


            // {
            //   title:'生日',
            //   key:'birthday'
            // },
            {
              title: '绑定手机',
              key: 'phone'
            },
            {
              title:'母亲手机',
              key:'mother_phone'
            },
            {
              title:'父亲手机',
              key:'father_phone'
            },
            {
              title: '所报课程',
              key: 'name',
              render: (h, params) => {
                return h('div', [
                  h('div', {
                    style: {
                      fontSize: "13px",
                      // color: "rgb(45, 183, 245)",
                      cursor: "pointer"
                    },
                    // on: {
                    //   click: () => {
                    //     this.showDetail(params)
                    //   }
                    // }
                  }, (params.row.card_format)),
                ])
              }
            },
            {
              title:'性别',
              key:'sex_format',
            },
            		{
            			title:'创建日期',
            			key:'create_time_format'
            		},
            // {
            //   title: '角色',
            //   key: 'role_id_format',
            // },
            {
              title: '操作',
              key: 'operation',
              width: 200,
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
                  }, '查看'),
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
                        this.purchase(params)
                      }
                    }
                  }, '购课'),
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
      showDetail(params) {
        this.$router.push({
          path: 'studentDetail',
          query: {
            mid: params.row.mid
          }
        })
      },
      addUser() {
        this.$router.push({
          path: 'studentEdit',
          query: {
            // cid: params.row.cid,
            // mid: params.row.mid
          }
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
        if(index == 0) {

        }else if(index == 1) {
          this.getTrackTableData({
            page: this.current1,
            size: this.pageSize1
          })
        }

        this.currentNavIndex = index
      },
      showTrack(params) {
        this.showTrackBox = true
        this.curMid = params.mid
        this.trackFormValidate = {
          content: ''
        }
        this.trackList = []
        this.getTrackList()
      },
      handleTrackSubmit(inventory) {
        this.$refs[inventory].validate((valid) => {
          if (valid) {
            let url = '/api/line/comment/add'
            let submitData = {
              type: config.LineComment.TYPE_TRACK,
              thread_id: this.curMid,
              content: this.trackFormValidate.content
            }
            this.$http.post(url, submitData).then(res => {
              if(res) {
                this.$Message.success('新添沟通记录成功!')
                this.showTrackBox = false
                this.getTableData({
                  page: this.current,
                  size: this.pageSize
                })
              }
            }).catch(error => {
              this.$Message.error('添加失败,'+error.message)
            })
          }else{
            this.$Message.error('请输入完整信息!');
          }
        })
      },
      handleTrackCancel() {
        this.showTrackBox = false
      },
      checkNum(selection) {
        this.checkNums = selection.length
        this.sels = selection
      },
      getTableData(option) {
        let submitData = {
          roles: [config.UserRole.ROLE_MEMBER],
          getCard: true,
          isStudent: true,
          pageIndex: option.page,
          // pageSize: option.size,
          pageSize: 1000,
        }
        let url = lib.getRequestUrl('/api/member/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          if (res) {
            this.loading = false
            this.current = option.page

            this.total = res.data.total
            let tableData = res.data.member ? lib.filterResult(res.data.member) : []
            tableData.map(item=>{
              var cardArr = lib.array_column(item.card, 'company_course_name')
              item.card_format = cardArr.length > 0 ? cardArr.join('，') : ''
            })
            this.tableData = tableData
          }
        }).catch(error => {
          this.loading = false
          console.log('error',error)

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
      purchase(params) {
        this.$router.push({
          path: 'purchase',
          query: {
            mid: params.row.mid
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
