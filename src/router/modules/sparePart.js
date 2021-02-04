/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const sparePartRouter = {
  path: '/sparePart',
  component: Layout,
  redirect: 'noRedirect',
  name: 'sparePart',
  meta: {
    title: '备品备件',
    icon: 'form'
  },
  children: [{
    path: 'sparePart_manage',
    component: () => import('@/views/sparePart/manage/index'),
    name: 'manage',
    meta: {
      title: '备品备件管理',
      keepAlive: true,
      noCache: true
    }
  }, {
    path: 'sparePart_basic',
    component: () => import('@/views/sparePart/basic/index'),
    name: 'basic',
    meta: {
      title: '备品备件分类',
      keepAlive: true,
      noCache: true
    }
  },
  {
    path: 'sparePart_receive',
    component: () => import('@/views/sparePart/receive/index'),
    name: 'receive',
    meta: {
      title: '备品备件出库',
      keepAlive: true,
      noCache: true
    }
  },{
      path: 'sparePart_warehouseInfo',
      component: () => import('@/views/sparePart/warehouseInfo/index'),
      name: 'warehouseInfo',
      meta: {
        title: '入库记录',
        keepAlive: true,
        noCache: true
      }
    },{
      path: 'sparePart_outportInfo',
      component: () => import('@/views/sparePart/warehouseInfo/outportInfo'),
      name: 'outportInfo',
      meta: {
        title: '出库记录',
        keepAlive: true,
        noCache: true
      }
    },{
      path: 'sparePart_applyHistory',
      component: () => import('@/views/sparePart/warehouseInfo/applyHistory'),
      name: 'sparePart_applyHistory',
      meta: {
        title: '领用记录',
        keepAlive: false,
        noCache: true
      }
    }
  ]
}

export default sparePartRouter
