<template>
  <div class="container">
    <div class="banner">

    </div>

    <div class="detail">
      <div class="intro">
        <p class="title">
          <span class="tag">系统提高班</span>
          &nbsp;新初二语文暑假系统班(每天19:00)
        </p>
        <p class="time">
          7月14-8月12日·每天19点上课
        </p>
        <p class="price">
          ¥ 499
        </p>
        <p class="regNum">
          剩余6个名额
        </p>
        <ul class="teachers">
          <li @click="routeTo('teacher')">
            <img src="@/assets/img/teacher.jpg" alt="">
            <div>
              <p class="teacherName">谭正</p>
              <p class="teacherTag">授课老师</p>
            </div>
          </li>
          <li @click="routeTo('teacher')">
            <img src="@/assets/img/teacher2.jpg" alt="">
            <div>
              <p class="teacherName">孙小红</p>
              <p class="teacherTag">辅助老师</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="outline">
        <h3>课程大纲</h3>
        .........
      </div>

      <div class="more">
        <h3>课程详情</h3>
        .........
      </div>
    </div>

    <ul class="bottom">
      <li class="cart">
        <i class="icon iconfont icon-gouwuchekong"></i>
        选课单
      </li>
      <li class="addCart" @click="message">加入选课单</li>
      <li class="pay" @click="message">立即报名</li>
    </ul>
  </div>
</template>

<script>
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
  font-size: 0.28rem;
  .banner {
    width: 100%;
    height: 4.4rem;
    background: url("../assets/img/courseBanner.jpg");
    background-size: 100% 100%;
  }
  .detail {
    padding: 0 0.3rem;
    div.intro {
      p {
        margin: 0.2rem 0;
        &.title {
          margin: 0.28rem 0;
          font-weight: 700;
          font-size: 0.36rem;
          .tag {
            padding: 0.02rem 0.04rem;
            position: relative;
            bottom: 0.06rem;
            font-size: 0.24rem;
            background: #E6BC79;
            border-radius: 0.04rem;
            color: white;
            font-weight: 500;
          }
        }
        &.time {
          color: #6D6D6D;
        }
        &.price {
          color: #55a532;
        }
        &.regNum {
          color: #6D6D6D;
        }
      }

      ul.teachers {
        margin-top: 0.72rem;
        overflow: hidden;
        li {
          float: left;
          display: flex;
          justify-content: flex-start;
          &:nth-child(2) {
            margin-left: 0.3rem;
          }
          img {
            width: 1.1rem;
            height: 1.1rem;
            border-radius: 0.55rem;
            margin: 0 0.08rem;
            &:nth-child(1) {
              margin: 0;
            }
          }
          div {
            margin-left: 0.16rem;
            .teacherName {
              margin: 0.12rem 0.12rem;
              font-weight: 500;
              font-size: 0.32rem;
            }
            .teacherTag {
              margin: 0;
              color: #6D6D6D;
            }
          }
        }
      }
    }
    div.outline {
      margin-top: 1rem;
      h3 {

      }
    }

    div.more {
      margin-top: 0.36rem;

    }
  }

  ul.bottom {
    width: 100%;
    height: 1.2rem;
    position: fixed;
    left: 0;
    bottom: 0;
    font-weight: 700;
    color: white;
    font-size: 0.32rem;
    text-align: center;
    line-height: 1.2rem;
    overflow: hidden;
    li {
      float: left;
      &.cart {
        width: 20%;
        height: 100%;
        color: black;
        font-size: 0.28rem;
        font-weight: 400;
        background: white;
        border-top: solid 0.02rem rgba(228, 228, 228, 1);
      }
      &.addCart {
        width: 40%;
        height: 100%;
        background: RGBA(96,198,240,1);
      }
      &.pay {
        width: 40%;
        height: 100%;
        background: RGBA(54,150,218,1);
      }
    }
  }
}
</style>
