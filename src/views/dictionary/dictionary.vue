<template>
  <div class="dictionary">
    <el-card shadow="always">
      <el-form :inline="true" :model="maintain" class="demo-form-inline">
        <el-form-item label="字典编码">
          <el-input v-model="maintain.code" placeholder="请输入内容" @change="maintain_show" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-row style="margin-bottom: 5px;">
        <el-button type="primary" @click="addDictionary">新增</el-button>
        <!--        <el-button type="danger" :disabled="isDelete" >删除</el-button>-->
      </el-row>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight"
                ref="dictionaryTable">
        <!--        <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>-->
        <el-table-column type="index" label="序号" width="100" align="center"/>
        <el-table-column
          v-for="item in listName"
          :key="item.name"
          :label="item.label"
          :prop="item.name"
          min-width="180"
          align="center"
        />
        <el-table-column fixed="right" label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <div class="action">
              <el-tag @click="edit(scope.row)">编辑</el-tag>
              <el-popover placement="right" width="280" trigger="click" :ref="`popover-${scope.$index}`">
                <p>确定删除字典: <b style="color: red">{{ scope.row.name }}</b> 吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteItem(scope.row)">确定</el-button>
                </div>
                <el-tag slot="reference" type="danger">删除</el-tag>
              </el-popover>
              <el-tag @click="checkDetail(scope.row)" type="success">字典数据</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top: 15px">
        <el-pagination v-show="false"
                       align="center"
                       :current-page="currentPage"
                       :page-sizes="[5, 10, 15]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <dictionaryEditDialog/>
    <dictionaryAddDialog/>
  </div>
</template>

<script>
import dictionaryEditDialog from './dictionaryDialog/dictionaryEditDialog'
import dictionaryAddDialog from './dictionaryDialog/dictionaryAddDialog'

export default {
  components: { dictionaryEditDialog, dictionaryAddDialog },
  data() {
    return {
      loading: false,
      //isDelete:true,
      chooseCode: [],
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 270, // 表格高度
      total: 6,
      pageSize: 5,
      currentPage: 1,
      tableData: [{
        dictionaryCode: '001',
        name: '设备类型',
        createTime: '2019-8-1 08:00:00'
      }],
      maintain: {
        code: ''
      },
      listName: [{
        label: '字典编码',
        name: 'code'
      }, {
        label: '字典名称',
        name: 'name'
      }, {
        label: '创建时间',
        name: 'createTime'
      }]
    }
  },
  created() {
    this.getTableData() //获取所有数据
    this.$bus.on('renderGet', e => {
      if (e === true) {
        this.getTableData()
      }
    })
  },
  methods: {
    maintain_show(row) {
      this.maintain.code = row
    },
    onSubmit() {
      if (this.maintain.code !== '') {
        let checkPar = {
          parentCode: '0',
          code: this.maintain.code
        }
        this.$axios.post('/u/dictionary/get', checkPar).then(res => {
          if (res.data.code === 0) {
            let msg1 = res.data.data
            //console.log(msg1)
            this.tableData = []
            let obj = {}
            obj.name = msg1.name //名字
            obj.code = msg1.code //编码
            obj.createTime = this.formatDate(msg1.createTime) //创建时间
            this.tableData.push(obj)
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.getTableData()
      }
    },
    // 编辑调出
    edit(item) {
      this.$bus.emit('edit', item)
    },
    // 新增调出
    addDictionary() {
      this.$bus.emit('add', true)
    },
    getRowKeys(row) {
      return row.code
    },
    selectionchange(data) {
      this.chooseCode = []
      this.isDelete = data.length === 0
      //console.log(data)
      for (let i = 0; i < data.length; i++) {
        this.chooseCode.push(data[i].code)
      }
      // console.log(this.chooseCode)
    },
    //删除按钮
    deleteItem(row) {
      // console.log(row)
      this.checkIsDelete(row.code).then(res=>{
        if (res === 'no'){
          this.$message.error('该字典下有子字典数据,不可删除!')
        }else if (res === 'yes') {
          let par={
            code:row.code,
            parentCode:'0'
          }
          this.$axios.post('/u/dictionary/delete',par).then(res=>{
            if (res.data.code === 0){
              this.$message.success('成功删除')
              this.getTableData()
            }else {
              this.$message.error(res.data.message)
              this.getTableData()
            }
          }).catch(err=>{
            console.log(err)
          })
        }else {
          this.$message.error('操作错误,稍等操作')
        }
      })
    },
    getTableData() {//获取所有的数据字典内容
      let par = {
        parentCode: '0'
      }
      this.$axios.post('/u/dictionary/getList', par).then(res => {
        if (res.data.code === 0) {
          console.log('数据字典', res)
          this.loading = true
          this.tableData = []
          let msg = res.data.data
          for (let key of msg) {
            let obj = {}
            obj.name = key.name //名字
            obj.code = key.code //编码
            obj.createTime = this.formatDate(key.createTime) //创建时间
            this.tableData.push(obj)
          }
          this.loading = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //check 能否删除
    async checkIsDelete(Tcode) {
      let par = {
        parentCode: Tcode
      }
      let str='error'
      return await this.getStateInfo(par).then(res => {
        if (res.data.code === 0) {
          str = res.data.data.length > 0?'no':'yes'  //no:不可删 反之可删
        }
        return str
      }).catch(() => {
        return str
      })
    },
    //相关的子字典数据
    checkDetail(row) {
      //console.log(row)
      this.$router.push('/dictionary/children')
      sessionStorage.setItem('dictionaryChildren', JSON.stringify(row))
    },
    handleSizeChange(val) {
      console.log(`size change :${val}`)
    },
    handleCurrentChange(val) {
      console.log(`current change :${val}`)
    }
  },
  destroyed() {
    this.$bus.off('edit')
    this.$bus.off('add')
    this.$bus.off('renderGet')
  }
}
</script>
<style scoped>
.dictionary {
  padding: 10px;
}
</style>
