<template>
	<div class="xunCheckPlan">
		<el-card shadow="always">
			<el-form :inline="true" ref="pointCheckPlan" :model="pointCheckPlan" class="demo-form-inline">
				<el-form-item label="车间">
					<el-popover placement="right" trigger="click" v-model="isFarmshow">
						<div style="height: 200px;overflow-y: scroll;">
							<el-tree :data="farmList" accordion show-checkbox check-strictly
								:expand-on-click-node="false" :props="farmdefaultProps" ref="treeForm" node-key="id"
								@check-change="farm_change">
								<span slot-scope="{ node }" class="custom-tree-node">
									<el-tooltip class="item" effect="dark" :content="node.label" placement="right">
										<span>{{ node.label }}</span>
									</el-tooltip>
								</span>
							</el-tree>
						</div>
						<el-input slot="reference" v-model="pointCheckPlan.farm" placeholder="请选择车间"></el-input>
					</el-popover>
				</el-form-item>
				<el-form-item label="部门选择">
					<el-popover placement="right" width="400" trigger="click" :trigger="checkpointDept?'click':'manual'"
						v-model="isdeptshow">
						<div style="height: 200px;overflow-y: scroll;">
							<el-tree :data="deptList" accordion :default-expanded-keys="updateTree"
								:expand-on-click-node="false" :props="defaultProps" @node-click="searchDeptClick">
							</el-tree>
						</div>
						<vxe-input slot="reference" :disabled="!checkpointDept" v-model="pointCheckPlan.dept"
							placeholder="请选择部门" clearable>
						</vxe-input>
					</el-popover>
				</el-form-item>
				<el-form-item label="专业">
					<el-select v-model="pointCheckPlan.discipline" placeholder="请选择专业" @change="discipline_change">
						<el-option v-for="item in disciplineData" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="点检部门">
					<el-select v-model="pointCheckPlan.pointDept" placeholder="请选择部门" @change="pointDept_change">
						<el-option v-for="item in pointDeptData" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item> -->
				<!-- <el-form-item label="点检负责人">
					<el-input v-model="pointCheckPlan.person" placeholder="请输入人员" @input="pointCheckPlan_person_show"
						clearable />
				</el-form-item> -->
				<el-form-item label="时间范围">
					<!-- <el-input v-model="pointCheckPlan.timeshow" placeholder="请输入人员" @input="pointCheckPlan_person_show" clearable /> -->
					<el-date-picker v-model="pointCheckPlan.timeshow" type="daterange" unlink-panels range-separator="至"
						start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp"
						@change="timeshow_change">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="pointCheckPlan.status" placeholder="" @change="pointStatus_change">
						<el-option v-for="item in pointStatusData" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button v-prevent-re-click size="small" type="primary" @click="onSubmit">查询</el-button>
					<el-button v-prevent-re-click size="small" type="warning" @click="onreset('pointCheckPlan')">重置
					</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card shadow="always">
			<el-row style="margin-bottom: 5px;">
				<el-button type="primary" @click="addlist">新增</el-button>
				<!-- <el-button type="danger" @click="deleteItems" :disabled="isDeleteAll">批量删除</el-button>
				<el-button type="success" @click="addmore" :disabled="isDeleteAll">批量导入</el-button> -->
				<!-- <div id="qrcode" :ref="'qrcode_'+1"></div> -->
			</el-row>
			<el-table v-loading="loading" ref="multipleTable" :data="tableData" border style="width: 100%"
				:max-height="tableHeight" @selection-change="selectionchange" :row-key="getRowKeys">
				<el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
				<el-table-column prop="index" label="序号" width="100" align="center" />
				<el-table-column prop="creater" label="创建者" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="dept" label="部门" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="farm" label="车间" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="discipline" label="专业" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="planname" label="计划名称" min-width="180" align="center" show-overflow-tooltip />

				<!-- <el-table-column prop="pointdept" label="点检部门" min-width="180" align="center" show-overflow-tooltip /> -->
				<!-- <el-table-column prop="person" label="点检负责人" min-width="180" align="center" show-overflow-tooltip /> -->
				<el-table-column prop="startTime" label="开始日期" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="endTime" label="结束日期" min-width="180" align="center" show-overflow-tooltip />
				<!-- <el-table-column prop="week" label="周期" min-width="180" align="center" show-overflow-tooltip />
				<el-table-column prop="hour" label="点检时长(h)" min-width="180" align="center" show-overflow-tooltip /> -->
				<el-table-column prop="state" label="启用状态" min-width="180" align="center" />
				<el-table-column fixed="right" label="操作" min-width="260" align="center">
					<template v-slot="scope">
						<div class="action">
							<el-tooltip class="item" effect="dark" content="编辑" placement="bottom"
								:open-delay="otherTooltipDelay">
								<el-tag @click.prevent="updateList(scope.row)">编辑</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="详情" placement="bottom"
								:open-delay="otherTooltipDelay">
								<el-tag @click="lookList(scope.row)" type="warning">详情</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="删除" placement="bottom"
								:open-delay="otherTooltipDelay">
								<el-tag type="danger" @click="deleteList(scope.row)">删除</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="手动激活" placement="bottom"
								:open-delay="otherTooltipDelay">
								<el-tag type="success" @click="bego(scope.row)">手动激活</el-tag>
								<!-- <vxe-switch v-model="scope.row.bego" @change="bego(scope.row)" :open-value="true" :close-value="false"
									open-label="激活" close-label="未激活"></vxe-switch> -->
							</el-tooltip>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<vxe-modal v-model="showEdit" :title="selectRow ? '巡检计划编辑&保存' : '巡检计划新增&保存'" width="60%" min-width="600"
				height="50%" :loading="submitLoading" resize destroy-on-close @close="closemodel">
				<template #default>
					<el-row :gutter="20">
						<el-col :span="18">
							<vxe-form :data="formData" :rules="formRules" title-colon title-align="right"
								title-width="150" ref="xForm" @submit="submitEvent">
								<vxe-form-item title="计划名称" field="planName" span="24" :item-render="{}">
									<template #default="scope">
										<!-- <vxe-input v-model="formData.planName" @input="$refs.xForm.updateStatus(scope)"
											placeholder="请输入计划名称" clearable></vxe-input> -->
											<vxe-input v-model="formData.planName" @input="planshow(scope)"
												placeholder="请输入计划名称" clearable></vxe-input>
									</template>
								</vxe-form-item>
								<vxe-form-item title="巡检车间" field="farm" span="12" :item-render="{}">
									<template #default="scope">
										<el-popover placement="right" trigger="click">
											<div style="height: 200px;overflow-y: scroll;">
												<el-tree :data="farmList" accordion show-checkbox check-strictly
													:expand-on-click-node="false" :props="farmdefaultProps"
													ref="treeForm" node-key="id" @check-change="farmhandleNodeClick">
													<span slot-scope="{ node }" class="custom-tree-node">
														<el-tooltip class="item" effect="dark" :content="node.label"
															placement="right">
															<span>{{ node.label }}</span>
														</el-tooltip>
													</span>
												</el-tree>
											</div>
											<el-input slot="reference" v-model="formData.farm"
												@input="$refs.xForm.updateStatus(scope)" placeholder="请选择车间"></el-input>
										</el-popover>
									</template>
								</vxe-form-item>
								<vxe-form-item title="专业" field="discipline" span="12" :item-render="{}">
									<template #default="scope">
										<vxe-select v-model="formData.discipline"
											@change="$refs.xForm.updateStatus(scope)" placeholder="请选择专业" clearable>
											<vxe-option v-for="item in disciplineData" :key="item.value"
												:value="item.value" :label="item.label">
											</vxe-option>
										</vxe-select>
									</template>
								</vxe-form-item>
								<vxe-form-item :title="changePD?'巡检部门':'巡检人员'" :field="changePD?'dept':'person'"
									span="24" :item-render="{}">
									<template #default="scope">
										<div style="display: flex;">
											<!-- <vxe-input v-show="!changePD" v-model="formData.person" :disabled="farmshow"
												@input="$refs.xForm.updateStatus(scope)" placeholder="请输入内容" clearable>
											</vxe-input> -->
											<el-autocomplete style="width: 300px;" v-show="!changePD"
												v-model="formData.person" :fetch-suggestions="querySearchPerson"
												:trigger-on-focus="true" placeholder="请输入人员"
												@select="handleSelectPerson">
												<template slot-scope="{ item }">
													<div class="name" style="display: inline-block;color: #000000;">
														{{ item.name }}
													</div>
													<div class="name" style="display: inline-block;float: right;"><i
															class="el-icon-phone"
															style="margin-left: 10px;color: orange;"></i>{{ item.phoneNumber }}
													</div>
													<div class="dept" style="color: lightseagreen;"
														:title="item.orgName">
														部门： {{ item.orgName }}
													</div>
												</template>
											</el-autocomplete>
											<el-popover v-show="changePD" placement="right"
												:trigger="checkdeptshow?'click':'manual'" v-model="isdeptshow1">
												<div style="height: 200px;overflow-y: scroll;">
													<el-tree :data="deptList" accordion
														:default-expanded-keys="updateTree"
														:expand-on-click-node="false" :props="defaultProps"
														@node-click="handleNodeClick">
														<span slot-scope="{ node }" class="custom-tree-node">
															<el-tooltip class="item" effect="dark" :content="node.label"
																placement="right">
																<span>{{ node.label }}</span>
															</el-tooltip>
														</span>
													</el-tree>
												</div>
												<!-- <vxe-input slot="reference" v-model="formData.dept"
													@input="$refs.xForm.updateStatus(scope)" :disabled="!checkdeptshow"
													placeholder="请选择部门" clearable>
												</vxe-input> -->
												<el-input style="width: 300px;" slot="reference" v-model="formData.dept"
													@input="$refs.xForm.updateStatus(scope)" placeholder="请选择部门">
												</el-input>
											</el-popover>
											<vxe-switch v-model="changePD" :open-value="true" :close-value="false"
												open-label="切换人员" close-label="切换部门"></vxe-switch>
										</div>

									</template>
								</vxe-form-item>
								<vxe-form-item v-if="!changePD&&persontags.length!=0" title="已选人员" field="showAllperson"
									span="24" :item-render="{}">
									<template #default="scope">
										<!-- <div v-for="(item,index) in persontags" :key="index" @click="handleClose(item)">{{item.name}}</div> -->
										<div>
											<el-tag style="margin: 0 5px;" v-for="tag in persontags" :key="tag.name"
												closable :type="tag.type" @close="handleClose(tag)">
												{{tag.name}}
											</el-tag>
										</div>
									</template>
								</vxe-form-item>
								<!-- <vxe-form-item title="点检部门" field="dept" span="12" :item-render="{}">
									<template #default="scope">
										<el-popover placement="right" width="400"
											:trigger="checkdeptshow?'click':'manual'" v-model="isdeptshow1">
											<div style="height: 200px;overflow-y: scroll;">
												<el-tree :data="deptList" accordion :default-expanded-keys="updateTree"
													:expand-on-click-node="false" :props="defaultProps"
													@node-click="handleNodeClick">
												</el-tree>
											</div>
											<vxe-input slot="reference" v-model="formData.dept"
												@input="$refs.xForm.updateStatus(scope)" :disabled="!checkdeptshow"
												placeholder="请选择部门" clearable>
											</vxe-input>
										</el-popover>
									</template>
								</vxe-form-item> -->
								<vxe-form-item title="计划起始时间" field="showDate" span="24" :item-render="{}">
									<template #default="scope">
										<el-date-picker v-model="formData.showDate" type="daterange" unlink-panels
											style="width: 100%;" @change="showDate_change(scope)"
											value-format="timestamp" range-separator="至" start-placeholder="开始日期"
											end-placeholder="结束日期">
										</el-date-picker>
									</template>
								</vxe-form-item>
								<!-- <vxe-form-item title="计划开始时间" field="startDate" span="12" :item-render="{}">
									<template #default>
										<vxe-input @change="startDate_show" v-model="formData.startDate"
											:disabled-method="disabledDateMethod" placeholder="日期和时间选择" type="datetime"
											transfer></vxe-input>
									</template>
								</vxe-form-item>
								<vxe-form-item title="计划结束时间" field="endDate" span="12" :item-render="{}">
									<template #default>
										<vxe-input @change="endDate_show" v-model="formData.endDate"
											placeholder="日期和时间选择" :disabled-method="disabledDateMethodEnd"
											type="datetime" transfer></vxe-input>
									</template>
								</vxe-form-item> -->

								<vxe-form-item title="点检时间" field="checkTime" span="24" :item-render="{}">
									<!-- <template #default="scope">
										<vxe-input v-model="formData.checkTime" @input="$refs.xForm.updateStatus(scope)"
											placeholder="请输入点检时间" clearable></vxe-input>
									</template> -->
									<!-- <el-popover placement="right" width="400" trigger="click">
										<div class="my-dropdown4">
											<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
												@change="handleCheckAllChange">全选</el-checkbox>
											<div style="margin: 15px 0;"></div>
											<el-checkbox-group v-model="checkedCities"
												@change="handleCheckedCitiesChange">
												<el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}
												</el-checkbox>
											</el-checkbox-group>
										</div>

										<el-input slot="reference" v-model="formData.checkTime"
											@input="$refs.xForm.updateStatus(scope)" placeholder="请选择点检时间">
										</el-input>
									</el-popover> -->
									<vxe-pulldown ref="xDown4" transfer>
										<template #default>
											<el-input style="width: 220px;" slot="reference"
												v-model="formData.checkTime" @focus="focusEvent2"
												@input="$refs.xForm.updateStatus(scope)" placeholder="请选择巡检时间">
											</el-input>
										</template>
										<template #dropdown>
											<div class="my-dropdown4" style="width: 200px;margin: 0 10px;">
												<div style="margin: 15px 0;"></div>
												<el-checkbox-group v-model="checkedCities"
													@change="handleCheckedCitiesChange">
													<el-checkbox v-for="city in cities" :label="city" :key="city">
														{{city}}
													</el-checkbox>
												</el-checkbox-group>
											</div>
										</template>
									</vxe-pulldown>
								</vxe-form-item>
								<vxe-form-item title="巡检时长" field="checkHour" span="12" :item-render="{}">
									<template #default="scope">
										<vxe-input v-model="formData.checkHour" placeholder="请选择巡检时长(小时),为数字"
											@input="$refs.xForm.updateStatus(scope)" type="number" min="0" clearable>
										</vxe-input>
									</template>
								</vxe-form-item>
								<vxe-form-item title="频次" field="week" span="12" :item-render="{}">
									<template #default="scope">
										<vxe-input v-model="formData.week" placeholder="请选择频次(天),为数字"
											@input="$refs.xForm.updateStatus(scope)" type="number" min="0" clearable>
										</vxe-input>
									</template>
								</vxe-form-item>
								<vxe-form-item title="状态" field="status" span="12" :item-render="{}">
									<template #default="scope">
										<vxe-select v-model="formData.status" @change="$refs.xForm.updateStatus(scope)"
											placeholder="请选择状态" clearable>
											<vxe-option v-for="item in pointStatusData" :key="item.value"
												:value="item.value" :label="item.label">
											</vxe-option>
										</vxe-select>
									</template>
								</vxe-form-item>
								<!-- <vxe-form-item title="点检区域" field="area" span="12" :item-render="{}">
										<template #default="scope">
											<vxe-select v-model="formData.area" @change="$refs.xForm.updateStatus(scope)"
												placeholder="请选择" multiple>
												<vxe-option v-for="item in areaData" :key="item.value" :value="item.value"
													:label="item.label"></vxe-option>
											</vxe-select>
										</template>
									</vxe-form-item> -->
								<vxe-form-item class="bottomShow" align="right" span="24" :item-render="{}">
									<template #default>
										<vxe-button type="submit" status="primary">确定</vxe-button>
										<vxe-button type="reset">重置</vxe-button>
									</template>
								</vxe-form-item>
							</vxe-form>
						</el-col>
						<el-col :span="6">
							<div style="font-weight: bold;color: orange;font-size: 16px;">巡检区域</div>
							<div style="height: 300px;overflow-y: scroll;">
								<el-tree :data="areadata" show-checkbox node-key="id" ref="tree"
									:props="areadatadefaultProps" @check="areacheck"
									:default-checked-keys="areaupdateTree">
									<span slot-scope="{ node }" class="custom-tree-node">
										<el-tooltip class="item" effect="dark" :content="node.label" placement="right">
											<span>{{ node.label }}</span>
										</el-tooltip>
									</span>
								</el-tree>
							</div>
						</el-col>
					</el-row>
				</template>
			</vxe-modal>
			<!-- 分页器 -->
			<div class="block" style="margin-top:15px;">
				<el-pagination v-show="total!==0" align="center" :current-page="currentPage" :page-sizes="[10,15,20]"
					:page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
					@size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</div>
		</el-card>
		<planLook :isshow="lookType" :showPlanId="lookId" @closedialog="closedialog"></planLook>
		<!--编辑/更新dialog-->
		<!-- <Editdialog/> -->
		<!-- 设备详情接口 -->
		<!-- <deviceDetaildialog/> -->
		<!-- 尝试性打印   -->
		<!--    <div ref="printText" v-show="false"></div>-->
	</div>
