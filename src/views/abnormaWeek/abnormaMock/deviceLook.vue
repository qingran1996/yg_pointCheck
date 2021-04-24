<template>
	<div class="abnormaDevice_look">
		<vxe-modal v-model="isshow" title="设备详情" width="80%" min-width="600" min-height="300" :loading="submitLoading"
			resize destroy-on-close @close="closemodel">
			<template #default>
				123

			</template>
		</vxe-modal>
	</div>
</template>

<script>
	export default {
		name: 'abnormaDevice_look',
		props: {
			//是否展示
			isshow: {
				type: Boolean,
				// 当为对象类型设置默认值时必须使用函数返回
				default: false
			},
			//id
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
		computed: {},
		watch: {
			isshow(oldval, newval) {
				// console.log(newval)
				if (newval === false) {
					console.log(123)
				}
			},
		},
		data() {
			return {
				loading: false,
				submitLoading: false,
			}
		},
		created() {

		},
		mounted() {
			// console.log(this.showPlanId)
			// this.getLookData()
		},
		methods: {
			closemodel() {
				// console.log('关闭对话框')
				this.$emit('closedialog', false)
			},
			//获取点检区域
			getArea(code) {
				let areaJson = {
					pageNo: 1,
					pageSize: 50,
					orgId: code
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
