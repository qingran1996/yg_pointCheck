<template>
	<div class="overhaulPlan">
		<el-card class="box-card" shadow="always">
			<el-form :inline="true" :model="user" class="demo-form-inline">
				<el-form-item label="设备">
					<el-input v-model="user.device" placeholder="请输入人员" clearable />
				</el-form-item>
				<el-form-item label="作业名称">
					<el-input v-model="user.jobName" placeholder="请输入人员" clearable />
				</el-form-item>
				<el-form-item label="作业来源">
					<el-select v-model="user.source" placeholder="请选择所属条线">
						<el-option v-for="item in sourceData" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="作业时间范围">
					<el-date-picker v-model="user.timeLong" type="daterange" unlink-panels style="width: 100%;"
						value-format="timestamp" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="作业状态">
					<el-select v-model="user.status" placeholder="请选择状态">
						<el-option v-for="item in statusData" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button v-prevent-re-click size="small" type="primary" @click="onSubmit">查询</el-button>
					<el-button v-prevent-re-click size="small" type="warning" @click="onSet">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="box-card" shadow="always">
			<el-row style="margin-bottom: 5px;">
				<!-- <el-button type="primary" @click="addRoute">新增</el-button> -->
				<!-- <el-button type="danger" @click="deleteRoute">删除</el-button> -->
			</el-row>
			<el-table v-loading="loading" :data="tableData" :row-key="getRowKeys" border style="width: 100%"
				:max-height="tableHeight">
				<!-- <el-table-column type="index" label="序号" width="100" align="center" /> -->
				<el-table-column prop="cid" width="100" label="序号" align="center" fixed>
				</el-table-column>
				<el-table-column prop="dept" show-overflow-tooltip label="部门" min-width="180" align="center" />
				<el-table-column prop="workArea" show-overflow-tooltip label="作业区域" min-width="180" align="center" />
				<el-table-column prop="device" show-overflow-tooltip label="设备" min-width="180" align="center" />
				<el-table-column prop="workName" show-overflow-tooltip label="作业名称" min-width="180" align="center" />
				<el-table-column prop="specs" show-overflow-tooltip label="专业" min-width="180" align="center" />
				<el-table-column prop="source" show-overflow-tooltip label="作业来源" min-width="180" align="center" />
				<el-table-column prop="planStart" show-overflow-tooltip label="作业开始时间" min-width="180" align="center" />
				<el-table-column prop="planEnd" show-overflow-tooltip label="作业结束时间" min-width="180" align="center" />
				<el-table-column prop="maintainerNum" show-overflow-tooltip label="作业人员数量" min-width="180"
					align="center" />
				<el-table-column prop="planLong" show-overflow-tooltip label="作业时长" min-width="180" align="center" />
				<el-table-column prop="status" show-overflow-tooltip label="作业状态" min-width="180" align="center" />
				<el-table-column fixed="right" label="操作" min-width="180" align="center">
					<template slot-scope="scope">
						<div class="action">
							<el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
								<el-tag @click="updateList(scope.row)">编辑</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="下发" placement="bottom">
								<el-tag @click="putdown(scope.row)">下发</el-tag>
							</el-tooltip>
							<!-- <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
								<el-tag type="danger" @click="deleteList(scope.row)">删除</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="预览" placement="bottom">
								<el-tag type="warning" @click="overhaulProject(scope.row)">预览</el-tag>
							</el-tooltip> -->
						</div>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页器 -->
			<div class="block" style="margin-top:15px;" v-show="showpage">
				<el-pagination v-show="total!==0" align="center" :current-page="currentPage" :page-sizes="[5,10,20]"
					:page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
					@size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</div>
		</el-card>
		<overhaulEdit :isshow="lookType" :showEvent="showitem" :showtitle="titleName" @closedialog="closedialog">
		</overhaulEdit>
	</div>
</template>

