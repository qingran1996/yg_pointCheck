<template>
	<div class="editDialog">
		<el-dialog v-dialogDrag :close-on-click-modal="false" :title="wordtitle" :visible.sync="editDialogVisible" width="30%"
		 center :key="editRender">
			<el-form ref="ruleForm" :model="infoData" label-width="130px" class="demo-ruleForm" :rules="ruleform">
				<el-form-item label="文档" prop="remarks">
					<el-upload :action="actionurl" :headers="Thisauth" :on-preview="handlePreview" :before-upload="beforeUpload"
					 :before-remove="beforeRemove" :file-list="fileList" :limit=1 :on-exceed="handleExceed" :http-request="uploadMethods">
						<el-button type="info" class="el-icon-upload2" circle plain />
					</el-upload>
				</el-form-item>
				<el-form-item label="文档名称" prop="name">
					<el-input v-model="infoData.name"  disabled />
				</el-form-item>
				<el-form-item label="附件编号" prop="annex">
					<el-input v-model="infoData.annex" clearable/>
				</el-form-item>
				<el-form-item label="是否绑定设备" prop="catalog">
					<el-select v-model="infoData.catalog">
						<el-option v-for="item in catalogList" :label="item.label" :value="item.value" :key="item.label"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-if="infoData.catalog === 1" label="设备" prop="devicenum">
					<el-autocomplete popper-class="my-autocomplete" v-model="infoData.devicenum" :fetch-suggestions="querySearch"
					 placeholder="请输入或者选择设备" @select="handleSelect">
						<template slot-scope="{ item }">
							<div class="name" :title="item.value">{{ item.value }}</div>
						</template>
					</el-autocomplete>
				</el-form-item>
				<el-form-item label="文档类型" prop="documentType">
					<el-select v-model="infoData.documentType">
						<el-option v-for="it in optionList" :key="it.name" :label="it.name" :value="it.code"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="文档概述" prop="fileMsg">
					<el-input v-model="infoData.fileMsg" clearable type="textarea" resize="none" :show-word-limit="true" :maxlength="textareaMax"
					 :rows="textrow" />
				</el-form-item>
			</el-form>
			<span slot="footer" class="footerClass">
				<el-button @click="close">取消</el-button>
				<el-button type="primary" @click="updateInfo" v-prevent-re-click>确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				actionurl: 'http://192.168.10.152:10005/u/attach/upload',
        picurl:this.documentEAMUrl('upload'),
				Thisauth: {
					'Authorization': `Bearer ${localStorage.getItem('eleToken')}`
				}, //给请求头部添加 权限
				editDialogVisible: false,
				dialogImageUrl: '',
				dialogVisible: false,
				editRender: 0,
				textareaMax: 200,
				foreignId: 0, //关联设备id
				textrow: 4,
        fileSource:{
				  file:null
        },
				jsonData: {
					keyWord: '',
					pageNo: 1,
					pageSize: 10000
				},
				wordtitle: '文档编辑',
				fileList: [{
					filePath: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
					fileName: 'food.jpg',
				}],
				infoData: {
					name: '',
					code: '',
					documentType: '',
					deviceName: '',
					fileMsg: '',
					annex: '', //附件编号
					attachId: 0,
					foreignId: 0,
					devicenum: '',
					catalog: '',
					id: 0, //传过来判定的文件id
					// remarks: [{name:'123'}]
				},
				optionList: [{
						value: '2',
						label: '模型类'
					},
					{
						value: '3',
						label: '工艺图纸类'
					},
					{
						value: '4',
						label: '说明类'
					},
					{
						value: '5',
						label: '设备合格证类'
					},
					{
						value: '6',
						label: '其他类'
					},
					{
						value: '1',
						label: '文档测试类型1'
					}
				],
				//设备分类
				catalogList: [{
					label: '是',
					value: 1
				}, {
					label: '否',
					value: 3
				}],
				deviceTypeData: [], //绑定设备列表
				// 表单的判断规则
				ruleform: {
					name: [{
						required: true,
						message: '请输入文档名称',
						trigger: ['change', 'blur']
					}],
					annex: [{
						required: true,
						message: '请输入附件编号',
						trigger: ['change', 'blur']
					}],
					documentType: [{
						required: true,
						message: '请选择文档类型',
						trigger: 'change'
					}],
					catalog: [{
						required: false,
						message: '请选择分类',
						trigger: ['blur', 'change']
					}],
					devicenum: [{
						required: true,
						message: '请选择设备',
						trigger: ['blur', 'change']
					}]
				},
				state: '',
				timeout: null
			}
		},
		watch: {
			// 当dialog关闭，对表单内容的清空
			editDialogVisible(val) {
				if (val === false) {
					this.forceRender()
				}
			}
		},
		created() {

			// 编辑bus传值&跳转实现
			this.$bus.on('editInfo6', (e) => {
				this.getByKeyword()
				//console.log('编辑-》', e)
				this.resetForm()
				this.infoData.name = e.name
				this.infoData.code = e.code
				this.infoData.annex = e.annex
				this.infoData.documentType = e.documentType
				this.infoData.result = e.result
				this.infoData.remarks.push(e.attach) //PIC上传，先屏蔽
				this.infoData.fileMsg = e.documentDesc
				this.infoData.attachId = e.attachId
				this.infoData.id = e.id
				this.infoData.foreignId = e.foreignId
				this.infoData.catalog = e.catalog

				this.optionList = e.optionList
				this.wordtitle = '文档编辑'
				if (e.catalog != 1) {
					this.infoData.devicenum = ''
				} else {
					this.infoData.devicenum = e.devicename
				}
				this.editDialogVisible = true
				this.fileList.push({
					name: e.attach.fileName,
					url: this.picurl + e.attach.filePath
				})
				//console.log('编辑->', this.fileList)
			})
			this.$bus.on('add6', (e) => {
				this.getByKeyword()
				//console.log('新增-》',e)
				if (e.ps === true) {
					this.optionList = []
					this.optionList = e.documentType
					this.editDialogVisible = e.ps

					this.resetForm()
					this.infoData.catalog = 1 // 新增设备默认为：其他
					this.wordtitle = '文档新增'
				}
			})
		},
		methods: {
			close() {
				this.editDialogVisible = false
			},
			querySearch(queryString, cb) {
				//console.log(123)
				var restaurants = this.deviceTypeData;
				console.log(queryString)
				var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
				// 调用 callback 返回建议列表的数据
				//console.log(results)
				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => {
					cb(results);
				}, 3000 * Math.random());
			},
			createFilter(queryString) {
				return (state) => {
					// return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
					return state.value.indexOf(queryString.toLowerCase()) !== -1
				};
			},
			handleSelect(item) {
				console.log(item);
				this.infoData.devicenum = item.value
				this.foreignId = item.laber
				// this.jsonData.userGroupId = item.laber
				// this.getTable()
			},
			showgroup(event) {
				this.currentPage = 1
				this.jsonData.pageNo = 1
				this.jsonData.keyWord = event
				this.getByKeyword()
			},
			//获取设备列表-关键字
			getByKeyword() {
				this.deviceTypeData = []
				this.getdeviceByKeyword(this.jsonData).then(res => {
					if (res.data.code === 0) {
						console.log(res.data.data.content)
						let data = res.data.data.content
						for (var i = 0; i < data.length; i++) {
							var obj = {}
							obj.value = data[i].deviceName
							obj.laber = data[i].id
							this.deviceTypeData.push(obj)
						}
						// this.$message({
						//   message: '新增成功',
						//   type: 'success'
						// })
						// setTimeout(() => {
						//   this.close()
						//   this.$bus.emit('wordReload',true)
						// }, 200)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			updateInfo() {
				this.$refs.ruleForm.validate((valid) => {
					//console.log(this.infoData)
					if (valid) {
						//判断不绑定设备
						if (this.infoData.catalog !== 1) {
							this.foreignId = 0
						}
						setTimeout(() => {
							//上传文件axios
							let cparams = {
								id: this.infoData.id,
								name: this.infoData.name,
								updateUserId: localStorage.getItem('userId'),
								updateUserName: localStorage.getItem('name'),
								documentCode: this.infoData.annex,
								documentType: this.infoData.documentType,
								documentDesc: this.infoData.fileMsg,
								catalog: this.infoData.catalog,
								foreignId: this.foreignId,
								attachId: this.infoData.attachId,
								attach: this.infoData.remarks
							}
							let addparams = {
								name: this.infoData.name,
								createUserId: localStorage.getItem('userId'),
								createUserName: localStorage.getItem('name'),
								documentCode: this.infoData.annex,
								documentDesc: this.infoData.fileMsg,
								documentType: this.infoData.documentType,
								catalog: this.infoData.catalog,
								foreignId: this.foreignId,
								attachId: this.infoData.attachId
							}
							console.log(addparams)
							if (this.wordtitle === '文档编辑') {
								//修改-》》》
								this.$axios.post('/d/deviceDocument/update', cparams).then(res => {
									console.log('res->', res)
									if (res.data.code === 0) {
										this.$message({
											message: '编辑修改!',
											type: 'success'
										})
										setTimeout(() => {
											this.close()
											this.$bus.emit('wordReload', true)
											// this.$router.go(0)   //修改成功后进行刷新  vue->自带
										}, 300)
										// 传统刷新方式-》》》 location.reload();
									} else {
										this.$message({
											message: res.data.message,
											type: 'error'
										})
									}
								}).catch(err => {
									console.log('数据更新catch到的错误', err)
								})
							} else {
								//   add-》》 新增add
								this.$axios.post('/d/deviceDocument/add', addparams).then(res => {
									if (res.data.code === 0) {
										this.$message({
											message: '新增成功',
											type: 'success'
										})
										setTimeout(() => {
											this.close()
											this.$bus.emit('wordReload', true)
										}, 200)
									}
								}).catch(err => {
									console.log(err)
								})
							}
						}, 300)
					}
				})
			},
			forceRender() {
				this.editRender += 1
			},
			// 重置表单
			resetForm() {
				this.infoData.name = ''
				this.infoData.documentType = ''
				this.infoData.fileMsg = ''
				this.infoData.result = ''
				this.infoData.attachId = null
				this.infoData.id = 0
				this.infoData.foreignId = 0
				this.foreignId = 0
				this.jsonData.keyWord = ''
				this.infoData.catalog = ''
				this.infoData.devicenum = ''
				this.infoData.annex = ''
				this.infoData.remarks = []
				this.fileList = []
			},
      //上传文件方式
      uploadMethods(){
        let formData = new FormData()
        formData.append('file', this.fileSource.file)
        formData.append('source', 4)
        this.$axios.post('/u/attach/upload', formData, {
          header: {
            'Authorization': `Bearer ${localStorage.getItem('eleToken')}`
          }
        }).then(res => {
          console.log('----上传后的data----', res.data.data)
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '文件成功上传!'
            })
            let pic = {
              createTime: res.data.data.createTime,
              ext: res.data.data.ext,
              fileName: res.data.data.fileName,
              filePath: res.data.data.filePath,
              id: res.data.data.id,
              isDelete: null,
              source: res.data.data.source
            }
            //this.flist.push({name:res.data.data.fileName})
            //数据的接受变化
            //this.infoData.foreignId = 1
            // this.infoData.catalog = 1
            this.infoData.attachId = res.data.data.id
            this.infoData.remarks.push([pic])
            //this.infoData.id = 1
            this.infoData.name = res.data.data.fileName.split('.')[0]
            console.log(this.infoData)
          }
        })
      },
			handlePreview(file) {
				console.log('已上传的文件-》', file)
				let filearry = file.name.split('.')
				let nametype = filearry[filearry.length - 1]
				let pcitype = ['jpg', 'png', 'bmp', 'gif', 'PNG', 'JPG', 'BMP', 'GIF']
				// console.log(nametype)
				if (pcitype.includes(nametype) === true) {

				} else {
					this.$message.warning('附件这不是图片，请下载阅读')
				}
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${file.name}？`).then(()=>{
          this.infoData.attachId =null
          this.fileList =[]
          this.infoData.name = ''
        })
			},
			beforeUpload(file) {
				//console.log('上传前操作',file)  //这儿自己手动进行上传
        const isLt10M = file.size / 1024 / 1024 <= 100 //图片大小的限制
        if(!isLt10M){
          this.$message.error('上传的文件不得超过100M!')
        }
        this.fileSource.file = file
        return isLt10M
			}
		},
		beforeDestroy() {
			this.$bus.off('add6')
			this.$bus.off('editInfo6')
		}
	}
</script>

<style scoped>


</style>
