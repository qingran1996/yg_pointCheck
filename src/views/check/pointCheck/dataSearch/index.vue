<template>
	<div class="pointCheckDataSearch">
		<el-card shadow="always">
			<el-form :inline="true" :model="pointCheckArea" class="demo-form-inline">
				<!-- <el-form-item label="部门选择">
					<el-popover placement="right" width="400" trigger="click" v-model="isdeptshow">
						<div style="height: 200px;overflow-y: scroll;">
							<el-tree :data="deptList" accordion :default-expanded-keys="updateTree"
								:expand-on-click-node="false" :props="defaultProps" @node-click="searchDeptClick">
							</el-tree>
						</div>
						<vxe-input slot="reference" v-model="pointCheckArea.dept" placeholder="请选择部门" clearable>
						</vxe-input>
					</el-popover>
				</el-form-item> -->
				<el-form-item label="车间">
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
						<el-input slot="reference" v-model="pointCheckArea.farm" clearable="" placeholder="请选择车间"></el-input>
					</el-popover>
				</el-form-item>
				<el-form-item label="点检状态">
					<el-select v-model="pointCheckArea.result" placeholder="请选择" @change="result_change">
						<el-option v-for="item in resultData" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="点检部门">
					<el-select v-model="pointCheckArea.pointDept" placeholder="请选择部门" @change="pointDept_change">
						<el-option v-for="item in pointDeptData" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="点检负责人">
					<el-input v-model="pointCheckArea.person" placeholder="请输入人员" @input="pointCheckArea_person_show"
						clearable />
				</el-form-item> -->
				<!-- <el-form-item label="状态">
					<el-select v-model="pointCheckArea.status" placeholder="" @change="pointStatus_change">
						<el-option v-for="item in pointStatusData" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item label="点检时间范围">
					<!-- <el-input v-model="pointCheckPlan.timeshow" placeholder="请输入人员" @input="pointCheckPlan_person_show" clearable /> -->
					<el-date-picker v-model="pointCheckArea.timeshow" type="daterange" unlink-panels range-separator="至"
						start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp"
						@change="timeshow_change">
					</el-date-picker>
				</el-form-item>

				<el-form-item>
					<el-button v-prevent-re-click size="small" type="primary" @click="onSubmit">查询</el-button>
					<el-button v-prevent-re-click size="small" type="warning" @click="onreset('pointCheckArea')">重置
					</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card shadow="always">
			<el-row style="margin-bottom: 5px;">
				<!-- <el-button type="primary" @click="addlist">新增</el-button>
				<el-button type="danger" @click="deleteItems" :disabled="isDeleteAll">批量删除</el-button>
				<el-button type="success" @click="addmore" :disabled="isDeleteAll">批量导入</el-button> -->
				<el-button type="primary">导出</el-button>
			</el-row>
			<el-table v-loading="loading" ref="multipleTable" :data="tableData" border style="width: 100%"
				:max-height="tableHeight" @selection-change="selectionchange" :row-key="getRowKeys">
				<!-- <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column> -->
				<el-table-column prop="index" label="序号" width="100" align="center" />
				<!-- <el-table-column prop="pointdept" label="点检部门" min-width="180" align="center" show-overflow-tooltip /> -->
				<el-table-column prop="person" label="点检人员" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="shopName" label="车间" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="standardName" label="点检项目" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="standardContent" label="点检标准" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="checkArea" label="点检区域" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="planStart" label="计划开始时间" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="planEnd" label="计划结束时间" min-width="180" align="center" show-overflow-tooltip />
				<!-- <el-table-column prop="realTime" label="实际点检时长" min-width="180" align="center" show-overflow-tooltip /> -->
				<el-table-column prop="discipline" label="所属专业" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="result" label="点检状态" min-width="180" align="center" show-overflow-tooltip>
					<template v-slot="scope">
						<div class="action">
							<span v-if="scope.row.result===0">异常</span>
							<span v-else-if="scope.row.result===1">正常</span>
							<span v-else>停运</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="photo" label="图片" min-width="180" align="center" fixed="right" show-overflow-tooltip />
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
			<vxe-modal v-model="showEdit" :title="selectRow ? '点检计划编辑&保存' : '点检计划新增&保存'" width="800" min-width="600"
				min-height="300" :loading="submitLoading" resize destroy-on-close @close="closemodel">
				<template #default>
					<vxe-form :data="formData" :rules="formRules" title-align="right" title-width="150"
						@submit="submitEvent">
						<vxe-form-item title="点检路线" field="way" span="12" :item-render="{}">
							<template #default>
								<el-select v-model="formData.way" placeholder="请选择路线" @change="way_change">
									<el-option v-for="item in belongToWayData" :key="item.value" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</template>
						</vxe-form-item>
						<vxe-form-item title="点检部门" field="dept" span="12" :item-render="{}">
							<template #default>
								<el-popover placement="right" width="400" trigger="click" v-model="isdeptshow1">
									<div style="height: 200px;overflow-y: scroll;">
										<el-tree :data="deptList" accordion :default-expanded-keys="updateTree"
											:expand-on-click-node="false" :props="defaultProps"
											@node-click="handleNodeClick">
										</el-tree>
									</div>
									<vxe-input slot="reference" v-model="formData.dept" placeholder="请选择部门" clearable>
									</vxe-input>
								</el-popover>
							</template>
						</vxe-form-item>
						<vxe-form-item title="条线主管" field="lineManager" span="12" :item-render="{}">
							<template #default>
								<el-input @change="lineManager_show" clearable placeholder="请输入内容"
									v-model="formData.lineManager">
								</el-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="点检周期" field="cycle" span="12" :item-render="{}">
							<template #default>
								<vxe-input v-model="formData.cycle" @change="cycle_show" placeholder="请输入周期"
									type="number"></vxe-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="计划开始时间" field="startDate" span="12" :item-render="{}">
							<template #default>
								<vxe-input @change="startDate_show" v-model="formData.startDate"
									:disabled-method="disabledDateMethod" placeholder="日期和时间选择" type="datetime"
									transfer></vxe-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="计划结束时间" field="endDate" span="12" :item-render="{}">
							<template #default>
								<vxe-input @change="endDate_show" v-model="formData.endDate" placeholder="日期和时间选择"
									:disabled-method="disabledDateMethodEnd" type="datetime" transfer></vxe-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="提前多久提醒" field="advanceLong" span="12" :item-render="{}">
							<template #default>
								<vxe-input v-model="formData.advanceLong" @change="advanceLong_show"
									placeholder="请输入提前时间" type="number"></vxe-input>
							</template>
						</vxe-form-item>
						<vxe-form-item v-if="formData.cycle!=null&&formData.cycle!=''" title="每次点检时长" field="planLong"
							span="12" :item-render="{}">
							<template #default>
								<vxe-input v-model="formData.planLong" @change="planLong_show" placeholder="请输入提前时间"
									type="number"></vxe-input>
							</template>
						</vxe-form-item>
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
		name: 'pointCheckDataSearch',
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
					label: 'label'
				},
				pointCheckArea: {
					dept: '',
					farm: '',
					result: '',
					pointDept: '',
					person: '',
					timeshow: '',
					status: ''
				},
				isFarmshow: false,
				farmList: [],
				farmdefaultProps: {
					children: 'childOrgs',
					label: 'name'
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
				tableHeight: document.body.clientHeight - 84 - 36 - 50 - 180, // 表格高度
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
					type: 1, //类别：1点检，2巡检(默认点检)
					shopId: null, //车间id
					deptId: null, // 部门id
					planStart: null, //计划开始时间(筛选条件)
					planEnd: null, //计划结束时间（筛选条件）
					factStart: null, //实际开始时间
					factEnd: null, //实际结束时间
					result: null, //状态，0未完成，1完成,2任务取消',3漏检,4正在点巡检
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
				farmData: [{
					value: '1',
					label: '车间1'
				}, {
					value: '2',
					label: '车间2'
				}],
				resultData: [{
					value: '',
					label: '全部'
				}, {
					value: '0',
					label: '异常'
				}, {
					value: '1',
					label: '正常'
				}, {
					value: '2',
					label: '停运'
				}],
				farmJson: {
					orgType: 2
				}, //获取车间得参数
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
				}, {
					value: '1',
					label: '状态1'
				}, {
					value: '2',
					label: '状态2'
				}]
			}
		},
		created() {
			// this.getDeviceOptions() //获取类型分类
			// this.getOrgInfo() //组织机构获取
			// this.getStatus() // 状态获取
			this.getTable() //获取table数据
			this.getFarm()
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
			//选中部门
			searchDeptClick(data) {
				// console.log(data);
				this.isdeptshow = false
				this.pointCheckArea.dept = data.label
				// this.addData.findDept = data.code
			},
			//车间选中
			farm_change(data, checked, node) {
				if (checked == true) {
					// this.checkedId = data.comcode;
					console.log(data)
					this.pointCheckArea.farm = data.name
					this.jsonData.shopId = data.id
					this.$refs.treeForm.setCheckedNodes([data]);
					this.isFarmshow = false
				}
			},
			getFarm() {
				this.pointPlanFarmData(this.farmJson).then(res => {
					if (res.data.code == 0) { //查询到数据
						let data = res.data.data
						// console.log(data)
						for (let i = 0; i < data.length; i++) {
							data[i]['disabled'] = true
						}
						console.log(data)
						this.farmList = data
					} else {
						// that.deptrestaurants = []
					}
				})
			},
			//点检结果选中
			result_change(item) {
				this.jsonData.result = item
			},
			//点检部门选中
			pointDept_change() {

			},
			//点检负责人
			pointCheckArea_person_show() {

			},
			//时间范围选中
			timeshow_change(event) {
				// console.log(event)
				this.jsonData.planStart = event[0]
				this.jsonData.planEnd = JSON.parse(new Date(( event[1]/1000+86400)*1000) - 1)
			},
			//状态选中
			pointStatus_change() {

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
			getDeptData() {
				let json = {
					orgCode: "0"
				}
				this.updateTree = []
				this.deptList = []
				this.$axios.post('/bi/organization/query', json).then(res => {
					if (res.data.code === 0) {
						// console.log("部门数据", res.data.data)
						//将设备位置 从左树传给右侧 主界面
						// this.$bus.emit('devicePlace', res.data.data)
						const data = res.data.data
						this.updateTree.push(data[0].id)
						this.deptList = data
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			//获取table数据
			getTable() {
				this.pointCheckSearchData(this.jsonData).then(res => {
					if (res.data.code === 0) { //查询到数据
						//console.log(res)
						let data = res.data.data.records
						console.log('点检区域任务列表', data)
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
										pointdept: '',
										person: '',
										shopName: data[i].shopName,
										standardName: data[i].standardName,
										standardContent: data[i].content,
										checkArea: data[i].areaName,
										planStart: that.formatDate(data[i].planStart),
										planEnd: that.formatDate(data[i].planEnd),
										discipline: data[i].lineName,
										result: data[i].result,
										photo: '- -'
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
				this.addAreaMsg = null
				this.jsonData.pageNo = 1
				this.jsonData.pageSize = 10
				this.getTable()
			},
			onreset(formName) {
				// this.$refs[formName].resetFields();
				this.jsonData = {
					type: 1, //类别：1点检，2巡检(默认点检)
					shopId: null, //车间id
					deptId: null, // 部门id
					planStart: null, //计划开始时间(筛选条件)
					planEnd: null, //计划结束时间（筛选条件）
					factStart: null, //实际开始时间
					factEnd: null, //实际结束时间
					status: null, //状态，0未完成，1完成,2任务取消',3漏检,4正在点巡检
					pageNo: 1,
					pageSize: 10
				}
				this.pointCheckArea = {
					dept: '',
					farm: '',
					result: '',
					pointDept: '',
					person: '',
					timeshow: '',
					status: ''
				}
				// this.isdeptshow = true
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
	.pointCheckDataSearch {
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
