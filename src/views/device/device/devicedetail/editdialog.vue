<template>
  <div class="editDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="deviceTitle" :visible.sync="editDialogVisible"
               width="30%"
               center :key="editRender">
      <el-form ref="ruleForm" :rules="rules" :model="infoData" label-width="130px" class="demo-ruleForm" size="small">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="infoData.deviceName" clearable/>
        </el-form-item>
        <el-form-item label="设备位号" prop="deviceKks">
          <el-input v-model="infoData.deviceKks" clearable/>
        </el-form-item>
        <el-form-item label="资产编号" prop="assetCode">
          <el-input v-model="infoData.assetCode" clearable/>
        </el-form-item>
        <el-form-item label="规格型号" prop="specificationModel">
          <el-input v-model="infoData.specificationModel" clearable/>
        </el-form-item>
        <el-form-item label="安装位置" prop="installAreaId">
          <el-popover style="margin-left: 10px;"
                      placement="right"
                      width="300"
                      trigger="click" :value="IsShowAreapop" v-show="IsShowAreapop">
            <el-form :inline="true" :model="areaInlineForm" class="demo-form-inline">
              <el-form-item label="安装位置:">
                <el-input v-model="areaInline1" clearable></el-input>
                <el-tree v-show="isShowArea" :highlight-current=true :default-expand-all=false
                         :style="{maxHeight: popheight,overflowY: 'scroll',width:270+'px'}"
                         :expand-on-click-node="true" :data="areaTree" :filter-node-method="filterNode3"
                         @node-click="selectClassfy3" class="width-220 selectTree-input objectTree"
                         ref="AreaTree"></el-tree>
              </el-form-item>
            </el-form>
            <el-tag slot="reference" effect="plain">安装位置添加</el-tag>
          </el-popover>
          <el-input v-show="!isShowArea" v-model="areaInline" clearable @click.native="areaInputInline"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceTypeId">
          <el-popover style="margin-left: 10px;"
                      placement="right"
                      width="300"
                      trigger="click" :value="IsshowDeviceTypepop" v-show="IsshowDeviceTypepop">
            <el-form :inline="true" :model="deviceTypeInlineForm" class="demo-form-inline">
              <el-form-item label="设备类型:">
                <el-input v-model="deviceTypeInline1" clearable></el-input>
                <el-tree v-show="isshowDeviceType" :highlight-current=true :default-expand-all=false
                         :style="{maxHeight: popheight,overflowY: 'scroll',width:270+'px'}"
                         :expand-on-click-node="true" :data="device_options" :filter-node-method="filterNode4"
                         @node-click="selectClassfy4" class="width-220 selectTree-input objectTree"
                         ref="DeviceTypeTree"></el-tree>
              </el-form-item>
            </el-form>
            <el-tag slot="reference" effect="plain">设备类型选择</el-tag>
          </el-popover>
          <el-input v-show="!isshowDeviceType" v-model="deviceTypeInline" clearable @click.native="deviceInputInline"></el-input>
        </el-form-item>
        <el-form-item label="是否为特种设备" prop="isSpecial">
          <el-radio v-model="infoData.isSpecialName" label="是">是</el-radio>
          <el-radio v-model="infoData.isSpecialName" label="否">否</el-radio>
        </el-form-item>
        <el-form-item label="重要参数" prop="mainParameters">
          <el-input type="textarea" v-model="infoData.mainParameters" resize="none" :rows="3" show-word-limit :maxlength="textareaMax"/>
        </el-form-item>
        <el-form-item label="使用部门" prop="useDeptId">
          <el-popover style="margin-left: 10px;"
                      placement="right"
                      width="300"
                      trigger="click" :value="IsShowDeptpop" v-show="IsShowDeptpop">
            <el-form :inline="true" :model="deptInlineForm" class="demo-form-inline">
              <el-form-item label="使用部门:">
                <el-input v-model="deptInline1" clearable></el-input>
                <el-tree v-show="isShowDept" :highlight-current=true :default-expand-all=false
                         :style="{maxHeight: popheight,overflowY: 'scroll',width:270+'px'}"
                         :expand-on-click-node="true" :data="deptTree" :filter-node-method="filterNode"
                         @node-click="selectClassfy" class="width-220 selectTree-input objectTree"
                         ref="DeptTree"></el-tree>
              </el-form-item>
            </el-form>
            <el-tag slot="reference" effect="plain">使用部门添加</el-tag>
          </el-popover>
          <el-input v-show="!isShowDept" v-model="deptInline" clearable @click.native="deptInputInline"></el-input>
        </el-form-item>
        <el-form-item label="维保部门" prop="serviceDeptId">
          <el-popover style="margin-left: 10px;"
                      placement="right"
                      width="300"
                      trigger="click" :value="IsShowServicepop" v-show="IsShowServicepop">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="维保部门:">
                <el-input v-model="serviceInline1" clearable></el-input>
                <el-tree ref="ServiceTree" v-show="isShowService" :highlight-current=true :default-expand-all=false
                         :style="{maxHeight: popheight,overflowY: 'scroll',width:270+'px'}" node-key="code"
                         :expand-on-click-node="true" :data="serviceTree" :filter-node-method="filterNode2"
                         @node-click="selectClassfy2" class="width-220 selectTree-input objectTree"
                ></el-tree>
              </el-form-item>
            </el-form>
            <el-tag slot="reference" effect="plain">维保部门添加</el-tag>
          </el-popover>
          <el-input v-show="!isShowService" v-model="serviceInline" clearable
                    @click.native="serviceInputInline"></el-input>
        </el-form-item>
        <el-form-item label="生产厂家" prop="manufacturer">
          <el-input v-model="infoData.manufacturer" clearable/>
        </el-form-item>
        <el-form-item label="生产时间" prop="productionTime">
          <el-date-picker v-model="infoData.productionTime" placeholder="选择时间" value-format="timestamp" dateType="time" type="date" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
        <el-form-item label="设备状态" prop="state">
          <el-select v-model="infoData.state" clearable>
            <el-option v-for="item in statusList" :key="item.name" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="attachId">
          <el-upload
            list-type="picture"
            :action="actionurl"
            :headers="Thisauth"
            :on-preview="handlePreview"
            :before-upload="beforeUpload"
            :before-remove="beforeRemove"
            :file-list="fileList"
            :limit=1 :http-request="uploadMethod"
            :on-exceed="handleExceed">
            <el-button type="info" class="el-icon-upload2" circle plain v-show="showUpload"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="infoData.remark" type="textarea" clearable :rows="3" resize="none"
                    :maxlength="textareaMax" :show-word-limit="true"/>
        </el-form-item>
      </el-form>
      <el-dialog
        width="55%"
        title="新增设备保养计划配置"
        :visible.sync="innerVisible"
        append-to-body center :key="renderInner">
        <deviceLinkPlan :planset="msgPlan" />
        <span slot="footer" class="footerClass">
				<el-button @click="innerClose" >关闭</el-button>
			  </span>
      </el-dialog>
      <span slot="footer" class="footerClass">
				<el-button @click="close">取消</el-button>
				<el-button type="primary" @click="updateInfo('ruleForm')" v-prevent-re-click>确定</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
