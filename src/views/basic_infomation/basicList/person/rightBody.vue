<template>
	<div class="dept_body">
		<el-card shadow="always">
			<el-form :inline="true" ref="person_model" :model="person_model" class="demo-form-inline">
				<el-form-item label="人员名称">
					<el-input v-model="person_model.name" placeholder="请输入内容" @input="person_name_show" clearable />
				</el-form-item>
				<el-form-item label="人员编号">
					<el-input v-model="person_model.code" placeholder="请输入内容" @input="person_code_show" clearable />
				</el-form-item>
				<!-- <el-form-item label="职位">
					<el-select v-model="person_model.position" placeholder="请选择职位" @change="position_change">
						<el-option v-for="item in positionData" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item>
					<el-button v-prevent-re-click size="small" type="primary" @click="onSubmit">查询</el-button>
					<el-button v-prevent-re-click size="small" type="warning" @click="onreset('person_model')">重置</el-button>
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
				<el-table-column prop="code" label="编号" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="name" label="姓名" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="phone" label="电话" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="card" label="身份证" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="position" label="职位" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="empTypeName" label="用工状态" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="dept" label="部门" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="email" label="邮箱" min-width="180" align="center" show-overflow-tooltip />
				<!-- <el-table-column prop="recentlyIP" label="最近登陆IP" min-width="180" align="center" />
				<el-table-column prop="lastLoginIP" label="上次登陆IP" min-width="180" align="center" /> -->
				<el-table-column fixed="right" label="操作" min-width="140" align="center">
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
							<el-tooltip class="item" effect="dark" content="删除" placement="bottom"
								:open-delay="otherTooltipDelay">
								<el-tag @click="deleteList(scope.row)" type="danger">删除</el-tag>
							</el-tooltip>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<vxe-modal v-model="showEdit" :title="selectRow ? '人员编辑&保存' : '人员新增&保存'" width="60%" min-width="600"
				:loading="submitLoading" resize destroy-on-close @close="closemodel">
				<template #default>
					<vxe-form :data="formData" :rules="formRules" title-colon title-align="right" title-width="150"
						ref="xForm" @submit="submitEvent">
						<vxe-form-item title="人员名称" field="empName" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-input v-model="formData.empName" @input="$refs.xForm.updateStatus(scope)"
									placeholder="请输入人员名称" clearable></vxe-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="人员编码" field="empNo" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-input v-model="formData.empNo" @input="$refs.xForm.updateStatus(scope)"
									placeholder="请输入人员编码" clearable></vxe-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="性别" field="genderValue" span="12" :item-render="{}">
							<template #default="scope">
								<div>
									<!-- <vxe-radio-group v-model="formData.genderValue" @change="genderValue_show(scope)">
										<vxe-radio label="1" content="男"></vxe-radio>
										<vxe-radio label="2" content="女"></vxe-radio>
									</vxe-radio-group> -->
									<el-radio-group v-model="formData.genderValue" @change="genderValue_show(scope)">
									    <el-radio :label="1">男</el-radio>
									    <el-radio :label="2">女</el-radio>
									  </el-radio-group>
								</div>

							</template>
						</vxe-form-item>
						<vxe-form-item title="身份证号码" field="idCardNo" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-input v-model="formData.idCardNo" @input="$refs.xForm.updateStatus(scope)"
									placeholder="请输入身份证号码" clearable></vxe-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="手机号码" field="cell" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-input v-model="formData.cell" @input="$refs.xForm.updateStatus(scope)"
									placeholder="请输入手机号码" clearable></vxe-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="职位" field="primaryPositionName" span="12" :item-render="{}">
							<template #default="scope">
								<!-- <vxe-input v-model="formData.primaryPositionName" @input="$refs.xForm.updateStatus(scope)"
									placeholder="请选择职位" clearable></vxe-input> -->
								<el-select v-model="formData.primaryPositionName" placeholder="请选择职位"
									@change="primaryPosition_change(scope)">
									<el-option v-for="item in primaryPositionData" :key="item.value" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</template>
						</vxe-form-item>
						<vxe-form-item title="用工状态" field="empTypeName" span="12" :item-render="{}">
							<template #default="scope">
								<!-- <vxe-input v-model="formData.age" @input="$refs.xForm.updateStatus(scope)"
									placeholder="请选择用工状态" clearable></vxe-input> -->
								<el-select v-model="formData.empTypeName" placeholder="请选择用工状态"
									@change="empTypeName_change(scope)">
									<el-option v-for="item in empTypeNameData" :key="item.value" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</template>
						</vxe-form-item>
						<vxe-form-item title="年龄" field="age" span="12" :item-render="{}">
							<template #default="scope">

								<vxe-input v-model="formData.age" @input="$refs.xForm.updateStatus(scope)"
									placeholder="请输入年龄" clearable type="number"></vxe-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="邮箱" field="email" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-input v-model="formData.email" @input="$refs.xForm.updateStatus(scope)"
									placeholder="请输入邮箱" clearable></vxe-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="备注" field="remark" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-textarea v-model="formData.remark" placeholder="请输入内容"
									:autosize="{ minRows: 2, maxRows: 4 }"></vxe-textarea>
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
		</personAdd>
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
	// import personAdd from './personAdd.vue'
	// import vueQr from 'vue-qr'
	export default {
		name: 'deptBody',
		components: {
			// personAdd
		},
		data() {
			return {
				/**********************vxe-model*/
				submitLoading: false,
				selectRow: null,
				showEdit: false,
				formData: {
					genderValue: null,
					empName: null,
					empNo: null,
					idCardNo: null,
					cell: null,
					age: null,
					email: null,
					empTypeName: null,
					primaryPositionName: null,
					remark: null
				},
				formRules: {
					empName: [{
						required: true,
						message: '请输入人员名称'
					}],
					empNo: [{
						required: true,
						message: '请输入人员编码'
					}],
					genderValue: [{
						required: true,
						message: '请选择性别'
					}],
					idCardNo: [{
						required: true,
						pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
						message: '请输入正确的身份证号码'
					}],
					empTypeName: [{
						required: true,
						message: '请选择用工状态'
					}],
					cell: [{
						required: true,
						message: '请输入手机号码'
					}],
					primaryPositionName: [{
						required: true,
						message: '请选择职位'
					}],
					age: [{
						required: true,
						message: '请输入年龄'
					}],
					email: [{
						required: true,
						pattern: /^\w+@[a-z0-9]+\.[a-z]{2,4}$/,
						message: '请输入正确的邮箱'
					}],
				},
				addJson: {
					genderValue: null, // 1男2女
					idCardNo: null, //身份证号码
					cell: null, //手机号码
					empName: null, //姓名
					empTypeName: null, //用工状态
					age: null, //年龄
					empNo: null, //人员编码
					personDep: '', //部门编码
					personDepName: '', //部门名称
					email: null, //邮箱
					primaryPositionName: null, //职位名称
					remark: null //备注
				},
				primaryPositionData: [{
					value: '',
					label: '全部'
				}, {
					value: 1,
					label: '业务员'
				}, {
					value: 2,
					label: '物流外勤'
				}],
				empTypeNameData: [{
					value: '',
					label: '全部'
				}, {
					value: 1,
					label: '正式人员'
				}, {
					value: 2,
					label: '挂靠'
				}],
				/*******************************vxe-model*/
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
					// id: null,
					empName: '',
					empNo: '',
					orgCode: '',
					pageNo: 1,
					pageSize: 10
				},
				jsonDevice: {
					id: 0,
					catalog: 1 //1:设备 2:备品备件 0:所有
				},
				// 筛选
				person_model: {
					name: '',
					code: '',
					position: '',
					code: '',
					deviceType: '',
					radio: '全部',
					deviceTypeArry: ''
				},
				//设备状态
				device_status: null,
				//设备类型
				device_options: [{
					value: '1',
					label: '炉管'
				}, {
					value: '2',
					label: '罐类'
				}],
				//是否为危险品
				isTZdata: [{
					value: '',
					label: '全部'
				}, {
					value: 1,
					label: '是'
				}, {
					value: 0,
					label: '否'
				}]
			}
		},
		created() {
			this.getTable() //获取table数据
		},
		mounted() {
			//this.qrcode(1);
			this.$bus.$on('personList', e => {
				console.log(e)
				this.jsonData.pageNo = 1
				this.jsonData.pageSize = 10
				this.jsonData.orgCode = e.orgCode
				this.getTable()

				//获取部门信息代入新增字段
				this.addJson.personDep = e.orgCode
				this.addJson.personDepName = e.name
			})
			this.$bus.$on('firstDept', e => {
				// console.log(e)
				this.addJson = {
					genderValue: null, // 1男2女
					idCardNo: null, //身份证号码
					cell: null, //手机号码
					empName: null, //姓名
					empTypeName: null, //用工状态
					age: null, //年龄
					empNo: null, //人员编码
					personDep: e.orgCode, //部门编码
					personDepName: e.name, //部门名称
					email: null, //邮箱
					primaryPositionName: null, //职位名称
					remark: null //备注
				}
			})
		},
		destroyed() {
			this.$bus.off('personList')
		},
		watch: {
			'device_model.deviceTypeArry': {
				handler: function(val) {
					this.$refs.DeviceTypeTree.filter(val)
					if (val === '') {
						this.jsonData.deviceTypeId = null
					}
				}
			}
		},
		methods: {
			submitEvent() {
				this.submitLoading = true
				setTimeout(() => {
					this.submitLoading = false
					if (this.selectRow) {
						// console.log(this.formData)
						this.addJson.idCardNo = this.formData.idCardNo
						this.addJson.cell = this.formData.cell
						this.addJson.empName = this.formData.empName
						this.addJson.age = this.formData.age
						this.addJson.empNo = this.formData.empNo
						this.addJson.email = this.formData.email
						this.addJson.remark = this.formData.remark
						
						console.log(this.addJson)
						this.updateperson()
					} else {
						console.log('新增的参数', this.formData)
						this.addJson.idCardNo = this.formData.idCardNo
						this.addJson.cell = this.formData.cell
						this.addJson.empName = this.formData.empName
						this.addJson.age = this.formData.age
						this.addJson.empNo = this.formData.empNo
						this.addJson.email = this.formData.email
						this.addJson.remark = this.formData.remark
						console.log(this.addJson)
						this.addperson()
					}
				}, 500)
			},
			addperson () {
				this.personAdd(this.addJson).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: '人员新增完成',
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
			updateperson () {
				this.personUpdate(this.addJson).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: '人员更新完成',
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
			closemodel() {
				this.checked = true
			},
			genderValue_show(scope) {
				this.$refs.xForm.updateStatus(scope)
				// console.log(scope.data)
				this.addJson.genderValue = JSON.parse(scope.data.genderValue)
			},
			//职位
			primaryPosition_change(scope) {
				console.log(scope)
				this.$refs.xForm.updateStatus(scope)
				this.addJson.primaryPositionName = this.primaryPosition_show(scope.data.primaryPositionName)
			},
			//用工状态
			empTypeName_change(scope) {
				// console.log(scope)
				this.$refs.xForm.updateStatus(scope)
				this.addJson.empTypeName = this.empTypeName_show(scope.data.empTypeName)
			},
			empTypeName_show(value) {
				let val = ''
				for (let i = 0; i < this.empTypeNameData.length; i++) {
					if (value === this.empTypeNameData[i].value) {
						val = this.empTypeNameData[i].label
					}
				}
				return val
			},
			//职位编号转换文字
			primaryPosition_show(value) {
				let val = ''
				for (let i = 0; i < this.primaryPositionData.length; i++) {
					if (value === this.primaryPositionData[i].value) {
						val = this.primaryPositionData[i].label
					}
				}
				return val
			},
			//获取设备分类
			getdata() {
				this.$axios.post('/d/deviceType/query', this.jsonData).then(res => {
					if (res.data.code === 0) {
						//console.log(res.data.data)
						const data = res.data.data
						this.updateTree.push(data[0].id)
						for (let i = 0; i < data.length; i++) {
							this.data.push(res.data.data[i])
						}
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			//设备类型获取
			getDeviceOptions() {
				this.getDeviceTypeQueryTree(this.jsonDevice).then(res => {
					if (res.data.code === 0) {
						this.device_options = res.data.data
						console.log('设备类型', this.device_options)
					}
				}).catch(err => {
					console.log('设备类型获取错误', err)
				})
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
				this.personData(this.jsonData).then(res => {
					if (res.data.code === 0) { //查询到数据
						//console.log(res)
						let data = res.data.data.records
						console.log('人员列表查询', data)
						this.numberPage = res.data.data.current
						//console.log('当前页数数据数量', this.numberPage)
						this.loading = true
						let that = this
						setTimeout(function() {
							if (data.length !== 0) { //如果请求数据不为空
								that.total = res.data.data.total //列表总数
								for (var i = 0; i < data.length; i++) {
									var obj = {}
									obj.index = that.jsonData.pageNo * that.jsonData.pageSize - that
										.jsonData.pageSize + i + 1
									obj.code = data[i].empNo
									obj.name = data[i].empName
									obj.phone = data[i].cell != '' ? data[i].cell : '- -'
									obj.card = data[i].idCardNo != '' ? data[i].idCardNo : '- -'
									obj.position = data[i].primaryPositionName != '' ? data[i]
										.primaryPositionName : '- -'
									obj.empTypeName = data[i].empTypeName
									obj.data = data[i]
									// obj.specialty = data[i].
									obj.dept = data[i].personDepName != '' ? data[i].personDepName : '- -'
									obj.email = data[i].email != null ? data[i].email : '- -'
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
			//设备位号
			device_code_show(event) {
				//console.log(event)
				this.jsonData.deviceKks = event
			},
			//是否特种设备
			tzchange(val) {
				//	console.log(val)
				this.jsonData.isSpecial = val
			},
			//顶部查询按钮 筛选信息
			onSubmit() {
				//console.log('submit!')
				//this.jsonData.installAreaCode = null
				this.jsonData.pageNo = 1
				this.jsonData.pageSize = 10
				this.getTable()
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
			// 删除
			deleteList(row) {
				// this.$bus.emit('deviceDelete', this.tableData)
				this.$confirm('是否删除该人员?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deleteItem(row.code)
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
			},
			// 
			deleteItem(num) {
				//console.log(row)
				let json = {
					empNo: num
				}
				this.personDelete(json).then(res => {
					//console.log(res)
					if (res.data.code === 0) {
						this.$message({
							type: 'success',
							message: '成功删除该人员'
						})
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
			//批量删除判断
			isDeleteConfirm(arry) {
				return arry.filter(item => item.isMaintenancing !== 0)
			},
			// 编辑
			updateList(item) {
				console.log(item)
				this.formData = {
					genderValue: item.data.gender,
					empName: item.name,
					empNo: item.code,
					idCardNo: item.card,
					cell: item.phone,
					age: item.data.age,
					email: item.email,
					empTypeName: item.data.empTypeName,
					primaryPositionName: item.data.primaryPositionName,
					remark: item.data.remark
				}
				
				this.addJson.genderValue = JSON.parse(item.data.gender)
				this.addJson.empTypeName = item.data.empTypeName
				this.addJson.primaryPositionName = item.data.primaryPositionName
				this.addJson.id = item.data.id
				
				this.selectRow = item
				this.showEdit = true
			},
			// 添加信息
			addlist() {
				this.formData = {
					genderValue: null,
					empName: null,
					empNo: null,
					idCardNo: null,
					cell: null,
					age: null,
					email: null,
					empTypeName: null,
					primaryPositionName: null,
					remark: null
				}
				// this.addJson = {
				// 	genderValue: null, // 1男2女
				// 	idCardNo: null, //身份证号码
				// 	cell: null, //手机号码
				// 	empName: null, //姓名
				// 	empTypeName: null, //用工状态
				// 	age: null, //年龄
				// 	empNo: null, //人员编码
				// 	personDep: '', //部门编码
				// 	personDepName: '永钢集团', //部门名称
				// 	email: null, //邮箱
				// 	primaryPositionName: null, //职位名称
				// 	remark: null //备注
				// }
				this.selectRow = null
				this.showEdit = true
			},
			//重置搜索条件
			onreset(formName) {
				// this.$refs[formName].resetFields();
				this.jsonData = {
					empName: '',
					empNo: '',
					orgCode: '',
					pageNo: 1,
					pageSize: 10
				}
				this.person_model = {
					name: '',
					code: '',
					position: '',
					code: '',
					deviceType: '',
					radio: '全部',
					deviceTypeArry: ''
				}
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
			gotoSort() {
				this.$router.push({
					path: '/device/deviceSort'
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
	.dept_body {
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
