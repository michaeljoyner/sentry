import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import UrlList from "./components/UrlList";
import StatusChecks from "./components/StatusChecks";
import AddPages from "./components/AddPages";
import UrlPage from "./components/UrlPage";

const routes = [
  { path: "/", component: StatusChecks },
  { path: "/url-list", component: UrlList },
  { path: "/add-urls", component: AddPages },
  { path: "/pages/:id", component: UrlPage }
];

const router = new VueRouter({ routes });

const app = new Vue({
  el: "#app",
  router
});
