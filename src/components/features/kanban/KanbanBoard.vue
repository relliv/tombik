<template>
  <div class="custom-scrollbar-container">
    <div
      data-vaul-drawer-wrapper=""
      class="custom-scrollbar-container custom-scrollbar pb-3"
    >
      <!-- Kanban Container -->
      <div class="kanban-container">
        <!-- Current Columns -->
        <Container
          orientation="horizontal"
          @drop="onColumnDrop($event)"
          drag-handle-selector=".column-drag-handle"
          @drag-start="dragStart"
          :drop-placeholder="upperDropPlaceholderOptions"
          class="kanban custom-scrollbar"
        >
          <!-- Saved Columns -->
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
              @drop="(e: any) => onTaskDrop(column.id, e)"
              @drag-start="(e: any) => log('drag start', e)"
              @drag-end="(e: any) => log('drag end', e)"
              :get-child-payload="getCardPayload(column.id)"
              drag-class="task-ghost"
              drop-class="card-ghost-drop"
              :drop-placeholder="dropPlaceholderOptions"
              class="task-list custom-scrollbar"
            >
              <!-- Draggable Task Items -->
              <Draggable v-for="task in column.tasks" :key="task.id">
                <div class="task" @click="onTaskClick(task)">
                  <div class="title">
                    <div class="checkbox-container">
                      <Check v-if="task.isDone" :size="12" />
                      <input
                        type="checkbox"
                        v-model="task.isDone"
                        @click="onTaskStatusChange($event, task)"
                      />
                    </div>

                    <h1>{{ task.title }}</h1>
                  </div>
                </div>
              </Draggable>
            </Container>
          </Draggable>

          <!-- Add New Column -->
          <div class="column add-new-column" @click="onAddNewColumn">
            <!-- Column Header -->
            <div class="header">
              <div class="left">
                <Plus :size="20" />
                <span
                  class="title"
                  ref="addNewColumnRef"
                  v-if="!isAddNewColumnTitleEditable"
                >
                  Add New Column
                </span>
                <input
                  type="text"
                  v-else
                  class="title-input"
                  v-model="newColumnTitle"
                  ref="addNewColumnTitleRef"
                  @blur="onAddNewColumnTitleBlur"
                  @keyup.enter="onAddNewColumn"
                  @keyup.escape="isAddNewColumnTitleEditable = false"
                />
              </div>
            </div>

            <!-- Column Content -->
            <div class="task-list"></div>
          </div>
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
import {
  ITask,
  ITaskColumn,
  Task,
  TaskColumn,
} from "@/shared/models/project/task.model";
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
  console.log("NNNNNN", dropResult);
  const newScene = Object.assign({}, scene.value);
  newScene.columns = applyDrag(newScene.columns, dropResult);
  scene.value.columns = newScene.columns;
}

function onTaskDrop(columnId: string, dropResult: any) {
  console.log("********----->", dropResult);
  if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
    const newScene = Object.assign({}, scene.value);
    const column = newScene.columns.find(
      (column: ITaskColumn) => column.id === columnId
    );

    console.log("********----->", column);

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
  const value = (event.target as HTMLElement).innerText?.trim();

  if (value?.length) {
    column.title = value;

    emits("save", scene.value.columns);
  }
};

// #region Add New Column

const isAddNewColumnTitleEditable = ref(false);
const addNewColumnTitleRef = ref<HTMLElement | null>(null);
const newColumnTitle = ref("");

const onAddNewColumn = () => {
  isAddNewColumnTitleEditable.value = true;

  setTimeout(() => {
    addNewColumnTitleRef.value?.focus();
  }, 200);
};

const onAddNewColumnTitleBlur = (event: Event) => {
  isAddNewColumnTitleEditable.value = false;

  const element = event.target as HTMLInputElement,
    value = element.value?.trim();

  if (value?.length) {
    const newColumn = new TaskColumn({
      title: value,
      tasks: [],
    });

    scene.value.columns.push(newColumn);

    emits("save", scene.value.columns);
  }

  newColumnTitle.value = "";
};

// #endregion

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
    @apply flex flex-row gap-4;

    .column {
      @apply flex flex-col gap-4 min-w-[350px] p-4 rounded-lg
        bg-gradient-to-b from-gray-700/20 to-gray-900/20;

      &.add-new-column {
        @apply border border-transparent hover:border-gray-600/50
          transition-all duration-300 ease-in-out cursor-pointer;

        .header {
          .left {
            svg {
              @apply stroke-gray-400;
            }

            .title {
              @apply text-gray-400;
            }

            .title-input {
              @apply bg-transparent focus:outline-none rounded-md px-2
                focus:outline-2 focus:outline-tombik-primary-500
                transition-all duration-200 ease-in-out;
            }
          }
        }
      }

      .header {
        @apply flex flex-row gap-3 justify-between items-center;

        .left {
          @apply flex flex-row gap-2 items-center;

          .title {
            @apply text-white max-w-[250px] p-1 rounded-md
              focus:outline-none
              focus:outline-2 focus:outline-tombik-primary-500
              transition-all duration-200 ease-in-out;
          }

          .count {
            @apply text-gray-500 text-sm;
          }
        }

        .right {
          @apply flex flex-row gap-2 justify-end;

          button {
            @apply p-1.5 rounded-sm bg-gray-800/50
              transition-all duration-200 ease-in-out;

            &:hover {
              @apply bg-gray-700/80;
            }

            svg {
              @apply size-4;
            }
          }
        }
      }

      .task-list {
        @apply flex flex-col gap-2 overflow-y-auto h-[calc(100vh-350px)];

        &.task-ghost {
          @apply bg-zinc-400 border-zinc-700;
        }

        .task {
          @apply flex flex-col gap-2 border py-4 px-4 rounded-lg
            min-h-[100px]
            bg-gray-800/20 border-gray-700/20 hover:border-gray-600/50
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
