<template>
  <div class="editDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="dialogTitle" :visible.sync="editDialogVisible"
               width="30%" center :key="editRender">
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm" :rules="rules">
        <el-form-item label="备品备件名称" prop="name">
          <el-input v-model="infoData.name" clearable/>
        </el-form-item>
        <el-form-item label="备品备件编号" prop="code">
          <el-input v-model="infoData.code" clearable/>
        </el-form-item>
        <el-form-item label="资产编号" prop="assetCode">
          <el-input v-model="infoData.assetCode" clearable/>
        </el-form-item>
        <el-form-item label="规格型号" prop="specificationModel">
          <el-input v-model="infoData.specificationModel" clearable/>
        </el-form-item>
        <el-form-item label="设备关联" prop="deviceIds">
          <div class="selectDiv">
            <el-select v-model="infoData.deviceIds" clearable placeholder="请选择(可选)" filterable multiple >
              <el-option v-for="item in deviceTypeData" :key="item.key" :label="item.label" :value="item.value"/>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="主要参数" prop="mainParameters">
          <el-input v-model="infoData.mainParameters" clearable/>
        </el-form-item>
        <el-form-item label="备品备件分类" prop="deviceTypeId">
          <el-popover style="margin-left: 10px;"
                      placement="right"
                      width="280"
                      trigger="click" :value="IsShowSparepop" v-show="IsShowSparepop">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="备品备件分类:">
                <el-input v-model="sparePartInputInline1" clearable></el-input>
                <el-tree ref="SpareTree" v-show="IsShowSpare" :highlight-current=true :default-expand-all=false
                         :style="{maxHeight: popheight,overflowY: 'scroll',width:240+'px'}" node-key="code"
                         :expand-on-click-node="true" :data="SparePartList" :filter-node-method="filterNode2"
                         @node-click="selectClassfy2" class="width-220 selectTree-input objectTree"
                ></el-tree>
              </el-form-item>
            </el-form>
            <el-tag slot="reference" effect="plain">备品备件分类添加</el-tag>
          </el-popover>
          <el-input v-show="!IsShowSpare" v-model="sparePartInputInline" clearable
                    @click.native="sparePartInput"></el-input>
        </el-form-item>
        <el-form-item label="仓库" prop="stockId">
          <el-select v-model="infoData.stockId" clearable filterable>
            <el-option v-for="item in warehouseList" :key="item.name" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库人配置" prop="addUserId" v-show="personSet">
          <el-select v-model="infoData.addUserId" clearable>
            <el-option v-for="item in warePerson" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="货架" prop="shelves">-->
