/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const pointCheckRouter = {
	path: '/pointCheck',
	component: Layout,
	redirect: 'noRedirect',
	name: 'pointCheck',
	meta: {
		title: '点巡检管理',
		icon: 'lock'
	},
	children: [{
			path: 'point',
			component: () => import('@/views/check/pointCheck/index'),
			name: 'point',
			redirect: 'noRedirect', //顶部禁止跳转
			meta: {
				title: '点检管理'
			},
			children: [{
					path: 'pointCheckArea',
					component: () => import('@/views/check/pointCheck/area/index'),
					name: 'pointCheckArea',
					meta: {
						title: '点检区域任务查询',
						keepAlive: true,
						noCache: true
					}
				},
				{
					path: 'pointCheckPlan',
					component: () => import('@/views/check/pointCheck/plan/index'),
					name: 'pointCheckPlan',
					meta: {
						title: '点检计划管理',
						keepAlive: true,
						noCache: true
					}
				}, {
					path: 'pointCheckTask',
					component: () => import('@/views/check/pointCheck/task/index'),
					name: 'pointCheckTask',
					meta: {
						title: '点检任务查询',
						keepAlive: true,
						noCache: true
					}
				},{
					path: 'pointCheckDataSearch',
					component: () => import('@/views/check/pointCheck/dataSearch/index'),
					name: 'pointCheckDataSearch',
					meta: {
						title: '点检数据查询',
						keepAlive: true,
						noCache: true
					}
				}, {
					path: 'pointCheckDataAbout',
					component: () => import('@/views/check/pointCheck/dataAbout/index'),
					name: 'pointCheckDataAbout',
					meta: {
						title: '点检数据分析',
						keepAlive: true,
						noCache: true
					}
				}
			]
		},
		{
			path: 'xun',
			component: () => import('@/views/check/xunCheck/index'),
			name: 'xun',
			redirect: 'noRedirect', //顶部禁止跳转
			meta: {
				title: '巡检管理'
			},
			children: [{
					path: 'xunCheckArea',
					component: () => import('@/views/check/xunCheck/area/index'),
					name: 'xunCheckArea',
					meta: {
						title: '巡检区域任务查询',
						keepAlive: true,
						noCache: true
					}
				},
				{
					path: 'xunCheckTask',
					component: () => import('@/views/check/xunCheck/task/index'),
					name: 'xunCheckTask',
					meta: {
						title: '巡检任务查询',
						keepAlive: true,
						noCache: true
					}
				},
				{
					path: 'xunCheckPlan',
					component: () => import('@/views/check/xunCheck/plan/index'),
					name: 'xunCheckPlan',
					meta: {
						title: '巡检计划管理',
						keepAlive: true,
						noCache: true
					}
				}, {
					path: 'xunCheckDataSearch',
					component: () => import('@/views/check/xunCheck/dataSearch/index'),
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
}

export default pointCheckRouter
