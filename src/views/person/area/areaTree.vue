<template>
  <div class="areaTree">
    <el-input v-model="filterText" placeholder="请输入单位组织名称">
      <i slot="suffix" class="el-input__icon el-icon-search"/>
    </el-input>
    <el-tree ref="tree" v-loading="loading" :data="data" element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgb(0, 15, 70)" node-key="id" accordion
             :style="{height: treeheight,overflowY: 'scroll'}"
             highlight-current :filter-node-method="filterNode" :props="defaultProps"
             :default-expanded-keys="updateTree"
             :expand-on-click-node="false" @node-click="handleNodeClick" @node-contextmenu="contextmenu">
			<span slot-scope="{ node }" class="custom-tree-node">
				<el-tooltip class="item" effect="dark" :content="node.label" placement="right">
					<span>{{ node.label }}</span>
				</el-tooltip>
			</span>
    </el-tree>
    <div class="menuRight" ref="menu" v-show="menuShow">
      <el-card class="box-card" shadow="never">
        <div class="cardContent">
          <span style="color: white;margin: 0 12px;">{{ contentTip }} </span>
          <el-tooltip class="item" effect="dark" content="新增单位" placement="bottom" >
            <el-button type="primary" icon="el-icon-circle-plus" circle @click="showCardOne()"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="修改单位" placement="bottom" >
            <el-button type="success" icon="el-icon-edit" circle
                       @click="showCardTwo()"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除单位" placement="bottom" v-show="isRoot">
            <el-button type="danger" icon="el-icon-delete" circle @click="typeDeleteAgin()"></el-button>
          </el-tooltip>
