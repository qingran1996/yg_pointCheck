<template>
	<div class="domain">
		<el-card class="box-card" shadow="always">
			<el-form :inline="true" :model="user" class="demo-form-inline">
				<el-form-item label="部门">
					<!-- <el-select v-model="user.dept" placeholder="请选择部门" @change="dept_change">
						<el-option v-for="item in deptData" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select> -->
					<el-popover placement="right" width="400" trigger="click" v-model="isdeptshow">
						<div style="height: 200px;overflow-y: scroll;">
							<!-- <el-tree :data="deptList" accordion node-key="id" :default-expanded-keys="updateTree"
								:expand-on-click-node="false" :props="defaultProps" @node-click="handleNodeClick">
							</el-tree> -->
							<el-tree :data="deptList" accordion show-checkbox check-strictly
								:expand-on-click-node="false" ref="treeForm" node-key="id"
								@check-change="handleNodeClick" :props="defaultProps">
								<span slot-scope="{ node }" class="custom-tree-node">
									<el-tooltip class="item" effect="dark" :content="node.label" placement="right">
										<span>{{ node.label }}</span>
									</el-tooltip>
								</span>
							</el-tree>
						</div>
						<!-- <el-button slot="reference">选择部门</el-button> -->
						<el-input v-model="user.dept" placeholder="请点击选择车间" slot="reference" clearable />
					</el-popover>
				</el-form-item>
				<!-- <el-form-item label="所属条线">
    			<el-select v-model="user.belongToWay" placeholder="请选择所属条线" @change="belongToWay_change">
    				<el-option v-for="item in belongToWayData" :key="item.value" :label="item.label" :value="item.value">
    				</el-option>
    			</el-select>
    		</el-form-item> -->
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
			<el-row style="margin-bottom: 5px;">
				<el-button icon="el-icon-circle-plus-outline" type="primary" @click="addRoute">新增</el-button>
				<el-button icon="el-icon-delete" v-if="chooseData.length==0" type="danger" @click="deleteRoute"
					disabled>批量删除</el-button>
				<el-button icon="el-icon-delete" v-else type="danger" @click="deleteRoute">批量删除</el-button>
				<el-upload class="upload-demo" style="display: inline-block;margin: 0 10px;" action=""
					:show-file-list="false" :on-change="handleChange" :on-remove="handleRemove"
					:on-exceed="handleExceed" :limit="100" accept="application/vnd.openxmlformats-    
				  officedocument.spreadsheetml.sheet,application/vnd.ms-excel" :auto-upload="false">
					<el-button icon="el-icon-upload" type="success">区域导入</el-button>
				</el-upload>
				<el-button icon="el-icon-download" v-if="chooseData.length==0" type="info" @click="ewmOut" disabled>
					批量导出二维码</el-button>
				<el-button icon="el-icon-download" v-else type="info" @click="ewmOut">批量导出二维码</el-button>
			</el-row>
			<vxe-table border round show-overflow highlight-hover-row highlight-current-row highlight-hover-column
				highlight-current-column resizable ref="xTree" row-id="id"
				:tree-config="{accordion: true, children: 'childrenData'}" :data="tableData" :max-height="tableHeight"
				@checkbox-change="selectChangeEvent" @checkbox-all="checkAllShow">
				<vxe-table-column type="checkbox" title="全选" width="100" tree-node></vxe-table-column>
				<vxe-table-column field="cid" title="序号" align="center" width="100"></vxe-table-column>
				<vxe-table-column field="areaName" min-width="180" align="center" title="父区域"></vxe-table-column>
				<vxe-table-column field="areaNameSon" min-width="180" align="center" title="区域名称"></vxe-table-column>
				<!-- <vxe-table-column field="areaNameLong" min-width="180" align="center" title="全区域"></vxe-table-column> -->
				<vxe-table-column field="dept" min-width="180" align="center" title="部门"></vxe-table-column>
				<vxe-table-column field="state" min-width="180" align="center" title="状态"></vxe-table-column>
				<vxe-table-column field="" title="操作" align="center" min-width="280" fixed="right">
					<template slot-scope="scope">
						<div class="action" style="cursor: pointer;">
							<el-tooltip v-show="scope.row.isSon==false" class="item" effect="dark" content="新增子区域"
								placement="bottom">
								<el-tag @click="addSonList(scope.row)">新增子区域</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="修改" placement="bottom">
								<el-tag type="info" @click="updateList(scope.row)">修改</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="设备关联" placement="bottom">
								<el-tag @click="deviceList(scope.row)" type="success">设备关联</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="white" content="二维码" placement="bottom">
								<div slot="content" ref="imageWrapper">
									<div class="channelQrcode" :id="'scopeindex'+scope.row.ewm">
										<div style="justify-content: center;font-size: 13px;text-align: left;">区域1：
											{{ scope.row.areaNameSon }}
										</div>
										<div style="justify-content: center;font-size: 13px;text-align: left;">部门：
											{{ scope.row.dept }}
										</div>
										<qrcode-vue :id="'showqrcode'+scope.row.ewm" :value="scope.row.ewm"
											:size="'150'" level="H"
											style="display: flex;justify-content: center;text-align: left;">
										</qrcode-vue>
									</div>
									<el-button style="margin-top: 5px;" type="info" plain
										v-print="'scopeindex'+scope.row.ewm" size="mini">打印</el-button>
								</div>
								<el-tag type="warning">二维码</el-tag>
							</el-tooltip>

						</div>
					</template>
				</vxe-table-column>
				<!-- <template #empty>
					<span>
						<img src="https://xuliangzhan_admin.gitee.io/vxe-table/static/other/img1.gif">
						<p v-if="tableData.length==0">没有更多数据了！</p>
					</span>
				</template> -->
			</vxe-table>

			<!-- 分页器 -->
			<div class="block" style="margin-top:15px;" v-show="showpage">
				<el-pagination v-show="total!==0" align="center" :current-page="currentPage" :page-sizes="[5,10,20,200]"
					:page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
					@size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</div>
		</el-card>
		<vxe-modal v-model="showEdit" :title="selectRow ? '区域编辑&保存' : '区域新增&保存'" width="50%" min-width="600"
			:loading="submitLoading" resize destroy-on-close @close="closemodel">
			<template #default>
				<vxe-form :data="formData" :rules="formRules" title-colon title-align="right" title-width="150"
					ref="xForm" @submit="submitEvent">
					<vxe-form-item title="区域名称" field="name" span="12" :item-render="{}">
						<template #default="scope">
							<vxe-input v-model="formData.name" @input="$refs.xForm.updateStatus(scope)"
								placeholder="请输入区域名称" clearable></vxe-input>
						</template>
					</vxe-form-item>
					<vxe-form-item title="部门选择" field="dept" span="12" :item-render="{}">
						<template #default="scope">
							<el-popover placement="right" width="400" trigger="click" v-model="isdeptshow1">
								<div style="height: 200px;overflow-y: scroll;">
									<el-tree :data="deptList" accordion node-key="id"
										:default-expanded-keys="updateTree" :expand-on-click-node="false"
										:props="defaultProps" @node-click="handleNodeClick1"></el-tree>
								</div>
								<vxe-input slot="reference" v-model="formData.dept" :disabled="isSon"
									@input="$refs.xForm.updateStatus(scope)" placeholder="请点击选择部门" clearable>
								</vxe-input>
							</el-popover>
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
		<QrCode :qrCodeData="multipleSelection" @closeDownload="closeDownload" :zipName="user.dept"
			v-if="downloadLoading" @isshow="downloadLoading" />
		<!-- 选择设备 -->
		<choosedevice :isshow="addType" :areaCode="areaCode" @closedialog="closedialog"></choosedevice>
		<showexcel @dataUpdate="dataUpdate"></showexcel>
		<!-- 点检修改 -->
		<!-- <domainEdit :isshow="addType" :deptList="deptList" @closedialog="closedialog" @dataUpdate="dataUpdate"></domainEdit> -->
	</div>
