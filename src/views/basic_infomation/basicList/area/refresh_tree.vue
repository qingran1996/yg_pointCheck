<template>
	<div class="refresh_tree">
		<vxe-modal v-model="isshow" title="第三方部门列表&选择部门同步" width="80%" min-width="600" 
			:loading="submitLoading" resize destroy-on-close @close="closemodel">
			<template #default>
				<div class="refreshTree_show" :style="{height: treeheight,overflowY: 'scroll'}">
					<el-tree
					  :data="treedata"
					  ref="tree"
					  highlight-current
					  show-checkbox
					  node-key="id"
					  :default-expanded-keys="showexpend"
					  @check="showcheck"
					  :props="defaultProps">
					</el-tree>
				</div>
				<div style="width: 100%;text-align: center;margin: 5px 0;">
					<el-button @click="submit" style="text-align: right;" type="primary" :disabled="checkData.length==0">确 定</el-button>
					<el-button @click="onset" style="text-align: right;" type="warning" :disabled="checkData.length==0">重 置</el-button>
				</div>
			</template>
		</vxe-modal>
	</div>
</template>

<script>
	export default {
		name: 'refresh_tree',
		props: {
			//是否展示
			isshow: {
				type: Boolean,
				// 当为对象类型设置默认值时必须使用函数返回
				default: false
			}
		},
		components: {},
		computed: {},
		watch: {
			isshow(oldval, newval) {
				// console.log(newval)
				if (newval === false) {
					this.getTree()
					// console.log(this.showPlanId)
				}
			}
		},
		data() {
			return {
				submitLoading: false,
				checkData: [],
				showexpend: [],
				treedata: [],
				jsonData: {},
				treeheight: document.body.clientHeight * 0.5 + 'px',
				defaultProps: {
					children: 'children',
					label: 'name'
				}
			}
		},
		created() {
			
		},
		mounted() {
			
		},
		methods: {
			submit () {
				// console.log(this.checkData)
				let json = {
					pkIds: this.checkData
				}
				this.thirdorgTbPart(json).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: '部门同步完成',
							type: 'success'
						})
						this.onset() //重置
						this.closemodel()
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			onset () {
				this.$refs.tree.setCheckedNodes([])
				this.checkData = []
			},
			//选中的第三方部门树
			showcheck (checkedNodes, checkedKeys, halfCheckedNodes,halfCheckedKeys) {
				// console.log(checkedKeys.checkedNodes)
				this.checkData = []
				for (let i=0;i<checkedKeys.checkedNodes.length;i++) {
					this.checkData.push(checkedKeys.checkedNodes[i].pkId)
				}
				// this.checkData = checkedKeys.checkedKeys
				// if (checked == true) {
				// 	console.log(this.$refs.tree.getCheckedNodes())
				// 	console.log(this.$refs.tree.getCheckedKeys())
				// 	this.checkData = this.$refs.tree.getCheckedKeys()
				// }
			},
			// 获取的第三方部门树
			getTree () {
				this.showexpend = []
				this.treedata = []
				this.thirddeptData(this.jsonData).then(res => {
					if (res.data.code === 0) {
						console.log("第三方组织部门树", res.data.data)
						const data = res.data.data
						// this.data = this.dataDG(res.data.data)
						this.treedata = res.data.data
						this.showexpend[0] = res.data.data[0].id
				
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
				this.$emit('closedialog', false)
			}
		}
	}
</script>
<style scoped>
	

	
</style>
