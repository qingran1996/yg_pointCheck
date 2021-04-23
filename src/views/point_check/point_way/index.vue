<template>
	<div class="pointWay">
		<el-card class="box-card" shadow="always">
			<el-form :inline="true" :model="user" class="demo-form-inline">
				<el-form-item label="路线名称">
					<el-input v-model="user.wayName" placeholder="请输入路线名称" @input="user_wayName_show" clearable />
				</el-form-item>
				<el-form-item label="所属部门">
					<el-select v-model="user.dept" placeholder="请选择所属部门" @change="dept_change">
						<el-option v-for="item in deptData" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属条线">
					<el-select v-model="user.belongToWay" placeholder="请选择所属条线" @change="belongToWay_change">
						<el-option v-for="item in belongToWayData" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="user.state" placeholder="请选择状态" @change="state_change">
						<el-option v-for="item in stateData" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button v-prevent-re-click size="small" type="primary" @click="onSubmit(user)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="box-card" shadow="always">
			<el-row style="margin-bottom: 5px;">
				<el-button type="primary" @click="addRoute">新增</el-button>
				<el-button type="danger" @click="deleteRoute">删除</el-button>
			</el-row>
			<el-table v-loading="loading" :data="tableData" :row-key="getRowKeys" border style="width: 100%"
				:max-height="tableHeight">
				<!-- <el-table-column type="index" label="序号" width="100" align="center" /> -->
				<el-table-column prop="cid" width="100" label="序号" align="center" fixed>
				</el-table-column>
				<el-table-column prop="wayName" show-overflow-tooltip label="路线名称" min-width="180" align="center" />
				<el-table-column prop="dept" show-overflow-tooltip label="所属部门" min-width="180" align="center" />
				<el-table-column prop="belongToWay" show-overflow-tooltip label="所属条线" min-width="180" align="center" />
				<el-table-column prop="createTime" show-overflow-tooltip label="创建时间" min-width="180" align="center" />
				<el-table-column prop="createMan" show-overflow-tooltip label="创建人" min-width="180" align="center" />
				<el-table-column prop="state" show-overflow-tooltip label="状态" min-width="180" align="center" />
				<el-table-column fixed="right" label="操作" min-width="180" align="center">
					<template slot-scope="scope">
						<div class="action">
							<el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
								<el-tag @click="updateList(scope.row)">编辑</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="详情" placement="bottom">
								<el-tag @click="lookList(scope.row)">详情</el-tag>
							</el-tooltip>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<vxe-modal v-model="showEdit" :title="selectRow ? '点检计划编辑&保存' : '点检计划新增&保存'" width="800" min-width="600"
				min-height="300" :loading="submitLoading" resize destroy-on-close @close="closemodel">
				<template #default>
					<vxe-form :data="formData" :rules="formRules" title-align="right" title-width="150"
						@submit="submitEvent">
						<vxe-form-item title="路线名称" field="name" span="12" :item-render="{}">
							<template #default>
								<el-input @change="name_show" placeholder="请输入路线名称"
									v-model="formData.name">
								</el-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="条线名称" field="line" span="12" :item-render="{}">
							<template #default>
								<el-select multiple v-model="formData.line" placeholder="请选择条线" @change="line_change">
									<el-option v-for="item in lineData" :key="item.value" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</template>
						</vxe-form-item>
						<!-- <vxe-form-item title="点检路线" field="way" span="12" :item-render="{}">
							<template #default>
								<el-select v-model="formData.way" placeholder="请选择路线" @change="way_change">
									<el-option v-for="item in belongToWayData" :key="item.value" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</template>
						</vxe-form-item> -->
						<vxe-form-item title="备注" field="note" span="12" :item-render="{}">
							<template #default>
								<el-input @change="note_show" type="textarea" :rows="2" placeholder="请输入备注"
									v-model="formData.note">
								</el-input>
							</template>
						</vxe-form-item>
						<vxe-form-item align="center" span="24" :item-render="{}">
							<template #default>
								<vxe-button type="submit" status="primary">确定</vxe-button>
								<vxe-button type="reset">重置</vxe-button>
							</template>
						</vxe-form-item>
					</vxe-form>
				</template>
			</vxe-modal>
			<!-- 分页器 -->
			<div class="block" style="margin-top:15px;" v-show="showpage">
				<el-pagination v-show="total!==0" align="center" :current-page="currentPage" :page-sizes="[5,10,20]"
					:page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
					@size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</div>
		</el-card>
		<!-- 点检新增 -->
		<!-- <pointWayAdd :isshow="addType" @closedialog="closedialog"></pointWayAdd> -->
	</div>
</template>