<!--          <p v-show="!isOnly"><b style="color: whitesmoke;margin: 10px;padding: 0;">该单位请到相应的模块进行操作!</b></p> 其他三个功能需要加v-show='isOnly'-->
        </div>
      </el-card>
    </div>
    <div class="menuTwo" ref="menuTwo" v-show="menuTwo">
      <el-card>
        <div class="twoHeader">
          <span style="color: white">{{ funDisplay }}:{{ contentTip }}</span>
        </div>
        <div class="twoForm">
          <el-form ref="typeForm" :model="typeForm" class="demo-ruleForm" size="small" :rules="rule1">
            <el-form-item label="名称" prop="name">
              <el-input v-model="typeForm.name" clearable/>
            </el-form-item>
            <el-form-item label="编码" prop="code">
              <el-input v-model="typeForm.code" clearable/>
            </el-form-item>
          </el-form>
        </div>
        <div style="display: flex;justify-content: center;margin-bottom: 5px;">
          <el-button @click="closeTwo" type="info">取消</el-button>
          <el-button @click="submitMsg()" type="primary" v-prevent-re-click>确定</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AreaTree',
  components: {},
  data() {
    return {
      filterText: '', // 查询区域名称
      showtext: '2333',
      reaUnit:"EXTERNAL-UNIT",//相关方单位无法在点击时观看
      treeheight: document.body.clientHeight - 84 - 36 + 'px',
      menuShow: false, //右击1层e-card
      menuTwo: false,  //功能选择
      contentTip: '', //右击显示的分类
      content: '', //右击时的 data
      upContent: null, // 更新时 利用
      addContent: null, // 新增时 利用
      isRoot:true, //isRoot--- 如果是公司，则无删除功能,修改
      //isOnly:true, //针对相关方单位, 到指定位置进行详细更改
      headComp:'永钢集团',
      data: [],
      typeForm: { //表单的 新增and修改功能
        name: '',
        code: '',
        id: '',
        pid: ''
      },
      Tmsg: '', //判断有无人员的信息
      funDisplay: '', //选择后功能展示
      jsonData: {
        orgCode: '0'
      },
      updateTree: [],
      loading: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rule1: {
        name: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        }, {
          max: 32,
          message: '长度不可超过32位',
          trigger: ['change', 'blur']
        }],
        code: [{
          required: true,
          message: '请输入编码',
          trigger: 'blur'
        }, {
          max: 32,
          message: '长度不可超过32位',
          trigger: ['change', 'blur']
        }]
      },
      updateTitle: '修改',  //标题显示
      addTitle: '新增子单位'
    }
  },
  watch: {
    filterText(val) {
      // console.log(val)
      if (val !== '') {
        this.$refs.tree.filter(val)
      } else {
        this.getdata()
      }
    }
  },
  destroyed() {
    this.$bus.off('personIndex')
    this.$bus.off('updateOrgAgain')
  },
  created() {
    // console.log(this.EamRequest)
    //config.log(this.EamRequest)
    this.getdata()
    document.addEventListener('click', ev => {
      if (!this.$refs.menu) {
        this.menuShow = !this.menuShow
      } else {
        this.menuShow = false //让菜单隐藏
      }
    })
    // console.log(this.axiosUse.getDept('/p/org/queryAllTree',this.jsonData))
    // console.log(this.getDeptTree)
  },
  methods: {
    getdata() {
      this.updateTree = []
      this.data = []
      this.deptData(this.jsonData).then(res => {
        if (res.data.code === 0) {
          // console.log(res.data.data)
          this.updateTree.push(res.data.data.id)
          this.headComp =res.data.data.code //主公司名---
          let msg =res.data.data
          //将第三方单位移除(隐藏)
          let found = Array.from(msg.children).find(item=>item.code ===this.reaUnit) //找到这个第三方单位值
          if (found){
            msg.children.splice(msg.children.indexOf(found),1) //找到它在array位置，并将其移除
          }
          this.data.push(msg) //相关方单位已经不在这个树tree中
        } else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
        }
        // console.log(res.data.data)
      })
    },
    loadNode(node, resolve) {
      // console.log(node.level)
    },
    treeMouseOver(e, data) {
      // console.log(data)
      this.showtext = data.label
    },
    handleNodeClick(data,Node,self) {
       //console.log(Node)
      if (data.code !==this.reaUnit&&Node.parent.data.code!==this.reaUnit){
        this.$bus.emit('personIndex', data)
      }
    },
    // 搜索区域
    filterNode(value, data, node) {
      // 如果什么都没填就直接返回
      if (!value) return true
      // 如果传入的value和data中的label相同说明是匹配到了
      if (data.label.indexOf(value) !== -1) {
        return true
      }
      // 否则要去判断它是不是选中节点的子节点
      return this.checkBelongToChooseNode(value, data, node)
    },
    // 判断传入的节点是不是选中节点的子节点
    checkBelongToChooseNode(value, data, node) {
      const level = node.level
      // 如果传入的节点本身就是一级节点就不用校验了
      if (level === 1) {
        return false
      }
      // 先取当前节点的父节点
      let parentData = node.parent
      // 遍历当前节点的父节点
      let index = 0
      while (index < level - 1) {
        // 如果匹配到直接返回
        if (parentData.data.label.indexOf(value) !== -1) {
          return true
        }
        // 否则的话再往上一层做匹配
        parentData = parentData.parent
        index++
      }
      // 没匹配到返回false
      return false
    },
    //右击触发
    contextmenu(event, data, node, self) {
      //console.log('啊，被右击了0',node)
      console.log('啊，被右击了', data)
      if (event.clientY <= document.body.clientHeight * 0.65) {
        this.$refs.menu.style.left = event.clientX - 160 + 'px'
        this.$refs.menu.style.top = event.clientY - 56 + 'px'
        this.$refs.menuTwo.style.left = event.clientX - 160 + 'px'
        this.$refs.menuTwo.style.top = event.clientY - 56 + 'px'
      } else {
        this.$refs.menu.style.left = event.clientX - 160 + 'px'
        this.$refs.menu.style.top = event.clientY - 140 + 'px'
        this.$refs.menuTwo.style.left = event.clientX - 160 + 'px'
        this.$refs.menuTwo.style.top = event.clientY - 140 + 'px'
      }
      this.menuTwo = false
      this.menuShow = true //让菜单显示
      this.isRoot = true
      //this.isOnly = true
      this.contentTip = data.label
      this.content = data  //右击选中的节点
      this.content.pid = node.parent.data.id //获取父节点
      if (data.code === this.headComp){
        this.isRoot = false
        this.content.pid = 0
      }
      // if (data.code ===this.reaUnit || node.parent.data.code ===this.reaUnit){
      //   this.isOnly = false
      // }
    },
    //第一个 新增
    showCardOne() {
      this.menuTwo = true
      this.funDisplay = this.addTitle
      this.addContent = this.content
    },
    //第二个 更改
    showCardTwo() {
      this.menuTwo = true
      this.funDisplay = this.updateTitle
      this.upContent = this.content
      this.typeForm.name = this.upContent.label
      this.typeForm.code = this.upContent.code
    },
    //删除的二次确定
    typeDeleteAgin() {
      this.isPersonIn(this.content.code) // 判断单位下有无人员
      this.$confirm(`确认删除:<b style="color: red;">${this.contentTip}</b>吗？`, {
        dangerouslyUseHTMLString: true
      }).then(() => {
        if ('children' in this.content) {
          if (this.content.children.length > 0) { //删除的判断
            let title = '该单位下有子单位，请将其子单位全部删除后，再删除该单位。'
            this.deleteChoose(title)
          }
        } else if (this.Tmsg === '有人员') {
          let title = '有人员隶属该单位，请将所有人员移到其他单位后，再删除该单位。'
          this.deleteChoose(title)
        } else {
          this.deleteItem(this.content.id)
        }
      })
    },
    //删除的判定(1.有子节点不删 2.与人员绑定单位的不删)
    deleteChoose(titleMsg) {
      return this.$confirm(titleMsg, '警告').then(() => {
        this.menuShow = false
        this.menuTwo = false
      })
    },
    //判断该单位下是否有人员隶属
    isPersonIn(Dcdoe) {
      this.Tmsg = null
      let parm = {
        orgCode: Dcdoe,
        pageNo: 1,
        pageSize: 10
      }
      this.personData(parm).then(res => {
        //console.log(res.data.data.content)
        this.Tmsg = res.data.data.content.length > 0 ? '有人员' : '无人员'
        console.log(this.Tmsg)
      })
    },
    //真正的删除
    deleteItem(Tid) {
      let dparm = {
        id: Tid
      }
      this.$axios.post('/p/org/delete', dparm).then(res => {
        if (res.data.code === 0) {
          this.$message.success('成功删除!')
          this.menuTwo = false
          this.getdata()
          this.$bus.emit('updateOrgAgain',true)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    closeTwo() {
      this.menuTwo = false
      this.$refs.typeForm.resetFields() // 关闭时重置
    },
    //carTwo按钮提交
    submitMsg() {
      console.log('提交表单', this.typeForm)
      this.$refs.typeForm.validate((valid) => {
        if (valid) {
          if (this.funDisplay === this.addTitle) {
            this.typeForm.pid = this.addContent.id
            this.orgAdd(this.typeForm)
            this.closeTwo(this.typeForm)
          } else if (this.funDisplay === this.updateTitle) {
            this.typeForm.id = this.upContent.id
            this.typeForm.pid = this.upContent.pid
            this.orgUpdate(this.typeForm)
          }
        }
      })
    },
    //真正的修改请求
    orgUpdate(item) {
      let upParm = {
        id: item.id,
        code: item.code,
        name: item.name,
        pid: item.pid,
        orderNo: 0,  //排序
        orgType: 1 //类型
      }
      this.$axios.post('/p/org/update', upParm).then(res => {
        if (res.data.code === 0) {
          this.$message.success('成功修改')
          this.closeTwo()
          this.getdata()
          this.$bus.emit('updateOrgAgain',true)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //真正的新增
    orgAdd(item) {
      let addParm = {
        code: item.code,
        name: item.name,
        pid: item.pid,
        orgType: 1,
        orderNo: 0
      }
      this.$axios.post('/p/org/add', addParm).then(res => {
        if (res.data.code === 0) {
          this.$message.success('成功新增')
          this.closeTwo()
          this.getdata()
          this.$bus.emit('updateOrgAgain',true)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style scoped>
.el-input >>> .el-input__inner {
  border: none;
  border-radius: 0;
  color: #ffffff;
  border-bottom: 1px #ffffff solid;
  background-color: rgba(48, 65, 82, 0.8) !important;
}

.el-tree {
  background-color: rgba(48, 65, 82, 0.8);
  color: #FFFFFF;
}

.custom-tree-node {
  width: 100%;
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
}

.el-tree >>> .el-tree-node__expand-icon.is-leaf {
  color: transparent;
  cursor: default;
}

.el-tree >>> .el-tree-node__expand-icon {
  color: #FFFFFF
}

.el-tree::-webkit-scrollbar {
  width: 0;
}

.el-tree >>> .el-tree-node__content {
  background-color: rgba(48, 65, 82, 0.4) !important;
}

.el-tree >>> .el-tree-node__content:hover {
  /* border-radius: 5px; */
  background-color: rgba(48, 65, 82, 0.2) !important;
}

.el-tree >>> .el-tree-node.is-current > .el-tree-node__content {
  background-color: rgba(48, 65, 82, 0.4) !important;
  /* border-radius: 5px; */
  color: lightseagreen;
}

.el-tree >>> .el-tree-node__content:visited {
  background-color: rgb(0, 15, 70) !important;
}

.menuRight {
  position: absolute;
  border-radius: 45px;
  z-index: 2000;
  box-shadow: rgba(48, 65, 82, 0.8);
}

.menuRight >>> .el-card__body {
  padding: 3px;
}
.menuRight >>> .el-card {
  padding: 0 2px;
  background-color: rgba(5,5,5,0.4);
  border: none;
  border-radius: 40px;
}
.demo-ruleForm>>>.el-input__inner{
  background-color: transparent!important;
  border-bottom: 1px whitesmoke solid;
  border-radius: 5px;
  color: white;
}
.demo-ruleForm>>>.el-form-item__label{
  color: white!important;
}
.demo-ruleForm>>>.el-form-item__label::before{
  color: #ffe000fc!important;
}
.demo-ruleForm>>>.el-form-item__error{
  color: #ffe000fc!important;
}
.menuTwo {
  position: absolute;
  border-radius: 45px;
  z-index: 1900;
}
.menuTwo >>> .el-card__body{
  padding: 3px;
}
.menuTwo >>> .el-card{
  padding: 0 2px;
  background-color: rgba(5,5,5,0.45);
  border: none;
  border-radius: 10px;
}
.cardContent{
  width: auto;
  height: auto;
}
</style>
