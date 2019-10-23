import axios from "axios";
import Vue from "vue";
import Toast from "muse-ui-toast";

axios.defaults.baseURL = "/api"; // 配置axios请求的地址
axios.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    console.error(error);
  }
);
axios.interceptors.response.use(
  res => {
    let map = { "0": "success", "-1": "error" };
    Toast[map[res.data.code + ""]](res.data.msg);
    return res;
  },
  error => {
    console.error(error);
  }
);
Vue.prototype.$http = axios;
