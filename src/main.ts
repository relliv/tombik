import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import veProgress from "vue-ellipse-progress";
import router from "./routes/app.routes";

// #region Markdown Editor

import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';

import Prism from 'prismjs';

// #endregion

import "./demos/ipc";

import { Ray, ray } from "node-ray/web";

window.ray = ray;

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});

// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(veProgress);
app.use(VueMarkdownEditor);

app.mount("#app").$nextTick(() => {
  postMessage({ payload: "removeLoading" }, "*");
});
