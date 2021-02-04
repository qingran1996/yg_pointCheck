<template>
  <div class="printCodes">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :destroy-on-close="true"
               :title="wordtitle" :visible.sync="editDialogVisible" width="40%" center>
      <div style="display: flex;justify-content: center;margin-bottom: 10px;">
        <el-date-picker v-model="dateTime" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" @change="maintain_time">
        </el-date-picker>
        <div style="margin-left: 10px;">
          <el-button type="primary" @click="submit">查询</el-button>
        </div>
      </div>
      <el-card shadow="always">
        <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight"
                  ref="sparePartCodes" :row-key="getRowKeys" @selection-change="selectionchange">
          <el-table-column type="selection" width="55" align="center" :reserve-selection="true"/>
          <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
          <el-table-column v-for="item in listName" :key="item.name" :label="item.label" :prop="item.name"/>
        </el-table>
      </el-card>
      <el-dialog width="33%" title="条形码预览" :visible.sync="innerVisible" append-to-body center>
        <el-card >
          <div id="prints">
            <div v-for="item in printCodes" :key="item.sparePartBarCode" style="margin-bottom: 20px;">
              <div style="display: flex;justify-content: center;font-size: 16px;"><p>{{item.sparePartName}}-----{{item.addBatch}}</p></div>
              <div style="display: flex;justify-content: center;">
                <vue-barcode  :value="item.sparePartBarCode" :key="item.sparePartBarCode">
                  错误条形码
                </vue-barcode>
              </div>
            </div>
          </div>
        </el-card>
        <span slot="footer" class="footerClass">
          <el-button @click="innerVisible = false">取消</el-button>
          <el-button type="success" v-print="'#prints'" v-prevent-re-click>确定打印</el-button>
        </span>
      </el-dialog>
      <span slot="footer" class="footerClass">
				<el-button @click="editDialogVisible = false">取消</el-button>
				<el-button type="primary" :disabled="isPrint" @click="codesPrint">打印</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
import VueBarcode from 'vue-barcode'
export default {
  components: {VueBarcode},
  data() {
    return {
      wordtitle: '按时间批量打印条形码',
      editDialogVisible: false,
      innerVisible: false,//内置dialog
      isPrint: true,
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 290, // 表格高度
      dateTime: null, //时间搜索框time
      startTime: null,
      endTime: null,
      loading: false,
      tableData: [],
      printCodes: null, //批量打印的数组
      listName: [{
        label: '备品备件名',
        name: 'sparePartName'
      }, {
        label: '入库批次',
        name: 'addBatch'
      }, {
        label: '条形码',
        name: 'sparePartBarCode'
      }]
    }
  },
  watch:{
    editDialogVisible(val){
      if (val === false){
        this.printCodes = []
        this.isPrint = true
      }
    }
  },
  created() {
    this.$bus.on('printCodes', e => {
      this.editDialogVisible = e
    })
    this.isPrint = true
  },
  methods: {
    maintain_time() {
      //console.log(this.dateTime)
      if (this.dateTime) {
        this.startTime = this.formatDate((new Date(this.dateTime[0])).getTime()).split(' ')[0] +" 00:00:00"
        this.endTime = this.formatDate((new Date(this.dateTime[1])).getTime()).split(' ')[0] +" 23:59:59"
      } else {
        this.startTime = null
        this.endTime = null
      }
    },
    submit() {
      this.checkSpareCodes()
    },
    getRowKeys(row) {
      return row.id
    },
    selectionchange(data) {
      this.printCodes = null
      this.printCodes = data
      console.log(this.printCodes)
      this.isPrint = this.printCodes.length === 0
    },
    codesPrint() {
      this.innerVisible = true
    },
    //axios post 请求
    checkSpareCodes() {
      let par = {
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.loading = true
      this.$axios.post('/d/sparePartApply/printBarCode', par).then(res => {
        if (res.data.code === 0) {
          console.log(res)
          let msg = res.data.data
          this.tableData = []
          for (let k of msg) {
            this.tableData.push(k)
          }
          this.loading = false
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  destroyed() {

  }
}
</script>

<style scoped>
.printCodes {

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
