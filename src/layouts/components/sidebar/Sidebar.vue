<template>
  <TooltipProvider>
    <div class="sidebar">
      <!-- Top Container -->
      <div class="top-container">
        <div class="logo">TK</div>

        <ul>
          <li v-for="menuItem in topMenuItems" :key="menuItem.name">
            <Tooltip>
              <TooltipTrigger as-child>
                <RouterLink :to="menuItem.route">
                  <Button
                    class="p-3 rounded-full size-12"
                    :class="{
                      active: menuItem.isActive,
                      disabled: menuItem.isDisabled,
                    }"
                    @click="onMenuItemClick($event, menuItem)"
                  >
                    <component :is="menuItem.icon" />
                  </Button>
                </RouterLink>
              </TooltipTrigger>

              <TooltipContent
                side="right"
                :class="{
                  disabled: menuItem.isDisabled,
                }"
              >
                <p>
                  {{ menuItem.name }}
                </p>
              </TooltipContent>
            </Tooltip>
          </li>
        </ul>
      </div>

      <!-- Bottom Container -->
      <div class="bottom-container">
        <ul>
          <li v-for="menuItem in bottomMenuItems" :key="menuItem.name">
            <Tooltip>
              <TooltipTrigger as-child>
                <Button
                  class="p-3 rounded-full size-12"
                  :class="{
                    active: menuItem.isActive,
                    disabled: menuItem.isDisabled,
                  }"
                  @click="onBottomMenuItemClick($event, menuItem)"
                >
                  <component :is="menuItem.icon" />
                </Button>
              </TooltipTrigger>

              <TooltipContent
                side="right"
                :class="{
                  disabled: menuItem.isDisabled,
                }"
              >
                <p>
                  {{ menuItem.name }}
                </p>
              </TooltipContent>
            </Tooltip>
          </li>
        </ul>
      </div>
    </div>
  </TooltipProvider>
</template>

<script setup lang="ts">
import { defineComponent, defineProps, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";
import ISidebarMenu from "@/shared/models/layout/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  IconHome,
  IconHourglass,
  IconLaurelWreath,
  IconSettings,
  IconBrightnessFilled,
  IconSitemap,
} from "@tabler/icons-vue";
import { RouterLink } from "vue-router";

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
    name: "Projects",
    icon: IconSitemap,
    route: "/projects",
    isDisabled: false,
  },
  // {
  //   name: "example",
  //   icon: IconLaurelWreath,
  //   route: "/example",
  //   isDisabled: true,
  // },
  {
    name: "Settings",
    icon: IconSettings,
    route: "/settings",
  },
]);

const bottomMenuItems = ref(<ISidebarMenu[]>[
  {
    name: "Toggle Theme",
    icon: IconBrightnessFilled,
    isDisabled: true,
  },
]);

const props = defineProps({
  isSidebarOpen: Boolean,
});

const router = useRouter();

const onMenuItemClick = (event: MouseEvent, menuItem: ISidebarMenu) => {
  if (menuItem.isDisabled) {
    event.preventDefault();
    event.stopPropagation();

    return;
  }

  topMenuItems.value?.forEach((item: ISidebarMenu) => {
    item.isActive = item.name === menuItem.name;
  });

  // Store the active menu item in local storage
  localStorage.setItem("activeMenuItem", menuItem.name);

  // Navigate to the menu item's route
  if (menuItem.route) {
    router.push(menuItem.route);
  }
};

const onBottomMenuItemClick = (event: MouseEvent, menuItem: ISidebarMenu) => {
  if (menuItem.isDisabled) {
    event.preventDefault();
    event.stopPropagation();

    return;
  }

  // TODO: Implement
};

onMounted(() => {
  const storedMenuItemName = localStorage.getItem("activeMenuItem");
  if (storedMenuItemName) {
    topMenuItems.value?.forEach((item: ISidebarMenu) => {
      item.isActive = item.name === storedMenuItemName;
      if (item.isActive && item.route) {
        router.push(item.route);
      }
    });
  }
});

defineComponent({
  // vue
  RouterLink,

  // icons
  IconHome,
  IconHourglass,
  IconLaurelWreath,

  // shadcn component
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
});
</script>

<style scoped>
@import "./sidebar.scss";
</style>
