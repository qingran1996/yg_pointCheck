<template>
	<div class="device">
		<el-card class="box-card" shadow="always">
			<el-form :inline="true" :model="user" class="demo-form-inline">
				<el-form-item label="总厂">
					<el-select v-model="user.dept" clearable placeholder="请选择总厂" @change="dept_change">
						<el-option v-for="item in deptList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="车间">
					<el-select v-model="user.farm" clearable :disabled="isdeptshow" placeholder="请选择车间"
						@change="farm_change">
						<el-option v-for="item in farmList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="名称">
					<el-input v-model="user.deviceName" placeholder="请输入设备名称" @input="user_deviceName_show" clearable />
				</el-form-item>
				<!-- <el-form-item label="状态">
					<el-select v-model="user.state" clearable  placeholder="请选择状态" @change="state_change">
						<el-option v-for="item in stateData" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item>
					<el-button v-prevent-re-click size="small" type="primary" @click="onSubmit(user)">查询</el-button>
					<el-button v-prevent-re-click size="small" type="warning" @click="onreset('person_model')">重置
					</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="box-card" shadow="always">
			<el-row style="margin-bottom: 5px;">
				<el-button type="primary" @click="addRoute">新增</el-button>
				<!-- <el-button type="danger" @click="deleteRoute">删除</el-button> -->
			</el-row>
			<vxe-table border round show-overflow highlight-hover-row highlight-current-row highlight-hover-column
				highlight-current-column resizable ref="xTree" row-id="id" 
				:tree-config="{lazy: true, accordion: true, children: 'children', hasChild: 'hasChild', loadMethod: loadChildrenMethod}"
				:data="tableData" :max-height="tableHeight">
				<vxe-table-column field="cid" title="序号" align="center" width="100" tree-node></vxe-table-column>
				<vxe-table-column field="oneLevelArea" width="180" align="center" title="一级区域"></vxe-table-column>
				<vxe-table-column field="twoLevelArea" width="180" align="center" title="二级区域"></vxe-table-column>
				<vxe-table-column field="deviceName" width="180" align="center" title="名称"></vxe-table-column>
				<vxe-table-column field="deviceType" width="180" align="center" title="设备类型"></vxe-table-column>
				<vxe-table-column field="specs" width="180" align="center" title="规格"></vxe-table-column>
				<vxe-table-column field="line" width="180" align="center" title="设备条线"></vxe-table-column>
				<vxe-table-column field="belongTodevice" width="180" align="center" title="所属设备"></vxe-table-column>
				<vxe-table-column field="departmentName" width="180" align="center" title="部门"></vxe-table-column>
				<!-- <vxe-table-column field="area" width="180" align="center" title="区域"></vxe-table-column> -->
				<vxe-table-column field="startTime" width="180" align="center" title="投运日期"></vxe-table-column>
				<vxe-table-column field="userYear" width="180" align="center" title="使用年限"></vxe-table-column>
				<!-- <vxe-table-column field="specification" width="180" align="center" title="规格"></vxe-table-column> -->
				<vxe-table-column field="deviceCode" width="180" align="center" title="设备编码"></vxe-table-column>
				<vxe-table-column field="state" width="180" align="center" title="状态"></vxe-table-column>
				<vxe-table-column field="" title="操作" align="center" width="140" fixed="right">
					<template slot-scope="scope">
						<div class="action" style="cursor: pointer;" >
							<el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
								<el-button type="primary" size="mini" v-if="scope.row.deviceType=='非设备'" @click="updateList(scope.row)" >编辑</el-button>
								<el-button type="primary" size="mini" v-else disabled>编辑</el-button>
								<!-- <el-tag v-if="scope.row.deviceType=='非设备'" @click="updateList(scope.row)">编辑</el-tag>
								<el-tag v-else disabled @click="updateList(scope.row)">编辑</el-tag> -->
							</el-tooltip>
							<!-- <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
								<el-tag @click="lookList(scope.row)">详情</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="检修项目" placement="bottom">
								<el-tag @click="overhaulProject(scope.row)">检修项目</el-tag>
							</el-tooltip> -->
							<el-tooltip class="item" effect="dark" content="删除" placement="bottom">
								<!-- <el-tag type="danger" @click="deleteList(scope.row)">删除</el-tag> -->
								<el-button type="danger" size="mini" v-if="scope.row.deviceType=='非设备'" @click="deleteList(scope.row)" >删除</el-button>
								<el-button type="danger" size="mini" v-else disabled>删除</el-button>
							</el-tooltip>
						</div>
						<!-- <div class="action" style="cursor: pointer;" v-else>同步设备无法编辑</div> -->
					</template>
				</vxe-table-column>
				<template #empty>
					<span>
						<!-- <img src="https://xuliangzhan_admin.gitee.io/vxe-table/static/other/img1.gif"> -->
						<p v-if="tableData.length==0">暂无数据</p>
					</span>
				</template>
			</vxe-table>
			<vxe-modal v-model="showEdit" :title="selectRow ? '编辑&保存' : '新增&保存'" width="800" min-width="600"
				min-height="300" :loading="submitLoading" resize destroy-on-close>
				<template #default>
					<vxe-form :data="formData" :rules="formRules" ref="xForm" title-align="right" title-width="100"
						@submit="submitEvent">
						<vxe-form-item title="名称" field="name" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-input v-model="formData.name" @input="$refs.xForm.updateStatus(scope)" placeholder="请输入名称" clearable></vxe-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="资产编码" field="assetCode" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-input v-model="formData.assetCode" @input="$refs.xForm.updateStatus(scope)" placeholder="请输入资产编码" clearable></vxe-input>
							</template>
						</vxe-form-item>
						<vxe-form-item title="部门" field="dept" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-select v-model="formData.dept" @change="deptform_change(scope)"
									placeholder="请选择部门" clearable>
									<vxe-option v-for="item in deptList" :key="item.value" :value="item.value"
										:label="item.label">
									</vxe-option>
								</vxe-select>
							</template>
						</vxe-form-item>
						<vxe-form-item title="点检区域" field="area" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-select v-model="formData.area" @change="$refs.xForm.updateStatus(scope)"
									placeholder="请选择区域" clearable>
									<vxe-option v-for="item in areaList" :key="item.value" :value="item.value"
										:label="item.label">
									</vxe-option>
								</vxe-select>
							</template>
						</vxe-form-item>
						<vxe-form-item title="一二级区域" field="oneTwo" span="12" :item-render="{}">
							<template #default="scope">
								<el-cascader v-model="formData.oneTwo" separator="-" placeholder="请搜索或选择" :options="showarea"
									ref="ooo" @change="oneTwo_change" clearable filterable>
								</el-cascader>
							</template>
						</vxe-form-item>
						<vxe-form-item title="使用年限" field="limitUsedYears" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-input v-model="formData.limitUsedYears" placeholder="请选择上限"
									@input="$refs.xForm.updateStatus(scope)" type="number" min="0" clearable>
								</vxe-input>
							</template>
						</vxe-form-item>
						<!-- <vxe-form-item title="设备类型" field="type" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-select v-model="formData.type" @change="$refs.xForm.updateStatus(scope)"
									placeholder="请选择设备类型" clearable>
									<vxe-option v-for="item in stateData" :key="item.value" :value="item.value"
										:label="item.label">
									</vxe-option>
								</vxe-select>
							</template>
						</vxe-form-item> -->
						<!-- <vxe-form-item title="内容描述" field="content" span="12" :item-render="{}">
							<template #default="scope">
								<vxe-textarea v-model="formData.content" @input="$refs.xForm.updateStatus(scope)"
									placeholder="请输入内容描述" :autosize="{ minRows: 2, maxRows: 4 }">
								</vxe-textarea>
							</template>
						</vxe-form-item> -->
						<vxe-form-item align="center" span="24" :item-render="{}">
							<template #default="scope">
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
		name: 'device',
		components: {},
		data() {
			return {
				submitLoading: false,
				selectRow: null,
				showEdit: false,
				sexList: [{
						label: '女',
						value: '0'
					},
					{
						label: '男',
						value: '1'
					}
				],
				addJson: {
					name: null, //名称
					description: null, //描述
					limitUsedYears: null, //使用年限
					// assetCode: null, //资产编码
					orgCode: null, //部门Code
					type: 0, //
					orgName: null,
					areaCode: null, //所属区域
					fatherId: 0,
					area1: null, //
					areaId1: null, //
					area2: null, //
					areaId2: null, //
					pictureUrl: null //设备图片
				},
				formData: {
					name: null,
					assetCode: null,
					description: null,
					dept: null,
					limitUsedYears: null,
					type: null,
					area: null,
					oneTwo: null,
					content: null
				},
				showarea: [],
				formRules: {
					name: [{
						required: true,
						message: '请输入名称'
					}],
					assetCode: [{
						required: true,
						message: '请输入资产编码'
					}],
					description: [{
						required: true,
						message: '请输入内容'
					}],
					dept: [{
						required: true,
						message: '请选择部门'
					}],
					// area: [{
					// 	required: true,
					// 	message: '请选择区域'
					// }],
					limitUsedYears: [{
						required: true,
						message: '请输入使用年限'
					}],
					type: [{
						required: true,
						message: '请选择设备类型'
					}],
					oneTwo: [{
						required: true,
						message: '请选择一二级区域'
					}]
				},
				showloading: false,
				isdeptshow: true, //部门弹出
				isdeptshow1: false, //部门弹出
				deptList: [],
				areaList: [],
				farmList: [],
				updateTree: [],
				defaultProps: {
					children: 'childOrgs',
					label: 'name'
				},
				// 筛选
				user: {
					name: '',
					username: '',
					dept: '',
					farm: '',
					deviceName: '',
					area: '',
					belongToWay: '',
					state: ''
				},
				loading: false,
				tableHeight: document.body.clientHeight - 84 - 70 - 50 - 152, // 表格高度
				currentPage: 1,
				pageSize: 10,
				totalPages: 0,
				total: 1,
				showpage: true,
				//展示参数表，并未实际应用
				tableData: [],
				areaData: [{
					value: '1',
					label: '部门1'
				}, {
					value: '2',
					label: '部门2'
				}],
				farmList: [],
				stateData: [{
					value: '',
					label: '全部'
				}, {
					value: '1',
					label: '启用'
				}, {
					value: '0',
					label: '废弃'
				}],
				stateData: [{
					value: 1,
					label: '厂处'
				}, {
					value: 2,
					label: '车间'
				}],
				jsonData: {
					name: '',
					areaCode: '',
					orgCode: '',
					areaId1: '',
					areaId2: '',
					pageNo: 1,
					pageSize: 10
				},
				returnData: []
			}
		},
		created() {
			//查询设备
			this.getData()
			this.getDeptData()
			// this.mockList(500).then(data => {
			// 	this.tableData = data
			// })
		},
		destroyed() {
			this.$bus.off()
		},
		mounted() {
			this.$bus.$on('deviceList', e => {
				console.log(e)
				if (e.children != undefined) {
					this.jsonData.areaId1 = e.areaId1
					this.jsonData.areaId2 = ''
				} else {
					this.jsonData.areaId1 = ''
					this.jsonData.areaId2 = e.areaId2
				}
				this.jsonData.pageNo = 1
				this.jsonData.pageSize = 10
				// this.jsonData.personDep = e.code
				this.getData()
			})
			this.$bus.$on('areaTreeshow', e => {
				// console.log(e)
				// console.log("设备区域树", e)
				copyTransFun(e)

				function copyTransFun(e) {
					e.forEach((item) => {
						if (item.areaId1 != undefined) {
							item.value = item.areaId1;
							delete item.areaId1
						}
						if (item.areaId2 != undefined) {
							item.value = item.areaId2;
							delete item.areaId2
						}
						if (item.children != undefined) {
							if (item.children.length) {
								copyTransFun(item.children);
							}
						}
					})
				}

				// console.log(e[0])
				this.showarea = e
			})
		},
		methods: {
			getCascaderObj(val, opt) {
				return val.map(function(value, index, array) {
					for (var itm of opt) {
						if (itm.value == value) {
							opt = itm.children;
							return itm;
						}
					}
					return null;
				});
			},
			//一二级区域选择
			oneTwo_change(item) {
				console.log(item)
				// console.log(this.)
				this.returnData = this.getCascaderObj(item,this.showarea)
				this.addJson.area1 = this.returnData[0].label
				this.addJson.areaId1 = this.returnData[0].value
				this.addJson.area2 = this.returnData[1].label
				this.addJson.areaId2 = this.returnData[1].value
				// console.log(returnData)
			},
			dept_change(data) {
				console.log(data)
				this.farmList = []
				if (this.user.dept === '') {
					this.isdeptshow = true
					this.jsonData.areaId1 = ''
					this.jsonData.areaId2 = ''
					this.$bus.emit('orgCodeAreaFarm', '')
					this.user.farm = ''
				} else {
					this.isdeptshow = false
				}
				let getdata = null
				getdata = this.deptshow(data)
				console.log(getdata)
				this.jsonData.orgCode = getdata.orgcode
				this.$bus.emit('orgCodeArea', getdata.orgcode)

				for (let i = 0; i < getdata.children.length; i++) {
					this.farmList.push({
						value: getdata.children[i].id,
						label: getdata.children[i].name,
						children: getdata.children[i].childOrgs,
						data: getdata.children[i]
					})
				}


				// this.farmList = getdata
				// console.log(getdata)
				// this.isdeptshow = false
			},
			deptshow(item) {
				let data = {
					orgcode: '',
					children: []
				}
				for (let i = 0; i < this.deptList.length; i++) {
					if (item === this.deptList[i].value) {
						data.orgcode = this.deptList[i].data.orgCode
						data.children = this.deptList[i].children
					}
				}
				return data
			},
			farm_change(data) {
				// console.log(data,this.farmshow(data))
				this.jsonData.orgCode = this.farmshow(data)
				this.$bus.emit('orgCodeAreaFarm', this.jsonData.orgCode)
				// this.$bus.emit('orgCodeArea1', getdata.orgcode)
			},
			farmshow(item) {
				let code = ''
				for (let i = 0; i < this.farmList.length; i++) {
					if (item === this.farmList[i].value) {
						code = this.farmList[i].data.orgCode
					}
				}
				return code
			},
			//新增修改时间选择
			commissioningDate_show(event) {
				console.log(event)
			},
			deptform_change (scope) {
				this.$refs.xForm.updateStatus(scope)
				// console.log(scope.data.dept,this.formData.dept)
				this.addJson.orgCode = scope.data.dept
				this.addJson.orgName = this.changeOrg(scope.data.dept)
			},
			submitEvent() {
				this.submitLoading = true
				setTimeout(() => {
					this.submitLoading = false
					// this.showEdit = false
					if (this.selectRow) {
						// this.$XModal.message({
						// 	message: '保存成功',
						// 	status: 'success'
						// })
						// Object.assign(this.selectRow, this.formData)
						
						this.addJson.name = this.formData.name
						this.addJson.assetCode = this.formData.assetCode
						this.addJson.areaCode = this.formData.area
						this.addJson.limitUsedYears = this.formData.limitUsedYears
						// this.addJson.orgCode = this.formData.dept
						// this.addJson.orgName = this.changeOrg(this.addJson.orgCode)
						// this.addJson.areaCode = this.formData.area
						// this.addJson.area1 = this.returnData[0].label
						// this.addJson.areaId1 = this.returnData[0].value
						// this.addJson.area2 = this.returnData[1].label
						// this.addJson.areaId2 = this.returnData[1].value
						// this.addJson.limitUsedYears = this.formData.limitUsedYears
						
						// console.log(this.addJson)
						this.deviceUpdateDevice()
					} else {
						this.addJson.name = this.formData.name
						this.addJson.assetCode = this.formData.assetCode
						// this.addJson.orgCode = this.formData.dept
						// this.addJson.orgName = this.changeOrg(this.addJson.orgCode)
						this.addJson.areaCode = this.formData.area
						// this.addJson.area1 = this.returnData[0].label
						// this.addJson.areaId1 = this.returnData[0].value
						// this.addJson.area2 = this.returnData[1].label
						// this.addJson.areaId2 = this.returnData[1].value
						this.addJson.limitUsedYears = this.formData.limitUsedYears
						// this.addJson.type = this.formData.type
						this.addJson.description = this.formData.content
						// console.log(this.addJson)
						this.addDevice()
						// this.$XModal.message({
						// 	message: '新增成功',
						// 	status: 'success'
						// })
						// this.$refs.xTable.insert(this.formData)
					}
				}, 500)
			},
			changeOrg (code) {
				let val = ''
				for (let i=0;i<this.deptList.length;i++) {
					if (code===this.deptList[i].value) {
						val = this.deptList[i].label
					}
				}
				return val
			},
			deviceUpdateDevice () {
				this.deviceUpdate(this.addJson).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: '设备更新成功',
							type: 'success'
						})
						this.jsonData.pageNo = 1
						this.jsonData.pageSize = 10
						this.getData()
						this.showEdit = false
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			addDevice () {
				this.deviceAdd(this.addJson).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: '设备新增成功',
							type: 'success'
						})
						this.jsonData.pageNo = 1
						this.jsonData.pageSize = 10
						this.getData()
						this.showEdit = false
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			selectChangeEvent({
				records
			}) {
				console.info(`勾选${records.length}个树形节点`, records)
			},
			//点击展开
			loadChildrenMethod({
				row
			}) {
				// 异步加载子节点
				return new Promise(resolve => {
					console.log(row)
					setTimeout(() => {
						let child = []
						let data = row.childList
						for (let i = 0; i < data.length; i++) {
							var obj = {}
							var j = i + 1
							// obj.id = data[i].id
							obj.cid = row.cid + '.' + j
							obj.id = data[i].id
							// obj.cid = that.jsonData.pageNo * that.jsonData.pageSize - that.jsonData
							// 	.pageSize + i + 1
							obj.oneLevelArea = row.oneLevelArea
							obj.twoLevelArea = row.twoLevelArea
							obj.deviceName = data[i].name
							obj.specs = data[i].specification
							obj.departmentName = row.departmentName
							obj.line = data[i].line
							obj.deviceType = data[i].deviceType == 0?'非设备':'设备'
							obj.belongTodevice = row.deviceName
							obj.area = row.area
							obj.startTime = row.startTime
							obj.userYear = row.userYear
							obj.deviceCode = row.deviceCode
							obj.state = row.state
							child.push(obj)
						}
						resolve(child)
					}, 500)
				})
			},
			//获取部门接口
			getDeptData() {
				let json = {
					orgType: 2
				}
				this.updateTree = []
				this.deptList = []
				this.deviceDept(json).then(res => {
					if (res.data.code === 0) {
						console.log("部门数据", res.data.data)
						//将设备位置 从左树传给右侧 主界面
						// this.$bus.emit('devicePlace', res.data.data)
						const data = res.data.data
						for (let i = 0; i < data.length; i++) {
							this.deptList.push({
								value: data[i].id,
								label: data[i].name,
								children: data[i].childOrgs,
								data: data[i]
							})
						}
						// this.updateTree[0] = res.data.data[0].id
						// this.deptList = data
						// this.updateTree[0] = res.data.data.id

					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			getData() {
				this.deviceData(this.jsonData).then(res => {
					if (res.data.code === 0) { //查询到数据
						//console.log(res)
						let data = res.data.data.records
						console.log('设备列表查询', data)
						this.numberPage = res.data.data.current
						//console.log('当前页数数据数量', this.numberPage)
						this.showloading = true
						let that = this
						setTimeout(function() {
							if (data.length !== 0) { //如果请求数据不为空
								that.total = res.data.data.total //列表总数
								for (var i = 0; i < data.length; i++) {
									var obj = {}
									obj.id = data[i].id
									obj.cid = that.jsonData.pageNo * that.jsonData.pageSize - that.jsonData
										.pageSize + i + 1
									obj.oneLevelArea = data[i].area1
									obj.twoLevelArea = data[i].area2
									obj.deviceName = data[i].name
									obj.specs = data[i].specification
									obj.line = data[i].line
									obj.departmentName = data[i].orgName
									obj.deviceType = data[i].equipType == 0?'非设备':'设备'
									obj.belongTodevice = '- -'
									// obj.area = data[i].installPosition
									obj.childList = data[i].equipmentComponentlist
									obj.hasChild = data[i].equipmentComponentlist != undefined ? true : false
									obj.startTime = data[i].commissioningDate
									obj.userYear = data[i].limitUsedYears
									obj.deviceCode = data[i].equipCode
									obj.state = data[i].status == 1 ? '启用' : '废弃'
									obj.data = data[i]
									that.tableData.push(obj)
								}
								//console.log('表', that.tableData)
							} else {
								that.tableData = []
								that.total = 0
							}
							that.showloading = false //要执行的事件
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
			//设备名称
			user_deviceName_show(event) {
				this.jsonData.name = event
			},
			//区域选择
			area_change() {
				// this.jsonData.dept = ''
			},
			//所属条线选择
			belongToWay_change() {
				// this.jsonData.dept = event
			},
			//状态选择
			state_change(event) {
				console.log(event)
				this.jsonData.status = event
			},
			getRowKeys(row) {
				return row.cid; // cid为列表数据的唯一标识
			},
			addRoute() {
				this.formData = {
					name: null,
					assetCode: null,
					description: null,
					dept: null,
					limitUsedYears: null,
					type: null,
					area: null,
					oneTwo: null,
					content: null
				}
				this.addJson = {
					name: null, //名称
					description: null, //描述
					limitUsedYears: null, //使用年限
					assetCode: null, //资产编码
					orgName: null,
					orgCode: null, //部门Code
					type: 0, //
					areaCode: null, //所属区域
					fatherId: 0,
					area1: null, //
					areaId1: null, //
					area2: null, //
					areaId2: null, //
					pictureUrl: null //设备图片
				}
				this.selectRow = null
				this.showEdit = true
			},
			// 删除
			deleteList(row) {
				// this.$bus.emit('deviceDelete', this.tableData)
				this.$confirm('是否删除该设备?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// console.log(row)
					this.deleteItem(row.id)
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
			},
			deleteItem(num) {
				this.deviceDelete(num).then(res => {
					//console.log(res)
					if (res.data.code === 0) {
						this.$message({
							type: 'success',
							message: '成功删除该设备'
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
			updateList(item) {
				console.log(item)
				// console.log(this.changeOrg(JSON.parse(item.data.orgCode)))
				let oneTwo = []
				oneTwo.push(item.data.areaId1)
				oneTwo.push(item.data.areaId2)
				this.formData = {
					name: item.deviceName,
					assetCode: item.data.assetCode,
					description: '- -',
					dept: this.changeOrg(JSON.parse(item.data.orgCode)),
					limitUsedYears: item.userYear,
					type: null,
					area: null,
					oneTwo: oneTwo,
					content: null
				}
				this.addJson = {
					id: item.id,
					name: item.deviceName, //名称
					description: null, //描述
					limitUsedYears: item.userYear, //使用年限
					assetCode: item.data.assetCode, //资产编码
					orgCode: item.data.orgCode, //部门Code
					orgName: this.changeOrg(JSON.parse(item.data.orgCode)),
					type: 0, //
					areaCode: null, //所属区域
					fatherId: 0,
					area1: item.data.area1, //
					areaId1: item.data.areaId1, //
					area2: item.data.area2, //
					areaId2: item.data.areaId2, //
					pictureUrl: null //设备图片
				}
				this.selectRow = item
				this.showEdit = true
			},
			lookList() {},
			overhaulProject() {},
			onSubmit(item) {
				// console.log(123)
				this.jsonData.pageNo = 1
				this.jsonData.pageSize = 10
				this.getData()
			},
			onreset(formName) {
				// this.$refs[formName].resetFields();
				this.jsonData = {
					name: '',
					description: '',
					areaCode: '',
					orgCode: '',
					areaId1: '',
					areaId2: '',
					pageNo: 1,
					pageSize: 10
				}
				this.user = {
					name: '',
					username: '',
					farm: '',
					dept: '',
					deviceName: '',
					area: '',
					belongToWay: '',
					state: ''
				}
				this.isdeptshow = true
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
	.device {
		padding: 10px;
	}

	/* .vxe-modal--wrapper {
		z-index: 500 !important;
	} */
</style>
