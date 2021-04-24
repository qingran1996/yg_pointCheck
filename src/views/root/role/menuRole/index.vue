<template>
  <div class="domain">
    <el-card class="box-card" shadow="always">
      <el-form :inline="true" :model="user" class="demo-form-inline">
        <el-form-item label="角色名称">
          <el-input v-model="user.areaName" placeholder="请输入角色名称" @input="user_areaName_show" clearable/>
        </el-form-item>

        <el-form-item>
          <el-button v-prevent-re-click size="small" type="primary" @click="onSubmit(user)">查询</el-button>
          <el-button v-prevent-re-click size="small" type="warning" @click="onreset('person_model')">重置
          </el-button>
          <el-button icon="el-icon-circle-plus-outline" size="small" type="primary" @click="addRoute">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-row style="margin-bottom: 5px;">
        <p>
          <vxe-radio-group v-model="selectTab">
            <vxe-radio-button :label="o.value" v-for="o in tabList" :key="o.value"><i class="el-icon-s-operation"></i>{{o.name}}</vxe-radio-button>
          </vxe-radio-group>
          <i class="el-icon-circle-plus-outline"></i>
        </p>
      </el-row>


      <el-table v-loading="loading" :data="tableData" ref="multipleTable" @selection-change="selectionchange"
                :row-key="getRowKeys" border style="width: 100%" :max-height="tableHeight">
        <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
        <el-table-column prop="cid" width="100" label="序号" align="center" fixed>
        </el-table-column>
        <el-table-column prop="areaName" show-overflow-tooltip label="角色名称" min-width="180" align="center"/>
        <el-table-column prop="dept" show-overflow-tooltip label="角色编码" min-width="180" align="center"/>

        <el-table-column prop="state" show-overflow-tooltip label="标签" min-width="200" align="center">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <div class="action">
              <el-tooltip class="item" effect="dark" content="菜单权限" placement="bottom">
                <el-tag @click="toMenu(scope.row)">菜单权限</el-tag>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="角色权限" placement="bottom">
                <el-tag @click="toMenu(scope.row)">角色权限</el-tag>
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


    <vxe-modal v-model="showEdit" :title="selectRow ? '区域编辑&保存' : '区域新增&保存'" width="60%" min-width="600"
               :loading="submitLoading" resize destroy-on-close @close="closemodel">
      <template #default>
        <vxe-form :data="formData" :rules="formRules" title-colon title-align="right" title-width="150"
                  ref="xForm" @submit="submitEvent">
          <vxe-form-item title="区域名称" field="name" span="12" :item-render="{}">
            <template #default="scope">
              <vxe-input v-model="formData.name" @input="$refs.xForm.updateStatus(scope)"
                         placeholder="请输入区域名称" clearable></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="部门选择" field="dept" span="12" :item-render="{}">
            <template #default="scope">
              <el-popover placement="right" width="400" trigger="click" v-model="isdeptshow1">
                <div style="height: 200px;overflow-y: scroll;">
                  <el-tree :data="deptList" accordion node-key="id"
                           :default-expanded-keys="updateTree" :expand-on-click-node="false"
                           :props="defaultProps" @node-click="handleNodeClick1"></el-tree>
                </div>

                <vxe-input slot="reference" v-model="formData.dept"
                           @input="$refs.xForm.updateStatus(scope)" placeholder="请点击选择部门" clearable>
                </vxe-input>
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

    <vxe-modal v-model="showMenu" title="权限设置" width="60%" min-width="600"
                resize destroy-on-close @close="closemodel">
      <template #default>
        <div class="info">
          <p>角色名称：设备处-设备处处长</p>
          <p>排列顺序：1</p>
        </div>
          <vxe-radio-group v-model="selectTab2">
            <vxe-radio-button label="tab1" content="菜单权限"></vxe-radio-button>
            <vxe-radio-button label="tab2" content="数据权限"></vxe-radio-button>

          </vxe-radio-group>

        <el-card class="box-card _box" v-if="selectTab2=='tab1'">
          <div class="_bar">
            <div class="title">WEB权限</div>
            <el-tree
              :props="props"
              :load="loadNode"
              lazy
              show-checkbox
              @check-change="handleCheckChange">
            </el-tree>
          </div>
          <div class="_bar">
            <div class="title">APP权限</div>
          </div>

        </el-card>
        <el-card class="box-card _box" v-if="selectTab2=='tab2'">
          <div class="_bar">
            <div class="title">车间</div>
            <el-tree
              :props="props"
              :load="loadNode"
              lazy
              show-checkbox
              @check-change="handleCheckChange">
            </el-tree>
          </div>
          <div class="_bar">
            <div class="title">专业</div>
            <el-tree
              :props="props"
              :load="loadNode"
              lazy
              show-checkbox
              @check-change="handleCheckChange">
            </el-tree>
          </div>

        </el-card>

      </template>
    </vxe-modal>


  </div>
