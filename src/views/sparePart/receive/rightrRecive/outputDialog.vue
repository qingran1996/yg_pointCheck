<template>
  <div class="editDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="备品备件出库" :visible.sync="editDialogVisible" width="30%" center>
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm" @submit.native.prevent>
        <el-form-item label="备品备件条码" prop="code">
          <el-input v-model="infoData.code" placeholder="扫码录入" @keyup.enter.native="enterCheck" @focus="tipTell" clearable/>
        </el-form-item>
        <el-form-item label="出库说明" prop="remark">
          <el-input v-model="infoData.remark" type="textarea" clearable :rows="5" resize="none"
                    :maxlength="200" :show-word-limit="true"/>
        </el-form-item>
        <el-form-item label="出库信息"/>
      </el-form>
      <div style="display: flex;justify-content: space-between;align-items: center;" v-show="showInfo" v-for="item in oneSpareInfo" :key="item.id">
        <el-col :span="18">
          <div style="font-size:15px; ">
            <p><b>备件名</b>:{{item.sparePartName}}, <b>编号</b>:{{item.sparePartCode}}, <b>批次</b>:{{item.addBatch}}</p>
          </div>
          <p><b>条形码</b>:{{item.sparePartBarCode}}, <b>申请数量</b>:{{ item.outQtyTrue }}</p>
        </el-col>
         <el-col :span="6">
           <el-input-number size="small" v-model="item.outQty" :min="0" :disabled="item.isOutFull" :max="item.numberMax"></el-input-number>
           <div style="color: red;margin-top: 5px;margin-left: 3px;">(此批次库存量:{{item.lastQty}})</div>
         </el-col>
      </div>
      <span slot="footer" class="footerClass">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="updateInfo" v-prevent-re-clicks>确定出库</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
 data(){
   return{
     editDialogVisible: false,
     showInfo:false,
     applyId:null,
     text1:null,
     arrayCodes:[],
     infoData: {
       remark:'',
       code:''
     },
     oneSpareInfo:[{
       sparePartName:'1',
       sparePartCode:'2',
       sparePartAssetCode:'3',
       stockCurrent:999, //当前库存
       outQty:''
     }],
     codeArray:[],//条形码暂存，防止一码多扫
     recordOut:[] //记录相应的仓库出库数量
   }
 },
  created() {
   this.$bus.on('outputStock',e=>{
     console.log(e)
     this.arrayCodes=[]
     this.editDialogVisible=e.show
     this.applyId = e.applyId
     //要扫条形码的相关信息
     if (e.arrayCodes){
       this.arrayCodes = e.arrayCodes
     }
     //进入后清空
     this.oneSpareInfo=[]
     this.codeArray=[]
     this.recordOut=[]
   })
  },
  watch:{ // 当dialog关闭，对表单内容的清空
    editDialogVisible(val) {
      if (val === false) {
        this.infoData.remark = ''
        this.infoData.code = ''
        this.applyId=null
      }
    }
 },
  methods:{
    close(){
      this.editDialogVisible = false
      this.showInfo =false
      this.oneSpareInfo=[{
        sparePartName:'1',
        sparePartCode:'2',
        sparePartAssetCode:'3',
        outQty:'',
        qty:null
      }]
    },
    //tip 提示，防止扫码不回车问题
    tipTell(){
      this.$notify.warning({
        title: '注意',
        message: '扫码时,请将输入法调成英文模式',
        showClose: false,
        position:'top-left',
        offset:150,
        duration:1500 //1.5s关闭
      })
    },
    updateInfo() {
      this.recordOut=[]
      //console.log('提交前赋值',this.oneSpareInfo)
      for (let i=0;i<this.oneSpareInfo.length;i++){
        let arr={
          stockRecordInId:this.oneSpareInfo[i].stockRecordInId,
          sparePartId:this.oneSpareInfo[i].sparePartId,
          outQty:this.oneSpareInfo[i].outQty
        }
        this.recordOut.push(arr)
      }
      console.log('出库信息array',this.recordOut)
      this.sure()
    },
    //确认出库
    async sure(){
        let outpar={
          applyId:this.applyId,//领用单id number
          // outUserId:402, //测试
          // outUser:'曹奕彦',
          outUserId:parseInt(localStorage.getItem('userId')),//出库人id number
          outUser:localStorage.getItem('name'),//出库人 string
          outDesc:this.infoData.remark,//出库说明 string
          recordOutDetail:this.recordOut,//出库明细 array
          //array
          //{stockRecordInId:null,//入库id number
          //sparePartId:null,//备品备件id number
          //outQty:null//出库数  number}
        }
        await this.$axios.post('/d/sparePartApply/outStock',outpar).then(res=>{
          if (res.data.code === 0){
            this.$message.success('成功出库')
            setTimeout(()=>{
              this.close()
              this.$bus.emit('outRender',true) //回到出库页面刷新
            })
          }else {
            this.$message.error(res.data.message)
          }
        }).catch(err=>{
          console.log(err)
        })
    },
    //判断条码扫码请求
    enterCheck(){
      if (this.infoData.code===''){
        this.$message.error('请扫码!!')
      }else {
        let found = this.arrayCodes.find(item=>item.sparePartBarCode === this.infoData.code)
        if (found){
          if(this.codeArray.find(item1=>item1.sparePartBarCode === this.infoData.code)){
            this.$message.warning('该条码已经扫过了！')
            this.infoData.code=''
          }else {
            this.codeArray.push({
              outQty:found.outQty, //出库数量
              sparePartBarCode:found.sparePartBarCode, //条形码
              isOutFull:found.isOutFull, //是否全部出库
              lastQty:found.lastQty //此时批次库存
            })
            this.sparePartcode()
            //console.log(this.codeArray)
          }
        }else {
          this.$message.error('请扫描相对应的条形码!')
          this.infoData.code=''
        }
      }
    },
    //扫码请求
    sparePartcode(){
        let par={
          sparePartBarCode:this.infoData.code,
          applyId:this.applyId
        }
        this.$axios.post('/d/stockRecord/getBySparePartBarCode',par).then(res=>{
          if (res.data.code === 0){
            this.codeArray.push(this.infoData.code)
            console.log('备品备件扫码',res)
            let msg =res.data.data
            let obj={}
            obj.sparePartName =msg.sparePart.name //备品备件名
            obj.sparePartCode =msg.sparePart.code //备品备件编号
            obj.addBatch =msg.addBatch //备品备件编号
            obj.sparePartAssetCode =msg.sparePart.assetCode //备品备件资产编号
            obj.sparePartId =msg.sparePartId //库存id
            obj.id =msg.sparePart.id +(new Date()).getTime()//id
            obj.stockRecordInId =msg.id //入库id
            //obj.outQty = msg.outQty //出库数量
            obj.sparePartBarCode =msg.sparePartBarCode//扫录的条码
            let foTwo = this.codeArray.find(item2=>item2.sparePartBarCode === this.infoData.code)
            if (foTwo){
              obj.lastQty = foTwo.lastQty //当前批次库存
              obj.outQtyTrue =foTwo.outQty //应该出库数量
              obj.isOutFull =foTwo.isOutFull //是否全部出库
              obj.outQty = foTwo.isOutFull?parseInt(obj.lastQty):0
              obj.numberMax = foTwo.outQty
            }
            //限制最大数
            this.showInfo = true
            this.oneSpareInfo.push(obj)
            console.log('这次扫码信息',this.oneSpareInfo)
            this.infoData.code=''
          }else {
            this.$message.error(res.data.message)
          }
        }).catch(err=>{
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>

</style>
