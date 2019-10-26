import axios from "axios";
import Vue from "vue";
import Toast from "muse-ui-toast";
import Loading from "muse-ui-loading";
var loading;
const isProduction = process.env.NODE_ENV === "production";
!isProduction && (axios.defaults.baseURL = "/api"); // 配置axios请求的地址
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
    res.data.code == -1 && Toast.error(res.data.msg);
    return res;
  },
  error => {
    Toast.error("网络异常,请检查网络");
    console.error(error);
  }
);
Vue.prototype.$http = axios;
