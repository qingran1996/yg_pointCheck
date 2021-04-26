<template>
  <div class="domain">
    <el-card class="box-card" shadow="always">
      <el-form :inline="true" :model="user" ref="formName" class="demo-form-inline">
        <el-form-item label="模块查询" prop="profession">
          <el-select v-model="user.profession">
            <el-option value="1" label="点巡检管理"></el-option>
            <el-option value="2" label="选项2"></el-option>
            <el-option value="3" label="选项3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button v-prevent-re-click size="small" type="primary" @click="onSubmit(user)">查询</el-button>
          <el-button v-prevent-re-click size="small" type="warning" @click="onreset('formName')">重置
          </el-button>
          <el-button icon="el-icon-circle-plus-outline" size="small" type="primary" @click="addRoute">新增
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-table v-loading="loading" :data="tableData" ref="multipleTable" @selection-change="selectionchange"
                :row-key="getRowKeys" border style="width: 100%" :max-height="tableHeight">
        <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
        <el-table-column prop="cid" width="100" label="序号" align="center" fixed>
        </el-table-column>
        <el-table-column prop="name" show-overflow-tooltip label="菜单名称" min-width="180" align="center"/>
        <el-table-column prop="category" show-overflow-tooltip label="菜单类型" min-width="180" align="center">

          <template v-slot="scope">
            {{scope.row.category==1?'菜单':'按钮'}}
          </template>
        </el-table-column>

        <el-table-column prop="code" show-overflow-tooltip label="菜单编号" min-width="200" align="center"/>
        <el-table-column prop="isOpen" show-overflow-tooltip label="是否在菜单中显示" min-width="200" align="center">
          <template v-slot="scope">
            {{scope.row.isOpen==1?'是':'否'}}
          </template>
        </el-table-column>
        <el-table-column prop="path" show-overflow-tooltip label="菜单地址" min-width="300" align="center"/>
        <el-table-column prop="parentId" show-overflow-tooltip label="父级菜单" min-width="200" align="center"/>
        <el-table-column prop="sort" show-overflow-tooltip label="所属模块" min-width="200" align="center"/>

        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <div class="action">
              <!--<el-tooltip class="item" effect="dark" content="关联接口" placement="bottom">-->
              <!--<el-tag @click="toMenu(scope.row)">关联接口</el-tag>-->
              <!--</el-tooltip>-->

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


    <vxe-modal v-model="showEdit" :title="selectRow ? '编辑&保存' : '新增&保存'" width="60%" min-width="600"
               :loading="submitLoading" resize destroy-on-close @close="closemodel">
      <template #default>
        <vxe-form :data="formData" :rules="formRules" title-colon title-align="right" title-width="150"
                  ref="xForm" @submit="submitEvent">
          <vxe-form-item title="菜单名称" field="name" span="12" :item-render="{}">
            <template #default="scope">
              <vxe-input v-model="formData.name" @input="$refs.xForm.updateStatus(scope)"
                         placeholder="请输入菜单名称" clearable></vxe-input>
            </template>
          </vxe-form-item>

          <vxe-form-item title="上级菜单" field="parentId" span="12" :item-render="{}">
            <template #default="scope">
              <el-popover placement="right" width="400" trigger="click" v-model="isdeptshow">
                <div style="height: 200px;overflow-y: scroll;">
                  <el-tree :data="deptList" accordion node-key="id" :default-expanded-keys="updateTree"
                           :expand-on-click-node="false" :props="defaultProps" @node-click="handleNodeClick">
                  </el-tree>
                </div>
                <!-- <el-button slot="reference">选择部门</el-button> -->
                <el-input v-model="formData.dept" placeholder="请点击选择上级菜单" slot="reference" clearable/>
              </el-popover>
            </template>
          </vxe-form-item>
          <!--<vxe-form-item title="菜单类型" field="category" span="12" :item-render="{}">-->
          <!--<template #default="scope">-->
          <!--<vxe-input v-model="formData.category" @input="$refs.xForm.updateStatus(scope)"-->
          <!--placeholder="请输入菜单类型" clearable></vxe-input>-->
          <!--</template>-->
          <!--</vxe-form-item>-->
          <vxe-form-item title="菜单编号" field="code" span="12" :item-render="{}">
            <template #default="scope">
              <vxe-input v-model="formData.code" @input="$refs.xForm.updateStatus(scope)"
                         placeholder="请输入菜单编号" clearable></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="菜单地址" field="path" span="12" :item-render="{}">
            <template #default="scope">
              <vxe-input v-model="formData.path" @input="$refs.xForm.updateStatus(scope)"
                         placeholder="请输入菜单地址" clearable></vxe-input>
            </template>
          </vxe-form-item>
          <vxe-form-item title="菜单权限" field="appId" span="12" :item-render="{}">
            <template #default="scope">
              <vxe-select v-model="formData.appId" @change="$refs.xForm.updateStatus(scope)"
                          placeholder="请选择权限" clearable>
                <vxe-option :key="1" :value="1" label="WEB权限"></vxe-option>
                <vxe-option :key="2" :value="2" label="APP权限"></vxe-option>
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

    <vxe-modal v-model="showMenu" title="关联接口" width="60%" min-width="600" resize destroy-on-close
               @close="closemodel">
      <template #default>


      </template>
    </vxe-modal>


  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        sertData: {
          name: '',
          code: '',
        },
        professionData: [{
          value: 1,
          label: '专业1'
        }, {
          value: 2,
          label: '专业2'
        }],
        tabList: [{
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
        user: {
          profession: '',
        },

        /**********************vxe-model*/
        submitLoading: false,
        selectRow: null,
        showEdit: false,
        showMenu: false,
        deptList: [],
        updateTree: [],
        formData: {
          name: '',
          parentId: '',
          appId: '',
          category: '1',
          code: '',// 00202
          path: '',// view/test
        },
        formRules: {
          name: [{
            required: true,
            message: '请输入名称'
          }],
          code: [{
            required: true,
            message: '请输入编号'
          }],
          path: [{
            required: true,
            message: '请输入地址'
          }],
          appId: [{
            required: true,
            message: '请选择权限'
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
          children: 'children',
          label: 'name'
        },
        addOredit: true, //新增还是修改
        listitem: null,
        loading: false,
        tableHeight: document.body.clientHeight - 84 - 36 - 80 - 152, // 表格高度
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        total: 1,
        showpage: true,
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
          // groupCode: '',
          size: 10,
          current: 1
        },
      }
    },
    created() {
      //查询区域
      this.getData()
      this.getDeptData()

    },
    methods: {
     //获取部门接口
      getDeptData() {

        this.updateTree = []
        this.deptList = []
        this.getWEBTree().then(res => {
          // console.log('WEBTree', res.data.data)
          this.deptList = res.data.data
          // this.showMenu = true
        }).catch(err => {
          console.log(err)
        })

      },
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },

      loadNode(node, resolve) {
        if (node.level === 0) {
          return resolve([{
            name: 'region1'
          }, {
            name: 'region888'
          }]);
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


      toMenu() {
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
          parentId: '',
          appId: '',
          code: '',
          path: '',
          sort: '1',
          category: '1',
        },
          this.selectRow = null
        this.showEdit = true
      },
      updateList(item) {
        console.log(item)
        this.formData = {
          name: item.name,
          sort: '1',
          category: '1',
          code: item.code,
          path: item.path,
          appId: item.appId,

        }
        this.formData['id'] = item.id
        this.selectRow = item
        this.showEdit = true
      },
      submitEvent() {
        console.log('submitEvent')
        this.submitLoading = true
        console.log(this.formData)
        this.addMenu(this.formData).then(res => {
          console.log()
          if (res.status == 200) {
            this.$message.success(res.data.msg)
            this.getData()
            this.getDeptData()

          } else {
            this.$message.error(res.data.msg)
            this.getData()
            this.getDeptData()
          }
          this.submitLoading = false
          this.showEdit = false

        })
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
        this.formData.dept = data.name
        this.formData.parentId = data.id
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


      getData() {
        this.menuList(this.jsonData).then(res => {
          // console.log(res)
          this.total = res.data.data.total
          for (var i = 0; i < res.data.data.records.length; i++) {
            res.data.data.records[i]['cid'] = this.jsonData.current * this.jsonData.size - this
              .jsonData.size + i + 1
          }
          this.tableData = res.data.data.records
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

          this.getData()
        }
      },
      onSubmit(item) {

        this.jsonData.current = 1
        this.jsonData.size = 10
        this.getData()
      }, //重置搜索条件
      onreset(formName) {
        this.$refs[formName].resetFields();
      },
      handleSizeChange(val) {
        this.jsonData.size = val
        this.jsonData.current = 1
        this.getData()
      },
      handleCurrentChange(val) {
        this.jsonData.current = val
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

  .info {
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
