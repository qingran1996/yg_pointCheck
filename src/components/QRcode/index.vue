<template>
	<div class="ewmdc" ref="imageDom">
		<!-- <div>
			<vue-qr :id_name="'qcode_' + index" :text="item.areaName" :callback="getQcodeUrl" :bindElement="false"
				:qid="item.qid" :size="500">
			</vue-qr>
			<img class="real_pic" :src="dataURL" />
		</div> -->
		<vxe-modal v-model="showedit" :title="zipName+'--二维码'" width="70%" min-width="600" min-height="300" resize
			destroy-on-close @close="closemodel">
			<template #default>
				<div class="model_claskk" :style="{height:showheight}">
					<el-row :gutter="20">
						<el-col style="margin: 10px 0;" :ref="'ewm'" :id="'ewm'+index" :span="8"
							v-for="(item,index) in qrCodeData" :key="index">
							<qrcode-vue :id="'showqrcode'+item.ewm" :value="item.ewm" :size="showsize" level="H"
								style="justify-content: center;text-align: center;">
							</qrcode-vue>
							<div style="justify-content: center;font-size: 13px;text-align: center;">
								{{ item.areaName }}
							</div>
						</el-col>
					</el-row>
					<div style="text-align: center;margin-top: 10px;">
						<vxe-button @click="submitshow" status="primary" :loading="submitLoading">确定</vxe-button>
					</div>
				</div>

			</template>

		</vxe-modal>
	</div>
</template>

