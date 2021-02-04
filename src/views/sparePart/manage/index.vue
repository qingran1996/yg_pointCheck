<template>
  <div class="manage">
    <el-card shadow="always">
      <el-form :inline="true" :model="maintain" class="demo-form-inline">
        <el-form-item label="备品备件名称">
          <el-input v-model="maintain.name" placeholder="请输入内容" @change="maintain_show" clearable/>
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input v-model="maintain.specificationModel" placeholder="请输入内容" @change="maintain_code" clearable/>
        </el-form-item>
        <!--        <el-form-item label="仓库">-->
        <!--          <el-select v-model="maintain.ware" placeholder="请选择仓库" @change="maintain_show">-->
        <!--              <el-option v-for="item in warehouseList" :key="item.name" :label="item.name" :value="item.id"/>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-row style="margin-bottom: 5px;">
        <el-button type="primary" @click="addManage">新增</el-button>
        <el-button type="danger" @click="deleteItem" :disabled="isDelete">删除</el-button>
        <el-button type="success">批量入库</el-button>
        <el-button type="warning" @click="printCodes">批量打印条码</el-button>
      </el-row>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight"
                :row-key="getRowKeys"
                @selection-change="selectionchange" ref="sparePartTable">
        <el-table-column type="selection" width="55" align="center" :reserve-selection="true"/>
        <el-table-column type="index" label="序号" width="100" align="center"/>
        <el-table-column
          v-for="item in listName"
          :key="item.name"
          :label="item.label"
          :prop="item.name"
          min-width="180"
          align="center"
          show-overflow-tooltip/>
        <el-table-column fixed="right" label="操作" min-width="330" align="center">
          <template slot-scope="scope">
            <div class="action">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <el-tag @click="edit(scope.row)">编辑</el-tag>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="入库" placement="bottom">
                <el-tag @click="warehouse(scope.row)" type="success">入库</el-tag>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="入库记录" placement="bottom">
                <el-tag @click="info(scope.row)" type="info">入库记录</el-tag>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="出库记录" placement="bottom">
                <el-tag @click="outport(scope.row)">出库记录</el-tag>
              </el-tooltip>
<!--              <el-tooltip class="item" effect="dark" content="附件记录" placement="bottom">-->
<!--                <el-tag type="warning" @click="extra(scope.row)">附件记录</el-tag>-->
<!--              </el-tooltip>-->
              <el-tooltip class="item" effect="dark" content="领用记录" placement="bottom">
                <el-tag type="warning" @click="applyHistory(scope.row)">领用记录</el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 15px">
        <el-pagination v-show="showPage"
          align="center"
          :current-page="currentPage"
          :page-sizes="[10, 15, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <manageEditDialog/>
    <warehouseDialog/>
    <manageAddDialog/>
    <printCodes/>
  </div>
</template>

<script>
import manageEditDialog from './manageEditDialog'
import warehouseDialog from './warehouseDialog'
import printCodes from './printCodes'
import manageAddDialog from './manageAddDialog'

