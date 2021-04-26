<template>
  <div class="domain">
    <el-card class="box-card" shadow="always">
      <el-form :inline="true" :model="jsonData" class="demo-form-inline">
        <el-form-item label="角色名称">
          <el-input v-model="jsonData.name" placeholder="请输入角色名称" @input="user_areaName_show" clearable/>
        </el-form-item>

        <el-form-item>
          <el-button v-prevent-re-click size="small" type="primary" @click="onSubmit(user)">查询</el-button>
          <el-button v-prevent-re-click size="small" type="warning" @click="onreset('person_model')">重置
          </el-button>
          <el-button icon="el-icon-circle-plus-outline" size="small" type="primary" @click="addRoute">新建角色</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-row style="margin-bottom: 5px;">
        <p>
          <vxe-radio-group v-model="selectTab">
            <vxe-radio-button :label="o.groupCode" v-for="o in tabList" :key="o.groupCode"><i class="el-icon-user"></i>{{o.name}}
            </vxe-radio-button>
          </vxe-radio-group>
          <i class="el-icon-circle-plus-outline" @click="showTabs = true">添加</i>
          <i class="el-icon-setting" @click="showTabs2 = true">编辑</i>
        </p>
      </el-row>


      <el-table v-loading="loading" :data="tableData" ref="multipleTable" @selection-change="selectionchange"
                :row-key="getRowKeys" border style="width: 100%" :max-height="tableHeight">
        <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
        <el-table-column prop="id" width="100" label="序号" align="center" fixed>
        </el-table-column>
        <el-table-column prop="roleName" show-overflow-tooltip label="角色名称" min-width="180" align="center"/>
        <el-table-column prop="roleCode" show-overflow-tooltip label="角色编码" min-width="180" align="center"/>

        <el-table-column prop="groupCode" show-overflow-tooltip label="标签" min-width="200" align="center">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <div class="action">
              <el-tooltip class="item" effect="dark" content="菜单权限" placement="bottom">
                <el-tag @click="toMenu(scope.row)">菜单权限</el-tag>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="角色权限" placement="bottom">
                <el-tag @click="toRole(scope.row)">数据权限</el-tag>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <el-tag @click="updateList(scope.row)" type="success">编辑</el-tag>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <el-tag @click="delete_(scope.row)" type="warning">删除</el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="block" style="margin-top:15px;" v-show="showpage">
        <el-pagination v-show="total!==0" align="center" :current-page="currentPage" :page-sizes="[5,10,20,200]"
                       :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
                       @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
      </div>
    </el-card>


    <vxe-modal v-model="showEdit" :title="selectRow ? '编辑&保存' : '新增&保存'"
               width="60%" height="50%" min-width="600"
               :loading="submitLoading" resize destroy-on-close @close="closemodel">
      <template #default>
        <vxe-form :data="formData" :rules="formRules" title-colon title-align="right" title-width="150"
                  ref="xForm" @submit="submitEvent">
          <vxe-form-item title="角色名称" field="roleName" span="12" :item-render="{}">
            <template #default="scope">
              <vxe-input v-model="formData.roleName" @input="$refs.xForm.updateStatus(scope)"
                         placeholder="请输入名称" clearable></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="角色编码" field="roleCode" span="12" :item-render="{}">
            <template #default="scope">
              <vxe-input v-model="formData.roleCode" @input="$refs.xForm.updateStatus(scope)"
                         placeholder="请输入编码" clearable></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="角色标签" field="groupCode" span="12" :item-render="{}">
            <template #default="scope">
              <vxe-select v-model="formData.groupCode" @change="$refs.xForm.updateStatus(scope)"
                          placeholder="请选择标签" clearable>
                <vxe-option v-for="item in tabList" :key="item.id" :value="item.groupCode"
                            :label="item.name">
                </vxe-option>
              </vxe-select>
            </template>
          </vxe-form-item>
          <vxe-form-item title="菜单权限" field="appId" span="12" :item-render="{}">
            <template #default="scope">
              <vxe-select v-model="formData.appId" @change="$refs.xForm.updateStatus(scope)"
                          placeholder="请选择标签" clearable>
                <vxe-option  :key="1" value="1" label="WEB权限"></vxe-option>
                <vxe-option  :key="2" value="2" label="APP权限"></vxe-option>
              </vxe-select>
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

    <vxe-modal v-model="showTabs" title="新增&保存" width="60%" min-width="600"
               resize destroy-on-close>
      <template #default>
        <vxe-form :data="group" :rules="groupRules" title-colon title-align="right" title-width="150"
                  ref="xForm" >
          <vxe-form-item title="标签名称" field="name" span="12" :item-render="{}">
            <template #default="scope">
              <vxe-input v-model="group.name" @input="$refs.xForm.updateStatus(scope)"
                         placeholder="请输入名称" clearable></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="标签编码" field="code" span="12" :item-render="{}">
            <template #default="scope">
              <vxe-input v-model="group.groupCode" @input="$refs.xForm.updateStatus(scope)"
                         placeholder="请输入编码" clearable></vxe-input>
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
    <vxe-modal v-model="showTabs2" title="标签编辑" width="60%" min-width="600"
               resize destroy-on-close>
      <template #default>
        <el-table :data="tabList" @selection-change="selectionchange"
                  :row-key="getRowKeys" border style="width: 100%" :max-height="tableHeight">
          <el-table-column type="index" width="100" label="序号" align="center" fixed>
          </el-table-column>
          <el-table-column prop="groupCode" show-overflow-tooltip label="角色编码" min-width="180" align="center"/>
          <el-table-column prop="name" show-overflow-tooltip label="名称" min-width="180" align="center">
            <template v-slot="spoce">
              {{spoce.row.name}}
              <!--<i class="el-icon-edit" @click="open(spoce.row)"></i>-->
            </template>

          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template slot-scope="scope">
              <div class="action">
                <el-tag @click="deAlremm(scope.row.id)" type="warning">删除</el-tag>
              </div>
            </template>
          </el-table-column>
        </el-table>


      </template>
    </vxe-modal>

    <vxe-modal v-model="showMenu" title="权限设置" width="60%" min-width="600"
               resize destroy-on-close @close="closemodel">
      <template #default>
        <div class="info">
          <p>角色名称：{{menuTitle}}</p>
          <p>排列顺序：1</p>
          <el-button class="sumbit" @click="savesubmit" type="primary">保存</el-button>
        </div>
        <vxe-radio-group v-model="tabIndex">
          <vxe-radio-button label="1" content="菜单权限"></vxe-radio-button>
          <vxe-radio-button label="2" content="数据权限"></vxe-radio-button>
        </vxe-radio-group>

        <el-card class="box-card _box" v-show="tabIndex=='1'">
          <div class="_bar">
            <div class="title">WEB权限</div>
            <el-tree
              :data="WEBTreeData"
              :props="defaultProps2"
              show-checkbox
              node-key="code"
              ref="roles"
              :default-checked-keys="celkALL">
            </el-tree>
          </div>
          <div class="_bar">
            <div class="title">APP权限</div>
            <el-tree
              :data="APPTreeData"
              :props="defaultProps2"
              show-checkbox
              node-key="code"
             >
            </el-tree>
          </div>

        </el-card>
        <el-card class="box-card _box" v-show="tabIndex=='2'">
          <div class="_bar">
            <div class="title">车间</div>

            <el-tree
              ref="roles2"
              :data="pointData"
              :props="defaultProps3"
              show-checkbox
              node-key="orgCode"
              :default-checked-keys="celkSum"
              @check-change="displineC"
            >
            </el-tree>
          </div>
          <div class="_bar">
            <div class="title">专业</div>
            <el-tree
              ref="roles4"
              :data="mdJson"
              :props="defaultProps2"
              show-checkbox
              node-key="id"
              @check-change="displineChange"
              :default-checked-keys="celkSum2"
            >
            </el-tree>
          </div>

        </el-card>

      </template>
    </vxe-modal>


  </div>
