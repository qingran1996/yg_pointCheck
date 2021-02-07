/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const pointCheckRouter = {
  path: '/pointCheck',
  component: Layout,
  redirect: 'noRedirect',
  name: 'pointCheck',
  meta: { 
    title: '点检管理',
    icon: 'lock'
  },
  children: [{
    path: 'pointWay',
    component: () => import('@/views/point_check/point_way/index'),
    name: 'pointWay',
    meta: {
      title: '点检路线',
      keepAlive: true,
      noCache: true
    }
  },
  {
    path: 'pointPlan',
    component: () => import('@/views/point_check/point_plan/index'),
    name: 'pointPlan',
    meta: {
      title: '点检计划',
      keepAlive: true,
      noCache: true
    }
  },
  {
    path: 'pointTeam',
    component: () => import('@/views/point_check/point_team/index'),
    name: 'pointTeam',
    meta: {
      title: '小组管理',
      keepAlive: true,
      noCache: true
    }
  }
  ]
}

export default pointCheckRouter
