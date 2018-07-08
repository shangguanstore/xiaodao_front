<template>
  <div class="container">
    <div class="banner"></div>
    <div class="activeBar"></div>
    <ul class="content">
      <li>活动公告</li>
      <li>选课</li>
      <li>老师介绍</li>
      <li>特色课程</li>
      <li>联系我们</li>
    </ul>
    <ul class="nav">
      <li>
        <p style="color: green">
          <i class="icon iconfont icon-home"></i>
        </p>
        <p>
          首页
        </p>
      </li>
      <li>
        <p>
          <i class="icon iconfont icon-xinrenkecheng"></i>
        </p>
        <p>
          选课
        </p>
      </li>
      <li>
        <p>
          <i class="icon iconfont icon-course"></i>
        </p>
        <p>
          我的课程
        </p>
      </li>
      <li>
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
  }
}
</script>

<style lang="less" scoped>
  .container {
    width: 100%;
    .banner {
      width: 100%;
      height: 320px;
      background: grey;
    }
    .activeBar {
      width: 100%;
      height: 48px;
      margin-top: 2px;
      border: solid 1px rgba(228, 228, 228, 1);
    }
    .content {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      li {
        width: 125px;
        height: 125px;
        border: solid 1px rgba(228, 228, 228, 1);
        text-align: center;
        line-height: 125px;
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
        border: solid 1px rgba(228, 228, 228, 1);
        text-align: center;
        p:nth-child(1) {
          margin-top: 6px;
          font-size: 23px;
        }
        p:nth-child(2) {
          font-size: 12px;
        }
      }
    }
  }
</style>
