<template>
	<div class="overhaulPlan">
		<el-card class="box-card" shadow="always">
			<el-form :inline="true" :model="user" class="demo-form-inline">
				<el-form-item label="计划名称">
					<el-input v-model="user.planName" placeholder="请输入人员" @input="user_planName_show" clearable />
				</el-form-item>
				<el-form-item label="计划类型">
					<el-select v-model="user.planType" placeholder="请选择计划类型" @change="planType_change">
						<el-option v-for="item in planTypeData" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属条线">
					<el-select v-model="user.belongToWay" placeholder="请选择所属条线" @change="belongToWay_change">
						<el-option v-for="item in belongToWayData" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="user.state" placeholder="请选择状态" @change="state_change">
						<el-option v-for="item in stateData" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button v-prevent-re-click size="small" type="primary" @click="onSubmit(user)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="box-card" shadow="always">
			<el-row style="margin-bottom: 5px;">
				<el-button type="primary" @click="addRoute">新增</el-button>
				<el-button type="danger" @click="deleteRoute">删除</el-button>
			</el-row>
			<el-table v-loading="loading" :data="tableData" :row-key="getRowKeys" border style="width: 100%" :max-height="tableHeight">
				<!-- <el-table-column type="index" label="序号" width="100" align="center" /> -->
				<el-table-column prop="cid" width="100" label="序号" align="center" fixed>
				</el-table-column>
				<el-table-column prop="planName" show-overflow-tooltip label="计划名称" min-width="180" align="center" />
				<el-table-column prop="planType" show-overflow-tooltip label="计划类型" min-width="180" align="center" />
				<el-table-column prop="belongToWay" show-overflow-tooltip label="所属条线" min-width="180" align="center" />
				<el-table-column prop="dept" show-overflow-tooltip label="所属部门" min-width="180" align="center" />
				<el-table-column prop="startTime" show-overflow-tooltip label="开始日期" min-width="180" align="center" />
				<el-table-column prop="endTime" show-overflow-tooltip label="结束日期" min-width="180" align="center" />
				<el-table-column prop="state" show-overflow-tooltip label="状态" min-width="180" align="center" />
				<el-table-column fixed="right" label="操作" min-width="180" align="center">
					<template slot-scope="scope">
						<div class="action">
							<el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
    						<el-tag @click="updateList(scope.row)">编辑</el-tag>
    					</el-tooltip>
							<el-tooltip class="item" effect="dark" content="详情" placement="bottom">
								<el-tag @click="lookList(scope.row)">详情</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="检修项目" placement="bottom">
    						<el-tag @click="overhaulProject(scope.row)">检修项目</el-tag>
    					</el-tooltip>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页器 -->
			<div class="block" style="margin-top:15px;" v-show="showpage">
				<el-pagination v-show="total!==0" align="center" :current-page="currentPage" :page-sizes="[5,10,20]" :page-size="pageSize"
				 layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</div>
		</el-card>
	</div>
</template>

<script>
	export default {
		name: 'overhaulPlan',
		components: {},
		data() {
			return {
				// 筛选
				user: {
					name: '',
					username: '',
					planName: '',
					planType: '',
					belongToWay: '',
					state: '1'
				},
				loading: false,
				tableHeight: document.body.clientHeight - 84 - 36 - 50 - 152, // 表格高度
				currentPage: 1,
				pageSize: 10,
				totalPages: 0,
				total: 1,
				showpage: true,
				//展示参数表，并未实际应用
				tableData: [],
				planTypeData: [{
					value: '1',
					label: '部门1'
				}, {
					value: '2',
					label: '部门2'
				}],
				belongToWayData: [{
					value: '1',
					label: '路线1'
				}, {
					value: '2',
					label: '路线2'
				}],
				stateData: [{
					value: '1',
					label: '启用'
				}, {
					value: '2',
					label: '禁用'
				}],
				jsonData: {
					planName: '',
					planType: '',
					belongToWay: '',
					state: '',
					pageNo: 1,
					pageSize: 10
				},
			}
		},
		created() {

		},
		methods: {

			//计划名称
			user_planName_show(event) {
				this.jsonData.planName = event
			},
			//计划类型选择
			planType_change() {
				// this.jsonData.dept = ''
			},
			//所属条线选择
			belongToWay_change() {
				// this.jsonData.dept = event
			},
			//状态选择
			state_change() {

			},
			getRowKeys(row) {
				return row.cid; // cid为列表数据的唯一标识
			},
			addRoute() {

			},
			deleteRoute() {

			},
			updateList() {},
			lookList() {},
			overhaulProject() {},
			onSubmit(item) {
				console.log(123)
				// this.jsonData.pageNo = 1
				// this.jsonData.pageSize = 10
				// this.getTable()
			},
			handleSizeChange(val) {
				//console.log(`每页 ${val} 条`)
				this.currentPage = 1
				this.pageSize = val
				this.jsonData.pageSize = val
				this.jsonData.pageNo = 1
				// this.getTable()
			},
			handleCurrentChange(val) {
				//console.log(`当前页: ${val}`)
				this.currentPage = val
				this.jsonData.pageNo = val
				// this.getTable()
			},

		}
	}
</script>
<style scoped>
	.overhaulPlan {
		padding: 10px;
	}
</style>
