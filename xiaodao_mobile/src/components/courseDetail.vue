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
          <li>
            <img src="@/assets/img/teacher.jpg" alt="">
            <div>
              <p class="teacherName">谭正</p>
              <p class="teacherTag">授课老师</p>
            </div>
          </li>
          <li>
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
      <li class="addCart">加入选课单</li>
      <li class="pay">立即报名</li>
    </ul>
  </div>
</template>

<script>
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
  font-size: 14px;
  .banner {
    width: 100%;
    height: 220px;
    background: grey;
  }
  .detail {
    padding: 0 15px;
    div.intro {
      p {
        margin: 10px 0;
        &.title {
          margin: 14px 0;
          font-weight: 700;
          font-size: 18px;
          .tag {
            padding: 1px 2px;
            position: relative;
            bottom: 3px;
            font-size: 12px;
            background: #E6BC79;
            border-radius: 2px;
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
        margin-top: 36px;
        overflow: hidden;
        li {
          float: left;
          display: flex;
          justify-content: flex-start;
          &:nth-child(2) {
            margin-left: 15px;
          }
          img {
            width: 55px;
            height: 55px;
            border-radius: 27.5px;
            margin: 0 4px;
            &:nth-child(1) {
              margin: 0;
            }
          }
          div {
            margin-left: 8px;
            .teacherName {
              margin: 6px 6px;
              font-weight: 500;
              font-size: 16px;
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
      margin-top: 50px;
      h3 {

      }
    }

    div.more {
      margin-top: 18px;

    }
  }

  ul.bottom {
    width: 100%;
    height: 60px;
    position: fixed;
    left: 0;
    bottom: 0;
    font-weight: 700;
    color: white;
    font-size: 16px;
    text-align: center;
    line-height: 60px;
    overflow: hidden;
    li {
      float: left;
      &.cart {
        width: 20%;
        height: 100%;
        color: black;
        font-size: 14px;
        font-weight: 400;
        background: white;
        border-top: solid 1px rgba(228, 228, 228, 1);
      }
      &.addCart {
        width: 40%;
        height: 100%;
        background: #FFB121;
      }
      &.pay {
        width: 40%;
        height: 100%;
        background: #FF7400;
      }
    }
  }
}
</style>
