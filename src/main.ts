import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import veProgress from "vue-ellipse-progress";
import router from "./routes/app.routes";

import "./demos/ipc";
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(veProgress);

app.mount("#app").$nextTick(() => {
  postMessage({ payload: "removeLoading" }, "*");
});
