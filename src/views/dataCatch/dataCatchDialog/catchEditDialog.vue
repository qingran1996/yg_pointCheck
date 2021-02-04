<template>
  <div class="editDialog">
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="数据采集编辑" :visible.sync="editDialogVisible" width="30%" center>
      <el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm">
        <el-form-item label="设备" prop="device">
          <el-input v-model="infoData.device" />
        </el-form-item>
        <el-form-item label="采集点名称" prop="place">
          <el-input v-model="infoData.place" />
        </el-form-item>
        <el-form-item label="采集点类型" prop="type">
          <el-select v-model="infoData.type" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="传感器编号" prop="sensorCode">
          <el-input v-model="infoData.sensorCode" />
        </el-form-item>
        <el-form-item label="低预警值" prop="lowWarning">
          <el-input v-model="infoData.lowWarning" />
        </el-form-item>
        <el-form-item label="低低预警值" prop="lowerWarning">
          <el-input v-model="infoData.lowerWarning" />
        </el-form-item>
        <el-form-item label="高预警值" prop="highWarning">
          <el-input v-model="infoData.highWarning" />
        </el-form-item>
        <el-form-item label="高高预警值" prop="higherWarning">
          <el-input v-model="infoData.higherWarning" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="footerClass">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="updateInfo">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editDialogVisible: false,
      infoData: {
        device:'',
        place:'',
        sensorCode: '',
        type:'',
        lowWarning:'',
        lowerWarning:'',
        highWarning:'',
        higherWarning:''
      },
      options: [{
        value: '选项1',
        label: '温度'
         },
        {
          value: '选项2',
          label: '压力'
        },
        {
          value: '选项3',
          label: '湿度'
        },
        {
          value: '选项4',
          label: '液位'
        }
      ]
    }
  },
  watch: {
    // 当dialog关闭，对表单内容的清空
    editDialogVisible(val) {
      if (val === false) {
        this.infoData.place = ''
        this.infoData.device = ''
        this.infoData.type = ''
        this.infoData.sensorCode = ''
        this.infoData.lowWarning = ''
        this.infoData.lowerWarning = ''
        this.infoData.highWarning = ''
        this.infoData.higherWarning = ''
      }
    }
  },
  created() {
    // 编辑bus传值&跳转实现
    this.$bus.$on('edit', (e) => {
      this.infoData.device = e.device
      this.infoData.place = e.place
      this.infoData.type = e.type
      this.infoData.sensorCode = e.sensorCode
      this.editDialogVisible = true
    })
    //新增跳转
    this.$bus.$on('add',(e)=>{
      this.editDialogVisible = e
    })
  },
  methods: {
    close(){
      this.editDialogVisible = false
    },
    updateInfo() {
      setTimeout(() => {
        this.close()
        this.$message({
          message: '成功修改',
          type: 'success'
        })
      }, 100)
    },

  }
}
</script>

<style scoped>
.el-form-item {
  margin: 10px 0;
}
/* .ruleform>>>.el-form-item__content {
  display: inline-block;
  margin-bottom: 8px;
  margin-left: 10px;
}

.ruleform>>>.el-input__inner {
  width: 200px;
  margin-left: 30px;
}

.ruleform>>>.el-card__body {
  width: 400px;
}

el-form-item>>>.el-radio__inner {
  line-height: 36px;
}

el-form-item>>>.el-radio__label {
  line-height: 36px;
}

.m-upload {}

.ruleform>>>.el-upload-list__item-name {
  margin-left: 30px;
  margin-top: -40px;
  width: 100px;
}

.ruleform>>>.el-upload-list {
  margin-left: 18%;
} */
</style>
