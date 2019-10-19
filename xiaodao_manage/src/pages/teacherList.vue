<template>
  <div class="teacher_list_container">
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>教务中心</BreadcrumbItem>
        <BreadcrumbItem>老师列表</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div class="container mt20">
      <div class="search_container">
        <Row :gutter="20">
          <Col span="6">
          <span>按姓名搜索：</span>
          <Input v-model="searchValue" placeholder="请输入课程名称" style="width: 200px"
                 @on-change="changeSearch"></Input>
          <Button class="ml20" type="info" @click="search">查询</Button>
          </Col>

          <!--<Col span="6">-->
          <!--<span>课程状态：</span>-->
          <!--<Select v-model="model1" style="width:calc(100% - 120px);">-->
            <!--<Option v-for="item in teacherList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
          <!--</Select>-->
          <!--</Col>-->

        </Row>
      </div>

      <div class="mt20">
        <Button type="info" icon="ios-plus-empty" @click="add">添加老师</Button>
        <!--<Button type="default" class="ml20" @click="exportDataDilog()">新建通用课程</Button>-->
      </div>

      <Table border ref="selection" :loading="loading" :columns="tableColumns"
             :data="tableData" class="mt20">
      </Table>

      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total" show-total show-sizer show-elevator :current="current" @on-change="changePage"
                @on-page-size-change="changepageSize"></Page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'

  export default {
    name: 'teacherList',
    data() {
      return {
        loading: true,
        model1: 0,

        current: 1,
        pageSize: 10,
        sort: "",
        searchValue: "",
        total: 0,

        tableData: [],
        tableColumns: [
          // {
          //   type: 'selection',
          //   width: 60,
          //   align: 'center'
          // },
          {
            title: '姓名',
            key: 'uname'
          },
          {
            title: '角色',
            key: 'role_id_format'
          },
          {
            title: '教授科目',
            key: 'subject_format'
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
    created() {
      this.getTableData(
        {
          page: this.current,
          size: this.pageSize,
        }
      )
    },
    mounted(){

    },
    methods: {
      add() {
        this.$router.push({
          path: 'teacherEdit',
          query: {}
        })
      },
      update(params) {
        this.$router.push({
          path: 'teacherEdit',
          query: {
            mid: params.row.mid
          }
        })
      },

      getTableData(option) {
        let submitData = {
          roles: option.roles ? option.roles : [config.UserRole.ROLE_TEACHER, config.UserRole.ROLE_ASSIST_TEACHER, config.UserRole.ROLE_CLASS_TEACHER],
          getSubject: true,
          search: this.searchValue,
          pageIndex: option.page,
          pageSize: option.size,
        }
        let url = lib.getRequestUrl('/api/member/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          if (res) {
            this.loading = false
            this.current = option.pageIndex

            this.total = res.data.total
            this.tableData = lib.filterResult(res.data.member)

            console.log('this.tableData', this.tableData)

          }
        }).catch(error => {
          this.loading = false
          this.$Message.error(error.message);
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
      changeSearch() {
        if (this.searchValue.length === 0) {
          this.getTableData({
            page: this.current,
            size: this.pageSize,
          })
        }
      },
      search() {
        if (this.searchValue.length == 0) {
          this.$Message.warning('请输入您要查询教师姓名！');
        } else {
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
