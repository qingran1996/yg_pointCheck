<template>
	<div class="editGoods">
		<vxe-modal v-model="goodsShow" title="添加相关物资" width="70%" min-width="600" height="70%" :loading="submitLoading"
			resize destroy-on-close @close="closemodel">
			<template #default>
				<el-row :gutter="20">
					<el-col :span="16">
						<el-card class="box-card" shadow="always">
							<el-form :inline="true" :model="goods" ref="goods" class="demo-form-inline">
								<el-form-item label="物资名称">
									<el-input v-model="goods.name" placeholder="请输入物资名称" clearable />
								</el-form-item>
								<el-form-item label="二级库">
									<el-select v-model="goods.twoLevel" placeholder="请选择二级库" clearable>
										<el-option v-for="item in twoLevel" :key="item.value" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item>
									<el-button v-prevent-re-click size="small" type="primary"
										@click="onSubmit('goods')">查询</el-button>
									<el-button v-prevent-re-click size="small" type="warning"
										@click="onreset('pointCheckPlan')">重置</el-button>
								</el-form-item>
							</el-form>
						</el-card>
						<el-card class="box-card" shadow="always">
							<el-table :data="goodsData" style="width: 100%" :max-height="tableHeight">
								<el-table-column prop="index" width="100" label="序号" align="center" fixed>
								</el-table-column>
								<el-table-column prop="name" label="物资名称" show-overflow-tooltip="">
								</el-table-column>
								<el-table-column prop="code" label="物资编码" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="specs" label="规格" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="twoLevel" label="二级库" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="shelves" label="货架号" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="address" label="位置" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="stock" label="库存" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="num" label="数量" show-overflow-tooltip>
								</el-table-column>
							</el-table>
							<!-- 分页器 -->
							<div class="block" style="margin-top:15px;">
								<el-pagination v-show="total!==0" align="center" :current-page="currentPage"
									:page-sizes="[5,10,20]" :page-size="pageSize"
									layout="total, sizes, prev, pager, next, jumper" :total="total"
									@size-change="handleSizeChange" @current-change="handleCurrentChange" />
							</div>
						</el-card>

					</el-col>
					<el-col :span="8">
						<el-card class="box-card" shadow="always">
							<div style="width: 100%;text-align: center;">
								<el-tag type="info">已选</el-tag>
							</div>
							<el-table :data="hasGoodsData" style="width: 100%">
								<el-table-column prop="name" label="物资名称" show-overflow-tooltip="">
								</el-table-column>
								<el-table-column prop="specs" label="规格" show-overflow-tooltip>
								</el-table-column>
								<el-table-column fixed="right" label="数量" align="center">
									<template slot-scope="scope">
										<div class="action">
											<vxe-input v-model="scope.row.num" type="integer" placeholder="数值类型">
											</vxe-input>
										</div>
									</template>
								</el-table-column>
							</el-table>
							<div style="width: 100%;text-align: center;margin: 10px 0;">
								<el-button v-prevent-re-click type="primary" plain>确认</el-button>
							</div>
						</el-card>

					</el-col>
				</el-row>

			</template>
		</vxe-modal>
	</div>
</template>