<script>
	// import pointWayAdd from './pointWayAdd.vue'
	export default {
		name: 'pointWay',
		components: {
			// pointWayAdd
		},
		data() {
			return {
				submitLoading: false,
				selectRow: null,
				showEdit: false,
				formData: {
					name: null,
					line: null,
					lineManager: null,
					deptName: null,
					routeStatus: null,
					area: null,
					note: null
				},
				formRules: {
					name: [{
						required: true,
						message: '请输入路线名称'
					}],
					line: [{
						required: true,
						message: '请选择条线'
					}],
					lineManager: [{
						required: true,
						message: '请输入条线主管'
					}],
					startDate: [{
						required: true,
						message: '请选择开始时间'
					}],
					endDate: [{
						required: true,
						message: '请选择开始时间'
					}],
					advanceLong: [{
						required: true,
						message: '请选择提前多久提醒'
					}],
				},
				addType: false,
				// 筛选
				user: {
					name: '',
					username: '',
					wayName: '',
					dept: '',
					belongToWay: '',
					state: '1'
				},
				loading: false,
				tableHeight: document.body.clientHeight - 84 - 36 - 50 - 152, // 表格高度
				currentPage: 1,
				pageSize: 10,
				totalPages: 0,
				total: 1,
				showpage: true,
				//展示参数表，并未实际应用
				tableData: [],
				belongToWayData: [],
				deptData: [{
					value: '1',
					label: '部门1'
				}, {
					value: '2',
					label: '部门2'
				}],
				lineData: [{
					value: '1',
					label: '条线1'
				}, {
					value: '2',
					label: '条线2'
				},{
					value: '3',
					label: '条线3'
				}, {
					value: '4',
					label: '条线4'
				}],
				stateData: [{
					value: '1',
					label: '启用'
				}, {
					value: '2',
					label: '禁用'
				}],
				jsonData: {
					pageNo: 1,
					pageSize: 10
				},
				addJson: {
					createrId: JSON.parse(localStorage.getItem('userId')),
					routeId: '',
					name: '',
					lineId: '',
					lineName: '',
					depteId: '',
					deptName: '',
					routeStatus: '',
					areaIds: '',
					note: ''
				}
			}
		},
		created() {
			//查询点检路线
			this.getData()
		},
		beforeDestroyed() {
			this.$bus.off()
			console.log(11)
		},
		methods: {
			name_show (event) {
				
			},
			line_change (event) {
				console.log(event)
			},
			note_show (event) {
				
			},
			closemodel() {
				// console.log('关闭对话框')
				this.checked = true
			},
			submitEvent() {
				this.submitLoading = true
				setTimeout(() => {
					this.submitLoading = false
					this.showEdit = false
					if (this.selectRow) {
						this.updateMock()
						Object.assign(this.selectRow, this.formData)
					} else {
						this.addMock()
					}
				}, 500)
			},
			addMock() {
				// this.pointPlanAdd(this.addJson).then(res => {
				// 	if (res.data.code === 0) {
				// 		this.$message({
				// 			message: res.data.message,
				// 			type: 'success'
				// 		})
				// 		this.addJson = {
				// 			createrId: localStorage.getItem('userId'),
				// 			routeId: '',
				// 			deptId: '',
				// 			lineManagerId: '',
				// 			cycle: '',
				// 			planStart: '',
				// 			planEnd: '',
				// 			planLong: '',
				// 			advanceLong: '',
				// 			note: ''
				// 		}
				// 		this.getTable()
				// 	} else {
				// 		this.$message({
				// 			message: res.data.message,
				// 			type: 'warning'
				// 		})
				// 	}
				// })
			},
			updateMock() {
			
			},
			//查询点检路线
			getData() {
				this.pointWayData(this.jsonData).then(res => {
					if (res.data.code === 0) { //查询到数据
						//console.log(res)
						let data = res.data.data.content
						console.log('点检路线列表', data)
						this.numberPage = res.data.data.number
						//console.log('当前页数数据数量', this.numberPage)
						this.loading = true
						let that = this
						setTimeout(function() {
							if (data.length !== 0) { //如果请求数据不为空
								that.total = res.data.data.totalElements //列表总数
								for (var i = 0; i < data.length; i++) {
									var obj = {}
									obj.cid = that.jsonData.pageNo * that.jsonData.pageSize - that
										.jsonData.pageSize + i + 1
										obj.data = data[i]
										obj.wayName = data[i].routeName
										obj.dept = data[i].deptName
										obj.belongToWay = data[i].lineName
										obj.createTime = that.formatDate(data[i].createTime)
										obj.createMan = ''
										obj.state = data[i].status
									// obj.dept = data[i].deptName
									// obj.startTime = that.formatDate(data[i].planStart)
									// obj.endTime = that.formatDate(data[i].planEnd)
									// obj.week = data[i].cycle
									// obj.hour = data[i].planLong
									// obj.state = data[i].isActived == 1 ? '激活' : '禁用'
									that.tableData.push(obj)
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
			//路线名称
			user_wayName_show(event) {
				this.jsonData.wayName = event
			},
			//所属部门选择
			dept_change() {
				// this.jsonData.dept = ''
			},
			//所属条线选择
			belongToWay_change() {
				// this.jsonData.dept = event
			},
			//状态选择
			state_change() {

			},
			getRowKeys(row) {
				return row.cid; // cid为列表数据的唯一标识
			},
			addRoute() {
				this.formData = {
					name: null,
					line: null,
					lineManager: null,
					deptName: null,
					routeStatus: null,
					area: null,
					note: null
				}
				this.selectRow = null
				this.showEdit = true
			},
			deleteRoute() {

			},
			updateList() {},
			lookList() {},
			pzplan() {},
			onSubmit(item) {
				console.log(123)
				// this.jsonData.pageNo = 1
				// this.jsonData.pageSize = 10
				// this.getTable()
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
			//父子组件传值，控制隐藏显示
			closedialog(val) {
				console.log('oo')
				this.addType = val
			}
		}
	}
</script>
<style scoped>
	.pointWay {
		padding: 10px;
	}
</style>
