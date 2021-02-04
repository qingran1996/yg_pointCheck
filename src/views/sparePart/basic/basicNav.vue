<template>
  <div class="deviceSort">
    <el-card shadow="always">
      <div class="topTitle"><i class="el-icon-tickets" style="margin-right: 10px;"/>{{ topTitle }}</div>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight">
        <el-table-column type="index" label="序号" width="100" align="center"/>
        <el-table-column v-for="item in ListName" :key="item.name" :label="item.label" min-width="180" align="center"
                         :prop="item.name" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="block" style="margin-top:15px;">
        <el-pagination
          align="center"
          :current-page="currentPage"
          :page-sizes="[10,15,20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <el-button v-show="butnShow" type="primary" icon="el-icon-back" round @click="backMsg">回显设备信息</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'DeviceSort',
  components: {},
  data() {
    return {
      loading: true,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 132, // 表格高度
      // 筛选
      deviceType_model: {
        name: ''
      },
      topTitle: '备品备件信息',
      currentPage: 1,
      pageSize: 10,
      total: 1,
      butnShow:false, //底部回显所有数据的按钮的 显示状态
      tableData: [{
        name: '设备1',
        createPerson: '罐类',
        createTime: '2019-8-1 08:00:00',
        updatePerson: '谢天sort tree',
        updateTime: '2019-8-1 08:00:00'
      }],
      jsonData: {
        name: '', //设备名称
        specificationModel: '', //规格型号
        pageNo: 1,
        pageSize: 10
      },
      ListName: [{
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
      },{
        label: '当前库存',
        name: 'stockCurrent'
      }]
    }
  },
  created() {
    this.getId()  //参数传值2个
    this.getData()
  },
  mounted() {

  },
  methods: {
    deviceType_name_show() {

    },
    updateList(item) {
      this.$bus.emit('edit1', item)
    },
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`)
      this.currentPage = 1
      this.pageSize = val
      this.jsonData.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`)
      this.currentPage = val
      this.jsonData.pageNo = val
      this.getData()
    },
    getId() {
      this.jsonData.deviceTypeId = null
      this.$bus.$on('clickPort1', e => {
        //console.log('从左侧接点击传送，右侧收到的信息', e)
        this.jsonData.deviceTypeId = e.id
        this.topTitle = e.label + ' 所有备品备件信息'
        //进行查询设备台账的信息
        this.loading =true
        if (!e.id){
          this.getData()
        }else {
          setTimeout(() => {
            // this.$message('正在查询相应数据信息....')
            this.getDataById(e.id)
            this.butnShow = true
          }, 450)
        }
      })

    },
    //进行查询设备台账的信息
    getData() {
      this.sparePartQuery(this.jsonData).then(res => {
        if (res.data.code === 0) {
          //console.log('请求成功', res.data.data)
          if (res.data.code ===0){
            setTimeout(()=>{
              let sparedata= res.data.data.content
              let Arry=[]
              for (let key of sparedata){
                key.warehouse = key.stock.name
                Arry.push(key)
              }
              this.tableData=Arry
              this.pageSize=res.data.data.size
              this.total=res.data.data.totalElements
              this.currentPage=res.data.data.number+1
              // console.log('备品备件---',this.tableData)
              this.loading = false
            },400)
          }
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('服务器异常')
      })
    },
    //根据分类查找
    getDataById(Tid){
      let par={
        sparePartTypeId:Tid
      }
      this.$axios.post('/d/sparePart/queryByType',par).then(res=>{
        if (res.data.code === 0){
          console.log('getID',res)
          setTimeout(()=>{
            let sparedata= res.data.data.content
            let Arry=[]
            for (let key of sparedata){
              key.warehouse = key.stock.name
              Arry.push(key)
            }
            this.tableData=Arry
            this.pageSize=res.data.data.size
            this.total=res.data.data.totalElements
            this.currentPage=res.data.data.number+1
            // console.log('备品备件---',this.tableData)
            this.loading = false
          },300)
        }else {
          this.$message.error(res.data.message)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    //回显所有的数据
    backMsg() {
      this.jsonData = {
        deviceName: '',
        deviceTypeId: null,
        deviceKks: '',
        isSpecial: '',
        pageNo: 1,
        pageSize: 10
      }
      this.loading = true
      this.getData()
      this.topTitle = '备品备件信息'
      this.butnShow = false
    }
  },
  beforeDestroy() {
    this.$bus.off('clickPort1')
  }
}
</script>
<style scoped>
.deviceSort {
  padding: 10px;
}

.topTitle {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 15px;
  margin-left: 20px;
  font-size: 18px;
}
</style>
