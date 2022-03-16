import Axios from 'axios';

var instance = Axios.create({
  baseURL: process.env.VUE_APP_HTTP_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8', //'multipart/form-data';//表单上传file
  },
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;
    return Promise.reject(JSON.stringify(error));
  }
);

export default instance;
