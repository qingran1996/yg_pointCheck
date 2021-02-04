<template>
  <div class="reviceIndex">
    <el-card shadow="always" class="topcard">
      <el-form :inline="true" :model="maintain" class="demo-form-inline" @submit.native.prevent>
        <el-form-item label="领用单条码">
          <el-input v-model="maintain.code" placeholder="请扫码(或手动)录入" @change="maintain_show" @keyup.enter.native="onSubmit" @focus="tipTell" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit" v-prevent-re-click>查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight" v-if="tableshow">
        <el-table-column
          v-for="item in listName"
          :key="item.name"
          :label="item.label"
          :prop="item.name"
          min-width="180"
          align="center"
          show-overflow-tooltip/>
        <el-table-column fixed="right" label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <div class="action">
              <el-tooltip class="item" effect="dark" content="打印领用信息" placement="bottom">
                <el-tag type="warning" @click="extra">打印领用信息</el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="showlist" style="margin-top: 40px;">
        <el-table v-loading="loading" :data="ListData" border style="width: 100%" :max-height="tableHeight" v-if="tableshow">
          <el-table-column type="expand" label="出库的备品备件批次" width="220">
            <template slot-scope="props">
              <div style="display: flex;justify-content: space-between;font-size: 15px;margin-bottom: 10px;" v-for="item1 in props.row.outInfos" :key="item1.sparePartBarCode" v-show="props.row.isOut===0">
                  <el-col :span="6"><b>入库批次:</b><span>{{item1.addBatch}}</span></el-col>
                  <el-col :span="6"><b>备品备件条形码:</b><span>{{item1.sparePartBarCode}}</span></el-col>
                  <el-col :span="4"><b>出库数量:</b><span>{{item1.outQty}}</span></el-col>
                  <el-col :span="4"><b>此批次库存:</b><span>{{item1.lastQty}}</span></el-col>
                  <el-col :span="4"><b>出库后该批次剩余库存:</b><span>{{item1.leftQty}}</span></el-col>
              </div>
              <div v-if="props.row.isOut===1"><b style="color: #67C23A;font-size: 18px;">已完成出库!当前库存:{{props.row.stockCurrent}}</b></div>
            </template>
          </el-table-column>
          <el-table-column
            v-for="item in listName1"
            :key="item.name"
            :label="item.label"
            :prop="item.name"
            min-width="180"
            align="center"
            show-overflow-tooltip/>
        </el-table>
        <div style="margin-top: 10px;display: flex;justify-content: center">
          <el-button v-show="showlist" type="primary" round @click="sureout" :disabled="isAllOut">出库</el-button>
        </div>
      </div>
    </el-card>
    <outputDialog/>
    <printApplyDialog/>
  </div>
</template>

