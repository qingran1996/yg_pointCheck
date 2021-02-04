<template>
	<div class="personTable">
		<el-table :data="tableData" ref="multipleTable" border :row-key="getRowKeys" v-loading="loading" :row-class-name="tableRowClassName"
		 style="width: 100%" :max-height="treeHeight" @selection-change="handleSelectionChange">
			<el-table-column type="selection" :reserve-selection="true" width="50" fixed>
			</el-table-column>
			<el-table-column prop="personName" min-width="180" align="center">
				<template slot-scope="scope" slot="header">
					<span class="table_headerfont">人员姓名</span>
				</template>
			</el-table-column>
			<el-table-column prop="personNum" min-width="180" align="center">
				<template slot-scope="scope" slot="header">
					<span class="table_headerfont">人员编号</span>
				</template>
			</el-table-column>
			<el-table-column prop="sex" min-width="180" align="center">
				<template slot-scope="scope" slot="header">
					<span class="table_headerfont">性别</span>
				</template>
			</el-table-column>
			<el-table-column prop="dept" show-overflow-tooltip label="部门" min-width="180" align="center">
				<template slot-scope="scope" slot="header">
					<span class="table_headerfont">部门</span>
				</template>
			</el-table-column>
			<el-table-column fixed="right" show-overflow-tooltip prop="phone" label="手机号" min-width="180" align="center">
				<template slot-scope="scope" slot="header">
					<span class="table_headerfont">手机号</span>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页器 -->
		<div class="block" style="margin-top:15px;">
			<el-pagination align='center' v-show="total!=0" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
			 :page-sizes="[10,15,20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!-- <div :key="index" v-for="(item,index) in selection">{{item.deviceName}}</div> -->
	</div>
</template>

<script>
	// import bus from "../../common/bus";
	export default {
		name: "personTable",
		components: {

		},
		data() {
			return {
				loading: false, //表格刷新
				treeHeight: document.body.clientHeight * 0.43 - 42,
				deviceadd_isshow: false,
				activeName: 'first',
				input_deviceName: '',
				rightContainerHeight: document.body.clientHeight - 71 - 82,
				deviceName: "设备列表查询",
				tableData: [],
				currentPage: 1, // 当前页码
				total: 0, // 总条数
				pageSize: 10, // 每页的数据条数
				jsonData: {
					orgCode: "0",
					pageNo: 1,
					pageSize: 10
				},
				listData: [],
				tablehave: [],
				pageTag: [1], //记录已经跑过的页面
				selection: []
			};
		},
		computed: {},
		methods: {
			handleSelectionChange(val) {
				this.selection = val
				//console.log(this.selection)
				this.$bus.$emit('devicelistChoose', this.selection)
			},
			getRowKeys(row) {
				return row.cid; // cid为列表数据的唯一标识
			},
			toggleSelection(rows) {
				if (rows) {
					rows.forEach(row => {
						this.$refs.multipleTable.toggleRowSelection(row);
					});
				} else {
					this.$refs.multipleTable.clearSelection();
				}
			},
			getTable() {
				this.personData(this.jsonData).then(res => {
					//console.log("设备列表请求")
					if (res.data.code == 0) { //查询到数据
						let data = res.data.data.content
						this.loading = true
						let that = this
						setTimeout(function() {
							if (data.length != 0) { //如果请求数据不为空
								that.total = res.data.data.totalElements //列表总数
								for (var i = 0; i < data.length; i++) {
									var obj = {};
									obj.cid = that.jsonData.pageNo * 10 - 10 + i + 1
									obj.personName = data[i].name
									obj.personNum = data[i].code
									if (data[i].sex == 1) {
										obj.sex = '男'
									} else {
										obj.sex = '女'
									}
									if (data[i].organization != null) {
										obj.dept = data[i].organization.name
									} else {
										obj.dept = ''
									}
									obj.phone = data[i].phone
									that.tableData.push(obj);
								}
							} else {
								that.tableData = []
								that.total = 0
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
			},
			showDate(val) {
				val = val + '';
				if (val.indexOf(this.input_deviceName) !== -1 && this.input_deviceName !== '') {
					return val.replace(this.input_deviceName, '<font color="#409EFF">' + this.input_deviceName + '</font>')
				} else {
					return val
				}
			},
			handleClick(tab, event) {
				//console.log(tab, event);
			},
			tableRowClassName({
				row,
				rowIndex
			}) {
				if (rowIndex % 2 === 1) {
					return 'warning-row';
				} else if (rowIndex % 2 === 0) {
					return 'success-row';
				}
				return '';
			},
			handleSizeChange(val) {
				//console.log(`每页 ${val} 条`);
				this.currentPage = 1;
				this.pageSize = val;
				this.jsonData.pageSize = val
				this.jsonData.pageNo = 1
				this.getTable()
			},
			handleCurrentChange(val) {
				//console.log(`当前页: ${val}`);
				this.currentPage = val;
				this.jsonData.pageNo = val
				this.getTable()
			}

		},
		mounted() {
			this.getTable() // 请求数据
		},
		created() {
			this.$bus.$on("deviceAddPerson", msg => {
				//console.log(msg)
				this.jsonData.orgCode = msg.code
				this.currentPage = 1
				this.jsonData.pageNo = 1
				this.getTable() //请求数据
			});

			this.$bus.$on("personsearch", msg => {
				//console.log(msg)
				this.jsonData.name = msg
				this.currentPage = 1
				this.jsonData.pageNo = 1
				this.getTable() //请求数据
			});
			this.$bus.$on("cidTable", msg => {
				//console.log(msg)
				this.$refs.multipleTable.clearSelection();
				this.selection = []
			});
		}
	};
</script>
<style scoped>
	/* .el-table>>>.warning-row {
		background: rgb(237, 237, 249);
	}

	.el-table>>>.success-row {
		background: rgb(246, 248, 255);
	} */

	.el-tabs>>>.el-tabs__item.is-active {
		color: white !important;
		background-color: rgb(0, 179, 253);
		border-radius: 4px;
		text-align: center;
		padding: 0;
		width: 150px;
	}

	.el-button--primary {
		background-color: rgb(0, 179, 253);
	}

	.el-button--primary.is-active,
	.el-button--primary:active {
		background-color: lightblue;
	}

	.table_headerfont {
		font-size: 16px;
		font-weight: bold;
		color: black;
		font-family: "arial black";
	}

	.action i {
		margin: 0 5px;
		cursor: pointer;
		color: deepskyblue;
	}

	.action i:hover {
		color: #0099CC;
	}

	.el-table>>>.el-table__fixed-right::before,
	.el-table__fixed::before {
		height: 0;
	}
</style>
