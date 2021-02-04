<template>
  <div class="warehouse">
    <el-card class="box-card" shadow="always">
      <el-form :inline="true" :model="warehouse_model" class="demo-form-inline">
        <el-form-item label="仓库名称">
          <el-input v-model="warehouse_model.name" placeholder="请输入内容" clearable/>
        </el-form-item>
        <el-form-item label="仓库位置">
          <el-popover placement="bottom" width="250" trigger="click" v-model="topPopoShow">
            <el-tree :highlight-current="true" :default-expand-all="false"
                     :style="{maxHeight: 150+'px',overflowY: 'scroll'}"
                     :expand-on-click-node="true" :data="areaTree" :filter-node-method="filterNode1"
                     @node-click="selectClassfy" class="width-220 selectTree-input objectTree"
                     ref="areaTree"></el-tree>
            <div class="topPop">
              <el-button size="mini" type="text" @click="blankMsg">取消</el-button>
              <el-button type="primary" size="mini" @click="topPopoShow = false">确定</el-button>
            </div>
            <el-input v-model="warehouse_model.area" clearable @focus="showtree" placeholder="类型选择"
                      slot="reference"/>
          </el-popover>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit(warehouse_model)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-row style="margin-bottom: 5px;">
        <el-button type="primary" @click="addWarehouse">新增</el-button>
        <el-button type="danger" @click="deleteItem" :disabled="isDelete">删除</el-button>
      </el-row>
      <el-table v-loading="loading" :data="warehouseData" border style="width: 100%" :max-height="tableHeight"
                @selection-change="selectionchange" :row-key="getRowKeys" ref="wareTable">
        <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="100" align="center"/>
        <el-table-column v-for="item in listName" :key="item.name" :label="item.label" :prop="item.name"
                         align="center"/>
        <el-table-column fixed="right" label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <div class="action">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <el-tag @click="updateList(scope.row)">编辑</el-tag>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="相关人员" placement="bottom">
                <el-tag type="success" @click="personList(scope.row)">相关人员</el-tag>
              </el-tooltip>
              <!--              <el-tooltip class="item" effect="dark" content="货架管理" placement="bottom" >-->
              <!--                <el-tag type="warning" @click="detailList(scope.row)">货架管理</el-tag>-->
              <!--              </el-tooltip>-->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="block" style="margin-top:15px;" v-show="showpage">
        <el-pagination
          v-show="total!==0"
          align="center"
          :current-page="currentPage"
          :page-sizes="[5,10,20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <warehouseEditDialog/>
    <editWarePerson/>
  </div>
</template>

<script>
import warehouseEditDialog from './warehouseDialog/warehouseEditDialog'
import editWarePerson from '@/views/warehouse/warehouseDialog/editWarePerson'

