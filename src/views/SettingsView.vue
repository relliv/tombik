<template>
  <div>
    <h1>Settings</h1>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/shared/stores/app.store";
import { onMounted } from "vue";

const appStore = useAppStore();

onMounted(async () => {
  appStore.setPageTitle("Settings", "Change app settings");
});
</script>
