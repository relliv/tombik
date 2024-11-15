import { createMemoryHistory, createRouter } from "vue-router";
import Cookies from "js-cookie";

// layouts
import DashboardLayout from "@/layouts/DashboardLayout.vue";

// views
import HomeView from "@/views/HomeView.vue";
import TimerView from "@/views/TimerView.vue";
import SettingsView from "@/views/SettingsView.vue";
import SplashView from "@/views/SplashView.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    beforeEnter: (to,from,next:any) => {
      if (!Cookies.get("username")) {
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
        path: "/settings",
        name: "settings",
        component: SettingsView,
      },
    ],
  },
  {
    path: '/splash',
    name: 'splash',
    component: SplashView,
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
