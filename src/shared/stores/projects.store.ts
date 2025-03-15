import { defineStore } from "pinia";
import { ref } from "vue";
import { IBasicFolder } from "@/shared/models/file/folder.model";

export const useProjectsStore = defineStore("projects", () => {
  // State
  const projectFolders = ref<IBasicFolder[]>([]);
  const currentProjectFolder = ref<IBasicFolder | null>(null);

  // Events
  const setProjects = (projects: IBasicFolder[]) => {
    projectFolders.value = projects;
  };

  const setCurrentProject = (project: IBasicFolder) => {
    currentProjectFolder.value = project;
  };

  return {
    // states
    projectFolders,
    currentProjectFolder,

    // events
    setProjects,
    setCurrentProject,
  };
});