<script>
	import overhaulEdit from './overhaulEdit.vue'
	export default {
		name: 'overhaulPlan',
		components: {
			overhaulEdit
		},
		data() {
			return {
				isdeptshow: false, //部门弹出
				isdeptshow1: false, //部门弹出
				deptList: [],
				lookType: false,
				showitem: null,
				titleName: '',
				// 筛选
				user: {
					dept: null,
					line: null,
					device: null,
					jobName: null,
					source: null,
					timeLong: null,
					status: null
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
				sourceData: [{
					value: 1,
					label: '异常'
				}, {
					value: 2,
					label: '周期'
				}, {
					value: 3,
					label: '三方'
				}, {
					value: 4,
					label: '手动'
				}],
				statusData: [{
					value: 0,
					label: '编辑作业卡'
				}, {
					value: 1,
					label: '作业卡下发'
				}, {
					value: 2,
					label: '作业卡确认'
				}, {
					value: 3,
					label: '四方审批'
				}, {
					value: 4,
					label: '厂长审核'
				}, {
					value: 5,
					label: '施工确认'
				}, {
					value: 6,
					label: '开工检测'
				}, {
					value: 7,
					label: '安全交底'
				}, {
					value: 8,
					label: '过程确认'
				}, {
					value: 9,
					label: '调试验收'
				}, {
					value: 10,
					label: '打分评价'
				}, {
					value: 11,
					label: '关闭'
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
				jsonData: {
					shopId: null, //车间（部门id）
					equipmentName: null, //设备名称（模糊）
					jobName: null, //作业名称（模糊）
					planStart: null, //计划开始时间
					planEnd: null, //计划结束时间
					source: null, //来源： 1异常，2周期，3三方，4手动
					status: null, //状态 0编辑作业卡,1作业卡下发，2作业卡确认，3四方审批，4厂长审核，5施工确认，6开工检测，7安全交底，8过程确认，9调试验收，10打分评价，11关闭
					pageNo: 1,
					pageSize: 10
				},
			}
		},
		created() {
			this.getTable()
				this.getDeptData()
		},
		methods: {
			handleNodeClick(data) {
				console.log(data);
				this.isdeptshow = false
				this.user.dept = data.name
				this.jsonData.orgCode = data.orgCode
			},
			handleNodeClick1(item) {
				// this.$refs.xForm.updateStatus(scope)
				console.log(item);
				this.isdeptshow1 = false
				this.formData.dept = item.name
				this.addJson.orgName = item.name
				this.addJson.orgCode = item.orgCode
			},
//获取部门接口
			getDeptData() {
				let json = {
					orgType: 2
				}
				this.updateTree = []
				this.deptList = []
				this.pointPlanFarmDataByUser(json).then(res => {
					if (res.data.code === 0) {
						console.log("部门数据", res.data.data)
						//将设备位置 从左树传给右侧 主界面
						// this.$bus.emit('devicePlace', res.data.data)
						const data = res.data.data
						this.updateTree[0] = res.data.data.id
						this.deptList = data

					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			//计划名称
			user_planName_show(event) {
				this.jsonData.planName = event
			},
			//计划类型选择
			planType_change() {
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
			//父子组件传值，控制隐藏显示
			closedialog(val) {
				// this.jsonData.pageNo = 1
				// this.jsonData.pageSize = 10
				// this.getData()
				this.lookType = val
			},
			addRoute() {
				this.titleName = '新增'
				this.lookType = true
			},
			deleteRoute() {

			},
			updateList(item) {
				this.titleName = '编辑'
				this.lookType = true
				this.showitem = item
			},
			putdown (item) {
				console.log(item)
				let json = {
					jcId: item.id,
					taskId: item.taskId
				}
				// console.log(json)
				this.issueJoBCard(json).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: '下发成功',
							type: 'warning'
						})
						this.getTable()
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			deleteList() {

			},
			//状态转换
			status_change(num) {
				let val = ''
				for (var i = 0; i < this.statusData.length; i++) {
					if (num === this.statusData[i].value) {
						val = this.statusData[i].label
					}
				}
				return val
			},
			//来源转换
			source_change(num) {
				let val = ''
				for (var i = 0; i < this.sourceData.length; i++) {
					if (num === this.sourceData[i].value) {
						val = this.sourceData[i].label
					}
				}
				return val
			},
			overhaulProject() {},
			//获取检修作业卡列表
			getTable() {
				this.jobCardList(this.jsonData).then(res => {
					if (res.data.code === 0) { //查询到数据
						let data = res.data.data.records
						console.log('检修作业卡列表列表', data)
						this.numberPage = res.data.data.current
						//console.log('当前页数数据数量', this.numberPage)
						this.loading = true
						let that = this
						setTimeout(function() {
							if (data.length !== 0) { //如果请求数据不为空
								that.total = res.data.data.total //列表总数
								for (var i = 0; i < data.length; i++) {
									that.tableData.push({
										cid: that.jsonData.pageNo * that.jsonData.pageSize - that
											.jsonData.pageSize + i + 1,
										id: data[i].jcId,
										dept: '- -',
										workArea: data[i].location,
										device: data[i].equipmentName,
										workName: data[i].jobName,
										specs: data[i].lineName,
										source: that.source_change(data[i].source),
										planStart: that.formatDate(data[i].planStart),
										planEnd: that.formatDate(data[i].planEnd),
										maintainerNum: data[i].maintainerNum,
										planLong: data[i].planLong,
										status: that.status_change(data[i].status),
										taskId: data[i].taskId,
										data: data[i],
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
			onSet() {
				this.user = {
					dept: null,
					line: null,
					device: null,
					jobName: null,
					source: null,
					timeLong: null,
					status: null
				}
				this.jsonData = {
					shopId: null, //车间（部门id）
					equipmentName: null, //设备名称（模糊）
					jobName: null, //作业名称（模糊）
					planStart: null, //计划开始时间
					planEnd: null, //计划结束时间
					source: null, //来源： 1异常，2周期，3三方，4手动
					status: null, //状态 0编辑作业卡,1作业卡下发，2作业卡确认，3四方审批，4厂长审核，5施工确认，6开工检测，7安全交底，8过程确认，9调试验收，10打分评价，11关闭
					pageNo: 1,
					pageSize: 10
				}
			},
			onSubmit() {
				// console.log(this.user)
				this.jsonData = {
					shopId: null, //车间（部门id）
					equipmentName: this.user.device, //设备名称（模糊）
					jobName: this.user.jobName, //作业名称（模糊）
					planStart: this.user.timeLong != null ? this.user.timeLong[0] : '', //计划开始时间
					planEnd: this.user.timeLong != null ? JSON.parse(new Date((this.user.timeLong[1] / 1000 + 86400) *
						1000) - 1) : '', //计划结束时间
					source: this.user.source, //来源： 1异常，2周期，3三方，4手动
					status: this.user
					.status, //状态 0编辑作业卡,1作业卡下发，2作业卡确认，3四方审批，4厂长审核，5施工确认，6开工检测，7安全交底，8过程确认，9调试验收，10打分评价，11关闭
					pageNo: 1,
					pageSize: 10
				}
				// this.jsonData.pageNo = 1
				// this.jsonData.pageSize = 10
				this.getTable()
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
	.overhaulPlan {
		padding: 10px;
	}
</style>
