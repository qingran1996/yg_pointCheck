<template>
	<div :class="{'has-logo':showLogo}">
		<logo v-if="showLogo" :collapse="isCollapse" />
		<el-scrollbar wrap-class="scrollbar-wrapper">
			<div class="titleshow">
				<img src="../../../../public/headerTip.png"
					style="width: 30px;height: 30px;vertical-align: middle;margin: 10px 0 10px 12px;" alt="">
				<div v-show="!isCollapse" style="margin-left: 30px;">{{ titlename }}</div>
				<!-- {{ titlename }} -->
			</div>
			<el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg"
				:text-color="variables.menuText" :unique-opened="true" :active-text-color="variables.menuActiveText"
				:collapse-transition="false" mode="vertical">
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
				titlename: '点检检修系统',
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
							title: '点检区域',
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
						path: 'standard',
						name: 'standard',
						meta: {
							title: '标准管理'
						},
						children: [{
							path: 'pointStandard',
							name: 'pointStandard',
							meta: {
								title: '点检标准',
								keepAlive: true,
								noCache: true
							}
						}, {
							path: 'lookStandard',
							name: 'lookStandard',
							meta: {
								title: '巡检标准',
								keepAlive: true,
								noCache: true
							}
						}, 
						// {
						// 	path: 'onlineStandard',
						// 	name: 'onlineStandard',
						// 	meta: {
						// 		title: '在线标准',
						// 		keepAlive: true,
						// 		noCache: true
						// 	}
						// },
						]
					}, {
						path: 'dictionary',
						name: 'dictionary',
						meta: {
							title: '数据字典',
							keepAlive: true,
							noCache: true
						}
					}]
				},
				{

					id: 2,
					path: '/root',
					name: 'root',
					meta: {
						title: '权限管理',
						icon: 'guide',
					},
					children: [
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
						path: 'menu',
						name: 'rootMenu',
						meta: {
							title: '菜单管理',
							keepAlive: true,
							noCache: true
						}
					},
            {
              path: 'user',
              name: 'userMenu',
              meta: {
                title: '用户管理',
                keepAlive: true,
                noCache: true
              }
            }
					]

				},
				
				// {

				// 	id: 2,
				// 	path: '/root',
				// 	name: 'root',
				// 	meta: {
				// 		title: '权限管理',
				// 		icon: 'guide',
				// 	},
				// 	children: [{
				// 		path: 'role',
				// 		name: 'rootrole',
				// 		meta: {
				// 			title: '角色管理'
				// 		},
				// 		children: [{
				// 				path: 'menuRole',
				// 				name: 'menuRole',
				// 				meta: {
				// 					title: '菜单权限',
				// 					keepAlive: true,
				// 					noCache: true
				// 				}
				// 			},
				// 			{
				// 				path: 'flowPathRole',
				// 				name: 'flowPathRole',
				// 				meta: {
				// 					title: '流程权限',
				// 					keepAlive: true,
				// 					noCache: true
				// 				}
				// 			},
				// 			{
				// 				path: 'dataRole',
				// 				name: 'dataRole',
				// 				meta: {
				// 					title: '数据权限',
				// 					keepAlive: true,
				// 					noCache: true
				// 				}
				// 			}
				// 		]
				// 	}, {
				// 		path: 'menu',
				// 		name: 'rootMenu',
				// 		meta: {
				// 			title: '菜单管理',
				// 			keepAlive: true,
				// 			noCache: true
				// 		}
				// 	}]

				// }, 
				{
					id: 3,
					path: '/pointCheck',
					name: 'pointCheck',
					meta: {
						title: '点巡检管理',
						icon: 'guide',
					},
					children: [{
							path: 'point',
							name: 'point',
							meta: {
								title: '点检管理'
							},
							children: [{
									path: 'pointCheckPlan',
									name: 'pointCheckPlan',
									meta: {
										title: '点检计划管理',
										keepAlive: true,
										noCache: true
									}
								},
								{
									path: 'pointCheckTask',
									name: 'pointCheckTask',
									meta: {
										title: '点检任务查询',
										keepAlive: true,
										noCache: true
									}
								},
								{
									path: 'pointCheckArea',
									name: 'pointCheckArea',
									meta: {
										title: '点检区域任务查询',
										keepAlive: true,
										noCache: true
									}
								},
								{
									path: 'pointCheckDataSearch',
									name: 'pointCheckDataSearch',
									meta: {
										title: '点检数据查询',
										keepAlive: true,
										noCache: true
									}
								},
								// {
								// 	path: 'pointCheckDataAbout',
								// 	name: 'pointCheckDataAbout',
								// 	meta: {
								// 		title: '点检数据分析',
								// 		keepAlive: true,
								// 		noCache: true
								// 	}
								// }
							]
						},
						{
							path: 'xun',
							name: 'xun',
							meta: {
								title: '巡检管理',
							},
							children: [{
									path: 'xunCheckPlan',
									name: 'xunCheckPlan',
									meta: {
										title: '巡检计划管理',
										keepAlive: true,
										noCache: true
									}
								},
								{
									path: 'xunCheckTask',
									name: 'xunCheckTask',
									meta: {
										title: '巡检任务查询',
										keepAlive: true,
										noCache: true
									}
								},
								{
									path: 'xunCheckArea',
									name: 'xunCheckArea',
									meta: {
										title: '巡检区域任务查询',
										keepAlive: true,
										noCache: true
									}
								},
								{
									path: 'xunCheckDataSearch',
									name: 'xunCheckDataSearch',
									meta: {
										title: '巡检数据查询',
										keepAlive: true,
										noCache: true
									}
								}
							]
						}
					]

				}, {
					id: 4,
					path: '/abnormaWeek',
					name: 'abnormaWeek',
					alwaysShow: true, //保持展开两个
					meta: {
						title: '异常周期管理',
						icon: 'guide',
					},
					children: [{
							path: 'abnormaMock',
							name: 'abnormaMock',
							meta: {
								title: '隐患模块',
								keepAlive: true,
								noCache: true
							}
						},
						// {
						// 	path: 'weekMock',
						// 	name: 'weekMock',
						// 	meta: {
						// 		title: '周期模块',
						// 		keepAlive: true,
						// 		noCache: true
						// 	}
						// }
					]
				}, 
				{
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
								title: '检修作业卡',
								keepAlive: true,
								noCache: true
							}
						},
						// {
						// 	path: 'overhaulProject',
						// 	name: 'overhaulProject',
						// 	meta: {
						// 		title: '检修项目',
						// 		keepAlive: true,
						// 		noCache: true
						// 	}
						// }, 
						{
							path: 'safe',
							name: 'safe',
							meta: {
								title: '安全风险措施管理',
								keepAlive: true,
								noCache: true
							}
						}
					]

				}, 
				// {
				// 	id: 6,
				// 	path: '/goods',
				// 	name: 'goods',
				// 	meta: {
				// 		title: '物资管理',
				// 		icon: 'guide',
				// 	},
				// 	children: [{
				// 			path: 'warehouse',
				// 			name: 'warehouse',
				// 			meta: {
				// 				title: '物资信息查询',
				// 				keepAlive: true,
				// 				noCache: true
				// 			}
				// 		},
				// 		{
				// 			path: 'spareParts',
				// 			name: 'spareParts',
				// 			meta: {
				// 				title: '物资报表管理',
				// 				keepAlive: true,
				// 				noCache: true
				// 			}
				// 		},
				// 		{
				// 			path: 'goodsDetails',
				// 			name: 'goodsDetails',
				// 			meta: {
				// 				title: '物资履历信息',
				// 				keepAlive: true,
				// 				noCache: true
				// 			}
				// 		}
				// 	]


				// }, 
				// {

				// 	id: 7,
				// 	path: '/onlineshow',
				// 	name: 'onlineshow',
				// 	meta: {
				// 		title: '在线数据管理',
				// 		icon: 'guide',
				// 	},
				// 	children: [{
				// 			path: 'onlineData',
				// 			name: 'onlineData',
				// 			meta: {
				// 				title: '在线数据',
				// 				keepAlive: true,
				// 				noCache: true
				// 			}
				// 		},
				// 		{
				// 			path: 'history',
				// 			name: 'history',
				// 			meta: {
				// 				title: '历史数据',
				// 				keepAlive: true,
				// 				noCache: true
				// 			}
				// 		}
				// 	]



				// }, 
				// {
				// 	id: 8,
				// 	path: '/system',
				// 	name: 'system',
				// 	meta: {
				// 		title: '系统管理',
				// 		icon: 'guide',
				// 	},
				// 	children: [{
				// 			path: 'online',
				// 			name: 'online',
				// 			meta: {
				// 				title: '在线统计',
				// 				keepAlive: true,
				// 				noCache: true
				// 			},
				// 			children: [{
				// 				path: 'onlineApp',
				// 				name: 'onlineApp',
				// 				meta: {
				// 					title: 'App端统计',
				// 					keepAlive: true,
				// 					noCache: true
				// 				}
				// 			}, {
				// 				path: 'onlineWeb',
				// 				name: 'onlineWeb',
				// 				meta: {
				// 					title: 'Web端统计',
				// 					keepAlive: true,
				// 					noCache: true
				// 				}
				// 			}]
				// 		},
				// 		{
				// 			path: 'record',
				// 			name: 'record',
				// 			meta: {
				// 				title: '日志管理',
				// 				keepAlive: true,
				// 				noCache: true
				// 			},
				// 			children: [{
				// 				path: 'recordAction',
				// 				name: 'recordAction',
				// 				meta: {
				// 					title: '操作日志',
				// 					keepAlive: true,
				// 					noCache: true
				// 				}
				// 			}, {
				// 				path: 'recordLogin',
				// 				name: 'recordLogin',
				// 				meta: {
				// 					title: '登陆日志',
				// 					keepAlive: true,
				// 					noCache: true
				// 				}
				// 			}]
				// 		}, {
				// 			path: 'appEdition',
				// 			name: 'appEdition',
				// 			meta: {
				// 				title: 'App版本迭代记录',
				// 				keepAlive: true,
				// 				noCache: true
				// 			}
				// 		}, {
				// 			path: 'cronJob',
				// 			name: 'cronJob',
				// 			meta: {
				// 				title: '定时任务可视化',
				// 				keepAlive: true,
				// 				noCache: true
				// 			}
				// 		}, {
				// 			path: 'server',
				// 			name: 'server',
				// 			meta: {
				// 				title: '服务器监控',
				// 				keepAlive: true,
				// 				noCache: true
				// 			}
				// 		}, {
				// 			path: 'parameter',
				// 			name: 'parameter',
				// 			meta: {
				// 				title: '参数配置',
				// 				keepAlive: true,
				// 				noCache: true
				// 			}
				// 		}
				// 	]



				// },
				]
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
		display: flex;
		font-size: 16px;
	}
</style>
