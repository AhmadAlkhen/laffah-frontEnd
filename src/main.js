/* eslint-disable import/order */

import '@/@fake-db/db'
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import ability from '@/plugins/casl/ability'
import i18n from '@/plugins/i18n'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import { abilitiesPlugin } from '@casl/vue'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import 'sweetalert2/dist/sweetalert2.min.css'
import VueViewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import { createApp } from 'vue'
import VueSweetalert2 from 'vue-sweetalert2'
import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"
export const pusher_key = "d0bf58ecdb684e1b98d7";
export const pusher_authEndpoint = "http://localhost:8000/broadcasting/auth";


// import store from './store'
loadFonts()
const isDev = process.env.NODE_ENV !== 'production'

const pinia = createPinia({
  dev: isDev,
})

// Create vue app
const app = createApp(App)


// Use plugins
app.use(VueViewer)
app.use(vuetify)
app.use(pinia)
app.use(router)
app.use(layoutsPlugin)
app.use(i18n)
// app.use(store)
app.use(Toast);
app.use(VueSweetalert2);


app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
})


// Mount vue app
app.mount('#app')
