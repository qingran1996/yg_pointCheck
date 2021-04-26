<template>
	<div class="overhaulEdit">
		<vxe-modal v-model="isshow" :title="'检修单'+showtitle" width="80%" height="80%" :min-width="minWidthshow"
			:loading="submitLoading" resize destroy-on-close @close="closemodel">
			<template #default>
				<vxe-form :data="formData" :rules="sonformRules" title-colon title-align="right" title-width="150"
					ref="xForm" @submit="submitEvent">
					<vxe-form-item title="作业名称" field="name" span="12" :item-render="{}">
						<template #default="scope">
							<vxe-input v-model="formData.name" @input="$refs.xForm.updateStatus(scope)"
								placeholder="请输入作业名称" clearable></vxe-input>
						</template>
					</vxe-form-item>
					<vxe-form-item title="作业类型" field="workType" span="12" :item-render="{}">
						<template #default="scope">
							<vxe-select v-model="formData.workType" placeholder="请选择作业类型" clearable>
								<vxe-option v-for="item in workTypeData" :key="item.value" :label="item.label"
									:value="item.value"></vxe-option>
							</vxe-select>
						</template>
					</vxe-form-item>
					<vxe-form-item title="作业时间范围" field="workTime" span="14" :item-render="{}">
						<template #default="scope">
							<el-date-picker v-model="formData.workTime" type="daterange" unlink-panels
								style="width: 100%;" value-format="timestamp" range-separator="至"
								start-placeholder="开始日期" end-placeholder="结束日期">
							</el-date-picker>
						</template>
					</vxe-form-item>
					<vxe-form-item title="设备" field="device" span="12" :item-render="{}">
						<template #default="scope">
							<!-- <el-select v-model="formData.device" filterable clearable placeholder="请选择设备">
								<el-option v-for="item in deviceData" :key="item.value" :label="item.label"
									:value="item.value">
									<div class="name" style="text-overflow: ellipsis;overflow: hidden;">{{ item.label }}
									</div>
									<div class="orgName" style="color: #b4b4b4;font-size: 12px;">{{ item.orgName }}
									</div>
								</el-option>
							</el-select> -->
							<el-autocomplete v-model="formData.device" :trigger-on-focus="true"
								:fetch-suggestions="querySearchAsync" placeholder="请输入设备名字" @select="handleSelect">
								<template slot-scope="{ item }">
									<div class="name" style="display: inline-block;color: #000000;" :title="item.label">
										{{ item.label }}
									</div>
									<!-- <div class="name" style="display: inline-block;float: right;"><i
											class="el-icon-phone"
											style="margin-left: 10px;color: orange;"></i>{{ item.phoneNumber }}
									</div> -->
									<div class="dept" style="color: lightseagreen;" :title="item.orgName">
										部门： {{ item.orgName }}
									</div>
								</template>
							</el-autocomplete>
						</template>
					</vxe-form-item>
					<vxe-form-item title="专业" field="profession" span="12" :item-render="{}">
						<template #default="scope">
							<vxe-select v-model="formData.profession" placeholder="请选择设备" clearable>
								<vxe-option v-for="item in professionData" :key="item.value" :label="item.label"
									:value="item.value"></vxe-option>
							</vxe-select>
						</template>
					</vxe-form-item>
					<vxe-form-item title="问题来源" field="problem" span="12" :item-render="{}">
						<template #default="scope">
							<div class="demo-input-suffix"
								style="display: flex;justify-content:center;align-items:Center;">
								<div>
									<el-tag type="warning">{{formData.source}}</el-tag>
								</div>
								<el-input type="textarea" autosize placeholder="请输入解决问题" disabled
									v-model="formData.problem">
								</el-input>
							</div>
						</template>
					</vxe-form-item>
					<vxe-form-item title="延用工单" field="useWorkLisk" span="12" :item-render="{}">
						<template #default="scope">
							<vxe-select v-model="formData.useWorkLisk" placeholder="请选择延用工单" clearable>
								<vxe-option v-for="item in useWorkLiskData" :key="item.value" :label="item.label"
									:value="item.value"></vxe-option>
							</vxe-select>
						</template>
					</vxe-form-item>
					<vxe-form-item title="设备位置" field="deviceAddress" span="12" :item-render="{}">
						<template #default="scope">
							<vxe-input v-model="formData.deviceAddress" disabled
								@input="$refs.xForm.updateStatus(scope)" placeholder="请输入设备位置" clearable></vxe-input>
						</template>
					</vxe-form-item>
					<vxe-form-item title="影响区域" field="changeArea" span="12" :item-render="{}">
						<template #default="scope">
							<vxe-input v-model="formData.changeArea" @input="$refs.xForm.updateStatus(scope)"
								placeholder="请输入影响区域" clearable></vxe-input>
						</template>
					</vxe-form-item>
					<vxe-form-item title="检修部门" field="checkDept" span="12" :item-render="{}">
						<template #default="scope">
							<!-- <vxe-select v-model="formData.checkDept" placeholder="请选择检修部门" clearable>
								<vxe-option v-for="item in checkDeptLiskData" :key="item.value" :label="item.label"
									:value="item.value"></vxe-option>
							</vxe-select> -->
							<vxe-input v-model="formData.checkDept" @input="$refs.xForm.updateStatus(scope)"
								placeholder="请输入检修部门" disabled clearable></vxe-input>
						</template>
					</vxe-form-item>
					<vxe-form-item title="检修负责人" field="checkPerson" span="12" :item-render="{}">
						<template #default="scope">
							<vxe-select v-model="formData.checkPerson" placeholder="请选择检修负责人" clearable>
								<vxe-option v-for="item in checkPersonLiskData" :key="item.value" :label="item.label"
									:value="item.value"></vxe-option>
							</vxe-select>
						</template>
					</vxe-form-item>
					<vxe-form-item title="四方审核" field="fourCheck" span="24" :item-render="{}">
						<template #default="scope">
							<el-row :gutter="20">
								<el-col :span="12">
									<div class="textshow">
										<el-tag style="margin-right: 10px;">设备专业 </el-tag>
										<vxe-select v-model="formData.deviceProfession" placeholder="请选择设备专业人"
											size="small" multiple>
											<vxe-option v-for="item in deviceProfessionLiskData" :key="item.value"
												:label="item.label" :value="item.value"></vxe-option>
										</vxe-select>
										<el-tag type="info" style="margin-left: 10px;">(可多选) </el-tag>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="textshow">
										<el-tag style="margin-right: 10px;">电仪专业 </el-tag>
										<vxe-select v-model="formData.electricalInstrumentProfession"
											placeholder="请选择电仪专业人" size="small" multiple>
											<vxe-option v-for="item in electricalInstrumentProfessionLiskData"
												:key="item.value" :label="item.label" :value="item.value"></vxe-option>
										</vxe-select>
										<el-tag type="info" style="margin-left: 10px;">(可多选) </el-tag>
									</div>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="12">
									<div class="textshow">
										<el-tag style="margin-right: 10px;">工艺专业 </el-tag>
										<vxe-select v-model="formData.craftProfession" placeholder="请选择工艺专业人"
											size="small" multiple>
											<vxe-option v-for="item in craftProfessionLiskData" :key="item.value"
												:label="item.label" :value="item.value"></vxe-option>
										</vxe-select>
										<el-tag type="info" style="margin-left: 10px;">(可多选) </el-tag>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="textshow">
										<el-tag style="margin-right: 10px;">安全专业 </el-tag>
										<vxe-select v-model="formData.safeProfession" placeholder="请选择安全专业人"
											size="small" multiple>
											<vxe-option v-for="item in safeProfessionLiskData" :key="item.value"
												:label="item.label" :value="item.value"></vxe-option>
										</vxe-select>
										<el-tag type="info" style="margin-left: 10px;">(可多选) </el-tag>
									</div>
								</el-col>
							</el-row>
						</template>
					</vxe-form-item>
					<vxe-form-item title="厂长" field="factoryManager" span="12" :item-render="{}">
						<template #default="scope">
							<!-- <vxe-select v-model="formData.factoryManager" placeholder="请选择厂长审核人" clearable>
								<vxe-option v-for="item in factoryManagerLiskData" :key="item.value" :label="item.label"
									:value="item.value"></vxe-option>
							</vxe-select> -->
							<!-- <vxe-input v-model="formData.factoryManager" @input="$refs.xForm.updateStatus(scope)"
								placeholder="请输入厂长审核人" clearable></vxe-input> -->
							<el-select v-model="formData.factoryManager" filterable clearable placeholder="请选择厂长">
								<el-option v-for="item in factoryManagerLiskData" :key="item.value" :label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
						</template>
					</vxe-form-item>
					<vxe-form-item title="四方施工确认" field="fourWorkSure" span="24" :item-render="{}">
						<template #default="scope">
							<el-row :gutter="20">
								<el-col :span="12">
									<div class="textshow">
										<el-tag style="margin-right: 10px;">设备 </el-tag>
										<vxe-textarea v-model="formData.fourWorkSure_device" placeholder="请输入设备"
											size="mini"></vxe-textarea>
									</div>
									<div class="textshow_person">
										<el-tag type="success" style="margin-right: 10px;">设备确认人 </el-tag>
										<vxe-select v-model="formData.fourWorkSure_deviceSurePerson" clearable
											placeholder="请选择设备确认人" size="small" multiple>
											<vxe-option v-for="item in fourWorkSure_deviceSurePersonLiskData"
												:key="item.value" :label="item.label" :value="item.value"></vxe-option>
										</vxe-select>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="textshow">
										<el-tag style="margin-right: 10px;">电仪 </el-tag>
										<vxe-textarea v-model="formData.fourWorkSure_electricalInstrument"
											placeholder="请输入电仪" size="mini"></vxe-textarea>
									</div>
									<div class="textshow_person">
										<el-tag type="success" style="margin-right: 10px;">电仪确认人 </el-tag>
										<vxe-select v-model="formData.fourWorkSure_electricalInstrumentSurePerson"
											placeholder="请选择电仪确认人" size="small" multiple>
											<vxe-option
												v-for="item in fourWorkSure_electricalInstrumentSurePersonLiskData"
												:key="item.value" :label="item.label" :value="item.value"></vxe-option>
										</vxe-select>
									</div>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="12">
									<div class="textshow">
										<el-tag style="margin-right: 10px;">工艺 </el-tag>
										<vxe-textarea v-model="formData.fourWorkSure_craft" placeholder="请输入工艺"
											size="mini"></vxe-textarea>
									</div>
									<div class="textshow_person">
										<el-tag type="success" style="margin-right: 10px;">工艺确认人 </el-tag>
										<vxe-select v-model="formData.fourWorkSure_craftSurePerson"
											placeholder="请选择工艺确认人" size="small" multiple>
											<vxe-option v-for="item in fourWorkSure_craftSurePersonLiskData"
												:key="item.value" :label="item.label" :value="item.value"></vxe-option>
										</vxe-select>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="textshow">
										<el-tag style="margin-right: 10px;">安全 </el-tag>
										<vxe-textarea v-model="formData.fourWorkSure_safe" placeholder="请输入安全"
											size="mini"></vxe-textarea>
									</div>
									<div class="textshow_person">
										<el-tag type="success" style="margin-right: 10px;">安全确认人 </el-tag>
										<vxe-select v-model="formData.fourWorkSure_safeSurePerson"
											placeholder="请选择安全确认人" size="small" multiple>
											<vxe-option v-for="item in fourWorkSure_safeSurePersonLiskData"
												:key="item.value" :label="item.label" :value="item.value"></vxe-option>
										</vxe-select>
									</div>
								</el-col>
							</el-row>
						</template>
					</vxe-form-item>
					<vxe-form-item title="施工方案" field="workNav" span="24" :item-render="{}">
						<template #default="scope">
							<vxe-textarea v-model="formData.workNav" placeholder="请输入施工方案"></vxe-textarea>
						</template>
					</vxe-form-item>
					<vxe-form-item title="作业前准备" field="workBefore" span="24" :item-render="{}">
						<template #default="scope">
							<vxe-textarea v-model="formData.workBefore" placeholder="请输入作业前准备"></vxe-textarea>
						</template>
					</vxe-form-item>
					<vxe-form-item title="作业人员" field="workPerson" span="16" :item-render="{}">
						<template #default="scope">
							<vxe-select v-model="formData.workPerson" placeholder="请选择作业人员" size="small" multiple>
								<vxe-option v-for="item in workPersonData" :key="item.value" :label="item.label"
									:value="item.value"></vxe-option>
							</vxe-select>
						</template>
					</vxe-form-item>
					<vxe-form-item title="作业时长" field="workLongTime" span="8" :item-render="{}">
						<template #default="scope">
							<vxe-input v-model="formData.workLongTime" placeholder="请输入作业时长" type="number" clearable>
							</vxe-input>
						</template>
					</vxe-form-item>
					<vxe-form-item title="物资信息配置" field="goodsDeploy" span="24" :item-render="{}">
						<template #default="scope">
							<el-table :data="goodsData" border style="width: 100%">
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
								<el-table-column prop="num" label="数量" show-overflow-tooltip fixed="right">
								</el-table-column>
								<el-table-column fixed="right" label="操作" width="80">
									<template slot-scope="scope">
										<el-tag @click.native.prevent="deleteRow(scope.$index, goodsData)"
											style="cursor: pointer;">删除</el-tag>
									</template>
								</el-table-column>
							</el-table>
							<el-button @click="goodsAdd" style="margin-top: 5px;" type="primary" plain size="mini">设置
							</el-button>
						</template>
					</vxe-form-item>
					<vxe-form-item title="风险因素" field="risk" span="24" :item-render="{}">
						<template #default="scope">
							<el-table :data="riskData" border style="width: 100%">
								<el-table-column prop="riskName" label="风险因素名称" width="200" show-overflow-tooltip="">
								</el-table-column>
								<el-table-column prop="measure" label="安全措施" show-overflow-tooltip>
								</el-table-column>
								<el-table-column fixed="right" label="操作" width="80">
									<template slot-scope="scope">
										<el-tag @click.native.prevent="deleteRow(scope.$index, riskData)"
											style="cursor: pointer;">删除</el-tag>
									</template>
								</el-table-column>
							</el-table>
							<el-button @click="riskAdd" style="margin-top: 5px;" type="primary" plain size="mini">设置
							</el-button>
						</template>
					</vxe-form-item>
					<vxe-form-item title="气体检测配置" field="gascheck" span="24" :item-render="{}">
						<template #default="scope">
							<el-table :data="gascheckData" border style="width: 100%">
								<el-table-column prop="projectName" label="气体名称" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="detectionMethod" label="监测方式" show-overflow-tooltip>
									<template slot-scope="scope">
										<div class="action">
											{{typechange(scope.row.detectionMethod)}}
										</div>
									</template>
								</el-table-column>
								<el-table-column prop="cycle" label="监测周期" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="standardValue" label="标准值" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="unit" label="单位" show-overflow-tooltip>
								</el-table-column>
								<el-table-column fixed="right" label="操作" align="center">
									<template slot-scope="scope">
										<div class="action">
											<el-tooltip class="item" effect="dark" content="删除" placement="bottom">
												<el-tag type="danger"
													@click.native.prevent="deleteRow(scope.$index, gascheckData)">删除
												</el-tag>
											</el-tooltip>
										</div>
									</template>
								</el-table-column>
							</el-table>
							<el-button @click="gasAdd" style="margin-top: 5px;" type="primary" plain size="mini">设置
							</el-button>
						</template>
					</vxe-form-item>
					<vxe-form-item title="过程确认人员" field="processSurePerson" span="13" :item-render="{}">
						<template #default="scope">
							<vxe-select v-model="formData.processSurePerson" placeholder="请选择过程确认人员" size="small">
								<vxe-option v-for="item in processSurePersonData" :key="item.value" :label="item.label"
									:value="item.value"></vxe-option>
							</vxe-select>
						</template>
					</vxe-form-item>
					<vxe-form-item title="调试验收人员" field="bugSurePerson" span="13" :item-render="{}">
						<template #default="scope">
							<vxe-select v-model="formData.bugSurePerson" placeholder="请选择调试验收人员" size="small" multiple>
								<vxe-option v-for="item in bugSurePersonData" :key="item.value" :label="item.label"
									:value="item.value"></vxe-option>
							</vxe-select>
						</template>
					</vxe-form-item>
					<vxe-form-item title="总结人员" field="sumUpPerson" span="13" :item-render="{}">
						<template #default="scope">
							<vxe-select v-model="formData.sumUpPerson" placeholder="请选择总结人员" size="small" multiple>
								<vxe-option v-for="item in sumUpPersonData" :key="item.value" :label="item.label"
									:value="item.value"></vxe-option>
							</vxe-select>
						</template>
					</vxe-form-item>
					<vxe-form-item title="验收标准" field="acceptValue" span="24" :item-render="{}">
						<template #default="scope">
							<vxe-textarea v-model="formData.acceptValue" placeholder="请输入验收标准"></vxe-textarea>
						</template>
					</vxe-form-item>
					<vxe-form-item class="bottomShow" align="center" span="24" :item-render="{}">
						<template #default>
							<!-- <vxe-button status="primary" @click="save">存为标准工单</vxe-button> -->
							<!-- <vxe-button status="primary" @click="save">保存</vxe-button> -->
							<vxe-button type="submit" status="success">保存</vxe-button>
							<vxe-button @click="reset">重置</vxe-button>
						</template>
					</vxe-form-item>
				</vxe-form>
			</template>
		</vxe-modal>
		<!-- 添加物资 -->
		<editGoods :goodsShow="goodsLookType" @goodsdialog="goodsClose"></editGoods>
		<!-- 添加风险 -->
		<editRisk :riskShow="riskLookType" @riskdialog="riskClose"></editRisk>
		<!-- 添加监测气体 -->
		<editGas :gasShow="gasLookType" @gasdialog="gasClose"></editGas>
	</div>
