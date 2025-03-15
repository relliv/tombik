import { defineStore } from "pinia";
import { ref } from "vue";
import { IBasicFolder } from "@/shared/models/file/folder.model";

export const useProjectsStore = defineStore("projects", () => {
  // State
  const projectFolders = ref<IBasicFolder[]>([]);

  // Events
  const setProjects = (projects: IBasicFolder[]) => {
    projectFolders.value = projects;
  };

  return {
    // states
    projectFolders,

    // events
    setProjects,
  };
});