<script>
	import JSZip from "jszip";
	import FileSaver from "file-saver";
	import QrcodeVue from 'qrcode.vue'
	import vueQr from "vue-qr";
	import html2canvas from "html2canvas"
	export default {
		name: 'ewmdc',
		props: ["qrCodeData", "zipName", "isshow"],
		components: {
			vueQr,
			JSZip,
			QrcodeVue,
			FileSaver,
			html2canvas
		},
		data() {
			return {
				qrCodeFile: [],
				submitLoading: false,
				showsize: 200,
				showheight: document.body.clientHeight * 0.6 + "px", // 表格高度
				dataURL: '',
				showedit: true,
				data: []
			}
		},
		watch: {
			isshow(val) {
				if (val === true) {
					console.log(123)
				}
			},
		},
		created() {

		},
		methods: {
			submitshow() {
				// console.log(this.$refs.ewm[0].$el)
				this.submitLoading = true
				this.$notify({
					title: '请稍等',
					message: '正在打压缩包',
					type: 'warning'
				});
				// this.ewmlist(0)
				setTimeout(()=>{
					let data = []
					for (let i=0;i<this.qrCodeData.length;i++) {
						window.pageYoffset = 0;
						document.documentElement.scrollTop = 0;
						document.body.scrollTop = 0;
						// 先获取你要转换为img的dom节点
						var node = this.$refs.ewm[i].$el; //传入的id名称
						// console.log("node", node);
						var width = node.offsetWidth; //dom宽
						var height = node.offsetHeight; //dom高
						var scale = 2; //放大倍数 这个相当于清晰度 调大一点更清晰一点
						html2canvas(node, {
							width: width,
							heigth: height,
							backgroundColor: "#ffffff", //背景颜色 为null是透明
							dpi: window.devicePixelRatio * 2, //按屏幕像素比增加像素
							scale: scale,
							X: 0,
							Y: 0,
							scrollX: -3, //如果左边多个白边 设置该偏移-3 或者更多
							scrollY: 0,
							useCORS: true, //是否使用CORS从服务器加载图像 !!!
							allowTaint: true //是否允许跨域图像污染画布  !!!
						}).then(canvas => {
							// console.log("canvas", canvas);
							var url = canvas.toDataURL(); //这里上面不设值cors会报错
							data.push({
								id: this.qrCodeData[i].id,
								name: this.qrCodeData[i].areaName,
								url: url
							})
							if (data.length == this.qrCodeData.length) {
								console.log(data)
								const zip = new JSZip();
								data.forEach((item) => {
									// console.log(item)
									const fileName = item.name + ".png";
									zip.file(fileName, item.url.substring(22), {
										base64: true
									}); //向zip中添加文件
								});
								zip.generateAsync({
									type: "blob"
								}).then((content) => {
									// 生成二进制流
									FileSaver.saveAs(content, this.zipName + "--二维码.zip"); // 利用file-saver保存文件
								});
								this.$emit("closeDownload");
								this.submitLoading = false
								data = [];
								this.$notify({
									title: '成功',
									message: '打包成功',
									type: 'success'
								});
							}
							// console.log(url)
						});
					}
					console.log(data)
				},2000)
				
			},
			ewmlist(i) {
				if (i < this.qrCodeData.length) {
					window.pageYoffset = 0;
					document.documentElement.scrollTop = 0;
					document.body.scrollTop = 0;
					// 先获取你要转换为img的dom节点
					var node = this.$refs.ewm[i].$el; //传入的id名称
					// console.log("node", node);
					var width = node.offsetWidth; //dom宽
					var height = node.offsetHeight; //dom高
					var scale = 2; //放大倍数 这个相当于清晰度 调大一点更清晰一点
					html2canvas(node, {
						width: width,
						heigth: height,
						backgroundColor: "#ffffff", //背景颜色 为null是透明
						dpi: window.devicePixelRatio * 2, //按屏幕像素比增加像素
						scale: scale,
						X: 0,
						Y: 0,
						scrollX: -3, //如果左边多个白边 设置该偏移-3 或者更多
						scrollY: 0,
						useCORS: true, //是否使用CORS从服务器加载图像 !!!
						allowTaint: true //是否允许跨域图像污染画布  !!!
					}).then(canvas => {
						// console.log("canvas", canvas);
						var url = canvas.toDataURL(); //这里上面不设值cors会报错
						this.data.push({
							id: this.qrCodeData[i].id,
							name: this.qrCodeData[i].areaName,
							url: url
						})
						this.$notify({
							title: '请稍等，正在打包',
							type: 'warning'
						});
						this.ewmlist(i + 1);
					});
					
					
				} else {
					console.log(this.data)
					const zip = new JSZip();
					this.data.forEach((item) => {
						// console.log(item)
						const fileName = item.name + ".png";
						zip.file(fileName, item.url.substring(22), {
							base64: true
						}); //向zip中添加文件
					});
					zip.generateAsync({
						type: "blob"
					}).then((content) => {
						// 生成二进制流
						FileSaver.saveAs(content, this.zipName + "--二维码.zip"); // 利用file-saver保存文件
					});
					this.$emit("closeDownload");
					this.submitLoading = false
					this.$notify({
						title: '打包成功',
						type: 'success'
					});
					this.data = [];
				}
			},
			closemodel() {
				this.$emit("closeDownload");
			},
			getshow() {
				console.log(this.qrCodeData)
			},
			getQcodeUrl(url, name) {
				var that = this;
				this.qrCodeFile.push({
					url: url,
					name: name,
				});
				if (this.qrCodeFile.length == this.qrCodeData.length) {
					this.dataURL = name
					// const zip = new JSZip();
					// this.qrCodeFile.forEach((item) => {
					// 	console.log(item)
					// 	const fileName = item.name + ".png";
					// 	zip.file(fileName, item.url.substring(22), {
					// 		base64: true
					// 	}); //向zip中添加文件
					// });
					// zip.generateAsync({
					// 	type: "blob"
					// }).then((content) => {
					// 	// 生成二进制流
					// 	FileSaver.saveAs(content, that.zipName + "--二维码.zip"); // 利用file-saver保存文件
					// });
					// this.$emit("closeDownload");
					// this.qrCodeFile = [];
				}
			}
		}
	}
</script>
<style scoped>
	.model_claskk {
		overflow-y: scroll;
	}
</style>
