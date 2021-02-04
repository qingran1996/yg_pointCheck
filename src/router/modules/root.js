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
    component: () => import('@/views/root/rootList/menu'),
    name: 'rootmenu',
    meta: {
      title: '菜单管理',
      keepAlive: true,
      noCache: true
    }
  },
  {
    path: 'role',
    component: () => import('@/views/root/rootList/role'),
    name: 'rootrole',
    meta: {
      title: '角色管理',
      keepAlive: true,
      noCache: true
    }
  },
  {
    path: 'user',
    component: () => import('@/views/root/rootList/user'),
    name: 'rootuser',
    meta: {
      title: '用户管理',
      keepAlive: true,
      noCache: true
    }
  }
  ]
}

export default rootRouter
