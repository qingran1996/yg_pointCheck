<template>
	<div class="rootuser">
		<el-card class="box-card" shadow="always">
		  <el-form :inline="true" :model="user" class="demo-form-inline">
		    <el-form-item label="用户名">
		      <el-input v-model="user.username" placeholder="请输入用户名" @input="user_username_show" clearable/>
		    </el-form-item>
		    <el-form-item label="人员姓名">
		      <el-input v-model="user.name" placeholder="请输入人员姓名" @input="user_name_show" clearable/>
		    </el-form-item>
		    <el-form-item>
		      <el-button size="small" type="primary" @click="onSubmit(user)">查询</el-button>
		    </el-form-item>
		  </el-form>
		</el-card>
		<el-card class="box-card" shadow="always">
			<el-row style="margin-bottom: 5px;">
				<el-button type="primary" @click="adduser">新增用户</el-button>
			</el-row>
			<el-table v-loading="loading" :data="tableData" :row-key="getRowKeys" border style="width: 100%" :max-height="tableHeight">
				<!-- <el-table-column type="index" label="序号" width="100" align="center" /> -->
				<el-table-column prop="cid" width="100" label="序号" align="center" fixed>
				</el-table-column>
				<el-table-column prop="userName" label="用户名" min-width="180" align="center" />
				<el-table-column prop="name" label="人员姓名" min-width="180" align="center" />
				<el-table-column prop="lastLoginIp" show-overflow-tooltip label="登录IP" min-width="180" align="center" />
				<!-- <el-table-column prop="createTime" show-overflow-tooltip label="创建时间" min-width="180" align="center" />
				<el-table-column prop="updateTime" show-overflow-tooltip label="更新时间" min-width="180" align="center" /> -->
				<el-table-column fixed="right" label="操作" min-width="180" align="center">
					<template slot-scope="scope">
						<div class="action">
							<el-tooltip class="item" effect="dark" content="角色配置" placement="bottom">
								<el-tag @click="lookList(scope.row)">角色配置</el-tag>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="删除" placement="bottom">
								<el-tag @click="deleteList(scope.row)" type="danger">删除</el-tag>
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
		<!-- 配置角色 -->
		<userEdit></userEdit>
		<!-- 新增 -->
		<userAdd></userAdd>

    <vxe-modal v-model="showTabs" title="新增&保存" width="60%" min-width="600" height="50%"
               resize destroy-on-close>
      <template #default>
        <vxe-form :data="group" :rules="groupRules" title-colon title-align="right" title-width="150"
                  ref="xForm" >
          <vxe-form-item title="用户名称" field="name" span="12" :item-render="{}">
            <template #default="scope">
              <vxe-input v-model="group.name" @input="$refs.xForm.updateStatus(scope)"
                         placeholder="请输入用户名称" clearable></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="人员姓名" field="userName" span="12" :item-render="{}">
            <template #default="scope">
              <vxe-input v-model="group.userName" @input="$refs.xForm.updateStatus(scope)"
                         placeholder="请输入人员姓名" clearable></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="手机号" field="phoneNumber" span="12" :item-render="{}">
            <template #default="scope">
              <vxe-input v-model="group.phoneNumber" @input="$refs.xForm.updateStatus(scope)"
                         placeholder="请输入手机号" clearable></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item v-if="ytres" title="密码" field="password" span="12" :item-render="{}">
            <template #default="scope">
              <vxe-input type="password" v-model="group.password" @input="$refs.xForm.updateStatus(scope)"
                         placeholder="请输入密码" clearable></vxe-input>
            </template>
          </vxe-form-item>
          <!--<vxe-form-item title="专业" field="profession" span="12" :item-render="{}">-->
            <!--<template #default="scope">-->
              <!--<vxe-input v-model="group.profession" @input="$refs.xForm.updateStatus(scope)"-->
                         <!--placeholder="请输入人员姓名" clearable></vxe-input>-->
            <!--</template>-->
          <!--</vxe-form-item>-->
          <vxe-form-item title="专业" field="professionName" span="12" :item-render="{}">
            <template #default="scope">
              <vxe-select v-model="group.professionName" @change="$refs.xForm.updateStatus(scope)"
                          placeholder="请选择标签" clearable>
                <vxe-option  :key="1" value="1" label="生产"></vxe-option>
                <vxe-option  :key="2" value="2" label="安全"></vxe-option>
                <vxe-option  :key="3" value="3" label="电气"></vxe-option>
                <vxe-option  :key="4" value="4" label="设备"></vxe-option>
              </vxe-select>
            </template>
          </vxe-form-item>


          <vxe-form-item class="bottomShow" align="center" span="24" :item-render="{}">
            <template #default>
              <vxe-button @click="groupSumbit" status="primary">确定</vxe-button>
              <vxe-button @click="showTabs=false">取消</vxe-button>
            </template>
          </vxe-form-item>
        </vxe-form>
      </template>
    </vxe-modal>
	</div>
