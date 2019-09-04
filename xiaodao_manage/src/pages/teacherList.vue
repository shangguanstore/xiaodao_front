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
  export default {
    name: 'teacherList',
    data() {
      return {
        loading: true,

        current: 1,
        pageSize: 10,
        sort: "",
        Search: "",
        total: 0,

        tableData: [],
        tableColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '教授科目',
            key: 'type'
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
      // this.getTableData(
      //   {
      //     page: this.current,
      //     size: this.pageSize,
      //   }
      // )
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
    },
  }
</script>
<style>

</style>
