import Layout from '@/layout'

const spotInspectionRouter={
  path: '/spotInspection',
  component: Layout,
  redirect: 'noRedirect',
  name: 'spotInspection',
  meta: {
    title: '设备点巡检',
    icon: 'bug'
  },
  children:[{
    path: 'place',
    component: () => import('@/views/spotInspection/placeManage/index'),
    name: 'spotInspectionPlace',
    meta: {
      title: '点位管理',
      keepAlive: true,
      noCache: true
    }
  },{
    path: 'plan',
    component: () => import('@/views/spotInspection/planManage/index'),
    name: 'spotInspectionPlan',
    meta: {
      title: '计划管理',
      keepAlive: true,
      noCache: true
    }
  },{
    path: 'record',
    component: () => import('@/views/spotInspection/RecordManage/index'),
    name: 'spotInspectionRecords',
    meta: {
      title: '记录管理',
      keepAlive: true,
      noCache: true
    }
  }]
}

export default spotInspectionRouter
