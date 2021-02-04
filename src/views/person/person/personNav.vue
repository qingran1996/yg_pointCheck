<template>
	<div class="personIndex">
		<el-card class="box-card" shadow="always">
			<el-form :inline="true" :model="person_model" class="demo-form-inline">
				<el-form-item label="人员名称">
					<el-input v-model="person_model.name" placeholder="请输入内容" @change="person_name_show" clearable/>
				</el-form-item>
				<el-form-item label="人员编号">
					<el-input v-model="person_model.code" placeholder="请输入内容" @change="person_code_show" clearable/>
				</el-form-item>
				<el-form-item>
					<el-button size="small" type="primary" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="box-card" shadow="always">
			<el-row style="margin-bottom: 5px;">
				<el-button type="primary" @click="addPerson">新增</el-button>
				<el-button type="danger" @click="deleteItems" :disabled="isDeleteAll">批量删除</el-button>
			</el-row>
			<el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight" @selection-change="selectionchange" :row-key="getRowKeys" ref="multipleTable">
        <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
				<el-table-column prop="index" label="序号" width="100" align="center" />
				<el-table-column prop="name" label="人员姓名" min-width="150" align="center" />
				<el-table-column prop="code" label="人员编号" min-width="150" align="center" />
				<el-table-column prop="sex" label="性别" min-width="150" align="center" />
				<el-table-column prop="dept" label="部门" min-width="150" align="center">
				<template slot-scope="scope">
				  <el-popover trigger="hover" placement="top">
				    <p>部门详情: {{ scope.row.dept }}</p>
				    <!-- <p>最新上传时间: {{ scope.row.attach.createTime }}</p> -->
				   <div slot="reference" class="name-wrapper">
				      <a>{{ scope.row.dept }}</a>
				    </div>
				  </el-popover>
				</template>
				</el-table-column>
				<el-table-column prop="personTypeString" label="人员类型" min-width="150" align="center" />
				<el-table-column prop="phone" label="手机号" min-width="150" align="center" />
				<el-table-column fixed="right" label="操作" min-width="290" align="center">
					<template slot-scope="scope">
						<div class="action">
							<el-tooltip class="item" effect="dark" content="编辑" placement="bottom" :open-delay="220">
								<el-tag @click="updateList(scope.row)">编辑</el-tag>
							</el-tooltip>
              <el-tooltip class="item" effect="dark" content="工作信息" placement="bottom" :open-delay="220">
                <el-tag type="success" @click="personInfo(scope.row)">工作信息</el-tag>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="证书" placement="bottom" :open-delay="220">
                <el-tag  type="info" @click="personCertSet(scope.row)">证书</el-tag>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom" :open-delay="220">
                <el-popover placement="right" width="400" trigger="click" :ref="`popover-${scope.$index}`">
                  <p>确定移除这个人员 <b style="color: red">{{ scope.row.name }}</b> 的信息吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button  size="mini" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                    <el-button type="primary" size="mini" @click="deleteItem(scope.row)">确定</el-button>
                  </div>
                  <el-tag slot="reference" type="danger">删除</el-tag>
                </el-popover>
              </el-tooltip>
							<el-tooltip class="item" effect="dark" content="详情" placement="bottom" :open-delay="220">
								<el-tag @click="lookList(scope.row)" type="warning">详情</el-tag>
							</el-tooltip>
						</div>
					</template>
				</el-table-column>

			</el-table>
			<!-- 分页器 -->
			<div class="block" style="margin-top:15px;">
				<el-pagination v-show="total!==0" align="center" :current-page="currentPage" :page-sizes="[10,15,20]" :page-size="pageSize"
				 layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
			</div>
		</el-card>
		<personDialog/>
    <updateDialog/>
    <deleteDialog/>
    <workInformation/>
    <personCertDialog/>
	</div>
</template>

