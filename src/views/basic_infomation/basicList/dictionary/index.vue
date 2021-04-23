<template>
	<div class="dictionary">
		<el-card shadow="always">
			<el-form :inline="true" :model="dictionary" ref="dictionary" class="demo-form-inline">
				<el-form-item label="部门">
					<el-input v-model="dictionary.dept" placeholder="请输入内容" clearable />
				</el-form-item>
				<el-form-item>
					<el-button v-prevent-re-click size="small" type="primary" @click="onSubmit">查询</el-button>
					<el-button v-prevent-re-click size="small" type="warning" @click="onreset('dictionary')">重置
					</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card shadow="always">
			<el-row style="margin-bottom: 5px;">
				<el-button type="primary" @click="addlist">新增</el-button>
			</el-row>
			<!-- <el-table v-loading="loading" ref="multipleTable" :data="tableData" border style="width: 100%"
				:max-height="tableHeight"  :row-key="getRowKeys">
				<el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
				<el-table-column prop="index" label="序号" width="100" align="center" />
				<el-table-column prop="name" label="名称" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="code" label="编码" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column fixed="right" label="操作" min-width="80" align="center">
					<template v-slot="scope">
						<div class="action">
							<el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
								<el-tag @click.prevent="updateList(scope.row)">编辑</el-tag>
							</el-tooltip>
						</div>
					</template>
				</el-table-column>
			</el-table> -->
			<vxe-table border round show-overflow highlight-hover-row highlight-current-row highlight-hover-column
				highlight-current-column resizable ref="xTree" row-id="id"
				:tree-config="{lazy: true, accordion: true, children: 'childDicts', hasChild: 'hasChild', loadMethod: loadChildrenMethod}"
				:data="tableData" :max-height="tableHeight">
				<vxe-table-column field="index" title="序号" align="center" width="100" tree-node></vxe-table-column>
				<vxe-table-column field="son" min-width="180" align="center" title="名称"></vxe-table-column>
				<vxe-table-column field="code" min-width="180" align="center" title="编号"></vxe-table-column>
				<vxe-table-column field="" title="操作" align="center" min-width="140" fixed="right">
					<template slot-scope="scope">
						<div class="action" style="cursor: pointer;">
							<el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
								<el-tag @click="updateList(scope.row)">编辑</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="删除" placement="bottom">
								<el-tag type="danger" @click="deleteList(scope.row)">删除</el-tag>
							</el-tooltip>
						</div>
					</template>
				</vxe-table-column>
			</vxe-table>
			<!-- 分页器 -->
			<div class="block" style="margin-top:15px;" v-show="showpage">
				<el-pagination v-show="total!==0" align="center" :current-page="currentPage" :page-sizes="[5,10,20]"
					:page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
					@size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</div>
		</el-card>
	</div>
</template>

<script>
	export default {
		name: 'dictionary',
		components: {},
		data() {
			return {
				loading: false,
				tableHeight: document.body.clientHeight - 84 - 36 - 50 - 180, // 表格高度
				tableData: [],
				currentPage: 1,
				pageSize: 10,
				totalPages: 0,
				total: 1,
				showpage: true,
				// 筛选
				dictionary: {
					dept: '',
					area: '',
					device: ''
				},
				jsonData: {
					pcode: null,
					pageNo: 1,
					pageSize: 10
				}
			}
		},
		created() {
			this.getTable() //获取table数据
		},
		methods: {
			addlist () {
				
			},
			updateList (item) {
				console.log(item)
			},
			deleteList (item) {
				console.log(item)
			},
			getRowKeys(row) {
				return row.index
			},
			//点击展开
			loadChildrenMethod({
				row
			}) {
				// 异步加载子节点
				return new Promise(resolve => {
					console.log(row)
					setTimeout(() => {
						let child = []
						let data = row.children
						for (let i = 0; i < data.length; i++) {
							var obj = {}
							var j = i + 1
							// obj.id = data[i].id
							obj.index = row.index + '.' + j
							obj.id = data[i].id
							obj.farther = data[i].son
							obj.son = data[i].name
							obj.code = data[i].code
							child.push(obj)
						}
						resolve(child)
					}, 500)
				})
			},
			//获取table数据
			getTable() {
				this.dictionaryData(this.jsonData).then(res => {
					if (res.data.code === 0) { //查询到数据
						//console.log(res)
						let data = res.data.data.records
						console.log('数据字典列表查询', data)
						this.numberPage = res.data.data.current
						//console.log('当前页数数据数量', this.numberPage)
						this.loading = true
						let that = this
						setTimeout(function() {
							if (data.length !== 0) { //如果请求数据不为空
								that.total = res.data.data.total //列表总数
								
								for (var i = 0; i < data.length; i++) {
									that.tableData.push({
										index: that.jsonData.pageNo * that.jsonData.pageSize - that.jsonData.pageSize + i + 1,
										id: data[i].id,
										hasChild: data[i].childDicts != [] ? true : false,
										farther: '- -',
										son: data[i].name,
										code: data[i].code,
										children: data[i].childDicts
									})
								}
								// that.tableData = data
								// that.tableData['index'] = that.jsonData.pageNo * that.jsonData.pageSize - that.jsonData.pageSize + i + 1
							} else {
								that.tableData = []
								that.total = 0
							}
							that.loading = false //要执行的事件
						}, 500) //500代表延迟毫秒值
						this.tableData = [] //每次默认置空
					} else {
						this.$notify.error({
							title: '请求失败',
							message: res.data.message
						})
						this.tableData = []
					}
			
				})
			},
			onSubmit () {
				this.jsonData.pageNo = 1
				this.jsonData.pageSize = 10
				this.getTable()
			},
			//重置搜索条件
			onreset(formName) {
				// this.$refs[formName].resetFields();
				this.jsonData = {
					orgCode: '',
					areaCode: '',
					equipCode: '',
					pageNo: 1,
					pageSize: 10
				}
				this.dictionary = {
					dept: '',
					area: '',
					device: ''
				}
			},
			handleSizeChange(val) {
				//console.log(`每页 ${val} 条`)
				this.currentPage = 1
				this.pageSize = val
				this.jsonData.pageSize = val
				this.jsonData.pageNo = 1
				this.getTable()
			},
			handleCurrentChange(val) {
				//console.log(`当前页: ${val}`)
				this.currentPage = val
				this.jsonData.pageNo = val
				this.getTable()
			},
			
		}
	}
</script>
<style scoped>
	.dictionary {
		padding: 10px;
	}
</style>
