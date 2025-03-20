<template>
  <div class="custom-scrollbar-container">
    <div
      data-vaul-drawer-wrapper=""
      class="custom-scrollbar-container custom-scrollbar pb-3"
    >
      <div class="kanban-container">
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
                <span
                  class="title"
                  :contenteditable="true"
                  @blur="onColumnTitleBlur($event, column)"
                >
                  {{ column.title }}
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
              @drop="(e: any) => onCardDrop(column.id, e)"
              @drag-start="(e: any) => log('drag start', e)"
              @drag-end="(e: any) => log('drag end', e)"
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
                        @click="onTaskStatusChange($event, card)"
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

              <!-- Task Title -->
              <h1
                ref="taskTitleInput"
                :contenteditable="true"
                @blur="onTaskTitleBlur"
                class="text-zinc-600 mb-2 font-semibold text-xl w-full p-2 border border-transparent focus:border-tombik-primary-500 rounded-md"
              >
                {{ selectedTask!.title }}
              </h1>
            </div>
            <button
              type="button"
              data-testid="dismiss-button"
              class="rounded-md mb-6 w-full bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              @click="() => (isTaskDetailsDrawerOpen = false)"
            >
              Click to close
            </button>
          </DrawerContent>
        </DrawerPortal>
      </DrawerRoot>
    </div>
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
import { applyDrag, generateItems } from "@/shared/utils/array.util";
import { ref, reactive, onMounted, watch, VNodeRef } from "vue";
import { Plus, Check } from "lucide-vue-next";
import { ITask, ITaskColumn, Task } from "@/shared/models/project/task.model";
import { DateTime } from "luxon";

const taskDetailsDrawerDirection = ref<DrawerDirection>("right");

const props = defineProps<{
  boardColumns: ITaskColumn[];
}>();

const emits = defineEmits(["save"]);

const scene = ref<{
  columns: ITaskColumn[];
}>({
  columns: [],
});

const selectedTask = ref<ITask | null>(null);
const taskTitleInput = ref<HTMLInputElement | null>(null);

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
  const newScene = Object.assign({}, scene.value);
  newScene.columns = applyDrag(newScene.columns, dropResult);
  scene.value.columns = newScene.columns;
}

function onCardDrop(columnId: any, dropResult: any) {
  if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
    const newScene = Object.assign({}, scene.value);
    const column = newScene.columns.find(
      (column: ITaskColumn) => column.id === columnId
    );

    if (column) {
      const columnIndex = newScene.columns.indexOf(column);
      const newColumn = Object.assign({}, column);
      newColumn.tasks = applyDrag(newColumn.tasks, dropResult);
      newScene.columns.splice(columnIndex, 1, newColumn);
      scene.value.columns = newScene.columns;
    }
  }
}

function getCardPayload(columnId: any) {
  return (index: number) => {
    const column = scene.value.columns.find(
      (column: ITaskColumn) => column.id === columnId
    );

    if (column) {
      column.tasks[index];
    }
  };
}

function dragStart() {
  console.log("drag started");
}

function log(...params: any[]) {
  console.log(...params);
}

function addNewTask(columnId: any) {
  const column = scene.value.columns.find(
    (column: ITaskColumn) => column.id === columnId
  );

  if (column) {
    const newTask = new Task({
      title: "New Task " + (column.tasks.length + 1),
    });

    column.tasks.unshift(newTask);

    emits("save", scene.value.columns);

    onTaskClick(newTask);
  }
}

function onTaskClick(task: ITask) {
  selectedTask.value = task;

  isTaskDetailsDrawerOpen.value = true;

  setTimeout(() => {
    if (taskTitleInput.value) {
      taskTitleInput.value.focus();
    }
  }, 100);
}

const onTaskStatusChange = (event: Event, task: ITask) => {
  event.stopPropagation();

  const value = (event.target as HTMLInputElement).checked;

  task.isDone = value;

  if (!value) {
    task.completedAt = null;
  } else {
    task.completedAt = DateTime.now();
  }

  emits("save", scene.value.columns);
};

const onTaskTitleBlur = () => {
  if (selectedTask.value) {
    selectedTask.value.title = taskTitleInput.value!.innerText;

    emits("save", scene.value.columns);
  }
};

const onColumnTitleBlur = (event: Event, column: ITaskColumn) => {
  const value = (event.target as HTMLElement).innerText.trim();

  if (value) {
    column.title = value;

    emits("save", scene.value.columns);
  }
};

watch(props, (newVal: any) => {
  if (newVal) {
    scene.value.columns = newVal.boardColumns;
  }
});

onMounted(() => {
  scene.value.columns = props.boardColumns;
});
</script>

<style scoped lang="scss">
.kanban-container {
  @apply flex flex-col pb-0 mr-4 h-full w-[calc(100vw-200px)];

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
            @apply text-white max-w-[250px] p-1 rounded-md
              focus:outline-none
              focus:outline-2 focus:outline-tombik-primary-500;
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
        @apply flex flex-col gap-2 overflow-y-auto h-[calc(100vh-400px)];

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
