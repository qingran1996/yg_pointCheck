/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const goodsRouter = {
  path: '/goods',
  component: Layout,
  redirect: 'noRedirect',
  name: 'goods',
  meta: { 
    title: '物资管理',
    icon: 'lock'
  },
  children: [{
    path: 'warehouse',
    component: () => import('@/views/goods/warehouse/index'),
    name: 'warehouse',
    meta: {
      title: '仓库管理',
      keepAlive: true,
      noCache: true
    }
  },
  {
    path: 'spareParts',
    component: () => import('@/views/goods/spareParts/index'),
    name: 'spareParts',
    meta: {
      title: '备品备件管理',
      keepAlive: true,
      noCache: true
    }
  }
  ]
}

export default goodsRouter