<!--          <el-select v-model="infoData.shelves" clearable filterable>-->
<!--            <el-option  value="1" label="货架测试1"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="最低库存" prop="stockMin">
          <el-input v-model="infoData.stockMin" clearable/>
        </el-form-item>
        <el-form-item label="初始库存" prop="stockCurrent">
          <el-input v-model="infoData.stockCurrent" clearable />
        </el-form-item>
        <el-form-item label="附件" prop="fileList">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :before-upload="beforeUpload"
            :limit="1" :http-request="uploadMethod"
            :on-exceed="handleExceed"
            :file-list="fileList" list-type="picture"
          >
            <el-button type="info" class="el-icon-upload2" circle plain v-show="showUpload"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="infoData.remark" type="textarea" clearable :rows="textrows" resize="none"
                    :maxlength="textareaMax" :show-word-limit="true"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="footerClass">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="updateInfo" v-prevent-re-click>确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editDialogVisible: false,
      editRender: 0,
      dialogTitle: '备品备件新增',
      popheight: document.body.clientHeight * 0.3 + 'px',
      textareaMax: 200,
      textrows: 5,
      personSet:false,//人员配置的显示
      showUpload: true, // 上传按钮的实现
      picUrl: this.documentEAMUrl('upload'), //图片显示url
      deviceTypeData: [], //绑定设备列表
      infoData: {
        id: null, //id编号
        attachId: null, //图片路径
        name: '', // 备品备件名称
        code: '', //备品备件编码
        assetCode: '', //资产编号
        specificationModel: null,//规格类型
        deviceTypeId: null, //设备类型
        mainParameters: '',
        createTime: '',
        updateTime: null,
        stockCurrent: null,  //当前库存
        stockMin: null,  //最低库存
        stockId: null,  //仓库id
        remark: null, //备注
        deviceIds:[], //关联
        stockName:'',
        addUserId:null,
        addUser:''
        //shelves:null,//货架id
      },
      fileList: [],
      fileSource:{file:null},
      SparePartList: [], //备品备件分类列表
      sparePartInputInline:'', //分类的input
      sparePartInputInline1:'',
      IsShowSparepop:true,
      IsShowSpare:true,
      rules: {
        name: [{
          required: true,
          message: '请输入备品备件名称',
          trigger: ['change', 'blur']
        }, {
          max: 64,
          message: '长度不可超过64位',
          trigger: ['change', 'blur']
        }],
        code: [{
          required: true,
          message: '请输入备品备件编号',
          trigger: ['change', 'blur']
        }, {
          max: 64,
          message: '长度不可超过64位',
          trigger: ['change', 'blur']
        }],
        assetCode: [{
          required: true,
          message: '请输入资产编号',
          trigger: ['change', 'blur']
        }, {
          max: 64,
          message: '长度不可超过64位',
          trigger: ['change', 'blur']
        }],
        specificationModel: [{
          required: true,
          message: '请输入规格型号',
          trigger: ['change', 'blur']
        }, {
          max: 64,
          message: '长度不可超过64位',
          trigger: ['change', 'blur']
        }],
        deviceTypeId: [{
          required: true,
          message: '请选择设备',
          trigger: 'change'
        }],
        mainParameters: [{
          required: true,
          message: '请输入主要参数',
          trigger: ['change', 'blur']
        }, {
          max: 64,
          message: '长度不可超过64位',
          trigger: ['change', 'blur']
        }],
        classification: [{
          required: true,
          message: '请选择分类',
          trigger: 'change'
        }],
        stockId: [{
          required: true,
          message: '请选择仓库',
          trigger: 'change'
        }],
        addUserId:[{
          required: true,
          message: '请选择人员配置',
          trigger: 'blur'
        }],
        shelves:[{
          required: false,
          message: '请选择货架',
          trigger: 'change'
        }],
        stockMin: [{
          required: true,
          message: '请输入最低库存',
          trigger: ['change', 'blur']
        }],
        stockCurrent:[{
          required: true,
          message: '请输入初始库存',
          trigger: ['change', 'blur']
        }]
      },
      warehouseList: [{
        name: '仓库10',
        value: 10
      }],
      warePerson:[] //选择后仓库的相关人员
    }
  },
  watch: {
    // 当dialog关闭，对表单内容的清空
    editDialogVisible(val) {
      if (val === false) {
        this.$refs.ruleForm.resetFields()
        this.forceRender()
        this.fileSource.file = null
        this.personSet =false
      }
    },
    sparePartInputInline(val){
      this.sparePartInputInline1=''
      if (val === ''){
        this.IsShowSpare = true
        this.IsShowSparepop = true
        this.infoData.deviceTypeId = null
      }
    },
    'infoData.stockId':{
      handler:function(val) {
        if (val){
          let found =this.warehouseList.find(item=>item.id===val)
          if (found){
            this.infoData.stockName=found.name
            this.warehousePerson(val) //进行仓库人员配置
            this.personSet =true
          }
        }else {
          this.infoData.stockName=''
        }
      }
    },
    'infoData.addUserId':{
      handler:function(val){
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
    sparePartInputInline1(val){
      this.$refs.SpareTree.filter(val)
    }
  },
  created() {
    //新增跳转
    this.$bus.$on('addManage', (e) => {
      console.log('备品备件新增', e)
      this.getByKeyword()
      this.editDialogVisible = e.show
      this.dialogTitle = '备品备件新增'
      this.warehouseList = e.warehouseList
      this.sparePartInputInline = '' //设备分类名(暂无)
      this.SparePartList = e.SparePartList
    })
  },
  methods: {
    close() {
      this.editDialogVisible = false
    },
    //  新增 功能
    updateInfo() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.dialogTitle === '备品备件新增') {
            let addparams = {
              name: this.infoData.name, //备品备件名
              code: this.infoData.code, //编码
              assetCode: this.infoData.assetCode, //资产编号
              specificationModel: this.infoData.specificationModel, //规格型号
              deviceTypeId: this.infoData.deviceTypeId, //设备类型-->分类
              attachId: this.infoData.attachId, //图片id
              deviceIds: this.infoData.deviceIds, // 数组-》设备关联ids
              stockId: this.infoData.stockId, //仓库id
              stockName: this.infoData.stockName,//仓库名
              stockMin: parseInt(this.infoData.stockMin),
              stockCurrent: parseInt(this.infoData.stockCurrent),
              mainParameters: this.infoData.mainParameters, //重要参数
              remark: this.infoData.remark, //备注
              addUserId:this.infoData.addUserId,//入库人id
              addUser:this.infoData.addUser//入库人
            }
            console.log('新增参数->', addparams)
            this.$axios.post('/d/sparePart/add', addparams).then(res => {
              if (res.data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '新增成功'
                })
                setTimeout(() => {
                  this.close()
                  this.$bus.emit('reload', true)
                }, 400)
              }else {
                this.$message.error(res.data.message)
              }
            }).catch(err => {
              console.log('备品备件新增出错-》', err)
            })
          }
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
    },
    forceRender() {
      this.editRender += 1
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ？`).then(() => {
        this.showUpload = true
        this.fileList = []
        this.infoData.attachId = null
      })
    },
    uploadMethod(){
      let formData = new FormData()
      formData.append('file', this.fileSource.file)
      formData.append('source', 3)
      this.$axios.post('/u/attach/upload', formData, { header: { 'Authorization': `Bearer ${localStorage.getItem('eleToken')}` } }).then(res => {
        console.log('----上传后的data----', res.data.data)
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '文件成功上传!'
          })
          let pic = {
            createTime: res.data.data.createTime,
            ext: res.data.data.ext,
            fileName: res.data.data.fileName,
            filePath: res.data.data.filePath,
            id: res.data.data.id,
            isDelete: null,
            source: res.data.data.source
          }
          //数据的接受变化
          this.fileList = [{
            name: pic.fileName,
            url: this.picUrl + pic.filePath
          }]
          this.infoData.attachId = res.data.data.id
          // this.infoData.remarks = [pic]
          // //this.infoData.id = 1
          // this.infoData.name = res.data.data.fileName
          console.log(this.infoData)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    beforeUpload(file) {
      this.fileSource.file = file
    },
    filterNode2(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    //备品备件分类
    selectClassfy2(data) {
      console.log('sparetree', data)
      this.sparePartInputInline1=data.label
      this.sparePartInputInline =this.sparePartInputInline1
      this.infoData.deviceTypeId = data.id
      this.IsShowSpare = false
      this.IsShowSparepop = false
    },
    sparePartInput(){
      this.IsShowSparepop = true
      this.IsShowSpare = true
      this.sparePartInputInline = ''
    },
    //获取设备列表-关键字
    getByKeyword(){
      this.deviceTypeData=[]
      let jsonObj={
        keyWord: '',
        pageNo: 1,
        pageSize: 10000
      }
      this.getdeviceByKeyword(jsonObj).then(res=>{
        if (res.data.code ===0){
          //console.log(res.data.data.content)
          let data = res.data.data.content
          for (var i = 0; i < data.length; i++) {
            var obj = {}
            obj.label = data[i].deviceName
            obj.value = data[i].id
            this.deviceTypeData.push(obj)
          }
        }
      }).catch(err=>{
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.selectDiv>>>.el-select{
  width: 100%!important;
}
.editDialog>>>.el-input__count{
  background: none;
  bottom:-5px;
}
</style>
