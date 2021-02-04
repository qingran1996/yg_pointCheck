<template>
	<div class="user_edit">
		<el-dialog v-dialogDrag title="人员详情" :visible.sync="centerDialogVisible" width="40%" center @close="isclose"
		 :close-on-click-modal="false">
			<span slot="label"><i class="el-icon-suitcase"></i> 设备详情</span>
			<el-form v-loading="loading" :label-position="'left'" label-width="80px" :model="sizeForm">
				<el-form-item v-for="(item, index) in listrole" :key="index" :label="item.name">
					<!-- <span class="left_">{{item.value}}</span> -->
					<el-input v-model="item.value" disabled=""></el-input>
				</el-form-item>
				<div class="user_look_nav">
					<el-transfer v-model="value" :data="tableData" :titles="['可分配角色', '已分配角色']" :button-texts="['移除', '增加']" @change="deviceUpdateSure" filterable></el-transfer>
				</div>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="centerDialogVisible = false">关 闭</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	export default {
		name: "user_edit",
		components: {

		},
		data() {
			return {
				loading: false,
				sizeForm: {
					roleName: "",
					orderNo: ""
				},
				flag: false,
				listrole: [],
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
				},
				menuData: [],
				roleId: 0,
				tableData: [],
				value: []
			};
		},
		methods: {
			isclose() {
				this.listrole = []
				this.roleId = 0
			},
			// 确定
			deviceUpdateSure() {
				//console.log(this.value)
				let jsonData = {
					userId: this.roleId,
					roleIds: this.value
				}
				this.$axios.post('/u/userRole/set', jsonData).then(res => {
					//console.log(res.data.data)
					if (res.data.code === 0) {
						this.$notify({
							title: res.data.message,
							message: '设置用户角色成功',
							type: 'success'
						});
						this.getrole()
						this.roleSure(this.roleId)
					} else {
						this.$notify.error({
							title: '设置失败',
							message: res.data.message
						});
					}

				})
			},
			roleSure(id) {
				let jsonData = {
					userId: id
				}
				this.$axios.post('/u/userRole/getAllRoleByUser', jsonData).then(res => {
					console.log(res.data.data)
					this.value = []
					if (res.data.code === 0 && res.data.data.length !== 0) {
						//console.log(2323)
						let data = res.data.data
						for (let i = 0; i < data.length; i++) {
							this.value.push(data[i].id)
						}
						//console.log(this.value)
					} else {
						this.value = []
					}

				})
			},
			getrole() {
				let jsonData = {
					pageSize: 10000
				}
				this.$axios.post('/u/role/query', jsonData).then(res => {
					console.log("角色管理列表请求",res)
					if (res.data.code === 0) { //查询到数据
						let data = res.data.data.content
						this.loading = true
						let that = this
						setTimeout(function() {
							if (data.length !== 0) { //如果请求数据不为空
								for (let i = 0; i < data.length; i++) {
									that.tableData.push({
										key: data[i].id,
										label: data[i].roleName
									});
								}
							} else {
								that.tableData = []
							}
							that.loading = false //要执行的事件
						}, 500); //500代表延迟毫秒值
						this.tableData = [] //每次默认置空
					} else {
						this.$notify.error({
							title: '请求失败',
							message: res.data.message
						});
						this.tableData = []
					}

				})
			}
		},
		mounted() {

		},
		created() {
			this.$bus.$on("userLook", msg => {
				// console.log(msg)
				if (Object.prototype.toString.call(msg) === '[object Object]') {
					this.getrole()
					this.roleId = msg.id
					this.roleSure(msg.id)
					this.listrole = [
						// {
						// 	name: '用户名',
						// 	value: msg.username
						// },
						{
							name: '人员姓名',
							value: msg.name
						}
					]
				} else {
					console.log(msg)
				}
				this.centerDialogVisible = true
			});
		}
	};
</script>
<style scoped>
	.user_look_nav {
		text-align: center;
	}

	.user_look_nav>>>.el-transfer-panel {
		text-align: left;
	}

	.el-dialog__wrapper>>>.el-dialog {
		min-width: 40% !important;
	}
</style>
