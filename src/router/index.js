import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
let _import = name => () => import(`@/views/${name}.vue`);
const routes = [
  {
    path: "/",
    name: "index",
    component: _import("index"),
    redirect: "/task-manage",
    children: ["task-manage", "user-manage"].map(name => {
      return {
        path: name,
        name: name,
        component: _import(name)
      };
    })
  }
];

const router = new VueRouter({
  routes
});

export default router;
