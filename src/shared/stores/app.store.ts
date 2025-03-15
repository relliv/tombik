import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
  // State
  const pageTitle = ref("");
  const pageDescription = ref("");

  // Events
  const setPageTitle = (title: string, description: string | null = null) => {
    pageTitle.value = title;
    pageDescription.value = description || "";
  };

  return {
    // states
    pageTitle,
    pageDescription,

    // events
    setPageTitle,
  };
});
