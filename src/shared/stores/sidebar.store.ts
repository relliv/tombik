import { defineStore } from "pinia";
import ISidebarMenu from "../models/layout/sidebar";
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  IconHome,
  IconHourglass,
  IconSettings,
  IconSitemap,
  IconPlant,
} from "@tabler/icons-vue";

export const useSidebarStore = defineStore("sidebar", () => {
  const router = useRouter();

  const topMenuItems = ref(<ISidebarMenu[]>[
    {
      name: "Dashboard",
      icon: IconHome,
      route: "/",
      isActive: true,
    },
    {
      name: "Timer",
      icon: IconHourglass,
      route: "/timer",
    },
    {
      name: "Weekly",
      icon: IconPlant,
      route: "/weekly",
      isDisabled: false,
    },
    {
      name: "Projects",
      icon: IconSitemap,
      route: "/projects",
      isDisabled: false,
    },
    {
      name: "Settings",
      icon: IconSettings,
      route: "/settings",
    },
  ]);

  const currentMenuItem = ref<ISidebarMenu | null>(null);

  const setCurrentMenuItem = (
    menuItem: ISidebarMenu,
    subRoute: string | null = null
  ) => {
    currentMenuItem.value = menuItem;

    // Store the active menu item in local storage
    localStorage.setItem("activeMenuItem", menuItem.name);

    // Navigate to the menu item's route
    if (menuItem.route) {
      router.push(menuItem.route);
    }

    if (subRoute) {
      router.push(subRoute);

      localStorage.setItem("activeSubRoute", subRoute);
    } else {
      localStorage.removeItem("activeSubRoute");
    }
  };

  return {
    // states
    topMenuItems,
    currentMenuItem,

    // events
    setCurrentMenuItem,
  };
});
