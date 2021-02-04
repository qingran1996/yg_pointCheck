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
				getrootdata: [],
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
			getTreedata (data) {
				// 删除 所有 children,以防止多次调用
				        data.forEach(function (item) {
				            delete item.children;
				        });
				 
				        // 将数据存储为 以 id 为 KEY 的 map 索引数据列
				        var map = {};
				        data.forEach(function (item) {
				            map[item.id] = item;
				        });
				//        console.log(map);
				        var val = [];
				        data.forEach(function (item) {
				            // 以当前遍历项，的pid,去map对象中找到索引的id
				            var parent = map[item.pid];
				            // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
				            if (parent) {
				                (parent.children || ( parent.children = [] )).push(item);
				            } else {
				                //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
				                val.push(item);
				            }
				        });
				        return val;
			},
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
								// for (var i = 0; i < data.length; i++) {
								// 	if (data[i].pid == 0 && data[i].appId==3) {
								// 		that.treeData.push(data[i])
								// 	}
								// }
								// for (let i = 0; i < that.treeData.length; i++) {
								// 	let children = []
								// 	for (let j = 0; j < data.length; j++) {
								// 		if (that.treeData[i].id == data[j].pid && data[i].appId==3) {
								// 			children.push(data[j])
								// 			that.treeData[i]['children'] = children
								// 		}
								// 	}
								// }
								
								// console.log(that.getTreedata(data))
								let dataAll = that.getTreedata(data)
								for (let i=0;i<dataAll.length;i++) {
									if (dataAll[i].appId==3) {
										that.treeData.push(dataAll[i])
									}
								}
								
								// console.log(that.treeData)
								that.$nextTick(() => {
									that.expandshow = expand
									//that.checkshow = check
									//let ppp = [13]
									//that.$refs.tree.setCheckedKeys()
									//console.log(expand)
									//console.log(check)
									let samedata = that.deletesame(that.father)
									for (let i = 0; i < samedata.length; i++) {
										for (let j = 0; j < check.length; j++) {
											if (samedata[i] == check[j]) {
												check.splice(j, 1)
											}
										}
									}
									//console.log(samedata)
									//console.log(check)
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
	.role_look_tree_new {
		width: 300px;
		min-width: 300px;
	}
</style>
