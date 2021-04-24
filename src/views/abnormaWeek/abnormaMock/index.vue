<template>
	<div class="abnormaMock">
		<el-card class="box-card" shadow="always">
			<el-form :inline="true" :model="user" class="demo-form-inline">
				<el-form-item label="发现部门/车间">
					<!-- <el-select v-model="user.dept" placeholder="请选择部门" @change="dept_change">
						<el-option v-for="item in deptData" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select> -->
					<el-popover placement="right" width="400" trigger="click" v-model="isdeptshow">
						<div style="height: 200px;overflow-y: scroll;">
							<el-tree :data="deptList" accordion :default-expanded-keys="updateTree"
								:expand-on-click-node="false" :props="defaultProps"
								@node-click="searchDeptClick">
							</el-tree>
						</div>
						<!-- <el-button slot="reference">选择部门</el-button> -->
						<vxe-input slot="reference" v-model="user.dept"
							placeholder="请选择部门" clearable></vxe-input>
					</el-popover>
				</el-form-item>
				<!-- <el-form-item label="发现人员">
					<el-input v-model="user.person" placeholder="请输入人员" @input="user_person_show" clearable />
				</el-form-item> -->
				<el-form-item label="时间范围">
					<!-- <el-input v-model="pointCheckPlan.timeshow" placeholder="请输入人员" @input="pointCheckPlan_person_show" clearable /> -->
					<el-date-picker v-model="user.timeshow" type="daterange" unlink-panels range-separator="至"
						start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp"
						@change="timeshow_change">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="专业">
					<el-select v-model="user.belongToWay" placeholder="请选择专业" @change="belongToWay_change">
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
					<el-button v-prevent-re-click size="small" type="warning" @click="onreset('person_model')">重置
					</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="box-card" shadow="always">
			<!-- <el-row style="margin-bottom: 5px;">
				<el-button type="primary" @click="addRoute">新增</el-button>
				<el-button type="danger" @click="deleteRoute">删除</el-button>
			</el-row> -->
			<el-table v-loading="loading" :data="tableData" :row-key="getRowKeys" border style="width: 100%"
				:max-height="tableHeight">
				<!-- <el-table-column type="index" label="序号" width="100" align="center" /> -->
				<el-table-column prop="cid" width="100" label="序号" align="center" fixed>
				</el-table-column>
				<el-table-column prop="content" show-overflow-tooltip label="发现内容" min-width="180" align="center" />
				<el-table-column prop="pic" show-overflow-tooltip label="图片" min-width="180" align="center" />
				<el-table-column prop="device" show-overflow-tooltip label="指派/移交/定修人" min-width="180" align="center" />
				<el-table-column prop="type" show-overflow-tooltip label="专业分类" min-width="180" align="center" />
				<el-table-column prop="findTime" show-overflow-tooltip label="发现时间" min-width="180" align="center" />
				<el-table-column prop="findPerson" show-overflow-tooltip label="发现人" min-width="180" align="center" />
				<el-table-column prop="source" show-overflow-tooltip label="异常来源" min-width="180" align="center" />
				<el-table-column prop="status" show-overflow-tooltip label="异常状态" min-width="180" align="center" />
				<el-table-column prop="level" show-overflow-tooltip label="异常等级" min-width="180" align="center" />
				<el-table-column fixed="right" label="操作" min-width="360" align="center">
					<template slot-scope="scope">
						<div class="action">
							<!-- <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
								<el-tag @click="updateList(scope.row)">编辑</el-tag>
							</el-tooltip> -->
							<!-- <el-tooltip class="item" effect="dark" content="设备详情" placement="bottom">
								<el-tag @click="lookList(scope.row)">设备详情</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="预览检修单" placement="bottom">
								<el-tag @click="lookcheck(scope.row)" type="success">预览检修单</el-tag>
							</el-tooltip> -->
							<el-tooltip class="item" effect="dark" content="隐患指派" placement="bottom">
								<el-tag @click="abnormaTo(scope.row)" type="info">隐患指派</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="隐患定修" placement="bottom">
								<el-tag @click="abnormaCheck(scope.row)">隐患定修</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="隐患移交" placement="bottom">
								<el-tag @click="abnormaHe(scope.row)" type="success">隐患移交</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="隐患废除" placement="bottom">
								<el-tag @click="deleteList(scope.row)" type="danger">隐患废除</el-tag>
							</el-tooltip>
							<!-- <el-tooltip class="item" effect="dark" content="配置计划" placement="bottom">
								<el-tag @click="pzplan(scope.row)">配置计划</el-tag>
							</el-tooltip> -->
						</div>
					</template>
				</el-table-column>
			</el-table>
			<vxe-modal v-model="showEdit" :title="selectRow ? '异常编辑&保存' : '异常新增&保存'" width="50%" min-width="600"
				min-height="300" :loading="submitLoading" resize destroy-on-close @close="closemodel">
				<template #default>
					<vxe-form :data="formData" :rules="formRules" title-align="right" title-width="100"
						@submit="submitEvent">
						<vxe-form-item title="发现人员" field="person" span="12" :item-render="{}">
							<template #default>
								<!-- <vxe-input v-model="formData.person" placeholder="请输入人员名字" clearable></vxe-input> -->
								<el-autocomplete v-show="checked" popper-class="my-autocomplete"
									v-model="formData.person" :fetch-suggestions="querySearch" placeholder="请输入用户姓名"
									:trigger-on-focus="false" @select="handleSelect">
									<i class="el-icon-edit el-input__icon" slot="suffix">
									</i>
									<template slot-scope="{ item }">
										<div class="name" style="display: inline-block;color: #000000;"><span
												style="color: #00B3FD;">{{item.name}}</span></div>
										<div class="name" style="display: inline-block;float: right;"><i
												class="el-icon-phone"
												style="margin-left: 10px;color: orange;"></i>{{ item.phone }}</div>
										<div class="dept" style="color: lightseagreen;" :title="item.dept">
											{{ item.dept }}</div>
									</template>
								</el-autocomplete>
								<vxe-input v-show="!checked" v-model="formData.person" placeholder="请输入人员名字" clearable>
								</vxe-input>
								<!-- <el-input style="width: 500px;" v-show="!checked" v-model="sizeForm.userName" suffix-icon="el-icon-edit el-input__icon"
								 placeholder="请输入用户姓名"></el-input> -->
							</template>
						</vxe-form-item>
						<vxe-form-item title="发现时间" field="findDate" span="12" :item-render="{}">
							<template #default>
								<vxe-input @change="findDate_show" v-model="formData.findDate" placeholder="日期和时间选择"
									type="datetime" transfer></vxe-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="发现部门" field="dept" span="12" :item-render="{}">
							<template #default>
								<el-popover placement="right" width="400" trigger="click" v-model="isdeptshow1">
									<div style="height: 200px;overflow-y: scroll;">
										<el-tree :data="deptList" accordion :default-expanded-keys="updateTree"
											:expand-on-click-node="false" :props="defaultProps"
											@node-click="handleNodeClick">
										</el-tree>
									</div>
									<!-- <el-button slot="reference">选择部门</el-button> -->
									<vxe-input slot="reference" @focus="dept_show" v-model="formData.dept"
										placeholder="请选择部门" clearable></vxe-input>
								</el-popover>
								<!-- <vxe-input @focus="dept_show" v-model="formData.dept" placeholder="请选择部门" clearable></vxe-input> -->
							</template>
						</vxe-form-item>
						<vxe-form-item title="专业" field="line" span="12" :item-render="{}">
							<template #default>
								<!-- <vxe-input @change="commissioningDate_show" v-model="formData.commissioningDate" placeholder="日期和时间选择" type="datetime" transfer></vxe-input> -->
								<el-select v-model="formData.line" placeholder="请选择所属专业" @change="line_change">
									<el-option v-for="item in belongToWayData" :key="item.value" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</template>
						</vxe-form-item>
						<vxe-form-item title="异常等级" field="level" span="12" :item-render="{}">
							<template #default>
								<!-- <vxe-input @change="commissioningDate_show" v-model="formData.commissioningDate" placeholder="日期和时间选择" type="datetime" transfer></vxe-input> -->
								<el-select v-model="formData.level" placeholder="请选择异常等级" @change="level_change">
									<el-option v-for="item in levelData" :key="item.value" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</template>
						</vxe-form-item>
						<vxe-form-item title="内容" field="content" span="12" :item-render="{}">
							<template #default>
								<el-input @change="content_show" type="textarea" :rows="2" placeholder="请输入内容" v-model="formData.content">
								</el-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="备注" field="remark" span="12" :item-render="{}">
							<template #default>
								<el-input @change="remark_show" type="textarea" :rows="2" placeholder="请输入备注" v-model="formData.remark">
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
		<!-- 设备详情 -->
		<deviceLook :isshow="lookType" :showData="abnormaNav" @closedialog="closedialog"></deviceLook>
		<!-- 预览检修单 -->
		<checkLook :isshow="checkType" :showData="abnormaNav" @closedialog="closedialog"></checkLook>
		<abnormaLook :isshow="abnormaType" :titleshow="titleName" :showData="abnormaNav" @closedialog="closedialog"></abnormaLook>
	</div>
