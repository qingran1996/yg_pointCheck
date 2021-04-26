<template>
	<div v-show="isshow" class="personAdd">
		<el-dialog title="设备关联" v-dialogDrag :visible.sync="pointWayAdd_show" width="80%" :close-on-click-modal="false"
			@close="showclose" center>
			<!-- <el-popover placement="right" width="400" trigger="click" v-model="isdeptshow">
				<div style="height: 200px;overflow-y: scroll;">
					<el-tree :data="$parent.deptList" accordion show-checkbox check-strictly
						:expand-on-click-node="false" ref="treeForm" node-key="id"
						@check-change="handleNodeClick1" :props="defaultProps">
						<span slot-scope="{ node }" class="custom-tree-node">
							<el-tooltip class="item" effect="dark" :content="node.label" placement="right">
								<span>{{ node.label }}</span>
							</el-tooltip>
						</span>
					</el-tree>
				</div>
				<el-input v-model="farm" style="width: 200px;margin-bottom: 10px;" placeholder="请点击选择车间"
					slot="reference" clearable />
			</el-popover>
			<el-table :data="tableData" border="" style="width: 100%" :max-height="treeheight1">
				<el-table-column prop="index" width="100" label="序号" align="center"></el-table-column>
				<el-table-column prop="name" label="名称" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="specs" label="规格" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="startTime" label="投运日期" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="departmentName" label="所属部门" show-overflow-tooltip>
				</el-table-column>
			</el-table> -->
			
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input class="searchInput" v-model="filterText" placeholder="请输入区域名称">
						<i slot="suffix" class="el-input__icon el-icon-search" />
					</el-input>
					<el-tree ref="tree" v-loading="loading" :data="data" element-loading-text="拼命加载中"
						element-loading-spinner="el-icon-loading" node-key="id" accordion show-checkbox
						:style="{height: treeheight,overflowY: 'scroll'}" highlight-current :check-strictly="true"
						:filter-node-method="filterNode" :props="defaultProps" :default-expanded-keys="updateTree"
						:expand-on-click-node="false" @check="handleNodeClick">
						<span slot-scope="{ node, data }" class="custom-tree-node">
							<el-tooltip class="item" effect="dark" :content="node.label" placement="right">
								<!-- <span v-if="data.spotareas!=undefined">{{ node.label }} 123</span> -->
								<span>{{ node.label }}</span>
								<!-- <span v-show="data.isOpen===true"><i class="el-icon-refresh"></i></span> -->
							</el-tooltip>
						</span>
					</el-tree>
				</el-col>
				<el-col :span="16">
					<el-table :data="tableData" border="" style="width: 100%" :max-height="treeheight1">
						<el-table-column prop="index" width="100" label="序号" align="center"></el-table-column>
						<el-table-column prop="name" label="名称" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="specs" label="规格" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="startTime" label="投运日期" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="departmentName" label="所属部门" show-overflow-tooltip>
						</el-table-column>
					</el-table>
				</el-col>
			</el-row>
			<span slot="footer" class="dialog-footer">
				<el-button @click="pointWayAdd_show = false">取 消</el-button>
				<el-button v-prevent-re-click type="primary" @click="submitForm()">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'personAdd',
		components: {},
		props: {
			//是否展示
			isshow: {
				type: Boolean,
				// 当为对象类型设置默认值时必须使用函数返回
				default: false
			},
			areaCode: {
				type: String,
				// 当为对象类型设置默认值时必须使用函数返回
				default: ''
			},
		},
		data() {
			return {
				/********************************/
				checkAll: false,
				checkedCities: ['上海', '北京'],
				cities: ['上海', '北京', '广州', '深圳','苏州'],
				isIndeterminate: true,
				pointWayAdd_show: false, // 控制显示dialog
				isdeptshow: false, // 部门弹出
				tableData: [],
				infoData: {
					name: '',
					dept: '',
					version: '',
					belongToLine: '',
					state: '',
					remarks: ''
				},
				farm: '',
				/*********tree**********/
				filterText: '', // 查询区域名称
				treeheight: document.body.clientHeight * 0.5 + 'px',
				treeheight1: document.body.clientHeight * 0.5,
				data: [],
				aboutData: [],
				updateTree: [],
				loading: false,
				defaultProps: {
					children: 'childOrgs',
					label: 'name'
				},
				jsonData: {}
			}
		},
		watch: {
			isshow(val) {
				// console.log(val)
				if (val === true) {
					this.pointWayAdd_show = true
					// console.log(this.areaCode)
					this.getdata()
				}
			},
			filterText(val) {
				console.log(val)
				if (val !== '') {
					this.$refs.tree.filter(val)
				} else {
					this.getdata()
				}
			}
		},
		mounted() {

		},
		created() {

		},
		methods: {
			handleCheckAllChange(val) {
				this.checkedCities = val ? this.cities : [];
				this.isIndeterminate = false;
			},
			handleCheckedCitiesChange(value) {
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.cities.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
			},
			handleNodeClick1(data) {
				console.log(data)
				this.farm = data.name
				let json = {
					orgCode: data.orgCode,
					equipName: '',
					pageNo: 1,
					pageSize: 9999
				}
				// this.deviceData = []
				this.equipByOrg(json).then(res => {
					if (res.data.code == 0) { //查询到数据
						console.log('查找到的设备', res.data.data.record)
						// let data = res.data.data.record
						// for (var i = 0; i < data.length; i++) {
						// 	this.deviceData.push({
						// 		value: data[i].id,
						// 		label: data[i].name,
						// 		orgName: data[i].orgName
						// 	})
						// }
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			deleteList(item) {
				console.log(item)

			},
			getdata() {
				this.updateTree = []
				this.data = []
				this.spotAreaEquips().then(res => {
					if (res.data.code === 0) {
						// console.log("获取厂区分厂点检区域树", res.data.data)
						//将设备位置 从左树传给右侧 主界面
						// this.$bus.emit('devicePlace', res.data.data)
						const arr = []
						arr.push(res.data.data)
						/*****************递归树形结构*****************/
						copyTransFun(arr)

						function copyTransFun(arr) {
							arr.forEach((item) => {
								// if (item.spotareas != undefined) {
								// 	item.children = item.spotareas;
								// 	item['disabled'] = true
								// 	item.children.forEach((item) => {
								// 		item['disabled'] = true
								// 		item['isOpen'] = true
								// 		item['children'] = [{
								// 			id: 9999,
								// 			name: '暂无记录',
								// 			disabled: true
								// 		}]
								// 	})
								// }
								if (item.equips != undefined) {
									item.childOrgs = item.equips
									item['disabled'] = false
									delete item.equips
								}
								// if (item.childOrgs==undefined&&item.equips==undefined) {
								// 	item['disabled'] = true
								// }
								if (item.childOrgs != undefined) {
									// item.children = item.childOrgs;
									item['disabled'] = true
									// delete item.childOrgs;
									if (item.childOrgs.length) {
										copyTransFun(item.childOrgs);
									}
								} else {
									// item['disabled'] = true
									// item['disabled'] = true
									// item['isOpen'] = true
									// item['childOrgs'] = [{
									// 	id: 9999,
									// 	name: '暂无记录',
									// 	disabled: true
									// }]
								}
							});
						}
						// console.log(arr)
						// console.log(this.$parent.deptList)
						this.data = arr
						this.updateTree[0] = arr[0].id
						// this.data.push(res.data.data)
						// this.updateTree[0] = res.data.data.id

					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			// 搜索区域
			filterNode(value, data, node) {
				// 如果什么都没填就直接返回
				if (!value) return true
				// 如果传入的value和data中的label相同说明是匹配到了
				if (data.name.indexOf(value) !== -1) {
					return true
				}
				// 否则要去判断它是不是选中节点的子节点
				return this.checkBelongToChooseNode(value, data, node)
			},
			// 判断传入的节点是不是选中节点的子节点
			checkBelongToChooseNode(value, data, node) {
				const level = node.level
				// 如果传入的节点本身就是一级节点就不用校验了
				if (level === 1) {
					return false
				}
				// 先取当前节点的父节点
				let parentData = node.parent
				// 遍历当前节点的父节点
				let index = 0
				while (index < level - 1) {
					// 如果匹配到直接返回
					if (parentData.data.name.indexOf(value) !== -1) {
						return true
					}
					// 否则的话再往上一层做匹配
					parentData = parentData.parent
					index++
				}
				// 没匹配到返回false
				return false
			},
			handleNodeClick(item) {
				console.log(this.$refs.tree.getCheckedNodes())
				this.tableData = []
				this.aboutData = []
				let data = this.$refs.tree.getCheckedNodes()
				for (let i = 0; i < data.length; i++) {
					this.tableData.push({
						index: i + 1,
						name: data[i].name,
						specs: data[i].specification,
						startTime: data[i].commissioningDate,
						departmentName: data[i].orgName,
						data: data[i]
					})
					this.aboutData.push(data[i].equipCode)
				}
			},
			openchange(node, data) {
				console.log(node)
				node.loaded = true
				data.childOrgs = [{
					id: 9999,
					name: '暂无记录',
					disabled: true
				}]
				// node.expand();
			},
			nodeexpand(data) {
				if (data.isOpen == true) {
					console.log(data)
					let json = {
						orgCode: data.orgCode
					}
					data.childOrgs = []
					this.equipByOrg(json).then(res => {
						if (res.data.code === 0) {
							console.log("根据点检部门查询设备", res.data.data)
							if (res.data.code === 0) {
								data.children = []
								for (let i = 0; i < res.data.data.length; i++) {
									data.childOrgs.push(res.data.data[i])
								}
								data.isOpen = false
							} else {
								data.childOrgs = [{
									id: 9999,
									name: '暂无记录',
									disabled: true
								}]
							}
						} else {
							data.childOrgs = [{
								id: 9999,
								name: '暂无记录',
								disabled: true
							}]
							this.$message({
								message: res.data.message,
								type: 'warning'
							})
						}
					})
				}
			},
			submitForm() {
				let json = {
					equipCodes: this.aboutData,
					areaCode: this.areaCode
				}
				console.log(json)
				this.areaEquipRel(json).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: '设备关联成功',
							type: 'success'
						})
						// this.showclose()
						this.pointWayAdd_show = false
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			//关闭对话框,并清空选择状态
			showclose() {
				// console.log(123)
				this.farm = ''
				this.aboutData = []
				this.tableData = []
				this.$emit('closedialog', false)
			}
		}
	}
</script>
<style scoped>

</style>
