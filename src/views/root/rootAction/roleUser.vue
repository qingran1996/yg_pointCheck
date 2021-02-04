<template>
	<div class="roleUser">
		<el-dialog v-dialogDrag :title="titlename" :visible.sync="centerDialogVisible" width="60%" center :close-on-click-modal="false">
			<el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight">
					<el-table-column type="index" label="序号" width="100" align="center" />
					<el-table-column prop="userId" label="用户Id" min-width="180" align="center" />
					<el-table-column prop="user" label="用户姓名" min-width="180" align="center" />
					<el-table-column prop="username" label="用户账号" min-width="180" align="center" />
					<el-table-column prop="lastLoginIp" label="上次登陆地址" min-width="180" align="center" />
				</el-table>
			<span slot="footer" class="dialog-footer">
				<!-- <el-button @click="centerDialogVisible = false">取 消</el-button> -->
				<el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	export default {
		name: "roleUser",
		components: {},
		data() {
			return {
				titlename: '',
				loading: false,
				sizeForm: {
					roleName: "",
					orderNo: ""
				},
				tableData: [],
				tableHeight: document.body.clientHeight * 0.4 + "px",
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
				roleId: 0
			};
		},
		methods: {
			getuser (name) {
				let json = {
					roleName:name
				}
				this.columns4 = []
				this.getByRole(json).then(res => {
						if (res.data.code === 0) {
							console.log(res.data.data)
							let data = res.data.data
							this.loading = true
							let that = this
							that.tableData = []
							setTimeout(function() {
								if (data.length !== 0) { //如果请求数据不为空
									// that.total = res.data.data.totalElements //列表总数
									for (var i = 0; i < data.length; i++) {
										that.tableData.push({
											user: data[i].name,
											userId: data[i].id,
											username: data[i].userName,
											lastLoginIp: data[i].lastLoginIp
										})
									}
									//console.log('表', that.tableData)
								} else {
									that.tableData = []
									// that.total = 0
								}
								that.loading = false //要执行的事件
							}, 500) //500代表延迟毫秒值
							this.tableData = [] //每次默认置空
						} else if(res.data.code === 22002){
              this.$notify.info(res.data.message)
              this.tableData = []
            }else {
							this.$notify.error({
								title: '请求失败',
								message: res.data.message
							})
							this.tableData = []
						}
					})
					.catch(res => {
						// this.$toast('服务异常')
					})
			},
		},
		mounted() {

		},
		created() {
			this.$bus.$on("roleuser", msg => {
				this.titlename = msg + '列表'
				this.centerDialogVisible = true
				this.getuser(msg)
			});
		}
	};
</script>
<style scoped>

</style>
