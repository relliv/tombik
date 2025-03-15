<template>
  <div class="">{{ path }}</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAppStore } from "@/shared/stores/app.store";
import { useProjectsStore } from "@/shared/stores/projects.store";

const appStore = useAppStore();
const projectsStore = useProjectsStore();

const route = useRoute();
const path = ref(route.query.path || "");

onMounted(async () => {
  const fullPath = path.value;

  appStore.setPageTitle("Project", "Let's get started");
});
</script>

<style scoped lang="scss"></style>
