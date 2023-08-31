import { createRouter, createWebHistory } from 'vue-router'
import CommentView from '../views/CommentView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'comments',
      component: CommentView
    }
  ]
})

export default router
