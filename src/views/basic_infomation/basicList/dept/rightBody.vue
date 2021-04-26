<template>
	<div class="dept_body">
		<el-card shadow="always">
			<el-form :inline="true" :model="device_model" class="demo-form-inline">
				<el-form-item label="设备名称">
					<el-input v-model="device_model.name" placeholder="请输入内容" @input="device_name_show" clearable />
				</el-form-item>
				<el-form-item label="设备位号">
					<el-input v-model="device_model.code" placeholder="请输入内容" @input="device_code_show" clearable />
				</el-form-item>
				<el-form-item label="设备类型">
					<el-popover placement="bottom" width="250" trigger="click" v-model="topPopoShow">
						<el-tree :highlight-current="true" :default-expand-all="false" :style="{maxHeight: 150+'px',overflowY: 'scroll',width: 220+'px'}"
						 :expand-on-click-node="true" :data="device_options" :filter-node-method="filterNode" @node-click="selectClassfy"
						 class="width-220 selectTree-input objectTree" ref="DeviceTypeTree"></el-tree>
						<div class="topPop">
							<el-button size="mini" type="text" @click="blankMsg">取消</el-button>
							<el-button type="primary" size="mini" @click="topPopoShow = false">确定</el-button>
						</div>
						<el-input v-model="device_model.deviceTypeArry" clearable @focus="showtree" placeholder="类型选择" slot="reference" />
					</el-popover>

				</el-form-item>

				<el-form-item>
					<el-button v-prevent-re-click size="small" type="primary" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card shadow="always">
			<el-row style="margin-bottom: 5px;">
				<el-button type="primary" @click="addlist">新增</el-button>
				<!--        <el-button type="danger" @click="deleteItems" :disabled="isDeleteAll">批量删除</el-button>-->
				<el-button type="danger" @click="deletePlan">删除</el-button>
				<!-- <div id="qrcode" :ref="'qrcode_'+1"></div> -->
			</el-row>
			<vxe-table border highlight-hover-row highlight-current-row resizable :align="'center'" ref="xTree" row-id="id"
			 :menu-config="{body: {options: bodyMenus}, visibleMethod}" :max-height="tableHeight" :tree-config="{lazy: true, children: 'children', hasChild: 'hasChild', loadMethod: loadChildrenMethod}"
			 :empty-render="{name: 'NotData'}" :data="tableData" @menu-click="contextMenuClickEvent">
				<vxe-table-column width="100" tree-node fixed="left"></vxe-table-column>
				<vxe-table-column field="id" title="序号" width="200" show-overflow></vxe-table-column>
				<vxe-table-column field="name" title="Name" width="200" show-overflow></vxe-table-column>
				<vxe-table-column field="size" title="Size" width="200" show-overflow></vxe-table-column>
				<vxe-table-column field="type" title="Type" width="200" show-overflow></vxe-table-column>
				<vxe-table-column field="date" title="Date" width="200" show-overflow></vxe-table-column>
				<vxe-table-column title="操作" fixed="right" width="200">
					<template v-slot>
						<vxe-button type="text">按钮1</vxe-button>
						<vxe-button type="text">按钮2</vxe-button>
					</template>
				</vxe-table-column>
				<!-- <template v-slot:empty>
					<span style="color: red;">
						<img src="https://xuliangzhan_admin.gitee.io/vxe-table/static/other/img1.gif">
						<p>不用再看了，没有更多数据了！</p>
					</span>
				</template> -->
			</vxe-table>
		</el-card>
	</div>
</template>

