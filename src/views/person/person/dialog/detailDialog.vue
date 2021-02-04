<template>
  <div class="personDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :destroy-on-close="true" @close="closedialog('ruleForm')"
               :title="wordtitle" :visible.sync="editDialogVisible" width="30%" center :key="renderKey">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="ruleForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="ruleForm.sex" disabled>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="人员编号" prop="code">
          <el-input v-model="ruleForm.code" disabled></el-input>
        </el-form-item>
        <el-form-item label="用工状态" prop="state">
          <el-select v-model="ruleForm.state" disabled>
            <el-option v-for="item in personStatusList" :key="item.id" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="人员类型" prop="userTypeCode">
          <el-select v-model="ruleForm.userTypeCode" disabled>
            <el-option v-for="item in personTypeList" :key="item.id" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ruleForm.phone" disabled></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="idcard">
          <el-input v-model="ruleForm.idcard" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" disabled></el-input>
        </el-form-item>
        <el-form-item label="单位组织" prop="orgCode">
          <el-popover style="margin-left: 10px;"
                      placement="right"
                      width="300"
                      trigger="click" :value="IsShowpop" v-show="IsShowpop">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="单位组织:">
                <el-input v-model="deptInline1" clearable></el-input>
                <el-tree v-show="isShow" :highlight-current=true :default-expand-all=false
                         :style="{maxHeight: popheight,overflowY: 'scroll'}"
                         :expand-on-click-node="true" :data="organization" :filter-node-method="filterNode"
                         @node-click="selectClassfy" class="width-220 selectTree-input objectTree"
                         ref="OrgTree"></el-tree>
              </el-form-item>
            </el-form>
            <el-tag slot="reference" effect="plain">组织单位添加</el-tag>
          </el-popover>
          <el-input v-show="!isShow" v-model="deptInline" disabled></el-input>
        </el-form-item>
        <el-form-item label="工号" prop="jobNumber">
          <el-input v-model="ruleForm.jobNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人" prop="emergencyContactName">
          <el-input v-model="ruleForm.emergencyContactName" disabled></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人电话" prop="emergencyContactPhone">
          <el-input v-model="ruleForm.emergencyContactPhone" disabled></el-input>
        </el-form-item>
<!--        <el-form-item label="人员图片" prop="personFaces">-->
<!--          <el-image v-for="item in srcs" :src="item" :key="item" style="width: 100px;height: 100px;margin-left: 10px;" @click="lookpic(item)">-->
<!--            <div slot="error" class="image-slot">-->
<!--              (未上传图片)-->
<!--            </div>-->
<!--          </el-image>-->
<!--        </el-form-item>-->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea" resize="none" :show-word-limit="true" :maxlength="200"
                    :rows="4" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="footerClass">
				<el-button type="primary" @click="editDialogVisible = false">确认</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wordtitle: '人员编辑',
      editDialogVisible: false,
      actionurl: 'http://192.168.10.152:10005/u/attach/upload',
      Picurl: this.documentEAMUrl('upload'),
      detailUrl: this.documentEAMUrl('preview'),
      Thisauth: {
        'Authorization': `Bearer ${localStorage.getItem('eleToken')}`
      }, //给请求头部添加 权限
      IsShowpop: true,
      isShow: true,
      deptInline: '',
      deptInputInline: '',
      deptInline1: '',
      popheight: document.body.clientHeight * 0.3 + 'px',
      orgTree: [],
      srcs: null, //图片遍历展示
      ruleForm: {
        name: '', //姓名*
        sex: '', //性别
        code: '', //编号 *
        state: '', //用工状态 *
        userTypeCode: '', //人员类型 *
        phone: null,   // 重复格式检查
        idcard: null, //身份证 重复格式检查
        email: null, // 重复格式检查
        orgCode: '',//组织编码
        jobNumber: null,//工号16位
        remark: '',//备注  255
        emergencyContactName: null,//紧急联系人[长度32]
        emergencyContactPhone: null,//紧急联系人电话[长度16]
        personFaces: null //人员图片[数组]
      },
      fileList: [],
      organization: [], //单位组织
      requestOrgCount: 0, //请求组织机构数据限制请求1次
      personTypeList: [],
      personStatusList: [],
      renderKey: 0
    }
  },
  watch: {
    deptInline(val) {
      this.deptInline1 = ''
      if (val === '') {
        this.isShow = true
        this.IsShowpop = true
        this.ruleForm.orgCode = ''
      }
    },
    deptInline1(val) {
      this.$refs.OrgTree.filter(val)
    }
  },
  methods: {
    //根据code查询
    getdata(item) {
      let obj1 = {
        code: item.code
      }
      this.$axios.post('/p/person/get', obj1).then(res => {
        if (res.data.code === 0) {
          //console.log(res.data.data.personFace)
          this.ruleForm = res.data.data
          this.ruleForm.orgCode = item.organization.code
          console.log(this.ruleForm)
          this.srcs = []
          for (let i = 0; i < res.data.data.personFace.length; i++) {
            this.srcs.push(this.Picurl + res.data.data.personFace[i])
          }
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //获取单位组织
    getOrganization() {
      this.organization = []
      let jsonData = {
        orgCode: '0'
      }
      this.deptData(jsonData).then(res => {
        if (res.data.code === 0) {
          // console.log(res.data.data)
          //this.updateTree.push(res.data.data.id)
          this.organization.push(res.data.data)
        } else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
        }
      })
    },
    //关闭dialog时清除显示数据
    closedialog(formName) {
      this.deptInline1 = null
      this.deptInline = null
      this.renderDialog()
      this.$refs[formName].resetFields()
    },
    //选择器树节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    selectClassfy(data) {
      console.log('tree', data)
      this.deptInline1 = data.label
      this.deptInline = this.deptInline1
      this.ruleForm.orgCode = data.code
      this.isShow = false
      this.IsShowpop = false
    },
    renderDialog() {
      this.renderKey += 1
    },
    lookpic(row){
      window.open(this.detailUrl + encodeURIComponent(row))
    }
  },
  created() {
    this.$bus.$on('lookperson', e => {
      this.editDialogVisible = true
      this.deptInline = e.organization.name
      this.isShow = false
      this.IsShowpop = false
      this.getdata(e)
      if (this.requestOrgCount === 0) {
        this.getOrganization()
        this.personTypeList = e.personTypeList
        this.personStatusList = e.personStatusList
        this.requestOrgCount++
      }
    })
  }
}
</script>
<style scoped>
.demo-ruleForm >>> .el-input__inner {
  width: 100%;
}

.demo-ruleForm >>> .el-form-item__error {
  margin-left: 20px;
}

.demo-ruleForm >>> .el-form-item__label {
  width: 110px !important;
  margin-left: -10px;
}

.demo-ruleForm >>> .el-radio-group {
  margin-left: 20px;
}
</style>
