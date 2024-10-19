<template>
  <div
    class="floating-container"
    :style="{ top: `${position.y}px`, left: `${position.x}px` }"
    @mousedown="startDrag"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const position = ref({ x: 0, y: 0 }); // Position is dynamically set on mount
const isDragging = ref(false);
let dragOffset = { x: 0, y: 0 };

const startDrag = (event) => {
  isDragging.value = true;
  dragOffset.x = event.clientX - position.value.x;
  dragOffset.y = event.clientY - position.value.y;
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", stopDrag);
};

const drag = (event) => {
  if (isDragging.value) {
    position.value = {
      x: event.clientX - dragOffset.x,
      y: event.clientY - dragOffset.y,
    };
  }
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
};

// Place the component at the bottom-right with 20px padding from the edges
onMounted(() => {
  const { innerWidth, innerHeight } = window;
  position.value = {
    x: innerWidth - 150, // 200px is the approximate width of the component
    y: innerHeight - 100, // 100px is the approximate height of the component
  };
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
});
</script>

<style scoped>
@import "./floating.scss";
</style>