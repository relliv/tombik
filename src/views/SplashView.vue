<template>
  <div class="w-full flex items-center justify-center">
    <Meteors />
    <div class="flex h-[40rem] w-full flex-col items-center justify-center px-4">
      <h2 class="mb-10 text-center text-white text-5xl sm:text-6xl dark:text-white">
        Welcome
      </h2>
      <VanishingInput v-model="text" :placeholders="placeholders" />
    </div>
  </div>
</template>


<script setup lang="ts">
import Meteors from '@/components/inspira-ui/Meteors.vue';
import VanishingInput from '@/components/inspira-ui/VanishingInput.vue';
import { ref } from 'vue';

const text = ref<string>('');
const placeholders = [
  "Hi there!",
  "Whats up?",
  "What's your name?",
  "Please enter your name",
]
</script>