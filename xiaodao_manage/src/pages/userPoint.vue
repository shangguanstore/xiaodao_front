<template>
  <div>
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>用户资金管理</BreadcrumbItem>
        <BreadcrumbItem>用户积分</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="container staff_container mt20">
      <div>
        <span>搜索查询：</span>
        <Input v-model="searchValue" placeholder="输入用户昵称或手机号" style="width: 300px" @on-change="changeSearch"></Input>
        <Button class="ml20" type="info" @click="search">查询</Button>
      </div>
      <div class="mt20">
        <!--<Button type="info" icon="ios-plus-empty" @click="add">新建用户</Button>-->
        <!--<Button type="default" class="ml20" @click="exportDataDilog()">导出Excel</Button>-->
      </div>
      <Table border ref="selection" :loading="loading" :columns="tableColumns" :data="tableData" class="mt20">></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total" show-total show-sizer show-elevator :current="current" @on-change="changePage"
                @on-page-size-change="changepageSize"></Page>
        </div>
      </div>
    </div>

    <Modal
      v-model="modal"
      title="修改用户积分" @on-ok="changePointModalSubmit('formValidate')">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-position="left" :label-width="70">
        <FormItem label="更改数量" prop="num">
          <Input v-model="formValidate.num" placeholder="请输入变动积分，正数表示增加积分，负数表示减少积分"></Input>
        </FormItem>

        <FormItem label="备注" prop="comment">
          <Input v-model="formValidate.comment" placeholder="备注说明"></Input>
        </FormItem>
      </Form>
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
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'

  export default {
    name: 'userPoint',
    data() {
      return {
        modal: false,
        searchValue: "",
        current: 1,
        pageSize: 10,
        sort: "",
        loading: true,
        total: 0,
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
        tableColumns:
          [
            {
              title: '姓名',
              key: 'uname'
            },
            {
              title: '手机',
              key: 'phone'
            },
            {
              title: '当前积分',
              key: 'num_format'
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
                        this.toChangePoint(params)
                      }
                    }
                  }, '调整积分'),
                ])
              }
            }
          ],
        formValidate: {
          mid: 0,
          num: null,
          comment: ''
        },
        ruleValidate: {
          // num: [
          //     {required: true, type: 'number',message: '请输入积分', trigger: 'blur'}
          // ]
        }

      }
    },
    mounted() {

    },
    created() {
      this.getTableData(
        {
          pageIndex: this.current,
          pageSize: this.pageSize,
        }
      )
    },
    methods: {
      add() {
        this.$router.push({
          path: 'staffEdit',
          query: {}
        })
      },
      exportDataDilog() {
        this.exportDataShow = true
      },
      exportCancle() {
        this.exportDataShow = false
        this.getTableData({
          pageIndex: this.current,
          pageSize: this.pageSize,
        })
      },
      getExportValue() {
        this.getTableData({
          pageIndex: this.current,
          pageSize: this.exportData.exportNum,
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
      getTableData(option) {
        let submitData = {
          search: this.searchValue,
          pageIndex: option.pageIndex,
          pageSize: option.pageSize
        }
        let url = lib.getRequestUrl('/api/point/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          if (res) {
            this.loading = false
            this.current = option.pageIndex

            this.total = res.data.total
            this.tableData = lib.filterResult(res.data.data)
            this.tableData.map(item => {
              item.num_format = parseInt(item.num)
            })
          }
        }).catch(error => {
          console.log('error', error)
          this.loading = false
          this.$Message.error(error.message);
        })
      },
      toChangePoint(params) {
        this.formValidate.num = null
        this.formValidate.mid = params.row.mid,
          this.formValidate.comment = ''
        this.modal = true
      },
      changePointModalSubmit(formValidate) {
        this.$refs[formValidate].validate((valid) => {
          if (valid) {
            let submitData = {
              mid: this.formValidate.mid,
              num: this.formValidate.num,
              comment: this.formValidate.comment
            }
            let url = 'api/change/user/point'
            this.$http.post(url, submitData).then(res => {
              if (res) {
                this.$Message.success('调整积分成功!');

                this.getTableData({
                  pageIndex: this.current,
                  pageSize: this.pageSize
                })
              }
            }).catch(error => {
              console.log('error', error)
              this.loading = false
              this.$Message.error(error.message);
            })
          }
        })
      },
      changePage(page) {
        this.current = page
        this.getTableData(
          {
            pageIndex: this.current,
            pageSize: this.pageSize,
          }
        )
      },
      changepageSize(size) {
        this.pageSize = size
        this.getTableData(
          {
            pageIndex: this.current,
            pageSize: this.pageSize,
          }
        )
      },
      // 编辑页面
      update(params) {
        this.$router.push({
          path: 'staffEdit',
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
                    pageIndex: this.current,
                    pageSize: this.pageSize,
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
          this.$Message.warning('请输入您要查询的员工姓名或手机号！');
        } else {
          this.getTableData({
            pageIndex: this.current,
            pageSize: this.pageSize,
          })
        }
      },
      changeSearch() {
        if (this.searchValue.length === 0) {
          this.getTableData({
            pageIndex: this.current,
            pageSize: this.pageSize,
          })
        }
      },
    },
  }
</script>

<style>

</style>
