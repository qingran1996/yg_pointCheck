/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const onlineRouter = {
	path: '/onlineshow',
	component: Layout,
	redirect: 'noRedirect',
	name: 'onlineshow',
	meta: {
		title: '在线数据管理',
		icon: 'lock'
	},
	children: [{
			path: 'onlineData',
			component: () => import('@/views/onlineData/online/index'),
			name: 'onlineData',
			meta: {
				title: '在线数据',
				keepAlive: true,
				noCache: true
			}
		},
		{
			path: 'history',
			component: () => import('@/views/onlineData/history/index'),
			name: 'history',
			meta: {
				title: '历史数据',
				keepAlive: true,
				noCache: true
			}
		}
	]
}

export default onlineRouter
