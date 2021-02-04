<template>
  <div class="printApplyDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="DialogTitle" :visible.sync="editDialogVisible"
               width="40%" center>
      <div id="printDetail">
        <h3 style="display: flex;justify-content: center;margin-top: 0;">领用单{{ msg.applyBarCode }}</h3>
        <el-row>
          <el-col :span="12">
            <div class="oneSpan"><b>维修/保养单号:</b><span> {{ msg.orderNo }}</span></div>
            <div class="oneSpan"><b>申请人:</b><span> {{ msg.applyUser }}</span></div>
            <div class="oneSpan"><b>申请时间:</b><span> {{ msg.applyTimeString }}</span></div>
            <div class="oneSpan"><b>申请说明:</b><span> {{ msg.applyDesc }}</span></div>
          </el-col>
          <el-col :span="12">
            <div class="oneSpan"><b>审核人:</b><span> {{ msg.checkUser }}</span></div>
            <div class="oneSpan"><b>审核时间:</b><span> {{ msg.checkTimeString }}</span></div>
            <div class="oneSpan"><b>审核说明:</b><span> {{ msg.checkDesc }}</span></div>
            <div class="oneSpan"><b>审核结果:</b><span> {{ msg.checkResultString }}</span></div>
          </el-col>
        </el-row>
        <p style="margin-top: 15px;font-size: 16px;"><b>备品备件领用</b></p>
        <div v-for="item in msg.printDetails" :key="item.code" style="margin-top: 30px;">
          <div style="margin-bottom: 10px;display: inline-block;">
            <b>备品备件:</b><span> {{ item.sparePartName }}</span>
            <b>规格类型:</b><span> {{ item.specificationModel }}</span>
            <b>仓库名:</b><span> {{ item.stockName }}</span>
            <b>申请数量:</b><span> {{ item.qty }}</span>
            <div class="oneSpan" style="display: flex;justify-content: flex-start;align-items: center;font-size: 18px; " v-if="item.isOut===1">已完成出库</div>
          </div>
          <el-row v-for="item1 in item.outInfos" :key="item1.sparePartBarCode">
            <el-col :span="12">
              <div class="oneSpan"><b>入库批次:</b><span>{{ item1.addBatch }}</span></div>
              <div class="oneSpan"><b>出库数:</b><span>{{ item1.outQty }}</span></div>
              <div class="oneSpan"><b>此批次库存:</b><span>{{ item1.lastQty }}</span></div>
            </el-col>
            <el-col :span="12">
              <div class="oneSpan" style="display: flex;justify-content: flex-start;align-items: center">
                <b>条形码:</b><vue-barcode :value="item1.sparePartBarCode" :width="1" :height="50" :fontSize="14">{{ item1.sparePartBarCode }}</vue-barcode>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <span slot="footer" class="footerClass">
        <el-button @click="close">关闭</el-button>
        <el-button type="primary" v-print="'#printDetail'" v-prevent-re-click>打印</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueBarcode from 'vue-barcode'
export default {
  components:{VueBarcode},
  data() {
    return {
      DialogTitle: '打印格式预览',
      editDialogVisible: false,
      msg: {
        applyBarCode: '',
        applyTimeString: '',
        applyUser: '',
        applyDesc: '',
        orderNo: '',
        checkUser: '',
        checkTimeString: '',
        checkDesc: '',
        checkResultString: '',
        printDetails: [{
          sparePartName: '',
          specificationModel: '',
          stockName: '',
          outInfos: [{
            addBatch: '',
            sparePartBarCode: '',
            outQty: '',
            lastQty: '',
            leftQty: ''
          }]
        }]
      }//接收打印的数据
    }
  },
  created() {
    this.$bus.on('printApplyInfo', e => {
      this.msg = null
      this.editDialogVisible = true
      this.msg = e
      console.log(e)
    })
  },
  methods: {
    close() {
      this.editDialogVisible = false
    }
  }
}
</script>

<style scoped>
.printApplyDialog {

}

#printDetail {
  margin: 0;
  padding: 0;
  height: 90%;
}

.oneSpan {
  margin-bottom: 7px;
}

@page{
  size:  auto;   /* auto is the initial value */
  margin: 0;  /* this affects the margin in the printer settings */
}

html{
  background-color: #FFFFFF;
  margin: 0;  /* this affects the margin on the html before sending to printer */
}

body{
  border: solid 1px #242424 ;
  margin: 0mm 15mm 10mm 15mm; /* margin you want for the content */
}
</style>
