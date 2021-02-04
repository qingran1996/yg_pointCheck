<template>
  <div class="setPlanTime">
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="执行时间配置" :visible.sync="diVisible"
               width="30%" append-to-body center :key="renderCount">
      <el-card>
        <div v-for="itemIt in choosePlans" :key="itemIt.id" >
          <div style="display: flex;justify-content: space-evenly;">
            <span><b>保养计划编号</b>:{{itemIt.code}}</span><span><b>保养标题</b>:{{itemIt.serviceLevel}}</span>
          </div>
          <div  style="display: flex;justify-content: center;align-items: center;margin-bottom: 10px;">
            <p style="margin-right: 10px;"><b>执行时间配置</b></p>
            <el-date-picker v-model="itemIt.maintainTime" type="date" placeholder="选择日期"  @blur="changeThing" :picker-options="pOptions"/>
          </div>
        </div>
      </el-card>
      <span slot="footer" class="footerClass">
				<el-button @click="close">关闭</el-button>
				<el-button @click="submit" type="primary" v-prevent-re-click>配置</el-button>
			  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      diVisible: false, //时间配置dialog
      renderCount:0,
      deviceId:null,
      choosePlans:[],
      pOptions:{
        disabledDate(time){
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    }
  },
  created() {
    this.$bus.on('setPlanTime',e=>{
      console.log(e)
      this.diVisible = e.show
      this.deviceId = e.deviceId
      this.choosePlans = []
      this.choosePlans = e.info
    })
  },
  methods:{
    close(){
      this.diVisible = false
    },
    renderAgain(){
      this.renderCount += 1
    },
    changeThing(){
      this.renderAgain() //事实渲染
    },
    submit(){
      this.axiosSetService().then(res=>{
        if (res.length === 4){
          this.$message.success(res)
        }else if (res.includes('全部') === true){
          this.$message.error(res)
        }else {
          this.$message.warning(res)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    async axiosSetService() {
      let strMessage='这些' // 返回的信息
      let sount=this.choosePlans.length
      try {
        for (let i =0;i<this.choosePlans.length;i++){
          let setPar={
            deviceId:this.deviceId,
            maintainPlanId: this.choosePlans[i].id, //计划id
            maintainTime: this.formatDate(new Date(this.choosePlans[i].maintainTime).getTime()).split(' ')[0],
            assigner: localStorage.getItem('username') || sessionStorage.getItem('username') //这个用户的账户名，而非真是姓名
          }
          let res = await this.$axios.post('/d/maintainDeviceLink/add',setPar)
          //console.log(res)
          if (res.data.code !== 0){
            strMessage = strMessage + this.choosePlans[i].code+' '
            sount--
          }
        }
        if (sount === this.choosePlans.length){
          return '配置成功'
        }else if (sount < this.choosePlans.length && sount>0){
          strMessage = strMessage + '保养计划已绑定,未绑定的已经配置完成'
          return strMessage
        }else if (sount ===0){
          strMessage = strMessage +'全部已绑定'
          return strMessage
        }
        //判断是否全部配置
      } catch (err){
        console.log(err)
      } finally {
        this.$bus.emit('setFinished','renderAgain')
        this.close()
      }
    }
  },
  destroyed() {

  }
}
</script>

<style scoped>
.setPlanTime {

}
</style>
