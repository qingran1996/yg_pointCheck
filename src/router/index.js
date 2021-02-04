import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
import rootRouter from './modules/root'
import alarmRouter from './modules/alarm'
import deviceRouter from './modules/device'
import personRouter from './modules/person'
import sparePartRouter from './modules/sparePart'
import deviceServiceRouter from './modules/deviceService'
import relatedUnitsRouter from './modules/relatedUnits'
import spotInspectionRouter from './modules/spotInspection'
import workTicketRouter from './modules/workTicket'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path(.*)',
    component: () => import('@/views/redirect/index')
  }]
},
{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},
{
  path: '/auth-redirect',
  component: () => import('@/views/login/auth-redirect'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/views/error-page/404'),
  hidden: true
},
{
  path: '/401',
  component: () => import('@/views/error-page/401'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: '/index',
  children: [{
    path: 'index',
    component: () => import('@/views/dashboard/index'),
    name: '首页',
    meta: {
      title: '首页',
      icon: 'guide',
      keepAlive: true,
      affix: true
    }
  }]
},

{
  path: '/error',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ErrorPages',
  hidden: true,
  meta: {
    title: 'Error Pages',
    icon: '404'
  },
  children: [{
    path: '401',
    component: () => import('@/views/error-page/401'),
    name: 'Page401',
    meta: {
      title: '401',
      noCache: true
    }
  },
  {
    path: '404',
    component: () => import('@/views/error-page/404'),
    name: 'Page404',
    meta: {
      title: '404',
      noCache: true
    }
  }
  ]
},
personRouter,
deviceRouter,
workTicketRouter,
{
  path: '/device/index',
  component: Layout,
  redirect: '/device/index/deviceOverview',
  children: [{
    path: 'deviceOverview',
    hidden: false,
    component: () => import('@/views/device/device/deviceOverview/index'),
    name: '设备总览',
    meta: {
      title: '设备总览',
      icon: 'form',
      keepAlive: true,
      noCache: true
    }
  }]
},
sparePartRouter,
deviceServiceRouter,
relatedUnitsRouter,
spotInspectionRouter,
{
  path: '/warehouse',
  component: Layout,
  redirect: '/warehouse/index',
  children: [{
    path: 'index',
    component: () => import('@/views/warehouse/index'),
    name: '仓库管理',
    meta: {
      title: '仓库管理',
      icon: 'form',
      keepAlive: true,
      noCache: true
    }
  },{
    path: 'warehousePerson',
    component: () => import('@/views/warehouse/warehouseDialog/warehousePerson'),
    name: '仓库人员',
    meta: {
      title: '仓库人员',
      icon: 'form',
      keepAlive: true,
      noCache: true
    }
  }]
},

{
  path: '/deviceScrap',
  component: Layout,
  redirect: '/deviceScrap/index',
  children: [{
    path: 'index',
    component: () => import('@/views/deviceScrap/index'),
    name: '设备报废',
    meta: {
      title: '设备报废',
      icon: 'form',
      keepAlive: true,
      noCache: true
    }
  }]
},
rootRouter,
alarmRouter,
{
  path: '/dataCatch',
  component: Layout,
  redirect: '/dataCatch/index',
  children: [{
    path: 'index',
    component: () => import('@/views/dataCatch/index'),
    name: '数据采集',
    meta: {
      title: '数据采集',
      keepAlive: true,
      icon: 'form',
      noCache: true
    }
  }]
},
{
  path: '/deviceChange',
  component: Layout,
  redirect: '/deviceChange/index',
  children: [{
    path: 'index',
    component: () => import('@/views/deviceChange/index'),
    name: '设备变更',
    meta: {
      title: '设备变更',
      keepAlive: true,
      icon: 'form',
      noCache: true
    }
  }]
},
{
  path: '/deviceChange/index',
  component: Layout,
  redirect: '/deviceChange/index/deviceStatus',
  children: [{
    path: 'deviceStatus',
    hidden: false,
    component: () => import('@/views/deviceChange/deviceStatus/index'),
    name: '设备状态',
    meta: {
      title: '设备状态',
      icon: 'form',
      keepAlive: true,
      noCache: true
    }
  }]
},
  {
    path: '/deviceService/plan',
    component: Layout,
    redirect: '/deviceService/plan/servicePlan',
    children: [{
      path: 'servicePlan',
      hidden: false,
      component: () => import('@/views/deviceService/plan/servicePlan'),
      name: '保养计划',
      meta: {
        title: '保养计划',
        icon: 'form',
        keepAlive: true,
        noCache: true
      }
    }]
  },
{
  path: '/dictionary',
  component: Layout,
  redirect: '/dictionary/index',
  children: [{
    path: 'index',
    component: () => import('@/views/dictionary/dictionary'),
    name: '数据字典',
    meta: {
      title: '数据字典',
      keepAlive: true,
      icon: 'education',
      noCache: true
    }
  },{
    path: 'children',
    component: () => import('@/views/dictionary/dictionaryChildren'),
    name: '字典子数据',
    meta: {
      title: '字典子数据',
      keepAlive: true,
      icon: 'education',
      noCache: true
    }
  }]
},

// 404 page must be placed at the end !!!
{
  path: '*',
  redirect: '/404',
  hidden: true
}

  // {
  //   path: '/profile',
  //   component: Layout,
  //   redirect: '/profile/index',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Profile',
  //       meta: { title: 'Profile', icon: 'user', noCache: true }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = []

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
