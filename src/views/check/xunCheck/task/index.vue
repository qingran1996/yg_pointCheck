<template>
	<div class="xunCheckTask">
		<el-card shadow="always">
			<el-form :inline="true" ref="pointCheckTask" :model="pointCheckTask" class="demo-form-inline">
				<el-form-item label="车间">
					<!-- <el-select v-model="pointCheckTask.farm" placeholder="请选择车间" @change="farm_change">
						<el-option v-for="item in farmData" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select> -->
					<el-popover placement="right" trigger="click" v-model="isFarmshow">
						<div style="height: 200px;overflow-y: scroll;">
							<el-tree :data="farmList" accordion show-checkbox check-strictly
								:expand-on-click-node="false" :props="farmdefaultProps" ref="treeForm" node-key="id"
								@check-change="farm_change">
								<span slot-scope="{ node }" class="custom-tree-node">
									<el-tooltip class="item" effect="dark" :content="node.label" placement="right">
										<span>{{ node.label }}</span>
									</el-tooltip>
								</span>
							</el-tree>
						</div>
						<el-input slot="reference" v-model="pointCheckTask.farm" clearable placeholder="请选择车间"></el-input>
					</el-popover>
				</el-form-item>
				<el-form-item label="部门选择">
					<el-popover placement="right" width="400" trigger="click" :trigger="checkpointDept?'click':'manual'"
						v-model="isdeptshow">
						<div style="height: 200px;overflow-y: scroll;color: #000000;">
							<el-tree :data="deptList" accordion :default-expanded-keys="updateTree"
								:expand-on-click-node="false" :props="defaultProps" @node-click="searchDeptClick">
							</el-tree>
						</div>
						<vxe-input slot="reference" :disabled="!checkpointDept" v-model="pointCheckTask.dept"
							placeholder="请选择部门" clearable>
						</vxe-input>
					</el-popover>
				</el-form-item>
				<!-- <el-form-item label="专业">
					<el-select v-model="pointCheckTask.discipline" placeholder="请选择专业" @change="discipline_change">
						<el-option v-for="item in disciplineData" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item> -->
				<!-- <el-form-item label="点检部门">
					<el-select v-model="pointCheckTask.pointDept" placeholder="请选择部门" @change="pointDept_change">
						<el-option v-for="item in pointDeptData" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item label="点检人员">
					<!-- <el-input v-model="pointCheckTask.person" placeholder="请输入人员" @input="pointCheckTask_person_show"
						clearable /> -->
						<el-autocomplete style="width: 300px;" 
							v-model="pointCheckTask.person" :fetch-suggestions="querySearchPerson"
							:trigger-on-focus="true" placeholder="请输入人员" :disabled="!checkpointDept"
							@select="handleSelectPerson">
							<template slot-scope="{ item }">
								<div class="name" style="display: inline-block;color: #000000;">
									{{ item.name }}
								</div>
								<div class="name" style="display: inline-block;float: right;"><i
										class="el-icon-phone"
										style="margin-left: 10px;color: orange;"></i>{{ item.phoneNumber }}
								</div>
								<div class="dept" style="color: lightseagreen;"
									:title="item.orgName">
									部门： {{ item.orgName }}
								</div>
							</template>
						</el-autocomplete>
				</el-form-item>
				<el-form-item label="时间范围">
					<!-- <el-input v-model="pointCheckPlan.timeshow" placeholder="请输入人员" @input="pointCheckPlan_person_show" clearable /> -->
					<el-date-picker v-model="pointCheckTask.timeshow" type="daterange" unlink-panels range-separator="至"
						start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp"
						@change="timeshow_change">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="pointCheckTask.status" placeholder="" @change="pointStatus_change">
						<el-option v-for="item in pointStatusData" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button v-prevent-re-click size="small" type="primary" @click="onSubmit">查询</el-button>
					<el-button v-prevent-re-click size="small" type="warning" @click="onreset('pointCheckTask')">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card shadow="always">
			<!-- <el-row style="margin-bottom: 5px;">
				<el-button type="primary" @click="addlist">新增</el-button>
				<el-button type="danger" @click="deleteItems" :disabled="isDeleteAll">批量删除</el-button>
				<el-button type="success" @click="addmore" :disabled="isDeleteAll">批量导入</el-button>
			</el-row> -->
			<el-table v-loading="loading" ref="multipleTable" :data="tableData" border style="width: 100%"
				:max-height="tableHeight" @selection-change="selectionchange" :row-key="getRowKeys">
				<!-- <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column> -->
				<el-table-column prop="index" label="序号" width="100" align="center" />

				<el-table-column prop="planname" label="计划名称" min-width="180" align="center" show-overflow-tooltip />
				<!-- <el-table-column prop="dept" label="部门" min-width="180" align="center" show-overflow-tooltip /> -->
				<el-table-column prop="farm" label="车间" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="discipline" label="专业" min-width="180" align="center" show-overflow-tooltip />


				<el-table-column prop="pointdept" label="点检部门(小组)" min-width="180" align="center"
					show-overflow-tooltip />
				<el-table-column prop="person" label="点检人" min-width="180" align="center" show-overflow-tooltip>
					<template v-slot="scope">
						<div class="action" v-if="scope.row.person.length!=0">
							<el-tag style="margin: 0 2px;" :key="index" v-for="(item,index) in scope.row.person" :disable-transitions="false">
								{{item.userName}}
							</el-tag>
						</div>
						<div v-else class="action">- -</div>
					</template>
				</el-table-column>
				<el-table-column prop="startTime" label="开始日期" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="endTime" label="结束日期" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="week" label="频次" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="checkTime" label="点检时长" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="checkArea" label="点检区域" min-width="180" align="center" show-overflow-tooltip>
					<template v-slot="scope">
						<div class="action" v-if="scope.row.checkArea.length!=0">
							<el-tag style="margin: 0 2px;" :key="index" v-for="(item,index) in scope.row.checkArea" :disable-transitions="false">
								{{item}}
							</el-tag>
						</div>
						<div v-else class="action">- -</div>
					</template>
				</el-table-column>
				<!-- <el-table-column prop="realTime" label="实际生成时间" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="realPerson" label="实际执行人" min-width="180" align="center" show-overflow-tooltip /> -->
					
				<el-table-column prop="state" fixed="right" label="任务状态" min-width="180" align="center">
					<template v-slot="scope">
						<div v-if="scope.row.state==0" class="action"><el-tag type="danger">未完成</el-tag></div>
						<div v-else-if="scope.row.state==1" class="action"><el-tag type="success">完成</el-tag></div>
						<div v-else-if="scope.row.state==2" class="action"><el-tag type="info">任务取消</el-tag></div>
						<div v-else class="action"><el-tag type="warning">漏检</el-tag></div>
					</template>
				</el-table-column>
				<!-- <el-table-column fixed="right" label="操作" min-width="180" align="center">
					<template v-slot="scope">
						<div class="action">
							<el-tooltip class="item" effect="dark" content="详情" placement="bottom"
								:open-delay="otherTooltipDelay">
								<el-tag @click="lookList(scope.row)" type="warning">详情</el-tag>
							</el-tooltip>
						</div>
					</template>
				</el-table-column> -->
			</el-table>
			
			<!-- 分页器 -->
			<div class="block" style="margin-top:15px;">
				<el-pagination v-show="total!==0" align="center" :current-page="currentPage" :page-sizes="[10,15,20]"
					:page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
					@size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</div>
		</el-card>
		<!--编辑/更新dialog-->
		<!-- <Editdialog/> -->
		<!-- 设备详情接口 -->
		<!-- <deviceDetaildialog/> -->
		<!-- 尝试性打印   -->
		<!--    <div ref="printText" v-show="false"></div>-->
	</div>
