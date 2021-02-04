import Layout from '@/layout'

const relatedUnitsRouter={
  path: '/relatedUnits',
  component: Layout,
  redirect: 'noRedirect',
  name: 'relatedUnits',
  meta: {
    title: '相关单位',
    icon: 'bug'
  },
  children: [{
    path: 'company',
    component: () => import('@/views/relatedUnits/Company/index'),
    name: 'relatedUnitsCompany',
    meta: {
      title: '第三方单位信息',
      keepAlive: true,
      noCache: true
    }
  },
    {
      path: 'person',
      component: () => import('@/views/relatedUnits/Person/index'),
      name: 'relatedUnitsPerson',
      meta: {
        title: '第三方人员信息',
        keepAlive: true,
        noCache: true
      }
    }
  ]
}
export default relatedUnitsRouter