</template>

<script>
	import planLook from './planLook.vue'
	// import deviceDetaildialog from './devicedetail/deviceDetaildialog.vue'
	import QrcodeVue from 'qrcode.vue'
	// import vueQr from 'vue-qr'
	const cityOptions = ['00:00', '01:00', '02:00', '03:00',
		'04:00', '05:00', '06:00', '07:00',
		'08:00', '09:00', '10:00', '11:00',
		'12:00', '13:00', '14:00', '15:00',
		'16:00', '17:00', '18:00', '19:00',
		'20:00', '21:00', '22:00', '23:00'
	];
	export default {
		name: 'xunCheckPlan',
		components: {
			// Editdialog,
			// deviceDetaildialog,
			planLook,
			QrcodeVue
		},
		data() {
			return {
				lookType: false,
				isdeptshow: false,
				isdeptshow1: false,
				isFarmshow: false,
				isFarmshow1: false,
				lookId: null, //查看得详情
				isBego: false,
				areaupdateTree: [],
				persontags: [],
				farmList: [],
				farmdefaultProps: {
					children: 'childOrgs',
					label: 'name'
				},
				deptList: [],
				updateTree: [],
				defaultProps: {
					children: 'childOrgs',
					label: 'name'
				},
				changePD: false, //切换人或者部门
				areadata: [],
				areadatadefaultProps: {
					children: 'childArea',
					label: 'name'
				},
				pointCheckPlan: {
					dept: '',
					farm: '',
					discipline: '',
					pointDept: '',
					person: '',
					timeshow: '',
					status: ''
				},
				submitLoading: false,
				selectRow: null,
				showEdit: false,
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
				checkAll: false,
				checkedCities: [],
				checkSort: [],
				cities: cityOptions,
				isIndeterminate: false,
				farmshow: true,
				checkdeptshow: false,
				checkpointDept: false,
				formRules: {
					planName: [{
						required: true,
						message: '请输入计划名称'
					}],
					farm: [{
						required: true,
						message: '请选择车间'
					}],
					discipline: [{
						required: true,
						message: '请选择专业'
					}],
					dept: [{
						required: true,
						message: '请选择部门'
					}],
					person: [{
						required: true,
						message: '请输入巡检人'
					}],
					showDate: [{
						required: true,
						message: '请选择起始时间'
					}],
					startDate: [{
						required: true,
						message: '请选择开始时间'
					}],
					endDate: [{
						required: true,
						message: '请选择开始时间'
					}],
					checkTime: [{
						required: true,
						message: '请输入巡检时间'
					}],
					week: [{
						required: true,
						message: '请选择频次(天)'
					}],
					checkHour: [{
						required: true,
						message: '请选择巡检时长(小时)'
					}],
					status: [{
						required: true,
						message: '请选择状态'
					}],
					area: [{
						required: true,
						message: '请选择区域'
					}],
				},

				loading: false,
				chooseId: [], //批量删除数组
				chooseDevice: [], //判断批量删除时，有无设备在跑流程
				isDeleteAll: true, //是否可以批量删除
				tableHeight: document.body.clientHeight - 84 - 36 - 150 - 180, // 表格高度
				currentPage: 1,
				pageSize: 10,
				size: 30,
				total: 1,
				numberPage: 0, //当前页数数据数量
				ewmDelay: 260, //二维码显示延迟的时间
				otherTooltipDelay: 260, //其他的tooltip显示延迟的时间
				aHref: null, //二维码下载地址
				loadName: null, // 二维码下载图片的名字
				topPopoShow: false, //搜索框-设备类型tree
				popheight: document.body.clientHeight * 10 + 'px',
				addAreaMsg: null,
				tableData: [],
				installArea: [], //安装位置数据
				deptDatas: null, // 组织机构数据
				serviceDatas: null, //维保部门数据
				jsonData: {
					deptId: null, //部门id
					shopId: null, //车间id（分厂id）
					lineId: null, //条线id
					planStart: null, //计划开始日期
					planEnd: null, //计划结束日期
					isActived: null, //是否激活，1启用，0禁用
					type: 2, //类别：1点检，2巡检(默认点检)
					pageNo: 1,
					pageSize: 10
				},
				addJson: {
					createrId: 265, //创建人id
					createrName: '系统管理员', //创建者姓名
					planName: '', // 计划名称
					type: 2, //类别：1点检，2巡检
					shopId: null, //车间id
					shopName: '', //车间名称
					deptId: null, //部门id
					shopCode: null,
					deptName: '', //部门名称
					lineId: null, // 专业id
					lineName: '', // 专业名称
					timePoint: '', //时间点 1-24 时间点之间用@间断
					cycle: null, //周期
					cycleUnit: '', // 周期单位
					planStart: '', //计划开始时间
					planEnd: '', // 计划结束时间
					planLong: null, //时长/每次(h)
					isActived: null, //是否激活，1激活，0禁用
					note: '', //备注
					areaBoList: [], // 点检区域(集合)
					userBoList: [] //点检人员（集合）
				},
				belongToWayData: [{
					value: '1',
					label: '路线1'
				}, {
					value: '2',
					label: '路线2'
				}],
				farmData: [{
					value: '1',
					label: '车间1'
				}, {
					value: '2',
					label: '车间2'
				}],
				disciplineData: [{
					value: '',
					label: '全部'
				}, {
					value: 1,
					label: '生产'
				}, {
					value: 2,
					label: '安全'
				}, {
					value: 3,
					label: '电气'
				}, {
					value: 4,
					label: '设备'
				}],
				pointDeptData: [{
					value: '1',
					label: '部门1'
				}, {
					value: '2',
					label: '部门2'
				}],
				pointStatusData: [{
					value: '',
					label: '全部'
				}, {
					value: '1',
					label: '启用'
				}, {
					value: '0',
					label: '禁用'
				}],
				areaData: [{
					value: '1',
					label: '区域1'
				}, {
					value: '2',
					label: '区域2'
				}],
				farmJson: {
					orgType: 2
				}, //获取车间得参数
				personJson: {
					userName: '',
					orgId: ''
				},
				deptrestaurants: [],
				personrestaurants: [],
				tags: [{
						name: '标签一',
						type: ''
					},
					{
						name: '标签二',
						type: 'success'
					},
					{
						name: '标签三',
						type: 'info'
					},
					{
						name: '标签四',
						type: 'warning'
					},
					{
						name: '标签五',
						type: 'danger'
					}
				]
			}
		},
		created() {
			// this.getDeviceOptions() //获取类型分类
			// this.getOrgInfo() //组织机构获取
			// this.getStatus() // 状态获取
			this.getTable() //获取table数据
			this.getFarm() //获取车间


			// this.$bus.on('pointWayAdd', (e) => {
			// 	console.log(666)
			// })
		},
		mounted() {
			// console.log(JSON.parse(localStorage.getItem('userName')))
		},
		destroyed() {
			this.$bus.off()
		},
		methods: {
			planshow(scope) {
				// this.$refs.xForm.updateStatus(scope)
				clearTimeout(this.timeout)
				this.timeout = setTimeout(() => {
					let json = {
						planName: scope.data.planName
					}
					this.planNameIsExist(json).then(res => {
						if (res.data.code == 0) { //查询到数据
							console.log(res.data.data.isExist)
							if (res.data.data.isExist==1) {
								this.$message({
									message: '计划名称已存在，请重输',
									type: 'warning'
								});
								this.formData.planName = null
								this.$refs.xForm.updateStatus(scope)
							} else {
								this.$message({
									message: '计划名称可用',
									type: 'success'
								});
								this.$refs.xForm.updateStatus(scope)
							}
						}
					})
				}, 2000)
			},
			//父子组件传值，控制隐藏显示
			closedialog(val) {
				// console.log('区域管理')
				this.lookType = val
			},
			focusEvent2() {
				this.$refs.xDown4.showPanel()
			},
			handleCheckAllChange(val) {
				console.log(val)

				this.checkedCities = val ? this.cities : [];
				this.isIndeterminate = false;
				if (val) {
					let nav = ''
					for (let i = 0; i < this.checkSort.length; i++) {
						if (i == this.checkSort.length - 1) {
							nav += this.checkSort[i]
						} else {
							nav += this.checkSort[i] + '@'
						}
					}
					console.log(nav)
					this.formData.checkTime = nav
				}
			},
			handleCheckedCitiesChange(value) {
				console.log(value)
				let data = []
				let nav = ''
				let checkedCount = value.length;
				this.checkAll = checkedCount === this.cities.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
				for (let i = 0; i < value.length; i++) {
					data.push(value[i].slice(0, 2).replace(/^0/, ''))
					// console.log(value[i].slice(0,2).replace(/^0/,''))
				}

				function sortNumber(a, b) { //升序
					return a - b
				}
				data = data.sort(sortNumber)
				this.checkSort = data
				// console.log(data)
				for (let i = 0; i < data.length; i++) {
					if (i == data.length - 1) {
						nav += data[i]
					} else {
						nav += data[i] + '@'
					}
				}
				// console.log(nav)
				this.formData.checkTime = nav
			},
			getFarm() {
				this.pointPlanFarmDataByUser(this.farmJson).then(res => {
					if (res.data.code == 0) { //查询到数据
						let data = res.data.data
						// console.log(data)
						for (let i = 0; i < data.length; i++) {
							data[i]['disabled'] = true
						}
						console.log(data)
						this.farmList = data
					} else {
						// that.deptrestaurants = []
					}
				})
			},
			//关于人员得搜索
			querySearchPerson(queryString, cb) {
				// console.log(queryString)
				// this.formData.person = queryString
				this.farmshow = false
				this.personrestaurants = []
				this.personJson.userName = queryString
				this.getPerson()
				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => {
					cb(this.personrestaurants);
				}, 1200 * Math.random());
			},
			handleSelectPerson(item) {
				// this.$refs.xForm.updateStatus(scope)
				console.log(item);
				this.formData.person = ''
				this.persontags.push({
					id: item.id,
					name: item.name,
					type: ''
				})
				this.persontags = this.repeat()
				setTimeout(() => {

					this.addJson.userBoList = []
					for (let i = 0; i < this.persontags.length; i++) {
						this.addJson.userBoList.push({
							userId: this.persontags[i].id,
							userName: this.persontags[i].name
						})
					}
					this.addJson.deptName = null
					this.addJson.deptId = null
				}, 500)

			},
			repeat() {
				let result = {};
				let finalResult = [];
				for (let i = 0; i < this.persontags.length; i++) {
					result[this.persontags[i].name] = this.persontags[i];
					// arr[i].month 不能重复,达到去重效果,且这里必须知晓"month"或是其他键名
				}
				// console.log(result);
				for (const item in result) {
					finalResult.push(result[item]);
				}
				// console.log(finalResult);
				return finalResult; //要返回的数据
			},

			getPerson() {
				this.pointPlanPersonData(this.personJson).then(res => {
					if (res.data.code == 0) { //查询到数据
						let data = res.data.data
						console.log(data)
						this.personrestaurants = []
						if (data.length != 0) { //如果请求数据不为空
							this.personrestaurants = data
						} else {
							this.personrestaurants = []
						}
					}
				})
			},
			areacheck(item) {
				console.log(this.$refs.tree.getCheckedNodes())
				let data = this.$refs.tree.getCheckedNodes()
				this.addJson.areaBoList = []
				// console.log(item)
				for (let i = 0; i < data.length; i++) {
					this.addJson.areaBoList.push({
						areaId: data[i].id,
						areaName: data[i].name
					})
				}
			},
			//选中部门
			searchDeptClick(data) {
				console.log(data);
				this.isdeptshow = false
				this.pointCheckPlan.dept = data.name
				this.jsonData.deptId = data.id
				// this.addData.findDept = data.code
			},
			//车间选中
			farm_change(data, checked, node) {
				if (checked == true) {
					this.checkedId = data.comcode;
					// this.$refs.treeForm.setCheckedNodes([data]);
					// console.log(data)
					this.isFarmshow = false
					this.checkpointDept = true
					this.pointCheckPlan.farm = data.name
					this.jsonData.shopId = data.id
					this.jsonData.shopCode = data.orgCode
					this.getDeptData(data.id) //获取部门
					this.getDisciplineData(data.orgCode);
				}
			},
			getDisciplineData(orgCode) {
				let newDisciplineData = []
				let param = {
					orgType: 2,
					orgCode: orgCode
				};
				this.getDisciplineDataByUserOrg(param).then(res => {
					if (res.data.code === 0) {
						const data = res.data.data
						for (let i = 0; i < this.disciplineData.length; i++) {
							if (this.disciplineData[i].value == '') {
								newDisciplineData.push(this.disciplineData[i])
							}
							for (let j = 0; j < data.length; j++) {
								if (data[j] == this.disciplineData[i].value) {
									newDisciplineData.push(this.disciplineData[i])
								}
							}
						}
						// this.updateTree.push(data[0].id)
						this.disciplineData = newDisciplineData
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			//删除人员
			handleClose(tag) {
				// var arrNew = [];
				// this.persontags.forEach((value, index, array) => {
				// 	if (value.name != tag.name) {
				// 		arrNew.push(value);
				// 	}
				// })
				// this.persontags = arrNew
				this.$nextTick(() => {
					this.persontags.splice(this.persontags.indexOf(tag), 1);
				})

			},
			//专业选中
			discipline_change(item) {
				// console.log(item)
				this.jsonData.lineId = item
			},
			//点检部门选中
			pointDept_change() {

			},
			//点检负责人
			pointCheckPlan_person_show() {

			},
			//时间范围选中
			timeshow_change(event) {
				console.log(event)
				// console.log(this.pointCheckPlan.timeshow)
				this.jsonData.planStart = event[0]
				this.jsonData.planEnd = JSON.parse(event[1] - 1)
			},
			//状态选中
			pointStatus_change(event) {
				this.jsonData.isActived = event
			},
			//选中车间
			farmhandleNodeClick(data, checked, node) {
				// console.log(123)
				console.log(this.persontags)
				// this.persontags = []
				if (checked == true) {
					this.checkedId = data.comcode;
					// this.$refs.treeForm.setCheckedNodes([data]);
					console.log(data)
					console.log(this.selectRow)
					this.isFarmshow1 = false
					this.isdeptshow1 = false
					this.farmshow = false
					this.checkdeptshow = true
					this.formData.farm = data.name
					this.addJson.shopId = data.id
					this.addJson.shopName = data.name
					this.addJson.shopCode = data.orgCode
					this.personJson.orgId = data.id

					// this.formData.person = null
					this.formData.dept = ''
					this.addJson.userBoList = []
					this.persontags = []

					this.getDeptData(data.id) //获取部门
					this.getDisciplineData(data.orgCode);
					this.getArea(data.orgCode)


				}
			},
			handleNodeClick(data) {
				console.log(data);
				this.isdeptshow1 = false
				this.formData.dept = data.longName
				this.addJson.deptId = data.id
				this.addJson.deptName = data.longName
				this.addJson.userBoList = [] //
			},
			closemodel() {
				// console.log('关闭对话框')
				this.checked = true
			},
			submitEvent() {
				this.submitLoading = true
				setTimeout(() => {
					this.submitLoading = false

					if (this.addJson.areaBoList.length === 0) {
						this.showEdit = true
						this.$message({
							message: '请选择区域',
							type: 'warning'
						});
					} else {
						this.showEdit = false
					}
					if (this.selectRow) {
						// this.updateMock()
						// console.log(this.addJson)
						this.addJson.planName = this.formData.planName
						this.addJson.timePoint = this.formData.checkTime
						this.addJson.cycle = this.formData.week
						this.addJson.cycleUnit = '天'
						// if (this.formData.showDate[0]===this.formData.showDate[1]) {
						// 	this.addJson.planStart = this.formData.showDate[0]
						// 	this.addJson.planEnd = JSON.parse(new Date(( this.formData.showDate[1]/1000+86400)*1000) - 1)
						// } else {
						// 	this.addJson.planStart = this.formData.showDate[0]
						// this.addJson.planEnd = JSON.parse(this.formData.showDate[1] - 1)
						// }
						this.addJson.planStart = this.formData.showDate[0]
						this.addJson.planEnd = JSON.parse(new Date((this.formData.showDate[1] / 1000 + 86400) *
							1000) - 1)
						this.addJson.planLong = this.formData.checkHour
						this.addJson.isActived = this.formData.status
						this.addJson.userBoList = []
						console.log(this.persontags)
						for (let i = 0; i < this.persontags.length; i++) {
							this.addJson.userBoList.push({
								userId: this.persontags[i].id,
								userName: this.persontags[i].name
							})
						}
						if (this.showEdit === false) {
							this.addMock()
						}
						Object.assign(this.selectRow, this.formData)
					} else {
						this.addJson.planName = this.formData.planName
						this.addJson.lineId = this.formData.discipline
						this.addJson.lineName = this.discipline_choose(this.formData.discipline)
						this.addJson.timePoint = this.formData.checkTime
						this.addJson.cycle = this.formData.week
						this.addJson.cycleUnit = '天'
						// if (this.formData.showDate[0]===this.formData.showDate[1]) {
						// 	this.addJson.planStart = this.formData.showDate[0]
						// 	this.addJson.planEnd = JSON.parse(new Date(( this.formData.showDate[1]/1000+86400)*1000) - 1)
						// } else {
						// 	this.addJson.planStart = this.formData.showDate[0]
						// this.addJson.planEnd = JSON.parse(this.formData.showDate[1] - 1)
						// }
						this.addJson.planStart = this.formData.showDate[0]
						this.addJson.planEnd = JSON.parse(new Date((this.formData.showDate[1] / 1000 + 86400) *
							1000) - 1)
						this.addJson.planLong = this.formData.checkHour
						this.addJson.isActived = this.formData.status
						// this.addJson.planLong = this.formData.checkTime
						// this.addJson.planLong = this.formData.checkTime
						console.log(this.formData, this.addJson)
						if (this.showEdit === false) {
							this.addMock()
						}
					}
				}, 500)
			},
			//返回专业名字
			discipline_choose(num) {
				let name = ''
				for (let i = 0; i < this.disciplineData.length; i++) {
					if (num === this.disciplineData[i].value) {
						name = this.disciplineData[i].label
					}
				}
				return name
			},
			addMock() {
				this.pointPlanAdd(this.addJson).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: res.data.message,
							type: 'success'
						})
						this.addJson = {
							createrId: 265, //创建人id
							createrName: '系统管理员', //创建者姓名
							planName: '', // 计划名称
							type: 1, //类别：1点检，2巡检
							shopId: null, //车间id
							shopName: '', //车间名称
							deptId: null, //部门id
							deptName: '', //部门名称
							lineId: null, // 专业id
							lineName: '', // 专业名称
							timePoint: '', //时间点 1-24 时间点之间用@间断
							cycle: null, //周期
							cycleUnit: '', // 周期单位
							planStart: '', //计划开始时间
							planEnd: '', // 计划结束时间
							planLong: null, //时长/每次(h)
							isActived: null, //是否激活，1激活，0禁用
							note: '', //备注
							areaBoList: [], // 点检区域(集合)
							userBoList: [] //点检人员（集合）
						}
						this.persontags = []
						this.showEdit = false
						this.getTable()
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			updateMock() {

			},
			way_change(event) {
				// console.log(event)
				this.addJson.routeId = JSON.parse(event)
			},
			lineManager_show(event) {
				this.addJson.lineManagerId = JSON.parse(event)
			},
			cycle_show(event) {
				// console.log(event)
				// console.log(this.formData.cycle)
				this.formData.cycle = event.value
				this.addJson.cycle = JSON.parse(event.value)
			},
			showDate_change(scope) {
				this.$refs.xForm.updateStatus(scope)
				console.log(scope.data)
			},
			startDate_show(event) {
				// console.log(event.value)
				let thistime = new Date().getTime()
				console.log(new Date(event.value).getTime(), thistime)
				if (new Date(event.value).getTime() < thistime) {
					this.$message({
						message: '计划开始时间不能小于当前时间',
						type: 'warning',
						duration: 5000
					});
					this.formData.startDate = null
				} else {
					this.formData.startDate = event.value
					this.addJson.planStart = new Date(event.value).getTime()
				}
				// this.addJson.planStart = new Date(event.value).getTime()
			},
			endDate_show(event) {
				// this.addJson.planEnd = new Date(event.value).getTime()
				let thistime = new Date(this.formData.startDate).getTime()
				console.log(new Date(event.value).getTime(), thistime)
				if (new Date(event.value).getTime() < thistime) {
					this.$message({
						message: '计划结束时间不能小于开始时间',
						type: 'warning',
						duration: 5000
					});
					this.formData.endDate = null
				} else {
					this.formData.endDate = event.value
					this.addJson.planEnd = new Date(event.value).getTime()
				}
			},
			planLong_show(event) {

			},
			advanceLong_show(event) {
				this.addJson.advanceLong = JSON.parse(event.value)
			},
			note_show(event) {
				this.addJson.note = event
			},
			//获取部门接口
			getDeptData(id) {
				// this.updateTree = []
				this.deptList = []
				this.pointPlanDeptData(id).then(res => {
					if (res.data.code === 0) {
						const data = res.data.data
						console.log(data)
						// this.updateTree.push(data[0].id)
						this.deptList = data
					} else {
						this.deptList = []
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			//获取点检区域
			getArea(code) {
				let areaJson = {
					pageNo: 1,
					pageSize: 50,
					orgCode: code
				}
				this.areadata = []
				this.pointPlanAreaData(areaJson).then(res => {
					if (res.data.code == 0) { //查询到数据
						let data = res.data.data.records
						console.log(data)
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
			//获取table数据
			getTable() {
				this.pointPlanData(this.jsonData).then(res => {
					if (res.data.code === 0) { //查询到数据
						//console.log(res)
						let data = res.data.data.records
						console.log('巡检计划列表', data)
						this.numberPage = res.data.data.current
						//console.log('当前页数数据数量', this.numberPage)
						this.loading = true
						let that = this
						setTimeout(function() {
							if (data.length !== 0) { //如果请求数据不为空
								that.total = res.data.data.total //列表总数
								for (var i = 0; i < data.length; i++) {
									that.tableData.push({
										index: that.jsonData.pageNo * that.jsonData.pageSize - that
											.jsonData.pageSize + i + 1,
										creater: data[i].createrName,
										dept: data[i].deptName != undefined ? data[i].deptName :
											'- -',
										farm: data[i].shopName,
										planId: data[i].planId,
										discipline: data[i].lineName,
										planname: data[i].planName,
										bego: false,
										startTime: that.formatDate(data[i].planStart),
										endTime: that.formatDate(data[i].planEnd),
										state: data[i].isActived == 0 ? '禁用' : '启用',
										data: data[i],
									})
								}
								//console.log('表', that.tableData)
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
			// 批量删除-- el-table 框
			getRowKeys(row) {
				return row.index
			},
			//重置搜索条件
			onreset(formName) {
				// this.$refs[formName].resetFields();
				this.jsonData = {
					deptId: null, //部门id
					shopId: null, //车间id（分厂id）
					lineId: null, //条线id
					planStart: null, //计划开始日期
					planEnd: null, //计划结束日期
					isActived: null, //是否激活，1启用，0禁用
					type: 1, //类别：1点检，2巡检(默认点检)
					pageNo: 1,
					pageSize: 10
				}
				this.pointCheckPlan = {
					dept: '',
					farm: '',
					discipline: '',
					pointDept: '',
					person: '',
					timeshow: '',
					status: ''
				}
				this.checkpointDept = false
				if (this.$refs.treeForm) {
					this.$refs.treeForm.setCheckedNodes([]);
				}
			},
			//顶部查询按钮 筛选信息
			onSubmit() {
				this.jsonData.pageNo = 1
				this.jsonData.pageSize = 10
				this.getTable()
			},
			selectionchange(data) {
				this.chooseId = [] //每次选择重置批量
				this.chooseDevice = [] //重置
				this.isDeleteAll = data.length === 0
				console.log(data)
				for (let i = 0; i < data.length; i++) {
					this.chooseId.push(data[i].id)
					let obj = {
						id: data[i].id,
						name: data[i].name,
						isMaintenancing: data[i].isMaintenancing
					}
					this.chooseDevice.push(obj)
				}
				//console.log('462-',this.chooseDevice)
			},
			//批量导入
			addmore() {

			},
			// 批量删除按钮
			deleteItems() {
				// this.$bus.emit('deviceDelete', this.tableData)
				this.$confirm('是否删除该设备?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let result = this.isDeleteConfirm(this.chooseDevice)
					let src = ''
					for (let key of result) {
						src = src + key.name + ','
					}
					//console.log(result)
					if (result.length > 0) {
						this.$confirm(`选定删除设备中:<b style="color: red">${src}</b>设备处于维修(保养,作业票)流程中，请将其流程终止后删除`,
							'删除警告', {
								dangerouslyUseHTMLString: true
							}).then(() => {
							this.$refs.multipleTable.clearSelection()
							this.jsonData.pageNo = 1
							this.getTable()
						})
					} else {
						this.deletshow()
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})
			},
			deletshow() {
				let deletParam = {
					ids: this.chooseId
				}
				if (this.chooseId.length >= this.numberPage) {
					this.jsonData.pageNo = 1
					this.jsonData.pageSize = 10
				}
				this.$axios.post('/d/device/delete', deletParam).then(res => {
					//console.log(res)
					if (res.data.code === 0) {
						this.$message({
							type: 'success',
							message: '设备删除成功.'
						})
						setTimeout(() => {
							this.$refs.multipleTable.clearSelection()
							//删除成功后，如果把一页数据全删，要页数调整
							this.getTable()
						}, 500)
					} else {
						this.$message.error('删除失败')
						//console.log(res.data.message)
					}
				}).catch(err => {
					this.$message.error('服务异常')
				})
			},
			// 单独右侧删除按钮
			deleteList(row) {
				this.$confirm('是否删除该计划?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let pam = {
						spotCheckPlanId: row.planId
					}
					this.pointPlanDelete(pam).then(res => {
						if (res.data.code === 0) {
							this.$message({
								type: 'success',
								message: '成功删除'
							})
							this.getTable()
						} else {
							this.$message.error(res.data.message)
						}
					}).catch(err => {
						console.log(err)
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})

			},
			//批量删除判断
			isDeleteConfirm(arry) {
				return arry.filter(item => item.isMaintenancing !== 0)
			},
			// 编辑
			updateList(item) {
				console.log(item)
				let json = {
					spotCheckPlanId: item.planId
				}
				this.pointPlanLook(json).then(res => {
					if (res.data.code === 0) {
						console.log(res.data.data)
						let data = res.data.data
						let timeshow = []
						this.persontags = []
						timeshow.push(data.planStart)
						timeshow.push(JSON.parse(data.planEnd + 1))
						if (data.userBoList != undefined) {
							for (let i = 0; i < data.userBoList.length; i++) {
								this.persontags.push({
									id: data.userBoList[i].userId,
									name: data.userBoList[i].userName,
									type: ''
								})
							}
						}
						console.log(data.timePoint.match(/\d+/g))
						let showTimepoint = data.timePoint.match(/\d+/g)
						for (var i = 0; i < showTimepoint.length; i++) {
							if (JSON.parse(showTimepoint[i]) < 10) {
								showTimepoint[i] = '0' + showTimepoint[i] + ':00'
							} else {
								showTimepoint[i] = showTimepoint[i] + ':00'
							}
						}
						// console.log(showTimepoint)
						let arr = []
						for (var i = 0; i < showTimepoint.length; i++) {
							//如果字符串中不包含目标字符会返回-1
							for (let j = 0; j < this.cities.length; j++) {
								if (this.cities[j].indexOf(showTimepoint[i]) >= 0) {
									arr.push(this.cities[j]);
								}
							}

						}
						console.log(arr)
						this.checkedCities = arr
						this.formData = {
							planName: data.planName,
							farm: data.shopName,
							dept: data.deptName,
							showAllperson: null,
							person: data.userBoList != undefined && data.userBoList.length != 0 ? data
								.userBoList[data.userBoList.length - 1].userName : '',
							discipline: data.lineName,
							showDate: timeshow,
							startDate: null,
							endDate: null,
							checkTime: data.timePoint,
							week: data.cycle,
							checkHour: data.planLong,
							status: data.isActived,
							area: null
						}
						if (data.userBoList != undefined) {
							this.changePD = false
						} else {
							this.changePD = true
						}
						// console.log(this.areadata)
						this.getArea(data.shopCode)
						// setTimeout(()=>{
						// 	for (let i=0;i<data.areaBoList.length;i++) {
						// 		this.areaupdateTree.push(data.areaBoList[i].areaId)
						// 	}
						// })
						this.areaupdateTree = []
						this.$nextTick(() => {
							for (let i = 0; i < data.areaBoList.length; i++) {
								this.areaupdateTree.push(data.areaBoList[i].areaId)
							}
						})
						this.getDeptData(data.shopId) //获取部门
						this.personJson.orgId = data.shopId
						this.farmshow = false
						this.checkdeptshow = true
						this.selectRow = data
						this.showEdit = true
						// console.log(this.selectRow)
						this.addJson = {
							createrId: 265, //创建人id
							createrName: '系统管理员', //创建者姓名
							planName: data.planName, // 计划名称
							type: 1, //类别：1点检，2巡检
							shopId: data.shopId, //车间id
							shopCode: data.shopCode, //车间id
							shopName: data.shopName, //车间名称
							deptId: data.deptId, //部门id
							deptName: data.deptName, //部门名称
							lineId: data.lineId, // 专业id
							lineName: data.lineName, // 专业名称
							timePoint: data.timePoint, //时间点 1-24 时间点之间用@间断
							cycle: data.cycle, //周期
							cycleUnit: data.cycleUnit, // 周期单位
							planStart: data.planStart, //计划开始时间
							planEnd: data.planEnd, // 计划结束时间
							planLong: data.planLong, //时长/每次(h)
							isActived: data.isActived, //是否激活，1激活，0禁用
							note: '', //备注
							areaBoList: data.areaBoList != undefined ? data.areaBoList : [], // 点检区域(集合)
							userBoList: data.userBoList != undefined ? data.userBoList : [] //点检人员（集合）
						}
						// this.addJson = res.data.data
						this.addJson['id'] = item.planId
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})

			},
			// 添加信息
			addlist() {
				this.formData = {
					planName: null,
					farm: null,
					dept: null,
					showAllperson: null,
					showDate: null,
					startDate: null,
					endDate: null,
					checkTime: null,
					week: null,
					checkHour: null,
					status: null,
					area: null
				}
				this.addJson = {
					createrId: 265, //创建人id
					createrName: '系统管理员', //创建者姓名
					planName: '', // 计划名称
					type: 1, //类别：1点检，2巡检
					shopId: null, //车间id
					shopCode: null,
					shopName: '', //车间名称
					deptId: null, //部门id
					deptName: '', //部门名称
					lineId: null, // 专业id
					lineName: '', // 专业名称
					timePoint: '', //时间点 1-24 时间点之间用@间断
					cycle: null, //周期
					cycleUnit: '', // 周期单位
					planStart: '', //计划开始时间
					planEnd: '', // 计划结束时间
					planLong: null, //时长/每次(h)
					isActived: null, //是否激活，1激活，0禁用
					note: '', //备注
					areaBoList: [], // 点检区域(集合)
					userBoList: [] //点检人员（集合）
				}
				this.checkedCities = []
				this.persontags = []
				this.selectRow = null
				this.showEdit = true
			},
			deletePlan() {

			},
			//激活
			bego(row) {
				console.log(row)
				let json = {
					spotCheckPlanId: row.planId
				}
				this.pointPlanBego(json).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: '激活成功',
							type: 'success'
						})
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				}).catch(err => {
					console.log(err)
				})
			},
			// 详情
			lookList(row) {
				this.lookType = true
				this.lookId = row.planId
				// console.log(row)
				// let item = {
				// 	id: row.id,
				// 	stateName: row.stateName
				// }
				// this.$bus.emit('shownav', item)
			},
			//查询状态
			getStatus() {
				let parm = {
					parentCode: 'deviceState'
				}
				this.getStateInfo(parm).then(res => {
					if (res.data.code === 0) {
						//console.log('状态查询', res.data.data)
						this.device_status = res.data.data
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			//搜索框-设备类型tree
			filterNode(value, data) {
				if (!value) return true
				return data.label.indexOf(value) !== -1
			},

			selectClassfy(data) {
				//console.log('tree', data)
				this.device_model.deviceTypeArry = data.label
				this.jsonData.deviceTypeId = data.id
			},
			showtree() {
				this.device_model.deviceTypeArry = ''
				this.jsonData.deviceTypeId = null
			},
			//取消
			blankMsg() {
				this.topPopoShow = false
				this.device_model.deviceTypeArry = ''
				this.jsonData.deviceTypeId = null
			},
			disabledDateMethod({
				date
			}) {
				const dd = date.getTime()
				const thisday = new Date().getTime()
				// console.log(date)
				return dd <= thisday
			},
			disabledDateMethodEnd({
				date
			}) {
				const dd = date.getTime()
				const thisday = new Date(this.formData.startDate).getTime()
				// console.log(date)
				return dd <= thisday
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`)
				this.currentPage = 1
				this.pageSize = val
				this.jsonData.pageSize = val
				this.jsonData.pageNo = 1
				this.getTable()
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`)
				this.currentPage = val
				this.jsonData.pageNo = val
				this.getTable()
			}
		}
	}
</script>
<style scoped>
	.xunCheckPlan {
		padding: 10px;
	}

	.xunCheckPlan>>>.vxe-modal--body {
		overflow: hidden;
	}

	.custom-tree-node {
		width: 100%;
		font-size: 14px;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.dept {
		white-space: nowrap;
		/* 规定文本是否折行 */
		overflow: hidden;
		/* 规定超出内容宽度的元素隐藏 */
		text-overflow: ellipsis;
		-webkit-line-clamp: 1;
		width: 100%;
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