</template>

<script>
	// import Editdialog from './devicedetail/editdialog.vue'
	// import deviceDetaildialog from './devicedetail/deviceDetaildialog.vue'
	import QrcodeVue from 'qrcode.vue'
	// import vueQr from 'vue-qr'
	export default {
		name: 'xunCheckTask',
		components: {
			// Editdialog,
			// deviceDetaildialog,
			QrcodeVue
		},
		data() {
			return {
				isdeptshow: false,
				isdeptshow1: false,
				deptList: [],
				updateTree: [],
				defaultProps: {
					children: 'children',
					label: 'longName'
				},
				pointCheckTask: {
					dept: '',
					farm: '',
					discipline: '',
					pointDept: '',
					person: '',
					timeshow: '',
					status: ''
				},
				personrestaurants: [],
				personJson: {
					userName: '',
					orgId: ''
				},
				submitLoading: false,
				selectRow: null,
				showEdit: false,
				formData: {
					way: null,
					dept: null,
					lineManager: null,
					cycle: null,
					startDate: null,
					endDate: null,
					advanceLong: null,
					planLong: null,
					note: null
				},
				formRules: {
					way: [{
						required: true,
						message: '请选择点检路线'
					}],
					dept: [{
						required: true,
						message: '请选择部门'
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
				loading: false,
				chooseId: [], //批量删除数组
				chooseDevice: [], //判断批量删除时，有无设备在跑流程
				isDeleteAll: true, //是否可以批量删除
				tableHeight: document.body.clientHeight - 84 - 36 - 70 - 180, // 表格高度
				currentPage: 1,
				pageSize: 10,
				size: 30,
				total: 1,
				numberPage: 0, //当前页数数据数量
				ewmDelay: 260, //二维码显示延迟的时间
				otherTooltipDelay: 260, //其他的tooltip显示延迟的时间
				aHref: null, //二维码下载地址
				loadName: null, // 二维码下载图片的名字
				topPopoShow: false, //搜索框-设备类型tree
				popheight: document.body.clientHeight * 10 + 'px',
				addAreaMsg: null,
				tableData: [],
				installArea: [], //安装位置数据
				deptDatas: null, // 组织机构数据
				serviceDatas: null, //维保部门数据
				jsonData: {
					type: 2, //类别：1点检，2巡检(默认点检)
					deptId: null, //部门id
					shopId: null, //车间id（分厂id）
					userName: null, //点检人员
					planStart: null, //计划开始日期
					planEnd: null, //计划结束日期
					status: null, //状态，0未完成，1完成,2任务取消',3漏检,
					pageNo: 1,
					pageSize: 10
				},
				addJson: {
					createrId: JSON.parse(localStorage.getItem('userId')),
					routeId: '',
					deptId: '',
					lineManagerId: '',
					cycle: '',
					planStart: '',
					planEnd: '',
					planLong: '',
					advanceLong: '',
					note: ''
				},
				belongToWayData: [{
					value: '1',
					label: '路线1'
				}, {
					value: '2',
					label: '路线2'
				}],
				farmJson:{
					orgType: 2
				},
				isFarmshow: false,
				farmList: [],
				farmdefaultProps: {
					children: 'childOrgs',
					label: 'name'
				},
				isdeptshow: false,
				checkpointDept: false,
				disciplineData: [{
					value: '',
					label: '全部'
				},{
					value: 1,
					label: '生产'
				},{
					value: 2,
					label: '安全'
				},{
					value: 3,
					label: '电气'
				}],
				pointDeptData: [{
					value: '1',
					label: '部门1'
				}, {
					value: '2',
					label: '部门2'
				}],
				pointStatusData: [{
					value: '',
					label: '全部'
				},{
					value: 0,
					label: '未完成'
				}, {
					value: 1,
					label: '完成'
				},{
					value: 2,
					label: '任务取消'
				},{
					value: 3,
					label: '漏检'
				}]
			}
		},
		created() {
			// this.getDeviceOptions() //获取类型分类
			// this.getOrgInfo() //组织机构获取
			// this.getStatus() // 状态获取
			this.getTable() //获取table数据
			this.getFarm() //获取车间
			// this.getDeptData()
			// this.$bus.on('pointWayAdd', (e) => {
			// 	console.log(666)
			// })
		},
		mounted() {

		},
		destroyed() {
			this.$bus.off()
		},
		methods: {
			//车间选中
			farm_change(data, checked, node) {
				if (checked == true) {
					// console.log(data)
					this.$refs.treeForm.setCheckedNodes([data]);
					this.isFarmshow = false
					this.checkpointDept = true
					this.pointCheckTask.farm = data.name
					this.jsonData.shopId = data.id
					this.personJson.orgId = data.id
					this.getDeptData(data.id) //获取部门
				}
			},
			//选中部门
			searchDeptClick(data) {
				// console.log(data);
				this.isdeptshow = false
				this.pointCheckTask.dept = data.longName
				this.jsonData.deptId = data.id
				// this.addData.findDept = data.code
			},
			getFarm() {
				this.pointPlanFarmData(this.farmJson).then(res => {
					if (res.data.code == 0) { //查询到数据
						let data = res.data.data
						// console.log(data)
						for (let i = 0; i < data.length; i++) {
							data[i]['disabled'] = true
						}
						// console.log(data)
						this.farmList = data
					} else {
						// that.deptrestaurants = []
					}
				})
			},
			//关于人员得搜索
			querySearchPerson(queryString, cb) {
				// console.log(queryString)
				// this.formData.person = queryString
				this.personrestaurants = []
				this.personJson.userName = queryString
				this.getPerson()
				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => {
					cb(this.personrestaurants);
				}, 1200 * Math.random());
			},
			getPerson() {
				this.pointPlanPersonData(this.personJson).then(res => {
					if (res.data.code == 0) { //查询到数据
						let data = res.data.data
						// console.log(data)
						this.personrestaurants = []
						if (data.length != 0) { //如果请求数据不为空
							this.personrestaurants = data
						} else {
							this.personrestaurants = []
						}
					}
				})
			},
			handleSelectPerson(item) {
				// this.$refs.xForm.updateStatus(scope)
				// console.log(item);
				this.pointCheckTask.person = item.name
				
				// this.persontags.push({
				// 	id: item.id,
				// 	name: item.name,
				// 	type: ''
				// })
				// this.persontags = this.repeat()
				// setTimeout(() => {
				// 	this.addJson.userBoList = []
				// 	for (let i = 0; i < this.persontags.length; i++) {
				// 		this.addJson.userBoList.push({
				// 			userId: this.persontags[i].id,
				// 			userName: this.persontags[i].name
				// 		})
				// 	}
				// 	this.addJson.deptName = null
				// 	this.addJson.deptId = null
				// }, 500)
			
			},
			//专业选中
			discipline_change() {

			},
			//点检部门选中
			pointDept_change() {

			},
			//点检负责人
			pointCheckTask_person_show(event) {
				this.jsonData.userName = event
			},
			//时间范围选中
			timeshow_change(event) {
				// console.log(event)
				this.jsonData.planStart = event[0]
				this.jsonData.planEnd = JSON.parse(event[1] - 1)
			},
			//状态选中
			pointStatus_change(event) {
				// console.log(event)
				this.jsonData.status = event
			},
			handleNodeClick(data) {
				console.log(data);
				this.isdeptshow1 = false
				this.formData.dept = data.label
				this.addJson.deptId = data.id
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
				if (this.addJson.cycle == '' || this.addJson.cycle == null) {
					// console.log('888888')
					this.addJson.planLong = this.addJson.planEnd - this.addJson.planStart
				} else {
					// console.log('99999')
					this.addJson.planLong = JSON.parse(this.formData.planLong)
				}
				// console.log(this.addJson)
				this.pointPlanAdd(this.addJson).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: res.data.message,
							type: 'success'
						})
						this.addJson = {
							createrId: localStorage.getItem('userId'),
							routeId: '',
							deptId: '',
							lineManagerId: '',
							cycle: '',
							planStart: '',
							planEnd: '',
							planLong: '',
							advanceLong: '',
							note: ''
						}
						this.getTable()
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			updateMock() {

			},
			way_change(event) {
				// console.log(event)
				this.addJson.routeId = JSON.parse(event)
			},
			lineManager_show(event) {
				this.addJson.lineManagerId = JSON.parse(event)
			},
			cycle_show(event) {
				// console.log(event)
				// console.log(this.formData.cycle)
				this.formData.cycle = event.value
				this.addJson.cycle = JSON.parse(event.value)
			},
			startDate_show(event) {
				// console.log(event.value)
				let thistime = new Date().getTime()
				console.log(new Date(event.value).getTime(), thistime)
				if (new Date(event.value).getTime() < thistime) {
					this.$message({
						message: '计划开始时间不能小于当前时间',
						type: 'warning',
						duration: 5000
					});
					this.formData.startDate = null
				} else {
					this.formData.startDate = event.value
					this.addJson.planStart = new Date(event.value).getTime()
				}
				// this.addJson.planStart = new Date(event.value).getTime()
			},
			endDate_show(event) {
				// this.addJson.planEnd = new Date(event.value).getTime()
				let thistime = new Date(this.formData.startDate).getTime()
				console.log(new Date(event.value).getTime(), thistime)
				if (new Date(event.value).getTime() < thistime) {
					this.$message({
						message: '计划结束时间不能小于开始时间',
						type: 'warning',
						duration: 5000
					});
					this.formData.endDate = null
				} else {
					this.formData.endDate = event.value
					this.addJson.planEnd = new Date(event.value).getTime()
				}
			},
			planLong_show(event) {

			},
			advanceLong_show(event) {
				this.addJson.advanceLong = JSON.parse(event.value)
			},
			note_show(event) {
				this.addJson.note = event
			},
			//获取部门接口
			getDeptData(id) {
				this.deptList = []
				this.pointPlanDeptData(id).then(res => {
					if (res.data.code === 0) {
						const data = res.data.data
						// console.log(data)
						// this.updateTree.push(data[0].id)
						this.deptList = data
					} else {
						this.deptList = []
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			//获取table数据
			getTable() {
				this.pointCheckTaskData(this.jsonData).then(res => {
					if (res.data.code === 0) { //查询到数据
						//console.log(res)
						let data = res.data.data.records
						console.log('点检任务列表', data)
						this.numberPage = res.data.data.current
						//console.log('当前页数数据数量', this.numberPage)
						this.loading = true
						let that = this
						setTimeout(function() {
							if (data.length !== 0) { //如果请求数据不为空
								that.total = res.data.data.total //列表总数
								for (var i = 0; i < data.length; i++) {
									that.tableData.push({
										index: that.jsonData.pageNo * that.jsonData.pageSize - that
											.jsonData.pageSize + i + 1,
										farm: data[i].shopName,
										discipline: data[i].lineName,
										pointdept: data[i].deptName != undefined ? data[i]
											.deptName : '- -',
										person: data[i].userBoList,
										planname: data[i].planName,
										startTime: that.formatDate(data[i].planStart),
										endTime: that.formatDate(data[i].planEnd),
										week: data[i].cycle + ' 天',
										checkTime: data[i].planLong + ' 小时',
										checkArea: data[i].areaNameList,
										state: data[i].status,
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
			// 批量删除-- el-table 框
			getRowKeys(row) {
				return row.index
			},


			//顶部查询按钮 筛选信息
			onSubmit() {
				//console.log('submit!')
				//this.jsonData.installAreaCode = null
				this.jsonData.userName = this.pointCheckTask.person
				this.jsonData.pageNo = 1
				this.jsonData.pageSize = 10
				this.getTable()
			},
			//重置搜索条件
			onreset(formName) {
				// this.$refs[formName].resetFields();
				this.jsonData = {
					type: 1, //类别：1点检，2巡检(默认点检)
					deptId: null, //部门id
					shopId: null, //车间id（分厂id）
					userName: null, //点检人员
					planStart: null, //计划开始日期
					planEnd: null, //计划结束日期
					status: null, //状态，0未完成，1完成,2任务取消',3漏检,
					pageNo: 1,
					pageSize: 10
				}
				this.pointCheckTask = {
					dept: '',
					farm: '',
					discipline: '',
					pointDept: '',
					person: '',
					timeshow: '',
					status: ''
				}
				this.checkpointDept = false
				if (this.$refs.treeForm) {
					this.$refs.treeForm.setCheckedNodes([]);
				}
				
			},
			selectionchange(data) {
				this.chooseId = [] //每次选择重置批量
				this.chooseDevice = [] //重置
				this.isDeleteAll = data.length === 0
				console.log(data)
				for (let i = 0; i < data.length; i++) {
					this.chooseId.push(data[i].id)
					let obj = {
						id: data[i].id,
						name: data[i].name,
						isMaintenancing: data[i].isMaintenancing
					}
					this.chooseDevice.push(obj)
				}
				//console.log('462-',this.chooseDevice)
			},
			//批量导入
			addmore() {

			},
			// 批量删除按钮
			deleteItems() {
				// this.$bus.emit('deviceDelete', this.tableData)
				this.$confirm('是否删除该设备?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let result = this.isDeleteConfirm(this.chooseDevice)
					let src = ''
					for (let key of result) {
						src = src + key.name + ','
					}
					//console.log(result)
					if (result.length > 0) {
						this.$confirm(`选定删除设备中:<b style="color: red">${src}</b>设备处于维修(保养,作业票)流程中，请将其流程终止后删除`,
							'删除警告', {
								dangerouslyUseHTMLString: true
							}).then(() => {
							this.$refs.multipleTable.clearSelection()
							this.jsonData.pageNo = 1
							this.getTable()
						})
					} else {
						this.deletshow()
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
			},
			deletshow() {
				let deletParam = {
					ids: this.chooseId
				}
				if (this.chooseId.length >= this.numberPage) {
					this.jsonData.pageNo = 1
					this.jsonData.pageSize = 10
				}
				this.$axios.post('/d/device/delete', deletParam).then(res => {
					//console.log(res)
					if (res.data.code === 0) {
						this.$message({
							type: 'success',
							message: '设备删除成功.'
						})
						setTimeout(() => {
							this.$refs.multipleTable.clearSelection()
							//删除成功后，如果把一页数据全删，要页数调整
							this.getTable()
						}, 500)
					} else {
						this.$message.error('删除失败')
						//console.log(res.data.message)
					}
				}).catch(err => {
					this.$message.error('服务异常')
				})
			},
			// 单独右侧删除按钮
			deleteItem(row) {
				//console.log(row)
				let pam = {
					id: row.id
				}
				this.$axios.post('/d/device/deleteById', pam).then(res => {
					//console.log(res)
					if (res.data.code === 0) {
						this.$message({
							type: 'success',
							message: '成功删除'
						})
						this.currentPage = this.deleteLastPageData(this.total, this.pageSize, this.currentPage)
						this.jsonData.pageNo = this.currentPage
						this.getTable()
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//批量删除判断
			isDeleteConfirm(arry) {
				return arry.filter(item => item.isMaintenancing !== 0)
			},
			// 编辑
			updateList(item) {
				item.installArea = this.installArea
				item.deviceTypeArry = this.device_options
				item.deptTree = this.deptDatas
				item.serviceTree = this.serviceDatas
				item.statusTree = this.device_status
				this.$bus.emit('editInfo', item)
			},
			// 添加信息
			addlist() {
				this.formData = {
					way: null,
					dept: null,
					lineManager: null,
					cycle: null,
					startDate: null,
					endDate: null,
					advanceLong: null,
					note: null
				}
				this.selectRow = null
				this.showEdit = true
			},
			deletePlan() {

			},
			// 详情
			lookList(row) {
				//console.log(row)
				let item = {
					id: row.id,
					stateName: row.stateName
				}
				this.$bus.emit('shownav', item)
			},
			//查询状态
			getStatus() {
				let parm = {
					parentCode: 'deviceState'
				}
				this.getStateInfo(parm).then(res => {
					if (res.data.code === 0) {
						//console.log('状态查询', res.data.data)
						this.device_status = res.data.data
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//搜索框-设备类型tree
			filterNode(value, data) {
				if (!value) return true
				return data.label.indexOf(value) !== -1
			},

			selectClassfy(data) {
				//console.log('tree', data)
				this.device_model.deviceTypeArry = data.label
				this.jsonData.deviceTypeId = data.id
			},
			showtree() {
				this.device_model.deviceTypeArry = ''
				this.jsonData.deviceTypeId = null
			},
			//取消
			blankMsg() {
				this.topPopoShow = false
				this.device_model.deviceTypeArry = ''
				this.jsonData.deviceTypeId = null
			},
			disabledDateMethod({
				date
			}) {
				const dd = date.getTime()
				const thisday = new Date().getTime()
				// console.log(date)
				return dd <= thisday
			},
			disabledDateMethodEnd({
				date
			}) {
				const dd = date.getTime()
				const thisday = new Date(this.formData.startDate).getTime()
				// console.log(date)
				return dd <= thisday
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`)
				this.currentPage = 1
				this.pageSize = val
				this.jsonData.pageSize = val
				this.jsonData.pageNo = 1
				this.getTable()
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`)
				this.currentPage = val
				this.jsonData.pageNo = val
				this.getTable()
			}
		}
	}
</script>
<style scoped>
	.xunCheckTask {
		padding: 10px;
	}

	@page {
		size: auto;
		/* auto is the initial value */
		margin: 0;
		/* this affects the margin in the printer settings */
	}

	html {
		background-color: #FFFFFF;
		margin: 0;
		/* this affects the margin on the html before sending to printer */
	}

	body {
		border: solid 1px #242424;
		margin: 0mm 15mm 10mm 15mm;
		/* margin you want for the content */
	}

	.topPop {
		margin-top: 15px;
		display: flex;
		justify-content: flex-end;
	}
</style>
