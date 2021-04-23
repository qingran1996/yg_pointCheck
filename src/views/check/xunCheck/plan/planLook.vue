<template>
	<div class="pointPlan_look">
		<vxe-modal v-model="isshow" title="点检计划查看&详情" width="80%" min-width="600" min-height="300"
			:loading="submitLoading" resize destroy-on-close @close="closemodel">
			<template #default>
				<!-- <vxe-form :data="formData" :items="formItems" title-align="right" title-width="100"></vxe-form> -->
				<el-row :gutter="20">
					<el-col :span="12">
						<vxe-form :data="formData" title-align="right" title-width="100">
							<vxe-form-item title="计划名称" field="planName" span="24" :item-render="{}">
								<template #default="scope">
									<vxe-input v-model="formData.planName" disabled placeholder="" clearable>
									</vxe-input>
								</template>
							</vxe-form-item>
							<vxe-form-item title="点检车间" field="farm" span="12" :item-render="{}">
								<template #default="scope">
									<vxe-input v-model="formData.farm" disabled placeholder="" clearable></vxe-input>
								</template>
							</vxe-form-item>
							<vxe-form-item title="专业" field="discipline" span="12" :item-render="{}">
								<template #default="scope">
									<vxe-input v-model="formData.discipline" disabled placeholder="" clearable>
									</vxe-input>
								</template>
							</vxe-form-item>
							<vxe-form-item title="点检部门" field="dept" span="24" :item-render="{}">
								<template #default="scope">
									<vxe-input v-model="formData.dept" disabled placeholder="" clearable></vxe-input>
								</template>
							</vxe-form-item>
							<vxe-form-item title="点检人员" field="showAllperson" span="24" :item-render="{}">
								<template #default="scope">
									<div>
										<el-tag style="margin: 0 5px;" v-for="tag in persontags" :key="tag.name"
											:type="tag.type">
											{{tag.name}}
										</el-tag>
										<!-- <span v-show="persontags.length==0">- -</span> -->
										<vxe-input v-show="persontags.length==0" v-model="formData.person" disabled
											placeholder="" clearable></vxe-input>
									</div>
								</template>
							</vxe-form-item>
							<vxe-form-item title="计划起始时间" field="showDate" span="24" :item-render="{}">
								<template #default="scope">
									<el-date-picker v-model="formData.showDate" type="daterange" unlink-panels
										style="width: 100%;" disabled value-format="timestamp" range-separator="至"
										start-placeholder="开始日期" end-placeholder="结束日期">
									</el-date-picker>
								</template>
							</vxe-form-item>
							<vxe-form-item title="点检时间" field="checkTime" span="24" :item-render="{}">
								<template #default="scope">
									<vxe-input v-model="formData.checkTime" disabled placeholder="" clearable>
									</vxe-input>
								</template>
							</vxe-form-item>
							<vxe-form-item title="点检时长" field="checkHour" span="12" :item-render="{}">
								<template #default="scope">
									<vxe-input v-model="formData.checkHour" disabled placeholder="" clearable>
									</vxe-input>
								</template>
							</vxe-form-item>
							<vxe-form-item title="频次" field="week" span="12" :item-render="{}">
								<template #default="scope">
									<vxe-input v-model="formData.week" disabled placeholder="" clearable></vxe-input>
								</template>
							</vxe-form-item>
							<vxe-form-item title="状态" field="status" span="12" :item-render="{}">
								<template #default="scope">
									<vxe-input v-model="formData.status" disabled placeholder="" clearable></vxe-input>
								</template>
							</vxe-form-item>
						</vxe-form>
					</el-col>
					<el-col :span="6">
						<div style="font-weight: bold;color: orange;font-size: 16px;">点检区域</div>
						<div style="height: 300px;overflow-y: scroll;">
							<el-tree :data="areadata" show-checkbox node-key="id" ref="tree"
								:props="areadatadefaultProps" :default-checked-keys="areaupdateTree">
								<span slot-scope="{ node }" class="custom-tree-node">
									<el-tooltip class="item" effect="dark" :content="node.label" placement="right">
										<span>{{ node.label }}</span>
									</el-tooltip>
								</span>
							</el-tree>
						</div>
					</el-col>
					<el-col :span="6">
						<div style="font-weight: bold;color: orange;font-size: 16px;">任务列表</div>
						<div style="height: 300px;overflow-y: auto;">
							<ul class="list" v-infinite-scroll="load" infinite-scroll-disabled="disabled">
								<li v-for="(item,index) in currentPage" :key="index" class="list-item">
									<el-card shadow="always">
										<el-row :gutter="20">
											<el-col :span="24">
												<span>任务名: </span>
												<span class="showText" style="color: #20B2AA;">{{item.name}}</span>
											</el-col>
										</el-row>
										<el-row :gutter="20">
											<el-col :span="12">
												<div class="grid-content bg-purple">
													<span>点检人: </span>
													<span style="color: coral;"
														v-for="(itemA,indexA) in item.userNameList"
														:key="indexA">{{itemA}}</span>
												</div>
											</el-col>
											<el-col :span="12">
												<div class="grid-content bg-purple">
													<span>任务状态: </span>
													<span style="color: orange;" v-if="item.status==0">未完成</span>
													<span style="color: green;" v-else-if="item.status==1">完成</span>
													<span style="color: red;" v-else-if="item.status==2">任务取消</span>
													<span style="color: darkred;" v-else>漏检</span>
												</div>
											</el-col>
										</el-row>
										<el-row :gutter="20">
											<el-col :span="24">
												<span>计划开始时间: </span>
												<span class="showText"
													style="color: crimson;">{{formatDate(item.planStart)}}</span>
											</el-col>
										</el-row>
										<el-row :gutter="20">
											<el-col :span="24">
												<span>计划结束时间: </span>
												<span class="showText"
													style="color: crimson;">{{formatDate(item.planEnd)}}</span>
											</el-col>
										</el-row>
									</el-card>

								</li>
							</ul>
							<p v-if="loading" style="margin-top:10px;" class="loading">
								<span></span>
							</p>
							<p v-if="noMore" style="margin-top:10px;font-size:13px;color:#ccc">没有更多数据了</p>
						</div>
					</el-col>
				</el-row>
			</template>
		</vxe-modal>
	</div>
