import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
let _import = name => () => import(`@/views/${name}.vue`);
const routes = [
  {
    path: "/",
    name: "home",
    component: _import("index")
  }
];

const router = new VueRouter({
  routes
});

export default router;