</template>

<script>
	import deviceLook from './deviceLook.vue'
	import checkLook from './checkLook.vue'
	import abnormaLook from './abnormaLook.vue'
	export default {
		name: 'abnormaMock',
		components: {
			deviceLook,
			checkLook,
			abnormaLook
		},
		data() {
			return {
				abnormaNav: {},
				titleName: '',
				lookType: false, //查看设备详情隐藏
				checkType: false,
				abnormaType: false,
				isdeptshow: false,
				isdeptshow1: false,
				deptList: [],
				updateTree: [],
				defaultProps: {
					children: 'childOrgs',
					label: 'name'
				},
				restaurants: [],
				checked: true,
				submitLoading: false,
				selectRow: null,
				showEdit: false,
				formData: {
					person: null,
					findDate: null,
					dept: null,
					line: null,
					level: null,
					remark: null,
					content: null
				},
				formRules: {
					person: [{
						required: true,
						message: '请输入人员名字'
					}],
					findDate: [{
						required: true,
						message: '请选择时间'
					}],
					dept: [{
						required: true,
						message: '请选择部门'
					}],
					line: [{
						required: true,
						message: '请选择部门'
					}],
					level: [{
						required: true,
						message: '请选择部门'
					}],
					content: [{
						required: true,
						message: '请填写备注'
					}],
					// nickname: [
					//   { required: true, message: '请输入昵称' }
					// ],
					// sex: [
					//   { required: true, message: '请选择性别' }
					// ]
				},
				numberPage: 0, //当前页数数据数量
				// 筛选
				user: {
					name: '',
					username: '',
					person: '',
					dept: '',
					belongToWay: '',
					timeshow: '',
					state: ''
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
				belongToWayData: [{
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
				levelData: [{
					value: '1',
					label: '异常等级1'
				}, {
					value: '2',
					label: '异常等级2'
				}],
				stateData: [{
					value: '',
					label: '全部'
				}, {
					value: '0',
					label: '待指派'
				}, {
					value: '1',
					label: '待处理'
				}, {
					value: '2',
					label: '已完成'
				}, {
					value: '3',
					label: '加入定修'
				}, {
					value: '4',
					label: '已废除'
				}],
				addData: {
					findPerson: '',
					content: '',
					findDept: '',
					line: '',
					proLevel: '',
					deviceId: '1',
					findDate: '',
					image: '',
					remark: '',
					executor: localStorage.getItem('username')
				},
				jsonData: {
					findDept: '',
					findDateStart: '',
					findDateEnd: '',
					closeDateStart: '',
					closeDateEnd: '',
					line: '',
					pageNo: 1,
					pageSize: 10
				},
			}
		},
		created() {
			//获取异常数据
			this.getData()
			//获取部门
			this.getDeptData()
		},
		methods: {
			//设备详情
			lookList(item) {
				this.lookType = true
				this.abnormaNav = item
			},
			//预览检修单
			lookcheck (item) {
				this.checkType = true
				this.abnormaNav = item
			},
			//隐患废除
			deleteList (item) {
				this.$confirm('是否废除该隐患?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deleteItem(item.id)
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
			},
			deleteItem (id) {
				let json = {
					handlerType: 4, //处理类型：1指派，2移交，3，定修，4，废除
					executor: null, //选定的执行人
					line: null, //专业条线
					id: id
				}
				this.handlerExce(json).then(res => {
					//console.log(res)
					if (res.data.code === 0) {
						this.$message({
							type: 'success',
							message: '成功废除该隐患'
						})
						this.getData()
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//隐患指派
			abnormaTo (item) {
				this.abnormaType = true
				this.titleName = '指派'
				this.abnormaNav = item
			},
			//隐患定修
			abnormaCheck (item) {
				this.abnormaType = true
				this.titleName = '定修'
				this.abnormaNav = item
			},
			//隐患移交
			abnormaHe (item) {
				this.abnormaType = true
				this.titleName = '移交'
				this.abnormaNav = item
			},
			//父子组件传值，控制隐藏显示
			closedialog(val) {
				// console.log('区域管理')
				this.jsonData.pageNo = 1
				this.jsonData.pageSize = 10
				this.getData()
				this.lookType = val
				this.checkType = val
				this.abnormaType = val
			},
			handleNodeClick(data) {
				console.log(data);
				this.isdeptshow1 = false
				this.formData.dept = data.name
				this.addData.findDept = data.orgCode
			},
			timeshow_change (event) { //筛选时间范围
				console.log(event)
				this.jsonData.findDateStart = event[0]
				this.jsonData.findDateEnd =JSON.parse(new Date(( event[1]/1000+86400)*1000) - 1)
			},
			searchDeptClick(data) {
				console.log(data);
				this.isdeptshow = false
				this.user.dept = data.name
				this.jsonData.orgCode = data.orgCode
			},
			content_show (event) {
				this.addData.content = event
			},
			remark_show (event) {
				// console.log(event)
				this.addData.remark = event
			},
			line_change(event) {
				console.log(event)
				this.addData.line = event
			},
			level_change(event) {
				console.log(event)
				this.addData.proLevel = event
			},
			dept_show(event) {
				console.log(event)
				// this.isdeptshow = true
			},
			findDate_show(event) {

				// console.log(new Date(event.value))
				// console.log(event.value)
				this.addData.findDate = new Date(event.value).getTime()
			},
			querySearch(queryString, cb) {
				//console.log(queryString)
				this.restaurants = []
				// this.jsonData.pageNo = 1
				// this.jsonData.pageSize = 50
				// this.jsonData.name = queryString
				this.getperson()
				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => {
					cb(this.restaurants);
				}, 1200 * Math.random());
			},
			closemodel() {
				
				console.log('关闭对话框')
				this.checked = true
			},
			//获取部门接口
			getDeptData() {
				let json = {
					orgCode: ""
				}
				this.updateTree = []
				this.deptList = []
				this.deptData(json).then(res => {
					if (res.data.code === 0) {
						console.log("异常模块部门数据", res.data.data)
						//将设备位置 从左树传给右侧 主界面
						// this.$bus.emit('devicePlace', res.data.data)
						const data = res.data.data
						
						this.deptList.push(res.data.data)
						this.updateTree[0] = res.data.data.id
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			getperson() {
				let json = {
					empName: this.formData.person,
					empNo: '',
					orgCode: '',
					pageNo: 1,
					pageSize: 20
				}
				this.personData(json).then(res => {
					if (res.data.code == 0) { //查询到数据
						let data = res.data.data.records
						let that = this
						console.log(data)
						if (data.length != 0) { //如果请求数据不为空
							for (var i = 0; i < data.length; i++) {
								var obj = {};
								obj.code = data[i].empNo
								obj.name = data[i].empName
								obj.phone = data[i].cell != '' ? data[i].cell : '- -'
								obj.card = data[i].idCardNo != '' ? data[i].idCardNo : '- -'
								obj.position = data[i].primaryPositionName != '' ? data[i].primaryPositionName :
									'- -'
								// obj.specialty = data[i].
								obj.dept = data[i].personDepName != '' ? data[i].personDepName : '- -'
								obj.email = data[i].email != '' ? data[i].email : '- -'
								that.restaurants.push(obj);
							}
						} else {
							that.restaurants = []
						}
					}
					//console.log(this.restaurants)
				})
			},
			handleSelect(item) {
				console.log(item);
				this.formData.person = item.name
				this.addData.findPerson = item.name
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
						// this.$XModal.message({
						// 	message: '新增成功',
						// 	status: 'success'
						// })
						// this.$refs.xTable.insert(this.formData)
					}
				}, 500)
			},
			updateMock () {
				this.abnormaMockAdd(this.addData).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
						this.addData = {
							findPerson: '',
							content: '',
							findDept: '',
							line: '',
							proLevel: '',
							deviceId: '1',
							findDate: '',
							image: '',
							remark: '',
							executor: localStorage.getItem('username'),
							pageNo: 1,
							pageSize: 10
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
			addMock() {
				this.abnormaMockAdd(this.addData).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: res.data.message,
							type: 'success'
						})
						this.addData = {
							findPerson: '',
							content: '',
							findDept: '',
							line: '',
							proLevel: '',
							deviceId: '1',
							findDate: '',
							image: '',
							remark: '',
							executor: localStorage.getItem('username')
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
			//获取异常数据
			getData() {
				this.abnormaMockData(this.jsonData).then(res => {
					if (res.data.code === 0) { //查询到数据
						//console.log(res)
						let data = res.data.data.records
						console.log('异常列表查询', data)
						this.numberPage = res.data.data.current
						//console.log('当前页数数据数量', this.numberPage)
						this.loading = true
						let that = this
						setTimeout(function() {
							if (data.length !== 0) { //如果请求数据不为空
								that.total = res.data.data.total //列表总数
								for (var i = 0; i < data.length; i++) {
									// var obj = {}
									// obj.cid = that.jsonData.pageNo * that.jsonData.pageSize - that
									// 	.jsonData.pageSize + i + 1
									// 	obj.data = data[i]
									// obj.person = data[i].findPerson
									// obj.dept = data[i].findDept
									// obj.belongToWay = data[i].line
									// obj.content = data[i].content
									// obj.time = that.formatDate(data[i].findDate)
									let state = ''
									if (data[i].state == 0) {
										state = '待指派'
									} else if (data[i].state == 1) {
										state = '待处理'
									} else if (data[i].state == 2) {
										state = '已完成'
									} else if (data[i].state == 3) {
										state = '加入定修'
									} else if (data[i].state == 4) {
										state = '已废除'
									}
									let level = ''
									if (data[i].proLevel== 1) {
										level = '一般'
									} else if (data[i].proLevel== 2) {
										level = '较大'
									} else if (data[i].proLevel== 3) {
										level = '重大'
									}
									that.tableData.push({
										id: data[i].id,
										cid: that.jsonData.pageNo * that.jsonData.pageSize - that.jsonData.pageSize + i + 1,
										content: data[i].content,
										pic: data[i].image,
										device: data[i].executor!=null?data[i].executor:'- -',
										type: data[i].line,
										findTime: that.formatDate(data[i].findDate),
										findPerson: data[i].findPerson,
										source: data[i].source,
										status: state,
										level: level
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
			//路线名称
			user_person_show(event) {
				this.jsonData.findPerson = event 
			},
			dicchange (code) {
				let val = ''
				for (let i=0;i<this.belongToWayData.length;i++) {
					if (code===this.belongToWayData[i].value) {
						val = this.belongToWayData[i].label
					}
				}
				return val
			},
			//所属部门选择
			dept_change() {
				// this.jsonData.dept = ''
			},
			//所属条线选择
			belongToWay_change(item) {
				// this.jsonData.dept = event
				this.jsonData.line = this.dicchange(item)
			},
			//状态选择
			state_change(event) {
				// console.log(event)
				this.jsonData.state = event
			},
			getRowKeys(row) {
				return row.cid; // cid为列表数据的唯一标识
			},
			addRoute() {
				this.formData = {
					person: null,
					findDate: null,
					dept: null,
					line: null,
					level: null,
					remark: null,
					content: null
				}
				this.selectRow = null
				this.showEdit = true
			},
			deleteRoute() {

			},
			updateList(item) {
				console.log(item)
				this.formData = {
					person: item.data.findPerson,
					findDate: new Date(item.data.findDate),
					dept: item.data.findDept,
					line: item.data.line,
					level: JSON.stringify(item.data.proLevel),
					remark: item.data.remark,
					content: item.data.content
				}
				this.jsonData = {
					findPerson: item.data.findPerson,
					content: item.data.content,
					findDept: item.data.findDept,
					line: item.data.line,
					proLevel: item.data.proLevel,
					deviceId: '1',
					findDate: new Date(item.data.findDate),
					image: '',
					remark: item.data.remark,
					executor: localStorage.getItem('username'),
					pageNo: 1,
					pageSize: 10
				}
				this.selectRow = item
				this.showEdit = true
			},
			
			pzplan() {},
			onSubmit(item) {
				// console.log(123)
				this.jsonData.pageNo = 1
				this.jsonData.pageSize = 10
				this.getData()
			},
			onreset() {
				// this.$refs[formName].resetFields();
				this.jsonData = {
					findDept: '',
					findDateStart: '',
					findDateEnd: '',
					closeDateStart: '',
					closeDateEnd: '',
					line: '',
					pageNo: 1,
					pageSize: 10
				}
				this.user = {
					name: '',
					username: '',
					person: '',
					dept: '',
					belongToWay: '',
					timeshow: '',
					state: ''
				}
				// this.isdeptshow = true
			},
			handleSizeChange(val) {
				//console.log(`每页 ${val} 条`)
				this.currentPage = 1
				this.pageSize = val
				this.jsonData.pageSize = val
				this.jsonData.pageNo = 1
				this.getData()
			},
			handleCurrentChange(val) {
				//console.log(`当前页: ${val}`)
				this.currentPage = val
				this.jsonData.pageNo = val
				this.getData()
			},
		}
	}
</script>
<style scoped>
	.abnormaMock {
		padding: 10px;
	}
</style>
