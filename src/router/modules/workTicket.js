import Layout from '@/layout'
const workTicketRouter={
  path: '/workTicket',
  component: Layout,
  redirect: '/workTicket/index',
  children:[{
    path: 'index',
    component: () => import('@/views/workTicket/index'),
    name: 'workTicket',
    meta: {
      title: '作业票详情',
      icon: 'education',
      keepAlive: true,
      noCache: true
    }
  }]
}
export default workTicketRouter
