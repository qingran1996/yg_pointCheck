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
    meta: {
      title: '在线统计',
      keepAlive: true,
      noCache: true
    }
  },
  {
    path: 'record',
    component: () => import('@/views/system/record/index'),
    name: 'record',
    meta: {
      title: '日志管理',
      keepAlive: true,
      noCache: true
    }
  },
  {
    path: 'dictionary',
    component: () => import('@/views/system/dictionary/index'),
    name: 'dictionary',
    meta: {
      title: '数据字典',
      keepAlive: true,
      noCache: true
    }
  }
  ]
}

export default systemRouter