</template>

<script>
	import userEdit from "../rootAction/userEdit.vue"
	import userAdd from "../rootAction/userAdd.vue"
	export default {
		name: 'Rootuser',
		components: {
			userEdit,
			userAdd
		},
		data() {
			return {
				// 筛选
        ytres:true,
        showTabs: false,
        group: {
          name: '',
          userName: '',
          phoneNumber: '',
          password: '',
          professionName: '',
          personId: '0',
        },
        groupRules: {
          name: [{
            required: true,
            message: '请输入名称'
          }],
          userName: [{
            required: true,
            message: '请输入人员姓名'
          }],
          phoneNumber: [{
            required: true,
            message: '请输入手机号'
          }],
          password: [{
            required: true,
            message: '请输入密码'
          }],
          professionName: [{
            required: true,
            message: '请选择专业'
          }],
        },
				user: {
				  name: '',
				  personName: ''
				},
				loading: false,
				tableHeight: document.body.clientHeight - 84 - 36 - 50 - 152, // 表格高度
				currentPage: 1,
				pageSize: 10,
				totalPages: 0,
				jsonData: {
					userName: '',
					name: "",
					pageNo: 1,
					pageSize: 10
				},
				total: 1,
				showpage: true,
				//展示参数表，并未实际应用
				tableData: [],
			}
		},
		destroyed() {
			// this.$bus.off('roleTable_update')
			this.$bus.off('userAdd')
			this.$bus.off('userLook')
			// this.$bus.off('roleUpdate')
		},
		created() {
			this.getTable() //获取table数据
			this.$bus.$on("userTable_update", msg => {
				// this.currentPage = 1
				// this.jsonData.pageNo = 1
				this.getTable() //请求数据
			});
		},
		methods: {
			user_username_show (event) {
				this.jsonData.userName = event
			},
			user_name_show (event) {
				this.jsonData.name = event
			},
			onSubmit(item) {
				this.jsonData.pageNo = 1
				this.jsonData.pageSize = 10
				this.getTable()
			},
			//新增角色
			adduser() {
			  this.ytres = true
        this.group =   {
            name: '',
            userName: '',
            phoneNumber: '',
            password: '',
            professionName: '',
            personId: '0',
        },
			  this.showTabs = true
				// this.$bus.$emit('userAdd', true)
				//this.$bus.$emit('roleAdd', true)
			},

      groupSumbit() {
			  this.userAdd(this.group).then(res =>{
          if (res.data.code==0){
            this.$message.success('操作成功')
            this.showTabs = false
            this.getTable()
          } else {
            this.$message.error('操作失败')
            this.showTabs = false
          }
        })
      },
			//查看
			lookList(row) {
				// this.$bus.$emit('userLook', row)
        this.ytres = false
        this.showTabs = true

        this.group.name = row.name
        this.group.userName = row.userName
        this.group.phoneNumber = row.phoneNumber
        this.group.password = row.password
        this.group.professionName = row.professionName
        this.group.personId = '0'
        console.log(row)
			},
			//删除
			deleteList(row) {
				// console.log(row)
				this.$confirm('是否删除该用户?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.deletedata(row)
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			deletedata(row) {
				let addJson = {
					userName: row.userName
				}
				//console.log(addJson)
				this.userdelete(addJson).then(res =>{
				  if (res.data.code==0){
				    this.$message.success('操作成功')
            this.getTable()
          } else {
            this.$message.error('操作失败')
          }

        })
			},
			getRowKeys(row) {
				return row.cid; // cid为列表数据的唯一标识
			},
			//获取table数据
			getTable() {
				this.getNetworkPerson(this.jsonData).then(res => {
					if (res.data.code === 0) { //查询到数据
						//console.log(res)
						let data = res.data.data.records
						console.log('用户管理请求------->', data)
						// this.numberPage = res.data.data.number
						//console.log('当前页数数据数量', this.numberPage)
						this.loading = true
						let that = this
						that.tableData = []
						setTimeout(function() {
							if (data.length !== 0) { //如果请求数据不为空
								that.total = res.data.data.total //列表总数
								// that.totalPages = res.data.data.totalPages
                that.tableData =data
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
	.rootuser {
		padding: 10px;
	}
</style>
