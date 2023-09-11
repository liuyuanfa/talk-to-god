import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import { createPinia } from "pinia";
import "ant-design-vue/dist/reset.css";
import "./assets/styles/common.less";

createApp(App).use(router).use(createPinia()).use(Antd).mount("#app");
