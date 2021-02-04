import Vue from 'vue'
import service from './http.js'


export default {
	install(Vue, options) {
		//部门数据
		Vue.prototype.deptData = function(data) { //全局函数
			return service({
				url: '/p/org/queryAllTree',
				method: 'post',
				data: data
			})
		};
		//人员列表数据
		Vue.prototype.personData = function(data) { //全局函数
			return service({
				url: '/p/person/queryRecursive',
				method: 'post',
				data: data
			})
		};
		Vue.prototype.getDeviceQueryTree = function(data) { //全局函数
			return service({
				url: '/d/area/queryAllTree',
				method: 'post',
				data: data
			})
		};
		//设备分类树 数据
    Vue.prototype.getDeviceTypeQueryTree = function(data) { //全局函数
      return service({
        url: '/d/deviceType/query',
        method: 'post',
        data: data
      })
    };
    // 获取仓库信息-备品备件  入库操作
    Vue.prototype.getWarehouseInfo = function(data) { //全局函数
      return service({
        url: '/d/stock/query',
        method: 'post',
        data: data
      })
    };
    // 仓库 获取信息
    Vue.prototype.getWarehouseInfo = function(data) { //全局函数
      return service({
        url: '/d/stock/query',
        method: 'post',
        data: data
      })
    };
    // 状态state or 文档类型 获取  -》《 字典数据
    Vue.prototype.getStateInfo = function(data) { //全局函数
      return service({
        url: '/u/dictionary/queryByPCode',
        method: 'post',
        data: data
      })
    };
    // /d/device/query  设备台账的详情信息
    Vue.prototype.getDeviceQuery = function(data) { //全局函数
      return service({
        url: '/d/device/query',
        method: 'post',
        data: data
      })
    };
		// 设备列表_关键词
		Vue.prototype.getdeviceByKeyword = function(data) { //全局函数
		  return service({
		    url: '/d/device/getByKeyword',
		    method: 'post',
		    data: data
		  })
		};
    //网络已经注册的用户
    Vue.prototype.getNetworkPerson = function(data) { //全局函数
      return service({
        url: '/u/user/query',
        method: 'post',
        data: data
      })
    };
    //备品备件列表
    Vue.prototype.sparePartQuery = function(data) { //全局函数
      return service({
        url: '/d/sparePart/query',
        method: 'post',
        data: data
      })
    };
		//根据角色获取人员
		Vue.prototype.getByRole = function(data) { //全局函数
			return service({
				url: '/u/user/getByRole',
				method: 'post',
				data: data
			})
		};
	}
}