import deviceLinkPlan from '@/views/device/device/devicedetail/addAfterSetPlan'
export default {
  components:{deviceLinkPlan},
  data() {
    return {
      actionurl: 'http://192.168.10.152:10005/u/attach/upload',
      picUrl:this.documentEAMUrl('upload'),
      detailUrl:this.documentEAMUrl('preview'),
      Thisauth: { 'Authorization': `Bearer ${localStorage.getItem('eleToken')}` },  //给请求头部添加 权限
      editDialogVisible: false,
      innerVisible:false, //内部的dialog
      dialogImageUrl: '',
      deviceTitle: '',
      dialogVisible: false,
      editRender: 0,
      renderInner:0, //内部dialog的渲染
      msgPlan:{},
      isShowDept: true,    //部门tree
      IsShowDeptpop: true, //部门新添加按钮
      isShowService: true,  //维保tree
      IsShowServicepop: true,//维保新添加按钮
      isShowArea: true,   // 安装位置tree
      IsShowAreapop: true, // 安装位置按钮
      isshowDeviceType:true, //设备类型tree
      IsshowDeviceTypepop:true, // 设备类型按钮
      popheight: document.body.clientHeight * 0.3 + 'px',
      fileList: [],
      fileSource:{file:null},
      showUpload: true,
      textareaMax: 200,
      device_options: null,
      rules: {
        deviceName: [{
          required: true,
          message: '请输入设备名称',
          trigger: ['change', 'blur']
        }, {
          max: 64,
          message: '长度不可超过64位',
          trigger: ['change', 'blur']
        }],
        deviceKks: [{
          required: true,
          message: '请输入设备位号',
          trigger: ['blur', 'change']
        }, {
          max: 64,
          message: '长度不可超过64位',
          trigger: ['change', 'blur']
        }],
        assetCode:[{
          required: true,
          message: '请输入资产编号',
          trigger: ['blur', 'change']
        },{
          max: 64,
          message: '长度不可超过64位',
          trigger: ['change', 'blur']
        }],
        specificationModel: [{
          required: true,
          message: '请输入规格型号',
          trigger: ['blur', 'change']
        }, {
          max: 64,
          message: '长度不可超过64位',
          trigger: ['change', 'blur']
        }],
        installAreaId: [{
          required: true,
          message: '请选择安装位置',
          trigger: 'change'
        }],
        deviceTypeId: [{
          required: true,
          message: '请选择设备类型',
          trigger: 'change'
        }],
        isSpecial: [{
          required: true,
          message: '请选择是否为特种设备',
          trigger: 'change'
        }],
        mainParameters: [{
          required: true,
          message: '请输入主要参数',
          trigger: ['blur', 'change']
        }],
        useDeptId: [{
          required: true,
          message: '请选择使用部门',
          trigger: 'change'
        }],
        serviceDeptId: [{
          required: true,
          message: '请选择维保部门',
          trigger: 'change'
        }],
        manufacturer: [{
          required: true,
          message: '请输入生产厂家',
          trigger: ['blur', 'change']
        }],
        state: [{
          required: true,
          message: '请选择设备状态',
          trigger: 'change'
        }],
        productionTime: [{
          required: true,
          message: '请输入生产时间',
          trigger: ['blur', 'change']
        }]

      },
      infoData: {
        deviceName: '',
        deviceKks: '',
        assetCode: '',
        specificationModel: '',
        state: '',
        productionTime: '',
        id: 0,
        isSpecial: '',
        deviceTypeId: '',
        mainParameters: '',
        attachId: 0,
        remark: '',
        useDeptId: 0,
        serviceDeptId: 0,
        manufacturer: '',
        altitude: 0,
        latitude: 0,
        longitude: 0,
        installAreaId: null,
        picremarks: [],
        isSpecialName:'',
      },
      //选择部门表单
      deptInlineForm: {},
      serviceInlineForm: {},
      areaInlineForm: {},
      deviceTypeInlineForm:{},
      //选择部门的展示
      deptInline: '',
      deptInline1: '',
      serviceInline: '',
      serviceInline1: '',
      areaInline: '',
      areaInline1:'',
      deviceTypeInline:'',
      deviceTypeInline1:'',
      deptTree: [],
      serviceTree: [],
      areaTree: [],
      //deviceTypeTree:[],//设备树与绑定---device_options
      //设备状态表
      statusList: [ {
        name: 'test',
        code: '6'
      }],
      pickerOptions:{
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }]
      },//日期选择快捷选项
      ruleForm: []
    }
  },
  watch: {
    editDialogVisible(val) {
      if (val === false) {
        // 对dialog重新渲染
        this.forceRener()
      }
    },
    deptInline(val) {
      this.deptInline1 = ''
      if (val === '') {
        this.isShowDept = true
        this.IsShowDeptpop = true
        this.infoData.useDeptId = ''
      }
    },
    deptInline1(val){
      this.$refs.DeptTree.filter(val)
    },
    serviceInline(val) {
      this.serviceInline1 = ''
      if (val === '') {
        this.isShowService = true
        this.IsShowServicepop = true
        this.infoData.serviceDeptId = ''
      }
    },
    serviceInline1(val){
      this.$refs.ServiceTree.filter(val)
    },
    areaInline(val) {
      this.areaInline1 = ''
      if (val === '') {
        this.isShowArea = true
        this.IsShowAreapop = true
        this.infoData.installAreaId = ''
      }
    },
    areaInline1(val){
      this.$refs.AreaTree.filter(val)
    },
    deviceTypeInline(val){
      this.deviceTypeInline1 = ''
      if (val ===''){
        this.isshowDeviceType = true
        this.IsshowDeviceTypepop =true
        this.infoData.deviceTypeId = ''
      }
    },
    deviceTypeInline1(val){
      this.$refs.DeviceTypeTree.filter(val)
    },
    fileList(val) {
      //console.log(val)
      if (!val.length) {
        this.showUpload = true
      }
    }
  },
  created() {
    // 编辑bus传值&跳转实现
    this.$bus.$on('editInfo', (e) => {
      console.log('编辑-->>', e)
      this.deviceTitle = '设备编辑'
      this.fileList = []  //图片信息
      this.areaTree = []
      this.deptTree = []
      this.serviceTree = []
      this.statusList = []
      this.infoData.deviceName = e.name
      this.infoData.deviceKks = e.code //设备位号
      this.infoData.assetCode = e.zcnum   //资产编号
      this.infoData.specificationModel = e.ggtype
      this.infoData.state =  e.status.toString()
      this.infoData.productionTime = new Date(e.createTime).getTime() //生产时间 后端传送时间戳new Date(this.infoData.productionTime).getTime()
      this.infoData.id = e.id
      this.infoData.isSpecial = e.isTZ
      this.infoData.isSpecialName = e.isTZ // 是否为危险品名称表示
      this.infoData.installAreaId = e.installAreaId
      this.infoData.deviceTypeId = e.devicetype
      this.infoData.devicetypeName = e.devicetypeName
      this.infoData.mainParameters = e.mainParameters
      this.infoData.attachId = e.attachId  // 图片路径id
      this.infoData.remark = e.remark
      this.infoData.useDeptId = e.useDeptId
      this.infoData.serviceDeptId = e.serviceDeptId
      this.infoData.manufacturer = e.manufacturer
      // 保养部门信息显示
      this.isShowService = false
      this.IsShowServicepop = false
      //安装位置
      this.isShowArea = false
      this.IsShowAreapop = false
      // 使用部门信息显示
      this.isShowDept = false
      this.IsShowDeptpop = false
      //设备类型显示
      this.isshowDeviceType =false
      this.IsshowDeviceTypepop =false
      //部门树数据接收
      this.device_options = e.deviceTypeArry //设备类型
      this.statusList = e.statusTree // 状态树
      this.areaTree.push(e.installArea) //安装位置
      this.deptTree.push(e.deptTree) //使用部门
      this.serviceTree.push(e.serviceTree) // 维保部门
      //部门选项赋值
      this.areaInline =e.installAreaName //安装位置
      this.deviceTypeInline=this.infoData.devicetypeName //设备类型
      this.editDetails(e.id)  //接口调取安装位置
      // 额外3个隐藏参数 对应-》位置
      this.infoData.altitude = e.altitude
      this.infoData.latitude = e.latitude
      this.infoData.longitude = e.longitude
      setTimeout(()=>{
        this.editDialogVisible = true //显示dialog
        this.showUpload = true //显示上传按钮
      },120)
      //console.log('编辑after-->>', this.infoData)
    })

    // 新增按钮跳转实现
    this.$bus.$on('add', (e) => {
      console.log('新增->', e)
      if (e.ps === true) {
        Object.keys(this.infoData).forEach(key => (this.infoData[key] = ''))
        this.deviceTitle = '设备新增'
        this.serviceInline = ''
        this.serviceInline1 = ''
        this.deptInline = ''
        this.deptInline1 = ''
        this.areaInline = ''
        this.areaInline1 = ''
        this.deviceTypeInline1= ''
        this.deviceTypeInline =''
        this.infoData.picremarks = []
        this.statusList = []
        this.areaTree = []
        this.deptTree = []
        this.serviceTree = []
        this.fileList = []
        this.areaTree.push(e.installArea)
        this.deptTree.push(e.deptTree) //使用部门
        this.serviceTree.push(e.serviceTree)
        this.device_options = e.deviceTypeArry
        this.statusList = e.statusTree // 状态树
        if (e.addAreaMsg!==null){ //若不为null，这时新增区域自动显示
          this.areaInline = e.addAreaMsg.label
          this.infoData.installAreaId = e.addAreaMsg.id
          this.isShowArea = false
          this.IsShowAreapop =false
        }
        this.editDialogVisible = true
      }
    })

  },
  beforeDestroy() {
    this.$bus.off('add')
    this.$bus.off('editInfo')
  },
  methods: {
    //编辑 新增 实现
    updateInfo(formName) {
      //console.log('确定提交前-', this.infoData)
      this.infoData.isSpecial = this.infoData.isSpecialName === '是' ? 1 : 0
      this.$refs[formName].validate((valid) => {
        //this.infoData.productionTime = new Date(this.infoData.productionTime).getTime()
        if (valid) { //表单验证合格后进行 update操作
          if (this.deviceTitle === '设备编辑') {
            let params = this.infoData
            this.$axios.post('/d/device/update', params).then(res => {
              if (res.data.code === 0) {
                setTimeout(() => {
                  this.close()
                  this.$bus.emit('deviceReload', true)
                }, 300)
                this.$message({
                  message: '成功修改',
                  type: 'success'
                })
              } else {
                this.$message.error(res.data.message)
              }
            }).catch(err => {
              console.log(err)
            })
          } else if (this.deviceTitle === '设备新增') {
            //新增功能的实现 s
            let addparams = {
              deviceName: this.infoData.deviceName,
              deviceKks: this.infoData.deviceKks,
              assetCode: this.infoData.assetCode,
              specificationModel: this.infoData.specificationModel,
              installAreaId: this.infoData.installAreaId, //安装位置
              installAreaName:this.infoData.installAreaName,
              deviceTypeId: this.infoData.deviceTypeId,
              isSpecial: this.infoData.isSpecial,
              mainParameters: this.infoData.mainParameters,
              useDeptId: this.infoData.useDeptId,  //使用部门
              serviceDeptId: this.infoData.serviceDeptId,  //维保部门
              manufacturer: this.infoData.manufacturer, //生产厂家
              productionTime: this.infoData.productionTime,
              state:this.infoData.state,
              attachId: this.infoData.attachId, //图片上传
              remark: this.infoData.remark, //备注
              // longitude: this.infoData.longitude,
              // latitude: this.infoData.latitude,
              //altitude: this.infoData.altitude,
              longitude: 0, //测试
              latitude: 0,  //测试
              altitude: 0  //测试
            }
            console.log('add=>', addparams)
            this.$axios.post('/d/device/add', addparams).then(res => {
              if (res.data.code === 0) {
                //请求成功则重刷新
                this.msgPlan = {
                  id:res.data.data.id,
                  show: true
                }
                this.$message.success('新增成功')
                setTimeout(() => {
                  //直接进行保养计划的执行
                  this.innerVisible = this.msgPlan.show
                  //this.$bus.emit('deviceReload', true)
                  //this.close()
                }, 300)
              } else {
              this.$message.error(res.data.message)
              }
            }).catch(err => {
              console.log('add功能新增出错-》', err)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //编辑时--》查找接口getbyId--显示数据
    editDetails(Tid){
      let parm={
        id:Tid
      }
      this.$axios.post('/d/device/getDetailById',parm).then(res=>{
        if (res.data.code ===0){
          console.log('getdetail 接口:',res.data.data)
          let deviceDetails=res.data.data.device
          this.serviceInline=deviceDetails.serviceDeptName // 维保部门
          this.deptInline=deviceDetails.useDeptName // 使用部门
          //如果有传入的图片 则显示
          if (res.data.data.devicePicture){
            this.fileList=[{
              name:res.data.data.devicePicture.fileName,
              url:this.picUrl+res.data.data.devicePicture.filePath
            }]
            this.showUpload = false
          }
        }else {
          this.$message.error(res.data.message)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    //部门input inline
    deptInputInline() {
      this.isShowDept = true
      this.IsShowDeptpop = true
      this.deptInline = ''
    },
    serviceInputInline() {
      this.isShowService = true
      this.IsShowServicepop = true
      this.serviceInline = ''
    },
    areaInputInline() {
      this.IsShowAreapop = true
      this.isShowArea = true
      this.areaInline = ''
    },
    deviceInputInline(){
      this.IsshowDeviceTypepop =true
      this.isshowDeviceType =true
      this.deviceTypeInline =''
    },
    //选择器树节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    filterNode2(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    filterNode3(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    filterNode4(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    selectClassfy(data) {
      //console.log('tree', data)
      this.deptInline1 = data.label
      this.deptInline = this.deptInline1
      this.infoData.useDeptId = data.id
      this.isShowDept = false
      this.IsShowDeptpop = false
    },
    //维保部门
    selectClassfy2(data) {
      //console.log('stree', data)
      this.serviceInline1 = data.label
      this.serviceInline = this.serviceInline1
      this.infoData.serviceDeptId = data.id
      this.isShowService = false
      this.IsShowServicepop = false
    },
    //安装位置
    selectClassfy3(data) {
      //console.log('areatree', data)
      this.areaInline1 =data.label
      this.areaInline = this.areaInline1
      this.infoData.installAreaId = data.id
      this.isShowArea = false
      this.IsShowAreapop = false
    },
    //设备类型
    selectClassfy4(data) {
      //console.log('devicetypetree', data)
      this.deviceTypeInline1 = data.label
      this.deviceTypeInline =  this.deviceTypeInline1
      this.infoData.deviceTypeId = data.id
      this.isshowDeviceType = false
      this.IsshowDeviceTypepop = false
    },
    close() {
      this.editDialogVisible = false
    },
    innerClose(){
      this.innerVisible = false
      setTimeout(()=>{
        this.close()
      },100)
      this.$bus.emit('deviceReload', true)
    },
    forceRener() {
      this.editRender += 1
    },
    handlePreview(file) {
      console.log('已上传的文件-》', file)
      let url = file.url
      window.open(this.detailUrl + encodeURIComponent(url))
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    uploadMethod(){
      this.fileList = []
      let formData = new FormData()
      formData.append('file', this.fileSource.file)
      formData.append('source', 2)
      this.$axios.post('/u/attach/upload', formData).then(res => {
        console.log('----上传后的data----', res.data.data)
        if (res.data.code === 0) {
          // this.$message({
          //   type: 'success',
          //   message: '文件成功上传!'
          // })
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
          this.infoData.attachId = res.data.data.id
          this.infoData.picremarks.push(pic)
          //this.infoData.id = 1
          this.fileList = [{
            name: pic.fileName,
            url:  this.picUrl+pic.filePath
          }]
          if (this.fileList.length > 0) {
            this.showUpload = false
          }
          // console.log('上传成功后，文档关联id',this.infoData.attachId)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除这个文件？`).then(() => {
        this.fileList = []
        this.infoData.attachId = 0   //id图片关联 删除
        this.fileSource.file = null
      })
    },
    beforeUpload(file) {
      // console.log('上传前操作',file)  这儿自己手动进行上传
      this.fileSource.file = file
    }
  }
}
</script>

<style scoped>
.editDialog >>>.el-input__count{
  background: none;
  bottom:-5px;
}
</style>
