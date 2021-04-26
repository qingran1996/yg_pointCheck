import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import basicInfomationRouter from './modules/basicInfomation'
import rootRouter from './modules/root'
import pointCheckRouter from './modules/pointCheck'
import abnormaWeekRouter from './modules/abnorma'
import overhaulRouter from './modules/overhaul'
import goodsRouter from './modules/goods'
import systemRouter from './modules/system'
import onlineRouter from './modules/online'





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
basicInfomationRouter,
rootRouter,
pointCheckRouter,
abnormaWeekRouter,
overhaulRouter,
goodsRouter,
onlineRouter,
systemRouter,
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

// 404 page must be placed at the end !!!
{
  path: '*',
  redirect: '/404',
  hidden: true
}
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
