/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const deviceServiceRouter = {
  path: '/deviceService',
  component: Layout,
  redirect: 'noRedirect',
  name: 'deviceService',
  meta: {
    title: '设备保养',
    icon: 'bug'
  },
  children: [{
    path: 'plan',
    component: () => import('@/views/deviceService/plan/index'),
    name: 'deviceServicePlan',
    meta: {
      title: '保养记录',
      keepAlive: true,
      noCache: true
    }
  },
  {
    path: 'task',
    component: () => import('@/views/deviceService/task/index'),
    name: 'deviceServiceTask',
    meta: {
      title: '保养任务',
      keepAlive: true,
      noCache: true
    }
  }
  ]
}

export default deviceServiceRouter
