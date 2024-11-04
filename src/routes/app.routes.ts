import { createMemoryHistory, createRouter } from "vue-router";

// layouts
import DashboardLayout from "@/layouts/DashboardLayout.vue";

// views
import HomeView from "@/views/HomeView.vue";
import TimerView from "@/views/TimerView.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
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
    ],
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
