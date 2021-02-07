<template>
	<div class="rootrole">
		<el-card class="box-card" shadow="always">
			<el-row style="margin-bottom: 5px;">
				<el-button type="primary" @click="addrole">新增</el-button>
			</el-row>
			<el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight">
				<el-table-column type="index" label="序号" width="100" align="center" />
				<el-table-column prop="rolename" label="角色名称" min-width="180" align="center" />
				<el-table-column prop="number" label="排列顺序" min-width="180" align="center" />
				<el-table-column fixed="right" label="操作" min-width="180" align="center">
					<template slot-scope="scope">
						<div class="action">
							<el-tooltip class="item" effect="dark" content="人员查看" placement="bottom">
								<el-tag @click="userList(scope.row)" type="success">人员查看</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="菜单权限" placement="bottom">
								<el-tag @click="lookList(scope.row)">菜单权限</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="流程权限" placement="bottom">
								<el-tag type="warning" @click="processRole(scope.row)">流程权限</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
								<el-tag @click="updateList(scope.row)">编辑</el-tag>
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
		<!-- 新增 -->
		<addDialog></addDialog>
		<!-- 查看 -->
		<lookDialog></lookDialog>
		<!-- 修改 -->
		<editDialog></editDialog>
		<!-- 查看人员 -->
		<roleuserDialog></roleuserDialog>
		<roleProcess />
	</div>
</template>

<script>
	import addDialog from '../rootAction/addDialog.vue'
	import lookDialog from '../rootAction/lookDialog.vue'
	import editDialog from '../rootAction/editDialog'
	import roleuserDialog from '../rootAction/roleUser'
	import roleProcess from '@/views/root/rootAction/roleProcess'
	export default {
		name: 'Rootrole',
		components: {
			addDialog,
			lookDialog,
			editDialog,
			roleuserDialog,
			roleProcess
		},
		data() {
			return {
				loading: false,
				tableHeight: document.body.clientHeight - 84 - 36 - 50 - 152, // 表格高度
				currentPage: 1,
				pageSize: 10,
				jsonData: {
					roleName: "",
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
			this.$bus.off('roleTable_update')
			this.$bus.off('roleAdd')
			this.$bus.off('roleLook')
			this.$bus.off('roleUpdate')
			this.$bus.off('roleuser')
			this.$bus.off('roleProcess')
		},
		created() {
			// this.getTable() //获取table数据
			this.$bus.$on("roleTable_update", msg => {
				// this.currentPage = 1
				// this.jsonData.pageNo = 1
				this.getTable() //请求数据
			});

		},
		methods: {
			//新增角色
			addrole() {
				this.$bus.$emit('roleAdd', true)
			},
			userList(row) {
				//console.log(row)
				this.$bus.$emit('roleuser', row.rolename)
			},
			//查看
			lookList(row) {
				this.$bus.$emit('roleLook', row)
			},
			//流程权限配置
			processRole(row) {
				this.$bus.emit('roleProcess', row)
			},
			//编辑
			updateList(row) {
				this.$bus.$emit('roleUpdate', row)
			},
			//获取table数据
			getTable() {
				this.$axios.post('/u/role/query', this.jsonData).then(res => {
					if (res.data.code === 0) { //查询到数据
						//console.log(res)
						let data = res.data.data.content
						console.log('角色管理请求------->', res)
						// this.numberPage = res.data.data.number
						//console.log('当前页数数据数量', this.numberPage)
						this.loading = true
						this.pageSize = res.data.data.size
						this.jsonData.pageSize = res.data.data.size
						this.currentPage = res.data.data.number + 1
						this.jsonData.pageNo = res.data.data.number + 1
						let that = this
						that.tableData = []
						setTimeout(function() {
							if (data.length !== 0) { //如果请求数据不为空
								that.total = res.data.data.totalElements //列表总数
								for (var i = 0; i < data.length; i++) {
									that.tableData.push({
										id: data[i].id,
										rolename: data[i].roleName,
										number: data[i].orderNo
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
			//删除
			deleteList(row) {
				this.$confirm('是否删除该角色?', '提示', {
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
				//console.log(row)
				let addJson = {
					id: row.id
				}
				//console.log(addJson)
				this.$axios.post('/u/role/delete', addJson).then(res => {
					if (res.data.code === 0) {
						this.$notify({
							title: res.data.message,
							message: '删除成功',
							type: 'success'
						});

						this.currentPage = this.deleteLastPageData(this.total, this.pageSize, this.currentPage)
						this.jsonData.pageNo = this.currentPage
						this.getTable()
					} else {
						this.$notify.error({
							title: '删除失败',
							message: res.data.message
						});
					}
				})
			},
			handleSizeChange(val) {
				//console.log(`每页 ${val} 条`)
				this.jsonData.pageSize = val
				this.pageSize = val
				this.getTable()
			},
			handleCurrentChange(val) {
				//console.log(`当前页: ${val}`)
				this.jsonData.pageNo = val
				this.currentPage = val
				this.getTable()
			},
		}
	}
</script>
<style scoped>
	.rootrole {
		padding: 10px;
	}
</style>
