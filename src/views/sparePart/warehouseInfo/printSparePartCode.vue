<template>
  <div class="printSparePartCode">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :destroy-on-close="true"
               :title="wordtitle" :visible.sync="editDialogVisible" width="30%" center >
      <el-card >
        <div id="print">
          <div v-for="item in chooseCodes" :key="item.sparePartBarCode" style="margin-bottom: 20px;">
            <div style="display: flex;justify-content: center;font-size: 16px;"><p>{{item.spareName}}-----{{item.addBatch}}</p></div>
            <div style="display: flex;justify-content: center;">
              <vue-barcode  :value="item.sparePartBarCode" :key="item.sparePartBarCode">
                错误条形码
              </vue-barcode>
            </div>
          </div>
        </div>
      </el-card>
      <span slot="footer" class="footerClass">
				<el-button @click="editDialogVisible = false">取消</el-button>
				<el-button type="primary" v-print="'#print'" v-prevent-re-click>打印</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
import VueBarcode from 'vue-barcode'
export default {
  components:{VueBarcode},
  data(){
    return{
      wordtitle:'打印内容',
      editDialogVisible:false,
      chooseCodes:[]
    }
  },
  methods:{
    sure(){

    }
  },
  created() {
    this.$bus.on('printCodes',e=>{
      this.chooseCodes=null
      this.editDialogVisible = e.show
      this.chooseCodes = e.chooseCodes
    })
  }
}
</script>

<style scoped>
.printSparePartCode{

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
