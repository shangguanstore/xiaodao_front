<template>
  <div class="container">
    <div class="banner" @click="console">

    </div>
    <div class="content">
      <mt-navbar v-model="navbar">
        <mt-tab-item id="1">介绍</mt-tab-item>
        <mt-tab-item id="2">评价</mt-tab-item>
        <mt-tab-item id="3">课程</mt-tab-item>
      </mt-navbar>

      <ul class="introduce">
        <li>
          <p class="title">教学经历</p>
          <ul class="des">
            <li class="item">
              <span class="dot">● </span>
              <p>2017年6月-2018年7月</p>
              <p>初中英语教师</p>
            </li>
            <li class="item">
              <span class="dot">● </span>
              <p>2017年6月-2018年7月</p>
              <p>初中英语教师</p>
            </li>
          </ul>
        </li>

        <li>
          <p class="title">教学成果</p>
          <div class="des">
            学生英语兴趣提高,高考状元无数。学生英语兴趣提高,高考状元无数学生英语兴趣提高,高考状元无数学生英语兴趣提高,高考状元无数学生英语兴趣提高,高考状元无数
          </div>
        </li>

        <li>
          <p class="title">教学特点</p>
          <div class="des">
            学生英语兴趣提高,高考状元无数。学生英语兴趣提高,高考状元无数学生英语兴趣提高,高考状元无数学生英语兴趣提高,高考状元无数学生英语兴趣提高,高考状元无数
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'teacher',
  data () {
    return {
      navbar: 1
    }
  },
  methods: {
    console() {
      console.log('navbar',this.navbar)
      this.navbar = 2
    }
  }
}
</script>

<style lang="less" scoped>
  .container {
    font-family: 'Microsoft YaHei';
    width: 100%;
    .banner {
      width: 100%;
      height: 4.4rem;
      background: url("../assets/img/teacherBanner.jpg");
      background-size: 100% 100%;
    }
    .content {
      ul.introduce {
        li {
          margin: 0.4rem 0.2rem;
          p.title {
            font-weight: 700;
            font-size: 0.36rem;
          }
          ul.des {
            font-size: 0.28rem;
            li.item {
              position: relative;
              padding-left: 0.38rem;
              span {
                position: absolute;
                top: 0;
                left: -0.14rem;
                color: #55a532;
              }
            }
          }
          div.des {
            font-size: 0.28rem;
            margin-top: 0.4rem;
          }
        }
      }
    }
  }
</style>
