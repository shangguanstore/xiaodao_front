<template>
  <div class="container homeContainer">
    <!--<div class="banner" style="background-image: url('../../assets/img/indexBanner.jpg');background-size: 100% 100%;"></div>-->
    <div class="activeBar">
      <img src="../../assets/img/laba.png" alt="">
      <span>答题赢iPhone | 中学生诗词大赛来袭！</span>
    </div>
    <ul class="content">
      <li @click="routeTo('activeList')">
        <img src="../../assets/img/icon/active-icon.png" alt="" style="border: solid 1px red;background: red;width: 125px;height: 125px;">
      </li>
      <li @click="routeTo('courseList')"><img src="../../assets/img/icon/select-course-icon.png" alt=""></li>
      <li @click="routeTo('teacherList')"><img src="../../assets/img/icon/teacher-des-icon.png" alt=""></li>
      <li @click="routeTo('courseList')"><img src="../../assets/img/icon/feature-course-icon.png" alt=""></li>
      <li @click="message()"><img src="../../assets/img/icon/contact-icon.png" alt=""></li>
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

import '../../assets/css/icon/iconfont.css'
export default {
  data () {
    return {
    }
  },
  components: {
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
  },
  created () {

  }
}
</script>

<style lang="less">
  .homeContainer {
    width: 375px;
    .banner {
      width: 100%;
      height: 300px;
    }
    .activeBar {
      width: 100%;
      height: 48px;
      margin-top: 2px;
      padding: 0 10px;
      border: solid 1px rgba(228, 228, 228, 1);
      background: white;
      font-size: 14px;
      line-height: 48px;
      img {
        width: 20px;
        height: 20px;
        position: relative;
        top: 5px;
        left: 10px;
      }
      span {
        padding-left: 10px;
      }
    }
    .content {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      li {
        width: 124px;
        height:124px;
        border-right: solid 1px rgba(228, 228, 228, 1);
        border-bottom: solid 1px rgba(228, 228, 228, 1);
        background: white;
        text-align: center;
        line-height: 125px;
        &:last-child {
        }
      }
    }
    .nav {
      width: 100%;
      height: 55px;
      background: white;
      position: fixed;
      bottom: 0;
      left: 0;
      li {
        width: 25%;
        height: 100%;
        float: left;
        border-top: solid 1px rgba(228, 228, 228, 1);
        text-align: center;
        p:nth-child(1) {
          margin-top: 10px;
          font-size: 28px;
        }
        p:nth-child(2) {
          font-size: 10px;
        }
      }
    }
  }
</style>

