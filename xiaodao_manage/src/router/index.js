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
      path: '/apply',
      name: 'apply',
      component: () => import('@/pages/apply')
    },
    {
      path: '/applySuccess',
      name: 'applySuccess',
      component: () => import('@/pages/applySuccess')
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
          path: '/home',
          name: 'home',
          component: () => import('@/pages/home')
        },
        {
          path: '/student',
          name: 'student',
          component: () => import('@/pages/student')
        },
        {
          path: '/client',
          name: 'client',
          component: () => import('@/pages/client')
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
          path: '/groupon',
          name: 'groupon',
          component: () => import('@/pages/groupon')
        },
        {
          path: '/trialClass',
          name: 'trialClass',
          component: () => import('@/pages/trialClass')
        },
        {
          path: '/lottery',
          name: 'lottery',
          component: () => import('@/pages/lottery')
        },
        {
          path: '/lotteryEdit',
          name: 'lotteryEdit',
          component: () => import('@/pages/lotteryEdit')
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
          path: '/homeActivity',
          name: 'homeActivity',
          component: () => import('@/pages/homeActivity')
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
        {
          path: '/class',
          name: 'class',
          component: () => import('@/pages/class')
        },
        {
          path: '/classDetail',
          name: 'classDetail',
          component: () => import('@/pages/classDetail')
        },
        {
          path: '/courseFee',
          name: 'courseFee',
          component: () => import('@/pages/courseFee')
        },
        {
          path: '/ruleSetting',
          name: 'ruleSetting',
          component: () => import('@/pages/ruleSetting')
        },
        {
          path: '/teacherEdit',
          name: 'teacherEdit',
          component: () => import('@/pages/teacherEdit')
        },
        {
          path: '/coursetable',
          name: 'coursetable',
          component: () => import('@/pages/coursetable')
        },
        {
          path: '/purchase',
          name: 'purchase',
          component: () => import('@/pages/purchase')
        },
        {
          path: '/attendance',
          name: 'attendance',
          component: () => import('@/pages/attendance')
        },
      ]
    }
  ]
})
