<template>
	<div v-show="isshow" class="personAdd">
		<el-dialog :title="addOredit?'人员新增':'人员修改'" v-dialogDrag :visible.sync="pointWayAdd_show" width="30%" :close-on-click-modal="false"
		 @close="showclose" center>
			<el-form ref="infoData" :model="infoData" label-width="130px" class="demo-ruleForm" :rules="ruleform">
				<el-form-item label="区域名称" prop="name">
					<el-input v-model="infoData.name" clearable />
				</el-form-item>
				<el-form-item label="版本号" prop="version">
					<el-input v-model="infoData.version" clearable />
				</el-form-item>
				<!-- <el-form-item label="所属条线" prop="belongToLine">
					<el-select v-model="infoData.belongToLine">
						<el-option v-for="item in belongToLineList" :key="item.label" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item> -->
				<!-- <el-form-item label="状态" prop="state">
					<el-select v-model="infoData.state">
						<el-option v-for="item in stateList" :key="item.label" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item> -->
				<!-- <el-form-item label="备注" prop="remarks">
					<el-input v-model="infoData.remarks" type="textarea" clearable />
				</el-form-item> -->
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="pointWayAdd_show = false">取 消</el-button>
				<el-button v-prevent-re-click type="primary" @click="submitForm('infoData')">确 定</el-button>
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
			//新增还是修改
			addOredit: {
				type: Boolean,
				// 当为对象类型设置默认值时必须使用函数返回
				default: false
			}
		},
		data() {
			return {
				pointWayAdd_show: false, //控制显示dialog
				isdeptshow: false, //部门弹出
				infoData: {
					name: '',
					dept: '',
					version: '',
					belongToLine: '',
					state: '',
					remarks: ''
				},
				postdata: { //提交参数
					name: '',
					orgCode: '',
					version: ''
				},
				updateTree: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				belongToLineList: [{
						value: '2',
						label: '模型类'
					},
					{
						value: '3',
						label: '工艺图纸类'
					}
				],
				stateList: [{
						value: '1',
						label: '启用'
					},
					{
						value: '2',
						label: '禁用'
					}
				],
				// 表单的判断规则
				ruleform: {
					name: [{
						required: true,
						message: '请输入区域名称',
						trigger: ['change', 'blur']
					}],
					dept: [{
						required: true,
						message: '请选择部门',
						trigger: ['change', 'blur']
					}],
					version: [{
						required: true,
						message: '请输入版本号',
						trigger: ['change', 'blur']
					}],
					belongToLine: [{
						required: true,
						message: '请选择所属条线',
						trigger: ['blur', 'change']
					}],
					state: [{
						required: true,
						message: '请选择状态',
						trigger: ['blur', 'change']
					}],
					remarks: [{
						required: true,
						message: '请输入备注',
						trigger: ['change', 'blur']
					}]
				},
			}
		},
		watch: {
			isshow(val) {
				// console.log(val)
				if (val === true) {
					this.pointWayAdd_show = true
				}
			},
			addOredit(val) {
				console.log(val)
				if (val === true) {
					this.$refs['infoData'].resetFields();
					this.infoData.name = ''
					this.infoData.dept = ''
					this.postdata.orgCode = ''
					this.infoData.version = ''
					
				} else {
					console.log(this.$parent.listitem)
					this.infoData.name = this.$parent.listitem.areaName
					this.infoData.dept = this.$parent.listitem.dept
					this.infoData.orgCode = this.$parent.listitem.dept
					this.infoData.version = this.$parent.listitem.edition
				}
			}
		},
		mounted() {
			console.log(this.$parent.tableHeight)
		},
		created() {
			
		},
		methods: {
			handleNodeClick(data) {
				// console.log(data);
				this.infoData.dept = data.label
				this.postdata.orgCode = data.code
				this.isdeptshow = false
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (this.addOredit) {
							this.postsure()
						} else {
							// this.infoData.name = this.$parent.listitem.areaName
							// this.infoData.code = this.$parent.listitem.code
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
			postsure() {
				let json = {
					name: this.infoData.name,
					orgCode: this.postdata.orgCode,
					version: this.infoData.version
				}
				this.areaAdd(json).then(res => {
					if (res.data.code === 0) {
						// console.log("部门数据", res.data.data)
						this.pointWayAdd_show = false
						this.$message({
							message: res.data.message,
							type: 'success'
						})
						this.showclose()
						setTimeout((e) => {
							this.$emit('dataUpdate', true)
						}, 500)
						
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			nosure () {
				let json = {
					id: this.$parent.listitem.id,
					name: this.infoData.name,
					orgCode: this.postdata.orgCode,
					version: this.infoData.version
				}
				console.log(json)
				// this.areaUpdate(json).then(res => {
				// 	if (res.data.code === 0) {
				// 		// console.log("部门数据", res.data.data)
				// 		this.pointWayAdd_show = false
				// 		this.$message({
				// 			message: res.data.message,
				// 			type: 'success'
				// 		})
				// 		this.showclose()
				// 		setTimeout((e) => {
				// 			this.$emit('dataUpdate', true)
				// 		}, 500)
						
				// 	} else {
				// 		this.$message({
				// 			message: res.data.message,
				// 			type: 'warning'
				// 		})
				// 	}
				// })
			},
			//关闭对话框,并清空选择状态
			showclose() {
				this.$refs['infoData'].resetFields();
				this.postdata = { //提交参数
					name: '',
					orgCode: '',
					version: ''
				}
				// console.log(this.isshow)
				// this.pointWayAdd_show = false
				this.$emit('closedialog', false)
			}
		}
	}
</script>
<style scoped>

</style>
