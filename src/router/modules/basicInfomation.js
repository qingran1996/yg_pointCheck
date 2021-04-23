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
		}, {
			path: 'domain',
			component: () => import('@/views/basic_infomation/basicList/domain/index'),
			name: 'domain',
			meta: {
				title: '区域管理',
				keepAlive: true,
				noCache: true
			}
		}, {
			path: 'standard',
			component: () => import('@/views/basic_infomation/basicList/standard/index'),
			name: 'standard',
			redirect: 'noRedirect', //顶部禁止跳转
			meta: {
				title: '标准管理'
			},
			children: [{
					path: 'pointStandard',
					component: () => import('@/views/basic_infomation/basicList/standard/pointStandard/index'),
					name: 'pointStandard',
					meta: {
						title: '点检标准',
						keepAlive: true,
						noCache: true
					}
				},
				{
					path: 'lookStandard',
					component: () => import(
						'@/views/basic_infomation/basicList/standard/lookStandard/index'),
					name: 'lookStandard',
					meta: {
						title: '巡检标准',
						keepAlive: true,
						noCache: true
					}
				},
				{
					path: 'onlineStandard',
					component: () => import(
						'@/views/basic_infomation/basicList/standard/onlineStandard/index'),
					name: 'onlineStandard',
					meta: {
						title: '在线标准',
						keepAlive: true,
						noCache: true
					}
				}
			]
		}, {
			path: 'device',
			component: () => import('@/views/basic_infomation/basicList/device/index'),
			name: 'device',
			meta: {
				title: '设备管理',
				keepAlive: true,
				noCache: true
			}
		},
		{
			path: 'dictionary',
			component: () => import('@/views/basic_infomation/basicList/dictionary/index'),
			name: 'dictionary',
			meta: {
				title: '数据字典',
				keepAlive: true,
				noCache: true
			}
		}
	]
}

export default basicInfomationRouter
