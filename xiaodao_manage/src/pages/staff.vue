<template>
	<div>
		<div class="manage_title">
			<Breadcrumb>
				<BreadcrumbItem>内部管理</BreadcrumbItem>
				<BreadcrumbItem>员工管理</BreadcrumbItem>
			</Breadcrumb>
		</div>
		<div class="container staff_container mt20">
			<div>
				<span>搜索查询：</span>
				<Input v-model="searchValue" placeholder="请输入需要查询的名称" style="width: 300px"  @on-change="changeName"></Input>
				<Button class="ml20" type="info"  @click="search">查询</Button>
			</div>
			<div class="mt20">
				<Button type="info" icon="ios-plus-empty" @click="addUser">新建用户</Button>
				<Button type="default" class="ml20" @click="exportDataDilog()">导出Excel</Button>
			</div>
			<Table border ref="selection" :loading="loading"  @on-selection-change="checkNum" :columns="tableColumns" :data="tableData" class="mt20">></Table>
			<div style="margin: 10px;overflow: hidden">
				<div style="float: right;">
					<Page :total="total" show-total show-sizer show-elevator :current="current" @on-change="changePage" @on-page-size-change="changepageSize"></Page>
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
		            	<Input v-model="exportData.exportNum" @on-change="getExportValue" number placeholder="请输入你需要导出的数据，不大于5000条"/>
		            </FormItem>
		        </Form>
	        </div>
	        <div slot="footer">
				<Button type="primary"   @click="exportSubmit('exportLis')">导出</Button>
				<Button type="default"  @click="exportCancle"  style="margin-left: 8px">取消</Button>
			</div>
    	</Modal>
	</div>
</template>

<script>
	import store from '../store'
	import lib from '@/assets/js/lib/index'
	import config from '@/assets/js/config/index'


	// 检验手机号码
	const validatePhone = function(rule, value, callback) {
		if(!(/^1[34578]\d{9}$/.test(value))) {
			return callback(new Error('您输入的手机号码有误'))
		} else {
			callback()
		}
	}
	export default {
		name: 'staff',
		data() {
			return {
				searchValue:"",
				editUser: "新建用户",
				current: 1,
				pageSize: 10,
				sort:"",
				Search:"",
				checkNums: 0,
				sels:[],
				loading: true,
				total: 0,
                exportDataShow:false,
                tableData: [],
                showMessage:false,
                exportData:{
                    exportNum:"",
                },
                exportRule: {
                    exportNum: [{
                        required: true,
                        type: 'number',
                        message: '导出数据不能为空',
                        trigger: 'blur'
                    },
                        { type: 'number', max: 5000, message: '输入大于5000', trigger: 'blur' }],
                },
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
                    					src: params.row.Pic? 'http://pic.eqsfood.com.cn/'+params.row.Pic : 'http://img.7hu.cn/avatar-teacher.jpg',
                					},
									style: {
										width: '58px',
                    					height: '58px',
                    					backgroundColor:"#c6cfe1",
                    					borderRadius:"29px",
                    					margin:"10px 0",
                    					float:"left"
									}
								}),
								h('div', {
									style: {
                    					marginTop:"18px",
                    					marginLeft:"70px",
                    					fontSize:"16px",
                    					color:"rgba(0, 0, 0, 0.85)",
                    					position:"absolute"
									}
								}, (params.row.uname)),
							])
						}
					},
					{
						title: '角色',
						key: 'role_id_format',
					},
					{
						title:'手机',
						key:'phone'
					},
					{
						title:'创建日期',
						key:'create_time_format'
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
		},
		methods: {
            addUser() {
                this.$router.push({
                    path: 'staffEdit',
					query: {
                        // cid: params.row.cid,
                        // mid: params.row.mid
					}
                })
            },
			exportDataDilog(){
				this.exportDataShow = true
			},
			exportCancle(){
				this.exportDataShow = false
				this.getTableData({
					page: this.current,
					size: this.pageSize,
				})
			},
			getExportValue(value){
				this.getTableData({
					page: this.current,
					size: this.exportData.exportNum,
				})
			},
			// 导出数据
			exportSubmit(inventory) {
				this.$refs[inventory].validate((valid) => {
					if(valid) {
						this.$refs.selection.exportCsv({
							filename: '用户列表数据',
							columns: this.tableColumns.filter((col, index) => index < 6),
							data: this.tableData.filter((data, index) => index < 9999)
						})
					}
				})
			},
			closeDialog(){
		 		let timer = null;
		 		clearTimeout(timer)
		 		if(this.showMessage){
		 			timer = setTimeout(() => {
	                   	this.showMessage = false
	                }, 2000)
		 		}
	 		},
			checkNum(selection) {
				this.checkNums = selection.length
				this.sels = selection
			},
			getTableData(option) {
                let submitData = {
                    roles: [config.UserRole.ROLE_ADMIN,config.UserRole.ROLE_FRONT,config.UserRole.ROLE_TEACHER,config.UserRole.ROLE_SALE,config.UserRole.ROLE_ASSIST_TEACHER,config.UserRole.ROLE_MANAGER],
                    pageIndex: option.page,
                    pageSize: option.size,
                }
                let url = lib.getRequestUrl('/api/member/getlist', submitData)
                this.$http.get(url, {}).then(res => {
                    if(res) {
                        this.loading = false
                        this.current = option.page

                        this.total = res.data.total
                        this.tableData = lib.filterResult(res.data.member)
						console.log('tableData',this.tableData)
                    }
                }).catch(error => {
                    this.loading = false
                    this.$Message.error('服务器错误!');
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
                    content: "确认删除"+ params.row.uname +"吗？",
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => {
                        console.log('params',params)
                        let submitData = {
                            mid: params.row.mid,
                            cid: params.row.cid,
                            roles: params.row.role_id,
                        }
                        this.$http.post("/api/member/del", submitData).then(res => {
                            if(res) {
                                this.$Message.success('删除成功!')
                                this.getTableData(
                                    {
                                        page: this.current,
                                        size: this.pageSize,
                                    }
                                )
                            }
                        }).catch(error => {
                            this.$Message.error('服务器错误!')
                        })
                    },
                    onCancel: () => {
                    }
            	})
			},
			search() {
				if(this.searchValue.length == 0) {
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
				if(this.searchValue.length === 0) {
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
