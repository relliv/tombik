<template>
    <header class="header">
        <!-- Greeting -->
        <div class="greeting">
            <div class="name">
                Hello, {{ name }}
            </div>

            <div class="message">
                Ready for today's challenges?
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref } from "vue";

const name = ref("relliv");
</script>

<style scoped>
@import './header.scss';
</style>