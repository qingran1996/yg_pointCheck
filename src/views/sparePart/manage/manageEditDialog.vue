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
            <el-tag slot="reference" effect="plain">备品备件添加</el-tag>
          </el-popover>
          <el-input v-show="!IsShowSpare" v-model="sparePartInputInline" clearable
                    @click.native="sparePartInput"></el-input>
        </el-form-item>
        <el-form-item label="仓库" prop="stockId">
          <el-select v-model="infoData.stockId" clearable filterable>
            <el-option v-for="item in warehouseList" :key="item.name" :value="item.id" :label="item.name"></el-option>
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
        <el-form-item label="当前库存" prop="stockCurrent">
          <el-input v-model="infoData.stockCurrent" disabled/>
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
            :file-list="fileList"  list-type="picture"
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
      dialogTitle: '备品备件编辑',
      textareaMax:200,
      picurl:this.documentEAMUrl('upload'),
      detailUrl:this.documentEAMUrl('preview'),
      textrows:5,
      popheight: document.body.clientHeight * 0.3 + 'px',
      showUpload:true, //上传按钮
      picUrl:this.documentEAMUrl('upload'), //图片显示url
      deviceTypeData: [], //绑定设备列表
      infoData: {
        id: 1, //id编号
        attachId: null, //图片路径
        name: '螺母', // 备品备件名称
        code: '132FYNGG', //备品备件编码
        assetCode: '1323 ', //资产编号
        specificationModel: '1',//规格类型
        deviceTypeId: 0, //设备类型
        mainParameters: '主要参数',
        createTime: '',
        updateTime: null,
        stockCurrent: 0,  //当前库存
        stockMin: 0,  //最低库存
        stockId: 0,  //仓库id
        remark: null, //备注
        shelves:null,//货架id
        deviceIds:[]
      },
      fileList: [],
      fileSource:{file:null},
      SparePartList:[], //备品备件分类列表
      sparePartInputInline:'', //分类的input
      sparePartInputInline1:'',
      IsShowSparepop:true,
      IsShowSpare:true,
      rules: {
        name: [{
          required: true,
          message: '请输入备品备件名称',
          trigger: ['change','blur']
        },{
          max: 64,
          message: '长度不可超过64位',
          trigger: ['change', 'blur']
        }],
        code: [{
          required: true,
          message: '请输入备品备件编号',
          trigger: ['change','blur']
        },{
          max: 64,
          message: '长度不可超过64位',
          trigger: ['change', 'blur']
        }],
        assetCode: [{
          required: true,
          message: '请输入资产编号',
          trigger: ['change','blur']
        },{
          max: 64,
          message: '长度不可超过64位',
          trigger: ['change', 'blur']
        }],
        specificationModel: [{
          required: true,
          message: '请输入规格型号',
          trigger: ['change','blur']
        },{
          max: 64,
          message: '长度不可超过64位',
          trigger: ['change', 'blur']
        }],
        deviceTypeId: [{
          required: true,
          message: '设备关联',
          trigger: 'change'
        }],
        mainParameters: [{
          required: true,
          message: '请输入主要参数',
          trigger: ['change','blur']
        },{
          max: 64,
          message: '长度不可超过64位',
          trigger: ['change', 'blur']
        }],
        stockId: [{
          required: true,
          message: '请选择仓库',
          trigger: 'change'
        }],
        shelves:[{
          required: false,
          message: '请选择货架',
          trigger: 'change'
        }],
        stockMin: [{
          required: true,
          message: '请输入最低库存',
          trigger: ['change','blur']
        }],
        stockCurrent: [{
          required: true,
          message: '请输入初始库存',
          trigger: ['change','blur']
        }]
      },
      warehouseList:[{
        name:'仓库10',
        value: 10,
      }],
      deviceList:[{
        label:'设备1',
        value: 1,
        key: 'dk1'
      }]
    }
  },
  watch: {
    // 当dialog关闭，对表单内容的清空
    editDialogVisible(val) {
      if (val === false) {
        this.$refs.ruleForm.resetFields()
        this.fileList=[]
        this.forceRender()
        this.fileSource.file = null
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
    sparePartInputInline1(val){
      this.$refs.SpareTree.filter(val)
    }
  },
  created() {
    // 编辑bus传值&跳转实现
    this.$bus.$on('editManage', (e) => {
       console.log(e)
      this.getByKeyword()
      this.getDetail(e.info)
      this.dialogTitle = '备品备件编辑'
      this.editDialogVisible = true
      this.warehouseList = e.warehouseList
      this.SparePartList = e.SparePartList
      if (this.fileList.length>0){
        this.showUpload =false
      }
    })
  },
  methods: {
    close() {
      this.editDialogVisible = false
    },
    // 编辑  功能
    updateInfo() {
      this.$refs.ruleForm.validate((valid) => {
        console.log('编辑表单-提交前-！',this.infoData)
        if (valid) {
          if (this.dialogTitle === '备品备件编辑') {
            let parm = {
              id: this.infoData.id,
              name: this.infoData.name,
              code: this.infoData.code,
              assetCode: this.infoData.assetCode,
              specificationModel: this.infoData.specificationModel,
              deviceTypeId: this.infoData.deviceTypeId,
              attachId: this.infoData.attachId,
              deviceIds: this.infoData.deviceIds, //array
              stockId: this.infoData.stockId,
              stockMin: parseInt(this.infoData.stockMin),
              mainParameters: this.infoData.mainParameters,
              remark: this.infoData.remark
            }
            this.$axios.post('/d/sparePart/update', parm).then(res => {
              if (res.data.code ===0){
                this.$message({
                  type:'success',
                  message:'编辑成功'
                })
                this.close()
                this.$bus.emit('reload',true)
              }else {
                this.$message.error(res.data.message)
              }
            }).catch(err => {
              console.log('备品备件编辑出错--', err)
            })
          }
        }
      })

    },
    forceRender() {
      this.editRender += 1
    },
    // 调取详情
    getDetail(Tid){
      let par={
        id:Tid
      }
      this.$axios.post('/d/sparePart/getById',par).then(res=>{
        if (res.data.code === 0){
          console.log(res.data.data)
          let msg4= res.data.data
          this.infoData=null
          let obj=msg4
          obj.deviceIds=[]
          for (let i =0;i<msg4.deviceList.length;i++){
            obj.deviceIds.push(msg4.deviceList[i].id)
          }
          this.infoData = obj
          this.sparePartInputInline =msg4.deviceType.name
          this.fileList=[]
          this.showUpload=true
          if (obj.attach instanceof Object){
            this.fileList=[{
              name:obj.attach.fileName,
              url:this.picurl+obj.attach.filePath
            }]
            this.showUpload = false  //上传图片按钮的显示
          }
          this.IsShowSpare = false
          this.IsShowSparepop = false
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      window.open(this.detailUrl + encodeURIComponent(file.url))
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ？`).then(()=>{
        this.showUpload =true
        this.fileList = []
        this.infoData.attachId =null
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
          this.fileList=[{
            name: pic.fileName,
            url: this.picUrl+pic.filePath
          }]
          this.infoData.attachId = res.data.data.id
          console.log(this.infoData)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    beforeUpload(file){
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
