<template>
  <div class="deviceIndex">
    <el-card shadow="always">
      <el-form :inline="true" :model="device_model" class="demo-form-inline">
        <el-form-item label="设备名称">
          <el-input v-model="device_model.name" placeholder="请输入内容" @input="device_name_show" clearable/>
        </el-form-item>
        <el-form-item label="设备位号">
          <el-input v-model="device_model.code" placeholder="请输入内容" @input="device_code_show" clearable/>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-popover placement="bottom" width="250" trigger="click" v-model="topPopoShow">
            <el-tree :highlight-current="true" :default-expand-all="false"
                     :style="{maxHeight: 150+'px',overflowY: 'scroll',width: 220+'px'}"
                     :expand-on-click-node="true" :data="device_options" :filter-node-method="filterNode"
                     @node-click="selectClassfy" class="width-220 selectTree-input objectTree"
                     ref="DeviceTypeTree"></el-tree>
            <div class="topPop">
              <el-button size="mini" type="text" @click="blankMsg">取消</el-button>
              <el-button type="primary" size="mini" @click="topPopoShow = false">确定</el-button>
            </div>
            <el-input v-model="device_model.deviceTypeArry" clearable @focus="showtree" placeholder="类型选择"
                      slot="reference"/>
          </el-popover>

        </el-form-item>
        <el-form-item label="是否特种设备">
          <el-select v-model="device_model.radio" placeholder="请输入内容" @change="tzchange">
            <el-option v-for="item in isTZdata" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="always">
      <el-row style="margin-bottom: 5px;">
        <el-button type="primary" @click="addlist">新增</el-button>
<!--        <el-button type="danger" @click="deleteItems" :disabled="isDeleteAll">批量删除</el-button>-->
        <el-button type="warning" @click="gotoSort">设备分类</el-button>
        <!-- <div id="qrcode" :ref="'qrcode_'+1"></div> -->
      </el-row>
      <el-table v-loading="loading" ref="multipleTable" :data="tableData" border style="width: 100%"
                :max-height="tableHeight"
                @selection-change="selectionchange" :row-key="getRowKeys">
        <el-table-column type="selection" :reserve-selection="true" width="55" align="center"></el-table-column>
        <el-table-column prop="index" label="序号" width="100" align="center"/>
        <el-table-column prop="ewm" label="二维码id" min-width="180" align="center"/>
        <el-table-column prop="name" label="设备名称" min-width="180" align="center" show-overflow-tooltip/>
        <el-table-column prop="devicetypeName" label="设备类型" min-width="180" align="center" show-overflow-tooltip/>
        <el-table-column prop="code" label="设备位号" min-width="180" align="center" show-overflow-tooltip/>
        <el-table-column prop="zcnum" label="资产编号" min-width="180" align="center" show-overflow-tooltip/>
        <el-table-column prop="ggtype" label="规格型号" min-width="180" align="center" show-overflow-tooltip/>
        <el-table-column prop="stateName" label="状态" min-width="180" align="center"/>
        <el-table-column prop="createTime" label="生产时间" min-width="180" align="center"/>
        <el-table-column prop="isTZ" label="是否特种设备" min-width="180" align="center"/>
        <el-table-column fixed="right" label="操作" min-width="300" align="center">
          <template v-slot="scope">
            <div class="action">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom" :open-delay="otherTooltipDelay">
                <el-tag @click.prevent="updateList(scope.row)">编辑</el-tag>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom" :open-delay="otherTooltipDelay">
                <el-popover placement="right" width="400" trigger="click" :ref="`popover-${scope.$index}`">
                  <p>确定删除设备 <b style="color: red">{{ scope.row.name }}</b> 的信息吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button  size="mini" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                    <el-button type="primary" size="mini" @click="deleteItem(scope.row)">确定</el-button>
                  </div>
                  <el-tag slot="reference" type="danger">删除</el-tag>
                </el-popover>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="详情" placement="bottom" :open-delay="otherTooltipDelay">
                <el-tag @click="lookList(scope.row)" type="success">详情</el-tag>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="更多" placement="bottom" :open-delay="otherTooltipDelay">
                <el-tag @click="moreList(scope.row)" type="warning">更多</el-tag>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="二维码" placement="left" :open-delay="ewmDelay">
                <div slot="content" ref="imageWrapper">
                  <div style="text-align: center;font-size: 18px;"> {{ scope.row.ewm }}信息
                    <el-link icon="el-icon-download" type="primary" style="font-size: 13px;margin-left: 5px"
                             :underline="false" v-print="'#scopeindex'">打印二维码
                    </el-link>
                  </div>
                  <div class="channelQrcode" id="scopeindex" >
