import Cookies from 'js-cookie';
import axios from "axios";


const axiosAuthInstance = axios.create()
axiosAuthInstance.interceptors.request.use(
  config => {
    const token = Cookies.get('token')
    if(token) {
      config.headers['Authorization'] = 'Bearer ' + token;
      return config;
    }
  },
  error => {
    Promise.reject(error)
  }
)

export default axiosAuthInstance;
