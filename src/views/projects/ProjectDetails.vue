<template>
  <div class="">{{ path }}</div>

  <KanbanBoard />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAppStore } from "@/shared/stores/app.store";
import { useProjectsStore } from "@/shared/stores/projects.store";
import KanbanBoard from "@/components/features/kanban/KanbanBoard.vue";
import { useSidebarStore } from "@/shared/stores/sidebar.store";
import ISidebarMenu from "@/shared/models/layout/sidebar";

const sidebarStore = useSidebarStore();
const appStore = useAppStore();
const projectsStore = useProjectsStore();

const route = useRoute();
const path = ref(route.query.path || "");

console.log(route.query);

onMounted(async () => {
  const fullPath = path.value;

  appStore.setPageTitle("Project", "Let's get started");

  const currrentProject = projectsStore.projectFolders.find(
    (folder) => folder.fullPath === fullPath
  );

  if (currrentProject) {
    projectsStore.setCurrentProject(currrentProject);

    appStore.setPageTitle(
      `Project: ${projectsStore.currentProjectFolder?.name || "Unknown"}`,
      "Let's get started"
    );

    sidebarStore.setCurrentMenuItem(
      {
        name: "Projects",
        route: "/projects",
      } as ISidebarMenu,
      `${route.path}?path=${fullPath}`
    );
  }
});
</script>

<style scoped lang="scss"></style>
