import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import MultiTabSwiper from "../packages/index";

let app = createApp(App);
app.use(MultiTabSwiper);
app.mount("#app");
