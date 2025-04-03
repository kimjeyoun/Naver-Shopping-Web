import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../views/LoginPage.vue";
import LandingPage from "../views/LandingPage.vue";
import SearchPage from "@/views/SearchPage.vue";

const routes = [
  {
    path: "/",
    name: "Landing",
    component: LandingPage,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/search",
    name: "Search",
    component: SearchPage,
    meta: { requiresAuth: true }, // 인증이 필요한 페이지로 설정
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
