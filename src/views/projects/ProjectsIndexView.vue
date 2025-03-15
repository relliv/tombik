<template>
  <div>
    <h1>Projects</h1>

    <Dialog>
      <DialogTrigger> Create New Project</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            <Input v-model="projectName" placeholder="Project Name" />
          </DialogDescription>
        </DialogHeader>

        <DialogFooter @click="createProject(projectName)">
          Save changes
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <ul>
      <li v-for="folder in folders" :key="folder.fullPath">
        {{ folder.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ref, onMounted } from "vue";
import { IBasicFolder } from "@/shared/models/file/folder.model.ts";

const folders = ref<IBasicFolder[]>([]);
const projectName = ref("");

const loadProjectFolders = async () => {
  folders.value = await window.ipcRenderer.getWorkspaceFolders();
};

const createProject = async (projectName: string) => {
  if (projectName) {
    const success = await window.ipcRenderer.createNewProject(projectName);

    if (success) {
      loadProjectFolders();
    } else {
      alert("Project creation failed or already exists.");
    }
  }
};

onMounted(async () => {
  loadProjectFolders();
});
</script>

<style scoped lang="scss">
/* Add your styles here */
</style>
