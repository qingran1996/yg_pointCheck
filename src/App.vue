<template>
	<div id="app">
		<!-- <keep-alive>
			<router-view v-if="$route.meta.keepAlive" />
		</keep-alive> -->
		<router-view />
	</div>
</template>

<script>
	export default {
		name: 'App',
		data() {
			return {

			}
		},
		mounted() {

		},
		watch: {
			$route(to, from) {
				// console.log(to,from)
				if (to.path === '/login') {
					localStorage.removeItem('eleToken')
				}
			}
		},
		create() {

		}
	}
</script>
<style>
	/*全局设置一些element样式*/
	.cell .el-tag {
		cursor: pointer;
	}

	.el-card {
		margin-bottom: 5px;
	}
	.el-dialog {
		border-radius: 10px;
	}

	/*全局设置一些element样式*/
	/*chrome--------------------------------------------start*/
	::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}

	::-webkit-scrollbar-track-piece {
		background-color: whitesmoke;
		border-radius: 6px;
		box-shadow: 0 0 40px 0 transparent;
	}

	/* Track */
	::-webkit-scrollbar-track {
		background: lightpink;
		border-radius: 6px;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		-webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
		background-color: lightskyblue;
		box-shadow: 0 0 40px 0 transparent;
		border-radius: 6px;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
		background: lightblue;
	}

	/*chrome--------------------------------------------end*/
	/*IE--------------------------------------------start*/
	* {
		/*三角箭头的颜色*/
		scrollbar-arrow-color: #c0c4cc;
		/*滚动条滑块按钮的颜色*/
		scrollbar-face-color: #A2A2A3;
		/*滚动条整体颜色*/
		scrollbar-highlight-color: #A2A2A3;
		/*滚动条阴影*/
		scrollbar-shadow-color: #A2A2A3;
		/*滚动条轨道颜色*/
		scrollbar-track-color: #f4f4f5;
		/*滚动条3d亮色阴影边框的外观颜色——左边和上边的阴影色*/
		scrollbar-3dlight-color: #A2A2A3;
		/*滚动条3d暗色阴影边框的外观颜色——右边和下边的阴影色*/
		scrollbar-darkshadow-color: #A2A2A3;
		/*滚动条基准颜色*/
		scrollbar-base-color: #f4f4f5;
	}
</style>
