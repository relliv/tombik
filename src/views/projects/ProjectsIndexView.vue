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
      <li v-for="folder in folders" :key="folder">{{ folder }}</li>
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

const folders = ref<string[]>([]);
const projectName = ref("");

const createProject = async (projectName: string) => {
  if (projectName) {
    const success = await window.ipcRenderer.createNewProject(projectName);
    if (success) {
      folders.value.push(projectName);
    } else {
      alert("Project creation failed or already exists.");
    }
  }
};

onMounted(async () => {
  folders.value = await window.ipcRenderer.getWorkspaceFolders();
});
</script>

<style scoped lang="scss">
/* Add your styles here */
</style>
