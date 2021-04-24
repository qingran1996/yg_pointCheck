<template>
	<div class="editRisk">
		<vxe-modal v-model="riskShow" title="添加风险因素" width="70%" min-width="600" height="70%" :loading="submitLoading"
			resize destroy-on-close @close="closemodel">
			<template #default>
				<el-row :gutter="20">
					<el-col :span="8">
						<el-tree :data="riskData" ref="tree" show-checkbox node-key="id" @check="handleNodeClick" :props="defaultProps">
							<span slot-scope="{ node,data }" class="custom-tree-node">
								<el-tooltip class="item" effect="dark" :content="data.measure" placement="right">
									<span>{{ node.label }}</span>
								</el-tooltip>
							</span>
						</el-tree>
					</el-col>
					<el-col :span="16">
						<div style="width: 100%;text-align: center;margin-bottom: 10px;">
							<el-tag type="info">已选</el-tag>
						</div>
						<vxe-table border resizable show-overflow :data="tableData"
							:edit-config="{trigger: 'click', mode: 'cell'}">
							<vxe-table-column type="seq" width="60"></vxe-table-column>
							<vxe-table-column field="riskName" title="风险因素名称"></vxe-table-column>
							<vxe-table-column field="measure" title="安全措施(可编辑)" :edit-render="{name: 'textarea'}"></vxe-table-column>
						</vxe-table>
						<div style="width: 100%;text-align: center;margin: 10px 0;">
							<el-button v-prevent-re-click type="primary" @click="sure" plain>确认</el-button>
						</div>
					</el-col>
				</el-row>
			</template>
		</vxe-modal>
	</div>
</template>

<script>
	export default {
		name: 'editRisk',
		props: {
			//是否展示
			riskShow: {
				type: Boolean,
				// 当为对象类型设置默认值时必须使用函数返回
				required: true
			}
		},
		components: {},
		data() {
			return {
				loading: false,
				riskData: [],
				defaultProps: {
					children: 'children',
					label: 'riskName'
				},
				submitLoading: false,
				tableData: []
			}
		},
		computed: {},
		watch: {
			riskShow(oldval, newval) {
				// console.log(newval)
				if (newval === false) {
					console.log('添加风险因素')
					this.getRiskTree()
				}
			},
		},
		created() {

		},
		mounted() {
			// console.log(this.showPlanId)
			// this.getLookData()
		},
		methods: {
			handleNodeClick(item) {
				console.log(this.$refs.tree.getCheckedNodes())
				this.tableData = this.$refs.tree.getCheckedNodes()
				// this.tableData = []
				// this.aboutData = []
				// let data = this.$refs.tree.getCheckedNodes()
				// for (let i = 0; i < data.length; i++) {
				// 	this.tableData.push({
				// 		index: i + 1,
				// 		name: data[i].name,
				// 		specs: data[i].specification,
				// 		startTime: data[i].commissioningDate,
				// 		departmentName: data[i].orgName,
				// 		data: data[i]
				// 	})
				// 	this.aboutData.push(data[i].equipCode)
				// }
			},
			getRiskTree () {
				let json = {
					riskName: null,
					measure: null,
					type: null,
					pageNo: 1,
					pageSize: 9999
				}
				this.riskData = []
				this.jobCardRisk(json).then(res => {
					if (res.data.code === 0) {
						console.log(res.data.data.records)
						let data = res.data.data.records
						
						this.riskData = data
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			sure () {
				// console.log(this.tableData)
				this.closemodel()
			},
			closemodel() {
				// console.log('关闭对话框')
				this.$emit('riskdialog', this.tableData)
			},
		}
	}
</script>
<style scoped>

</style>
