import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
  // State
  const pageTitle = ref("");

  // Events
  const setPageTitle = (title: string) => {
    pageTitle.value = title;
  };

  return {
    // states
    pageTitle,

    // events
    setPageTitle,
  };
});
