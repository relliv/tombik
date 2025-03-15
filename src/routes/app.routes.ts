import { createRouter, createWebHistory } from "vue-router";
import localForage from "localforage";

// layouts
import DashboardLayout from "@/layouts/DashboardLayout.vue";

// views
import HomeView from "@/views/HomeView.vue";
import TimerView from "@/views/TimerView.vue";
import SettingsView from "@/views/SettingsView.vue";
import SplashView from "@/views/SplashView.vue";
import ProjectsIndexView from "@/views/projects/ProjectsIndexView.vue";
import ProjectDetails from "@/views/projects/ProjectDetails.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    beforeEnter: async (to, from, next: any) => {
      if (!(await localForage.getItem("username"))) {
        next({ name: "splash" });
      } else {
        next();
      }
    },
    children: [
      {
        path: "",
        name: "home",
        component: HomeView,
      },
      {
        path: "/timer",
        name: "timer",
        component: TimerView,
      },
      {
        path: "/projects",
        name: "projects",
        children: [
          {
            path: "",
            name: "projects_index",
            component: ProjectsIndexView,
          },
          {
            path: ":id",
            name: "projects_show",
            component: ProjectDetails,
          },
        ],
      },
      {
        path: "/settings",
        name: "settings",
        component: SettingsView,
      },
    ],
  },
  {
    path: "/splash",
    name: "splash",
    component: SplashView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
