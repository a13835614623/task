import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/muse-ui.js";
import "./plugins/axios.js";
Array.prototype.last = function() {
  return this[this.length - 1];
};
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
/**
 * 深克隆对象
 * @param {Object} obj 被克隆的对象
 * @returns {Object} 深克隆后的对象
 */
Vue.prototype.$clone = function clone(obj) {
  if (obj === null) return null;
  if (typeof obj !== "object") return obj;
  if (obj.constructor === Date) return new Date(obj);
  if (obj.constructor === RegExp) return new RegExp(obj);
  var newObj = new obj.constructor(); //保持继承链
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      //不遍历其原型链上的属性
      var val = obj[key];
      newObj[key] = typeof val === "object" ? clone(val) : val; // 使用arguments.callee解除与函数名的耦合
    }
  }
  return newObj;
};
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
