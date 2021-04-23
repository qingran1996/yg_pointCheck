<template>
	<div class="weekMock">
		<el-card class="box-card" shadow="always">
			<el-form :inline="true" :model="user" class="demo-form-inline">
				<el-form-item label="项目名称">
					<el-input v-model="user.projectName" placeholder="请输入项目名称" @input="user_projectName_show"
						clearable />
				</el-form-item>
				<el-form-item label="项目类型">
					<el-select v-model="user.projectType" placeholder="请选择项目类型" @change="projectType_change">
						<el-option v-for="item in projectTypeData" :key="item.value" :label="item.label"
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
				<!-- <el-button type="danger" @click="deleteRoute">删除</el-button> -->
			</el-row>
			<el-table v-loading="loading" :data="tableData" :row-key="getRowKeys" border style="width: 100%"
				:max-height="tableHeight">
				<!-- <el-table-column type="index" label="序号" width="100" align="center" /> -->
				<el-table-column prop="cid" width="100" label="序号" align="center" fixed>
				</el-table-column>
				<el-table-column prop="projectName" show-overflow-tooltip label="项目名称" min-width="180" align="center" />
				<el-table-column prop="day" show-overflow-tooltip label="周期天数(天)" min-width="180" align="center" />
				<el-table-column prop="projectType" show-overflow-tooltip label="项目类型" min-width="180" align="center" />
				<el-table-column prop="content" show-overflow-tooltip label="项目内容" min-width="180" align="center" />
				<!-- <el-table-column prop="remindTime" show-overflow-tooltip label="提前提醒天数(天)" min-width="180"
					align="center" /> -->
				<el-table-column prop="state" show-overflow-tooltip label="状态" min-width="180" align="center" />
				<el-table-column fixed="right" label="操作" min-width="180" align="center">
					<template slot-scope="scope">
						<div class="action">
							<!-- <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
								<el-tag @click="updateList(scope.row)">编辑</el-tag>
							</el-tooltip> -->
							<el-tooltip class="item" effect="dark" content="删除" placement="bottom">
								<el-tag type="danger" @click="deleteList(scope.row)">删除</el-tag>
							</el-tooltip>
							<!-- <el-tooltip class="item" effect="dark" content="配置计划" placement="bottom">
    						<el-tag @click="pzplan(scope.row)">配置计划</el-tag>
    					</el-tooltip> -->
						</div>
					</template>
				</el-table-column>
			</el-table>
			<vxe-modal v-model="showEdit" :title="selectRow ? '周期编辑&保存' : '周期新增&保存'" width="800" min-width="600"
				min-height="300" :loading="submitLoading" resize destroy-on-close @close="closemodel">
				<template #default>
					<vxe-form :data="formData" :rules="formRules" title-align="right" title-width="100"
						@submit="submitEvent">
						<vxe-form-item title="项目名称" field="cycleName" span="12" :item-render="{}">
							<template #default>
								<el-input @change="cycleName_show" clearable placeholder="请输入内容"
									v-model="formData.cycleName">
								</el-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="项目内容" field="content" span="12" :item-render="{}">
							<template #default>
								<el-input @change="content_show" type="textarea" :rows="2" placeholder="请输入内容"
									v-model="formData.content">
								</el-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="项目类型" field="cycleType" span="12" :item-render="{}">
							<template #default>
								<el-select v-model="formData.cycleType" placeholder="请选择所属条线"
									@change="cycleType_change">
									<el-option v-for="item in projectTypeData" :key="item.value" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</template>
						</vxe-form-item>
						<vxe-form-item title="条线" field="line" span="12" :item-render="{}">
							<template #default>
								<!-- <vxe-input @change="commissioningDate_show" v-model="formData.commissioningDate" placeholder="日期和时间选择" type="datetime" transfer></vxe-input> -->
								<el-select v-model="formData.line" placeholder="请选择所属条线" @change="line_change">
									<el-option v-for="item in belongToWayData" :key="item.value" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</template>
						</vxe-form-item>
						<vxe-form-item title="发现时间" field="startDate" span="12" :item-render="{}">
							<template #default>
								<vxe-input @change="startDate_show" v-model="formData.startDate" placeholder="日期和时间选择"
									type="datetime" transfer></vxe-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="频率(天)" field="frequency" span="12" :item-render="{}">
							<template #default>
								<vxe-input v-model="formData.frequency" @change="frequency_show" placeholder="数值类型"
									type="number"></vxe-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="执行部门" field="userDept" span="12" :item-render="{}">
							<template #default>
								<el-input @change="userDept_show" clearable placeholder="请输入内容"
									v-model="formData.userDept">
								</el-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="执行岗位" field="userPost" span="12" :item-render="{}">
							<template #default>
								<el-input @change="userPost_show" clearable placeholder="请输入内容"
									v-model="formData.userPost">
								</el-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="条线主管" field="lineSupervisor" span="12" :item-render="{}">
							<template #default>
								<el-input @change="lineSupervisor_show" clearable placeholder="请输入内容"
									v-model="formData.lineSupervisor">
								</el-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="备注" field="remark" span="12" :item-render="{}">
							<template #default>
								<el-input @change="remark_show" type="textarea" :rows="2" placeholder="请输入备注"
									v-model="formData.remark">
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
	</div>
</template>

