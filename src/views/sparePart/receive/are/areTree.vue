<template>
  <div class="areaTree">
    <el-input v-model="filterText" placeholder="输入查找的工程工具">
      <i slot="suffix" class="el-input__icon el-icon-search" />
    </el-input>
    <el-tree
      ref="tree"
      v-loading="loading"
      :data="data"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgb(0, 15, 70)"
      node-key="id"
      accordion
      :style="{height: treeheight,overflowY: 'scroll'}"
      highlight-current
      :filter-node-method="filterNode"
      :props="defaultProps"
      :default-expanded-keys="[updateTree]"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script>
export default {
  name: 'AreTree',
  data() {
    return {
      filterText: '',
      data: [{
        id: 1,
        label: '工程工具',
        children: [{
          id: 5,
          label: '加固工具'
        }, {
          id: 6,
          label: '吊装工具'
        }, {
          id: 7,
          label: '测量工具'
        }]
      }, {
        id: 2,
        label: '润滑工具'
      }, {
        id: 3,
        label: '安全工具'
      }, {
        id: 4,
        label: '机械零件'
      }],
      loading: false,
      treeheight: document.body.clientHeight - 84 - 36 + 'px',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      updateTree: 0,
      showtext: ''
    }
  },
  methods: {
    loadNode(node, resolve) {
      // console.log(node.level)
    },
    treeMouseOver(e, data) {
      // console.log(data)
      this.showtext = data.label
    },
    handleNodeClick(data) {
      // console.log(123)
      // bus.$emit('carIndexLook', data)
      // console.log(this.$router.history.current.name)
      // if (data.code == 'YGJT') {
      // 	console.log(123)
      // 	this.updateTree = 39051
      // }

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
  background-color: rgba(48,65,82,0.8) !important;
}

.el-tree {
  background-color: rgba(48,65,82,0.8);
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
  background-color: rgba(48,65,82,0.4) !important;
}

.el-tree>>>.el-tree-node__content:hover {
  /* border-radius: 5px; */
  background-color: rgba(48,65,82,0.2) !important;
}

.el-tree>>>.el-tree-node.is-current>.el-tree-node__content {
  background-color: rgba(48,65,82,0.4) !important;
  /* border-radius: 5px; */
  color: lightseagreen;
}

.el-tree>>>.el-tree-node__content:visited {
  background-color: rgb(0, 15, 70) !important;
}
</style>
