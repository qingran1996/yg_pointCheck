<template>
	<div class="rootuser">
		<el-card class="box-card" shadow="always">
			<el-form :inline="true" :model="user" class="demo-form-inline">
				<el-form-item label="用户名">
					<el-input v-model="user.username" placeholder="请输入用户名" @input="user_username_show" clearable />
				</el-form-item>
				<el-form-item label="人员姓名">
					<el-input v-model="user.name" placeholder="请输入人员姓名" @input="user_name_show" clearable />
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" @click="onSubmit(user)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="box-card" shadow="always">
			<el-row style="margin-bottom: 5px;">
				<el-button type="primary" @click="adduser">新增用户</el-button>
			</el-row>
			<el-table v-loading="loading" :data="tableData" :row-key="getRowKeys" border style="width: 100%" :max-height="tableHeight">
				<!-- <el-table-column type="index" label="序号" width="100" align="center" /> -->
				<el-table-column prop="cid" width="100" label="序号" align="center" fixed>
				</el-table-column>
				<el-table-column prop="username" label="用户名" min-width="180" align="center" />
				<el-table-column prop="name" label="人员姓名" min-width="180" align="center" />
				<el-table-column prop="ip" show-overflow-tooltip label="登录IP" min-width="180" align="center" />
				<!-- <el-table-column prop="createTime" show-overflow-tooltip label="创建时间" min-width="180" align="center" />
				<el-table-column prop="updateTime" show-overflow-tooltip label="更新时间" min-width="180" align="center" /> -->
				<el-table-column fixed="right" label="操作" min-width="180" align="center">
					<template slot-scope="scope">
						<div class="action">
							<el-tooltip class="item" effect="dark" content="角色配置" placement="bottom">
								<el-tag @click="lookList(scope.row)">角色配置</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="删除" placement="bottom">
								<el-tag @click="deleteList(scope.row)" type="danger">删除</el-tag>
							</el-tooltip>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页器 -->
			<div class="block" style="margin-top:15px;" v-show="showpage">
				<el-pagination v-show="total!==0" align="center" :current-page="currentPage" :page-sizes="[5,10,20]" :page-size="pageSize"
				 layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</div>
		</el-card>
		<!-- 配置角色 -->
		<userEdit></userEdit>
		<!-- 新增 -->
		<userAdd></userAdd>
	</div>
</template>

<script>
	import userEdit from "../rootAction/userEdit.vue"
	import userAdd from "../rootAction/userAdd.vue"
	export default {
		name: 'Rootuser',
		components: {
			userEdit,
			userAdd
		},
		data() {
			return {
				// 筛选
				user: {
					name: '',
					personName: ''
				},
				loading: false,
				tableHeight: document.body.clientHeight - 84 - 36 - 50 - 152, // 表格高度
				currentPage: 1,
				pageSize: 10,
				totalPages: 0,
				jsonData: {
					userName: '',
					name: "",
					pageNo: 1,
					pageSize: 10
				},
				total: 1,
				showpage: true,
				//展示参数表，并未实际应用
				tableData: [],
			}
		},
		destroyed() {
			// this.$bus.off('roleTable_update')
			this.$bus.off('userAdd')
			this.$bus.off('userLook')
			// this.$bus.off('roleUpdate')
		},
		created() {
			// this.getTable() //获取table数据
			this.$bus.$on("userTable_update", msg => {
				// this.currentPage = 1
				// this.jsonData.pageNo = 1
				this.getTable() //请求数据
			});
		},
		methods: {
			user_username_show(event) {
				this.jsonData.userName = event
			},
			user_name_show(event) {
				this.jsonData.name = event
			},
			onSubmit(item) {
				this.jsonData.pageNo = 1
				this.jsonData.pageSize = 10
				this.getTable()
			},
			//新增角色
			adduser() {
				this.$bus.$emit('userAdd', true)
				//this.$bus.$emit('roleAdd', true)
			},
			//查看
			lookList(row) {
				this.$bus.$emit('userLook', row)
			},
			//删除
			deleteList(row) {
				// console.log(row)
				this.$confirm('是否删除该用户?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deletedata(row)
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			deletedata(row) {
				let addJson = {
					userName: row.username
				}
				//console.log(addJson)
				this.$axios.post('/u/user/delete', addJson).then(res => {
					if (res.data.code === 0) {
						this.$notify({
							title: res.data.message,
							message: '删除成功',
							type: 'success'
						});
						//console.log(this.tableData)
						// if (this.tableData.length-1==0&&this.jsonData.pageNo==this.totalPages) {
						// 	this.jsonData.pageNo = this.totalPages-1
						// }
						this.currentPage = this.deleteLastPageData(this.total, this.pageSize, this.currentPage)
						this.jsonData.pageNo = this.currentPage
						this.getTable()
					} else {
						this.$notify.error({
							title: '删除失败',
							message: res.data.message
						});
					}
					// let data = res.data.message
					//console.log(res.data)
				})
			},
			getRowKeys(row) {
				return row.cid; // cid为列表数据的唯一标识
			},
			//获取table数据
			getTable() {
				this.getNetworkPerson(this.jsonData).then(res => {
					if (res.data.code === 0) { //查询到数据
						//console.log(res)
						let data = res.data.data.content
						console.log('用户管理请求------->', data)
						// this.numberPage = res.data.data.number
						//console.log('当前页数数据数量', this.numberPage)
						this.loading = true
						let that = this
						that.tableData = []
						setTimeout(function() {
							if (data.length !== 0) { //如果请求数据不为空
								that.total = res.data.data.totalElements //列表总数
								that.totalPages = res.data.data.totalPages
								for (var i = 0; i < data.length; i++) {
									that.tableData.push({
										cid: that.jsonData.pageNo * that.jsonData.pageSize - that.jsonData.pageSize + i + 1,
										id: data[i].id,
										username: data[i].userName,
										name: data[i].name,
										ip: data[i].lastLoginIp,
										createTime: data[i].createTime,
										updateTime: data[i].updateTime
									})
								}
								//console.log('表', that.tableData)
							} else {
								that.tableData = []
								that.total = 0
							}
							that.loading = false //要执行的事件
						}, 500) //500代表延迟毫秒值
						this.tableData = [] //每次默认置空
					} else {
						this.$notify.error({
							title: '请求失败',
							message: res.data.message
						})
						this.tableData = []
					}

				})
			},
			handleSizeChange(val) {
				//console.log(`每页 ${val} 条`)
				this.currentPage = 1
				this.pageSize = val
				this.jsonData.pageSize = val
				this.jsonData.pageNo = 1
				this.getTable()
			},
			handleCurrentChange(val) {
				//console.log(`当前页: ${val}`)
				this.currentPage = val
				this.jsonData.pageNo = val
				this.getTable()
			},
		}
	}
</script>
<style scoped>
	.rootuser {
		padding: 10px;
	}
</style>
