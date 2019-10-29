<template>
  <div>
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>手机端设置</BreadcrumbItem>
        <BreadcrumbItem>Banner设置</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="container activity_container mt20">
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
        name: 'weWebsite',
        data() {
            return {
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
                                            src: params.row.imglink_format? params.row.imglink_format : 'http://img.7hu.cn/avatar-student.jpg',
                                        },
                                        style: {
                                            width: '80px',
                                            backgroundColor:"#c6cfe1",
                                            margin:"6px 0",
                                            float:"left"
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
                            key: 'name'
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
        },
        methods: {
            add() {
                this.$router.push({
                    path: 'weWebsiteBannerEdit',
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
                    cid: this.$store.state.cid,
                }
                let url = lib.getRequestUrl('/api/mbanner/getlist', submitData)
                this.$http.get(url, {}).then(res => {
                    if (res) {
                        this.loading = false
                        this.current = option.pageIndex

                        this.total = res.data.total
                        res.data.Data.map(function(item){
                            item.type_format = item.type == config.Mbanner.TYPE_ACTIVITY ? '活动' : ''
                            item.imglink_format = lib.getImglink(item.imglink)[0]
                            return item
                        })
                        this.tableData = lib.filterResult(res.data.Data)
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
                this.$router.push({
                    path: 'weWebsiteBannerEdit',
                    query: {
                        id: params.row.id,
                        imglink: params.row.imglink
                    }
                })
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
                        this.$http.post("/api/mbanner/del", submitData).then(res => {
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
