<template>
	<div class="role_add">
		<el-dialog v-dialogDrag title="修改角色" :visible.sync="centerDialogVisible" width="30%" center :close-on-click-modal="false">
			<el-form :label-position="'left'" ref="sizeForm" :rules="rules" :model="sizeForm" label-width="80px">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="sizeForm.roleName"></el-input>
				</el-form-item>
				<el-form-item label="序号" prop="orderNo">
					<el-input v-model="sizeForm.orderNo"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="centerDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="deviceUpdateSure('sizeForm')" v-prevent-re-click>确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	// import bus from "../../common/bus";
	export default {
		name: "role_add",
		components: {},
		data() {
			return {
				rules: {
					roleName: [{
						required: true,
						message: '角色名称不能为空',
						trigger: 'blur'
					}],
					orderNo: [{
						required: true,
						message: '序号不能为空',
						trigger: 'blur'
					}]
				},
				loading: false,
				sizeForm: {
					roleName: "",
					orderNo: "",
					getid: ''
				},
				config: {},
				activeName: 'first',
				centerDialogVisible: false,
				addAreaCode: '', // 区域code
				brandCode: '', // 品牌code
				deviceCode: '', // 设备code
				list: [], //设备信息
				isList: false, //设备信息是否存在
				listConfig: [], //设备配置信息
				listBrand: [],
				isListConfig: false, //设备配置信息是否存在
				thisrow: {}, //当前行内容
				row: {
					brandName: '',
					brandNum: '',
					brandType: '',
					config: ''
				}
			};
		},
		methods: {
			// 新增的参数和接口
			deviceUpdateSure(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let addJson = {
							id: this.sizeForm.getid,
							roleName: this.sizeForm.roleName,
							orderNo: this.sizeForm.orderNo
						}
						this.$axios.post('/u/role/update', addJson).then(res => {
							// let data = res.data.message
							if (res.data.code == 0) {
								this.centerDialogVisible = false
								this.$notify({
									title: res.data.message,
									message: '角色更新成功',
									type: 'success'
								});
								this.$bus.$emit('roleTable_update', true) //角色table更新
								// let that = this
								// setTimeout(() => {
								// 	this.$bus.$emit('roleLook', {
								// 		id: that.sizeForm.getid,
								// 		number: that.sizeForm.orderNo,
								// 		rolename: that.sizeForm.roleName
								// 	})
								// }, 500)
							} else {
								this.$notify.error({
									title: '更新失败',
									message: res.data.message
								});
							}
							//console.log(res.data)
						}).catch(err => {
							console.log(err)
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				})

			}
		},
		mounted() {},
		created() {
			this.$bus.$on("roleUpdate", msg => {
				//console.log(msg)
				this.sizeForm = {
					roleName: msg.rolename,
					orderNo: msg.number,
					getid: msg.id
				}
				this.centerDialogVisible = true
			});
		}
	};
</script>
<style scoped>
	/* .el-form>>>.el-form-item__label {
		color: rgba(0, 0, 0, 1);
		font-weight: bold;
		width: 120px !important;
		font-size: 16px;
	}

	.el-form>>>.el-form-item__content {
		margin-left: 120px !important;
	}

	.el-dialog__wrapper>>>.el-dialog {
		width: 50% !important;
	} */
</style>
