import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import teacher from '@/components/teacher'
import teacherList from '@/components/teacherList'
import courseList from '@/components/courseList'
import activeList from '@/components/activeList'
import courseDetail from '@/components/courseDetail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/teacher',
      name: 'teacher',
      component: teacher
    },
    {
      path: '/teacherList',
      name: 'teacherList',
      component: teacherList
    },
    {
      path: '/courseList',
      name: 'courseList',
      component: courseList
    },
    {
      path: '/activeList',
      name: 'activeList',
      component: activeList
    },
    {
      path: '/courseDetail',
      name: 'courseDetail',
      component: courseDetail
    },
  ]
})
