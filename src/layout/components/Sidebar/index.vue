<template>
	<div :class="{'has-logo':showLogo}">
		<logo v-if="showLogo" :collapse="isCollapse" />
		<el-scrollbar wrap-class="scrollbar-wrapper">
			<div class="titleshow">
				<img v-show="isCollapse" src="../../../../public/headerTip.png" style="width: 24px;height: 24px;vertical-align: middle;"
				 alt="">
				<div v-show="!isCollapse">{{ titlename }}</div>
				<!-- {{ titlename }} -->
			</div>
			<el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg" :text-color="variables.menuText"
			 :unique-opened="true" :active-text-color="variables.menuActiveText" :collapse-transition="false" mode="vertical">
				<sidebar-item v-for="route in showMenu" :key="route.path" :item="route" :base-path="route.path" />
			</el-menu>
		</el-scrollbar>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import Logo from './Logo'
	import SidebarItem from './SidebarItem'
	import variables from '@/styles/variables.scss'

	export default {
		components: {
			SidebarItem,
			Logo
		},
		data() {
			return {
				titlename: '永钢点巡检',
				showMenu: [{
					children: [{
						path: 'index',
						name: '首页',
						meta: {
							title: '首页',
							icon: 'component',
							affix: true
						}
					}]
				}, {
					id: 1,
					path: '/basicInfomation',
					name: 'basicInfomation',
					meta: {
						title: '基础信息管理',
						icon: 'guide',
					},
					children: [{
						path: 'dept',
						name: 'dept',
						meta: {
							title: '部门管理',
							keepAlive: true,
							noCache: true
						}
					}, {
						path: 'person',
						name: 'person',
						meta: {
							title: '人员管理',
							keepAlive: true,
							noCache: true
						}
					}, {
						path: 'domain',
						name: 'domain',
						meta: {
							title: '区域管理',
							keepAlive: true,
							noCache: true
						}
					}, {
						path: 'device',
						name: 'device',
						meta: {
							title: '设备管理',
							keepAlive: true,
							noCache: true
						}
					}, {
						path: 'safe',
						name: 'safe',
						meta: {
							title: '安全风险措施管理',
							keepAlive: true,
							noCache: true
						}
					}]
				}, {

					id: 2,
					path: '/root',
					name: 'root',
					meta: {
						title: '权限管理',
						icon: 'guide',
					},
					children: [{
							path: 'menu',
							name: 'rootmenu',
							meta: {
								title: '菜单管理',
								keepAlive: true,
								noCache: true
							}
						},
						{
							path: 'role',
							name: 'rootrole',
							meta: {
								title: '角色管理',
								keepAlive: true,
								noCache: true
							}
						},
						{
							path: 'user',
							name: 'rootuser',
							meta: {
								title: '用户管理',
								keepAlive: true,
								noCache: true
							}
						}
					]

				}, {
					id: 3,
					path: '/pointCheck',
					name: 'pointCheck',
					meta: {
						title: '点检管理',
						icon: 'guide',
					},
					children: [{
							path: 'pointWay',
							name: 'pointWay',
							meta: {
								title: '点检路线',
								keepAlive: true,
								noCache: true
							}
						},
						{
							path: 'pointPlan',
							name: 'pointPlan',
							meta: {
								title: '点检计划',
								keepAlive: true,
								noCache: true
							}
						},
						{
							path: 'pointTeam',
							name: 'pointTeam',
							meta: {
								title: '小组管理',
								keepAlive: true,
								noCache: true
							}
						}
					]

				}, {
					id: 4,
					path: '/abnormaWeek',
					name: 'abnormaWeek',
					meta: {
						title: '异常周期管理',
						icon: 'guide',
					},
					children: [{
							path: 'abnormaMock',
							name: 'abnormaMock',
							meta: {
								title: '异常模块',
								keepAlive: true,
								noCache: true
							}
						},
						{
							path: 'weekMock',
							name: 'weekMock',
							meta: {
								title: '周期模块',
								keepAlive: true,
								noCache: true
							}
						}
					]
				}, {
					id: 5,
					path: '/overhaul',
					name: 'overhaul',
					meta: {
						title: '检修管理',
						icon: 'guide',
					},
					children: [{
							path: 'overhaulPlan',
							name: 'overhaulPlan',
							meta: {
								title: '检修计划',
								keepAlive: true,
								noCache: true
							}
						},
						{
							path: 'overhaulProject',
							name: 'overhaulProject',
							meta: {
								title: '检修项目',
								keepAlive: true,
								noCache: true
							}
						}, {
							path: 'safe',
							name: 'safe',
							meta: {
								title: '安全风险措施管理',
								keepAlive: true,
								noCache: true
							}
						}
					]

				}, {
					id: 6,
					path: '/goods',
					name: 'goods',
					meta: {
						title: '物资管理',
						icon: 'guide',
					},
					children: [{
							path: 'warehouse',
							name: 'warehouse',
							meta: {
								title: '仓库管理',
								keepAlive: true,
								noCache: true
							}
						},
						{
							path: 'spareParts',
							name: 'spareParts',
							meta: {
								title: '备品备件管理',
								keepAlive: true,
								noCache: true
							}
						}
					]


				}, {
					id: 7,
					path: '/system',
					name: 'system',
					meta: {
						title: '系统管理',
						icon: 'guide',
					},
					children: [{
							path: 'online',
							name: 'online',
							meta: {
								title: '在线统计',
								keepAlive: true,
								noCache: true
							}
						},
						{
							path: 'record',
							name: 'record',
							meta: {
								title: '日志管理',
								keepAlive: true,
								noCache: true
							}
						},
						{
							path: 'dictionary',
							name: 'dictionary',
							meta: {
								title: '数据字典',
								keepAlive: true,
								noCache: true
							}
						}
					]



				}]
			}
		},
		computed: {
			...mapGetters([
				'permission_routes',
				'sidebar'
			]),
			activeMenu() {
				const route = this.$route
				const {
					meta,
					path
				} = route
				// if set path, the sidebar will highlight the path you set
				if (meta.activeMenu) {
					return meta.activeMenu
				}
				return path
			},
			getitems() { // 通过local存储获取动态菜单
				return localStorage.getItem('userMenu')
			},
			showLogo() {
				return this.$store.state.settings.sidebarLogo
			},
			variables() {
				return variables
			},
			isCollapse() {
				return !this.sidebar.opened
			}
		},
		mounted() {
			//console.log(this.isCollapse)
			// const data = JSON.parse(this.getitems.replace(/url/g, 'path'))
			// for (let i = 0; i < data.length; i++) {
			//   if (data[i].pid === 0) {
			//     this.showMenu.push({
			//       id: data[i].id, 
			//       path: data[i].path,
			//       name: data[i].name,
			//       meta: {
			//         title: data[i].name
			//       },
			//       children: [{
			//         path: data[i].path,
			//         name: data[i].name,
			//         meta: {
			//           title: data[i].name, 
			//           noCache: true
			//         }
			//       }

			//       ]
			//     })
			//   }
			// }
			// for (let i = 0; i < this.showMenu.length; i++) {
			//   const children = []
			//   for (let j = 0; j < data.length; j++) {
			//     if (data[j].pid === this.showMenu[i].id) {
			//       this.showMenu[i]['children'] = []
			//       children.push({
			//         path: data[j].path.slice(1),
			//         name: data[j].name,
			//         meta: {
			//           title: data[j].name,
			//           noCache: true
			//         }
			//       })
			//       this.showMenu[i]['children'] = children
			//     }
			//   }
			// }
			// console.log(this.showMenu)
		}
	}
</script>
<style scoped>
	.titleshow {
		height: 50px;
		line-height: 50px;
		text-align: center;
		color: rgb(191, 203, 217);
		display: block;
		font-size: 16px;
	}
</style>