</template>

<script>
	import bus from "../../../../utils/bus"
	import choosedevice from './deviceChoose.vue'
	import showexcel from "./excel_.vue"
	import QrcodeVue from 'qrcode.vue'
	import JSZip from "jszip";
	import FileSaver from "file-saver";
	import vueQr from "vue-qr";
	import QrCode from "../../../../components/QRcode/index.vue"
	export default {
		name: 'domain',
		components: {
			choosedevice,
			showexcel,
			QrcodeVue,
			QrCode
		},
		data() {
			return {
				isSon: false,
				// 导出
				downloadLoading: false,
				multipleSelection: [],
				/**********************vxe-model*/
				submitLoading: false,
				selectRow: null,
				showEdit: false,
				formData: {
					name: '',
					dept: '',
					version: '',
					belongToLine: '',
					state: '',
					remarks: ''
				},
				formRules: {
					name: [{
						required: true,
						message: '请输入区域名称'
					}],
					dept: [{
						required: true,
						message: '请选择部门'
					}],
					version: [{
						required: true,
						message: '请输入版本号'
					}],
				},
				addJson: { //提交参数
					name: '',
					orgCode: '',
					orgName: '',
					pareacode: null
				},
				addType: false,
				areaCode: '',
				isdeptshow: false, //部门弹出
				isdeptshow1: false, //部门弹出
				defaultProps: {
					children: 'childOrgs',
					label: 'longName'
				},
				addOredit: true, //新增还是修改
				listitem: null,
				// 筛选
				user: {
					name: '',
					username: '',
					areaName: '',
					dept: '',
					belongToWay: '',
					state: ''
				},
				loading: false,
				tableHeight: document.body.clientHeight - 84 - 36 - 80 - 152, // 表格高度
				currentPage: 1,
				pageSize: 10,
				totalPages: 0,
				total: 1,
				showpage: true,
				deptList: [],
				updateTree: [],
				//展示参数表，并未实际应用
				tableData: [],
				chooseData: [],
				belongToWayData: [{
					value: '1',
					label: '路线1'
				}, {
					value: '2',
					label: '路线2'
				}],
				stateData: [{
					value: '',
					label: '全部'
				}, {
					value: '1',
					label: '启用'
				}, {
					value: '0',
					label: '禁用'
				}],
				jsonData: {
					name: '',
					orgCode: '',
					status: '',
					pageNo: 1,
					pageSize: 10
				},
			}
		},
		created() {
			//查询区域
			this.getData()
			this.getDeptData()
			// new Promise((resove,reject) => {
			// 	setTimeout((e)=>{
			// 		resove('Hello World')
			// 	},1000)
			// }).then(data =>{
			// 	console.log(data)
			// 	return Promise.resolve(data + '111')
			// }).then(data =>{
			// 	console.log(data)
			// 	return Promise.resolve(data + '222')
			// })
		},
		methods: {
			selectChangeEvent({
				records
			}) {
				console.log(records)
				this.chooseData = records
			},
			checkAllShow (records) {
				console.log(records.records)
				this.chooseData = records.records
			},
			//新增子区域
			addSonList(item) {
				console.log(item)
				this.formData = {
					name: '',
					dept: item.dept,
					version: '',
					belongToLine: '',
					state: '',
					remarks: ''
				}
				this.addJson = {
					name: '',
					orgCode: item.orgCode,
					orgName: item.dept,
					pareacode: item.data.areaCode
				}
				this.isSon = true
				this.selectRow = null
				this.showEdit = true
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
						let data = row.childrenData
						for (let i = 0; i < data.length; i++) {
							var obj = {}
							var j = i + 1
							// obj.id = data[i].id
							obj.cid = row.cid + '.' + j
							obj.id = data[i].id
							obj.ewm = JSON.stringify(obj.id);
							obj.areaName = row.data.name
							obj.areaNameSon = data[i].name
							obj.areaNameLong = obj.areaName + data[i].name

							obj.pareacode = row.data.areaCode
							obj.data = data[i]
							obj.isSon = true
							obj.dept = data[i].orgName
							obj.state = data[i].status == 0 ? '禁用' : '启用'
							// obj.cid = that.jsonData.pageNo * that.jsonData.pageSize - that.jsonData
							// 	.pageSize + i + 1

							// console.log(obj);
							child.push(obj)
						}
						resolve(child)
					}, 500)
				})
			},
			deviceList(row) {
				console.log(row)
				this.addType = true
				this.areaCode = row.data.areaCode
			},
			//父子组件传值，控制隐藏显示
			closedialog(val) {
				// console.log('区域管理')
				this.addType = val
				this.areaCode = ''
			},
			// 添加信息
			addRoute() {
				this.formData = {
					name: '',
					dept: '',
					version: '',
					belongToLine: '',
					state: '',
					remarks: ''
				}
				this.addJson = {
					name: '',
					orgCode: '',
					orgName: '',
					pareacode: null
				}
				this.isSon = false
				this.selectRow = null
				this.showEdit = true
			},
			updateList(item) {
				console.log(item)
				this.formData = {
					name: item.areaName,
					dept: item.dept,
					version: item.cid,
					belongToLine: '',
					state: '',
					remarks: ''
				}
				this.addJson = {
					name: item.areaName,
					orgCode: item.orgCode,
					orgName: item.dept
				}
				this.addJson['id'] = item.id
				this.selectRow = item
				this.showEdit = true
			},
			submitEvent() {
				this.submitLoading = true
				setTimeout(() => {
					this.submitLoading = false
					if (this.selectRow) {
						this.addJson.name = this.formData.name
						console.log(this.addJson)
						this.updateArea()
					} else {
						this.addJson.name = this.formData.name
						console.log(this.addJson)
						this.addArea()
					}
				}, 500)
			},
			addArea() {
				this.areaAdd(this.addJson).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: '新增区域成功',
							type: 'success'
						})
						this.showEdit = false
						this.getData()
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			updateArea() {
				this.areaUpdate(this.addJson).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: '更新区域成功',
							type: 'success'
						})
						this.showEdit = false
						this.getData()
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			closemodel() {
				// console.log('关闭对话框')
				this.checked = true
			},
			dataUpdate(val) {
				this.addOredit = !this.addOredit
				console.log('区域列表更新')
				this.getData()
			},
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
			switchStatus(item) {
				// console.log(item)
				let reason = ''
				if (item.state) {
					reason = '启用'
				} else {
					reason = '禁用'
				}
				this.$axios.get('/area/switchStatus?id=' + item.id).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: item.areaName + '已经' + reason,
							type: 'success'
						})

					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
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
						console.log(this.deptList);

					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			//查询区域
			getData() {
				this.areaData(this.jsonData).then(res => {
					if (res.data.code === 0) { //查询到数据
						//console.log(res)
						let data = res.data.data.records
						console.log('区域列表查询', data)
						this.numberPage = res.data.data.current
						//console.log('当前页数数据数量', this.numberPage)
						this.loading = true
						let that = this
						setTimeout(function() {
							if (data.length !== 0) { //如果请求数据不为空
								that.total = res.data.data.total //列表总数
								for (var i = 0; i < data.length; i++) {
									var obj = {}
									obj.cid = that.jsonData.pageNo * that.jsonData.pageSize - that.jsonData
										.pageSize + i + 1
									obj.areaName = ''
									obj.areaNameSon = data[i].name
									obj.areaNameLong = data[i].name
									obj.id = data[i].id
									obj.ewm = JSON.stringify(data[i].id) //id -》二维码
									obj.code = data[i].code
									obj.data = data[i]
									obj.hasChild = data[i].childArea != null ? true : false
									obj.isSon = false
									if (data[i].childArea != null) {
										obj.childrenData = []
										for (let j = 0; j < data[i].childArea.length; j++) {
											var k = j + 1
											obj.childrenData.push({
												cid: obj.cid + '.' + k,
												id: data[i].childArea[j].id,
												ewm: JSON.stringify(data[i].childArea[j].id),
												areaName: data[i].name,
												areaNameSon: data[i].childArea[j].name,
												areaNameLong: data[i].name + '___' + data[i]
													.childArea[j]
													.name,
												pareacode: data[i].areaCode,
												data: data[i].childArea[j],
												isSon: true,
												dept: data[i].childArea[j].orgName,
												state: data[i].childArea[j].status == 0 ? '禁用' :
													'启用'
											})
										}
									} else {
										obj.childrenData = data[i].childArea
									}

									// obj.childrenData = data[i].childArea;
									// if(obj.hasChild){
									// 	for(var j=0; j<data[i].childArea.length;j++){
									// 			data[i].childArea[j].ewm = JSON.stringify(data[i].childArea[j].id);
									// 	}
									// 	obj.childrenData = data[i].childArea;
									// 	console.log("=====childrenData:"+obj.childrenData);
									// }

									obj.orgCode = data[i].orgCode
									obj.dept = data[i].orgName
									obj.version = data[i].cid
									obj.edition = data[i].version
									obj.state = data[i].status == 0 ? '禁用' : '启用'
									obj.isUse = data[i].status == 0 ? '启用' : '禁用' //只为了切换用，其实反的
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
			//上传文件时处理方法
			handleChange(file, fileList) {
				this.fileTemp = file.raw;
				if (this.fileTemp) {
					if ((this.fileTemp.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
						(this.fileTemp.type == 'application/vnd.ms-excel')) {
						this.importfxx(this.fileTemp);
					} else {
						this.$message({
							type: 'warning',
							message: '附件格式错误，请删除后重新上传！'
						})
					}
				} else {
					this.$message({
						type: 'warning',
						message: '请上传附件！'
					})
				}
			},
			//超出最大上传文件数量时的处理方法
			handleExceed() {
				this.$message({
					type: 'warning',
					message: '超出最大上传文件数量的限制！'
				})
				return;
			},
			//移除文件的操作方法
			handleRemove(file, fileList) {
				this.fileTemp = null
			},
			importfxx(obj) {
				let _this = this;
				let inputDOM = this.$refs.inputer;
				// 通过DOM取文件数据

				this.file = event.currentTarget.files[0];

				var rABS = false; //是否将文件读取为二进制字符串
				var f = this.file;
				var reader = new FileReader();
				//if (!FileReader.prototype.readAsBinaryString) {
				FileReader.prototype.readAsBinaryString = function(f) {
					var binary = "";
					var rABS = false; //是否将文件读取为二进制字符串
					var pt = this;
					var wb; //读取完成的数据
					var outdata;
					var reader = new FileReader();
					reader.onload = function(e) {
						var bytes = new Uint8Array(reader.result);
						var length = bytes.byteLength;
						for (var i = 0; i < length; i++) {
							binary += String.fromCharCode(bytes[i]);
						}
						//如果没有在main.js中引入，则此处需要引入，用于解析excel
						var XLSX = require("xlsx");
						if (rABS) {
							wb = XLSX.read(btoa(fixdata(binary)), {
								//手动转化
								type: "base64"
							});
						} else {
							wb = XLSX.read(binary, {
								type: "binary"
							});
						}
						outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
						//outdata就是读取的数据（不包含标题行即表头，表头会作为对象的下标）
						//此处可对数据进行处理
						let arr = []
						let getId = 1
						outdata.map(v => {
							let obj = {}
							obj.id = getId++
							obj.iconType = 0
							obj.reason = ''
							obj.set = ''
							obj.areaName = v['点检区域名称']
							obj.deptName = v['车间名称']
							obj.orgCode = v['车间编码']
							obj.pAreaCode = v['上级点检区域名称（如果没有就不填）']
							// obj.version = v['版本号(必填)']
							// obj.deviceTypeName = v['设备类型（必填）']
							// obj.deviceType = _this.devicetypechange(v['设备类型（必填）'])
							// obj.deviceName = v['设备名称（必填）']
							// obj.deviceCode = v['设备编号（必填）']
							// obj.deviceBrandTypeName = v['设备品牌（必填）']
							// obj.deviceBrandType = _this.devicebrandtypechange(v['设备品牌（必填）'])
							// obj.disName = v['专业']!=undefined?v['专业'].replace(/，/g,",").split(","):[]
							// obj.dis = v['专业']!=undefined?_this.dischange(v['专业'].replace(/，/g,",").split(",")):[]
							// obj.remark = v['备注']
							arr.push(obj)
						});
						_this.filedata = arr
						//console.log(arr)
						bus.$emit('deviceexcel_show', {
							tabledata: arr,
							disdata: _this.disdata
						})
						//_this.deviceAddSure(0) //将递归导入数据
						_this.da = arr;
						_this.dalen = arr.length;
						//_this.tableData = arr
						return arr;
					};
					reader.readAsArrayBuffer(f);
				};
				if (rABS) {
					reader.readAsArrayBuffer(f);
				} else {
					reader.readAsBinaryString(f);
				}
			},
			//区域名称
			user_areaName_show(event) {
				this.jsonData.name = event
			},
			//部门选择
			dept_change() {
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
			selectionchange(data) {
				console.log(data)
				this.chooseData = data
			},
			getRowKeys(row) {
				return row.cid; // cid为列表数据的唯一标识
			},
			deleteRoute() {
				this.$confirm('是否删除当前选中设备?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// console.log(6666)
					this.deleteAll(0)
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
			},
			ewmOut() {
				// console.log(this.chooseData)
				// if (this.user.dept != '' && this.jsonData.orgCode != '') {
				// 	this.downloadLoading = true;
				// 	let val = []
				// 	val = this.chooseData
				// 	val.forEach((e, i) => {
				// 		val[i].qid = `${e.areaNameLong}`; //二维码图片名称标识
				// 		val[i].url = `${e.id}`; //二维码文本内容 https://www.baidu.com/s?wd=${e.id}
				// 	});
				// 	this.multipleSelection = val;
				// } else {
				// 	this.$message({
				// 		message: '请选择部门再进行打包下载，谢谢!',
				// 		type: 'warning'
				// 	})
				// }
				this.downloadLoading = true;
				let val = []
				val = this.chooseData
				val.forEach((e, i) => {
					val[i].qid = `${e.areaNameLong}`; //二维码图片名称标识
					val[i].url = `${e.id}`; //二维码文本内容 https://www.baidu.com/s?wd=${e.id}
				});
				this.multipleSelection = val;
			},
			closeDownload() {
				this.downloadLoading = false;
			},
			deleteAll(i) {
				if (i < this.chooseData.length) {
					this.areaDelete(this.chooseData[i].data.areaCode).then(res => {
						if (res.data.code === 0) {
							this.$message({
								title: res.data.message,
								message: '删除成功',
								type: 'success',
								duration: 800
							});
							setTimeout((e) => {
								this.deleteAll(i + 1)
							}, 200)

						} else {
							this.$message({
								message: res.data.message,
								type: 'warning'
							})
							setTimeout((e) => {
								this.deleteAll(i + 1)
							}, 200)
						}
					})
				} else {
					// this.$refs.multipleTable.clearSelection();
					this.jsonData.pageNo = 1
					this.jsonData.pageSize = 10
					this.getData()
				}
			},

			lookList() {},
			overhaulProject() {},
			onSubmit(item) {
				// console.log(123)
				if (this.user.dept == '') {
					this.jsonData.orgCode = ''
				}
				this.jsonData.pageNo = 1
				this.jsonData.pageSize = 10
				this.getData()
			}, //重置搜索条件
			onreset(formName) {
				// this.$refs[formName].resetFields();
				this.jsonData = {
					name: '',
					orgCode: '',
					status: '',
					pageNo: 1,
					pageSize: 10
				}
				this.user = {
					name: '',
					username: '',
					areaName: '',
					dept: '',
					belongToWay: '',
					state: ''
				}
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
	.domain {
		padding: 10px;
	}

	/* .domain>>>.el-table tbody tr:hover>td { 
	    background-color:red!important
	} */
</style>
