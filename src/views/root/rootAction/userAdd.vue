<template>
	<div class="user_add">
		<el-dialog v-dialogDrag class="neibu_dialog" :visible.sync="innerVisible" center append-to-body @close="isclose"
		 :close-on-click-modal="false">
			<span slot="title">添加用户</span>
			<div class="neibu_body_top">
				<el-input placeholder="请输入人员名字" v-model="groupdevice_search" @change="getdeviceName" class="input-with-select">
					<el-button slot="append" icon="el-icon-search"></el-button>
				</el-input>
			</div>
			<div class="neibu_body_body">
				<el-row :gutter="20">
					<el-col :span="5">
						<div class="arealist">部门列表</div>
						<el-tree :data="data" :style="{height: treeHeight,overflowY: 'scroll'}" v-loading="loading" element-loading-text="拼命加载中"
						 element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 15, 70)" node-key="id" accordion
						 ref="tree" @node-click="handleNodeClick" :expand-on-click-node="false" :default-expanded-keys="[updateTree]">
							<span slot-scope="{ node }" class="custom-tree-node">
								<el-tooltip class="item" effect="dark" :content="node.label" placement="right">
									<span>{{ node.label }}</span>
								</el-tooltip>
							</span>
						</el-tree>
					</el-col>
					<el-col :span="13">
						<div class="arealist">人员列表</div>
						<personTable></personTable>
					</el-col>
					<el-col :span="6">
						<div class="arealist">选择人员</div>
						<div class="deviceChoose" :style="{height: treeHeight}">
							<div class="chooseTitle">已选人员</div>
							<div class="chooseList" :style="{height: tagHeight,overflowY: 'scroll'}">
								<el-tag :key="tag" v-for="tag in dynamicTags" :disable-transitions="false" @close="handleClose(tag)">
									{{tag}}
								</el-tag>
							</div>
						</div>
					</el-col>
				</el-row>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="innerVisible = false">取 消</el-button>
				<el-button type="primary" @click="addDevice" v-prevent-re-click>新 增</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	// import bus from "../../common/bus";
	import personTable from "./personTable.vue";
	export default {
		name: "user_add",
		components: {
			personTable
		},
		data() {
			return {
				options: [],
				value: '',
				updateTree: 0,
				isok: 0,
				isnook: 0,
				treeHeight: document.body.clientHeight * 0.43 + "px",
				tagHeight: document.body.clientHeight * 0.45 - 50 - 42 - 15 - 61 - 20 - 40 + "px",
				deviceChooseHeight: document.body.clientHeight * 0.45 - 50 - 42 - 15 + "px",
				loading: false,
				groupdevice_search: '',
				innerVisible: false,
				data: [],
				getUser: [],
				sureUser: [],
				jsonData: {
					areaCode: "0"
				},
				dynamicTags: [], //右侧选中的设备名字
				dynamicTagsCode: [], //右侧选中的设备code
				addAreaCode: '', // 区域code
				brandCode: '', // 品牌code
				deviceCode: '', // 设备code
				disciplineCode: '',
				groupCode: '', //设备组code
				jsonshow: {

				}
			};
		},
		mounted() {
			// this.getDeviceType()
			// this.getdata()
		},
		methods: {
			isclose() {
				//console.log(2)
				//this.checkList = []
				this.isok = 0
				this.isnook = 0
				this.sureUser = []
				this.$bus.$emit('cidTable', true)
				this.groupdevice_search = ''
				this.$bus.$emit('personsearch', '')
			},
			typechange(val) {
				let obj = {};
				obj = this.options.find((item) => {
					return item.value === val;
				});
				//console.log(obj)
				this.disciplineCode = obj.laber
			},
			getDeviceType() {
				let json = {
					parentCode: "discipline"
				}
				this.getStateInfo(json).then(res => {
					let data = res.data.data
					//console.log(data)
					for (var i = 0; i < data.length; i++) {
						var obj = {}
						obj.value = data[i].name
						obj.laber = data[i].code
						this.options.push(obj)
					}
				})
			},
			//添加用户
			addDevice() {

				// for (let i = 0; i < this.getUser.length; i++) {
				// 	this.addUser(this.getUser[i])
				//       console.log(this.getUser[i])
				// }
				if (this.getUser.length != 0) {
					this.ajaxshow(0)
				}
			},
			ajaxshow(i) {
				if (i < this.getUser.length) {
					let json = {
						userName: this.getUser[i].num,
						name: this.getUser[i].name,
            password:'123456'
					}
					this.$axios.post('/u/user/add', json).then(res => {
						let data = res.data.data
						let that = this
						if (res.data.code == 0) {
							//this.issuccess = true
							this.$notify({
								title: res.data.message,
								message: '新增用户' + data.name + '成功',
								type: 'success'
							});
							this.isok++
							this.sureUser.push({
								name: this.getUser[i].name,
								num: this.getUser[i].num
							})
							setTimeout(() => {
								this.ajaxshow(i + 1)
							}, 200)

						} else {
							//this.issuccess = false
							this.$message.error({
								title: res.data.message,
								message: res.data.message,
								duration: 800
							});
							this.isnook++
							setTimeout(() => {
								this.ajaxshow(i + 1)
							}, 200)
						}
					})
				} else {
					this.innerVisible = false
					this.$bus.$emit('cidTable', true)
					this.$bus.$emit('brandtable_update', true)
					this.$message({
						dangerouslyUseHTMLString: true,
						showClose: true,
						message: '新增用户结束,共成功' + '<span style="color: blue;font-size: 16px;">' + this.isok + '</span>' + '个,' + '失败' +
							'<span style="color: red;font-size: 16px;">' + this.isnook + '</span>' + '个'+',请自行配置用户权限',
						duration: 30000
					});
					this.$bus.$emit('userTable_update', true)
				}

			},
			async addUser(data) {
				let addjson = {
					userName: data.num,
					name: data.name
				}
				//console.log(addjson)
				await this.$axios.post('/u/user/add', addjson).then(res => {
					//console.log(res.data.data)
					if (res.data.code == 0) {
						this.innerVisible = false
						this.$notify({
							title: res.data.message,
							message: '新增用户' + data.name + '成功',
							type: 'success'
						});
						this.dynamicTags = []
						this.getUser = []
						this.$bus.$emit('cidTable', true)
						this.$bus.$emit('brandtable_update', true)
						setTimeout(() => {
							this.$bus.$emit('userLook', {
								id: res.data.data.id,
								name: res.data.data.name,
								userName: res.data.data.userName
							})
						}, 1000)
						// this.$bus.$emit('userTable_update', true) //设备列表更新
					} else {
						this.$notify.error({
							title: '新增失败',
							message: res.data.message
						});
					}
				})
				// this.value = ''
				// setTimeout(function() {
				// 	bus.$emit('noLook', {
				// 	userCodes: this.dynamicTagsCode,
				// 	deviceCode: this.groupCode,
				// 	disciplineCode: this.disciplineCode,
				// 	disciplineName: this.value
				// })
				// }, 500)
			},
			getdeviceName(event) {
				//console.log(event)
				this.$bus.$emit('personsearch', event)
				// this.jsonData.deviceName = event
			},
			//删除右侧选中人员
			handleClose(tag) {
				this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
			},
			//获取区域列表树
			getdata() {
				this.data = []
				this.deptData(this.jsonData).then(res => {
					//console.log(res.data.data)
					this.updateTree = res.data.data.id
					this.data.push(res.data.data)
					let show = {
						name: res.data.data.label,
						code: res.data.data.code
					}
					//console.log(data);
					//bus.$emit('deviceTable', show)
				})

			},
			handleNodeClick(data) {
				let show = {
					name: data.label,
					code: data.code,
					isshow: this.isshow
				}
				this.jsonshow = show
				//console.log(data);
				this.$bus.$emit('deviceAddPerson', this.jsonshow)
			}
		},
		created() {
			this.getDeviceType()
			this.getdata()
			this.$bus.$on("userAdd", msg => {
				//console.log(msg)
				this.innerVisible = true
				this.groupCode = msg.areaCode
			});
			//选中的设备
			this.$bus.$on("devicelistChoose", msg => {
				//console.log(msg)
				//this.dynamicTags.push(msg.deviceName)
				this.dynamicTags = []
				this.dynamicTagsCode = []
				this.getUser = []
				//console.log(this.$refs.deviceshow.jsonData.pageNo)
				for (let i = 0; i < msg.length; i++) {
					let obj = {}
					this.dynamicTags.push(msg[i].personName)
					this.dynamicTagsCode.push(msg[i].personNum)
					obj.name = msg[i].personName
					obj.num = msg[i].personNum
					this.getUser.push(obj)
				}
			});
		}
	};
