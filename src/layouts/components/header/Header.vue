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

        <!-- Search -->
        <div class="search">
            <Input placeholder="Search..." />
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Input } from "@/components/ui/input"
import Cookies from "js-cookie";

const name = Cookies.get('username');
</script>

<style scoped>
@import './header.scss';
</style>