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
      name: 'rootrole',
      meta: {
        title: '角色管理'
      }
    },
    {
      path: 'user',
      component: () => import('@/views/root/role/user'),
      name: 'userMenu',
      meta: {
        title: '用户管理'
      }
    },

	]
}

export default rootRouter
