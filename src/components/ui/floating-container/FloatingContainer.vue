<template>
  <div
    v-if="visible"
    class="floating-container"
    :style="{ top: `${position.y}px`, left: `${position.x}px` }"
    @mousedown="startDrag"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  initialPosition: {
    type: Object,
    default: () => ({ x: null, y: null }),
  },
  visible: {
    type: Boolean,
    default: true,
  },
});

const position = ref({ x: 0, y: 0 });
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

onMounted(() => {
  const { innerWidth, innerHeight } = window;

  const defaultPosition = {
    x: innerWidth - 220,
    y: innerHeight - 120,
  };

  position.value = {
    x:
      props.initialPosition.x !== null
        ? props.initialPosition.x
        : defaultPosition.x,
    y:
      props.initialPosition.y !== null
        ? props.initialPosition.y
        : defaultPosition.y,
  };
});

watch(
  () => props.initialPosition,
  (newPosition) => {
    if (newPosition) {
      position.value = {
        x: newPosition.x !== null ? newPosition.x : position.value.x,
        y: newPosition.y !== null ? newPosition.y : position.value.y,
      };
    }
  }
);

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", stopDrag);
});
</script>

<style scoped>
@import "./floating.scss";
</style>
