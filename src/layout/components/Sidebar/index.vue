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
						children: [{
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
			getItems() { // 通过local存储获取动态菜单
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
			console.log(this.isCollapse)
			const data = JSON.parse(this.getItems.replace(/url/g, 'path'))
      let showMenu = []
      console.log('menuData',data)
			for (let i = 0; i < data.length; i++) {
			  if (data[i].parentId==-1){
          showMenu.push({
            id: data[i].id,
            path: data[i].path,
            name: data[i].path.replace('/',""),
            meta: {
              title: data[i].name
            }
          })
        }


			}
      // console.log('menuData6',showMenu)

			for (let i = 0; i < showMenu.length; i++) {
			  const children = []
			  for (let j = 0; j < data.length; j++) {
			    if (data[j].parentId == showMenu[i].id) {
			      showMenu[i]['children'] = []
			      children.push({
              parentId: data[j].parentId,
              id: data[j].id,
			        path: data[j].path,
              name: data[j].path.replace(showMenu[i].path+'/',""),
              children:[],
			        meta: {
			          title: data[j].name,
			          noCache: true
			        }
			      })
			     showMenu[i]['children'] = children
			    }
			  }
			}
      // console.log('menuData7',showMenu)
      showMenu.forEach(da =>{
        if (da.children.length!=0){
          da.children.forEach(o =>{
            // console.log('o.id',o)
            for (let i = 0; i < data.length; i++) {
              // console.log('o.id',o.id)
              // console.log('data[i].parentId',data[i].parentId)
              if (o.id==data[i].parentId){
                // console.log('data[i].parentId',data[i].parentId)
                // console.log('o.id',o)
                o.children.push({
                  id: data[i].id,
                  path: data[i].path,
                  name: data[i].path.replace(o.path+'/',""),
                  // name: data[i].path.replace('/',""),
                  meta: {
                    title: data[i].name
                  }
                })


                // console.log('o',o)
              }
              // console.log('children',children)

            }
          })
        }

      })
      console.log('menuData8',showMenu)
      // this.showMenu = showMenu

		},
    methods:{

    },
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