</template>

<script>
  export default {
    name: 'rootRole',
    components: {},
    data() {
      return {
        tabList: [],
        selectTab: '1',
        tabIndex: '1',
        activeName: 'first',
        multipleSelection: [],
        props: {
          label: 'name',
          children: 'zones'
        },
        count: 1,
        data: [{
          id: 1,
          label: '一级 2',
          children: [{
            id: 3,
            label: '二级 2-1',
            children: [{
              id: 4,
              label: '三级 3-1-1'
            }, {
              id: 5,
              label: '三级 3-1-2',
            }]
          }, {
            id: 2,
            label: '二级 2-2',
            children: [{
              id: 6,
              label: '三级 3-2-1'
            }, {
              id: 7,
              label: '三级 3-2-2',
              disabled: true
            }]
          }]
        }],
        defaultProps2: {
          children: 'children',
          label: 'name'
        },
        defaultProps3: {
          children: 'childOrgs',
          label: 'name'
        },
        demoRoleCode:'',
        WEBTreeData: [],
        APPTreeData: [],
        pointData: [],
        celkALL:[],
        celkALL2:[],
        celkSum:[],
        whah:[],
        celkSum2:[],
        mdJson:[
          {name:'所有专业',id:'owner'},
          {name:'用户所属专业',id:'all'},
          {
            id: 1,
            name: '生产',
            disabled:false
          },{
            id: 2,
            name: '安全',
            disabled:false
          },{
            id: 3,
            name: '电气',
            disabled:false
          },{
            id: 4,
            name: '设备',
            disabled:false
          }
        ],
        menuTitle:'设备处-设备处处长',
        /**********************vxe-model*/
        submitLoading: false,
        selectRow: null,
        showEdit: false,
        showMenu: false,
        showTabs: false,
        showTabs2: false,

        group: {
          name: '',
          groupCode: '',
        },
        groupRules: {
          name: [{
            required: true,
            message: '请输入名称'
          }],
          groupCode: [{
            required: true,
            message: '请输入编码'
          }],
        },
        formData: {
          roleName: '',
          roleCode: '',
          groupCode: '',
          appId: '',

        },
        formRules: {
          name: [{
            required: true,
            message: '请输入名称'
          }],
          code: [{
            required: true,
            message: '请选择标签'
          }],
        },

        isdeptshow: false, //部门弹出
        isdeptshow1: false, //部门弹出
        defaultProps: {
          children: 'childOrgs',
          label: 'name'
        },
        addOredit: true, //新增还是修改
        listitem: null,
        // 筛选
        user: {
          name: '',
          username: '',
          areaName: '',
          dept: '',
          belongToWay: '',
          state: ''
        },
        loading: false,
        tableHeight: document.body.clientHeight - 84 - 36 - 80 - 152, // 表格高度
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        total: 1,
        showpage: true,

        updateTree: [],
        //展示参数表，并未实际应用
        tableData: [],
        chooseData: [],
        belongToWayData: [{
          value: '1',
          label: '路线1'
        }, {
          value: '2',
          label: '路线2'
        }],
        stateData: [{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '启用'
        }, {
          value: '0',
          label: '禁用'
        }],
        jsonData: {
          // name: '',
          groupCode: '',
          size: 10,
          current: 1
        },
      }
    },
    watch: {
      selectTab(val) {

        console.log(val)
        this.jsonData.groupCode = val
        this.getDataList()
      },
      tabIndex(val) {
        console.log('tabIndex',val)
        if (val==1){

          this.pullMenu(this.demoRoleCode)
        } else {

          this.pullRole(this.demoRoleCode)
        }
      }
    },
    created() {
      //查询区域
      this.getDataList()
      this.getTbs()
      this.getWEB()
      this.getAPP()
      this.getpointPlan()


    },
    methods: {
      open(item) {
        this.$prompt('请输入', '修改名称', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
       }).then(({ value }) => {

         let group={
           name: value,
           groupCode: item.groupCode,
           id: item.id,
         }
          console.log('角色组保存', group)

          this.submitGroup(group).then(res => {
            console.log('角色组保存', res)
            // this.showTabs = false
            this.getTbs()
          }).catch(err => {
            console.log(err)

          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },

      displineChange(node,checked, isSubChecked){
        console.log(node.id);
        if(checked){
          if(node.id=="all" || node.id=="owner" || node.id=="children"){
            let checkDisplines = this.$refs.roles4.getCheckedKeys();
            for (let i = 0; i < checkDisplines.length; i++) {
              if(checkDisplines[i]!=node.id){
                // console.log(this.$refs.roles4.getNode(checkDisplines[i]));
                this.$refs.roles4.getNode(checkDisplines[i]).setChecked(false);
              }
            }
          }else{
            this.$refs.roles4.getNode("all").setChecked(false);
            this.$refs.roles4.getNode("owner").setChecked(false);
            this.$refs.roles4.getNode("children").setChecked(false);
          }
        }
      },
      displineC(node,checked, isSubChecked){
        console.log(node.orgCode);
        if(checked){
          if(node.orgCode=="all" || node.orgCode=="owner" || node.orgCode=="children"){
            let checkDisplines = this.$refs.roles2.getCheckedKeys();
            for (let i = 0; i < checkDisplines.length; i++) {
              if(checkDisplines[i]!=node.orgCode){
                // console.log(this.$refs.roles2.getNode(checkDisplines[i]));
                this.$refs.roles2.getNode(checkDisplines[i]).setChecked(false);
              }
            }
          }else{
            this.$refs.roles2.getNode("all").setChecked(false);
            this.$refs.roles2.getNode("owner").setChecked(false);
            this.$refs.roles2.getNode("children").setChecked(false);
          }
        }
      },
      alrem() {
        console.log('标签编辑')
      },
      deAlremm(ids) {
        console.log('标签删除')
        this.$confirm('是否删除当前选中标签?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.deleGroup(ids).then(res => {
            console.log('标签删除', res.data.code)
            if (res.data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.showTabs2 = false
              this.getTbs()
            } else {
              this.showTabs2 = false
              this.$message({
                message: res.data.message,
                type: 'warning'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },

      groupSumbit() {
        this.submitGroup(this.group).then(res => {
          console.log('角色组保存', res)
          this.showTabs = false
          this.getTbs()
        }).catch(err => {
          console.log(err)
          this.showTabs = false
        })
      },
      addGrop() {
        this.showTabs = true
      },
      onSubmit(item) {

        this.jsonData.size = 10
        this.jsonData.current = 1
        this.getDataList()
      },
      getDataList() {
        this.roleList(this.jsonData).then(res => {
          this.tableData = res.data.data.records
          console.log('表数据', this.tableData)
        }).catch(err => {
          console.log(err)
        })
      },
      //查询标签组
      getTbs() {
        this.listGroup().then(res => {
          this.tabList = res.data.data
          this.selectTab = this.tabList[0].groupCode
          console.log('标签组', this.tabList)
        }).catch(err => {
          console.log(err)
        })

      },
      getWEB() {
        this.getWEBTree().then(res => {
          console.log('WEBTree', res.data.data)
          this.WEBTreeData = res.data.data
          // this.showMenu = true
        }).catch(err => {
          console.log(err)
        })


      },
      getAPP(){
        this.getAPPTree().then(res => {
          console.log('APPTree', res.data.data)
          this.APPTreeData = res.data.data
          // this.showMenu = true
        }).catch(err => {
          console.log(err)
        })
      },
      getpointPlan(){
        this.pointPlanFarmData({orgType: 2}).then(res => {

          this.pointData = res.data.data
          console.log('pointData3', this.pointData )
          this.pointData.forEach(o =>{
            o.disabled = false
            if (o.childOrgs.length!=0){
              o.childOrgs.forEach(i =>{
                i.disabled = false
              })
            }
          })

          this.pointData.unshift({name:'下属部门',orgCode:'children'})
          this.pointData.unshift({name:'所有车间',orgCode:'owner'})
          this.pointData.unshift({name:'用户所属车间',orgCode:'all'})


        }).catch(err => {
          console.log(err)
        })
      },
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
      handleNodeClick(data) {
        console.log(data);
      },

      pullMenu(code){
        this.getAllMenuByRole({roleCode:code}).then(res => {
          console.log('pullMenu6', res.data)
          if (res.data.code == 0){
            const Data = res.data.data
            if (Data.length!=0){
              let Menu = []
              Data.forEach(o =>{
                Menu.push(o.code)
              })

              this.celkALL = Menu
              this.$forceUpdate()
              this.showMenu = true
            }else {
              this.celkALL = []
              this.showMenu = true
            }

          } else {
            this.$message.error('操作失败')
          }

          return
          if (Menu.includes('all')||Menu.includes('owner')||Menu.includes('children')){
            Menu=[]
            if (Menu.includes('all')){
              Menu.push('all')
            }
            if (Menu.includes('owner')){
              Menu.push('owner')
            }
            if (Menu.includes('children')){
              Menu.push('children')
            }
            this.pointData.forEach(o =>{

              o.disabled = false
              if (o.childOrgs.length!=0){
                o.childOrgs.forEach(i =>{
                  i.disabled = false
                })
              }
            })


          }


        }).catch(err => {
          console.log(err)
        })
      },
      pullRole(code){
        this.getScope(code).then(res => {
          console.log('pullRole', res.data.data)
          if (res.data.code == 0){
            const Data = res.data.data
            if (Data.length!=0){
              let Menu1 = []
              let Menu2 = []
              Data.forEach(o =>{
                let arr =JSON.parse(o.scopeData).orgCode
                let arr2 =JSON.parse(o.scopeData).major
                for (let i=0;i<arr.length;i++) {
                  if (arr[i]) {
                    Menu1.push(arr[i])
                  }
                }
                for (let j=0;j<arr2.length;j++) {
                  if (arr2[j]) {
                    Menu2.push(arr2[j])
                  }

                }


              })
              // console.log(Menu1)
              // console.log(Menu2)

              this.celkSum = Menu1
              this.celkSum2 = Menu2

              this.$forceUpdate()
              this.showMenu = true
            }else {
              this.celkALL = []
              this.showMenu = true
            }

          } else {
            this.$message.error('操作失败')
          }




        }).catch(err => {
          console.log(err)
        })
      },

      toMenu(item) {
         console.log(item) //roleCode
        this.tabIndex = '1'
        this.demoRoleCode = item.roleCode  //保存在本地
        this.menuTitle = item.roleName
        this.pullMenu(item.roleCode)
        this.pullRole(item.roleCode)

        // this.showMenu = true
      },
      toRole(item) {
        console.log(item)  //roleCode
        this.tabIndex = '2'
        this.demoRoleCode = item.roleCode
        this.menuTitle = item.roleName
        this.pullMenu(item.roleCode)
        this.pullRole(item.roleCode)
        // this.showMenu = true


      },
      handleClick(tab, event) {
        console.log(tab, event);
      },

      // 添加信息
      addRoute() {
        this.formData = {
          roleName: '',
          roleCode: '',
          groupCode:'',
          id:''

        }
        this.selectRow = null
        this.showEdit = true
      },
      updateList(item) {
        console.log(item)
        this.formData = {
          roleName: item.roleName,
          roleCode: item.roleCode,
          groupCode: item.groupCode,
          id:item.id

        }

        this.selectRow = item
        this.showEdit = true
      },
      submitEvent() {
        console.log('submitEvent')
        this.submitLoading = true
        setTimeout(() => {
          this.submitLoading = false
          if (this.selectRow) {
            console.log(this.formData)
            this.updateArea()
          } else {
            console.log(this.formData)
            this.addR()
          }
        }, 500)
      },
      //新增角色
      addR() {
        console.log('新增角色',this.formData)
       let data = {
         roleName: this.formData.roleName,
         roleCode: this.formData.roleCode,
         groupCode: this.formData.groupCode,
         appId: this.formData.appId,
       }
       this.setRoleDel(data)
      },
      //编辑角色
      updateArea() {
        console.log('updateArea角色',this.formData )
        let data = {
          roleName: this.formData.roleName,
          roleCode: this.formData.roleCode,
          groupCode: this.formData.groupCode,
          appId: this.formData.appId,
          id:this.formData.id
        }
        this.setRoleDel(data)
      },
      setRoleDel(data){
        this.setRole(data).then(res => {
          console.log('新增角色', res)
          if (res.data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.showEdit = false
            this.getDataList()
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
      },
      closemodel() {
        console.log('关闭对话框')
        // this.checked = true
      },
      dataUpdate(val) {
        this.addOredit = !this.addOredit
        console.log('区域列表更新')
        this.getDataList()
      },
      handleNodeClick(data) {
        console.log(data);
        this.isdeptshow = false
        this.user.dept = data.name
        this.jsonData.orgCode = data.orgCode
      },
      handleNodeClick1(item) {
        // this.$refs.xForm.updateStatus(scope)
        console.log(item);
        this.isdeptshow1 = false
        this.formData.dept = item.name

      },
      switchStatus(item) {
        // console.log(item)
        let reason = ''
        if (item.state) {
          reason = '启用'
        } else {
          reason = '禁用'
        }
        this.$axios.get('/area/switchStatus?id=' + item.id).then(res => {
          if (res.data.code === 0) {
            this.$message({
              message: item.areaName + '已经' + reason,
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

      savesubmit(){

        if (this.tabIndex==1){
          console.log('保存菜单权限')
          this.saveMenudata()
        }else {
          console.log('保存数据权限')
          this.saveRoledata()
        }
      },
      saveRoledata(){
        let orgCode = this.$refs.roles2.getCheckedKeys()
        let major = this.$refs.roles4.getCheckedKeys()
        console.log(orgCode)
        console.log(major)
        let data = {
          roleCode:this.demoRoleCode,
          scopeData:{
            major:major,
            orgCode:orgCode,
          }
        }

          if (major.includes('all')||major.includes('owner')||major.includes('children')) {
            let smal=[]
            if (major.includes('all')) {
              smal.push('all')
            }
            if (major.includes('owner')) {
              smal.push('owner')
            }
            if (major.includes('children')) {
              smal.push('children')
            }

             data = {
              roleCode:this.demoRoleCode,
              scopeData:{
                major:smal,
                orgCode:orgCode,
              }
            }

          }


        this.saveRole(data).then(res => {
          if (res.data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.showMenu = false
          }else {
            this.$message.error('操作失败')
          }
        })
      },
      saveMenudata(){
        let celkALL = this.$refs.roles.getCheckedKeys()
        console.log(celkALL)
        let data = {
          roleCode:this.demoRoleCode,
          menuCodes:celkALL
        }
        this.saveMenu(data).then(res => {
          if (res.data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.showMenu = false
          }else {
            this.$message.error('操作失败')
          }
        })
      },
      user_areaName_show(event) {
        this.jsonData.name = event
      },
      selectionchange(data) {
        console.log(data)
        this.chooseData = data
      },
      getRowKeys(row) {
        return row.cid; // cid为列表数据的唯一标识
      },
      delete_() {
        this.$confirm('是否删除当前选中设备?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      loadNode(node, resolve) {

      },
       //重置搜索条件
      onreset(formName) {
        // this.$refs[formName].resetFields();
        this.jsonData = {
          name: '',
          pageNo: 1,
          pageSize: 10
        }
        this.user = {
          name: '',
          username: '',
          areaName: '',
          dept: '',
          belongToWay: '',
          state: ''
        }
      },
      handleSizeChange(val) {
        this.jsonData.size = val
        this.jsonData.current = 1
        this.getDataList()
      },
      handleCurrentChange(val) {
        this.jsonData.current = val
        this.getDataList()
      },

    }
  }
</script>
<style scoped>
  .domain {
    padding: 10px;
  }

  .el-icon-circle-plus-outline, .el-icon-setting {
    color: #1890ff;
    cursor: pointer;
  }

  .info {
    position: relative;
  }

  .sumbit{
    position: absolute;
    right: 50px;
    top: 30px;
  }
  ._box {
    width: 100%;
    height: 100%;
  }

  ._bar {
    width: 40%;
    height: 100%;
    min-height: 500px;
    float: left;
    border: 1px solid #eee;
  }

  .title {
    width: 50%;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eee;
    border-right: 1px solid #eee;
    text-align: center;
  }
</style>
