import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/reg',
      name: 'reg',
      component: () => import('@/pages/reg')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login')
    },
    {
      path: '/',
      name: 'main',
      component: () => import('@/pages/main'),
      redirect: '/admin',
      children: [
        {
          path: '/',
          name: 'admin',
          component: () => import('@/pages/admin')
        },
        {
          path: '/studentList',
          name: 'studentList',
          component: () => import('@/pages/studentList')
        },
        {
          path: '/teacherList',
          name: 'teacherList',
          component: () => import('@/pages/teacherList')
        },
        {
          path: '/courseList',
          name: 'courseList',
          component: () => import('@/pages/courseList')
        },
        {
          path: '/courseEdit',
          name: 'courseEdit',
          component: () => import('@/pages/courseEdit')
        },
        {
          path: '/company',
          name: 'company',
          component: () => import('@/pages/company')
        },
      ]
    }
  ]
})
