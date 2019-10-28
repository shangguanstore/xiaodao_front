<template>
  <div>
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>积分商城管理</BreadcrumbItem>
        <BreadcrumbItem>订单管理</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="container shop_order_container mt20">
      <Table border ref="selection" :loading="loading" :columns="tableColumns" :data="tableData" class="mt20">></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="total" show-total show-sizer show-elevator :current="current" @on-change="changePage"
                @on-page-size-change="changepageSize"></Page>
        </div>
      </div>
    </div>

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
  import fileUpload from '@/components/fileUpload'

  export default {
    name: 'shopOrder',
    components: {
      fileUpload
    },
    data() {
      return {
        formValidate: {},
        ruleValidate: {},
        goodsList: [],

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
              title: '订单号',
              key: 'sale_no'
            },
            {
              title: '图片',
              key: 'imglink_format',
              render: (h, params) => {
                return h('div', [
                  h('img', {
                    attrs: {
                      src: params.row.imglink_format,
                    },
                    style: {
                      width: '80px',
                      backgroundColor: "#c6cfe1",
                      margin: "6px 0",
                      float: "left"
                    }
                  }),
                ])
              }
            },
            {
              title: '订单状态',
              key: 'order_status_string'
            },
            {
              title: '姓名',
              key: 'uname'
            },
            {
              title: '手机号',
              key: 'phone'
            },
            {
              title: '订单金额',
              key: 'order_amount'
            },
            {
              title: '支付金额',
              key: 'payment_amount'
            },
            // {
            //   title: '商品',
            //   key: 'goods_format'
            // },
            {
              title: '创建日期',
              key: 'create_time_format'
            },
            // {
            //   title: '操作',
            //   key: 'operation',
            //   render: (h, params) => {
            //     return h('div', [
            //       h('Button', {
            //         props: {
            //           type: 'text',
            //           size: 'small',
            //         },
            //         style: {
            //           color: '#2db7f5'
            //         },
            //         on: {
            //           click: () => {
            //             this.update(params)
            //           }
            //         }
            //       }, '编辑'),
            //       h('Button', {
            //         props: {
            //           type: 'text',
            //           size: 'small',
            //         },
            //         style: {
            //           color: '#2db7f5'
            //         },
            //         on: {
            //           click: () => {
            //             this.remove(params)
            //           }
            //         }
            //       }, '删除'),
            //     ])
            //   }
            // }
          ],
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
              filename: '活动列表数据',
              columns: this.tableColumns.filter((col, index) => index < 6),
              data: this.tableData.filter((data, index) => index < 9999)
            })
          }
        })
      },
      getTableData(option) {
        let submitData = {
          pageIndex: option.pageIndex,
          pageSize: option.pageSize,
          getOrderGoods: true
        }
        let url = `/api/shop/order/getlist`
        this.$http.post(url, submitData).then(res => {
          if (res) {
            this.current = option.pageIndex

            this.total = res.data.total
            let list = lib.filterResult(res.data.data)

            list.map(item=>{
              if(item.payment_point) {
                item.order_amount = `${item.order_point_format}（积分）`
                item.payment_amount = `${item.payment_point_format}（积分）`
              }else if(item.payment_money) {
                item.order_amount = `${item.order_money_format}（元）`
                item.payment_amount = `${item.payment_money_format}（元）`
              }

              item.imglink_format = lib.getImglink(item.orderGoods[0].imglink)[0]

            })

            console.log('list',list)

            this.tableData = list
            this.loading = false
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
      // 编辑页面
      update(params) {

      },
      remove(params) {
        this.$Modal.confirm({
          title: '删除',
          content: "确认删除吗？",
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            console.log('params', params)
            let submitData = {
              id: params.row.id
            }
            this.$http.post("/api/shop/banner/del", submitData).then(res => {
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
      imglinkFileUpload(uploadfile) {
        this.formValidate.imglink = lib.getUpdateUploadPicStr(uploadfile)
      },
    },
  }
</script>

<style>

</style>
