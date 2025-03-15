<template>
  <div data-vaul-drawer-wrapper="">
    <div class="kanban-container custom-scrollbar-container">
      <Container
        orientation="horizontal"
        @drop="onColumnDrop($event)"
        drag-handle-selector=".column-drag-handle"
        @drag-start="dragStart"
        :drop-placeholder="upperDropPlaceholderOptions"
        class="kanban custom-scrollbar"
      >
        <Draggable
          v-for="column in scene.columns"
          :key="column.id"
          class="column custom-scrollbar-container"
        >
          <!-- Column Header -->
          <div class="header">
            <div class="left">
              <span class="title">
                {{ column.name }}
              </span>

              <span class="count">
                {{ column.tasks.length }}
              </span>
            </div>

            <div class="right">
              <!-- Add New Task -->
              <button @click="addNewTask(column.id)">
                <Plus :size="24" />
              </button>
            </div>
          </div>

          <!-- Column Content -->
          <Container
            group-name="col"
            @drop="(e) => onCardDrop(column.id, e)"
            @drag-start="(e) => log('drag start', e)"
            @drag-end="(e) => log('drag end', e)"
            :get-child-payload="getCardPayload(column.id)"
            drag-class="task-ghost"
            drop-class="card-ghost-drop"
            :drop-placeholder="dropPlaceholderOptions"
            class="task-list custom-scrollbar"
          >
            <!-- Draggable Task Items -->
            <Draggable v-for="card in column.tasks" :key="card.id">
              <div class="task" @click="onTaskClick(card)">
                <div class="title">
                  <div class="checkbox-container">
                    <Check v-if="card.isDone" :size="12" />
                    <input
                      type="checkbox"
                      v-model="card.isDone"
                      @click="onTaskStatusChange($event)"
                    />
                  </div>

                  <h1>{{ card.title }}</h1>
                </div>
              </div>
            </Draggable>
          </Container>
        </Draggable>
      </Container>
    </div>

    <!-- Task Details Drawer -->
    <DrawerRoot
      v-model:open="isTaskDetailsDrawerOpen"
      :direction="taskDetailsDrawerDirection"
    >
      <DrawerPortal>
        <DrawerOverlay
          data-testid="overlay"
          class="fixed inset-0 bg-black/40 w-[500px]"
        />
        <DrawerContent
          data-testid="content"
          class="bg-zinc-100 flex flex-col rounded-t-[10px] w-[50%] h-full left-[50%] mt-24 fixed bottom-0 right-0"
        >
          <div class="p-4 bg-white rounded-t-[10px] flex-1">
            <div
              class="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8"
            />
            <div class="max-w-md mx-auto">
              <DrawerTitle class="font-medium mb-4">
                Unstyled drawer for Vue.
              </DrawerTitle>
            </div>
            <p class="text-zinc-600 mb-2">
              This component can be used as a replacement for a Dialog on mobile
              and tablet devices.
            </p>
          </div>
          <button
            type="button"
            data-testid="dismiss-button"
            class="rounded-md mb-6 w-full bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            @click="() => (isTaskDetailsDrawerOpen.value = false)"
          >
            Click to close
          </button>
        </DrawerContent>
      </DrawerPortal>
    </DrawerRoot>
  </div>
</template>

<script setup lang="ts">
import {
  DrawerContent,
  DrawerDirection,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
} from "vaul-vue";
import { Container, Draggable } from "vue3-smooth-dnd";
import { applyDrag, generateItems } from "../../shared/utils/array";
import { v4 as uuidv4 } from "uuid";
import { ref, reactive } from "vue";
import { Plus, Check } from "lucide-vue-next";

const taskDetailsDrawerDirection = ref<DrawerDirection>("right");

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

const columnNames = ["To do", "In progress", "Complete", "Backlog", "Blocked"];

