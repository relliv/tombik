<template>
  <div class="meteor-container overflow-hidden w-full h-full absolute top-0 left-0">
    <span v-for="index in count" :key="'meteor ' + index" :class="cn(
      'animate-meteor absolute h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]',
      `before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent`,
      $props.class,
    )" :style="{
      top: `${Math.random() * 70}vh`,
      left: `${Math.random() * 100}vw`,
      animationDelay: `${Math.random() * (0.8 - 0.2) + 0.2}s`,
      animationDuration: `${Math.floor(Math.random() * (10 - 2) + 2)}s`,
    }"></span>
  </div>
</template>

<script lang="ts" setup>
import { cn } from "@/shared/utils";

defineProps({
  count: {
    type: Number,
    default: 20,
  },
  class: String,
});
</script>

<style scoped>
.meteor-container {
  clip-path: inset(0);
}

@keyframes meteor {
  0% {
    transform: rotate(215deg) translateX(0);
    opacity: 1;
  }

  70% {
    opacity: 1;
  }

  100% {
    transform: rotate(215deg) translateX(-100vw);
    opacity: 0;
  }
}

.animate-meteor {
  animation: meteor 5s linear infinite;
}
</style>