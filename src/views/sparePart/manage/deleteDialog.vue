<template>
  <div class="deleteDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="wordtitle" :visible.sync="deleteDialogVisible"
               width="30%" center :key="editRender">
      <el-form v-model="chooseData" label-width="130px" class="demo-ruleForm">
        <el-form-item label="备品备件名称" prop="name">
          <el-select v-model="chooseData.name" class="deselect" multiple clearable>
            <el-option v-for="item in msg" :key="item.id" :value="item.id" :label="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备品备件编号" prop="code">
          <el-input v-model="chooseData.code" disabled/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="footerClass">
        <el-button @click="close">取消</el-button>
         <el-popover style="margin-left: 10px;"
                     placement="right"
                     width="230"
                     trigger="click">
            <p style="font-size: 14px;display: flex;justify-content:center;color: red">是否确定删除这些备品备件？</p>
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
      wordtitle: '备品备件管理删除',
      deleteDialogVisible: false,
      editRender: 0,
      chooseId: [],
      msg: [{
        name: '',
        code: 0,
        id: null
      }],
      chooseData: {
        name: '',
        code: '',
        id: null
      }
    }
  },
  created() {
    this.$bus.on('deleteSpare', (e) => {
      //console.log(e)
      this.deleteDialogVisible = true
      this.msg = []
      this.chooseData.name = ''
      this.chooseData.code = ''
      this.chooseData.id = null
      for (let item of e) {
        let arry = {}
        arry.name = item.name
        arry.id = item.id
        arry.code = item.code
        arry.assetCode = item.assetCode
        this.msg.push(arry)
      }
      //console.log('msg',this.msg)
    })
  },
  watch: {
    deleteDialogVisible(val) {
      if (val === false) {
        this.forceRender()
      }
    },
    'chooseData.name': {
      handler: function(val) {
        //console.log('val',val)
        this.chooseData.code=''
        for (let i=0;i<val.length;i++){
          for (let k of this.msg) {
            if (k.id === val[i]) {
              this.chooseId = []
              this.chooseData.code = k.code+','+this.chooseData.code
              this.chooseId.push(k.id)
              console.log('ids:', this.chooseId)
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
      let ids = {
        ids: this.chooseId
      }
      this.$axios.post('/d/sparePart/delete', ids).then(res => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '成功删除'
          })
          this.$bus.emit('reload',true)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(err => {
        console.log('文档删除报错', err)
      })
    },
    forceRender() {
      this.editRender += 1
    }
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