<script>
	import personDialog from './dialog/editdialog'
  import updateDialog from './dialog/updateDialog'
  import deleteDialog from './dialog/detailDialog'
  import workInformation from '@/views/person/person/dialog/workInformation'
  import personCertDialog from '@/views/relatedUnits/Person/personCertDialog'
	export default {
		name: 'personIndex',
		components: {personDialog,updateDialog,deleteDialog,workInformation,personCertDialog},
		data() {
			return {
				loading: false,
				tableHeight: document.body.clientHeight - 84 - 36 - 50 - 180, // 表格高度
				currentPage: 1,
				pageSize: 10,
				size: 30,
				total: 1,
        chooseId:[],
        isDeleteAll: true, //是否可以批量删除
        personTypeList:[],//人员类型获取
        personStatusList:[],//人员类型获取
				tableData: [{
					name: '设备1',
					code: 'css1',
					sex: '锅炉',
					dept: 'ABC',
					personType: '',
					phone: '',
					status: '运行中',
					createTime: '2019-8-1 08:00:00',
					devicetype: '车闸',
					isTZ: '是'
				}],
				jsonData: {
					orgCode: "0",
					pageNo: 1,
					pageSize: 10
				},
				// 筛选
				person_model: {
					name: '',
					code: ''
				},
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
      this.getPersontype()
      this.getPersonStatus()
      //人员列表请求
      this.getTable()
		},
		destroyed() {
			this.$bus.off('personDialog')
      this.$bus.off('editper')
      this.$bus.off('renderData')
      this.$bus.off('lookperson')
      this.$bus.off('personWorkInfo')
      this.$bus.off('personCertInfo')
		},
		mounted() {
      this.$bus.on('renderData',e=>{
        if (e === true){
          this.getTable() //加载页面
        }
      })
      this.$bus.on('personIndex', (e) => {
        console.log(e)
        this.jsonData = {
          orgCode: e.code,
          pageNo: 1,
          pageSize: 10
        }
        this.currentPage = 1
        this.pageSize = 10
        this.person_model.name=''
        this.person_model.code=''
        this.getTable()
      })
		},
		methods: {
			//点击弹出新增弹框
			addPerson () {
			  let item={
			    ps:true,
          personStatusList :this.personStatusList,
          personTypeList : this.personTypeList
        }
				this.$bus.emit('personDialog',item)
			},
			//人员列表请求
			getTable() {
				this.personData(this.jsonData).then(res => {
						if (res.data.code === 0) {
							//console.log(res.data.data.content)
							let data = res.data.data.content
							this.loading = true
							let that = this
							setTimeout(function() {
								if (data.length !== 0) { //如果请求数据不为空
									that.total = res.data.data.totalElements //列表总数
									for (var i = 0; i < data.length; i++) {
										var obj = {};
										obj.index = that.jsonData.pageNo * that.jsonData.pageSize - that.jsonData.pageSize + i + 1
										obj.id = data[i].id
										obj.name = data[i].name
										obj.code = data[i].code
										if (data[i].sex === 1) {
											obj.sex = '男'
										} else if (data[i].sex === 2) {
											obj.sex = '女'
										} else {
											obj.sex = '未知'
										}
										if (data[i].organization != null) {
											obj.dept = data[i].organization.longName
										} else {
											obj.dept = ''
										}
										obj.personType = data[i].userTypeCode //人员类型
                    obj.personTypeString = data[i].userTypeName
										obj.phone = data[i].phone
                    obj.organization = data[i].organization
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
							this.$message({
								message: res.data.message,
								type: 'warning'
							})
						}
					})
					.catch(res => {
						this.$message({
							message: res.data.message,
							type: 'warning'
						})
					})
			},
      //人员类型获取
      getPersontype(){
			  let parm={
          parentCode:'personType'
        }
			  this.getStateInfo(parm).then(res=>{
			    if (res.data.code === 0){
            this.personTypeList =res.data.data
            //console.log('人员类型获取',this.personTypeList)
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      //获取用工状态
      getPersonStatus(){
        let parm={
          parentCode:'personStatus'
        }
        this.getStateInfo(parm).then(res=>{
          if (res.data.code === 0){
            this.personStatusList =res.data.data
           // console.log('用工状态获取',this.personStatusList)
          }
        }).catch(err=>{
          console.log(err)
        })
      },
			//输入人员名称
			person_name_show(event) {
				//console.log(event)
				this.jsonData.name = event
			},
			//输入人员编号
			person_code_show(event) {
				//	console.log(event)
				this.jsonData.code = event
			},
			onSubmit() {
				this.jsonData.pageNo = 1
				this.jsonData.pageSize = 10
				this.getTable()
			},
			// 编辑
			updateList(item) {
        item.personStatusList = this.personStatusList
        item.personTypeList = this.personTypeList
        this.$bus.emit('editper',item)
			},
      // 人员工作信息
      personInfo(row){
			  let item = row
        item.show = true
        this.$bus.emit('personWorkInfo',item)
      },
			// 详情
			lookList(item) {
        item.personStatusList = this.personStatusList
        item.personTypeList = this.personTypeList
        this.$bus.emit('lookperson',item)
			},
      //证书配置
      personCertSet(row){
			  let item =row
			  this.$bus.emit('personCertInfo',item)
      },
      //删除
      deleteItem(row){
        //console.log(row)
        let parm={
			    code: row.code
        }
        this.$axios.post('/p/person/delete',parm).then(res=>{
          if (res.data.code === 0){
            this.$message.success('成功删除')
            this.currentPage = this.deleteLastPageData(this.total,this.pageSize,this.currentPage)
            this.jsonData.pageNo = this.currentPage
            this.getTable()
          }else {
            this.$message.error(res.data.message)
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      // 批量删除-- el-table 框
      getRowKeys(row) {
        return row.index
      },
      selectionchange(data) {
        this.chooseId = [] //每次选择重置批量
        this.isDeleteAll = data.length === 0
        console.log(data)
        for (let key of data){
          this.chooseId.push(key.code)
        }
        console.log(this.chooseId)
      },
      //批量删除
      deleteItems(){
        return this.$confirm('确定删除这些人员吗？').then(()=>{
          let allcodes={
            codes: this.chooseId
          }
          this.$axios.post('/p/person/deleteIds',allcodes).then(res=>{
            if (res.data.code === 0){
              this.$message.success('批量删除成功')
              setTimeout(()=>{
                this.$refs.multipleTable.clearSelection()
                this.jsonData.orgCode = '0'
                this.jsonData.pageNo = 1
                this.jsonData.pageSize = 10
                this.pageSize=10
                this.currentPage=1
                this.getTable()
              },300)
            }else {
              this.$message.error(res.data.message)
            }
          }).catch(err=>{
            console.log(err)
          })
        })
      },
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`)
				this.currentPage = 1;
				this.pageSize = val;
				this.jsonData.pageSize = val
				this.jsonData.pageNo = 1
				this.getTable()
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`)
				this.currentPage = val;
				this.jsonData.pageNo = val
				this.getTable()
			}
		}
	}
</script>
<style scoped>
	.personIndex {
		padding: 10px;
	}
	.name-wrapper {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: break-all;
	}
</style>