<script>
	export default {
		name: 'deptBody',
		components: {},
		data() {

			return {
				topPopoShow: false,
				tableHeight: document.body.clientHeight - 84 - 36 - 50 - 180, // 表格高度
				jsonData: {
					orgCode: "0"
				},
				tableData: [{ id: 1000, name: 'vxe-table 从入门到放弃1', type: 'mp3', size: 1024, date: '2020-08-01' },
                { id: 1005, name: 'Test2', type: 'mp4', size: null, date: '2021-04-01', hasChild: true },
                { id: 23666, name: 'Test23', type: 'mp4', size: null, date: '2021-01-02', hasChild: true },
                { id: 24555, name: 'vxe-table 从入门到放弃9', type: 'avi', size: 224, date: '2020-10-01' }],
				bodyMenus: [
					[{
							code: 'clearLoaded',
							name: '清除加载状态',
							disabled: false
						},
						{
							code: 'reloadNodes',
							name: '重新加载子节点',
							disabled: false
						},
						{
							code: 'expand',
							name: '展开节点',
							disabled: false
						},
						{
							code: 'contract',
							name: '收起节点',
							disabled: false
						}
					]
				],
				// 筛选
				device_model: {
					name: '',
					code: '',
					deviceType: '',
					radio: '全部',
					deviceTypeArry: ''
				},
				//设备类型
				device_options: [{
					value: '1',
					label: '炉管'
				}, {
					value: '2',
					label: '罐类'
				}]
			}
		},
		created() {
			// this.getTable() //获取table数据
		},
		mounted() {

		},
		destroyed() {},
		watch: {},
		methods: {
			loadChildrenMethod({
				row
			}) {
				// 异步加载子节点
				return new Promise(resolve => {
					setTimeout(() => {
						const childs = [{
								id: row.id + 100000,
								name: row.name + 'Test45',
								type: 'mp4',
								size: null,
								date: '2021-10-03',
								hasChild: true
							},
							{
								id: row.id + 150000,
								name: row.name + 'Test56',
								type: 'mp3',
								size: null,
								date: '2021-07-09',
								hasChild: false
							}
						]
						resolve(childs)
					}, 500)
				})
			},

			visibleMethod({
				row,
				type
			}) {
				let xTree = this.$refs.xTree
				if (type === 'body') {
					this.bodyMenus.forEach(list => {
						list.forEach(item => {
							if (['clearLoaded', 'reloadNodes'].includes(item.code)) {
								item.disabled = !row.hasChild || !xTree.isTreeExpandLoaded(row)
							} else if (['expand', 'contract'].includes(item.code)) {
								if (row.hasChild) {
									let isExpand = xTree.isTreeExpandByRow(row)
									item.disabled = ['expand'].includes(item.code) ? isExpand : !isExpand
								} else {
									item.disabled = true
								}
							}
						})
					})
				}
				return true
			},
			contextMenuClickEvent({
				menu,
				row,
				column
			}) {
				let xTree = this.$refs.xTree
				switch (menu.code) {
					case 'clearLoaded':
						xTree.clearTreeExpandLoaded(row)
						break
					case 'reloadNodes':
						xTree.reloadTreeChilds(row)
						break
					case 'expand':
						xTree.setTreeExpand(row, true)
						break
					case 'contract':
						xTree.setTreeExpand(row, false)
						break
				}
			},
			/*****************/
			//搜索框-设备类型tree
			filterNode(value, data) {
				if (!value) return true
				return data.label.indexOf(value) !== -1
			},
			getTable() {
				this.deptData(this.jsonData).then(res => {
					if (res.data.code === 200) { //查询到数据
						//console.log(res)
						let data = res.data.data
						console.log('部门列表table', data)
					} else {
						this.$notify.error({
							title: '请求失败',
							message: res.data.message
						})
						this.tableData = []
					}

				})

			},
			device_name_show() {

			},
			device_code_show() {

			},
			showtree() {

			},
			selectClassfy() {

			},
			blankMsg() {

			},
			addlist() {

			},
			deletePlan() {

			},
			onSubmit() {

			}
		}
	}
</script>
<style scoped>
	.dept_body {
		padding: 10px;
	}

	@page {
		size: auto;
		/* auto is the initial value */
		margin: 0;
		/* this affects the margin in the printer settings */
	}

	html {
		background-color: #FFFFFF;
		margin: 0;
		/* this affects the margin on the html before sending to printer */
	}

	body {
		border: solid 1px #242424;
		margin: 0mm 15mm 10mm 15mm;
		/* margin you want for the content */
	}

	.topPop {
		margin-top: 15px;
		display: flex;
		justify-content: flex-end;
	}
</style>
