import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import AlbumListPage from './pages/AlbumListPage.vue'
import AlbumPhotosPage from './pages/AlbumPhotosPage.vue'
import TestGridPage from './pages/TestGridPage.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const pinia = createPinia()

const routes = [
  { path: '/', name: 'AlbumList', component: AlbumListPage },
  { path: '/album/:albumId/photos', name: 'AlbumPhotos', component: AlbumPhotosPage },
  { path: '/test-grid', name: 'TestGrid', component: TestGridPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')

AOS.init()
