<template>
  <div class="container">
    <div class="banner"></div>
    <div class="activeBar">
      <img src="@/assets/img/laba.png" alt="">
      <span>答题赢iPhone | 中学生诗词大赛来袭！</span>
    </div>
    <ul class="content">
      <li @click="routeTo('activeList')"><img src="@/assets/img/icon/active-icon.png" alt=""></li>
      <li @click="routeTo('courseList')"><img src="@/assets/img/icon/select-course-icon.png" alt=""></li>
      <li @click="routeTo('teacherList')"><img src="@/assets/img/icon/teacher-des-icon.png" alt=""></li>
      <li @click="routeTo('courseList')"><img src="@/assets/img/icon/feature-course-icon.png" alt=""></li>
      <li @click="message()"><img src="@/assets/img/icon/contact-icon.png" alt=""></li>
    </ul>
    <ul class="nav">
      <li @click="routeTo('index')">
        <p style="color: green">
          <i class="icon iconfont icon-home"></i>
        </p>
        <p>
          首页
        </p>
      </li>
      <li @click="routeTo('courseList')">
        <p>
          <i class="icon iconfont icon-xinrenkecheng"></i>
        </p>
        <p>
          选课
        </p>
      </li>
      <li @click="routeTo('courseList')">
        <p>
          <i class="icon iconfont icon-course"></i>
        </p>
        <p>
          我的课程
        </p>
      </li>
      <li @click="message()">
        <p>
          <i class="icon iconfont icon-wode"></i>
        </p>
        <p>
          我的
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import '@/assets/css/icon/iconfont.css'
export default {
  name: 'index',
  data () {
    return {
    }
  },
  methods: {
    routeTo(component){
      this.$router.push({
        name: component,
      })
    },
    message() {
      alert('玩命编码中，敬请期待！')
    }
  }
}
</script>

<style lang="less" scoped>
  .container {
    width: 100%;
    .banner {
      width: 100%;
      height: 6rem;
      background: url("../assets/img/indexBanner.jpg");
      background-size: 100% 100%;
    }
    .activeBar {
      width: 100%;
      height: 0.96rem;
      margin-top: 0.04rem;
      padding: 0 0.2rem;
      border: solid 0.02rem rgba(228, 228, 228, 1);
      background: white;
      font-size: 0.28rem;
      line-height: 0.96rem;
      img {
        width: 0.4rem;
        height: 0.4rem;
        position: relative;
        top: 0.1rem;
        left: 0.2rem;
      }
      span {
        padding-left: 0.2rem;
      }
    }
    .content {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      li {
        width: 2.5rem;
        height:2.5rem;
        border: solid 0.02rem rgba(228, 228, 228, 1);
        background: white;
        text-align: center;
        line-height: 2.5rem;
      }
    }
    .nav {
      width: 100%;
      height: 1.1rem;
      background: white;
      position: fixed;
      bottom: 0;
      left: 0;
      li {
        width: 25%;
        height: 100%;
        float: left;
        border-top: solid 0.02rem rgba(228, 228, 228, 1);
        text-align: center;
        p:nth-child(1) {
          margin-top: 0.01rem;
          font-size: 0.56rem;
        }
        p:nth-child(2) {
          font-size: 0.2rem;
        }
      }
    }
  }
</style>
