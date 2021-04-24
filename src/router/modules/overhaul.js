/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const overhaulRouter = {
  path: '/overhaul',
  component: Layout,
  redirect: 'noRedirect',
  name: 'overhaul',
  meta: { 
    title: '检修管理',
    icon: 'lock'
  },
  children: [{
    path: 'overhaulPlan',
    component: () => import('@/views/overhaul/overhaulPlan/index'),
    name: 'overhaulPlan',
    meta: {
      title: '检修作业卡',
      keepAlive: true,
      noCache: true
    }
  },
  // {
  //   path: 'overhaulProject',
  //   component: () => import('@/views/overhaul/overhaulProject/index'),
  //   name: 'overhaulProject',
  //   meta: {
  //     title: '检修项目',
  //     keepAlive: true,
  //     noCache: true
  //   }
  // },
	{
		  path: 'safe',
		  component: () => import('@/views/overhaul/safe/index'),
		  name: 'safe',
		  meta: {
		    title: '安全风险措施管理',
		    keepAlive: true,
		    noCache: true
		  }
		
	}
  ]
}

export default overhaulRouter
