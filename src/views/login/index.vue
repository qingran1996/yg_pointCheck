<template>
	<div class="form_container">
		<canvaShow v-show="isshow" />
		<!-- <div class="canvaszz"></div>
		<canvas id="canvas"></canvas> -->
		<div class="manage_tip">
			<span class="title">EAM</span>
			<el-form ref="loginForm" :model="loginForm" status-icon :rules="rules" class="loginForm" label-width="80px">
				<el-form-item prop="username">
					<el-input v-model="loginForm.username" prefix-icon="el-icon-s-custom" placeholder="请输入账号" />
				</el-form-item>
				<el-form-item prop="password">
					<el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password" placeholder="请输入密码" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" style="margin-bottom: 20px;" class="submit_btn" @click="submitForm('loginForm')"
					 @keyup.enter="submitForm('loginForm')">登录</el-button>
				</el-form-item>
			</el-form>
		</div>

	</div>
</template>

<script>
	import {
		validUsername
	} from '@/utils/validate'
	import canvaShow from './canvas_show.vue'
	export default {
		name: 'Login',
		components: {
			canvaShow
		},
		data() {
			const validateUsername = (rule, value, callback) => {
				if (!validUsername(value)) {
					callback(new Error('Please enter the correct user name'))
				} else {
					callback()
				}
			}
			const validatePassword = (rule, value, callback) => {
				if (value.length < 6) {
					callback(new Error('The password can not be less than 6 digits'))
				} else {
					callback()
				}
			}
			return {
				loginForm: {
					username: 'sAdmin',
					password: '123456'
				},
				isshow: true,
				loginRules: {
					username: [{
						required: true,
						trigger: 'blur',
						validator: validateUsername
					}],
					password: [{
						required: true,
						trigger: 'blur',
						validator: validatePassword
					}]
				},
				rules: {
					username: [{
						required: true,
						message: '账号不能为空',
						trigger: 'blur'
					}],
					password: [{
							required: true,
							message: '密码不能为空',
							trigger: 'blur'
						},
						{
							min: 4,
							max: 30,
							message: '长度在1到30个字符之间',
							trigger: 'blur'
						}
					]
				},
				passwordType: 'password',
				capsTooltip: false,
				loading: false,
				showDialog: false,
				redirect: undefined,
				otherQuery: {}
			}
		},
		watch: {
			$route: {
				handler: function(route) {
					const query = route.query
					if (query) {
						this.redirect = query.redirect
						this.otherQuery = this.getOtherQuery(query)
					}
				},
				immediate: true
			}
		},
		created() {

		},
		mounted() {
			if (this.loginForm.username === '') {
				this.$refs.username.focus()
			} else if (this.loginForm.password === '') {
				this.$refs.password.focus()
			}
		},
		destroyed() {
			// window.removeEventListener('storage', this.afterQRScan)
		},
		methods: {
			checkCapslock(e) {
				const {
					key
				} = e
				this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
			},
			showPwd() {
				if (this.passwordType === 'password') {
					this.passwordType = ''
				} else {
					this.passwordType = 'password'
				}
				this.$nextTick(() => {
					this.$refs.password.focus()
				})
			},
			submitForm(formName) {
				// let addJson = {
				// 	userName: this.loginUser.username,
				// 	password: this.loginUser.password
				// }
				// this.$axios.post('/a/login', addJson).then(res => {
				// 	if (res.data.code == 0) { //登录成功
				// 		this.loginSuccess(res.data.data)
				// 		console.log(res.data.data.accessToken)
				// 	} else {
				// 		this.$notify.error({
				// 			title: '登录失败',
				// 			message: res.data.message
				// 		});
				// 	}
				// })
				this.$refs.loginForm.validate(valid => {
					if (valid) {
						const addJson = {
							userName: this.loginForm.username,
							password: this.loginForm.password
						}
						this.$axios.post('/u/login', addJson).then(res => {
							if (res.data.code === 0) { // 登录成功
								const data = res.data.data
								localStorage.setItem('eleToken', data.accessToken) // 存储token
								localStorage.setItem('userId', data.id) // 存储用户id
								localStorage.setItem('username', data.userName) // 存储用户账户名
								localStorage.setItem('name', data.name) // 存储用户姓名
								localStorage.setItem('attachUrl', data.attachUrl) // 存储用户头像
								sessionStorage.setItem('passwordIsInit', data.passwordIsInit) // 判断用户密码是否仍为初始值?
								localStorage.setItem('userMenu', JSON.stringify(data.userMenuMapList['1'])) // 存储动态菜单
								this.$store.dispatch('user/login', this.loginForm)
									.then(() => {
										// this.isshow = false
										this.$router.push({
											path: this.redirect || '/',
											query: this.otherQuery
										})
										this.loading = false
									})
									.catch(() => {
										this.loading = false
									})
                // this.$router.push({
                //   			path: this.redirect || '/',
                //   			})
								console.log(res.data.data.accessToken)
							} else {
								this.$notify.error({
									title: '登录失败',
									message: res.data.message
								})
							}
						})
						// this.loading = true
						// this.$store.dispatch('user/login', this.loginForm)
						//   .then(() => {
						//     this.isshow = false
						//     this.$router.push({
						//       path: this.redirect || '/',
						//       query: this.otherQuery
						//     })
						//     this.loading = false
						//   })
						//   .catch(() => {
						//     this.loading = false
						//   })
					} else {
						console.log('error submit!!')
						return false
					}
				})
			},
			handleLogin() {
				this.$refs.loginForm.validate(valid => {
					if (valid) {
						this.loading = true
						this.$store.dispatch('user/login', this.loginForm)
							.then(() => {
								this.$router.push({
									path: this.redirect || '/',
									query: this.otherQuery
								})
								this.loading = false
							})
							.catch(() => {
								this.loading = false
							})
					} else {
						console.log('error submit!!')
						return false
					}
				})
			},
			getOtherQuery(query) {
				return Object.keys(query).reduce((acc, cur) => {
					if (cur !== 'redirect') {
						acc[cur] = query[cur]
					}
					return acc
				}, {})
			}
			// afterQRScan() {
			//   if (e.key === 'x-admin-oauth-code') {
			//     const code = getQueryObject(e.newValue)
			//     const codeMap = {
			//       wechat: 'code',
			//       tencent: 'code'
			//     }
			//     const type = codeMap[this.auth_type]
			//     const codeName = code[type]
			//     if (codeName) {
			//       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
			//         this.$router.push({ path: this.redirect || '/' })
			//       })
			//     } else {
			//       alert('第三方登录失败')
			//     }
			//   }
			// }
		}
	}
