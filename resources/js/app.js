import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import UrlList from "./components/UrlList";
import StatusChecks from "./components/StatusChecks";

const routes = [
  { path: "/", component: StatusChecks },
  { path: "/url-list", component: UrlList }
];

const router = new VueRouter({ routes });

const app = new Vue({
  el: "#app",
  router
});