<script>
	export default {
		name: 'editGoods',
		props: {
			//是否展示
			goodsShow: {
				type: Boolean,
				// 当为对象类型设置默认值时必须使用函数返回
				required: true
			}
		},
		components: {},
		data() {
			return {
				loading: false,
				submitLoading: false,
				tableHeight: document.body.clientHeight * 0.35, // 表格高度
				currentPage: 1,
				pageSize: 10,
				totalPages: 0,
				total: 1,
				goodsData: [{
					index: 1,
					name: '我靠', // 物资名称
					code: 'sakdfsad', //物资编号
					specs: 'asd555222', //物资规格
					twoLevel: '大西瓜二级库asdsadasdasdsa', //物资二级库
					shelves: 'gh82', //物资货架号
					address: '你家里', //物资位置
					stock: 999999, //物资库存
					num: 621255, //物资数量
				}, {
					index: 1,
					name: '我靠', // 物资名称
					code: 'sakdfsad', //物资编号
					specs: 'asd555222', //物资规格
					twoLevel: '大西瓜二级库asdsadasdasdsa', //物资二级库
					shelves: 'gh82', //物资货架号
					address: '你家里', //物资位置
					stock: 999999, //物资库存
					num: 621255, //物资数量
				}, {
					index: 1,
					name: '我靠', // 物资名称
					code: 'sakdfsad', //物资编号
					specs: 'asd555222', //物资规格
					twoLevel: '大西瓜二级库asdsadasdasdsa', //物资二级库
					shelves: 'gh82', //物资货架号
					address: '你家里', //物资位置
					stock: 999999, //物资库存
					num: 621255, //物资数量
				}, {
					index: 1,
					name: '我靠', // 物资名称
					code: 'sakdfsad', //物资编号
					specs: 'asd555222', //物资规格
					twoLevel: '大西瓜二级库asdsadasdasdsa', //物资二级库
					shelves: 'gh82', //物资货架号
					address: '你家里', //物资位置
					stock: 999999, //物资库存
					num: 621255, //物资数量
				}, {
					index: 1,
					name: '我靠', // 物资名称
					code: 'sakdfsad', //物资编号
					specs: 'asd555222', //物资规格
					twoLevel: '大西瓜二级库asdsadasdasdsa', //物资二级库
					shelves: 'gh82', //物资货架号
					address: '你家里', //物资位置
					stock: 999999, //物资库存
					num: 621255, //物资数量
				}, {
					index: 1,
					name: '我靠', // 物资名称
					code: 'sakdfsad', //物资编号
					specs: 'asd555222', //物资规格
					twoLevel: '大西瓜二级库asdsadasdasdsa', //物资二级库
					shelves: 'gh82', //物资货架号
					address: '你家里', //物资位置
					stock: 999999, //物资库存
					num: 621255, //物资数量
				}, {
					index: 1,
					name: '我靠', // 物资名称
					code: 'sakdfsad', //物资编号
					specs: 'asd555222', //物资规格
					twoLevel: '大西瓜二级库asdsadasdasdsa', //物资二级库
					shelves: 'gh82', //物资货架号
					address: '你家里', //物资位置
					stock: 999999, //物资库存
					num: 621255, //物资数量
				}, {
					index: 1,
					name: '我靠', // 物资名称
					code: 'sakdfsad', //物资编号
					specs: 'asd555222', //物资规格
					twoLevel: '大西瓜二级库asdsadasdasdsa', //物资二级库
					shelves: 'gh82', //物资货架号
					address: '你家里', //物资位置
					stock: 999999, //物资库存
					num: 621255, //物资数量
				}, ],
				hasGoodsData: [], //已选的物资
				goods: {
					name: '',
					twoLevel: ''
				},
				twoLevel: [], //二级库选择
				jsonData: {
					pageNo: 1,
					pageSize: 10
				},
			}
		},
		computed: {},
		watch: {
			goodsShow(oldval, newval) {
				// console.log(newval)
				if (newval === false) {
					console.log('添加相关物资')
				}
			},
		},
		created() {

		},
		mounted() {
			// console.log(this.showPlanId)
			// this.getLookData()
		},
		methods: {
			//重置搜索条件
			onreset(formName) {
				// this.$refs[formName].resetFields();
				this.jsonData = {
					pageNo: 1,
					pageSize: 10
				}
				this.goods = {
					name: '',
					twoLevel: ''
				}
			},
			//顶部查询按钮 筛选信息
			onSubmit() {
				this.jsonData.pageNo = 1
				this.jsonData.pageSize = 10
				this.getTable()
			},
			//获取table数据
			getTable() {

			},
			closemodel() {
				// console.log('关闭对话框')
				this.$emit('goodsdialog', false)
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

</style>
