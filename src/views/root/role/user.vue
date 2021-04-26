<template>
  <div class="rootuser">
    <el-card class="box-card" shadow="always">
      <el-form :inline="true" :model="user" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model="user.username" placeholder="请输入用户名" @input="user_username_show" clearable />
        </el-form-item>
        <el-form-item label="人员姓名">
          <el-input v-model="user.name" placeholder="请输入人员姓名" @input="user_name_show" clearable />
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
      <el-table v-loading="loading" :data="tableData" :row-key="getRowKeys" border style="width: 100%"
                :max-height="tableHeight">
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
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <el-tag @click="lookList(scope.row)">编辑</el-tag>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="角色配置" placement="bottom">
                <el-tag @click="setRole(scope.row)">角色配置</el-tag>
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
        <el-pagination v-show="total!==0" align="center" :current-page="currentPage" :page-sizes="[5,10,20]"
                       :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
                       @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-card>

    <vxe-modal v-model="showTabs" title="新增&保存" width="60%" min-width="600" height="50%" resize destroy-on-close>
      <template #default>
        <vxe-form :data="group" :rules="groupRules" title-colon title-align="right" title-width="150"
                  ref="xForm" @submit="submitEvent">
          <vxe-form-item title="用户名称" field="name" span="12" :item-render="{}">
            <template #default="scope">
              <el-input v-model="group.name" @input="$refs.xForm.updateStatus(scope)"
                        placeholder="请输入用户名称" clearable></el-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="人员姓名" field="userName" span="12" :item-render="{}">
            <template #default="scope">
              <el-input v-model="group.userName" @input="$refs.xForm.updateStatus(scope)"
                        placeholder="请输入人员姓名" clearable></el-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="手机号" field="phoneNumber" span="12" :item-render="{}">
            <template #default="scope">
              <el-input v-model="group.phoneNumber" @input="$refs.xForm.updateStatus(scope)"
                        placeholder="请输入手机号" clearable></el-input>
            </template>
          </vxe-form-item>
          <vxe-form-item v-if="ytres" title="密码" field="password" span="12" :item-render="{}">
            <template #default="scope">
              <el-input   v-model="group.password" @input="$refs.xForm.updateStatus(scope)"
                          placeholder="请输入密码" clearable></el-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="专业" field="professionName" span="12" :item-render="{}">
            <template #default="scope">
              <el-select v-model="group.professionName" @change="$refs.xForm.updateStatus(scope)"
                         placeholder="请选择专业" clearable>
                <el-option :key="1" value="1" label="生产"></el-option>
                <el-option :key="2" value="2" label="安全"></el-option>
                <el-option :key="3" value="3" label="电气"></el-option>
                <el-option :key="4" value="4" label="设备"></el-option>
              </el-select>
            </template>
          </vxe-form-item>
          <vxe-form-item title="部门选择" field="dept" span="12" :item-render="{}">
            <template #default="scope">
              <el-popover placement="right" width="400" trigger="click" v-model="isdeptshow">
                <div style="height: 200px;overflow-y: scroll;">
                  <el-tree :data="deptList" accordion node-key="id" :default-expanded-keys="updateTree"
                           :expand-on-click-node="false" :props="defaultProps" @node-click="handleNodeClick">
                  </el-tree>
                </div>
                <!-- <el-button slot="reference">选择部门</el-button> -->
                <el-input v-model="group.dept" placeholder="请点击选择部门" slot="reference" clearable />
              </el-popover>
            </template>
          </vxe-form-item>
          <vxe-form-item class="bottomShow" align="center" span="24" :item-render="{}">
            <template #default>
              <vxe-button type="submit" status="primary">确定</vxe-button>
              <vxe-button type="reset">重置</vxe-button>
            </template>
          </vxe-form-item>
        </vxe-form>





      </template>
    </vxe-modal>

    <vxe-modal v-model="showTabs2" title="角色配置" width="60%" min-width="600" height="50%" resize destroy-on-close>
      <template #default>
        <vxe-form :data="roleForm" :rules="roleRules" title-colon title-align="right" title-width="150"
                  ref="xForm" @submit="submitEvent">
          <vxe-form-item title="用户名称"  span="12" :item-render="{}">
            <template #default="scope">
              <el-input v-model="roleForm.name" @input="$refs.xForm.updateStatus(scope)"
                        placeholder="请输入用户名称" disabled></el-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="关联角色" field="roleIds" span="12" :item-render="{}">
            <template #default="scope">
              <el-select v-model="roleForm.roleIds" @change="$refs.xForm.updateStatus(scope)"
                         placeholder="请选择角色" clearable>
                <el-option v-for="list in reData" :key="list.id" :value="list.id" :label="list.roleName"></el-option>
              </el-select>
            </template>
          </vxe-form-item>
          <vxe-form-item class="bottomShow" align="center" span="24" :item-render="{}">
            <template #default>
              <vxe-button type="submit" status="primary">确定</vxe-button>
              <vxe-button type="reset">重置</vxe-button>
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
        ytres: true,
        showTabs: false,
        showTabs2: false,


        roleForm:{
          name:'',
          roleIds:'',
        },
        roleRules: {
          roleIds: [{
            required: true,
            message: '请选择关联角色'
          }],
        },
        group: {
          name: '',
          userName: '',
          phoneNumber: '',
          defaultProps:'',
          dept:'',
          orgCode: '',
          password: '',
          professionName: '',
          personId: '0',

        },
        isdeptshow: false, //部门弹出
        deptList: [],
        updateTree: [],
        defaultProps: {
          children: 'childOrgs',
          label: 'name'
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
        reData: [],
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
      this.getDeptData()
      this.getRoleList()

    },
    methods: {
      //获取角色列表
      getRoleList() {

        let data ={
          size:999,
          current:1,
        }
        this.roleList(data).then(res => {
          this.reData = res.data.data.records
          console.log('获取角色列表', this.reData)
        }).catch(err => {
          console.log(err)
        })
      },
      //获取部门接口
      getDeptData() {
        let json = {
          orgType: 2
        }
        this.updateTree = []
        this.deptList = []
        this.pointPlanFarmDataByUser(json).then(res => {
          if (res.data.code === 0) {
            console.log("部门数据", res.data.data)
            //将设备位置 从左树传给右侧 主界面
            // this.$bus.emit('devicePlace', res.data.data)
            const data = res.data.data
            // this.updateTree[0] = res.data.data[.id]
            this.deptList = data

          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
      },
      handleNodeClick(data) {
        console.log(data);
        this.isdeptshow = false
        this.group.dept = data.name
        this.group.orgCode = data.orgCode
      },
      user_username_show(event) {
        this.jsonData.userName = event
      },
      user_name_show(event) {
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
        this.group = {
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
      submitEvent () {
        this.groupSumbit()
      },
      groupSumbit() {
        this.userAdd(this.group).then(res => {
          if (res.data.code == 0) {
            this.$message.success('操作成功')
            this.showTabs = false
            this.getTable()
          } else {
            this.$message.error('操作失败')
            this.showTabs = false
          }
        })
      },
      //角色配置
      setRole(row){
        console.log('角色配置',row)
        this.roleForm.name = row.name
        this.roleForm.id = row.id
        this.showTabs2 = true

      },
      //编辑
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
        this.userdelete(addJson).then(res => {
          if (res.data.code == 0) {
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
                for (var i = 0; i < data.length; i++) {
                  data[i]['cid'] = that.jsonData.pageNo * that.jsonData.pageSize - that
                    .jsonData.pageSize + i + 1
                }
                that.tableData = data
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
