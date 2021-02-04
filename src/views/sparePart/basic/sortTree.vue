<template>
  <div class="sortTree">
    <el-input v-model="filterText" placeholder="请输入备品备件分类">
      <i slot="suffix" class="el-input__icon el-icon-search"/>
    </el-input>
    <div class="iclass" @click="fatherAdd" @contextmenu.prevent="fatherAdd">
      <i class="el-icon-plus">新增</i>
    </div>
    <el-tree ref="tree" v-loading="loading" :data="data" element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgb(0, 15, 70)" node-key="id" accordion
             :style="{height: treeheight,overflowY: 'scroll'}"
             highlight-current :filter-node-method="filterNode" :props="defaultProps"
             :default-expanded-keys="updateTree"
             :expand-on-click-node="false" @node-click="handleNodeClick" draggable @node-drag-strat="handleDragStart"
             @node-drag-end="handleDragEnd" @node-contextmenu="rightClick">
    </el-tree>
    <div class="menuRight" ref="menu" v-show="menuShow">
      <el-card class="box-card">
        <div class="cardContent">
          <span style="margin: 0 12px;color: white;">{{ contentTip }} </span>
          <el-tooltip class="item" effect="dark" content="添加分类" placement="bottom">
            <el-button type="primary" icon="el-icon-circle-plus" circle @click="showCardTwo(title1)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="修改分类" placement="bottom">
            <el-button type="success" icon="el-icon-edit" circle
                       @click="showCardTwo({title:title2,content:content})"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除这个分类" placement="bottom">
            <el-button type="danger" icon="el-icon-delete" circle @click="typeDeleteAgin(content)"></el-button>
          </el-tooltip>
        </div>
      </el-card>
    </div>
    <div class="menuTwo" ref="menuTwo" v-show="menuTwo">
      <el-card>
        <div slot="header" class="clearfix">
          <span  style="color: white;">{{ typeTitle }} : {{ contentTip }}</span>
        </div>
        <el-form ref="typeForm" :model="typeForm" class="demo-ruleForm" size="small" :rules="rules">
          <div class="formInput">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="typeForm.name" clearable/>
            </el-form-item>
            <el-form-item label="分类编码" prop="code">
              <el-input v-model="typeForm.code" clearable/>
            </el-form-item>
          </div>
<!--          <el-form-item label="分类类型" prop="catalog">-->
<!--            <el-select v-model="typeForm.catalog" placeholder="类型">-->
<!--              <el-option v-for="item in optionlist" :key="item.value" :label="item.label"-->
<!--                         :value="item.value"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <div v-show="addChoose" >
            <el-form-item label="新增选择" prop="radioChoose">
              <el-radio-group v-model="typeForm.radioChoose" size="mini" >
                <el-radio label="1">添加子类</el-radio>
                <el-radio label="2">添加同类</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
