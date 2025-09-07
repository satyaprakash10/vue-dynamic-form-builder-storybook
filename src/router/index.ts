import { createRouter, createWebHistory } from "vue-router";
import { h } from "vue";

const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      name: "home",
      component: { render: () => h("div", "Home") },
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

export default router;
