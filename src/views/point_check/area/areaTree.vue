<template>
	<div class="areaTree">
		<el-input v-model="filterText" placeholder="请输入区域名称">
			<i slot="suffix" class="el-input__icon el-icon-search" />
		</el-input>
		<el-tree ref="tree" v-loading="loading" :data="data" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
		 element-loading-background="rgb(0, 15, 70)" node-key="id" accordion draggable @node-drag-start="handleDragStart"
		 @node-drop="handleDrop" @node-drag-end="handleDragEnd" :style="{height: treeheight,overflowY: 'scroll'}"
		 highlight-current :filter-node-method="filterNode" :props="defaultProps" :default-expanded-keys="updateTree"
		 :expand-on-click-node="false" @node-contextmenu='rightClick' @node-click="handleNodeClick">
			<span slot-scope="{ node }" class="custom-tree-node">
				<el-tooltip class="item" effect="dark" :content="node.label" placement="right">
					<span>{{ node.label }}</span>
				</el-tooltip>
			</span>
		</el-tree>
<!--		<div class="menuRight" ref="menu" v-show="menu">-->
<!--			<el-card class="box-card">-->
<!--			  <div v-for="o in 4" :key="o" class="text item">-->
<!--			    {{'列表内容 ' + o }}-->
<!--			  </div>-->
<!--			</el-card>-->
<!--		</div>-->
	</div>
</template>

<script>
	export default {
		name: 'AreaTree',
		components: {},
		data() {
			return {
				menu: false,
				filterText: '', // 查询区域名称
				showtext: '2333',
				treeheight: document.body.clientHeight - 84 - 36 + 'px',
				data: [],
				jsonData: {
					areaCode: 0
				},
				updateTree: [],
				loading: false,
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				father: "",
				fatherid: 0,
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
			// this.getdata()
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
			getdata() {
				this.updateTree = []
				this.data = []
				this.getDeviceQueryTree(this.jsonData).then(res => {
					if (res.data.code === 0) {
						//console.log("左侧树信息",res.data.data)
						//将设备位置 从左树传给右侧 主界面
						this.$bus.emit('devicePlace', res.data.data)
						const data = res.data.data
						this.updateTree.push(data.id)
						this.data.push(res.data.data)
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			//右键出现菜单
			rightClick(event, value) {
				//console.log(value)
				//console.log(this.$refs.tooltip.$refs.popper)
				// if (event.clientY <= document.body.clientHeight * 0.75) {
				// 	this.$refs.menu.style.left = event.clientX - 160 + "px"
				// 	this.$refs.menu.style.top = event.clientY - 56 + "px"
				// } else {
				// 	this.$refs.menu.style.left = event.clientX - 160 + "px"
				// 	this.$refs.menu.style.top = event.clientY - 286 + "px"
				// }
        //
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
					this.treeupdata()
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
				console.log('点击获取', data)
        this.$bus.emit('clickCheck',data)
				//// 选定后新增可以显示这个位置数据
				// let selectedPlace = {
				// 	label: data.label,
				// 	id: data.id
				// }
			},
			//拖拽结束
			handleDragEnd(draggingNode, dropNode, dropType, ev) {
				this.father = dropNode.data.code
				this.fatherid = dropNode.data.id
			},
			// 搜索区域
			filterNode(value, data, node) {
				// 如果什么都没填就直接返回
				if (!value) return true
				// 如果传入的value和data中的label相同说明是匹配到了
				if (data.label.indexOf(value) !== -1) {
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
					if (parentData.data.label.indexOf(value) !== -1) {
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
	.el-input>>>.el-input__inner {
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
