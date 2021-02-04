const deviceStatus = {
	state: {
		ceshi: {}, //部门数据
	},

	mutations: {
		CESHI_NUM: (state, ceshi) => {
			state.ceshi = ceshi
		}
	},

	actions: {
		ceshi({
			commit,
			state
		}, data) {
			commit('CESHI_NUM', data)
		}
	}
}

export default deviceStatus