</script>
<style scoped>
	.el-form>>>.el-form-item__label {
		color: rgba(0, 0, 0, 1);
		font-weight: bold;
		width: 120px !important;
		font-size: 16px;
	}

	.el-form>>>.el-form-item__content {
		margin-left: 120px !important;
	}


	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}

	.input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}

	.el-dialog__wrapper>>>.el-dialog {
		min-width: 80% !important;
		min-height: 60% !important;
		overflow: unset !important;
		border-radius: 10px !important;
	}

	/* .neibu_dialog>>>.el-dialog {
		min-width: 60% !important;
	} */

	/* .neibu_dialog>>>.el-dialog__header {
		background-color: rgb(0, 180, 254);
		color: #FFFFFF;
		padding: 20px 20px;
		font-size: 18px !important;
	} */

	.neibu_dialog>>>.el-dialog__body {
		padding: 30px 0 !important;
	}

	.neibu_body_top {
		text-align: center;
		margin: 10px 20%;
	}

	.neibu_body_body {
		border-top: rgba(172, 172, 172, 1) 1px solid;
		border-bottom: rgba(172, 172, 172, 1) 1px solid;
	}

	.personTag {
		-webkit-appearance: none;
		background-color: #FFF;
		background-image: none;
		border-radius: 4px;
		border: 1px solid #DCDFE6;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		color: #606266;
		display: inline-block;
		font-size: inherit;
		outline: 0;
		padding: 0 15px;
		-webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
		transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
		width: 100%;
	}

	.personTag button {
		float: right;
		background-color: #00B3FD;
	}

	.deviceTJ {
		display: inline-block;
	}

	.left_tree {
		background-color: rgba(237, 237, 249, 1);
		padding: 12px 14px 0 14px;
	}

	.arealist {
		font-size: 16px;
		height: 50px;
		line-height: 50px;
		font-weight: bold;
		color: #000000;
	}

	.el-tree {
		background-color: rgba(48, 65, 82, 0.5);
		color: #FFFFFF;
	}

	.el-tree>>>.el-tree-node__expand-icon.is-leaf {
		color: transparent;
		cursor: default;
	}

	.el-tree>>>.el-tree-node__expand-icon {
		color: #FFFFFF
	}

	.el-tree::-webkit-scrollbar {
		width: 0;
	}

	.el-tree>>>.el-tree-node__content {
		background-color: rgba(48, 65, 82, 0.4) !important;
	}

	.el-tree>>>.el-tree-node__content:hover {
		/* border-radius: 5px; */
		background-color: rgba(48, 65, 82, 0.2) !important;
	}

	.el-tree>>>.el-tree-node.is-current>.el-tree-node__content {
		background-color: rgba(48, 65, 82, 0.4) !important;
		/* border-radius: 5px; */
		color: lightseagreen;
	}

	.el-tree>>>.el-tree-node__content:visited {
		background-color: rgb(0, 15, 70) !important;
	}

	.middle_table {
		background-color: #FFFFFF;
	}

	.ischoose {
		background-color: rgba(248, 248, 248, 1);
	}

	.deviceChoose {
		background-color: rgba(248, 248, 248, 1);
		text-align: center;
	}

	.chooseTitle {
		line-height: 21px;
		color: rgba(0, 180, 254, 1);
		font-weight: bold;
		margin: 0 0 20px 0;
	}

	.chooseList {
		margin: 0 5%;
	}

	/* .chooseList span {
		width: 100px;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		display: inline-block;
	} */
	.chooseList .el-tag__close {
		display: inline-block;
		width: 25px;
	}

	.el-tag+.el-tag[data-v-20309a38] {
		margin-left: 0;
	}

	.el-tag {
		margin: 5px 0;
		display: block;

	}
</style>