<script>
	export default {
		name: 'weekMock',
		components: {},
		data() {
			return {
				submitLoading: false,
				selectRow: null,
				showEdit: false,
				formData: {
					cycleName: null,
					content: null,
					cycleType: null,
					remark: null,
					line: null,
					startDate: null,
					frequency: null,
					userDept: null,
					userPost: null,
					createBy: null,
					createTime: null,
					lineSupervisor: null,
				},
				formRules: {
					cycleName: [{
						required: true,
						message: '请输入项目名称'
					}],
					content: [{
						required: true,
						message: '请填写项目内容'
					}],
					cycleType: [{
						required: true,
						message: '请选择项目类型'
					}],
					line: [{
						required: true,
						message: '请选择条线'
					}],
					startDate: [{
						required: true,
						message: '请选择开始时间'
					}],
					frequency: [{
						required: true,
						message: '请选择频率'
					}],
					userDept: [{
						required: true,
						message: '请输入执行部门'
					}],
					userPost: [{
						required: true,
						message: '请输入执行岗位'
					}],
					lineSupervisor: [{
						required: true,
						message: '请输入条线主管'
					}]
				},
				// 筛选
				user: {
					name: '',
					username: '',
					projectName: '',
					projectType: '',
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
				projectTypeData: [{
					value: '1',
					label: '部门1'
				}, {
					value: '2',
					label: '部门2'
				}],
				belongToWayData: [{
					value: '1',
					label: '路线1'
				}, {
					value: '2',
					label: '路线2'
				}],
				stateData: [{
					value: '1',
					label: '启用'
				}, {
					value: '2',
					label: '禁用'
				}],
				addData: {
					cycleName: '',
					content: '',
					cycleType: '',
					line: '',
					deviceId: '1',
					startDate: '',
					frequency: '',
					userDept: '',
					userPost: '',
					createBy: '',
					createTime: '',
					remark: '',
					lineSupervisor: ''
				},
				jsonData: {
					cycleName: '',
					cycleType: '',
					state: '',
					pageNo: 1,
					pageSize: 10
				},
			}
		},
		created() {
			this.getData()
		},
		methods: {
			cycleName_show(event) {
				this.addData.cycleName = event
			},
			content_show(event) {
				this.addData.content = event
			},
			cycleType_change(event) {
				this.addData.cycleType = event
			},
			line_change(event) {
				this.addData.line = event
			},
			startDate_show(event) {
				var timearr = event.value.replace(" ", ":").replace(/\:/g, "-").split("-");
				var timestr = "" + timearr[0] + "-" + timearr[1] + "-" + timearr[2]
				console.log(timestr)
				this.addData.startDate = timestr
			},
			frequency_show(event) {
				this.addData.frequency = event.value
			},
			userDept_show(event) {
				this.addData.userDept = event
			},
			userPost_show(event) {
				this.addData.userPost = event
			},
			lineSupervisor_show(event) {
				this.addData.lineSupervisor = event
			},
			remark_show(event) {
				this.addData.remark = event
			},
			closemodel() {
				console.log('关闭对话框')
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
				this.addData.createBy = localStorage.getItem('username')
				this.addData.createTime = new Date().getTime()
				this.weekMockAdd(this.addData).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: res.data.message,
							type: 'success'
						})
						this.addData = {
							cycleName: '',
							content: '',
							cycleType: '',
							line: '',
							deviceId: '1',
							startDate: '',
							linfrequencye: '',
							userDept: '',
							userPost: '',
							createBy: '',
							createTime: '',
							remark: '',
							lineSupervisor: ''
						}
						this.getData()
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			getData() {
				this.weekMockData(this.jsonData).then(res => {
					if (res.data.code === 0) { //查询到数据
						//console.log(res)
						let data = res.data.data.records
						console.log('周期列表查询', data)
						this.numberPage = res.data.data.current
						//console.log('当前页数数据数量', this.numberPage)
						this.loading = true
						let that = this
						setTimeout(function() {
							if (data.length !== 0) { //如果请求数据不为空
								that.total = res.data.data.total //列表总数
								for (var i = 0; i < data.length; i++) {
									var obj = {}
									obj.id = data[i].id
									obj.cid = that.jsonData.pageNo * that.jsonData.pageSize - that
										.jsonData.pageSize + i + 1
									obj.projectName = data[i].cycleName
									obj.day = data[i].frequency
									obj.projectType = data[i].cycleType
									obj.content = data[i].content
									if (data[i].state === 0) {
										obj.state = '待确认'
									} else if (data[i].state === 1) {
										obj.state = '已取消'
									} else {
										obj.state = '待执行'
									}

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
			//项目名称
			user_projectName_show(event) {
				this.jsonData.projectName = event
			},
			//项目类型选择
			projectType_change() {
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
					cycleName: null,
					content: null,
					cycleType: null,
					remark: null,
					line: null,
					startDate: null,
					frequency: null,
					userDept: null,
					userPost: null,
					createBy: null,
					createTime: null,
					lineSupervisor: null
				}
				this.selectRow = null
				this.showEdit = true
			},
			deleteRoute() {

			},
			deleteList(item) {
				this.$confirm('是否删除当前选中设备?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let json = {
						id: item.id
					}
					this.weekMockDelete(json).then(res => {
						if (res.data.code === 0) {
							this.$message({
								message: res.data.message,
								type: 'success'
							})
							this.addData = {
								cycleName: '',
								content: '',
								cycleType: '',
								line: '',
								deviceId: '1',
								startDate: '',
								linfrequencye: '',
								userDept: '',
								userPost: '',
								createBy: '',
								createTime: '',
								remark: '',
								lineSupervisor: ''
							}
							this.getData()
						} else {
							this.$message({
								message: res.data.message,
								type: 'warning'
							})
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
			},
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
				// this.getTable()
			},
			handleCurrentChange(val) {
				//console.log(`当前页: ${val}`)
				this.currentPage = val
				this.jsonData.pageNo = val
				// this.getTable()
			},
		}
	}
</script>
<style scoped>
	.weekMock {
		padding: 10px;
	}
</style>
