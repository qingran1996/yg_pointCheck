/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const basicInfomationRouter = {
  path: '/basicInfomation',
  component: Layout,
  redirect: 'noRedirect',
  name: 'basicInfomation',
  meta: {
    title: '基础信息管理',
    icon: 'skill'
  },
  children: [{
    path: 'dept',
    component: () => import('@/views/basic_infomation/basicList/dept/index'),
    name: 'dept',
    meta: {
      title: '部门管理',
      keepAlive: true,
      noCache: true
    }
  },
  {
    path: 'person',
    component: () => import('@/views/basic_infomation/basicList/person/index'),
    name: 'person',
    meta: {
      title: '人员管理',
      keepAlive: true,
      noCache: true
    }
  },{
      path: 'domain',
      component: () => import('@/views/basic_infomation/basicList/domain/index'),
      name: 'domain',
      meta: {
        title: '区域管理',
        keepAlive: true,
        noCache: true
      }
    },{
      path: 'device',
      component: () => import('@/views/basic_infomation/basicList/device/index'),
      name: 'device',
      meta: {
        title: '设备管理',
        keepAlive: true,
        noCache: true
      }
    }
  ]
}

export default basicInfomationRouter
