/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const personRouter = {
  path: '/person',
  component: Layout,
  redirect: 'noRedirect',
  name: 'person',
  meta: {
    title: '组织架构',
    icon: 'documentation'
  },
  children: [{
    path: 'index',
    component: () => import('@/views/person/person/index'),
    name: 'personShow',
    meta: {
      title: '人员列表',
      keepAlive: true,
      noCache: true
    }
  },
  {
    path: 'organization',
    component: () => import('@/views/person/organization/organization'),
    name: 'organization',
    meta: {
      title: '我方单位',
      keepAlive: true,
      noCache: true
    }
  }
  ]
}

export default personRouter
