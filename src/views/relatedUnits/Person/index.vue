<template>
  <div class="relatedUnitsPerson">
    <el-card class="box-card" shadow="always">
      <el-form :inline="true" :model="checkModel" class="demo-form-inline">
        <el-form-item label="单位名称"><el-input v-model="checkModel.unitName" clearable/></el-form-item>
        <el-form-item label="人员名称"><el-input v-model="checkModel.name" clearable/></el-form-item>
        <el-form-item label="工种">
          <el-select v-model="checkModel.workType" clearable filterable>
            <el-option v-for="item in workTypeList" :key="item.id" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-row style="margin-bottom: 5px;">
        <el-button type="primary" @click="add">新增</el-button>
        <el-button type="danger" :disabled="isDelete" @click="deleteItems">删除</el-button>
<!--        <el-button type="danger" :disabled="isDelete" @click="deletePerson">删除人员信息</el-button>-->
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
              <el-tooltip class="item" effect="dark" content="证书" placement="bottom">
                <el-tag type="success" @click="personCertList(scope.row)">证书</el-tag>
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
    <personAdd/>
    <personEdit/>
    <personCertDialog/>
    <personDetail/>
  </div>
</template>

<script>
import personAdd from '@/views/relatedUnits/Person/personAdd'
import personEdit from '@/views/relatedUnits/Person/personEdit'
import personCertDialog from '@/views/relatedUnits/Person/personCertDialog'
import personDetail from '@/views/relatedUnits/Person/personDetail'
export default {
  components: { personAdd ,personEdit,personCertDialog,personDetail },
  data() {
    return {
      loading: false,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 270, // 表格高度
      total: 100,
      pageSize: 10,
      pageNo: 1,
      chooseId:[],
      isDelete:true,
      // 筛选
      jsonData: {
        unitName: '', //单位名称
        pageNo: 1,
        workType:'',
        name: '',//人员名称
        pageSize: 10
      },
      //查询
      checkModel:{
        unitName:'',
        name:'',
        workType:''
      },
      workTypeList:[],//工种表
      tableData: [{
        name: '张三',
        company: '菜鸡公司',
        sex: '男',
        idCard: '320xxxxxxxxxxxxxxxxxxxxx',
        phone: '1888888888',
        gz: '扫地科'
      }],
      listName: [{
        label: '姓名',
        name: 'name'
      }, {
        label: '所属单位',
        name: 'unitName'
      }, {
        label: '性别',
        name: 'sexString'
      }, {
        label: '身份证',
        name: 'idcard'
      }, {
        label: '联系电话',
        name: 'phone'
      }, {
        label: '工种',
        name: 'workTypeName'
      }]
    }
  },
  created() {
    this.getWorkType()
  },
  mounted() {
    this.getTableData()
    this.$bus.on('renderPersonThree',e=>{
      if (e === true){
        this.getTableData()
      }
    })
  },
  methods: {
    //查询
    onSubmit(){
      this.jsonData.unitName = this.checkModel.unitName
      this.jsonData.name = this.checkModel.name
      this.jsonData.workType = this.checkModel.workType
      this.getTableData()
    },
    lookList(row) {
      this.$bus.emit('personLookDetail',row)
    },
    personCertList(row){
      let item =row
      this.$bus.emit('personCertInfo',item)
    },
    //edit
    edit(row) {
      let item = row
      this.$bus.emit('personEdit',item)
    },
    // add
    add() {
      let ite1 = {
        show: true
      }
      this.$bus.emit('personAdd', ite1)
    },
    selectionchange(data) {
      //console.log(data)
      this.chooseId = [] //每次选择重置批量
      this.isDelete = data.length === 0
      for (let i = 0; i < data.length; i++) {
        this.chooseId.push(data[i].personJobInfoId)
      }
      //console.log(this.chooseId)
    },
    //批量删除
    deleteItems(){
      this.$confirm('确定删除吗?<b style="color:red;">注意:这会删除人员,人员工作信息以及其证书信息!</b>',{
        dangerouslyUseHTMLString: true
      }).then(()=>{
        let par={
          ids:this.chooseId
        }
        this.$axios.post('/p/personJobInfo/delete',par).then(res=>{
          if (res.data.code ===0){
            this.$message.success('删除成功')
            this.$refs.multipleTable.clearSelection()
            this.jsonData.pageNo=1
            this.getTableData()
          }else {
            this.$message.error(res.data.message)
          }
        }).catch(err=>{
          console.log(err)
        })
      }).catch(rej=>{
        console.log(rej)
      })
    },
    //获取列表信息
    getTableData() {
      this.loading = true
      this.$axios.post('/p/person/queryByUserTypeCode', this.jsonData).then(res => {
        if (res.data.code === 0) {
          //console.log(res)
          let msg = res.data.data.content
          this.pageSize =res.data.data.size
          this.jsonData.pageSize =res.data.data.size
          this.jsonData.pageNo = res.data.data.number + 1
          this.total = res.data.data.totalElements
          this.tableData = []
          for (let key of msg) {
            let obj = {}
            obj.index = key.idcard +'index'+ key.id*this.pageNo
            obj.id = key.id //人员 id
            obj.unitId = key.unitId //单位id
            obj.name = key.name
            obj.personJobInfoId = key.personJobInfoId //相关人员信息
            obj.idcard = key.idcard //身份证
            obj.phone = key.phone
            obj.sex = key.sex
            obj.sexString = key.sex === 1 ? '男' : '女'
            obj.unitName = key.unitName //相关单位
            obj.workTypeName = key.workTypeName //工种
            this.tableData.push(obj)
          }
          this.loading = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //数据字典查询 workType
    getWorkType() {
      let par = {
        parentCode: 'workType'
      }
      this.getStateInfo(par).then(res => {
        if (res.data.code === 0) {
          this.workTypeList = null
          this.workTypeList = res.data.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.jsonData.pageSize = val
      this.getTableData()
      //console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.jsonData.pageNo = val
      this.getTableData()
      //console.log(`当前页: ${val}`)
    }
  },
  destroyed() {
    this.$bus.off('personAdd')
    this.$bus.off('personEdit')
    this.$bus.off('renderPersonThree')
    this.$bus.off('personCertInfo')
    this.$bus.off('personLookDetail')
  }
}
</script>

<style scoped>
.relatedUnitsPerson {
  padding: 10px;
}
</style>
