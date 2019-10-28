<template>
  <div>
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>积分商城管理</BreadcrumbItem>
        <BreadcrumbItem>商城Banner</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="container shop_banner_container mt20">
      <div class="mt20">
        <Button type="info" icon="ios-plus-empty" @click="add">添加banner</Button>
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
      v-model="showBannerModal"
      width:="480"
      :styles="{top: '200px'}"
    >
      <p slot="header">
        <span>{{modalTitle}}</span>
      </p>

      <div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" class="mt20">
          <fileUpload v-if="!loading && formValidate.imglink" :imglink="formValidate.imglink" label="轮播图片" :limit="1"
                      v-on:fileupload="imglinkFileUpload"></fileUpload>

          <FormItem label="跳转内容" prop="content_id">
            <Select v-model="formValidate.content_id">
              <Option v-for="item in goodsList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>

          <FormItem label="排序" prop="sort">
            <Input v-model="formValidate.sort" placeholder="banner顺序,数值越大越靠前"></Input>
          </FormItem>
          <p style="margin-bottom: 24px;margin-top: -12px;margin-left: 86px;color: #666666;font-size: 12px;">
            *&nbsp;数值越大，排序越靠前，值相等时按添加时间排序
          </p>
        </Form>
      </div>

      <div slot="footer">
        <Button type="default" @click="handleCancel" style="margin-left: 8px">取消</Button>
        <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
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
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'
  import fileUpload from '@/components/fileUpload'

  export default {
    name: 'shopBanner',
    components: {
      fileUpload
    },
    data() {
      return {
        showBannerModal: false,
        modalTitle: '',
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
              title: '图片',
              key: 'imglink_format',
              render: (h, params) => {
                return h('div', [
                  h('img', {
                    attrs: {
                      src: params.row.imglink_format ? params.row.imglink_format : 'http://img.7hu.cn/avatar-student.jpg',
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
              title: 'banner类别',
              key: 'type_format'
            },
            {
              title: '跳转',
              key: 'goodsName'
            },
            {
              title: '排序',
              key: 'sort'
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

    },
    created() {
      this.getTableData(
        {
          pageIndex: this.current,
          pageSize: this.pageSize,
        }
      )

      this.getGoodsList()
    },
    methods: {
      add() {
        this.showBannerModal = true
        this.modalTitle = '添加轮播图'
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
      getGoodsList(option) {
        let submitData = {
        }
        let url = `/api/shop/goods/getlist`
        this.$http.post(url, submitData).then(res => {
          if (res) {
            this.goodsList = lib.filterResult(res.data.data)
          }
        }).catch(error => {
          this.$Message.error(error.message);
        })
      },
      getTableData(option) {
        let submitData = {
          pageIndex: option.pageIndex,
          pageSize: option.pageSize,
        }
        let url = `/api/shop/banner/getlist`
        this.$http.post(url, submitData).then(res => {
          if (res) {
            this.current = option.pageIndex

            this.total = res.data.total
            let list = lib.filterResult(res.data.data)
            list.map(item=>{
              item.type_format = item.type == config.ShopBanner.TYPE_GOODS ? '商品' : ''
              return item
            })
            this.tableData = list

            this.loading = false
          }
        }).catch(error => {
          console.log('error', error)
          this.loading = false
          this.$Message.error(error.message);
        })
      },
      handleSubmit(inventory) {
        this.$refs[inventory].validate((valid) => {
          if(valid) {
            let submitData = {
              content_id: this.formValidate.content_id,
              type: config.ShopBanner.TYPE_GOODS,
              sort: this.formValidate.sort,
              imglink: this.formValidate.imglink
            }

            let url
            if(this.formValidate.id) {
              url = 'api/shop/banner/update'
              submitData.id = this.formValidate.id
            }else{
              url = 'api/shop/banner/add'
            }

            this.$http.post(url, submitData).then(res => {
              if(res) {
                let message = this.isAdd ? '添加成功' : '修改成功'
                this.$Message.success(message);

                this.getTableData({
                  pageIndex: this.current,
                  pageSize: this.pageSize,
                })

                this.showBannerModal = false
              }
            }).catch(error => {
              this.$Message.error(error.message);
            })
          }
        })
      },
      handleCancel() {
        this.showBannerModal = false
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
        // this.formValidate.id = params.row.id
        // this.formValidate.imglink = params.row.imglink
        // this.formValidate.content_id = params.row.content_id
        // this.formValidate.sort = params.row.sort

        this.formValidate = params.row

        this.showBannerModal = true
        this.modalTitle = '编辑轮播图'
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
