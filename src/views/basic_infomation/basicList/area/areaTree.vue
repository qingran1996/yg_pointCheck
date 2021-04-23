<template>
	<div class="areaTree">
		<div style="display: flex;">
			<el-input class="searchInput" v-model="filterText" placeholder="请输入组织名称">
				<i slot="suffix" class="el-input__icon el-icon-search" />
			</el-input>
			<div style="width: 50px;height: 36px;line-height: 36px;text-align: center;background-color: rgba(48, 65, 82, 0.8) !important;font-size: 25px;">
				<el-tooltip class="item" effect="dark" content="部门同步" placement="right">
					<i class="el-icon-refresh tbshow" style="color: white;cursor: pointer;" @click="refreshShow"></i>
				</el-tooltip>
			</div>
			<!-- <refreshTree :isshow="lookType"></refreshTree> -->
		</div>

		<el-tree ref="tree" v-loading="loading" :data="data" element-loading-text="拼命加载中"
			element-loading-spinner="el-icon-loading" element-loading-background="rgba(48, 65, 82, 1)" node-key="id"
			accordion :style="{height: treeheight,overflowY: 'scroll'}" highlight-current
			:filter-node-method="filterNode" :props="defaultProps" :default-expanded-keys="updateTree"
			:expand-on-click-node="false" @node-contextmenu='rightClick' @node-click="handleNodeClick">
			<span slot-scope="{ node }" class="custom-tree-node">
				<el-tooltip class="item" effect="dark" :content="node.label" placement="right">
					<span>{{ node.label }}</span>
				</el-tooltip>
				<!-- <i v-if="node.id==1" class="el-icon-refresh" style="color: white;"></i> -->
			</span>
		</el-tree>
		<el-dialog :title="addOredit?'部门新增':'部门更新'" v-dialogDrag :visible.sync="deptAddType" width="30%" center
			:close-on-click-modal="false" @close="showclose">
			<el-form ref="infoData" :model="infoData" label-width="130px" class="demo-ruleForm" :rules="ruleform">
				<el-form-item label="名称" prop="name">
					<el-input v-model="infoData.name" clearable />
				</el-form-item>
				<el-form-item label="编码" prop="code">
					<el-input v-model="infoData.code" clearable />
				</el-form-item>
				<!-- <el-form-item label="财务组织编码" prop="orgAdminNumber">
					<el-input v-model="infoData.orgAdminNumber" clearable />
				</el-form-item> -->
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="deptAddType = false">取 消</el-button>
				<el-button type="primary" @click="deptsure('infoData')">确 定</el-button>
			</span>
		</el-dialog>
		<refreshTree :isshow="lookType" @closedialog="closedialog"></refreshTree>
		<!-- <div class="menuRight" ref="menu" v-show="menu">
			<el-card class="box-card">
			  <div v-for="o in 4" :key="o" class="text item">
			    {{'列表内容 ' + o }}
			  </div>
			</el-card>
		</div> -->
	</div>
</template>

