<template>
  <div class="deviceDetaildialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="deviceTitle" :visible.sync="editDialogVisible"
               width="30%"
               center :key="editRender">
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm" size="small">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="infoData.deviceName" disabled/>
        </el-form-item>
        <el-form-item label="设备位号" prop="deviceKks">
          <el-input v-model="infoData.deviceKks" disabled/>
        </el-form-item>
        <el-form-item label="资产编号" prop="assetCode">
          <el-input v-model="infoData.assetCode" disabled/>
        </el-form-item>
        <el-form-item label="规格型号" prop="specificationModel">
          <el-input v-model="infoData.specificationModel" disabled/>
        </el-form-item>
        <el-form-item label="安装位置" prop="installAreaId">
          <el-input v-model="infoData.installAreaId" placeholder="请选择" disabled/>
        </el-form-item>
        <el-form-item label="设备类型" prop="deviceTypeId">
          <el-input v-model="infoData.deviceTypeId" disabled/>
        </el-form-item>
        <el-form-item label="是否为特种设备" prop="isSpecial">
          <el-radio v-model="infoData.isSpecial" label="是" disabled>是</el-radio>
          <el-radio v-model="infoData.isSpecial" label="否" disabled>否</el-radio>
        </el-form-item>
        <el-form-item label="重要参数" prop="mainParameters">
          <el-input type="textarea" v-model="infoData.mainParameters"  :rows="3" show-word-limit :maxlength="200" disabled/>
        </el-form-item>
        <el-form-item label="使用部门" prop="useDeptId">
          <el-input v-model="infoData.useDeptId" disabled/>
        </el-form-item>
        <el-form-item label="维保部门" prop="serviceDeptId">
          <el-input v-model="infoData.serviceDeptId" disabled/>
        </el-form-item>
        <el-form-item label="生产厂家" prop="manufacturer">
          <el-input v-model="infoData.manufacturer" disabled/>
        </el-form-item>
        <el-form-item label="生产时间" prop="productionTime">
          <el-input v-model="infoData.productionTime" disabled/>
        </el-form-item>
        <el-form-item label="设备状态" prop="state">
          <el-input v-model="infoData.state" disabled/>
        </el-form-item>
        <el-form-item label="图片" prop="attachId">
          <el-image :src="src" @click="showImg" style="width: 100px; height: 100px">
            <div slot="error" class="image-slot">
              (没有上传图片!)
            </div>
          </el-image>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="infoData.remark" type="textarea" :rows="3" disabled/>
        </el-form-item>
        <el-form-item label="保养计划">
<!--          <el-col :span="12">-->
<!--            <el-input v-model="planNum" disabled/>-->
<!--          </el-col>-->
<!--          <el-col :span="12">-->
            <el-button style="margin-left: 15px;" type="primary" @click="planSet" round>保养计划</el-button>
<!--          </el-col>-->
        </el-form-item>
      </el-form>
      <el-dialog
        width="55%"
        title="保养计划配置"
        :visible.sync="innerVisible"
        append-to-body center :key="renderInner">
        <deviceLinkPlan :planset="msgPlan" />
         <span slot="footer" class="footerClass">
				<el-button @click="innerVisible = false" >关闭</el-button>
			  </span>
      </el-dialog>
      <span slot="footer" class="footerClass">
				<el-button type="primary" @click="updateInfo('ruleForm')">确定</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
import deviceLinkPlan from '@/views/device/device/devicedetail/deviceLinkPlan'
export default {
  components:{deviceLinkPlan},
  data() {
    return {
      editDialogVisible: false,
      dialogImageUrl: '',
      deviceTitle: '',
      uploadurl:this.documentEAMUrl('upload'),
      dialogVisible: false,
      editRender: 0,
      src: null,
      innerVisible: false, //内置dialog
      fileList: [], //pic
      //planNum: '', //保养计划编号
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
        installAreaId: null
      },
      renderInner:40,
      planset:null,//传输设备信息，实现对于设备保养计划的设置
      msgPlan:null,
      stateName: null,
      devicepic: null,
      ruleForm: [],
      areTree: [],  //位置树
      deptTree: [],
      serviceTree: [],
      statusTree: []
    }
  },
  watch: {
    innerVisible(val){
      if (val === false){
         this.renderInner+=1
      }
    }
  },
  mounted() {
    this.$bus.off('shownav')
    this.$bus.$on('shownav', (e) => {
      //console.log('e传来的值', e)
      this.planset =null
      this.planset = e
      this.deviceTitle = '设备详情'
      let getId = {
        id: e.id
      }
      this.stateName = e.stateName
      this.fileList = []
      this.src = null
      this.$axios.post('/d/device/getDetailById', getId).then(res => {
        //console.log('详情接口-', res.data.data.device)
        if (res.data.code === 0) {
          //对设备数据渲染
          this.infoData = res.data.data.device
          this.infoData.isSpecial = this.infoData.isSpecial === 1 ? '是' : '否'  //是否为特种设备
          this.infoData.productionTime = this.formatDate(this.infoData.productionTime)
          this.infoData.useDeptId = res.data.data.device.useDeptName
          this.infoData.serviceDeptId = res.data.data.device.serviceDeptName
          this.infoData.deviceTypeId = res.data.data.device.deviceTypeName
          this.infoData.installAreaId = res.data.data.device.installAreaName
          console.log('详情->设备', this.infoData)
          //对设备图片渲染
          let pic = null
          this.fileList = []
          this.devicepic = res.data.data.devicePicture
          if (this.devicepic) {
            pic = {
              name: this.devicepic.fileName,
              url: this.uploadurl + this.devicepic.filePath
            }
            this.fileList.push(pic)
            this.src = this.uploadurl + this.devicepic.filePath
          }
          //console.log('详情->设备图片', this.devicepic)
          this.editDialogVisible = true
          this.infoData.state = this.stateName
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    })
  },
  methods: {
    updateInfo(formName) {
      this.$refs[formName].resetFields()
      this.close()
    },
    close() {
      this.editDialogVisible = false
    },
    handleChange(file, fileList) {
    },
    showImg() {
      let url = this.src
      window.open(this.documentEAMUrl('preview') + encodeURIComponent(url))
    },
    //保养计划测试
    planSet() {
      this.innerVisible = true
      this.msgPlan =this.planset
    }
  },
  destroyed() {
  }
}
</script>

<style scoped>

</style>
