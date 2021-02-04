<template>
  <div class="editDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="备品备件入库" :visible.sync="editDialogVisible" width="30%"
               center :key="renderName">
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm" :rules="rule">
        <el-form-item label="备品备件名称" prop="name">
          <el-input v-model="infoData.name" disabled/>
        </el-form-item>
        <el-form-item label="备品备件编号" prop="code">
          <el-input v-model="infoData.code" disabled/>
        </el-form-item>
        <el-form-item label="备品备件分类" prop="deviceTypeId">
          <el-select v-model="infoData.deviceTypeId" disabled>
            <el-option label="分类test1" value="key1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓库" prop="stockId">
          <el-select v-model="infoData.stockId" disabled>
            <el-option v-for="item in warehouseList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="货架" prop="shelves">-->
<!--          <el-select v-model="infoData.shelves" disabled>-->
<!--            <el-option  value="1" label="货架测试1"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="入库数量" prop="initialCount">
          <el-input-number v-model="infoData.initialCount" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item label="入库类型" prop="type">
          <el-select v-model="infoData.type" >
            <el-option  :value="1" label="采购入库"></el-option>
            <el-option  :value="2" label="归还入库"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库人" prop="addUserId" >
          <el-select v-model="infoData.addUserId" clearable>
            <el-option v-for="item in warePerson" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="入库批次" prop="addBatch">
          <el-input v-model="infoData.addBatch" placeholder="如:第二批入库,2020-12-1归还"/>
        </el-form-item>
        <el-form-item label="入库说明" prop="remarks">
          <el-input v-model="infoData.remarks" type="textarea" clearable :rows="textrows" resize="none"
                    :maxlength="textareaMax" :show-word-limit="true"/>
        </el-form-item>
<!--        <el-form-item label="备品备件条码" prop="sparePartBarCode">-->
<!--          <el-input v-model="infoData.sparePartBarCode"/>-->
<!--        </el-form-item>-->
      </el-form>
      <span slot="footer" class="footerClass">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="updateInfo" v-prevent-re-click>入库</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    let checkCount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入入库数量'))
      }
        if (!Number.isInteger(value)) {
          return callback(new Error('请输入数字值'))
        } else {
          return callback()
        }
    }
    return {
      editDialogVisible: false,
      renderName: 0,
      textrows:5,
      showUpload:true,
      textareaMax:200,
      infoData: {
        id:null,
        name: '',
        code: '',
        initialCount: '',
        remarks: '',
        stockId: null,
        //shelves:null,//货架id
        type:null, //入库类型
        sparePartBarCode:null, //条码
        stockName: '',//仓库名
        addUserId:null,//入库人
        addUser:'',
        addBatch:null //入库批次
      },
      stockCurrent:0, //当前库存
      warehouseList: [{
        name: 'test1',
        id: 1
      }],
      warePerson:null,//仓库相关人员
      rule: {
        initialCount: [{
          required: true,
          validator: checkCount,
          trigger: 'change'
        }],
        type: [{
          required: true,
          message: '请选择入库类型',
          trigger: 'blur'
        }],
        addBatch:[{
          required: true,
          message: '请输入入库批次',
          trigger: ['blur','change']
        }],
        addUserId:[{
          required: true,
          message: '请选择入库人',
          trigger: 'blur'
        }]
      }
    }
  },
  watch: {
    'infoData.addUserId':{
      handler:function(val){
        this.infoData.addUser=''
        if (val){
          let found1=this.warePerson.find(item=>item.id===val)
          if (found1){
            this.infoData.addUser=found1.name
          }else {
            this.infoData.addUser=''
          }
        }else {
          this.infoData.addUser=''
        }
      }
    },
    // 当dialog关闭，对表单内容的清空
    editDialogVisible(val) {
      if (val === false) {
        this.renderPage()
      }
    }
  },
  created() {
    // 编辑bus传值&跳转实现
    this.$bus.$on('warehouse', (e) => {
      console.log('入库信息',e)
      //缺备品备件分类
      this.infoData.id = e.info.id
      this.infoData.name = e.info.name
      this.infoData.code = e.info.code
      this.infoData.initialCount = null
      this.infoData.remarks = e.info.remarks
      this.infoData.stockId = e.info.stockId
      this.stockCurrent = e.info.stockCurrent
      //this.infoData.shelves = e.info.shelves
      //this.infoData.attachId = e.info.attachId
      this.editDialogVisible = true
      this.warehouseList = e.warehouseList
      let found = this.warehouseList.find(item=>item.id === e.info.stockId)
      if (found){
        this.infoData.stockName=found.name
        this.warehousePerson(this.infoData.stockId)
      }
    })
  },
  methods: {
    close() {
      this.editDialogVisible = false
    },
    //重新渲染
    renderPage() {
      this.renderName += 1
    },
    updateInfo() {
      this.$refs.ruleForm.validate((valid) => {
        console.log('入库表单',this.infoData)
        if (valid) {
          let par={
            sparePartId:this.infoData.id,//备品备件id
            stockId:this.infoData.stockId, //仓库id
            stockName: this.infoData.stockName,//仓库名
            addBatch:this.infoData.addBatch, //入库批次
            addType:this.infoData.type, //入库类型 1:采购 2:归还
            qty:this.infoData.initialCount, //入库数量
            addUserId:this.infoData.addUserId,//入库人id
            addUser:this.infoData.addUser,//入库人
            //sparePartBarCode:this.infoData.sparePartBarCode, //条形码
            isFrist:false,//判断是否为第一次入库，即判断是不是新建add的
            addDesc:this.infoData.remarks //入库说明
          }
          this.$axios.post('/d/stockRecord/inStock',par).then(res=>{
            if (res.data.code === 0){
              this.$message.success('入库成功')
              console.log('入库完成-202',res)
              this.close()
              this.$bus.emit('reload',true)
            }else {
              this.$message.error(res.data.message)
            }
          }).catch(err=>{
            console.log(err)
          })
        }
      })
    },
    //去寻找仓库相关的人员
    warehousePerson(Tid){
      let parId={
        stockId: Tid
      }
      this.$axios.post('/d/stockUser/getAllUserByStockId',parId).then(res=>{
        if (res.data.code ===0){
          this.warePerson=[]
          //console.log('仓库相应人员',res)
          let msg3 = res.data.data
          for (let key of msg3){
            let obj={}
            obj.id=key.users.id
            obj.name=key.users.name
            this.warePerson.push(obj)
          }
          this.infoData.addUserId=null
          this.infoData.addUser=''
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
