<template>
	<div class="role_look_tree_new">
		<el-tree v-loading="loading" :data="treeData" ref="tree" show-checkbox node-key="id" :default-expanded-keys="expandshow"
		 :default-checked-keys="checkshow" :props="defaultProps">
		</el-tree>
	</div>
</template>

<script>
	export default {
		name: "role_look_tree_new",
		props: {
			showdata: {
				type: Array,
				default: function() {
					return []
				}
			}
		},
		data() {
			return {
				loading: false,
				expandshow: [],
				checkshow: [],
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				jsonData: {
					pageNo: 1,
					pageSize: 10000
				},
				father: []
			};
		},
		components: {},
		methods: {
			getTree(expand, check) {
				this.$axios.post('/u/menu/query', this.jsonData).then(res => {
					//console.log("菜单管理列表请求")
					if (res.data.code == 0) { //查询到数据
						let data = res.data.data.content
						this.loading = true
						let that = this

						setTimeout(function() {
							if (data.length != 0) { //如果请求数据不为空
								that.treeData = []
								//that.total = res.data.data.totalElements //列表总数
								for (var i = 0; i < data.length; i++) {
									if (data[i].pid == 0 && data[i].appId==2) {
										that.treeData.push(data[i])
									}
								}
								for (let i = 0; i < that.treeData.length; i++) {
									let children = []
									for (let j = 0; j < data.length; j++) {
										if (that.treeData[i].id == data[j].pid && data[i].appId==2) {
											children.push(data[j])
											that.treeData[i]['children'] = children
										}
									}
								}
								//console.log(that.treeData)
								that.$nextTick(() => {
									that.expandshow = expand
									let samedata = that.deletesame(that.father)
									for (let i = 0; i < samedata.length; i++) {
										for (let j = 0; j < check.length; j++) {
											if (samedata[i] == check[j]) {
												check.splice(j, 1)
											}
										}
									}
									that.checkshow = check
									//console.log(that.$refs.tree.getHalfCheckedKeys())
								});
							} else {
								that.treeData = []
							}
							that.loading = false //要执行的事件
						}, 500); //500代表延迟毫秒值
						//this.treeData = [] //每次默认置空
					} else {
						this.$notify.error({
							title: '请求失败',
							message: res.data.message
						});
						this.treeData = []
					}

				})
			},
			getCheckedKeys() {
				//console.log(this.$refs.tree.getHalfCheckedKeys())
				//console.log(this.$refs.tree.getCheckedKeys())
				let data = this.$refs.tree.getHalfCheckedKeys()
				let showdata = this.$refs.tree.getCheckedKeys()
				if (data.length != 0) {
					for (let i = 0; i < data.length; i++) {
						showdata.push(data[i])
					}
				}
				//console.log(showdata)
				return showdata
			},
			deletesame(data) {
				var arr = new Array(); //定义一个临时数组
				for (var i = 0; i < data.length; i++) { //循环遍历当前数组 
					//判断当前数组下标为i的元素是否已经保存到临时数组 
					//如果已保存，则跳过，否则将此元素保存到临时数组中 
					if (arr.indexOf(data[i]) == -1) {
						arr.push(data[i]);
					}
				}
				return arr
			}
		},
		mounted() {

		},
		created() {
			this.$bus.$on("roleTreeLook", msg => {
				//console.log(msg)
				//console.log(this.treeData)

				this.expandshow = []
				this.checkshow = []
				this.father = []
				let expand = []
				let check = []

				for (let i = 0; i < msg.length; i++) {
					if (msg[i].pid == 0) {
						expand.push(msg[i].id)
						check.push(msg[i].id)
					}
				}
				for (let i = 0; i < expand.length; i++) {
					for (let j = 0; j < msg.length; j++) {
						if (msg[j].pid == expand[i]) {
							check.push(msg[j].id)
							this.father.push(expand[i])
						}
					}
				}

				this.getTree(expand, check)
			});

		}
	};
</script>
<style scoped>
	.role_look_tree {
		width: 300px;
		min-width: 300px;
	}
</style>