<script>
import outputDialog from '@/views/sparePart/receive/rightrRecive/outputDialog'
import printApplyDialog from '@/views/sparePart/receive/rightrRecive/printApplyDialog'
export default {
  components:{outputDialog,printApplyDialog},
  data() {
    return {
      loading: false,
      tableshow:true,
      showlist:false,
      detailMsg:null,//详情打印时用到
      isAllOut:false,//出库按钮是否可用(若领用单全部完成出库，按钮不可用；反之可用)
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 270, // 表格高度
      currentPage: 1,
      total: 6,
      pageSize: 5,
      maintain: {
        type: '',
        code: ''
      },
      ListData:[],
      tableData: [{
        code: '132FYNTG',
        subTime:'2020-09-01 10:00:00',
        solveTime:'2020-09-10 10:00:00',
        type:'类型1',
        wbcode:'维保12313',
        applyer:'张三',
        count: 10,
        reason: '很需要钱，只能用来卖钱，很需要钱，只能用来卖钱，很需要钱，只能用来卖钱'
      }],
      listName: [{
        label: '领用单号',
        name: 'applyBarCode'
      }, {
        label: '申请时间',
        name: 'applyTimeString'
      }, {
        label: '申领人',
        name: 'applyUser'
      }, {
        label: '申领说明',
        name: 'applyDesc'
      },{
        label: '审核人',
        name: 'checkUser'
      },{
        label: '审核说明',
        name: 'checkDesc'
      },{
        label: '审核结果',
        name: 'checkResultString'
      },{
        label: '审核时间',
        name: 'checkTimeString'
      }],
      listName1:[{
        label:'备品备件名',
        name:'sparePartName'
      },{
        label: '规格型号',
        name: 'specificationModel'
      },{
        label: '仓库名',
        name:'stockName'
      },{
        label: '申请数量',
        name:'qty'
      }]
    }
  },
  created() {
    this.tableshow=false
    this.$bus.on('outRender',e=>{
      if (e === true){
        this.maintain.code=''
        this.onSubmit()
      }
    })
  },
  destroyed() {
    this.$bus.off('outputStock')
    this.$bus.off('outRender')
    this.$bus.off('printApplyInfo')
  },
  methods: {
    maintain_show(row) {
    this.maintain.code = row
    },
    //tip 提示，防止扫码不回车问题
    tipTell(event){
      this.$notify.warning({
        title: '注意',
        message: '扫码时,请将输入法调成英文模式',
        showClose: false,
        position:'top-left',
        offset:150,
        duration:1400 //1.4s关闭
      })
      event.currentTarget.select() //聚焦focus时,把内容全选
    },
    async onSubmit() {
      if (this.maintain.code===''){
        this.tableshow=false
        this.showlist=false
      }else {
        let par={
          applyBarCode:this.maintain.code,
          userId: parseInt(localStorage.getItem('userId'))
          //userId: 402 //测试-曹
        }
       await this.$axios.post('/d/sparePartApply/getByBarCodeAndUser',par).then(res=>{
          if (res.data.code === 0){
            this.loading = true
            this.tableshow=true
            this.showlist=false
            this.isAllOut=false
            //console.log(res.data.data)
            let msg =res.data.data
            this.detailMsg =null
            this.tableData=[]
            this.ListData=[]
            this.detailMsg = msg
            let obj
            obj=msg
            obj.checkResultString =obj.checkResult===1?'通过':'驳回'
            this.tableData.push(obj) //第一张表信息
            if (obj.printDetails){
              this.ListData=obj.printDetails //第二张表格展示
              let checkAllOutCount = obj.printDetails.length //判断是否全部出库
              let checkCount = 0
              for (let b=0;b<obj.printDetails.length;b++){
                if (obj.printDetails[b].isOut ===1){ //已出库则，标记+1
                  checkCount+=1
                }
              }
              this.isAllOut = checkCount===checkAllOutCount //来确定“出库”按钮是否可用
            }else {
              this.$message({
                message:'仓库库存不足或您未拥有出库的权限',
                type:'warning',
                showClose:true,
                duration:8000
              })
              this.isAllOut = true
            }
            this.showlist=true
            this.loading = false
          }else {
            this.$message.error(res.data.message)
          }
        }).catch(err=>{
          console.log(err)
        })
      }
    },
    sureout(){
      let array=[]
      for (let key of this.ListData){
        if (key.outInfos&&key.isOut===0){
          for (let j=0;j<key.outInfos.length;j++){
            array.push(key.outInfos[j])
          }
        }
      }
      //console.log(array)
      let ite={
        show:true,
        applyId:this.tableData[0].id,
        arrayCodes:array
      }
      this.$bus.emit('outputStock',ite)
    },
    //领用信息打印
    extra(){
      //console.log('信息的打印',this.detailMsg)
      let par =this.detailMsg
      this.$bus.emit('printApplyInfo',par)
    }

  }
}
</script>

<style scoped>
	.reviceIndex {
		padding: 10px;
	}
 .topcard >>> .el-input__inner{
   width: 300px;
  }
 .box-card{
   height: 60%;
 }
</style>