export default {
  name: 'Manage',
  components: { manageEditDialog, warehouseDialog, manageAddDialog,printCodes },
  data() {
    return {
      loading: true,
      isDelete: true,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 270, // 表格高度
      currentPage: 1,
      total: 50,
      pageSize: 10,
      showPage:true,
      maintain: {
        name: '',
        code: '',
        specificationModel: ''
      },
      SparePartList: [], //备品备件列表
      tableData: [],
      chooseIds: [], //删除选择id 数组
      tableData1: [{ //备份参数对照
        id: 1, //id编号
        attachId: null, //图片路径
        name: '螺母', // 备品备件名称
        code: '132FYNGG', //备品备件编码
        assetCode: '1323 ', //资产编号
        specificationModel: '1',//规格类型
        deviceTypeId: 0, //设备类型
        mainParameters: '主要参数',
        createTime: '2020-10-20',
        updateTime: null,
        stockCurrent: 80,  //当前库存
        stockMin: 10,  //最低库存
        stockId: 10,  //仓库id
        warehouse: '',
        remark: null  //备注
      }],
      listName: [{
        label: '备品备件名称',
        name: 'name'
      }, {
        label: '备品备件编号',
        name: 'code'
      }, {
        label: '规格型号',
        name: 'specificationModel'
      }, {
        label: '主要参数',
        name: 'mainParameters'
      }, {
        label: '仓库',
        name: 'warehouse'
      }, {
        label: '当前库存',
        name: 'stockCurrent'
      }],
      warehouseList: []
    }
  },
  created() {
    this.getSparePart()
    this.$bus.$on('reload', (e) => {
      if (e === true) {
        this.getControllerData()
      }
    })
    this.getWare()
    this.getControllerData()
  },
  methods: {
    maintain_show(row) {
      this.maintain.name = row
    },
    maintain_code(row) {
      this.maintain.specificationModel = row
    },
    onSubmit() {
      //查询操作
      if (this.maintain.name === '' && this.maintain.specificationModel === '') {
        this.pageSize = 10
        this.currentPage = 1
        this.getControllerData()
      } else {
        this.queryForSparepart()
      }
    },
    getRowKeys(row) {
      return row.index
    },
    //选项时变化获取
    selectionchange(data) {
      this.chooseIds = [] //重置
      this.isDelete = data.length === 0
      // console.log(data)
      for (let key of data) {
        this.chooseIds.push(key.id)
      }
      console.log(this.chooseIds)
    },
    // 新增按钮
    addManage() {
      let parm = {
        show: true,
        warehouseList: this.warehouseList,
        SparePartList: this.SparePartList
      }
      this.$bus.emit('addManage', parm)
    },
    // 删除按钮
    deleteItem() {
      console.log('删除参数', this.chooseIds)
      this.$confirm('确定删除已选择的备品备件吗？').then(() => {
        let dParm = {
          ids: this.chooseIds
        }
        this.$axios.post('/d/sparePart/delete', dParm).then(res => {
          if (res.data.code === 0) {
            this.$message.success('删除成功')
            this.$refs.sparePartTable.clearSelection()
            this.pageSize = 10
            this.currentPage = 1
            this.getControllerData()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          console.log(err)
        })
      })
    },
    //批量打印条形码
    printCodes(){
      this.$bus.emit('printCodes',true)
    },
    // 编辑按钮
    edit(item) {
      //console.log(item)
      let parm = {
        info: item.id,
        warehouseList: this.warehouseList,
        SparePartList: this.SparePartList
      }
      this.$bus.emit('editManage', parm)
    },
    // 附件记录按钮
    extra() {
      console.log('附件')
    },
    //领用记录
    applyHistory(row){
      sessionStorage.setItem('sparePartApplyHistory',JSON.stringify(row))
      this.$router.push('/sparePart/sparePart_applyHistory')
    },
    // 入库按钮
    warehouse(item) {
      let parm = {
        info: item,
        warehouseList: this.warehouseList
      }
      this.$bus.emit('warehouse', parm)
    },
    // 入库记录按钮
    info(row) {
      sessionStorage.setItem('warehouseInformation', JSON.stringify(row))
      this.$router.push({
        path: '/sparePart/sparePart_warehouseInfo'
      })
    },
    // 出库记录 按钮
    outport(row) {
      sessionStorage.setItem('warehouseOutputInformation', JSON.stringify(row))
      this.$router.push('/sparePart/sparePart_outportInfo')
    },
    // axios 获取备品备件列表数据
    getControllerData() {
      //这儿还是指定的id值
      this.loading = true
      let param = {
        //id:1  /d/sparePart/getById 列表查询
        name: '', //设备名称
        specificationModel: '', //规格型号
        pageSize: this.pageSize,
        pageNo: this.currentPage
      }
      this.sparePartQuery(param).then(res => {
        console.log('备品备件---',res.data.data)
        if (res.data.code === 0) {
          setTimeout(() => {
            let sparedata = res.data.data.content
            this.pageSize = res.data.data.size
            this.total = res.data.data.totalElements
            this.currentPage = res.data.data.number + 1
            let Arry = []
            for (let key of sparedata) {
              key.warehouse = key.stock.name
              key.index = key.code + this.pageSize +this.currentPage
              Arry.push(key)
            }
            this.tableData = null
            this.tableData = Arry
           // console.log('备品备件---', this.tableData)
            this.showPage = true
            this.loading = false
          }, 400)
        }
      }).catch(err => {
        console.log('备品备件管理获取数据出错->', err)
      })
    },
    getWare() {
      let parm = {
        name: ''
      }
      this.getWarehouseInfo(parm).then(res => {
        if (res.data.code === 0) {
          console.log('获取仓库列表-', res.data.data.content)
          this.warehouseList = res.data.data.content
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //获取备品备件分类
    getSparePart() {
      this.SparePartList = []
      let parm = {
        id: 0,
        catalog: 2
      }
      this.getDeviceTypeQueryTree(parm).then(res => {
        if (res.data.code === 0) {
          this.SparePartList = res.data.data
          console.log('备品备件分类列表', this.SparePartList)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //查询请求
    queryForSparepart() {
      let par = {
        name: this.maintain.name,
        specificationModel: this.maintain.specificationModel
      }
      this.loading = true
      this.showPage = false
      this.$axios.post('/d/sparePart/queryForApp', par).then(res => {
        if (res.data.code === 0) {
          //console.log(res)
          setTimeout(() => {
            let sparedata = res.data.data
            let Arry = []
            for (let key of sparedata) {
              key.warehouse = key.stock.name
              Arry.push(key)
            }
            this.tableData = null
            this.tableData = Arry
            this.loading = false
          }, 400)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getControllerData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getControllerData()
    }

  },
  destroyed() {
    this.$bus.off('addManage')
    this.$bus.off('editManage')
    this.$bus.off('warehouse')
    this.$bus.off('reload')
    this.$bus.off('printCodes')
  }
}
</script>
<style scoped>
.manage {
  padding: 10px;
}
</style>
