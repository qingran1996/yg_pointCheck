/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const abnormaWeekRouter = {
  path: '/abnormaWeek',
  component: Layout,
  redirect: 'noRedirect',
  name: 'abnormaWeek',
	alwaysShow: true,
  meta: { 
    title: '异常周期管理',
    icon: 'lock'
  },
  children: [{
    path: 'abnormaMock',
    component: () => import('@/views/abnormaWeek/abnormaMock/index'),
    name: 'abnormaMock',
    meta: {
      title: '异常模块',
      keepAlive: true,
      noCache: true
    }
  },
  {
    path: 'weekMock',
    component: () => import('@/views/abnormaWeek/weekMock/index'),
    name: 'weekMock',
    meta: {
      title: '周期模块',
      keepAlive: true,
      noCache: true
    }
  }
  ]
}

export default abnormaWeekRouter
