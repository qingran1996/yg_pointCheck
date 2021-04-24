<template>
	<div class="editGas">
		<vxe-modal v-model="gasShow" title="添加监测气体" width="70%" min-width="600" height="70%" :loading="submitLoading"
			resize destroy-on-close @close="closemodel">
			<template #default>
				<el-row :gutter="20">
					<el-col :span="8">
						<vxe-form :data="formData" title-align="right" title-width="100" @submit="submitEvent">
							<vxe-form-item title="监测气体名称" field="name" span="24" :item-render="{}">
								<template #default="scope">
									<vxe-input v-model="formData.name" placeholder="请输入监测气体名称" clearable>
									</vxe-input>
								</template>
							</vxe-form-item>
							<vxe-form-item title="监测方式" field="detectionMethod" span="24" :item-render="{}">
								<template #default="scope">
									<vxe-select v-model="formData.detectionMethod" placeholder="请选择监测方式" size="small" clearable="">
										<vxe-option v-for="item in gasTypeData" :key="item.value" :label="item.label"
											:value="item.value"></vxe-option>
									</vxe-select>
								</template>
							</vxe-form-item>
							<vxe-form-item title="气体检测类型" field="type" span="24" :item-render="{}">
								<template #default="scope">
									<vxe-select v-model="formData.type" placeholder="请选择气体检测类型" size="small" clearable="">
										<vxe-option v-for="item in gasCheckTypeData" :key="item.value" :label="item.label"
											:value="item.value"></vxe-option>
									</vxe-select>
								</template>
							</vxe-form-item>
							<vxe-form-item title="监测周期" field="week" span="24" :item-render="{}">
								<template #default="scope">
									<vxe-input v-model="formData.week" placeholder="请输入监测气体名称" clearable type="integer">
									</vxe-input>
								</template>
							</vxe-form-item>
							<vxe-form-item title="标准值" field="value" span="24" :item-render="{}">
								<template #default="scope">
									<vxe-input v-model="formData.value" placeholder="请输入标准值" clearable type="integer">
									</vxe-input>
								</template>
							</vxe-form-item>
							<vxe-form-item title="单位" field="unit" span="24" :item-render="{}">
								<template #default="scope">
									<vxe-input v-model="formData.unit" placeholder="请输入单位" clearable>
									</vxe-input>
								</template>
							</vxe-form-item>
							<vxe-form-item class="bottomShow" align="center" span="24" :item-render="{}">
								<template #default>
									<vxe-button type="submit" status="success">添加</vxe-button>
									<vxe-button type="reset">重置</vxe-button>
								</template>
							</vxe-form-item>
						</vxe-form>
					</el-col>
					<el-col :span="16">
						<div style="width: 100%;text-align: center;margin-bottom: 10px;">
							<el-tag type="info">已选</el-tag>
						</div>
						<el-table :data="gascheckData" border style="width: 100%">
							<el-table-column prop="projectName" label="气体名称" show-overflow-tooltip>
							</el-table-column>
							<el-table-column prop="detectionMethod" label="监测方式" show-overflow-tooltip>
								<template slot-scope="scope">
									<div class="action">
										{{typechange(scope.row.detectionMethod)}}
									</div>
								</template>
							</el-table-column>
							<el-table-column prop="cycle" label="监测周期" show-overflow-tooltip>
							</el-table-column>
							<el-table-column prop="standardValue" label="标准值" show-overflow-tooltip>
							</el-table-column>
							<el-table-column prop="unit" label="单位" show-overflow-tooltip>
							</el-table-column>
							<el-table-column fixed="right" label="操作"  align="center">
								<template slot-scope="scope">
									<div class="action">
										<el-tooltip class="item" effect="dark" content="删除" placement="bottom">
											<el-tag type="danger" @click.native.prevent="deleteRow(scope.$index, gascheckData)">删除</el-tag>
										</el-tooltip>
									</div>
								</template>
							</el-table-column>
						</el-table>
						<div style="width: 100%;text-align: center;margin: 10px 0;">
							<el-button v-prevent-re-click @click="sure" type="primary" plain>确认</el-button>
						</div>
					</el-col>
				</el-row>
			</template>
		</vxe-modal>
	</div>
</template>

<script>
	export default {
		name: 'editGas',
		props: {
			//是否展示
			gasShow: {
				type: Boolean,
				// 当为对象类型设置默认值时必须使用函数返回
				required: true
			}
		},
		components: {},
		data() {
			return {
				loading: false,
				submitLoading: false,
				formData: {
					name: null,
					type: null,
					week: null,
					value: null,
					unit: null,
					detectionMethod: null
				},
				gascheckData: [],
				gasTypeData: [
					{
						value: 1,
						label: '手动'
					},
					{
						value: 2,
						label: '自动'
					}
				],
				gasCheckTypeData: [
					{
						value: 1,
						label: '开工监测'
					},
					{
						value: 2,
						label: '过程监测'
					}
				]
			}
		},
		computed: {},
		watch: {
			gasShow(oldval, newval) {
				// console.log(newval)
				if (newval === false) {
					console.log('添加监测气体')
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
			deleteRow (index,rows) {
				rows.splice(index, 1);
			},
			typechange (num) {
				let val = ''
				for (var i = 0; i < this.gasTypeData.length; i++) {
					if (num === this.gasTypeData[i].value) {
						val = this.gasTypeData[i].label
					}
				}
				return val
			},
			//下发验证
			submitEvent() {
				this.submitLoading = true
				setTimeout(() => {
					this.submitLoading = false
					if (this.selectRow) {

					} else {
						//正常是新增的
						console.log(this.formData)
						this.gascheckData.push({
							cycle: this.formData.week,
							detectionMethod: this.formData.detectionMethod,
							projectName: this.formData.name,
							standardValue:this.formData.value,
							type: this.formData.type,
							unit: this.formData.unit
						})
					}
				}, 500)
			},
			sure () {
				// console.log(this.tableData)
				this.closemodel()
			},
			closemodel() {
				// console.log('关闭对话框')
				this.$emit('gasdialog', this.gascheckData)
			},
		}
	}
</script>
<style scoped>

</style>
