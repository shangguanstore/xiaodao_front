import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('@/components/main'),
      redirect: '/admin',
      children: [
        {
          path: '/',
          name: 'admin',
          component: () => import('@/components/admin')
        }
      ]
    }
  ]
})
