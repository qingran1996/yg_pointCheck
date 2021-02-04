/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const alarmRouter = {
  path: '/alarm',
  component: Layout,
  redirect: 'noRedirect',
  name: 'alarm',
  meta: {
    title: '告警管理',
    icon: 'bug'
  },
  children: [{
    path: 'model',
    component: () => import('@/views/alarm/alarmList/model'),
    name: 'alarmModel',
    meta: {
      title: '告警模板管理',
      keepAlive: true,
      noCache: true
    }
  },
  {
    path: 'record',
    component: () => import('@/views/alarm/alarmList/record'),
    name: 'alarmRecord',
    meta: {
      title: '告警记录',
      keepAlive: true,
      noCache: true
    }
  }
  ]
}

export default alarmRouter
