import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
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
        name: 'index',
        component: () => import('@/pages/index'),
        redirect: '/login',
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('@/pages/main'),
      redirect: '/admin',
      children: [
        {
          path: '/admin',
          name: 'admin',
          component: () => import('@/pages/admin')
        },
        {
          path: '/student',
          name: 'student',
          component: () => import('@/pages/student')
        },
        {
            path: '/studentEdit',
            name: 'studentEdit',
            component: () => import('@/pages/studentEdit')
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
        {
            path: '/staff',
            name: 'staff',
            component: () => import('@/pages/staff')
        },
        {
            path: '/staffEdit',
            name: 'staffEdit',
            component: () => import('@/pages/staffEdit')
        },
        {
            path: '/activity',
            name: 'activity',
            component: () => import('@/pages/activity')
        },
        {
            path: '/activityEdit',
            name: 'activityEdit',
            component: () => import('@/pages/activityEdit')
        },
          {
              path: '/activityOrder',
              name: 'activityOrder',
              component: () => import('@/pages/activityOrder')
          },
        {
          path: '/weWebsite',
          name: 'weWebsite',
          component: () => import('@/pages/weWebsite')
        },
          {
              path: '/weWebsiteBannerEdit',
              name: 'weWebsiteBannerEdit',
              component: () => import('@/pages/weWebsiteBannerEdit')
          },
          {
              path: '/pointEdit',
              name: 'pointEdit',
              component: () => import('@/pages/pointEdit')
          },
          {
              path: '/pointDetail',
              name: 'pointDetail',
              component: () => import('@/pages/pointDetail')
          },
          {
              path: '/userPoint',
              name: 'userPoint',
              component: () => import('@/pages/userPoint')
          },
      ]
    }
  ]
})