</template>

<script>
	import editGoods from './editGoods.vue'
	import editRisk from './editRisk.vue'
	import editGas from './editGas.vue'
	export default {
		name: 'overhaulEdit',
		props: {
			//是否展示
			isshow: {
				type: Boolean,
				// 当为对象类型设置默认值时必须使用函数返回
				required: true
			},
			//名字
			showtitle: {
				type: String,
				// 当为对象类型设置默认值时必须使用函数返回
				default: false
			},
			showEvent: {
				type: Object,
				default: function() {
					return {
						message: 'hello'
					}
				}
			},
		},
		components: {
			editGoods,
			editRisk,
			editGas
		},
		data() {
			return {
				goodsLookType: false, //是否展示物资添加
				riskLookType: false, //是否展示风险因素
				gasLookType: false, //是否展示气体监测添加
				minWidthshow: document.body.clientWidth * 0.8,
				loading: false,
				submitLoading: false,
				formData: {
					name: null, //作业名称
					workType: null, //作业类型
					workTime: null, //作业时间范围
					device: null, //设备
					profession: null, //专业
					problem: null, //解决问题
					source: null, //问题来源
					useWorkLisk: null, //延用工单
					deviceAddress: null, //设备位置
					changeArea: null, //影响区域
					checkDept: null, //检修部门
					checkPerson: null, //检修负责人
					fourCheck: null, //四方审核/************************************
					deviceProfession: null, //设备专业,多选
					electricalInstrumentProfession: null, //电仪专业，多选
					craftProfession: null, //工艺专业，多选
					safeProfession: null, //安全专业
					factoryManager: null, //厂长审核人
					fourWorkSure: null, //四方施工确认/************************************
					fourWorkSure_device: null, //四方施工-设备
					fourWorkSure_deviceSurePerson: null, //四方施工-设备确认人
					fourWorkSure_electricalInstrument: null, //四方施工-电仪
					fourWorkSure_electricalInstrumentSurePerson: null, //四方施工-电仪确认人
					fourWorkSure_craft: null, //四方施工-工艺
					fourWorkSure_craftSurePerson: null, //四方施工-工艺确认人
					fourWorkSure_safe: null, //四方施工-安全
					fourWorkSure_safeSurePerson: null, //四方施工-安全确认人
					workNav: null, //施工方案
					workBefore: null, //作业前准备
					workPerson: null, //作业人员
					workLongTime: null, //作业时长
					goodsDeploy: null, //物资信息配置
					risk: null, //风险因素
					gascheck: null, //气体检测配置
					processSurePerson: null, //过程确认人员
					bugSurePerson: null, //调试验收人员
					sumUpPerson: null, //总结人员
					acceptValue: null, //验收标准
				},
				sonformRules: {
					name: [{
						required: true,
						message: '请输入人员名称'
					}],
					workType: [{
						required: true,
						message: '请选择作业类型'
					}],
					workTime: [{
						required: true,
						message: '请选择作业时间范围'
					}],
					device: [{
						required: true,
						message: '请选择设备'
					}],
					profession: [{
						required: true,
						message: '请选择专业'
					}],
					problem: [{
						required: false,
						message: '请输入解决问题'
					}],
					useWorkLisk: [{
						required: false,
						message: '请选择延用工单'
					}],
					deviceAddress: [{
						required: false,
						message: '请输入设备位置'
					}],
					changeArea: [{
						required: true,
						message: '请选择影响区域'
					}],
					checkDept: [{
						required: true,
						message: '请选择检修部门'
					}],
					checkPerson: [{
						required: true,
						message: '请选择检修负责人'
					}],
					fourCheck: [{
						required: false,
						message: '请完善四方审核'
					}],
					factoryManager: [{
						required: true,
						message: '请选择厂长审核人'
					}],
					fourWorkSure: [{
						required: false,
						message: '请确认四方施工'
					}],
					workNav: [{
						required: true,
						message: '请输入施工方案'
					}],
					workBefore: [{
						required: true,
						message: '请输入作业前准备'
					}],
					workPerson: [{
						required: true,
						message: '请选择作业人员'
					}],
					workLongTime: [{
						required: true,
						message: '请输入作业时长'
					}],
					processSurePerson: [{
						required: true,
						message: '请选择过程确认人员'
					}],
					bugSurePerson: [{
						required: true,
						message: '请选择调试验收人员'
					}],
					sumUpPerson: [{
						required: true,
						message: '请选择总结人员'
					}],
					acceptValue: [{
						required: true,
						message: '请输入验收标准'
					}],
				},
				addJson: {
					jcId: null, //作业卡id（更新编辑时需要）
					lineId: null, //条线id
					lineName: null, //条线名称
					shopId: null, //分厂id（检修部门）
					shopName: null, //分厂名称（检修部门）
					directorId: null, //负责人id
					directorName: null, //负责人姓名
					jobName: null, //项目名称
					type: null, //类型 1日修，2抢修
					jobNo: null, //项目编号
					planStart: null, //计划开始时间
					planEnd: null, //计划结束时间
					planLong: null, //计划时长
					location: null, //设备地址
					equipmentType: null, //设备类型
					equipmentId: null, //设备id
					equipmentName: null, //设备名称
					jobContent: null, //作业内容
					areaName: null, //影响区域名称
					prepareJob: null, //准备工作
					risk: null, //风险-措施
					plantManagerId: null, //分厂厂长id
					plantManagerName: null, //分厂厂长姓名
					courseConfirmerId: null, //过程确认人id
					courseConfirmerName: null, //过程确认人姓名
					constructionPlan: null, //施工方案
					jury: null, //应急处理措施
					acceptProject: null, //验收项目
					acceptStandard: null, //验收标准
					conclusion: null, //结论
					isTemplate: null, //是否是模板 0否，1是
					auditorList: null, //四方审批
					confirmJobBoList: null, //施工前）确认工作
					acceptancerList: null, //验收人员
					scorerList: null, //总结打分人员
					maintainerList: null, //检修人员
					jobCardAndGoodsBoList: null, //物资
					gasDetectionBoList: null //气体检测
				},
				// 作业类型
				workTypeData: [{
					value: 1,
					label: '日修'
				}, {
					value: 2,
					label: '抢修'
				}],
				gasTypeData: [{
						value: 1,
						label: '手动'
					},
					{
						value: 2,
						label: '自动'
					}
				],
				deviceData: [], //设备
				useWorkLiskData: [], //延用工单
				changeAreaLiskData: [], //影响工单
				checkDeptLiskData: [], //检修部门
				factoryManagerData: [], //
				checkPersonLiskData: [], //检修负责人
				deviceProfessionLiskData: [], //设备专业
				craftProfessionLiskData: [], //工艺专业
				electricalInstrumentProfessionLiskData: [], //电仪专业
				safeProfessionLiskData: [], //安全专业
				factoryManagerLiskData: [], //厂长审核人
				fourWorkSure_deviceSurePersonLiskData: [], //设备专业确认人
				fourWorkSure_electricalInstrumentSurePersonLiskData: [], //电仪专业确认人
				fourWorkSure_craftSurePersonLiskData: [], //工艺专业确认人
				fourWorkSure_safeSurePersonLiskData: [], //安全专业确认人
				workPersonData: [], //作业人员
				goodsData: [], //物资数组
				riskData: [], //风险因素
				gascheckData: [], //气体检测开工
				professionData: [{
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
				}], //专业
				processSurePersonData: [], //过程确认人员
				bugSurePersonData: [], //调试验收人员
				sumUpPersonData: [], //总结人员
				restaurants: [], //设备查询
				state: '',
				timeout: null
			}
		},
		computed: {},
		watch: {
			isshow(oldval, newval) {
				// console.log(newval)
				if (newval === false) {
					// console.log(this.showEvent)
					this.getNav()
				}
			},

		},
		created() {
			// this.getDevice() //获取设备
			this.getUser() //获取人员
		},
		mounted() {
			// console.log(this.showPlanId)
			// this.getLookData()
		},
		methods: {
			typechange(num) {
				let val = ''
				for (var i = 0; i < this.gasTypeData.length; i++) {
					if (num === this.gasTypeData[i].value) {
						val = this.gasTypeData[i].label
					}
				}
				return val
			},
			//删除列表
			deleteRow(index, rows) {
				rows.splice(index, 1);
			},
			//保存作业单
			save() {
				console.log(this.formData)
			},
			//获取人员
			getUser() {
				let json = {
					workShopCode: localStorage.getItem('workShopCode'),
					profession: null,
					pageNo: 1,
					pageSize: 50
				}
				// this.checkPersonLiskData = [] //检修负责人
				this.deviceProfessionLiskData = [] //四方审核--设备专业
				this.craftProfessionLiskData = [] //四方审核--工艺专业
				this.electricalInstrumentProfessionLiskData = [] //四方审核--电仪专业
				this.safeProfessionLiskData = [] //四方审核--安全专业
				this.factoryManagerLiskData = [] //厂长审核人
				this.jobCardUser(json).then(res => {
					if (res.data.code == 0) { //查询到数据
						console.log('查找到的所有专业的人员', res.data.data.records)
						let data = res.data.data.records
						for (var i = 0; i < data.length; i++) {
							// this.checkPersonLiskData.push({ //设备负责人
							// 	value: data[i].id,
							// 	label: data[i].name
							// })
							this.factoryManagerLiskData.push({ //厂长
								value: data[i].id,
								label: data[i].name,
								profession: data[i].professionName
							})
							if (data[i].professionName == '设备') {
								this.deviceProfessionLiskData.push({
									value: data[i].id,
									label: data[i].name
								})
							}
							this.fourWorkSure_deviceSurePersonLiskData = this.deviceProfessionLiskData
							if (data[i].professionName == '生产') {
								this.craftProfessionLiskData.push({
									value: data[i].id,
									label: data[i].name
								})
							}
							this.fourWorkSure_craftSurePersonLiskData = this.craftProfessionLiskData
							if (data[i].professionName == '电气') {
								this.electricalInstrumentProfessionLiskData.push({
									value: data[i].id,
									label: data[i].name
								})
							}
							this.fourWorkSure_electricalInstrumentSurePersonLiskData = this
								.electricalInstrumentProfessionLiskData
							if (data[i].professionName == '安全') {
								this.safeProfessionLiskData.push({
									value: data[i].id,
									label: data[i].name
								})
							}
							this.fourWorkSure_safeSurePersonLiskData = this.safeProfessionLiskData
						}
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			querySearchAsync(queryString, cb) {
				this.deviceData = []
				this.getDevice(queryString)
				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => {
					cb(this.deviceData);
				}, 2000 * Math.random());
			},
			createStateFilter(queryString) {
				return (state) => {
					return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
			},
			handleSelect(item) {
				console.log(item)
				this.formData.device = item.label
				this.formData.deviceId = item.value
			},
			//获取设备
			getDevice(name) {
				let json = {
					orgCode: localStorage.getItem('workShopCode'),
					equipName: name,
					pageNo: 1,
					pageSize: 50
				}
				this.deviceData = []
				this.equipByOrg(json).then(res => {
					if (res.data.code == 0) { //查询到数据
						console.log('查找到的设备', res.data.data.record)
						let data = res.data.data.record
						for (var i = 0; i < data.length; i++) {
							this.deviceData.push({
								value: data[i].id,
								label: data[i].name,
								orgName: data[i].orgName
							})
						}
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			//下发验证
			submitEvent() {
				this.submitLoading = true
				setTimeout(() => {
					this.submitLoading = false
					if (!this.selectRow) {
						let auditorList = [{
							lineId: 1,
							maUserBoList: []
						}, {
							lineId: 2,
							maUserBoList: []
						}, {
							lineId: 3,
							maUserBoList: []
						}, {
							lineId: 4,
							maUserBoList: []
						}]
						for (let i = 0; i < this.craftProfessionLiskData.length; i++) { //生产
							auditorList[0].maUserBoList.push({
								userId: this.craftProfessionLiskData[i].value,
								userName: this.allPerson_change(this.craftProfessionLiskData[i].value)
							})
						}
						for (let i = 0; i < this.safeProfessionLiskData.length; i++) { //安全
							auditorList[1].maUserBoList.push({
								userId: this.safeProfessionLiskData[i].value,
								userName: this.allPerson_change(this.safeProfessionLiskData[i].value)
							})
						}
						for (let i = 0; i < this.electricalInstrumentProfessionLiskData.length; i++) { //电气
							auditorList[2].maUserBoList.push({
								userId: this.electricalInstrumentProfessionLiskData[i].value,
								userName: this.allPerson_change(this
									.electricalInstrumentProfessionLiskData[i].value)
							})
						}
						for (let i = 0; i < this.deviceProfessionLiskData.length; i++) { //设备
							auditorList[3].maUserBoList.push({
								userId: this.deviceProfessionLiskData[i].value,
								userName: this.allPerson_change(this.deviceProfessionLiskData[i].value)
							})
						}
						let confirmJobBoList = [{
							lineId: 1,
							lineName: '生产',
							content: this.formData.fourWorkSure_craft,
							confirmerBoList: []
						}, {
							lineId: 2,
							lineName: '安全',
							content: this.formData.fourWorkSure_safe,
							confirmerBoList: []
						}, {
							lineId: 3,
							lineName: '电气',
							content: this.formData.fourWorkSure_electricalInstrument,
							confirmerBoList: []
						}, {
							lineId: 4,
							lineName: '设备',
							content: this.formData.fourWorkSure_device,
							confirmerBoList: []
						}]
						for (let i = 0; i < this.fourWorkSure_craftSurePersonLiskData.length; i++) { //生产
							confirmJobBoList[0].confirmerBoList.push({
								userId: this.fourWorkSure_craftSurePersonLiskData[i].value,
								userName: this.allPerson_change(this.fourWorkSure_craftSurePersonLiskData[
									i].value)
							})
						}
						for (let i = 0; i < this.fourWorkSure_safeSurePersonLiskData.length; i++) { //安全
							confirmJobBoList[1].confirmerBoList.push({
								userId: this.fourWorkSure_safeSurePersonLiskData[i].value,
								userName: this.allPerson_change(this.fourWorkSure_safeSurePersonLiskData[i]
									.value)
							})
						}
						for (let i = 0; i < this.fourWorkSure_electricalInstrumentSurePersonLiskData
							.length; i++) { //电气
							confirmJobBoList[2].confirmerBoList.push({
								userId: this.fourWorkSure_electricalInstrumentSurePersonLiskData[i].value,
								userName: this.allPerson_change(this
									.fourWorkSure_electricalInstrumentSurePersonLiskData[i].value)
							})
						}
						for (let i = 0; i < this.fourWorkSure_deviceSurePersonLiskData.length; i++) { //设备
							confirmJobBoList[3].confirmerBoList.push({
								userId: this.fourWorkSure_deviceSurePersonLiskData[i].value,
								userName: this.allPerson_change(this.fourWorkSure_deviceSurePersonLiskData[
									i].value)
							})
						}
						let acceptancerList = []
						for (let i = 0; i < this.bugSurePersonData.length; i++) { //调试验收
							acceptancerList.push({
								userId: this.bugSurePersonData[i].value,
								userName: this.allPerson_change(this.bugSurePersonData[i].value)
							})
						}
						let scorerList = []
						for (let i = 0; i < this.sumUpPersonData.length; i++) { //总结
							scorerList.push({
								userId: this.sumUpPersonData[i].value,
								userName: this.allPerson_change(this.sumUpPersonData[i].value)
							})
						}
						let maintainerList = []
						for (let i = 0; i < this.workPersonData.length; i++) { //作业人员
							maintainerList.push({
								userId: this.workPersonData[i].value,
								userName: this.allPerson_change(this.workPersonData[i].value)
							})
						}
						this.addJson = {
							jcId: this.showEvent.id, //作业卡id（更新编辑时需要）
							lineId: this.formData.profession, //条线id
							lineName: this.profession_change(this.formData.profession), //条线名称
							shopId: this.formData.checkDeptId, //分厂id（检修部门）
							shopName: this.formData.checkDept, //分厂名称（检修部门）
							directorId: this.formData.checkPerson, //负责人id
							directorName: this.checkPersonLiskData_change(this.formData.checkPerson), //负责人姓名
							jobName: this.formData.name, //项目名称
							type: this.formData.workType, //类型 1日修，2抢修
							jobNo: null, //项目编号
							planStart: this.formData.workTime[0], //计划开始时间
							planEnd: JSON.parse(new Date((this.formData.workTime[1] / 1000 + 86400) * 1000) -
								1), //计划结束时间
							planLong: this.formData.workLongTime, //计划时长
							location: this.formData.deviceAddress, //设备地址
							equipmentType: null, //设备类型
							equipmentId: this.formData.deviceId, //设备id
							equipmentName: this.formData.device, //设备名称
							jobContent: null, //作业内容
							areaName: this.formData.changeArea, //影响区域名称
							prepareJob: null, //准备工作
							risk: this.riskData, //风险-措施
							plantManagerId: null, //分厂厂长id
							plantManagerName: this.formData.factoryManager, //分厂厂长姓名
							courseConfirmerId: null, //过程确认人id
							courseConfirmerName: this.formData.processSurePerson, //过程确认人姓名
							constructionPlan: this.formData.workNav, //施工方案
							jury: null, //应急处理措施
							acceptProject: null, //验收项目
							acceptStandard: this.formData.acceptValue, //验收标准
							conclusion: null, //结论
							isTemplate: null, //是否是模板 0否，1是
							auditorList: auditorList, //四方审批
							confirmJobBoList: confirmJobBoList, //施工前）确认工作
							acceptancerList: acceptancerList, //验收人员
							scorerList: scorerList, //总结打分人员
							maintainerList: maintainerList, //检修人员
							jobCardAndGoodsBoList: null, //物资
							gasDetectionBoList: this.gascheckData //气体检测
						}
						console.log(this.addJson)
						this.updateshow()
					} else {
						//正常是新增的
						console.log(this.formData)
					}
				}, 500)
			},
			updateshow() {
				this.updateJobCard(this.addJson).then(res => {
					if (res.data.code === 0) {
						this.$message({
							message: '保存成功',
							type: 'success'
						})
					} else {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					}
				})
			},
			reset() {
				this.$refs.xForm.clearValidate()
				// console.log(this.$refs.xForm.getItems())//this.$refs.xForm.updateStatus(scope)
			},
			closemodel() {
				this.$emit('closedialog', false)
			},
			//准备新增物资
			goodsAdd() {
				this.goodsLookType = true
			},
			//物资展示与否
			goodsClose(val) {
				this.goodsLookType = val
			},
			//准备新增风险
			riskAdd() {
				this.riskLookType = true
			},
			//风险展示与否
			riskClose(val) {
				console.log(val)
				for (let i = 0; i < val.length; i++) {
					this.riskData.push({
						measure: val[i].measure,
						note: val[i].note,
						riskId: val[i].id,
						riskName: val[i].riskName,
						type: val[i].type,
					})
				}
				this.riskLookType = false
			},
			//准备新增气体
			gasAdd() {
				this.gasLookType = true
			},
			//气体展示与否
			gasClose(val) {
				console.log(val)
				for (let i = 0; i < val.length; i++) {
					this.gascheckData.push(val[i])
				}
				this.gasLookType = false
			},
			workType_change(num) {
				let val = ''
				for (var i = 0; i < this.workTypeData.length; i++) {
					if (num === this.workTypeData[i].value) {
						val = this.workTypeData[i].label
					}
				}
				return val
			},
			//专业转换
			profession_change(num) {
				let val = ''
				for (var i = 0; i < this.professionData.length; i++) {
					if (num === this.professionData[i].value) {
						val = this.professionData[i].label
					}
				}
				// console.log(val)
				return val
			},
			deviceData_change(num) {
				let val = ''
				for (var i = 0; i < this.deviceData.length; i++) {
					if (num === this.deviceData[i].value) {
						val = this.deviceData[i].orgName
					}
				}
				// console.log(val)
				return val
			},
			checkPersonLiskData_change(num) {
				let val = ''
				for (var i = 0; i < this.checkPersonLiskData.length; i++) {
					if (num === this.checkPersonLiskData[i].value) {
						val = this.checkPersonLiskData[i].label
					}
				}
				// console.log(val)
				return val
			},
			//所有人员转换
			allPerson_change(num) {
				let val = ''
				for (var i = 0; i < this.factoryManagerLiskData.length; i++) {
					if (num === this.factoryManagerLiskData[i].value) {
						val = this.factoryManagerLiskData[i].label
					}
				}
				// console.log(val)
				return val
			},
			//获取点检区域
			getNav() {
				let areaJson = {
					jcId: this.showEvent.id
				}
				this.jobCardDetail(areaJson).then(res => {
					if (res.data.code == 0) { //查询到数据
						let data = res.data.data
						console.log(data)
						let workTime = []
						workTime.push(data.planStart)
						workTime.push(data.planEnd)

						this.checkPersonLiskData = [] //检修负责人
						this.workPersonData = [] //作业人员
						for (let i = 0; i < this.factoryManagerLiskData.length; i++) {
							if (this.profession_change(data.lineId) == this.factoryManagerLiskData[i].profession) {
								this.checkPersonLiskData.push({ //设备负责人
									value: this.factoryManagerLiskData[i].value,
									label: this.factoryManagerLiskData[i].label
								})
								this.workPersonData.push({ //作业人员
									value: this.factoryManagerLiskData[i].value,
									label: this.factoryManagerLiskData[i].label
								})
							}
						}
						this.processSurePersonData = this.checkPersonLiskData
						this.bugSurePersonData = this.checkPersonLiskData
						this.sumUpPersonData = this.checkPersonLiskData
						// this.$nextTick(()=>{
						// 	console.log(this.factoryManagerLiskData)
						// })
						console.log(this.checkPersonLiskData)
						this.submitLoading = true
						setTimeout(() => {
							if (data.jobCardAndGoodsBoList != null) { //物资
								this.goodsData = []
								let goodsData = data.jobCardAndGoodsBoList
								for (let i = 0; i < goodsData.length; i++) {
									this.goodsData.push({
										id: i + 1,
										name: goodsData[i].spareName, // 物资名称
										code: goodsData[i].goodsNo, //物资编号
										specs: goodsData[i].spareSize, //物资规格
										twoLevel: goodsData[i].pressurizedDepot, //物资二级库
										shelves: goodsData[i].shelves, //物资货架号
										address: goodsData[i].location, //物资位置
										stock: goodsData[i].inventory, //物资库存
										num: goodsData[i].spareNum, //物资数量
									})
								}
							}
							if (data.risk != null) { //风险
								this.riskData = []
								console.log(JSON.parse(data.risk))
								let riskData = JSON.parse(data.risk)
								for (let i = 0; i < riskData.length; i++) {
									this.riskData.push(riskData[i])
								}
							}
							let workPersonData = [] //作业人员
							if (data.maintainerList != null) {
								for (let i = 0; i < data.maintainerList.length; i++) {
									workPersonData.push(data.maintainerList[i].userId)
								}
							}
							let deviceProfession = [] //四方审核-设备
							if (data.maintainerList != null) {
								for (let i = 0; i < data.maintainerList.length; i++) {
									deviceProfession.push(data.maintainerList[i].userId)
								}
							}
							this.formData = {
								name: data.jobName, //作业名称
								workType: data.type, //作业类型
								workTime: workTime, //作业时间范围
								device: data.equipmentName, //设备
								deviceId: data.equipmentId, //设备
								profession: data.lineId, //专业
								problem: null, //解决问题
								source: this.$parent.source_change(1),
								useWorkLisk: null, //延用工单
								deviceAddress: this.deviceData_change(data.equipmentId), //设备位置
								changeArea: data.areaName, //影响区域
								checkDept: data.shopName, //检修部门
								checkDeptId: data.shopId, //检修部门Id
								checkPerson: data.directorId, //检修负责人
								fourCheck: null, //四方审核/************************************
								deviceProfession: null, //设备专业,多选
								electricalInstrumentProfession: null, //电仪专业，多选
								craftProfession: null, //工艺专业，多选
								safeProfession: null, //安全专业
								factoryManager: data.plantManagerId, //厂长审核人
								fourWorkSure: null, //四方施工确认/************************************
								fourWorkSure_device: null, //四方施工-设备
								fourWorkSure_deviceSurePerson: null, //四方施工-设备确认人
								fourWorkSure_electricalInstrument: null, //四方施工-电仪
								fourWorkSure_electricalInstrumentSurePerson: null, //四方施工-电仪确认人
								fourWorkSure_craft: null, //四方施工-工艺
								fourWorkSure_craftSurePerson: null, //四方施工-工艺确认人
								fourWorkSure_safe: null, //四方施工-安全
								fourWorkSure_safeSurePerson: null, //四方施工-安全确认人
								workNav: data.constructionPlan, //施工方案
								workBefore: data.prepareJob, //作业前准备
								workPerson: null, //作业人员
								workLongTime: data.planLong, //作业时长
								goodsDeploy: null, //物资信息配置
								risk: null, //风险因素
								gascheck: null, //气体检测配置
								processSurePerson: null, //过程确认人员
								bugSurePerson: null, //调试验收人员
								sumUpPerson: null, //总结人员
								acceptValue: data.acceptStandard, //验收标准
							}
							this.submitLoading = false
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
		display: flex;
		justify-content: center;
		align-items: Center;
		margin: 5px 0;
	}

	.textshow_person,
	.gasshow {
		display: flex;
		justify-content: center;
		align-items: Center;
	}

	.goodsList {
		display: block;
		width: 100%;
	}

	.goodsNav {
		width: calc(100% / 8);
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

	.list-item {
		font-size: 12px;
		/* overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap; */
	}
</style>
