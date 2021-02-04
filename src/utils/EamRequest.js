import axios from "axios";
import {Message} from 'element-ui'

let config = {
	baseURL: 'http://192.168.10.153:10005',
};
const service = axios.create(config)

service.interceptors.request.use(
	config => {
		// 加载
		// startLoading();
		if (localStorage.eleToken) {
			config.headers.Authorization = 'Bearer ' + localStorage.eleToken
		}
		// console.log(config.url)
		return config
	},
	error => {
		Message.error({
			message: '加载超时'
		})
		return Promise.reject(error)
	}
)

service.interceptors.response.use(
	response => response
)

export default service
