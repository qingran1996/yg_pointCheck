<template>
	<div class="excel_">
		<el-dialog title="Excel导入预览" :visible.sync="dialogVisible" center width="80%" :close-on-click-modal="false" @close="isclose">
			<div class="topshow">
				<el-alert v-show="isshow" :title="showtitle" center type="warning" show-icon>
				</el-alert>
			</div>
			<el-table :data="tableData" border style="width: 100%" :max-height="rightContainerHeight" ref="showtable">
				<el-table-column align="center" width="50" fixed>
					<template slot-scope="scope">
						<div class="custom-tree-node" style="text-align: left;" v-if="scope.row.iconType == 0">
							<span>{{ scope.row.id }}</span>
						</div>
						<div class="custom-tree-node" style="text-align: left;" v-else-if="scope.row.iconType == 1">
							<i class="el-icon-success" style="color: #00FF00;font-size: 20px;"></i>
						</div>
						<div class="custom-tree-node" style="text-align: left;" v-else>
							<i class="el-icon-error" style="color: red;font-size: 20px;"></i>
						</div>
						<!-- <i class="el-icon-success" style="color: #00FF00;"></i> -->
					</template>
				</el-table-column>
				<el-table-column prop="areaName" show-overflow-tooltip label="区域名称" max-width="180">
				</el-table-column>
				<el-table-column prop="deptName" show-overflow-tooltip label="部门名称" max-width="180">
				</el-table-column>
				<el-table-column prop="orgCode" show-overflow-tooltip label="部门编码" max-width="180">
				</el-table-column>
				<el-table-column prop="pAreaCode" show-overflow-tooltip label="上级点检区域" max-width="180">
				</el-table-column>
				<!-- <el-table-column prop="version" show-overflow-tooltip label="版本号" max-width="180">
				</el-table-column> -->
				<!-- <el-table-column prop="deviceBrandTypeName" label="设备品牌" max-width="200">
				</el-table-column>
				<el-table-column prop="disName" label="专业" min-width="100">
					<template slot-scope="scope">
						<div class="navshow" style="display: inline-block;" v-for="site in scope.row.disName">
							<span v-if="site!=''">
								<el-tag>{{ site }} </el-tag>
							</span>
							<span v-else></span>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" min-width="100">
				</el-table-column> -->
				<el-table-column prop="reason" show-overflow-tooltip label="导入结果" max-width="200" fixed="right">
					<template slot-scope="scope">
						<div class="custom-tree-node" style="text-align: left;" v-if="scope.row.iconType == 0">
							<span>{{ scope.row.reason }}</span>
						</div>
						<div class="custom-tree-node" style="text-align: left;" v-else-if="scope.row.iconType == 1">
							<span style="color: #00FF00;">{{ scope.row.reason }}</span>
						</div>
						<div class="custom-tree-node" style="text-align: left;" v-else-if="scope.row.iconType == 2">
							<span style="color: red;">{{ scope.row.reason }}</span>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button v-show="!isshow" type="primary" v-if="!ishow" @click="makesure">导 入</el-button>
				<el-button v-show="ishow" type="success" icon="el-icon-check" @click="sure">完 成</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import bus from "../../../../utils/bus";
	export default {
		name: "excel_",
		data() {
			return {
				tableData: [],
				isshow: false,
				ishow: false,
				setshow: false,
				isok: 0,
				isnook: 0,
				showtitle: '',
				isgoto: false,
				disdata: [],
				rightContainerHeight: document.body.clientHeight * 0.5,
				dialogVisible: false,
				innerVisible: false,
				nav: {
					authname: localStorage.getItem('username'),
					authcode: localStorage.getItem('usercode'),
					reason: '平台授权'
				},
				qs: '',
				alarmtime: '',
				alarmTimeStart: '',
				alarmTimeEnd: '',
				verticalParkCode: '',
				verticalParktype: '',
				options: [],
			};
		},
		components: {},
		methods: {
			isclose() {
				this.qs = ''
				this.alarmtime = ''
				this.ischange = true
				this.isgoto = false
				this.ishow = false
				this.setshow = false
				this.isok = 0
				this.isnook = 0
				this.verticalParktype = ''
				this.alarmTimeStart = ''
				this.alarmTimeEnd = ''
			},
			getDeviceType() {
				let json = {

				}
				this.$axios.post('/v/verticalGroup/queryParkNumber', json).then(res => {
					let data = res.data.data
					//console.log(data)
					this.options = []
					for (var i = 0; i < data.length; i++) {
						var obj = {}
						obj.value = data[i].parkNumber
						obj.label = data[i].areaName
						obj.children = []
						let childrenData = data[i].datas
						if (childrenData != null) {
							for (let j = 0; j < childrenData.length; j++) {
								let abc = {}
								abc.value = childrenData[j].code
								abc.label = childrenData[j].name
								obj.children.push(abc)
							}
							this.options.push(obj)
						}
					}
					//console.log(this.options)
				})
			},
			//是否导入
			makesure() {
				this.ishow = true
				this.isgoto = false
				console.log(this.$parent.deptList)
				this.deviceAddSure(0)
			},
			//完成
			sure() {
				this.dialogVisible = false
				this.$emit('dataUpdate', true)
				// bus.$emit('table_update', this.tableData[0].areaCode) //设备列表更新
			},
			deviceAddSure(i) {
				//console.log(this.filedata)
				if (i < this.tableData.length) {
					let addJson = {
						name: this.tableData[i].areaName,
						orgCode: this.tableData[i].orgCode,
						orgName: this.tableData[i].deptName,
						pareacode: this.tableData[i].pAreaCode
					}
					//console.log(addJson)
					this.areaAdd(addJson).then(res => {
						// let data = res.data.message
						if (res.data.code == 0) {
							this.$message({
								title: res.data.message,
								message: '区域新增成功',
								type: 'success',
								duration: 800
							});
							let that = this
							// that.tableData.push({
							// 	showid: i+1,
							// 	carnum: this.filedata[i].carnum,
							// 	carname: this.filedata[i].carname,
							// 	phone: this.filedata[i].phone,
							// 	cartype: this.filedata[i].cartypename
							// })
							setTimeout(function() {
								that.isok++
								that.tableData[i].iconType = 1
								that.tableData[i].reason = '导入成功'
								that.deviceAddSure(i + 1)
							}, 200)
							// bus.$emit('carIndexUpdate', true) //设备列表更新
						} else {
							this.$message.error({
								title: '新增失败',
								message: res.data.message,
								duration: 800
							});
							//this.ishow = false
							let that = this
							setTimeout(function() {
								that.isnook++
								that.tableData[i].iconType = 2
								that.tableData[i].reason = res.data.message
								that.deviceAddSure(i + 1)
							}, 200)
						}
						//console.log(res.data)
						let that = this
						setTimeout(function() { //滚动条即时变化
							that.$refs.showtable.bodyWrapper.scrollTop += 50
						}, 500)
					})
				} else {
					this.ishow = true
					this.setshow = true
					this.$message({
						dangerouslyUseHTMLString: true,
						showClose: true,
						message: '区域导入结束,共成功' + '<span style="color: blue;font-size: 16px;">' + this.isok + '</span>' + '个,' + '失败' +
							'<span style="color: red;font-size: 16px;">' + this.isnook + '</span>' + '个',
						type: 'success',
						duration: 30000
					});
					this.isok = 0
					this.isnook = 0
				}

			}
		},
		created() {
			// this.getDeviceType()
			bus.$on("deviceexcel_show", msgdata => {
				console.log(msgdata)
				let msg = msgdata.tabledata
				let data = []
				let text = ''
				//找出导入数据的信息缺失
				for (let i = 0; i < msg.length; i++) {
					if (msg[i].areaName == undefined || msg[i].deptName == undefined) {
						data.push(msg[i].id)
					}
				}
				for (let i = 0; i < data.length; i++) {
					if (i == data.length - 1) {
						text += data[i]
					} else {
						text += data[i] + ','
					}
				}
				if (data.length != 0) {
					this.isshow = true
					this.showtitle = '请核对导入数据，第' + text + '行缺失必填信息，请验证'
				} else {
					this.isshow = false
					this.showtitle = ''
				}
				//console.log(text)
				this.ishow = false
				this.tableData = msg
				this.dialogVisible = true
				let that = this
				setTimeout(function() {
					that.$refs.showtable.bodyWrapper.scrollTop = 0
				}, 100)
			});
		},

	};
</script>
<style scoped>
	.custom-tree-node {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.el-form>>>.el-form-item__label {
		color: rgba(0, 0, 0, 1);
		font-weight: bold;
		width: 150px !important;
		font-size: 16px;
	}

	.el-form>>>.el-form-item {
		display: flex;
	}

	.el-form>>>.el-form-item__content {
		margin-left: 20px !important;
	}
</style>