</template>

<script>
	export default {
		name: 'pointPlan_look',
		props: {
			//是否展示
			isshow: {
				type: Boolean,
				// 当为对象类型设置默认值时必须使用函数返回
				default: false
			},
			//id
			showPlanId: {
				type: Number,
				default: 0
			}
		},
		components: {},
		computed: {
			noMore() {
				return this.count >= this.totalPages - 1;
			},
			disabled() {
				return this.loading || this.noMore
			}
		},
		watch: {
			isshow(oldval, newval) {
				// console.log(newval)
				if (newval === false) {
					this.getLookData()
					this.count = 1
					this.getLookTask()
					// console.log(this.showPlanId)
				}
			},
			count(val) {
				const currentPage = this.list.slice((val - 1) * this.pageSize, val * this.pageSize)
				this.currentPage = [...this.currentPage, ...currentPage]
			}
		},
		data() {
			return {
				loading: false,
				submitLoading: false,
				areadata: [],
				areaupdateTree: [],
				areadatadefaultProps: {
					children: 'childArea',
					label: 'name'
				},
				persontags: [],
				formData: {
					planName: null,
					farm: null,
					dept: null,
					showAllperson: null,
					person: null,
					discipline: null,
					showDate: null,
					startDate: null,
					endDate: null,
					checkTime: null,
					week: null,
					checkHour: null,
					status: null,
					area: null
				},
				formItems: [],
				count: 1, //起始页0
				totalPages: "", //取后端返回内容的总页数
				currentPage: [], // 当前页数据
				pageSize: 10, // 每页数据条数
				list: [] //后端返回的数组
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
			load() {
				this.loading = true
				setTimeout(() => {
					// this.getLookTask()
					this.count += 1; //页数+1
				}, 2000)
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
			},
			getLookTask() {
				let json = {
					spotCheckPlanId: this.showPlanId,
					pageNo: this.count,
					pageSize: this.pageSize
				}
				this.pointPlanTaskData(json).then(res => {
					if (res.data.code === 0) {
						this.list = res.data.data.records // 接收所有返回数据
						console.log(res.data.data.records)
						this.totalPages = Math.ceil(this.list / this.pageSize) // 计算出totolPage
						this.currentPage = this.list.slice((this.count - 1) * this.pageSize, this.count * this
							.pageSize) // 第一页数据
						this.loading = false;
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})

			},
			getLookData() {
				let json = {
					spotCheckPlanId: this.showPlanId
				}
				this.pointPlanLook(json).then(res => {
					if (res.data.code === 0) {
						// console.log(res.data.data)
						this.submitLoading = true
						setTimeout(() => {
							this.submitLoading = false
							let data = res.data.data
							this.persontags = []
							if (data.userBoList != undefined) {
								for (let i = 0; i < data.userBoList.length; i++) {
									this.persontags.push({
										id: data.userBoList[i].userId,
										name: data.userBoList[i].userName,
										type: ''
									})
								}
							}
							let timeshow = []
							timeshow.push(data.planStart)
							timeshow.push(JSON.parse(data.planEnd + 1))
							this.formData = {
								planName: data.planName,
								farm: data.shopName,
								dept: data.deptName != undefined ? data.deptName : '- -',
								showAllperson: null,
								person: data.userBoList != undefined && data.userBoList.length != 0 ?
									data
									.userBoList[data.userBoList.length - 1].userName : '- -',
								discipline: data.lineName,
								showDate: timeshow,
								startDate: null,
								endDate: null,
								checkTime: data.timePoint,
								week: data.cycle + ' 天',
								checkHour: data.planLong + ' 小时',
								status: data.isActived,
								area: null
							}
							this.getArea(data.shopId)
							this.areaupdateTree = []
							this.$nextTick(() => {
								for (let i = 0; i < data.areaBoList.length; i++) {
									this.areaupdateTree.push(data.areaBoList[i].areaId)
								}
							})
						}, 500)

					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
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

	.list-item  {
		font-size: 12px;
		/* overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap; */
	}
</style>
