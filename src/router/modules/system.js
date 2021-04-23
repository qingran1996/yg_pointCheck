/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const systemRouter = {
	path: '/system',
	component: Layout,
	redirect: 'noRedirect',
	name: 'system',
	meta: {
		title: '系统管理',
		icon: 'lock'
	},
	children: [{
			path: 'online',
			component: () => import('@/views/system/online/index'),
			name: 'online',
			redirect: 'noRedirect', //顶部禁止跳转
			meta: {
				title: '在线用户'
			},
			children: [{
					path: 'onlineApp',
					component: () => import('@/views/system/online/app/index'),
					name: 'onlineApp',
					meta: {
						title: 'App端统计',
						keepAlive: true,
						noCache: true
					}
				},
				{
					path: 'onlineWeb',
					component: () => import('@/views/system/online/web/index'),
					name: 'onlineWeb',
					meta: {
						title: 'Web端统计',
						keepAlive: true,
						noCache: true
					}
				}
			]
		},
		{
			path: 'record',
			component: () => import('@/views/system/record/index'),
			name: 'record',
			meta: {
				title: '日志管理',
				keepAlive: true,
				noCache: true
			},
			children: [{
					path: 'recordAction',
					component: () => import('@/views/system/record/action/index'),
					name: 'recordAction',
					meta: {
						title: '操作日志',
						keepAlive: true,
						noCache: true
					}
				},
				{
					path: 'recordLogin',
					component: () => import('@/views/system/record/login/index'),
					name: 'recordLogin',
					meta: {
						title: '登陆日志',
						keepAlive: true,
						noCache: true
					}
				}
			]
		},
		{
			path: 'appEdition',
			component: () => import('@/views/system/appEdition/index'),
			name: 'appEdition',
			meta: {
				title: 'App版本迭代记录',
				keepAlive: true,
				noCache: true
			}
		}, {
			path: 'cronJob',
			component: () => import('@/views/system/cronJob/index'),
			name: 'cronJob',
			meta: {
				title: '定时任务可视化',
				keepAlive: true,
				noCache: true
			}
		}, {
			path: 'server',
			component: () => import('@/views/system/server/index'),
			name: 'server',
			meta: {
				title: '服务器监控',
				keepAlive: true,
				noCache: true
			}
		}, {
			path: 'parameter',
			component: () => import('@/views/system/parameter/index'),
			name: 'parameter',
			meta: {
				title: '参数配置',
				keepAlive: true,
				noCache: true
			}
		}
	]
}

export default systemRouter
