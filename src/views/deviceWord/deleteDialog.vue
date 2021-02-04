<template>
  <div class="deleteDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="wordtitle" :visible.sync="deleteDialogVisible"
               width="30%" center :key="editRender" destroy-on-close>
      <el-form v-model="msg" label-width="130px" class="demo-ruleForm" ref="deletform">
        <el-form-item label="文档名称" prop="name">
          <el-select v-model="msg.name" multiple class="deselect" clearable>
            <el-option v-for="item in tabData" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文档类型" prop="documentType">
          <el-input v-model="msg.documentType" disabled/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="footerClass">
        <el-button @click="close">取消</el-button>
        <el-popover style="margin-left: 10px;"
                    placement="right"
                    width="180"
                    trigger="click">
            <p style="font-size: 14px;display: flex;justify-content:center;color: red">是否确定这些文档删除？</p>
            <el-button type="primary" size="mini" @click="deleteItem" plain>确定</el-button>
            <el-button type="danger" slot="reference" effect="plain">删除</el-button>
        </el-popover>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wordtitle: '文档删除',
      deleteDialogVisible: false,
      editRender: 0,
      msg: {
        name: '',
        documentType: 0,
        id: []
      },
      chooseId: [],
      tabData: null
    }
  },
  created() {
    // this.$bus.on('deleteword', (e) => {
    //   this.deleteDialogVisible = true
    //   this.msg.name=''
    //   this.msg.documentType=null
    //   this.tabData = e
    //   //console.log(this.tabData)
    // })
  },
  watch: {
    deleteDialogVisible(val) {

    },
    'msg.name': {
      handler: function(val) {
        //console.log('val',val)
        this.msg.documentType = ''
        this.chooseId = []
        for (let i = 0; i < val.length; i++) {
          for (let key of this.tabData) {
            if (val[i] === key.id) {
              this.msg.documentType = key.documentType + ' , ' + this.msg.documentType
              this.chooseId.push(key.id)
            }
          }
        }
      }
    }
  },
  methods: {
    close() {
      this.deleteDialogVisible = false
    },
    deleteItem() {
      let idArry=this.chooseId
      //console.log(idArry)
      if (!idArry.length){
        this.close()
        return this.$message.error('未选择删除的文档!')
      }
      let ids = {
        ids: idArry
      }
      this.$axios.post('/d/deviceDocument/delete', ids).then(res => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '成功删除'
          })
          setTimeout(() => {
            this.$bus.emit('wordReload',true)
          })
        }
      }).catch(err => {
        console.log('文档删除报错', err)
      })
    }
    //重新渲染操作
  }
}
</script>

<style scoped>
.deselect{
  width: 100%;
}
.demo-ruleForm >>> .el-icon-arrow-up:before{
  content:  "\e6d9";
}
</style>