const scene = reactive({
  type: "container",
  props: {
    orientation: "horizontal",
  },
  columns: generateItems(4, (i) => ({
    id: uuidv4(),
    type: "container",
    name: columnNames[i],
    props: {
      orientation: "vertical",
      className: "card-container",
    },
    tasks: generateItems(+(Math.random() * 10).toFixed() + 5, (j) => ({
      type: "draggable",
      id: uuidv4(),
      title: lorem.slice(0, Math.floor(Math.random() * 150) + 30),
      isDone: Math.random() > 0.5,
    })),
  })),
});

const upperDropPlaceholderOptions = reactive({
  className: "cards-drop-preview",
  animationDuration: "150",
  showOnTop: true,
});

const dropPlaceholderOptions = reactive({
  className: "drop-preview",
  animationDuration: "150",
  showOnTop: true,
});

const isTaskDetailsDrawerOpen = ref(false);

function onColumnDrop(dropResult: any) {
  const newScene = Object.assign({}, scene);
  newScene.columns = applyDrag(newScene.columns, dropResult);
  scene.columns = newScene.columns;
}

function onCardDrop(columnId: any, dropResult: any) {
  if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
    const newScene = Object.assign({}, scene);
    const column = newScene.columns.find((p) => p.id === columnId);
    const columnIndex = newScene.columns.indexOf(column);
    const newColumn = Object.assign({}, column);
    newColumn.tasks = applyDrag(newColumn.tasks, dropResult);
    newScene.columns.splice(columnIndex, 1, newColumn);
    scene.columns = newScene.columns;
  }
}

function getCardPayload(columnId: any) {
  return (index: number) => {
    return scene.columns.find((p) => p.id === columnId).tasks[index];
  };
}

function dragStart() {
  console.log("drag started");
}

function log(...params: any[]) {
  console.log(...params);
}

function addNewTask(columnId: any) {
  const column = scene.columns.find((p) => p.id === columnId);
  if (column) {
    column.tasks.unshift({
      type: "draggable",
      id: uuidv4(),
      title: "New Task",
      isDone: false,
    });
  }
}

function onTaskClick(task: any) {
  isTaskDetailsDrawerOpen.value = true;
}

const onTaskStatusChange = (event: Event) => {
  event.stopPropagation();
};
</script>

<style scoped lang="scss">
.kanban-container {
  @apply flex flex-col p-5 pb-0 mr-4 h-full;

  .kanban {
    @apply flex flex-row gap-5;

    .column {
      @apply flex flex-col gap-4 min-w-[350px] p-4 rounded-lg
        bg-gradient-to-b from-zinc-800 to-zinc-900;

      .header {
        @apply flex flex-row gap-3 justify-between items-center;

        .left {
          @apply flex flex-row gap-2 items-center;

          .title {
            @apply text-white;
          }

          .count {
            @apply text-gray-500 text-sm;
          }
        }

        .right {
          @apply flex flex-row gap-2 justify-end;

          button {
            @apply p-1.5 rounded-sm bg-zinc-800
              transition-all duration-200 ease-in-out;

            &:hover {
              @apply bg-zinc-700/80;
            }

            svg {
              @apply size-4;
            }
          }
        }
      }

      .task-list {
        @apply flex flex-col gap-2 pr-3 overflow-y-auto h-[calc(100vh-100px)];

        &.task-ghost {
          @apply bg-zinc-400 border-zinc-700;
        }

        .task {
          @apply flex flex-col gap-2 border py-4 px-4 rounded-lg
            min-h-[100px]
            bg-zinc-800 border-zinc-700 hover:border-zinc-600
            transition-all duration-300 ease-in-out cursor-pointer;

          .title {
            @apply flex flex-row gap-4 justify-start items-start;

            .checkbox-container {
              @apply sticky flex flex-row justify-center items-center;

              input {
                @apply absolute appearance-none w-4 h-4 rounded-full border-2 border-gray-300 
                  outline-none cursor-pointer transition-colors 
                  duration-200 ease-in-out checked:bg-green-500/50 checked:border-green-500;
              }

              svg {
                @apply absolute;
              }
            }

            h1 {
              @apply text-sm;
            }
          }
        }
      }
    }
  }
}

// small fix for scrollable DND items
.task-list .smooth-dnd-draggable-wrapper {
  @apply overflow-visible #{!important};
}
</style>
