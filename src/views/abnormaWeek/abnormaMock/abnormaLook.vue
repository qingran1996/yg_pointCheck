<template>
	<div class="abnorma_look">
		<vxe-modal v-model="isshow" :title="'隐患'+titleshow" width="40%" min-width="600" min-height="300"
			:loading="submitLoading" resize destroy-on-close @close="closemodel">
			<template #default>
				<vxe-form :data="sonformData" :rules="sonformRules" title-colon title-align="right" title-width="150"
					ref="xForm" @submit="submitEvent">
					<vxe-form-item title="执行人姓名" field="name" span="12" :item-render="{}">
						<template #default="scope">
							<vxe-input v-model="sonformData.name" @input="$refs.xForm.updateStatus(scope)"
								placeholder="请输入执行人姓名" clearable></vxe-input>
							<!-- <el-autocomplete style="width: 300px;" 
									v-model="sonformData.name" :fetch-suggestions="querySearchPerson"
									:trigger-on-focus="true" placeholder="请输入人员"
									@select="handleSelectPerson">
									<template slot-scope="{ item }">
										<div class="name" style="display: inline-block;color: #000000;">
											{{ item.name }}
										</div>
										<div class="name" style="display: inline-block;float: right;"><i
												class="el-icon-phone"
												style="margin-left: 10px;color: orange;"></i>{{ item.phoneNumber }}
										</div>
										<div class="dept" style="color: lightseagreen;"
											:title="item.orgName">
											部门： {{ item.orgName }}
										</div>
									</template>
								</el-autocomplete> -->
						</template>
					</vxe-form-item>
					<vxe-form-item title="专业" field="discipline" span="12" :item-render="{}">
						<template #default="scope">
							<el-select v-model="sonformData.discipline" placeholder="请选择专业" @change="discipline_change(scope)">
								<el-option v-for="item in disciplineData" :key="item.value" :label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
							<!-- <vxe-select v-model="sonformData.discipline" @change="discipline_change(scope)" placeholder="请选择专业" clearable>
								<vxe-option v-for="item in disciplineData" :key="item.value" :value="item.value"
									:label="item.label"></vxe-option>
							</vxe-select> -->
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
	</div>
</template>

<script>
	export default {
		name: 'abnorma_look',
		props: {
			//是否展示
			isshow: {
				type: Boolean,
				// 当为对象类型设置默认值时必须使用函数返回
				required: true
			},
			//名字
			titleshow: {
				type: String,
				// 当为对象类型设置默认值时必须使用函数返回
				default: false
			},
			//对象
			showData: {
				type: Object,
				default: function() {
					return {
						message: 'hello'
					}
				}
			}
		},
		components: {},
		data() {
			return {
				loading: false,
				submitLoading: false,
				sonformData: {
					name: null,
					discipline: null
				},
				sonformRules: {
					name: [{
						required: true,
						message: '请输入人员名称'
					}],
					discipline: [{
						required: true,
						message: '请选择专业'
					}]
				},
				addJson: {
					handlerType: null, //处理类型：1指派，2移交，3，定修，4，废除
					executor: null, //选定的执行人
					line: null, //专业条线
					id: null
				},
				disciplineData: [{
					value: 1,
					label: '生产'
				}, {
					value: 2,
					label: '安全'
				}, {
					value: 3,
					label: '电气'
				},{
					value: 4,
					label: '设备'
				}],
				personrestaurants: []
			}
		},
		computed: {},
		watch: {
			isshow(oldval, newval) {
				// console.log(newval)
				if (newval === false) {
					console.log(this.showData)
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
			discipline_change(scope) {
				this.$refs.xForm.updateStatus(scope)
				// console.log(scope)
				this.addJson.line = scope.data.discipline
			},
			//关于人员得搜索
			querySearchPerson(queryString, cb) {
				// console.log(queryString)
				// this.formData.person = queryString
				this.personrestaurants = []
				this.personJson.userName = queryString
				this.getPerson()
				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => {
					cb(this.personrestaurants);
				}, 1200 * Math.random());
			},
			getPerson() {
				this.pointPlanPersonData(this.personJson).then(res => {
					if (res.data.code == 0) { //查询到数据
						let data = res.data.data
						console.log(data)
						this.personrestaurants = []
						if (data.length != 0) { //如果请求数据不为空
							this.personrestaurants = data
						} else {
							this.personrestaurants = []
						}
					}
				})
			},
			submitEvent() {
				this.submitLoading = true
				setTimeout(() => {
					this.submitLoading = false
					if (this.selectRow) {
						// this.addJson.name = this.formData.name
						// console.log(this.addJson)
						// this.updateArea()
					} else {
						// this.addJson.name = this.formData.name
						// console.log(this.addJson)
						// this.addArea()
						if (this.titleshow === '指派') {
							this.addJson.handlerType = 1
						} else if (this.titleshow === '移交') {
							this.addJson.handlerType = 12
						} else if (this.titleshow === '定修') {
							this.addJson.handlerType = 3
						}
						this.addJson.id = this.showData.id
						this.addJson.executor = this.sonformData.name
						console.log(this.addJson)
						this.editabnorma()
					}
				}, 500)
			},
			editabnorma () {
				this.handlerExce(this.addJson).then(res => {
					if (res.data.code == 0) { //查询到数据
						this.$message({
							message: '隐患'+this.titleshow+'成功',
							type: 'success'
						})
						this.closemodel()
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			closemodel() {
				this.sonformData = {
					name: null,
					discipline: null
				}
				this.addJson = {
					handlerType: null, //处理类型：1指派，2移交，3，定修，4，废除
					executor: null, //选定的执行人
					line: null, //专业条线
					id: null
				}
				// console.log('关闭对话框')
				this.$emit('closedialog', false)
			},
			//获取点检区域
			getArea(code) {
				let areaJson = {
					pageNo: 1,
					pageSize: 50,
					orgCode: code
				}
				this.areadata = []
				this.pointPlanAreaData(areaJson).then(res => {
					if (res.data.code == 0) { //查询到数据
						let data = res.data.data.records
						// console.log(data)
						for (let i = 0; i < data.length; i++) {
							data[i]['disabled'] = true
						}
						this.areadata = data
					} else {
						this.areadata = []
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
						// that.deptrestaurants = []
					}
				})
			}
		}
	}
</script>
<style scoped>
	.textshow {
		border-bottom: 1px solid rgba(0, 0, 0, 0.3);
		margin-left: 10px;
	}

	/* .el-card>>>.el-card__body {
		padding: 0 5px;
	} */

	.list {
		margin: 0;
		padding: 0;
	}

	.el-row>>>.el-col {
		padding-left: 0 !important;
	}

	.list li {
		list-style: none;
	}

	.list-item {
		font-size: 12px;
		/* overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap; */
	}
</style>