export default {
  name: 'Warehouse',
  components: { warehouseEditDialog, editWarePerson },
  data() {
    return {
      loading: false,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 152, // 表格高度
      currentPage: 1,
      pageSize: 10,
      total: 1,
      showpage: true,
      topPopoShow: false,//搜索框-设备类型tree
      chooseId: [], //批量删除的数组
      isDelete: true, //删除按钮是否可用
      //展示参数表，并未实际应用
      tableData: [{
        name: '机械零件仓库',
        remarks: '备注11111',
        id: null
      }],
      jsonData: {
        areaCode: 0
      },
      warehouseData: [],
      warehouseData1: [], //备份
      stockPerson: [],
      // 筛选
      warehouse_model: {
        name: '',
        area: '',
        areaId: null
      },
      areaTree: null,//仓库位置
      //列表名
      listName: [{
        label: '仓库名称',
        name: 'name'
      }, {
        label: '仓库位置',
        name: 'areaName'
      }]
    }
  },
  watch: {
    'warehouse_model.area': {
      handler: function(val) {
        this.$refs.areaTree.filter(val)
        if (val === '') {
          this.warehouse_model.areaId = null
        }
      }
    }
  },
  created() {
    this.getData()
    this.getAreaData() //仓库位置
    this.$bus.on('reload', (e) => {
      if (e === true) {
        this.getData()
      }
    })
  },
  methods: {
    // table编辑
    updateList(row) {
      row.areaTree = this.areaTree
      this.$bus.emit('edit', row)
    },
    // table 新增仓库
    addWarehouse() {
      let item = {
        show: true,
        areaTree: this.areaTree
      }
      this.$bus.emit('add', item)
    },
    //相关人员信息
    personList(row) {
      //console.log(row)
      sessionStorage.setItem('warehousePerson', JSON.stringify(row))
      //this.$router.push('/warehouse/warehousePerson')
      this.$bus.emit('changePerson', row)
    },
    //货架管理
    detailList(row) {

    },
    //删除操作
    deleteItem() {
      this.$confirm('确定删除选中的仓库吗？').then(() => {
        let dParam = {
          ids: this.chooseId
        }
        this.$axios.post('/d/stock/delete', dParam).then(res => {
          if (res.data.code === 0) {
            this.$message.success('成功删除!')
            this.$refs.wareTable.clearSelection()
            this.currentPage = 1
            this.getData()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          console.log(err)
        })
      })
    },
    //返回总数据
    showInital() {
      this.warehouseData = this.warehouseData1
      this.warehouse_model.name = ''
      this.warehouse_model.personName = ''
    },
    // 查询按钮
    onSubmit(item) {
      //console.log(item)
      this.getData(item.name,item.areaId)
    },
    //获取位置
    getAreaData() {
      this.getDeviceQueryTree(this.jsonData).then(res => {
        if (res.data.code === 0) {
          //console.log(res.data)  //树el-tree， 接收为数组，不是对象
          this.areaTree = []
          const areaD = res.data.data
          this.areaTree.push(areaD)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    filterNode1(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    selectClassfy(data) {
      console.log('tree', data)
      this.warehouse_model.area = data.label
      this.warehouse_model.areaId = data.id
    },
    showtree() {
      this.warehouse_model.area = ''
      this.warehouse_model.areaId = null
    },
    //取消
    blankMsg() {
      this.topPopoShow = false
      this.warehouse_model.area = ''
      this.warehouse_model.areaId = null
      //this.device_model.deviceTypeArry = ''
      //this.jsonData.deviceTypeId = null
    },
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`)
      this.currentPage = val
      this.getData()
    },
    //初始化话数据 --
    getData(Tname, Tid) {
      let parm = {
        name: '',
        areaId: null,
        pageSize:this.pageSize,
        pageNo:this.currentPage
      }
      parm.name = Tname === '' ? '' : Tname
      parm.areaId = Tid === null ? null : Tid
      this.getWarehouseInfo(parm).then(res => {
        if (res.data.code === 0) {
          //console.log('仓库信息', res.data)
          this.warehouseData = []
          let warehouse = res.data.data.content
          this.pageSize = res.data.data.size
          this.total = res.data.data.totalElements
          this.currentPage = res.data.data.number + 1 //当前页数
          for (let k1 of warehouse) {
            let arry = {}
            arry.id = k1.id
            arry.name = k1.name
            arry.areaName = k1.areaName
            arry.areaId = k1.areaId
            arry.index = k1.name + this.pageSize + this.currentPage * k1.id
            this.warehouseData.push(arry)
          }
          this.warehouseData1 = this.warehouseData // 备份
        }
        //console.log(this.warehouseData1)
      }).catch(err => {
        console.log(err)
      })
    },
    selectionchange(data) {
      this.chooseId = [] //每次选择重置批量
      this.isDelete = data.length === 0
      for (let i = 0; i < data.length; i++) {
        this.chooseId.push(data[i].id)
        //console.log('choose-',this.chooseId)
      }
    },
    getRowKeys(row) {
      return row.index
    }
  },
  destroyed() {
    this.$bus.off('edit')
    this.$bus.off('reload')
    this.$bus.off('changePerson')
  }
}
</script>
<style scoped>
.warehouse {
  padding: 10px;
}
</style>
