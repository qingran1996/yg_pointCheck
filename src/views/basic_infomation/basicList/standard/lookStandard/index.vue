<template>
	<div class="lookStandard">
		<el-card shadow="always">
			<el-form :inline="true" :model="pointStandard_model" ref="pointStandard_model" class="demo-form-inline">
				<!-- <el-form-item label="部门">
					<el-input v-model="pointStandard_model.dept" placeholder="请输入内容" clearable />
				</el-form-item> -->
				<el-form-item label="部门">
					<!-- <el-select v-model="user.dept" placeholder="请选择部门" @change="dept_change">
						<el-option v-for="item in deptData" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select> -->
					<el-popover placement="right" width="400" trigger="click" v-model="isdeptshow">
						<div style="height: 200px;overflow-y: scroll;">
							<el-tree :data="deptList" accordion node-key="id" :default-expanded-keys="updateTree"
								:expand-on-click-node="false" :props="defaultProps" @node-click="handleNodeClick">
							</el-tree>
						</div>
						<el-input v-model="pointStandard_model.dept" placeholder="请点击选择部门" slot="reference" clearable />
					</el-popover>
				</el-form-item>
				<!-- <el-form-item label="区域">
					<el-input v-model="pointStandard_model.area" placeholder="请输入内容" clearable />
				</el-form-item> -->
				<el-form-item label="专业">
					<!-- <vxe-select v-model="pointStandard_model.profession"
						@change="$refs.xForm.updateStatus(scope)" placeholder="请选择专业" clearable>
						<vxe-option v-for="item in disciplineData" :key="item.value"
							:value="item.value" :label="item.label">
						</vxe-option>
					</vxe-select> -->
					<el-select v-model="pointStandard_model.profession" placeholder="请选择专业">
						<el-option v-for="item in disciplineData" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button v-prevent-re-click size="small" type="primary" @click="onSubmit">查询</el-button>
					<el-button v-prevent-re-click size="small" type="warning" @click="onreset('pointStandard_model')">重置
					</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card shadow="always">
			<el-row style="margin-bottom: 5px;">
				<el-button type="primary" @click="addlist">新增</el-button>
				<!-- <el-button type="danger" @click="deletePlan">删除</el-button> -->
			</el-row>
			<el-table v-loading="loading" ref="multipleTable" :data="tableData" border style="width: 100%"
				:max-height="tableHeight" @selection-change="selectionchange" :row-key="getRowKeys">
				<el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
				<el-table-column prop="index" label="序号" width="100" align="center" />
				<el-table-column prop="name" label="标准名称" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="content" label="标准内容" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="profession" label="专业" min-width="180" align="center" show-overflow-tooltip>
					<template v-slot="scope">
						<span v-if="scope.row.profession==1">生产</span>
						<span v-else-if="scope.row.profession==2">安全</span>
						<span v-else-if="scope.row.profession==3">电气</span>
						<span v-else-if="scope.row.profession==4">设备</span>
					</template>
				</el-table-column>
				<el-table-column prop="equipCode" label="设备编码" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="equipName" label="设备名称" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="upperLimit" label="上限值" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="lowerLimit" label="下限值" min-width="180" align="center" show-overflow-tooltip />
				<!-- <el-table-column prop="unit" label="单位" min-width="180" align="center" show-overflow-tooltip /> -->
				<el-table-column prop="createTime" label="创建时间" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="updateTime" label="更新时间" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column fixed="right" label="操作" min-width="80" align="center">
					<template v-slot="scope">
						<div class="action">
							<el-tooltip class="item" effect="dark" content="编辑" placement="bottom"
								:open-delay="otherTooltipDelay">
								<el-tag @click.prevent="updateList(scope.row)">编辑</el-tag>
							</el-tooltip>
							<!-- <el-tooltip class="item" effect="dark" content="详情" placement="bottom"
								:open-delay="otherTooltipDelay">
								<el-tag @click="lookList(scope.row)" type="success">详情</el-tag>
							</el-tooltip> -->
						</div>
					</template>
				</el-table-column>
			</el-table>
			<vxe-modal v-model="showEdit" :title="selectRow ? '点检标准编辑&保存' : '点检标准新增&保存'" width="60%" min-width="600"
				:loading="submitLoading" resize destroy-on-close @close="closemodel">
				<template #default>
					<vxe-form :data="formData" :rules="formRules" title-colon title-align="right" title-width="150"
						ref="xForm" @submit="submitEvent">
						<vxe-form-item title="标准名称" field="name" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-input v-model="formData.name" @input="$refs.xForm.updateStatus(scope)"
									placeholder="请输入标准名称" clearable></vxe-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="专业" field="profession" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-select v-model="formData.profession" @change="$refs.xForm.updateStatus(scope)"
									placeholder="请选择状态" clearable>
									<vxe-option v-for="item in professionData" :key="item.value" :value="item.value"
										:label="item.label">
									</vxe-option>
								</vxe-select>
							</template>
						</vxe-form-item>
						<vxe-form-item title="文本类型" field="type" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-select v-model="formData.type" @change="$refs.xForm.updateStatus(scope)"
									placeholder="请选择文本类型" clearable>
									<vxe-option v-for="item in typeData" :key="item.value" :value="item.value"
										:label="item.label">
									</vxe-option>
								</vxe-select>
							</template>
						</vxe-form-item>
						<vxe-form-item title="精度监测" field="accuracyStatus" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-select v-model="formData.accuracyStatus" @change="$refs.xForm.updateStatus(scope)"
									placeholder="请选择精度监测" clearable>
									<vxe-option v-for="item in accuracyStatusData" :key="item.value" :value="item.value"
										:label="item.label">
									</vxe-option>
								</vxe-select>
							</template>
						</vxe-form-item>
						<vxe-form-item title="状态" field="status" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-select v-model="formData.status" @change="$refs.xForm.updateStatus(scope)"
									placeholder="请选择状态" clearable>
									<vxe-option v-for="item in statusData" :key="item.value" :value="item.value"
										:label="item.label">
									</vxe-option>
								</vxe-select>
							</template>
						</vxe-form-item>
						<!-- <vxe-form-item title="单位" field="unit" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-select v-model="formData.unit" @change="$refs.xForm.updateStatus(scope)"
									placeholder="请选择单位" clearable>
									<vxe-option v-for="item in unitData" :key="item.value" :value="item.value"
										:label="item.label">
									</vxe-option>
								</vxe-select>
							</template>
						</vxe-form-item> -->
						<vxe-form-item title="上限" field="upperLimit" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-input v-model="formData.upperLimit" placeholder="请选择上限"
									@input="$refs.xForm.updateStatus(scope)" type="number" min="0" clearable>
								</vxe-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="下限" field="lowerLimit" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-input v-model="formData.lowerLimit" placeholder="请选择下限"
									@input="$refs.xForm.updateStatus(scope)" type="number" min="0" clearable>
								</vxe-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="内容描述" field="content" span="12" :item-render="{}">
							<template #default="scope">
								<!-- <vxe-input v-model="formData.lowerLimit" placeholder="请选择下限"
									@input="$refs.xForm.updateStatus(scope)" type="number" min="0" clearable>
								</vxe-input> -->
								<vxe-textarea v-model="formData.content" @input="$refs.xForm.updateStatus(scope)"
									placeholder="请输入内容描述" :autosize="{ minRows: 2, maxRows: 4 }">

								</vxe-textarea>
							</template>
						</vxe-form-item>
						<vxe-form-item class="bottomShow" align="center" span="24" :item-render="{}">
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
		<!-- 人员新增 -->
		<!-- <personAdd :isshow="addType" :addOredit="addOredit" @closedialog="closedialog" @dataUpdate="dataUpdate">
		</personAdd> -->
		<!--编辑/更新dialog-->
		<!-- <Editdialog/> -->
		<!-- 设备详情接口 -->
		<!-- <deviceDetaildialog/> -->
		<!-- 尝试性打印   -->
		<!--    <div ref="printText" v-show="false"></div>-->
	</div>
