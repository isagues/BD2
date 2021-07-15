import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../components/Login";

Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "Home",
    component: () => import(/* webpackChunkName: "Favoritos" */"@/components/Home"),
  },
  {
    path: "/note/:note_id",
    name: "Note",
    component: () => import(/* webpackChunkName: "Favoritos" */"@/components/Note"),
  },
  {
    component: Login,
    path: "/",
    name: "Login",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