<!--                    <div style="display: flex;justify-content: center;font-size: 13px;">{{ scope.row.ewm }}信息</div>-->
                    <qrcode-vue class="showqrcode" :value="scope.row.ewm" :size="'150'" level="H" style="display: flex;justify-content: center"></qrcode-vue>
                  </div>
                </div>
                <el-tag>二维码</el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="block" style="margin-top:15px;">
        <el-pagination v-show="total!==0" align="center" :current-page="currentPage" :page-sizes="[10,15,20]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"/>
      </div>
    </el-card>
    <!--编辑/更新dialog-->
    <Editdialog/>
    <!-- 设备详情接口 -->
    <deviceDetaildialog/>
    <!-- 尝试性打印   -->
    <!--    <div ref="printText" v-show="false"></div>-->
  </div>
</template>

<script>
import Editdialog from './devicedetail/editdialog.vue'
import deviceDetaildialog from './devicedetail/deviceDetaildialog.vue'
import QrcodeVue from 'qrcode.vue'
// import vueQr from 'vue-qr'
export default {
  name: 'DeviceIndex',
  components: {
    Editdialog,
    deviceDetaildialog,
    QrcodeVue
  },
  data() {
    return {
      loading: false,
      chooseId: [],//批量删除数组
      chooseDevice: [],//判断批量删除时，有无设备在跑流程
      isDeleteAll: true, //是否可以批量删除
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 180, // 表格高度
      currentPage: 1,
      pageSize: 10,
      size: 30,
      total: 1,
      numberPage: 0, //当前页数数据数量
      ewmDelay: 260, //二维码显示延迟的时间
      otherTooltipDelay: 260, //其他的tooltip显示延迟的时间
      aHref: null, //二维码下载地址
      loadName: null, // 二维码下载图片的名字
      topPopoShow: false,//搜索框-设备类型tree
      popheight: document.body.clientHeight * 10 + 'px',
      addAreaMsg:null,
      tableData: [{
        name: '设备1',
        code: 'css1',
        zcnum: '锅炉',
        ggtype: 'ABC',
        status: '运行中',
        createTime: '2019-8-1 08:00:00',
        devicetype: '车闸',
        isTZ: '是',
        stateName: '状态名',
        devicetypeName: '设备名',
        installAreaName: '安装位置'
      }],
      installArea: [], //安装位置数据
      deptDatas: null, // 组织机构数据
      serviceDatas: null, //维保部门数据
      jsonData: {
        // id: null,
        deviceName: '',
        deviceTypeId: null,
        deviceKks: '',
        isSpecial: '',
        pageNo: 1,
        pageSize: 10
      },
      jsonDevice: {
        id: 0,
        catalog: 1  //1:设备 2:备品备件 0:所有
      },
      // 筛选
      device_model: {
        name: '',
        code: '',
        deviceType: '',
        radio: '全部',
        deviceTypeArry: ''
      },
      //设备状态
      device_status: null,
      //设备类型
      device_options: [{
        value: '1',
        label: '炉管'
      }, {
        value: '2',
        label: '罐类'
      }],
      //是否为危险品
      isTZdata: [{
        value: '',
        label: '全部'
      }, {
        value: 1,
        label: '是'
      }, {
        value: 0,
        label: '否'
      }]
    }
  },
  created() {
    this.getDeviceOptions() //获取类型分类
    this.getOrgInfo() //组织机构获取
    this.getStatus() // 状态获取
    this.getTable() //获取table数据
    this.$bus.$on('deviceReload', e => {
      if (e === true) {
        this.getTable()
      } else {
        this.$message({
          type: 'error',
          message: '系统操作出错！'
        })
      }
    })
    this.$bus.$on('clickCheck', e => {
      console.log(e)
      if (e) {
        this.jsonData.installAreaCode = e.code
        if (e.code === "LFSY"){
          this.jsonData.deviceName=''
          this.jsonData.deviceKks = ''
          this.jsonData.deviceTypeId = null
          this.device_model.deviceTypeArry = ''
        }
        this.addAreaMsg = e
        console.log('点击新增后要显示区域',this.addAreaMsg)
        this.getTable()
        //this.jsonData.installAreaCode = null
      }
    })
  },
  mounted() {
    //this.qrcode(1);
    this.$bus.$on('devicePlace', e => {
      this.installArea = e
      //console.log('place', this.installArea)
    })
  },
  destroyed() {
    this.$bus.off('editInfo')
    this.$bus.off('add')
    this.$bus.off('shownav')
    this.$bus.off('deviceReload')
    this.$bus.off('devicePlace')
  },
  watch: {
    'device_model.deviceTypeArry': {
      handler: function(val) {
        this.$refs.DeviceTypeTree.filter(val)
        if (val === '') {
          this.jsonData.deviceTypeId = null
        }
      }
    }
  },
  methods: {
    //获取设备分类
    getdata() {
      this.$axios.post('/d/deviceType/query', this.jsonData).then(res => {
        if (res.data.code === 0) {
          //console.log(res.data.data)
          const data = res.data.data
          this.updateTree.push(data[0].id)
          for (let i = 0; i < data.length; i++) {
            this.data.push(res.data.data[i])
          }
        } else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
        }
      })
    },
    //设备类型获取
    getDeviceOptions() {
      this.getDeviceTypeQueryTree(this.jsonDevice).then(res => {
        if (res.data.code === 0) {
          this.device_options = res.data.data
          console.log('设备类型', this.device_options)
        }
      }).catch(err => {
        console.log('设备类型获取错误', err)
      })
    },
    //组织机构获取
    getOrgInfo() {
      let parm = {
        name: 'test'
      }
      this.deptData(parm).then(res => {
        if (res.data.code === 0) {
          //console.log('组织机构',res.data.data)
          this.deptDatas = res.data.data //组织部门
          this.serviceDatas = res.data.data //维保部门
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //二维码打印
    showewm(item) {
      console.log(item)
      console.log(document.querySelectorAll('.showqrcode'))
      // var oQrcode = document.querySelectorAll('.channelQrcode img')
      // var url = oQrcode[item.index].toDataURL()
      // console.log('url',url)
      // var a = document.createElement('a')
      // var event = new MouseEvent('click')
      // // 下载图名字
      // a.download = item.name
      // a.href = url
      // // 合成函数，执行下载
      // a.dispatchEvent(event)
      // *************** 二维码下载方式 ****************
      this.aHref = null
      this.loadName = null
      let canlength = document.querySelectorAll('.showqrcode').length
      //console.log(canlength)
      // window.document.body.innerHTML=canlength
      // window.print()
      // this.aHref=canvas[0].toDataURL()
      // this.loadName = item.name+'的二维码'
      // this.$message('正在下载中....')
      let canvas = document.querySelectorAll('.showqrcode')[canlength - 1].getElementsByTagName('canvas')
      //console.log(canvas[0].toDataURL())
      let theinner =
        `<div style='display: flex;justify-content: center;'>${item.name}</div><div style='display: flex;justify-content: center'><img src=${canvas[0].toDataURL()} style="margin: 20px auto;"/></div>`
      window.document.body.innerHTML = theinner
      setTimeout(() => {
        window.print()
        this.$router.go(0)
      }, 100)
    },
    qrcode(id) {
      console.log(id)
      // new QRCode(this.$refs. ['qrcode_' + id], {
      // 	width: 50,
      // 	height: 50,
      // 	text: id, // 二维码地址
      // 	colorDark: "#000",
      // 	colorLight: "#fff",
      // })
    },
    //获取table数据
    getTable() {
      // if (placeid) {
      // 	this.jsonData.installAreaId =placeid  //左击右侧 进行查询
      // }
      this.getDeviceQuery(this.jsonData).then(res => {
        if (res.data.code === 0) { //查询到数据
          //console.log(res)
          let data = res.data.data.content
          console.log('设备列表请求', data)
          this.numberPage = res.data.data.number
          //console.log('当前页数数据数量', this.numberPage)
          this.loading = true
          let that = this
          setTimeout(function() {
            if (data.length !== 0) { //如果请求数据不为空
              that.total = res.data.data.totalElements //列表总数
              for (var i = 0; i < data.length; i++) {
                var obj = {}
                obj.index = that.jsonData.pageNo * that.jsonData.pageSize - that.jsonData.pageSize + i + 1
                obj.id = data[i].id
                obj.ewm = JSON.stringify(data[i].id) //id -》二维码
                //that.qrcode(data[i].id)
                obj.name = data[i].deviceName //设备名称
                obj.devicetype = data[i].deviceTypeId //设备类型id
                obj.devicetypeName = data[i].deviceTypeName //设备类型name
                obj.code = data[i].deviceKks //设备位号
                obj.zcnum = data[i].assetCode //资产编号
                obj.ggtype = data[i].specificationModel //规格类型
                obj.status = data[i].state //状态id
                obj.stateName = data[i].stateName //状态
                //obj.statusString = that.statusChange(data[i].state) //状态number -> 字符串信息 不用了
                obj.createTime = that.formatDate(data[i].productionTime).split(' ')[0]
                obj.isTZ = data[i].isSpecial === 1 ? '是' : '否' //是否为特种设备
                //下面的 update-编辑按钮 时 必须要有的 参数
                obj.altitude = data[i].altitude // 高度? 0
                obj.attachId = data[i].attachId // 图片路径id null
                obj.installAreaId = data[i].installAreaId // 安全区域位置id
                obj.installAreaName = data[i].installAreaName
                obj.latitude = data[i].latitude // 维度? 0
                obj.longitude = data[i].longitude // 经度? 0
                obj.mainParameters = data[i].mainParameters // 主要参数
                obj.manufacturer = data[i].manufacturer // 生产厂家
                obj.remark = data[i].remark // 备注
                obj.serviceDeptId = data[i].serviceDeptId // 维保部门id
                obj.useDeptId = data[i].useDeptId // 使用部门id
                obj.isMaintenancing = data[i].isMaintenancing // 设备是否在流程中?  0:不在流程-可删 1:在流程中-不可删
                that.tableData.push(obj)
              }
              //console.log('表', that.tableData)
            } else {
              that.tableData = []
              that.total = 0
            }
            that.loading = false //要执行的事件
          }, 500) //500代表延迟毫秒值
          this.tableData = [] //每次默认置空
        } else {
          this.$notify.error({
            title: '请求失败',
            message: res.data.message
          })
          this.tableData = []
        }

      })
    },
    // 批量删除-- el-table 框
    getRowKeys(row) {
      return row.index
    },
    //设备名称
    device_name_show(event) {
      //console.log(event)
      this.jsonData.deviceName = event
    },
    //设备位号
    device_code_show(event) {
      //console.log(event)
      this.jsonData.deviceKks = event
    },
    //是否特种设备
    tzchange(val) {
      //	console.log(val)
      this.jsonData.isSpecial = val
    },
    //顶部查询按钮 筛选信息
    onSubmit() {
      //console.log('submit!')
      //this.jsonData.installAreaCode = null
      this.addAreaMsg =null
      this.jsonData.pageNo = 1
      this.jsonData.pageSize = 10
      this.getTable()
    },
    selectionchange(data) {
      this.chooseId = [] //每次选择重置批量
      this.chooseDevice = [] //重置
      this.isDeleteAll = data.length === 0
      console.log(data)
      for (let i = 0; i < data.length; i++) {
        this.chooseId.push(data[i].id)
        let obj={
          id: data[i].id,
          name: data[i].name,
          isMaintenancing: data[i].isMaintenancing
        }
        this.chooseDevice.push(obj)
      }
      //console.log('462-',this.chooseDevice)
    },
    // 批量删除按钮
    deleteItems() {
      // this.$bus.emit('deviceDelete', this.tableData)
      this.$confirm('是否删除该设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let result =this.isDeleteConfirm(this.chooseDevice)
        let src=''
        for (let key of result){
          src = src+key.name+','
        }
        //console.log(result)
        if (result.length>0){
          this.$confirm(`选定删除设备中:<b style="color: red">${src}</b>设备处于维修(保养,作业票)流程中，请将其流程终止后删除`,'删除警告',{
            dangerouslyUseHTMLString: true
          }).then(()=>{
            this.$refs.multipleTable.clearSelection()
            this.jsonData.pageNo = 1
            this.getTable()
          })
        }else {
          this.deletshow()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    deletshow() {
      let deletParam = {
        ids: this.chooseId
      }
      if (this.chooseId.length >= this.numberPage) {
        this.jsonData.pageNo = 1
        this.jsonData.pageSize = 10
      }
      this.$axios.post('/d/device/delete', deletParam).then(res => {
        //console.log(res)
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '设备删除成功.'
          })
          setTimeout(() => {
            this.$refs.multipleTable.clearSelection()
            //删除成功后，如果把一页数据全删，要页数调整
            this.getTable()
          }, 500)
        } else {
          this.$message.error('删除失败')
          //console.log(res.data.message)
        }
      }).catch(err => {
        this.$message.error('服务异常')
      })
    },
    // 单独右侧删除按钮
    deleteItem(row) {
      //console.log(row)
        let pam = {
          id: row.id
        }
        this.$axios.post('/d/device/deleteById', pam).then(res => {
          //console.log(res)
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '成功删除'
            })
            this.currentPage = this.deleteLastPageData(this.total,this.pageSize,this.currentPage)
            this.jsonData.pageNo = this.currentPage
            this.getTable()
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          console.log(err)
        })
    },
    //批量删除判断
    isDeleteConfirm(arry){
       return arry.filter(item=>item.isMaintenancing !==0)
    },
    // 编辑
    updateList(item) {
      item.installArea = this.installArea
      item.deviceTypeArry = this.device_options
      item.deptTree = this.deptDatas
      item.serviceTree = this.serviceDatas
      item.statusTree = this.device_status
      this.$bus.emit('editInfo', item)
    },
    // 添加信息
    addlist() {
      let pam = {
        ps: true,
        installArea: this.installArea,
        deviceTypeArry: this.device_options,
        deptTree: this.deptDatas,
        serviceTree: this.serviceDatas,
        statusTree: this.device_status,//设备状态
        addAreaMsg: this.addAreaMsg //若点击区域后，新增时自动添加
      }
      this.$bus.emit('add', pam)
    },
    // 详情
    lookList(row) {
      //console.log(row)
      let item = {
        id: row.id,
        stateName: row.stateName
      }
      this.$bus.emit('shownav', item)
    },
    // 更多
    moreList(row) {
      // 存储更多本页面数据
      sessionStorage.setItem('deviceStatus', JSON.stringify(row))
      this.$router.push({
        path: '/device/index/deviceOverview'
      })
    },
    //查询状态
    getStatus() {
      let parm = {
        parentCode: 'deviceState'
      }
      this.getStateInfo(parm).then(res => {
        if (res.data.code === 0) {
          //console.log('状态查询', res.data.data)
          this.device_status = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //搜索框-设备类型tree
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    selectClassfy(data) {
      //console.log('tree', data)
      this.device_model.deviceTypeArry = data.label
      this.jsonData.deviceTypeId = data.id
    },
    showtree() {
      this.device_model.deviceTypeArry = ''
      this.jsonData.deviceTypeId = null
    },
    //取消
    blankMsg() {
      this.topPopoShow = false
      this.device_model.deviceTypeArry = ''
      this.jsonData.deviceTypeId = null
    },
    gotoSort() {
      this.$router.push({
        path: '/device/deviceSort'
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.currentPage = 1
      this.pageSize = val
      this.jsonData.pageSize = val
      this.jsonData.pageNo = 1
      this.getTable()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
      this.jsonData.pageNo = val
      this.getTable()
    }
  }
}
</script>
<style scoped>
.deviceIndex {
  padding: 10px;
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

.topPop {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>
