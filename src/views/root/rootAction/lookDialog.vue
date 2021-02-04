<template>
	<div class="role_look">
		<el-dialog v-dialogDrag title="菜单权限" :visible.sync="centerDialogVisible" width="80%" center :close-on-click-modal="false">
			<span slot="label"><i class="el-icon-suitcase"></i> 设备详情</span>
			<el-form v-loading="loading" :label-position="'left'" label-width="80px" :model="sizeForm">
				<el-form-item v-for="(item, index) in listrole" :key="index" :label="item.name" >
					<!-- <span class="left_">{{item.value}}</span> -->
					<el-input v-model="item.value" disabled></el-input>
				</el-form-item>
				<el-form-item label="EAM菜单权限">
					<!-- <div>
						<div class="left_" :style="{height: left_height,overflowY: 'scroll'}">
							<tree ref="gettree1"></tree>
						</div>
					</div> -->
					<div style="display: flex;">
						<div style="width: 32%;">
							<span class="left_" style="font-weight: bold;color: #000000;">后台管理权限</span>
							<div class="left_" :style="{height: left_height,overflowY: 'scroll'}">
								<tree ref="gettree1" v-bind:showdata="treeData1"></tree>
							</div>
						</div>
						<div style="width: 32%;">
							<span class="left_" style="font-weight: bold;color: #000000;">移动端管理权限</span>
							<div class="left_" :style="{height: left_height,overflowY: 'scroll'}">
								<newtree ref="gettree2" v-bind:showdata="treeData2"></newtree>
							</div>
						</div>
						<div style="width: 32%;">
							<span class="left_" style="font-weight: bold;color: #000000;">3D管理权限</span>
							<div class="left_" :style="{height: left_height,overflowY: 'scroll'}">
								<newtree1 ref="gettree3" v-bind:showdata="treeData3"></newtree1>
							</div>
						</div>
					</div>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="centerDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="deviceUpdateSure" v-prevent-re-click>保 存</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	// import bus from "../../common/bus";
	import tree from "./role_look_tree.vue"
	import newtree from "./role_look_tree_new.vue"
	import newtree1 from "./role_look_tree_new_.vue"
	export default {
		name: "role_look",
		components: {
			tree,
			newtree,
			newtree1
		},
		data() {
			return {
				loading: false,
				sizeForm: {
					roleName: "",
					orderNo: ""
				},
				treeData1: [],
				treeData2: [],
				treeData3: [],
				left_height: document.body.clientHeight * 0.2 + "px",
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
				jsonData: {
					pageNo: 1,
					pageSize: 10000
				},
				menuData: [],
				roleId: 0
			};
		},
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
			getTree() {
				this.$axios.post('/u/menu/query', this.jsonData).then(res => {
					//console.log("菜单管理列表请求")
					if (res.data.code == 0) { //查询到数据
						let data = res.data.data.content
						let that = this
						that.treeData1 = []
						that.treeData2 = []
						that.treeData3 = []
						setTimeout(function() {
							if (data.length != 0) { //如果请求数据不为空

								//that.total = res.data.data.totalElements //列表总数

								let dataAll = that.getTreedata(data)
								for (let i=0;i<dataAll.length;i++) {
									if (dataAll[i].appId==1) {
										that.treeData1.push(dataAll[i])
									}
									if (dataAll[i].appId==2) {
										that.treeData2.push(dataAll[i])
									}
									if (dataAll[i].appId==3) {
										that.treeData3.push(dataAll[i])
									}
								}

							} else {
								that.treeData = []
							}
						}, 500); //500代表延迟毫秒值
						//this.treeData = [] //每次默认置空
						that.treeData1 = []
						that.treeData2 = []
						that.treeData3 = []
					} else {
						this.$notify.error({
							title: '请求失败',
							message: res.data.message
						});
						that.treeData1 = []
						that.treeData2 = []
						that.treeData3 = []
					}

				})
			},
			// 确定
			deviceUpdateSure() {
				let newdata = this.$refs.gettree1.getCheckedKeys().concat(this.$refs.gettree2.getCheckedKeys())
				newdata = newdata.concat(this.$refs.gettree3.getCheckedKeys())
				let addJson = {
					roleId: this.roleId,
					menuIds: newdata
				}
				console.log(addJson)
				this.$axios.post('/u/roleMenu/set', addJson).then(res => {
					//console.log(res.data)
					if (res.data.code === 0) {
						this.roleMenu()
						this.$notify({
							title: res.data.message,
							message: '保存成功',
							type: 'success'
						});
						this.centerDialogVisible = false
					} else {
						this.$notify.error({
							title: '保存失败',
							message: res.data.message
						});
					}
					//bus.$emit('roleTreeLook', this.menuData)
				})
				//this.centerDialogVisible = false
			},
			roleMenu() {
				let addJson = {
					roleId: this.roleId
				}
				this.$axios.post('/u/roleMenu/getAllMenuByRole', addJson).then(res => {
					//console.log(res.data)
					this.menuData = []
					if (res.data.code == 0 && res.data.data != []) {
						this.menuData = res.data.data
					} else {
						this.menuData = []
					}
					this.$bus.$emit('roleTreeLook', this.menuData)
				})
			}
		},
		mounted() {

		},
		created() {
			this.$bus.$on("roleLook", msg => {
				console.log(msg)
				this.roleId = msg.id
				this.roleMenu()
				// this.getTree()
				this.listrole = [{
						name: '角色名称',
						value: msg.rolename
					},
					{
						name: '排序号',
						value: msg.number
					}
				]
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
		width: 60% !important;
	}

	.left_ {
		font-size: 16px;
		margin-left: 80px;
	}

	.el-form-item:nth-child(odd) {
		padding: 10px;
		background-color: rgba(246, 248, 255, 1);
		margin-bottom: 0;
	}

	.el-form-item:nth-child(even) {
		padding: 10px;
		background-color: rgba(237, 237, 249, 1);
		margin-bottom: 0;
	} */
</style>
