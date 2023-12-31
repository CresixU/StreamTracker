import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from "vue3-apexcharts";

import './assets/main.scss'
import './index.css'

const app = createApp(App)

app.use(VueApexCharts);
app.use(router)

app.mount('#app')