<script>
	import refreshTree from './refresh_tree.vue'
	export default {
		name: 'AreaTree',
		components: {refreshTree},
		data() {
			return {
				menu: false,
				lookType: false, //第三方树的展示
				deptAddType: false,
				addOredit: true, //新增还是更新
				filterText: '', // 查询区域名称
				showtext: '2333',
				treeheight: document.body.clientHeight - 84 - 36 + 'px',
				data: [],
				jsonData: {
					orgCode: ''
				},
				infoData: {
					name: '',
					code: '',
					orgAdminNumber: '',
					id: '',
					pid: ''
				},
				// 表单的判断规则
				ruleform: {
					name: [{
						required: true,
						message: '请输入名称',
						trigger: ['change', 'blur']
					}],
					code: [{
						required: true,
						message: '请输入编码',
						trigger: ['change', 'blur']
					}],
					orgAdminNumber: [{
						required: true,
						message: '请输入财务组织编码',
						trigger: ['change', 'blur']
					}],
				},
				updateTree: [],
				loading: false,
				defaultProps: {
					children: 'childOrgs',
					label: 'name'
				},
				father: "",
				fatherid: 0,
				pid: 0,
				son: ""
			}
		},
		watch: {
			filterText(val) {
				// console.log(val)
				if (val !== '') {
					this.$refs.tree.filter(val)
				} else {
					this.getdata()
				}
			}
		},
		activated() {
			this.updateTree = []
			this.data = []
		},
		created() {
			this.getdata()
			//将菜单外部点击后，隐藏菜单
			// document.addEventListener("click", e => {
			// 	if (!this.$refs.menu) {
			// 		this.menu = !this.menu
			// 	} else {
			// 		this.menu = false //让菜单隐藏
			// 	}
			// })
		},
		methods: {
			refreshShow () {
				this.lookType = true
			},
			//父子组件传值，控制隐藏显示
			closedialog(val) {
				// console.log('区域管理')
				this.lookType  = val
				this.getdata()
			},
			//关闭对话框,并清空选择状态
			showclose() {
				this.$refs['infoData'].resetFields();
			},
			getdata() {
				this.updateTree = []
				this.data = []
				this.deptData(this.jsonData).then(res => {
					if (res.data.code === 0) {
						console.log("组织部门树", res.data.data)
						//将设备位置 从左树传给右侧 主界面
						// this.$bus.emit('devicePlace', res.data.data)
						const data = res.data.data
						// this.data = this.dataDG(res.data.data)
						this.loading = true
						setTimeout(()=>{
							this.loading = false
							this.data.push(res.data.data)
							this.updateTree[0] = res.data.data.id
							this.updateTree.push(this.pid)
						},800)
						this.$bus.emit('firstDept', res.data.data)

					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			sure() {
				let json = {
					name: this.infoData.name,
					orgCode: this.infoData.code,
					// orgAdminNumber: this.infoData.orgAdminNumber,
					orderNo: 0, //排序
					orgType: 1, //类型
					pid: this.infoData.pid
				}
				this.deptAdd(json).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: res.data.message,
							type: 'success'
						})
						this.deptAddType = false
						this.showclose()
						// setTimeout((e) => {
						// 	this.updateTree.push(this.pid)
						// 	// console.log(this.updateTree)
						// }, 100)
						this.getdata()
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			nosure() {
				let json = {
					id: this.infoData.id,
					name: this.infoData.name,
					orgCode: this.infoData.code,
					// orgAdminNumber: this.infoData.orgAdminNumber,
					orderNo: 0, //排序
					orgType: 1, //类型
					pid: this.infoData.pid
				}
				this.deptUpdate(json).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: res.data.message,
							type: 'success'
						})
						this.deptAddType = false
						// setTimeout((e) => {
						// 	this.updateTree.push(this.pid)
						// 	// console.log(this.updateTree)
						// }, 500)
						this.getdata()
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			deleteDept() {
				this.deptDelete(this.infoData.code).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: res.data.message,
							type: 'success'
						})
						// this.deptAddType = false
						// setTimeout((e) => {
						// 	this.updateTree.push(this.pid)
						// 	// console.log(this.updateTree)
						// }, 200)
						this.getdata()
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			//部门新增确认
			deptsure(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (this.addOredit) {
							this.sure()
						} else {
							this.nosure()
						}
					} else {
						this.$message({
							message: '请完善内容',
							type: 'warning'
						})
						return false;
					}
				});

			},
			//右键出现菜单
			rightClick(event, value) {
				this.$contextmenu({
					items: [{
						label: "新增",
						icon: "el-icon-circle-plus-outline",
						onClick: () => {
							console.log("新增", value);
							this.addOredit = true
							this.pid = value.id
							this.infoData.pid = value.id
							this.deptAddType = true
						}
					}, {
						label: "修改",
						icon: "el-icon-setting",
						onClick: () => {
							console.log("修改", value);
							this.pid = value.id
							this.addOredit = false
							this.infoData.id = value.id
							this.infoData.pid = value.pid
							this.infoData.name = value.name
							this.infoData.code = value.orgCode
							this.infoData.orgAdminNumber = value.orgAdminNumber
							this.deptAddType = true
						}
					}, {
						label: "删除",
						icon: "el-icon-delete",
						onClick: () => {
							console.log("删除");
							// console.log(value)
							this.pid = value.pid
							this.infoData.code = value.orgCode
							this.$confirm('是否删除当前部门?', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {
								this.deleteDept()
							}).catch(() => {
								this.$message({
									type: 'info',
									message: '已取消删除'
								})
							})
						}
					}],
					event,
					//x: event.clientX,
					//y: event.clientY,
					customClass: "custom-class",
					zIndex: 3,
					minWidth: 100
				})
				//console.log(value)
				//console.log(this.$refs.tooltip.$refs.popper)
				// if (event.clientY <= document.body.clientHeight * 0.75) {
				// 	this.$refs.menu.style.left = event.clientX - 160 + "px"
				// 	this.$refs.menu.style.top = event.clientY - 56 + "px"
				// } else {
				// 	this.$refs.menu.style.left = event.clientX - 160 + "px"
				// 	this.$refs.menu.style.top = event.clientY - 286 + "px"
				// }

				// this.menu = true //让菜单显示
				// document.removeEventListener("click", this.Listen); //添加监听，监听鼠标事件
			},
			//tree组件树分支变动操作
			handleDrop(draggingNode, dropNode, type, event) {
				if (draggingNode.data.aboveId === dropNode.data.aboveId) {
					let obj = {
						aboveId: '',
						arr: []
					}
					obj.aboveId = dropNode.data.aboveId
					for (let item of dropNode.parent.childNodes) {
						obj.arr.push(item.data.id)
					}
					// this.treeupdata()
				} else {
					let obj = {
						aboveId: '',
						id: '',
						newAboveId: ''
					}
					obj.aboveId = draggingNode.data.aboveId
					obj.id = draggingNode.data.id
					obj.newAboveId = dropNode.data.id
				}
			},
			treeupdata() {
				let addJson = {
					areaCode: this.son, //区域code
					parentAreaCode: this.father
				}
				// console.log(addJson)
				this.$axios.post('/d/area/update', addJson).then(res => {
					// let data = res.data.message
					if (res.data.code === 0) {
						// this.centerDialogVisible = false
						this.$notify({
							title: res.data.message,
							message: '区域更新成功',
							type: 'success'
						});
						this.getdata()
						// bus.$emit('tuozhuai', true) //设备列表更新
						//this.updateTree.push(this.father)
					} else {
						this.$notify.error({
							title: '更新失败',
							message: res.data.message
						});
					}
					//console.log(res.data)
				})
			},
			//开始拖拽
			handleDragStart(node, ev) {
				this.son = node.data.code
			},
			handleNodeClick(data) {
				// console.log('点击获取', data)
				this.$bus.emit('personList', data)
				//// 选定后新增可以显示这个位置数据
				// let selectedPlace = {
				// 	label: data.label,
				// 	id: data.id
				// }
			},
			//拖拽结束
			handleDragEnd(draggingNode, dropNode, dropType, ev) {
				console.log(dropNode.data)
				
				// this.father = dropNode.data.code
				// this.fatherid = dropNode.data.id
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
			}
		},
		beforeDestroy() {
			this.$bus.off('clickCheck')
		}
	}
