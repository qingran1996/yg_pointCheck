<template>
	<div v-show="isshow" class="pointWayAdd">
		<el-dialog title="点检路线新增" v-dialogDrag :visible.sync="pointWayAdd_show" width="30%" :close-on-click-modal="false"
		 @close="showclose" center>
			<el-form ref="infoData" :model="infoData" label-width="130px" class="demo-ruleForm" :rules="ruleform">
				<el-form-item label="路线名称" prop="wayName">
					<el-input v-model="infoData.wayName" clearable />
				</el-form-item>
				<el-form-item label="所属部门" prop="dept">
					<el-select v-model="infoData.dept">
						<el-option v-for="item in deptList" :key="item.label" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属条线" prop="belongToLine">
					<el-select v-model="infoData.belongToLine">
						<el-option v-for="item in belongToLineList" :key="item.label" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态" prop="state">
					<el-select v-model="infoData.state">
						<el-option v-for="item in stateList" :key="item.label" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注" prop="remarks">
					<el-input v-model="infoData.remarks" type="textarea" clearable />
				</el-form-item>
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
		name: 'pointWayAdd',
		components: {},
		props: {
			//是否展示
			isshow: {
				type: Boolean,
				// 当为对象类型设置默认值时必须使用函数返回
				default: false
			}
		},
		data() {
			return {
				pointWayAdd_show: false, //控制显示dialog
				infoData: {
					wayName: '',
					dept: '',
					belongToLine: '',
					state: '',
					remarks: ''
				},
				deptList: [{
						value: '2',
						label: '模型类'
					},
					{
						value: '3',
						label: '工艺图纸类'
					},
					{
						value: '4',
						label: '说明类'
					},
					{
						value: '5',
						label: '设备合格证类'
					},
					{
						value: '6',
						label: '其他类'
					},
					{
						value: '1',
						label: '文档测试类型1'
					}
				],
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
					wayName: [{
						required: true,
						message: '请输入路线名称',
						trigger: ['change', 'blur']
					}],
					dept: [{
						required: true,
						message: '请选择部门',
						trigger: ['blur', 'change']
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
			}
		},
		mounted() {
			// console.log(this.isshow)
			// this.$bus.off()
			// this.$bus.on('pointWayAdd', (e) => {
			// 	console.log(666)
			// })
		},
		created() {

		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						alert('submit!');
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			//关闭对话框,并清空选择状态
			showclose() {
				this.$refs['infoData'].resetFields();
				// console.log(this.isshow)
				// this.pointWayAdd_show = false
				this.$emit('closedialog', false)
			}
		}
	}
</script>
<style scoped>
	.pointWayAdd {
		padding: 10px;
	}
</style>
