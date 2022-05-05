import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/vite-plugin-vue-i18n/messages'

import './styles/base.css'
import 'virtual:windi.css'
import 'virtual:windi-devtools'

import { createPinia } from 'pinia'
import App from './App.vue'
import { Router } from '@/router'

const i18n = createI18n({
  locale: 'en',
  messages,
})

const app = createApp(App)
app.use(i18n)
app.use(createPinia())
app.use(Router)
app.mount('#app')
