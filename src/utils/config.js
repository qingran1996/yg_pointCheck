
export default {
	install(Vue, options) {
		//时间戳转时间
		Vue.prototype.formatDate = function(value) {
			let date = new Date(value);
			let y = date.getFullYear();
			let MM = date.getMonth() + 1;
			MM = MM < 10 ? ('0' + MM) : MM;
			let d = date.getDate();
			d = d < 10 ? ('0' + d) : d;
			let h = date.getHours();
			h = h < 10 ? ('0' + h) : h;
			let m = date.getMinutes();
			m = m < 10 ? ('0' + m) : m;
			let s = date.getSeconds();
			s = s < 10 ? ('0' + s) : s;
			return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
		};
		//手机号验证
		Vue.prototype.phoneRole = function(rule, value, callback) {
			if (!value) {
        return callback(new Error('手机号不能为空'));
			} else {
				const reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/
				//console.log(reg.test(value));
				if (reg.test(value)) {
					callback();
				} else {
					return callback(new Error('请输入正确的手机号'));
				}
			}
		};
    //其他人手机号验证
    Vue.prototype.otherPhoneRole = function(rule, value, callback) {
      if (!value) {
         callback();
      } else {
        const reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/
        //console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('联系人手机号不准确'));
        }
      }
    };
		//身份证验证
		Vue.prototype.userCardRole = function(rule, value, callback) {
			if (!value) {
        return callback(new Error('身份证不能为空'));
			} else {
				const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
				//console.log(reg.test(value));
				if (reg.test(value)) {
					callback();
				} else {
					return callback(new Error('请输入正确的身份证'));
				}
			}
		};
		//邮箱验证
		Vue.prototype.emailRole = function(rule, value, callback) {
			if (!value) {
        return callback(new Error('邮箱不能为空'));
			} else {
				const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
				//console.log(reg.test(value));
				if (reg.test(value)) {
					callback();
				} else {
					return callback(new Error('请输入正确的邮箱地址'));
				}
			}
		};
		//身份证验证
		Vue.prototype.carRole = function(rule, value, callback) {
			if (!value) {
				return callback(new Error('车牌号不能为空'));
			} else {
				var xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;

				var creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;

				if (value.length === 7) {

					if (creg.test(value)) {
						callback();
					} else {
						return callback(new Error('请输入正确的车牌号'));
					}

				} else if (value.length === 8) {
					if (xreg.test(value)) {
						callback();
					} else {
						return callback(new Error('请输入正确的车牌号'));
					}

				} else {
					return callback(new Error('请输入正确的车牌号'));
				}
			}
		};
		//针对删除分页的最后一页的最后一条数据判断
    Vue.prototype.deleteLastPageData = function(total,pageSize,currentPage){
      let totalPage = Math.ceil((total - 1)/pageSize)
      let currentP = currentPage > totalPage ? totalPage : currentPage
      return  currentP < 1 ? 1: currentP
    };
		//文件上传upload url 和文档在线预览 url
    Vue.prototype.documentEAMUrl= function(count){
      const theUrl=process.env.NODE_ENV ==='development'?'http://192.168.10.152':'http://192.168.10.153'
      if (count === 'upload'){ //upload上传
        return theUrl + ':10005/u/file/'
      }else if (count === 'preview'){ //在线预览
        return theUrl + ':8082/onlinePreview?url='
      }
    };
	}
}
