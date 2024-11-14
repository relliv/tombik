/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface Window {
  // expose in the `electron/preload/index.ts`
  ipcRenderer: import("electron").IpcRenderer;
}

declare module "vue-ellipse-progress" {
  export interface EllipseProgressProps {
    progress: number;
  }
}

declare module "node-ray/web" {
  export interface Ray {
    (label: string, ...data: any[]): void;
  }

  export const ray: Ray;
}
