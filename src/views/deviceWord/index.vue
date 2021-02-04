<template>
  <div class="deviceWord">
    <el-card shadow="always">
      <el-form :inline="true" :model="maintain" class="demo-form-inline">
        <el-form-item label="文档名称">
          <el-input v-model="maintain.name" placeholder="请输入文档名称" @input="maintain_show" clearable/>
        </el-form-item>
        <el-form-item label="文档类型">
          <el-select v-model="maintain.documentType" placeholder="请选择" @change="wordType_show" clearable>
            <el-option v-for="item in optionList" :key="item.name" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="上传时间">-->
        <!--          <el-date-picker v-model="maintain.createTime" type="date" placeholder="请选择日期" @change="maintain_show"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="是否绑定设备">
          <el-select v-model="maintain.catalog" @change="catalog_show" placeholder="请选择">
            <el-option v-for="item in catalogList" :key="item.label" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="onSubmit(maintain)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card" shadow="always">
      <el-row style="margin-bottom: 5px;">
        <el-button type="primary" @click="addOverviewSix">上传</el-button>
        <el-button type="danger" @click="deleteList" :disabled="isDelete">批量删除</el-button>
        <!--        <el-upload class="upload-demo" style="display: inline-block;margin: 0 10px;" action="" :show-file-list="false"-->
        <!--                   :on-change="handleChange" :on-remove="handleRemove" :on-exceed="handleExceed" :limit="100" accept="application/vnd.openxmlformats- -->
        <!--                    officedocument.spreadsheetml.sheet,application/vnd.ms-excel"-->
        <!--                   :auto-upload="false">-->
        <!--          <el-button type="primary">批量导入</el-button>-->
        <!--        </el-upload>-->
        <el-button type="success" :disabled="isDelete" @click="downLoadZip">批量导出</el-button>
      </el-row>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" :max-height="tableHeight"
                :row-key="getRowKeys"
                @selection-change="selectionchange" ref="deviceWordTable">
        <el-table-column type="selection" width="55" align="center" :reserve-selection="true"></el-table-column>
        <el-table-column prop="index" label="序号" width="100" align="center"/>
        <el-table-column label="文档名称" show-overflow-tooltip prop="name" min-width="180" align="center">
          <!-- <template slot-scope="scope">
            <el-popover trigger="hover" placement="top" :open-delay="delayTime">
              <p>文档名: {{ scope.row.name }}</p>
              <p>最新上传时间: {{ scope.row.updateTime }}</p>
              <div slot="reference" @click="LookDetail(scope.row)" class="name-wrapper">
                <a>{{ scope.row.name }}</a>
              </div>
            </el-popover>
          </template> -->
          <template slot-scope="scope">
            <span @click="LookDetail(scope.row)" style="cursor: pointer;">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column v-for="item in listName" :key="item.name" :label="item.label" :prop="item.name" min-width="180"
                         align="center" show-overflow-tooltip/>
        <el-table-column fixed="right" label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <div class="action">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom" :open-delay="220">
                <el-tag @click="updateList(scope.row)">编辑</el-tag>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom" :open-delay="220">
                <el-popover placement="right" width="400" trigger="click" :ref="`popover-${scope.$index}`">
                  <p>确定删除这个文档： <b style="color: red">{{ scope.row.name }}</b> 的信息吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消
                    </el-button>
                    <el-button type="primary" size="mini" @click="deleteItem(scope.row)">确定</el-button>
                  </div>
                  <el-tag slot="reference" type="danger">删除</el-tag>
                </el-popover>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="预览" placement="bottom" :open-delay="220">
                <el-tag type="warning" @click="LookDetail(scope.row)">预览</el-tag>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="margin-top:15px;">
        <el-pagination v-show="total!==0" align="center" :current-page="pageNo" :page-sizes="[10,15,20]"
                       :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"/>
      </div>
    </el-card>
    <EditDialog/>
    <deleteDialog/>
  </div>
</template>

