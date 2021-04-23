/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const rootRouter = {
	path: '/root',
	component: Layout,
	redirect: 'noRedirect',
	name: 'root',
	meta: {
		title: '权限管理',
		icon: 'lock'
	},
	children: [{
			path: 'menu',
			component: () => import('@/views/root/menu/index'),
			name: 'rootMenu',
			meta: {
				title: '菜单管理'
			}
		},
		{
			path: 'role',
			component: () => import('@/views/root/role/index'),
			name: 'rootRole',
			redirect: 'noRedirect', //顶部禁止跳转
			meta: {
				title: '角色管理'
			},
			children: [{
				path: 'menuRole',
				component: () => import('@/views/root/role/menuRole/index'),
				name: 'menuRole',
				meta: {
					title: '菜单权限',
					keepAlive: true,
					noCache: true
				}
			}, {
				path: 'flowPathRole',
				component: () => import('@/views/root/role/flowPathRole/index'),
				name: 'flowPathRole',
				meta: {
					title: '流程权限',
					keepAlive: true,
					noCache: true
				}
			}, {
				path: 'dataRole',
				component: () => import('@/views/root/role/dataRole/index'),
				name: 'dataRole',
				meta: {
					title: '数据权限',
					keepAlive: true,
					noCache: true
				}
			}]
		}
	]
}

export default rootRouter
