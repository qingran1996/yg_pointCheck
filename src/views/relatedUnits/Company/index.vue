<template>
  <div class="relatedUnitsCompany">
    <el-card class="box-card" shadow="always">
      <el-row style="margin-bottom: 5px;">
        <el-button type="primary" @click="add">新增</el-button>
        <el-button type="danger" :disabled="isDelete" @click="deleteItems">删除</el-button>
      </el-row>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight"
                @selection-change="selectionchange" row-key="index" ref="multipleTable">
        <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
        <el-table-column type="index" label="序号" width="100" align="center"/>
        <el-table-column
          v-for="item in listName"
          :key="item.name"
          :label="item.label"
          :prop="item.name"
          min-width="180"
          align="center" show-overflow-tooltip
        />
        <el-table-column fixed="right" label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <div class="action">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <el-tag type="primary" @click="edit(scope.row)">编辑</el-tag>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="详情" placement="bottom">
                <el-tag @click="lookList(scope.row)" type="warning">详情</el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="block" style="margin-top:15px;">
        <el-pagination
          align="center"
          :current-page="pageNo"
          :page-sizes="[10,15,20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <companyAdd/>
    <companyEdit/>
    <companyDetail/>
  </div>
</template>

<script>
import companyAdd from './companyAdd'
import companyEdit from './companyEdit'
import companyDetail from '@/views/relatedUnits/Company/companyDetail'
export default {
  components: { companyAdd, companyEdit ,companyDetail},
  data() {
    return {
      loading: false,
      isDelete: true,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 270, // 表格高度
      total: 100,
      pageSize: 10,
      pageNo: 1,
      chooseId: [],//批量删除按钮
      // 筛选
      unitJson: {
        name: '', //名称
        pageNo: 1,
        pageSize: 10
      },
      tableData: [{
        id: 0,
        name: '菜鸡公司',//名称
        kindId: '001', //所属类型
        creditGrade: '一级',//信用等级
        address: '注册地址',
        legalPerson: '谢天', //法定代表人
        registerDate: '2019-8-1 08:00:00'
      }],
      listName: [{
        label: '相关方单位名称',
        name: 'name'
      }, {
        label: '所属类型',
        name: 'kindIdString'
      }, {
        label: '信用等级',
        name: 'creditGrade'
      }, {
        label: '注册地址',
        name: 'address'
      }, {
        label: '成立时间',
        name: 'registerDateString'
      }, {
        label: '法定代表人',
        name: 'legalPerson'
      }]
    }
  },
  mounted() {
    this.getTableData()
    this.$bus.on('renderTable', e => {
      if (e === true) {
        this.getTableData()
      }
    })
  },
  methods: {
    lookList(row) {
      this.$bus.emit('companyLookDetail',row)
    },
    //编辑
    edit(row) {
      let item = row
      this.$bus.emit('companyEdit', item)
    },
    //新增
    add() {
      this.$bus.emit('companyAdd', true)
    },
    //获取第三方单位信息
    getTableData() {
      this.loading = true
      this.$axios.post('/p/unit/queryByName', this.unitJson).then(res => {
        if (res.data.code === 0) {
          //console.log(res)
          let msg = res.data.data.content
          this.pageSize = res.data.data.size
          this.pageNo = res.data.data.number + 1
          this.total = res.data.data.totalElements
          this.unitJson.pageSize = res.data.data.size
          this.unitJson.pageNo = res.data.data.number + 1
          this.tableData = []
          for (let key of msg) {
            let obj = {}
            obj.id = key.id
            obj.index = key.name + key.kindId + this.pageNo * this.pageSize
            obj.kindId = key.kindId
            if (key.kindId === 2) {
              obj.kindIdString = '承包商'
            } else if (key.kindId === 3) {
              obj.kindIdString = '供应商'
            } else if (key.kindId === 4) {
              obj.kindIdString = '相关方单位'
            }else if (key.kindId === 1){
              obj.kindIdString = '我方单位'
            }
            obj.name = key.name //名称
            obj.creditGrade = key.creditGrade //信用等级
            obj.legalPerson = key.legalPerson //法定代表人
            obj.registerDate = key.registerDate //成立日期
            obj.registerDateString = this.formatDate(key.registerDate).split(' ')[0] //成立日期string
            obj.address = key.address //
            this.tableData.push(obj)
          }
          this.loading = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    selectionchange(data) {
      //console.log(data)
      this.chooseId = [] //每次选择重置批量
      this.isDelete = data.length === 0
      for (let i = 0; i < data.length; i++) {
        this.chooseId.push(data[i].id)
      }
      console.log(this.chooseId)
    },
    //delete axios
    deleteItems(){
      this.$confirm('确定删除这些第三方单位信息吗？').then(()=>{
        let deletePar={
          ids:this.chooseId
        }
        this.$axios.post('/p/unit/delete',deletePar).then(res=>{
          if (res.data.code === 0){
            this.$message.success('删除成功')
            this.$refs.multipleTable.clearSelection()
            this.unitJson.pageNo=1
            this.getTableData()
          }else {
            this.$message.error(res.data.message)
          }
        }).catch(err=>{
          console.log(err)
        })
      },(rej)=>{
        console.log(rej)
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.unitJson.pageSize = val
      this.getTableData()
      //console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.unitJson.pageNo = val
      this.getTableData()
      //console.log(`当前页: ${val}`)
    }
  },
  destroyed() {
    this.$bus.off('companyAdd')
    this.$bus.off('companyEdit')
    this.$bus.off('renderTable')
    this.$bus.off('companyLookDetail')
  }
}
</script>

<style scoped>
.relatedUnitsCompany {
  padding: 10px;
}
</style>