</script>
<style scoped>
	.searchInput>>>.el-input__inner {
		border: none;
		border-radius: 0;
		color: #ffffff;
		border-bottom: 1px #ffffff solid;
		background-color: rgba(48, 65, 82, 0.8) !important;
	}

	.menuRight {
		position: absolute;
		border-radius: 15px;
		z-index: 2000;

	}

	.el-tree {
		background-color: rgba(48, 65, 82, 0.8);
		color: #FFFFFF;
	}

	.custom-tree-node {
		width: 100%;
		font-size: 14px;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.areaTree>>>.tbshow:hover {
		color: orange !important;
	}
	.el-tree>>>.el-tree-node__expand-icon.is-leaf {
		color: transparent;
		cursor: default;
	}

	.el-tree>>>.el-tree-node__expand-icon {
		color: #FFFFFF
	}

	.el-tree::-webkit-scrollbar {
		width: 0;
	}

	.el-tree>>>.el-tree-node__content {
		background-color: rgba(48, 65, 82, 0.4) !important;
	}

	.el-tree>>>.el-tree-node__content:hover {
		/* border-radius: 5px; */
		background-color: rgba(48, 65, 82, 0.2) !important;
	}

	.el-tree>>>.el-tree-node.is-current>.el-tree-node__content {
		background-color: rgba(48, 65, 82, 0.4) !important;
		/* border-radius: 5px; */
		color: lightseagreen;
	}
	
	.el-tree>>>.el-tree-node__content:visited {
		/* background-color: rgb(0, 15, 70) !important; */
	}
</style>
