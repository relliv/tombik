<script setup lang="ts">
import { Maximize, Minimize, Minus, X } from 'lucide-vue-next';
import { ref, watchEffect } from 'vue';

const maximize = () => (window as any).ipcRenderer.maximizeWindow();
const minimize = () => (window as any).ipcRenderer.minimizeWindow();
const close = () => (window as any).ipcRenderer.closeWindow();

const isWindowMaximized = ref(false);

watchEffect(async () => {
  isWindowMaximized.value = await (window as any).ipcRenderer.isWindowMaximized()

  const unsubscribe = (window as any).ipcRenderer.onMaximizedChange((event: any, maximized: any) => {
    isWindowMaximized.value = maximized
  })

  return () => {
    unsubscribe()
  }
})
</script>

<template>
  <div class="title-bar">
    <!-- Left -->
    <div class="left">
      <h1 class="title">Tombik</h1>
    </div>

    <!-- Right -->
    <div class="right">
      <button class="action" @click="maximize">
        <Maximize v-if="!isWindowMaximized" />
        <Minimize v-else />
      </button>
      <button class="action" @click="minimize">
        <Minus />
      </button>
      <button class="action" @click="close">
        <X />
      </button>
    </div>
  </div>
</template>

<style>
@import "./title-bar.scss";
</style>
