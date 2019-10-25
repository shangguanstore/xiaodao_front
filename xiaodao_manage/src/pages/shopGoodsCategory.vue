<template>
  <div>
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>积分商城</BreadcrumbItem>
        <BreadcrumbItem>商品分类管理</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="container shop_goods_container mt20">
      <div>
        <Button type="info" icon="ios-plus-empty" @click="preAddCategory">新添分类</Button>
      </div>

      <Row>
        <Col span="12">
        <Table border ref="selection" :loading="loading" :columns="tableColumns" :data="tableData" class="mt20">></Table>
        </Col>
      </Row>

      <!--<div style="margin: 10px;overflow: hidden">-->
        <!--<div style="float: right;">-->
          <!--<Page :total="total" show-total show-sizer show-elevator :current="current" @on-change="changePage"-->
                <!--@on-page-size-change="changepageSize"></Page>-->
        <!--</div>-->
      <!--</div>-->
    </div>

  </div>
</template>

<script>
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'

  export default {
    name: 'shopGoodsCategory',
    data() {
      return {
        config: {},
        searchValue: "",
        current: 1,
        pageSize: 10,
        sort: "",
        loading: true,
        total: 0,
        exportDataShow: false,
        tableData: [],
        showMessage: false,

        inventoryFormValidate: {
          goods_name: '',
          goods_id: '',
          type: config.ShopStorageChangeDetail.TYPE_IN,
          num: '',
          comment: ''
        },
        inventoryRuleValidate: {},
        showInventoryBox: false,
        inventoryBtnLoading: false,

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
              title: '类别名称',
              key: 'name'
            },
            {
              title: '商品数量',
              key: 'goodsNum'
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
      this.config = config
      this.getTableData(
        {
          pageIndex: this.current,
          pageSize: this.pageSize,
        }
      )
    },
    methods: {
      preAddCategory() {
        this.addCategoryName = ''
        this.$Modal.confirm({
          render: (h) => {
            return h('div', [
              h('p', {
                style: {
                  textAlign: 'left',
                  fontSize: '16px',
                  marginBottom: '20px'
                },
              }, '新添分类'),
              h('Input', {
                props: {
                  value: this.value,
                  autofocus: true,
                  placeholder: '请输入'
                },
                on: {
                  input: (val) => {
                    this.addCategoryName = val;
                  },
                }
              }),
            ])
          },
          onOk: () => {
            this.addCategory()
          }
        })
      },
      addCategory() {
        let submitData = {
          name: this.addCategoryName
        }
        let url = '/api/shop/goods/category/add'
        this.$http.post(url, submitData).then(res => {
          if (res.data.errNo == 100000) {
            this.$Message.success('添加分类成功!')
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
      getTableData(option) {
        let submitData = {
          getGoodsNum: true
          // search: this.searchValue,
          // pageIndex: option.pageIndex,
          // pageSize: option.pageSize,
        }
        let url = '/api/shop/goods/category/getlist'
        this.$http.post(url, submitData).then(res => {
          if (res) {
            this.loading = false
            this.current = option.pageIndex

            this.total = res.data.total
            this.tableData = lib.filterResult(res.data.data)
          }
        }).catch(error => {
          console.log('error', error)
          this.loading = false
          this.$Message.error(error.message);
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
      remove(params) {
        this.$Modal.confirm({
          title: '删除',
          content: "确认删除" + params.row.name + "吗？",
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            console.log('params', params)
            let submitData = {
              id: params.row.id
            }
            this.$http.post("/api/shop/goods/category/del", submitData).then(res => {
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
          this.$Message.warning('请输入您要查询的商品名称！');
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