</template>

<script>
	// import vueQr from 'vue-qr'
	export default {
		name: 'lookStandard',
		components: {

		},
		data() {
			return {
				/**********************vxe-model*/
				submitLoading: false,
				selectRow: null,
				showEdit: false,
				formData: {
					name: null, // 标准名称
					content: null, // 内容描述
					profession: null, // 专业
					applyType: 1, // 应用类型： 1点检 2巡检
					type: null, // 文本类型 0数值1文本
					equipCode: null, // 设备code
					equipName: null, // 设备名字
					accuracyStatus: null, // 精度监测 1是 0否
					unit: null, // 单位
					upperLimit: null, // 上限
					lowerLimit: null, // 下限
					status: null // 状态 0弃用 1在用
				},
				disciplineData: [{
					value: '',
					label: '全部'
				}, {
					value: 1,
					label: '生产'
				}, {
					value: 2,
					label: '安全'
				}, {
					value: 3,
					label: '电气'
				}, {
					value: 4,
					label: '设备'
				}],
				deptList: [],
				updateTree: [],
				isdeptshow: false,
				defaultProps: {
					children: 'childOrgs',
					label: 'name'
				},
				formRules: {
					name: [{
						required: true,
						message: '请输入标准名称'
					}],
					profession: [{
						required: true,
						message: '请选择专业'
					}],
					type: [{
						required: true,
						message: '请选择文本类型'
					}],
					accuracyStatus: [{
						required: true,
						message: '请选择精度监测'
					}],
					status: [{
						required: true,
						message: '请选择状态'
					}]
				},
				addJson: {
					name: null, // 标准名称
					content: null, // 内容描述
					profession: null, // 专业
					applyType: 2, // 应用类型： 1点检 2巡检
					type: null, // 文本类型 0数值1文本
					equipCode: null, // 设备code
					equipName: null, // 设备名字
					accuracyStatus: null, // 精度监测 1是 0否
					unit: null, // 单位
					upperLimit: null, // 上限
					lowerLimit: null, // 下限
					status: null // 状态 0弃用 1在用
				},
				unitData: [{
					value: 1,
					label: '单位1'
				}, {
					value: 2,
					label: '单位2'
				}],
				professionData: [{
					value: 1,
					label: '生产'
				}, {
					value: 2,
					label: '安全'
				}, {
					value: 3,
					label: '电气'
				}, {
					value: 4,
					label: '设备'
				}],
				accuracyStatusData: [{
					value: 1,
					label: '是'
				}, {
					value: 0,
					label: '否'
				}],
				statusData: [{
					value: 0,
					label: '弃用'
				}, {
					value: 1,
					label: '在用'
				}],
				/**********************vxe-model*/
				addType: false,
				addOredit: true, //新增还是修改
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
				positionData: [{
					value: '1',
					label: '职位1'
				}, {
					value: '2',
					label: '职位2'
				}],
				serviceDatas: null, //维保部门数据
				jsonData: {
					orgCode: '',
					areaCode: '',
					equipCode: '',
					applyType: 2,
					pageNo: 1,
					pageSize: 10
				},
				typeData: [{
					value: 0,
					label: '数值'
				}, {
					value: 1,
					label: '文本'
				}],
				// 筛选
				pointStandard_model: {
					dept: '',
					area: '',
					device: '',
					profession: '',
				},
				//设备状态
				device_status: null
			}
		},
		created() {
			// this.getDeviceOptions() //获取类型分类
			// this.getOrgInfo() //组织机构获取
			// this.getStatus() // 状态获取
			this.getTable() //获取table数据
			this.getDeptData()
		},
		mounted() {
			//this.qrcode(1);
			// this.$bus.$on('personList', e => {
			// 	console.log(e)
			// 	this.jsonData.pageNo = 1
			// 	this.jsonData.pageSize = 10
			// 	this.jsonData.orgCode = e.code
			// 	this.getTable()
			// 	//console.log('place', this.installArea)
			// })
		},
		destroyed() {
			this.$bus.off()
		},
		watch: {},
		methods: {
			handleNodeClick(data) {
				// console.log(data);
				this.isdeptshow = false
				this.pointStandard_model.dept = data.name
				this.jsonData.orgCode = data.orgCode
			},
			closemodel() {
				// console.log('关闭对话框')
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
						console.log("部门数据", res.data.data)
						//将设备位置 从左树传给右侧 主界面
						// this.$bus.emit('devicePlace', res.data.data)
						const data = res.data.data
						this.updateTree[0] = res.data.data.id
						this.deptList.push(data)

					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			submitEvent() {
				this.submitLoading = true
				setTimeout(() => {
					this.submitLoading = false
					if (this.selectRow) {
						// this.addJson.name = this.formData.name
						// console.log(this.addJson)
						this.addJson.name = this.formData.name
						this.addJson.content = this.formData.content
						this.addJson.profession = this.formData.profession
						this.addJson.type = this.formData.type
						this.addJson.accuracyStatus = this.formData.accuracyStatus
						// this.addJson.unit = this.formData.unit
						this.addJson.upperLimit = this.formData.upperLimit
						this.addJson.lowerLimit = this.formData.lowerLimit
						this.addJson.status = this.formData.status

						this.addJson.equipCode = 'gh9527'
						this.addJson.equipName = '测试大西瓜1'
						this.updatePointStand()
						// this.updateArea()
					} else {
						// this.addJson.name = this.formData.name
						// console.log(this.formData)
						this.addJson.name = this.formData.name
						this.addJson.content = this.formData.content
						this.addJson.profession = this.formData.profession
						this.addJson.type = this.formData.type
						this.addJson.accuracyStatus = this.formData.accuracyStatus
						// this.addJson.unit = this.formData.unit
						this.addJson.upperLimit = this.formData.upperLimit
						this.addJson.lowerLimit = this.formData.lowerLimit
						this.addJson.status = this.formData.status

						this.addJson.equipCode = 'gh9527'
						this.addJson.equipName = '测试大西瓜1'
						// console.log(this.addJson)
						this.addPointStand()
					}
				}, 500)
			},
			updatePointStand() {
				this.pointStandardUpdate(this.addJson).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: '更新标准成功',
							type: 'success'
						})
						this.showEdit = false
						this.getTable()
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
			addPointStand() {
				this.pointStandardAdd(this.addJson).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: '新增标准成功',
							type: 'success'
						})
						this.showEdit = false
						this.getTable()
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
			//父子组件传值，控制隐藏显示
			closedialog(val) {
				// console.log('区域管理')
				this.addType = val
			},
			dataUpdate(val) {
				// console.log('人员列表更新')
				this.getTable()
			},
			//职位选择
			position_change() {

			},
			//组织机构获取
			getOrgInfo() {
				let parm = {
					name: 'test'
				}
				this.deptData(parm).then(res => {
					if (res.data.code === 0) {
						//console.log('组织机构',res.data.data)
						this.deptDatas = res.data.data //组织部门
						this.serviceDatas = res.data.data //维保部门
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//获取table数据
			getTable() {
				this.pointStandardData(this.jsonData).then(res => {
					if (res.data.code === 0) { //查询到数据
						//console.log(res)
						let data = res.data.data.records
						console.log('点检标准列表查询', data)
						this.numberPage = res.data.data.current
						//console.log('当前页数数据数量', this.numberPage)
						this.loading = true
						let that = this
						setTimeout(function() {
							if (data.length !== 0) { //如果请求数据不为空
								that.total = res.data.data.total //列表总数
								// for (var i = 0; i < data.length; i++) {
								// 	var obj = {}
								// 	obj.index = that.jsonData.pageNo * that.jsonData.pageSize - that
								// 		.jsonData.pageSize + i + 1
								// 	obj.code = data[i].empNo
								// 	obj.name = data[i].empName
								// 	obj.phone = data[i].cell != '' ? data[i].cell : '- -'
								// 	obj.card = data[i].idCardNo != '' ? data[i].idCardNo : '- -'
								// 	obj.position = data[i].primaryPositionName != '' ? data[i]
								// 		.primaryPositionName : '- -'
								// 	obj.dept = data[i].personDepName != '' ? data[i].personDepName : '- -'
								// 	obj.email = data[i].email != '' ? data[i].email : '- -'
								// 	that.tableData.push(obj)
								// }
								for (var i = 0; i < data.length; i++) {
									data[i]['index'] = that.jsonData.pageNo * that.jsonData.pageSize - that
										.jsonData.pageSize + i + 1
									data[i]['unit'] = data[i].unit
									data[i]['upperLimit'] = data[i].upperLimit
									data[i]['lowerLimit'] = data[i].lowerLimit
								}
								that.tableData = data
								// that.tableData['index'] = that.jsonData.pageNo * that.jsonData.pageSize - that.jsonData.pageSize + i + 1
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
			//设备名称
			person_name_show(event) {
				this.jsonData.empName = event
			},
			person_code_show(event) {
				this.jsonData.empNo = event
			},

			//顶部查询按钮 筛选信息
			onSubmit() {
				//console.log('submit!')
				//this.jsonData.installAreaCode = null
				// this.jsonData.equipCode = '150103014'
				this.jsonData.equipName = this.pointStandard_model.device
				this.jsonData.profession = this.pointStandard_model.profession
				this.jsonData.pageNo = 1
				this.jsonData.pageSize = 10
				this.getTable()
			},
			//重置搜索条件
			onreset(formName) {
				// this.$refs[formName].resetFields();
				this.jsonData = {
					orgCode: '',
					areaCode: '',
					equipCode: '',
					profession: '',
					pageNo: 1,
					pageSize: 10
				}
				this.pointStandard_model = {
					orgCode: '',
					areaCode: '',
					position: '',
					equipCode: '',
					profession: ''
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

			// 编辑
			updateList(item) {
				console.log(item)
				this.formData = {
					name: item.name, // 标准名称
					content: item.content, // 内容描述
					profession: item.profession, // 专业
					applyType: 1, // 应用类型： 1点检 2巡检
					type: item.type, // 文本类型 0数值1文本
					equipCode: item.equipCode, // 设备code
					equipName: item.equipName, // 设备名字
					accuracyStatus: item.accuracyStatus, // 精度监测 1是 0否
					unit: item.unit, // 单位
					upperLimit: item.upperLimit, // 上限
					lowerLimit: item.lowerLimit, // 下限
					status: item.status // 状态 0弃用 1在用
				}
				this.addJson = {
					name: null, // 标准名称
					content: null, // 内容描述
					profession: null, // 专业
					applyType: 1, // 应用类型： 1点检 2巡检
					type: null, // 文本类型 0数值1文本
					equipCode: null, // 设备code
					equipName: null, // 设备名字
					accuracyStatus: null, // 精度监测 1是 0否
					unit: null, // 单位
					upperLimit: null, // 上限
					lowerLimit: null, // 下限
				}
				this.addJson['id'] = item.id
				this.selectRow = item
				this.showEdit = true
			},
			// 添加信息
			addlist() {
				this.formData = {
					name: null, // 标准名称
					content: null, // 内容描述
					profession: null, // 专业
					applyType: 1, // 应用类型： 1点检 2巡检
					type: null, // 文本类型 0数值1文本
					equipCode: null, // 设备code
					equipName: null, // 设备名字
					accuracyStatus: null, // 精度监测 1是 0否
					unit: null, // 单位
					upperLimit: null, // 上限
					lowerLimit: null, // 下限
					status: null // 状态 0弃用 1在用
				}
				this.addJson = {
					name: null, // 标准名称
					content: null, // 内容描述
					profession: null, // 专业
					applyType: 1, // 应用类型： 1点检 2巡检
					type: null, // 文本类型 0数值1文本
					equipCode: null, // 设备code
					equipName: null, // 设备名字
					accuracyStatus: null, // 精度监测 1是 0否
					unit: null, // 单位
					upperLimit: null, // 上限
					lowerLimit: null, // 下限
					status: null // 状态 0弃用 1在用
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
			// 更多
			moreList(row) {
				// 存储更多本页面数据
				sessionStorage.setItem('deviceStatus', JSON.stringify(row))
				this.$router.push({
					path: '/device/index/deviceOverview'
				})
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
	.lookStandard {
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