</template>

<script>
  import bus from "../../../../utils/bus"

  export default {
    name: 'menuRole',
    components: {},
    data() {
      return {
        tabList: [
          {
            name: '系统管理员',
            value: '1',
          },
          {
            name: '设备处',
            value: '2',
          },
          {
            name: '电力分厂',
            value: '3',
          },
          {
            name: '动力车间',
            value: '4',
          },
          {
            name: '设备管理科',
            value: '5',
          },
          {
            name: '未分配',
            value: '6',
          },
          {
            name: '测试部门',
            value: '7',
          }
        ],
        selectTab: '1',
        selectTab2: 'tab2',
        activeName: 'first',
        multipleSelection: [],
        props: {
          label: 'name',
          children: 'zones'
        },
        count: 1,


        /**********************vxe-model*/
        submitLoading: false,
        selectRow: null,
        showEdit: false,
        showMenu: false,
        formData: {
          name: '',
          dept: '',
          version: '',
          belongToLine: '',
          state: '',
          remarks: ''
        },
        formRules: {
          name: [{
            required: true,
            message: '请输入区域名称'
          }],
          dept: [{
            required: true,
            message: '请选择部门'
          }],
          version: [{
            required: true,
            message: '请输入版本号'
          }],
        },
        addJson: { //提交参数
          name: '',
          orgCode: '',
          orgName: '',
          version: ''
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
        deptList: [],
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
          name: '',
          orgCode: '',
          status: '',
          pageNo: 1,
          pageSize: 10
        },
      }
    },
    created() {
      //查询区域
      this.getData()
      this.getDeptData()

    },
    methods: {

      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
      handleNodeClick(data) {
        console.log(data);
      },
      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve([{ name: 'region1' }, { name: 'region888' }]);
        }
        if (node.level > 3) return resolve([]);

        var hasChild;
        if (node.data.name === 'region1') {
          hasChild = true;
        } else if (node.data.name === 'region2') {
          hasChild = false;
        } else {
          hasChild = Math.random() > 0.5;
        }

        setTimeout(() => {
          var data;
          if (hasChild) {
            data = [{
              name: 'zone' + this.count++
            }, {
              name: 'zone' + this.count++
            }];
          } else {
            data = [];
          }

          resolve(data);
        }, 500);
      },


      toMenu(){
        this.showMenu = true
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },

      // 添加信息
      addRoute() {
        // console.log(this.selectTab)
        this.formData = {
          name: '',
          dept: '',
          version: '',
          belongToLine: '',
          state: '',
          remarks: ''
        }
        this.addJson = {
          name: '',
          orgCode: '',
          orgName: ''
        }
        this.selectRow = null
        this.showEdit = true
      },
      updateList(item) {
        console.log(item)
        this.formData = {
          name: item.areaName,
          dept: item.dept,
          version: item.cid,
          belongToLine: '',
          state: '',
          remarks: ''
        }
        this.addJson = {
          name: item.areaName,
          orgCode: item.orgCode,
          orgName: item.dept
        }
        this.addJson['id'] = item.id
        this.selectRow = item
        this.showEdit = true
      },
      submitEvent() {
        console.log('submitEvent')
        this.submitLoading = true
        setTimeout(() => {
          this.submitLoading = false
          if (this.selectRow) {
            this.addJson.name = this.formData.name
            console.log(this.addJson)
            this.updateArea()
          } else {
            this.addJson.name = this.formData.name
            console.log(this.addJson)
            this.addArea()
          }
        }, 500)
      },
      addArea() {
        this.areaAdd(this.addJson).then(res => {
          if (res.data.code === 0) {
            this.$message({
              message: '新增区域成功',
              type: 'success'
            })
            this.showEdit = false
            this.getData()
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
      },
      updateArea() {
        this.areaUpdate(this.addJson).then(res => {
          if (res.data.code === 0) {
            this.$message({
              message: '更新区域成功',
              type: 'success'
            })
            this.showEdit = false
            this.getData()
          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
      },
      closemodel() {
        // console.log('关闭对话框')
        this.checked = true
      },
      dataUpdate(val) {
        this.addOredit = !this.addOredit
        console.log('区域列表更新')
        this.getData()
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
        this.addJson.orgName = item.name
        this.addJson.orgCode = item.orgCode
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
      //获取部门接口
      getDeptData() {
        let json = {
          orgCode: ""
        }
        this.updateTree = []
        this.deptList = []
        this.deptData(json).then(res => {
          if (res.data.code === 0) {
            console.log("部门数据", res.data.data)
            //将设备位置 从左树传给右侧 主界面
            // this.$bus.emit('devicePlace', res.data.data)
            const data = res.data.data
            this.updateTree[0] = res.data.data.id
            this.deptList.push(data)

          } else {
            this.$message({
              message: res.data.message,
              type: 'warning'
            })
          }
        })
      },
      //查询区域
      getData() {
        this.areaData(this.jsonData).then(res => {
          if (res.data.code === 0) { //查询到数据
            //console.log(res)
            let data = res.data.data.records
            console.log('区域列表查询', data)
            this.numberPage = res.data.data.current
            //console.log('当前页数数据数量', this.numberPage)
            this.loading = true
            let that = this
            setTimeout(function () {
              if (data.length !== 0) { //如果请求数据不为空
                that.total = res.data.data.total //列表总数
                for (var i = 0; i < data.length; i++) {
                  var obj = {}
                  obj.cid = that.jsonData.pageNo * that.jsonData.pageSize - that.jsonData
                    .pageSize + i + 1
                  obj.areaName = data[i].name
                  obj.id = data[i].id
                  obj.ewm = JSON.stringify(data[i].id) //id -》二维码
                  obj.code = data[i].code
                  obj.data = data[i]
                  obj.orgCode = data[i].orgCode
                  obj.dept = data[i].orgName
                  obj.version = data[i].cid
                  obj.edition = data[i].version
                  obj.state = data[i].status == 0 ? '禁用' : '启用'
                  obj.isUse = data[i].status == 0 ? '启用' : '禁用' //只为了切换用，其实反的
                  that.tableData.push(obj)
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
      deleteAll(i) {
        if (i < this.chooseData.length) {
          this.areaDelete(this.chooseData[i].data.areaCode).then(res => {
            if (res.data.code === 0) {
              this.$message({
                title: res.data.message,
                message: this.chooseData[i].areaName + ' 删除成功',
                type: 'success',
                duration: 800
              });
              setTimeout((e) => {
                this.deleteAll(i + 1)
              }, 200)

            } else {
              this.$message({
                message: res.data.message,
                type: 'warning'
              })
              setTimeout((e) => {
                this.deleteAll(i + 1)
              }, 200)
            }
          })
        } else {
          this.$refs.multipleTable.clearSelection();
          this.jsonData.pageNo = 1
          this.jsonData.pageSize = 10
          this.getData()
        }
      },
      onSubmit(item) {
        if (this.user.dept == '') {
          this.jsonData.orgCode = ''
        }
        this.jsonData.pageNo = 1
        this.jsonData.pageSize = 10
        this.getData()
      }, //重置搜索条件
      onreset(formName) {
        // this.$refs[formName].resetFields();
        this.jsonData = {
          name: '',
          orgCode: '',
          status: '',
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
        this.currentPage = 1
        this.pageSize = val
        this.jsonData.pageSize = val
        this.jsonData.pageNo = 1
        this.getData()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.jsonData.pageNo = val
        this.getData()
      },

    }
  }
</script>
<style scoped>
  .domain {
    padding: 10px;
  }

  .el-icon-circle-plus-outline {
    color: #1890ff;
  }

  .info{

  }
  ._box{
    width: 100%;
    height: 100%;
  }
  ._bar{
    width: 40%;
    height: 100%;
    min-height: 500px;
    float: left;
    border: 1px solid #eee;
  }
  .title{
    width: 50%;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #eee;
    border-right: 1px solid #eee;
    text-align: center;
  }
</style>