<script>
import EditDialog from './editDeviceWordDialog'
import deleteDialog from './deleteDialog'
import JSZip from 'jszip'
import {saveAs} from 'file-saver'
export default {
  name: 'OverviewSix',
  components: {
    EditDialog,
    deleteDialog
  },
  data() {
    return {
      loading: false,
      pageSize: 10,
      total: 1,
      pageNo: 1,
      delayTime: 200,
      pageShow: true,
      chooseIds: [], // 选择批量删除的 数组
      chooseZips:[], //选择要下载的zip
      isDelete: true, //批量删除按钮 初始时 禁止
      tableHeight: document.body.clientHeight - 84 - 36 - 50 - 270, // 表格高度
      tableData: [],
      fileTemp: null,
      wordname: '', //文档名字查询
      maintain: {
        name: '',
        foreignId: 1,
        catalog: '', //设备分类--》》 1:设备 2:备品备件 3:其他
        documentType: ''
      },
      //外部文件类型筛选
      optionList: [{
        code: '',
        name: '全部'
      }],
      wordTypedata: [],
      catalogList: [{
        label: '全部',
        value: ''
      }, {
        label: '是',
        value: 1
      }, {
        label: '否',
        value: 3
      }],
      listName: [{
        label: '文档类型',
        name: 'documentTypeString'
      },
        {
          label: '附件编号',
          name: 'annex'
        },
        {
          label: '设备名称',
          name: 'devicename'
        },
        {
          label: '上传创建时间',
          name: 'createTime'
        },
        {
          label: '上传用户',
          name: 'uploadUser'
        }
      ]
    }
  },
  created() {
    this.getData()
    this.getDocumentType()
  },
  mounted() {
    this.$bus.$on('wordReload', e => {
      if (e === true) {
        this.getData()
      }
    })
  },
  beforeDestroyed() {
    this.$bus.off('editInfo6')
    this.$bus.off('add6')
    //this.$bus.off('deleteword')
    this.$bus.off('wordReload')
  },
  methods: {
    //文档名称查询
    maintain_show(event) {
      //console.log(event)
      this.wordname = event
    },
    //文档类型选择
    wordType_show(event) {
      //	console.log(event)
      //console.log(localStorage.getItem('username'),localStorage.getItem('userId'))
      this.maintain.documentType = event
    },
    //文档分类
    catalog_show(event) {
      //	console.log(event)
      this.maintain.catalog = event
    },
    getRowKeys(row) {
      return row.index
    },
    //查询按钮
    onSubmit(item) {
      console.log('查询-》》》', item)
      this.getData()
    },
    // 编辑 -  实现
    updateList(item) {
      item.optionList = this.wordTypedata
      this.$bus.emit('editInfo6', item)
    },
    //以zip形式批量导出
    downLoadZip(){
      this.$confirm('确定将所选文件进行下载吗?').then(()=>{
        let zip =new JSZip()
        zip.file('remark说明.txt',`下载时间:${this.formatDate(new Date())}`)
        for (let i =0;i<this.chooseZips.length;i++){
          zip.file(this.chooseZips[i].fileName,this.documentEAMUrl('upload')+this.chooseZips[i].filePath)
        }
        zip.generateAsync({type:'blob'}).then(function(content){
          saveAs(content,'deviceWord.zip')
        })
        this.$refs.deviceWordTable.clearSelection()
      },rej=>{
        console.log(rej)
      })
    },
    // 批量删除 实现
    deleteList() {
      this.$confirm('确定删除这些文档吗？').then(() => {
        this.deleteItems()
      })
    },
    //选项时变化获取
    selectionchange(data) {
      this.chooseIds = [] //重置
      this.chooseZips = []
      this.isDelete = data.length === 0;
       //console.log(data)
      for (let key of data) {
        this.chooseIds.push(key.id)
        this.chooseZips.push(key.attach)
      }
      //console.log(this.chooseIds)
    },
    //批量删除实际操作
    deleteItems() {
      let ids = {
        ids: this.chooseIds
      }
      this.$axios.post('/d/deviceDocument/delete', ids).then(res => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '成功删除'
          })
          setTimeout(() => {
            this.$refs.deviceWordTable.clearSelection()
            this.pageNo = 1
            this.pageSize = 10
            this.getData()
          }, 300)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log('文档删除报错', err)
      })
    },
    // 上传新增
    addOverviewSix() {
      let item = {
        ps: true,
        documentType: this.wordTypedata
      }
      this.$bus.emit('add6', item)
      this.$message({
        message: '亲，上传文件大小不能大于100M哦',
        showClose: true,
        type: 'success',
        duration: 50000,
        center: true,
        customClass: 'messageshow'
      })
    },
    // axios 获取数据
    getData() {
      // 获得传来的 foreignId
      //let id = JSON.parse(sessionStorage.getItem('deviceStatus'))
      // 此时默认的 catalog 为  1 位设备  2：备品备件  maintain
      // let params = {
      //   foreignId: 1,
      //   catalog: 1
      // }
      let params = {
        catalog: this.maintain.catalog, //1 or 0
        name: this.wordname,
        documentType: this.maintain.documentType,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      this.$axios.post('/d/deviceDocument/query', params).then(res => {
        console.log('文档信息', res.data.data)
        this.total = res.data.data.totalElements //列表总数
        this.pageSize = res.data.data.size
        this.pageNo = res.data.data.number + 1
        const FileData = res.data.data.content
        this.tableData = []
        this.loading = true
        let i = 0
        setTimeout(() => {
          for (let key of FileData) {
            i++
            //console.log(key)
            key.index = this.pageNo * this.pageSize - this.pageSize + i
            // key.createTime = this.formatDate(key.createTime)
            // key.updateTime = this.formatDate(key.updateTime)
            key.uploadUser = key.createUserName
            key.annex = key.documentCode
            key.documentTypeString = this.typeChange(key.documentType, this.optionList)
            key.devicename = key.device !== undefined ? key.device.deviceName : '没有绑定设备'
            this.tableData.push(key)
          }
          this.loading = false //要执行的事件
        }, 500)

        //this.tableData = dataArray
        console.log('获取到的信息', this.tableData)
      }, err => {
        console.log(err)
      })
    },
    //文档类型
    getDocumentType() {
      let parm = {
        parentCode: 'documentType'
      }
      this.getStateInfo(parm).then(res => {
        if (res.data.code === 0) {
          console.log('文档类型', res.data.data)
          for (let key of res.data.data) {
            this.optionList.push({
              name: key.name,
              code: key.code
            })
          }
          this.wordTypedata = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log('报错err', err)
      })
    },
    //删除 按钮
    deleteItem(row) {
      console.log(row)
      let ids = {
        ids: [row.id]
      }
      this.$axios.post('/d/deviceDocument/delete', ids).then(res => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '成功删除'
          })
          setTimeout(() => {
            this.pageNo = this.deleteLastPageData(this.total,this.pageSize,this.pageNo)
            this.getData()
            this.$refs.deviceWordTable.clearSelection()
          }, 200)
        }
      }).catch(err => {
        console.log('文档删除报错', err)
      })
    },
    //预览详情
    LookDetail(row) {
      console.log('预览信息', row)
      let url = this.documentEAMUrl('upload') + row.attach.filePath
      window.open(this.documentEAMUrl('preview') + encodeURIComponent(url))
    },
    //文档类型判断转换 K=1 number->文字  k=2 文字->number
    typeChange(val, tree) {
      if (val) {
        let found = tree.find(e => e.code === val)
        if (found) {
          return found.name
        } else {
          return 'error find'
        }
      } else {
        return 'error'
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.currentPage = 1
      this.pageNo = 1
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNo = val
      this.currentPage = val
      this.getData()
    }
  }
}
</script>
<style>
.deviceWord {
  padding: 10px;
}

.messageshow {
  z-index: 9999 !important;
}
</style>
