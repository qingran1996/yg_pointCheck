/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const deviceRouter = {
  path: '/device',
  component: Layout,
  redirect: 'noRedirect',
  name: 'device',
  meta: {
    title: '设备管理',
    icon: 'skill'
  },
  children: [{
    path: 'index',
    component: () => import('@/views/device/device/index'),
    name: 'deviceShow',
    meta: {
      title: '设备台账',
      keepAlive: true,
      noCache: true
    }
  },
  {
    path: 'deviceSort',
    component: () => import('@/views/device/deviceSort/index'),
    name: 'deviceSort',
    meta: {
      title: '设备分类',
      keepAlive: true,
      noCache: true
    }
  },{
      path: 'deviceWord',
      component: () => import('@/views/deviceWord/index'),
      name: 'deviceWord',
      meta: {
        title: '设备文档',
        keepAlive: true,
        noCache: true
      }
    },{
      path: 'devicePBS',
      component: () => import('@/views/devicePBS/device/index'),
      name: 'devicePBS',
      meta: {
        title: '设备PBS',
        keepAlive: true,
        noCache: true
      }
    }
  ]
}

export default deviceRouter
