import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/muse-ui.js";
import "./plugins/axios.js";
Vue.config.productionTip = false;
Vue.prototype.dateFormat = function(date = new Date()) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let format = (value = 0) => {
    if (value < 10) value = "0" + value;
    return value;
  };
  return `${year}-${format(month)}-${format(day)}`;
};
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