</script>
<style lang="scss" scoped>
	.canvaszz {
		/*用来解决视频右键菜单，用于视频上面的遮罩层*/
		width: 100%;
		background: url(../../assets/user_images/in_top_bj.jpg) no-repeat;
		height: 100%;
		position: absolute;
		z-index: 10;
		filter: alpha(opacity=40);
		-moz-opacity: 0.4;
		-khtml-opacity: 0.4;
		opacity: 0.4;
	}

	.el-form-item {
		margin-bottom: 22px;
	}

	.form_container {
		position: relative;
		width: 100%;
		min-width: 1280px;
		height: 100%;
		overflow: hidden;
		/* background: url(../../assets/bg.jpg) no-repeat center center; */
		background: #000C26;
		background-size: 100% 100%;
	}

	.manage_tip {
		z-index: 1000;
		width: 370px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-top: -136px;
		border-radius: 5px;
		text-align: center;
		margin-left: -185px;
	}

	.form_container .manage_tip .title {
		font-family: "Microsoft YaHei";
		font-weight: bold;
		font-size: 26px;
		color: #fff;
	}

	.el-input>>>.el-input__inner {
		color: #c0c4cc !important;
	}

	::-webkit-input-placeholder {
		/*Webkit browsers 谷歌*/
		color: hsla(0, 0%, 100%, .3) !important;
		font-size: 12px;
	}

	:-moz-placeholder {
		/*Mozilla Firefox 4 to 8 火狐*/
		color: hsla(0, 0%, 100%, .3) !important;
		font-size: 12px;
	}

	::moz-placeholder {
		/*Mozilla Firefox 19+ 火狐*/
		color: hsla(0, 0%, 100%, .3) !important;
		font-size: 12px;
	}

	:-ms-input-placeholder {
		/*Internet Explorer 10+ IE10以上*/
		color: hsla(0, 0%, 100%, .3) !important;
		font-size: 12px;
	}

	.loginForm {
		margin-top: 20px;
		background-color: transparent;
		color: white;
		padding: 20px 20px 0 20px;
		border-radius: 5px;
		box-shadow: 0 0 40px 0 #ccc;
		animation: clipMe 1s linear infinite;
	}

	@keyframes clipMe {

		0% {
			box-shadow: 0 0 40px 0 #ccc;
		}

		25% {
			box-shadow: 0 0 30px 0 #ccc;
		}

		50% {
			box-shadow: 0 0 20px 0 #ccc;
		}

		75% {
			box-shadow: 0 0 30px 0 #ccc;
		}

		100% {
			box-shadow: 0 0 40px 0 #ccc;
		}
	}

	.el-form>>>.el-form-item__label {
		color: white;
		text-align: center;
	}

	.el-button--primary {
		background: transparent;
		border-color: transparent;
		box-shadow: 0 0 5px 0 #ccc;
	}

	.el-button--primary:active {
		background: #00B3FD;
	}

	.el-button--primary:hover {
		background: #00B3FD;
	}

	.submit_btn {
		width: 100%;
	}

	.el-form>>>.el-input__inner {
		background: transparent;
		border: 1px solid hsla(0, 0%, 100%, .1);

	}

	.el-form>>>.el-form-item__content {
		margin-left: 0 !important;
	}

	.info {
		float: right;
		font-size: 14px;
		color: #606266;
	}

	a {
		text-decoration: none;
	}
</style>
