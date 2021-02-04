<template>
  <div class="changeHead">
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="头像上传" :visible.sync="editDialogVisible"
               width="25%" center :key="editRender">
      <el-upload
        class="avatar-uploader"
        action="http://192.168.10.152:10005/test.com"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :before-remove="handleRemove"
        :http-request="upload"
        :on-exceed="limitUpload"
        :file-list="fileList" :auto-upload="true" :limit="1">
        <img v-if="imageUrl" :src="this.picurl + imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <span slot="footer" class="footerClass">
        <el-button @click="close">关闭</el-button>
				<el-button type="primary" @click="updatePic">修改</el-button>
			</span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editDialogVisible: false,
      editRender: 0,
      imageUrl:'',
      fileList:[],
      picurl:this.documentEAMUrl('upload'),
      source:{
        source:9 ,//头像
        file:null
      }
    }
  },
  mounted() {
    this.$bus.on('changeUserHead', e => {
      this.editDialogVisible = e.show
      this.imageUrl = ''
      this.fileList = []
    })
  },
  methods: {
    close() {
      this.editDialogVisible = false
      this.editRender+=1
    },
    updatePic() {
      let par={
        id:parseInt(localStorage.getItem('userId')),
        attachUrl:this.imageUrl,
        password:null
      }
      this.$axios.post('/u/user/update',par).then(res=>{
        if (res.data.code === 0){
          this.$message.success('成功修改')
          this.close()
          this.$bus.emit('changeHeadPicRender',this.imageUrl)
          localStorage.setItem('attachUrl',this.imageUrl)
        }else {
          this.$message.error(res.data.message)
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    beforeAvatarUpload(file){ //上传的限制
      //console.log(file)
      this.source.file = file
      let style = file.name.split('.')[file.name.split('.').length - 1].toLowerCase()  //获得文件的格式
      const type = ['jpg', 'png', 'bmp', 'PNG', 'JPG', 'BMP','jpeg','JPEG']
      const isType = type.includes(style)
      const isLt10M = file.size / 1024 / 1024 < 10 //图片大小的限制
      if(!isLt10M){
        this.$message.error('上传的头像不得超过10M!')
      }
      if (!isType){
        this.$message.error('上传的头像只能为图片!')
      }
      return isLt10M && isType
    },
    //上传删除的操作
    handleRemove(file, fileList) {
        let found = this.fileList.findIndex(item=>item.url === file.url)
        if (found>-1){
          this.$nextTick(()=>{
            this.fileList.splice(found,1)
          })
        }
    },
    //自定义上传文件的方式
    upload() {
      this.axiosUpload()
    },
    async axiosUpload(){
      let formData = new FormData()
      formData.append('file', this.source.file)
      formData.append('source', this.source.source)
      await this.$axios.post('u/attach/upload', formData).then(res => {
        if (res.data.code === 0) {
         // console.log(res.data.data)
          this.fileList = []
          this.fileList.push({
            name: res.data.data.fileName,
            url: this.picurl + res.data.data.filePath
          })
          this.imageUrl = res.data.data.filePath
        } else {
          this.$message.error('头像上传出错!请退出重新上传')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    limitUpload(){
      this.$message.warning('头像上传一次只能一个(0.0)!')
    }
  },
  destroyed() {
    this.$bus.off('changeUserHead')
  }
}
</script>

<style scoped>
.changeHead {

}
.avatar-uploader{
  display: flex;
  justify-content: center;
  align-items: center;
}
.changeHead >>> .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.changeHead >>>.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
