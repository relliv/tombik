<template>Testa Weekly View</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAppStore } from "@/shared/stores/app.store";

const appStore = useAppStore();

onMounted(async () => {
  appStore.setPageTitle("Weekly", "Track your weekly to-do lists");
});
</script>

<style scoped lang="scss"></style>
