import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueFeather from 'vue-feather'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component(VueFeather.name, VueFeather);
app.mount('#app')
