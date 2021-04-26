import Vue from 'vue'
import service from './http.js'


export default {
	install(Vue, options) {
		/************基础信息管理***********/
		//查询区域*********
		Vue.prototype.areaData = function(data) { //全局函数
			return service({
				url: '/bi/area/query',
				method: 'post',
				data: data
			})
		};
		//查询数据字典
		Vue.prototype.dictionaryData = function(data) { //全局函数
			return service({
				url: '/bi/dictionary/dicListAll',
				method: 'post',
				data: data
			})
		};
		//区域新增
		Vue.prototype.areaAdd = function(data) { //全局函数
			return service({
				url: '/bi/area/add',
				method: 'post',
				data: data
			})
		};
		//查询点检计划列表部门查询
		  Vue.prototype.getDisciplineDataByUserOrg= function(data) { //全局函数
		   return service({
		    url: '/bi/organization/getMajorByUserOrg',
		    method: 'post',
		    data: data
		   })
		  };
		//区域更新
		Vue.prototype.areaUpdate = function(data) { //全局函数
			return service({
				url: '/bi/area/update',
				method: 'post',
				data: data
			})
		};
		//区域删除
		Vue.prototype.areaDelete = function(data) { //全局函数
			return service({
				url: '/bi/area/delete?code='+data,
				method: 'get'
			})
		};
		//获取厂区分厂点检区域树及设备(设备在线点检标准)
		Vue.prototype.spotAreaEquips = function() { //全局函数
			return service({
				url: '/bi/equip/spotAreaEquips',
				method: 'get'
			})
		};
		//根据点检部门查询设备
		Vue.prototype.equipByOrg = function(data) { //全局函数
			return service({
				url: '/bi/equip/equipByOrg',
				method: 'post',
				data: data
			})
		};
		//点检区域设备批量关联
		Vue.prototype.areaEquipRel = function(data) { //全局函数
			return service({
				url: '/bi/area/areaEquipRel',
				method: 'post',
				data: data
			})
		};
		//查询组织部门树
		Vue.prototype.deptData = function(data) { //全局函数
			return service({
				url: '/bi/organization/queryTree',
				method: 'post',
				data: data
			})
		};
		//三方部门树指定同步
		Vue.prototype.thirdorgTbPart = function(data) { //全局函数
			return service({
				url: '/bi/hrOrg/orgTbPart',
				method: 'post',
				data: data
			})
		};
		//查询三方部门树
		Vue.prototype.thirddeptData = function(data) { //全局函数
			return service({
				url: '/bi/hrOrg/query',
				method: 'post',
				data: data
			})
		};
		//根据点检区域查询设备
		Vue.prototype.equipByArea = function(data) { //全局函数
			return service({
				url: '/bi/equip/equipByArea',
				method: 'post',
				data: data
			})
		};
		//组织部门树新增
		Vue.prototype.deptAdd = function(data) { //全局函数
			return service({
				url: '/bi/organization/add',
				method: 'post',
				data: data
			})
		};
		//组织部门树修改
		Vue.prototype.deptUpdate = function(data) { //全局函数
			return service({
				url: '/bi/organization/update',
				method: 'post',
				data: data
			})
		};
		//组织部门树删除
		Vue.prototype.deptDelete = function(data) { //全局函数
			return service({
				url: '/bi/organization/delete?code='+data,
				method: 'get'
			})
		};
		//查询设备*********
		Vue.prototype.deviceData = function(data) { //全局函数

			return service({
				url: '/bi/equip/getByWorkArea',
				method: 'post',
				data: data
			})
		};
		//新增设备*********
		Vue.prototype.deviceAdd = function(data) { //全局函数
		
			return service({
				url: '/bi/equip/add',
				method: 'post',
				data: data
			})
		};
		//更新设备*********
		Vue.prototype.deviceUpdate = function(data) { //全局函数
		
			return service({
				url: '/bi/equip/update',
				method: 'post',
				data: data
			})
		};
		//删除设备*********
		Vue.prototype.deviceDelete = function(data) { //全局函数
		// console.log(data)
			return service({
				url: '/bi/equip/delete?id='+data,
				method: 'get'
			})
		};
		//查询设备的区域
		Vue.prototype.areaTodevice = function(data) { //全局函数
			return service({
				url: '/bi/equip/workAreaTree',
				method: 'post',
				data: data
			})
		};
		//查询设备的部门
		Vue.prototype.deviceDept = function(data) { //全局函数
			return service({
				url: '/bi/organization/getOrgDownList',
				method: 'post',
				data: data
			})
		};
		//查询人员*********
		Vue.prototype.personData = function(data) { //全局函数
			return service({
				url: '/bi/person/QueryByCodeAndName',
				method: 'post',
				data: data
			})
		};
		//新增人员*********
		Vue.prototype.personAdd = function(data) { //全局函数
			return service({
				url: '/bi/person/add',
				method: 'post',
				data: data
			})
		};
		//更新人员*********
		Vue.prototype.personUpdate = function(data) { //全局函数
			return service({
				url: '/bi/person/update',
				method: 'post',
				data: data
			})
		};
		//删除人员*********
		Vue.prototype.personDelete = function(data) { //全局函数
			return service({
				url: '/bi/person/delete',
				method: 'post',
				data: data
			})
		};
		//查询点检标准*********
		Vue.prototype.pointStandardData = function(data) { //全局函数
			return service({
				url: '/bi/equipStandard/query',
				method: 'post',
				data: data
			})
		};
		//新增点检标准*********
		Vue.prototype.pointStandardAdd = function(data) { //全局函数
			return service({
				url: '/bi/equipStandard/add',
				method: 'post',
				data: data
			})
		};
		//更新点检标准*********
		Vue.prototype.pointStandardUpdate = function(data) { //全局函数
			return service({
				url: '/bi/equipStandard/update',
				method: 'post',
				data: data
			})
		};
		/************点检管理***********/
		//查询点检路线列表
		Vue.prototype.pointWayData = function(data) { //全局函数
			return service({
				url: '/sc/scQuery/spotCheckRouteList',
				method: 'post',
				data: data
			})
		};
		//查询点检计划列表
		Vue.prototype.pointPlanData = function(data) { //全局函数
			return service({
				url: '/ps/spotCheckController/querySpotCheckPlan',
				method: 'post',
				data: data
			})
		};
		//查询点检计划列表车间查询
		Vue.prototype.pointPlanFarmData = function(data) { //全局函数
			return service({
				url: '/bi/organization/getOrgDownList',
				method: 'post',
				data: data
			})
		};
			//查询点检计划列表车间查询
			Vue.prototype.pointPlanFarmDataByUser = function(data) { //全局函数
				return service({
					url: '/bi/organization/getOrgByUser',
					method: 'post',
					data: data
				})
			};
		//查询点检计划列表部门查询
		Vue.prototype.pointPlanDeptData = function(data) { //全局函数
			return service({
				url: '/bi/organization/getOrgTreeAndUsers?orgId='+data,
				method: 'get'
			})
		};
		//查询点检计划列表人员查询
		Vue.prototype.pointPlanPersonData = function(data) { //全局函数
			return service({
				url: '/bi/organization/getUsersByOrg',
				method: 'post',
				data: data
			})
		};
		//查询点检计划列表点检区域查询
		Vue.prototype.pointPlanAreaData = function(data) { //全局函数
			return service({
				url: '/bi/area/query',
				method: 'post',
				data: data
			})
		};
		//查询点检计划列表下生成的所有任务查询
		Vue.prototype.pointPlanTaskData = function(data) { //全局函数
			return service({
				url: '/ps/spotCheckController/querySpotCheckTaskByPlanId',
				method: 'post',
				data: data
			})
		};
		//点检计划新增
		Vue.prototype.pointPlanAdd = function(data) { //全局函数
			return service({
				url: '/ps/spotCheckController/insertOrUpdateSpotCheckPlan',
				method: 'post',
				data: data
			})
		};
		//点检计划详情
		Vue.prototype.pointPlanLook = function(data) { //全局函数
			return service({
				url: '/ps/spotCheckController/querySpotCheckPlanDetail',
				method: 'post',
				data: data
			})
		};
		//点检计划删除
		Vue.prototype.pointPlanDelete = function(data) { //全局函数
			return service({
				url: '/ps/spotCheckController/cancelSpotCheckPlan',
				method: 'post',
				data: data
			})
		};
		//点检计划激活
		Vue.prototype.pointPlanBego = function(data) { //全局函数
			return service({
				url: '/ps/spotCheckController/activateSpotCheckPlan',
				method: 'post',
				data: data
			})
		};
		//点检任务查询
		Vue.prototype.pointCheckTaskData = function(data) { //全局函数
			return service({
				url: '/ps/spotCheckController/querySpotCheckTaskList',
				method: 'post',
				data: data
			})
		};
		//点检区域任务查询
		Vue.prototype.pointCheckAreaTaskData = function(data) { //全局函数
			return service({
				url: '/ps/spotCheckController/querySpotCheckAreaTaskList',
				method: 'post',
				data: data
			})
		};
		//点检数据查询
		Vue.prototype.pointCheckSearchData = function(data) { //全局函数
			return service({
				url: '/ps/spotCheckController/querySpotCheckProjectList',
				method: 'post',
				data: data
			})
		};
		/************异常周期管理***********/
		//查询异常列表
		Vue.prototype.abnormaMockData = function(data) { //全局函数
			return service({
				url: '/ps/exception/queryWebList',
				method: 'post',
				data: data
			})
		};
		//异常 - 处理异常
		Vue.prototype.handlerExce = function(data) { //全局函数
			return service({
				url: '/ps/exception/handlerExce',
				method: 'post',
				data: data
			})
		};
		// 根据来源查询作业卡详情
		Vue.prototype.getJobCardDetailBySource = function(data) { //全局函数
			return service({
				url: '/ps/jobCardController/getJobCardDetailBySource',
				method: 'post',
				data: data
			})
		};
		//异常新增列表
		Vue.prototype.abnormaMockAdd = function(data) { //全局函数
			return service({
				url: '/sc/exception/add',
				method: 'post',
				data: data
			})
		};
		//查询周期列表
		Vue.prototype.weekMockData = function(data) { //全局函数
			return service({
				url: '/sc/cycle/queryCycleProjectList',
				method: 'post',
				data: data
			})
		};
		//周期新增列表
		Vue.prototype.weekMockAdd = function(data) { //全局函数equipsByArea
			return service({
				url: '/sc/cycle/add',
				method: 'post',
				data: data
			})
		};
		//周期删除列表
		Vue.prototype.weekMockDelete = function(data) { //全局函数
			return service({
				url: '/sc/cycle/delete',
				method: 'post',
				data: data
			})
		};
    //WEB权限 菜单树状接口
    Vue.prototype.getWEBTree = function() { //全局函数
      return service({
        url: '/user/menu/tree/1',
        method: 'get'
      })
    };
    //APP权限 菜单树状接口
    Vue.prototype.getAPPTree = function() { //全局函数
      return service({
        url: '/user/menu/tree/2',
        method: 'get'
      })
    };


    //根据角色获取菜单
    Vue.prototype.getAllMenuByRole = function(data) { //全局函数
      return service({
        url: '/user/roleMenu/getAllMenuByRole',
        method: 'post',
        data:data
      })
    };
  //查询标签组
    Vue.prototype.listGroup = function(data) { //全局函数
      return service({
        url: '/user/role/listGroup',
        method: 'get'
      })
    };
    //角色列表
    Vue.prototype.roleList = function(data) { //全局函数
      return service({
        url: '/user/role/page',
        method: 'get',
        params:data
      })
    };

    //新增角色
    Vue.prototype.setRole = function(data) { //全局函数
      return service({
        url: '/user/role/submit',
        method: 'post',
        data: data
      })
    };
    //角色组保存
    Vue.prototype.submitGroup = function(data) { //全局函数
      return service({
        url: '/user/role/submitGroup',
        method: 'post',
        data: data
      })
    };
    //删除角色组
    Vue.prototype.deleGroup = function(data) { //全局函数
      return service({
        url: '/user/role/removeRoleGroup?id='+data,
        method: 'post'
      })
    };

    //菜单列表
    Vue.prototype.menuList = function(data) { //全局函数
      return service({
        url: '/user/menu/page',
        method: 'get',
        params:data
      })
    };
    //新增菜单
    Vue.prototype.addMenu = function(data) { //全局函数
      return service({
        url: '/user/menu/submit',
        method: 'post',
        data: data
      })
    };



    //保存角色权限
    Vue.prototype.saveMenu = function(data) { //全局函数
      return service({
        url: '/user/roleMenu/set',
        method: 'post',
        data: data
      })
    };
    //保存数据权限
    Vue.prototype.saveRole = function(data) { //全局函数
      return service({
        url: '/user/role/setRoleData',
        method: 'post',
        data: data
      })
    };
    //根据用户获取数据权限
    Vue.prototype.getScope = function(data) { //全局函数
      return service({
        url: '/user/role/getRoleData?roleCode='+data,
        method: 'get',
      })
    };
    //huoqu
    Vue.prototype.getNetworkPerson = function(data) { //全局函数
      return service({
        url: 'user/user/query',
        method: 'post',
        data:data
      })
    };
    //delete
    Vue.prototype.userdelete = function(data) { //全局函数
      return service({
        url: 'user/user/delete',
        method: 'post',
        data:data
      })
    };
 //添加用户
    Vue.prototype.userAdd = function(data) { //全局函数
      return service({
        url: 'user/user/add',
        method: 'post',
        data:data
      })
    };




		/************检修管理***********/
		//作业卡列表
		Vue.prototype.jobCardList = function(data) { //全局函数
			return service({
				url: '/ps/jobCardController/jobCardList',
				method: 'post',
				data: data
			})
		};
		//作业卡详情
		Vue.prototype.jobCardDetail = function(data) { //全局函数
			return service({
				url: '/ps/jobCardController/jobCardDetail',
				method: 'post',
				data: data
			})
		};
		//作业卡人员
		Vue.prototype.jobCardUser = function(data) { //全局函数
			return service({
				url: '/user/user/query',
				method: 'post',
				data: data
			})
		};
		//作业卡下发
		Vue.prototype.issueJoBCard = function(data) { //全局函数
			return service({
				url: '/ps/maintenanceController/issueJoBCard',
				method: 'post',
				data: data
			})
		};
		//作业卡编辑
		Vue.prototype.updateJobCard = function(data) { //全局函数
			return service({
				url: '/ps/maintenanceController/updateJobCard',
				method: 'post',
				data: data
			})
		};
		//检修风险 - 查询
		Vue.prototype.jobCardRisk = function(data) { //全局函数
			return service({
				url: '/ps/safeRiskController/selectList',
				method: 'post',
				data: data
			})
		};
	}
}