<!--          <div class="formInput">-->
<!--            <el-form-item label="备注" prop="remark">-->
<!--              <el-input type="textarea" placeholder="可选择输入备注概述" v-model="typeForm.remark" resize="none"-->
<!--                        :maxlength="textareaMax" :show-word-limit="true" :rows="textrow"></el-input>-->
<!--            </el-form-item>-->
<!--          </div>-->
        </el-form>
        <div class="clearfix">
          <el-button @click="closeTwo" type="info">取消</el-button>
          <el-button @click="submitMsg(typeForm)" type="primary" v-prevent-re-click>确定</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      filterText: '', // 查询区域名称
      son: '',
      father: '',
      fatherId: 0,
      showtext: '2333',
      visible: false,
      title1: '分类添加',
      title2: '修改分类',
      title3: '主分类新增', //父类新增
      textareaMax: 150,
      textrow: 4,
      isHaveChild:null, //删除时判定是否有子类 的值
      addChoose:false, //新增时 判定是添加子类还是添加同级类
      treeheight: document.body.clientHeight - 84 - 36 - 18 + 'px',
      menuShow: false,
      menuTwo: false,
      cardValue: '',
      contentTip: '', //右击显示的分类
      content: null, //删除分类
      childAdd:null, //针对子类添加 --->content 的修改
      subAddd:null, //针对同级添加 --> content 的修改
      isChildCandelete:'', //判断子节点是否有设备
      confirmTitle:'',
      typeForm: {
        code: '',
        name: '',
        pid: -1, //选择节点的父类id
        orderNo: 0, //排序
        catalog: null, //分类类型
        remark: '',
        id: 0 ,//这个节点id
        radioChoose:'1' //选择radio
      },
      typeTitle: '', //新增,更新,标题
      optionlist: [{
        label: '设备',
        value: 1
      }, {
        label: '备品备件',
        value: 2
      }], //el-option 类型
      data: [],
      jsonData: {
        id: 0,
        catalog: 2
      },
      updateTree: [],
      loading: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rules: {
        name: [{
          required: true,
          message: '请输入分类名',
          trigger: ['blur','change']
        }],
        code: [{
          required: true,
          message: '请输入分类编码',
          trigger: ['blur','change']
        }]
      }
    }
  },
  computed: {
    getsort() {
      return this.$store.getters.deviceStatus
    },
    treeNum() {
      return this.updateTree
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
    },
    menuTwo(val) {
      if (val === false) {
        this.$refs.typeForm.resetFields()
      }
    }
  },
  activated() {

  },
  created() {
    this.getdata()
    document.addEventListener('click', ev => {
      if (!this.$refs.menu) {
        this.menuShow = !this.menuShow
      } else {
        this.menuShow = false //让菜单隐藏
      }
    })
  },
  methods: {
    getdata() {//查询设备树
      this.updateTree = []
      this.data = []
      this.getDeviceTypeQueryTree(this.jsonData).then(res => {
        if (res.data.code === 0) {
          console.log('树信息', res.data.data)
          const data = res.data.data
          if (this.content){
            this.updateTree.push(this.content.pid===0?this.content.id:this.content.pid)
          }else {
            this.updateTree.push(data[0].id)
          }
          for (let i = 0; i < data.length; i++) {
            this.data.push(res.data.data[i])
          }
        } else {
          this.$message({
            message: res.data.message,
            type: 'warning'
          })
        }
        // console.log(res.data.data)
      })
    },
    //显示新增，修改card   1:title-add  2:object-update
    showCardTwo(title) {
      this.$refs.typeForm.resetFields()
      this.typeTitle = ''
      this.menuTwo = true
      this.addChoose =false
      //console.log('标题',title)
      if (title instanceof Object) {
        this.typeTitle = title.title
        this.typeForm.name = title.content.label
        this.typeForm.code = title.content.code
        this.typeForm.catalog = title.content.Type
      } else {
        this.addChoose =true //新增选择
        this.isChildOrsub()
        this.typeTitle = title
        this.typeForm.catalog = null
      }
    },
    // 关闭 更新,新增card
    closeTwo() {
      this.menuTwo = false
    },
    //提交按钮判定--- 新增/更改
    // title1: '同级分类添加',title2: '修改分类', title3: '主分类新增'
    submitMsg(form) {
       //console.log('确定按钮', form)
      this.$refs.typeForm.validate((valid) => {
        if (valid) {
          if (this.typeTitle === this.title1 && this.typeForm.radioChoose === '2') {  //右击-》添加-》同级
            form.id = this.subAddd.id
            form.pid = this.subAddd.pid  //父节点的赋值
            this.typeAdd(form)
          } else if (this.typeTitle === this.title1 && this.typeForm.radioChoose === '1') {  //右击-》添加-》子类
            //form.id = this.content.id
            form.pid = this.childAdd.pid  //父节点的赋值
            this.typeAdd(form)
          } else if (this.typeTitle === this.title2) { ////右击-》修改-》
            form.id = this.content.id  //新增时要添加这个节点的id
            form.pid = this.content.pid  //父节点的赋值判断
            this.typeUpdate(form)
          } else if (this.typeTitle === this.title3) { //顶部的 +新增
            //form.id = this.content.id
            form.pid = 0  //主父类添加 pid=0
            this.typeAdd(form)
          }
        }
      })
    },
    //分类新增
    typeAdd(item) {
      console.log('add', item)
      let addparams = {
        code: item.code, //编码
        name: item.name, //名称
        pid: item.pid, //上级id
        orderNo: 0, //排序号 [默认0]
        catalog: 2, //分类类型 1, 2
        remark: item.remark //--备注--
      }
      this.$axios.post('/d/deviceType/add', addparams).then(res => {
        if (res.data.code === 0) {
          this.$message.success('成功添加这个分类')
          setTimeout(() => {
            this.closeTwo()
            this.getdata()
          }, 130)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log('新增出错:', err)
      })
    },
    //分类更新
    typeUpdate(item) {
      //console.log(item)
      let upparam = {
        id: item.id,
        code: item.code,
        name: item.name,
        pid: item.pid,
        orderNo: 0,
        catalog: 2, //备品备件
        remark: item.remark //备注
      }
      this.$axios.post('/d/deviceType/update', upparam).then(res => {
        if (res.data.code === 0) {
          this.$message.success('修改成功')
          this.closeTwo()
          this.getdata()
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log('分类更新出错', err)
      })
    },
    //顶部 +新增
    fatherAdd(event) {
      this.$refs.typeForm.resetFields()
      this.$refs.menuTwo.style.left = event.clientX - 200 + 'px'
      this.$refs.menuTwo.style.top = event.clientY - 76 + 'px'
      this.menuTwo = true
      this.typeTitle = this.title3
      this.contentTip = '新增主节点'
    },
    //删除操作再次决定
    typeDeleteAgin(content) {
      //console.log(content)
      this.confirmTitle ='这个分类拥有子节点,无法删除,请将其下所有子节点全部删除后，再删除这个分类！'
      this.deleteChild()
      return this.$confirm(`确定删除--${content.label} 分类吗？`).then(() => {
        if (this.isHaveChild ===true || !this.isChildCandelete ){
          if (this.isChildCandelete === false){this.confirmTitle ='这个分类下有设备信息，无法删除，请将其下设备移动到其他分类，再删除这分类！'}
          this.$confirm(this.confirmTitle,'警告',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(()=>{
            this.menuTwo =false
          })
        }else if(this.isHaveChild ===false){
          this.typeDelete(content.id)
        }
      }).catch(err => {
        this.$message('取消删除')
        console.log(err)
      })
    },
    //子节点下如果有设备则不可以删除的判断
    deleteChild(){
      let pa={
        deviceTypeId:this.content.id,
        pageNo: 1,
        pageSize: 10
      }
      this.getDeviceQuery(pa).then(res=>{
        if (res.data.code ===0){
          //console.log(res.data.data.content)
          this.isChildCandelete = res.data.data.content.length <= 0;
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    //分类删除
    typeDelete(Tid) {
      let deletparams = {
        id: Tid
      }
      this.$axios.post('/d/deviceType/delete', deletparams).then(res => {
        if (res.data.code === 0) {
          this.$message.success('成功删除该分类')
          this.closeTwo()
          this.getdata()
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log('分类删除出错', err)
      })
    },
    //对于是添加子类 还是添加同级类的选择判定
    isChildOrsub(){
      this.childAdd =null
      this.subAddd =null
        this.childAdd ={
          Type: this.content.Type,
          code: this.content.code,
          label: this.content.label,
          pid:this.content.id
        }
        //console.log('选择了 添加 子',this.childAdd)
        this.subAddd =this.content
        //console.log('选择添加 同级',this.subAddd)

    },
    loadNode(node, resolve) {
      console.log(node.level)
    },
    treeMouseOver(e, data) {
      // console.log(data)
      this.showtext = data.label
    },
    //点击事件
    handleNodeClick(data, node, self) {
      console.log('点击鼠标触发', data) //点击触发后，右边界面进行数据显示
      this.menuTwo = false
      this.menuShow = false
      this.$bus.emit('clickPort1', data)
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
    //拖拽开始
    handleDragStart(node, event) {
      console.log(node.data)
      this.son = node.data.code
    },
    //拖拽结束
    handleDragEnd(draggingNode, dropNode, dropType, event) {
      this.father = dropNode.data.code
      this.fatherId = dropNode.data.id
    },
    //鼠标右击事件  4参数: 事件,该节点数据(重要),节点node,组件本身
    rightClick(event, data, node, self) {
      console.log('啊，被右击了', data) //引用弹出框
      //console.log('啊，被右击了2', node.parent.data) //引用弹出框
      //console.log('啊，被右击了', node)
      if (event.clientY <= document.body.clientHeight * 0.65) {
        this.$refs.menu.style.left = event.clientX - 160 + 'px'
        this.$refs.menu.style.top = event.clientY - 56 + 'px'
        this.$refs.menuTwo.style.left = event.clientX - 160 + 'px'
        this.$refs.menuTwo.style.top = event.clientY - 56 + 'px'
      } else {
        this.$refs.menu.style.left = event.clientX - 160 + 'px'
        this.$refs.menu.style.top = event.clientY - 286 + 'px'
        this.$refs.menuTwo.style.left = event.clientX - 160 + 'px'
        this.$refs.menuTwo.style.top = event.clientY - 286 + 'px'
      }
      this.menuShow = true //让菜单显示
      this.menuTwo = false
      this.contentTip = data.label
      this.content = data
      this.content.pid = node.parent.data.id
      this.typeForm.catalog = data.Type
      this.isHaveChild = 'children' in data // 判别是否有子节点 ，有不能删，否则可删
      if (typeof (this.content.pid) === 'undefined') {
        this.content.pid = 0
      }
      //console.log('content->包含这个节点的信息',this.content)
      document.removeEventListener('click', this.Listen) //添加监听，监听鼠标事件
    }
  }
}

</script>
<style scoped>
	.el-input>>>.el-input__inner {
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

	.el-tree>>>.el-tree-node__expand-icon.is-leaf {
		color: transparent;
		cursor: default;
	}

	.el-tree>>>.el-tree-node__expand-icon {
		color: #FFFFFF
	}

	.el-tree::-webkit-scrollbar {
		width: 0;
	}

	.el-tree>>>.el-tree-node__content {
		background-color: rgba(48, 65, 82, 0.4) !important;
	}

	.el-tree>>>.el-tree-node__content:hover {
		/* border-radius: 5px; */
		background-color: rgba(48, 65, 82, 0.2) !important;
	}

	.el-tree>>>.el-tree-node.is-current>.el-tree-node__content {
		background-color: rgba(48, 65, 82, 0.4) !important;
		/* border-radius: 5px; */
		color: lightseagreen;
	}

	.el-tree>>>.el-tree-node__content:visited {
		background-color: rgb(0, 15, 70) !important;
	}

	.el-tree>>>.el-tag--info {
		background-color: rgba(48, 65, 82, 0.8);
		border-color: rgba(48, 65, 82, 0.8);
		color: white;
		opacity: 0.2;
	}

	.el-tree>>>.custom-tree-node {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		font-size: 14px;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.menuRight {
		position: absolute;
		border-radius: 45px;
		z-index: 2000;
		box-shadow: rgba(48, 65, 82, 0.8);
	}

	.menuRight>>>.el-card__body {
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
    margin-top: 3px;
    color: #ffe000fc!important;
  }
  .demo-ruleForm>>>.el-radio__label{
    color: white!important;
  }
  .demo-ruleForm>>>.el-radio__input.is-checked+.el-radio__label{
    color: #ffe000fc!important;
  }
  .demo-ruleForm>>>.el-radio__input.is-checked .el-radio__inner{
    background-color: #ffe000fc!important;
    color: #ffe000fc!important;
    border: none;
  }
  .demo-ruleForm>>>.el-radio__inner:hover{
    border-color: #ffe000fc!important;
  }
  .clearfix{
    display: flex;
    justify-content: center;
    margin-bottom: 5px;
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


.iclass {
  background-color: rgba(48, 65, 82, 0.9);
  border-color: rgba(48, 65, 82, 0.8);
  color: white;
  cursor: pointer
}
.formInput {
  width: 230px;
}
</style>
