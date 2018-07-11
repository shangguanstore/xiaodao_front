<template>
  <div class="container">
    <div class="select">
      <div class="selectTitle">
        <p>
          年级
          <span class="triangle"></span>
        </p>
      </div>

      <div class="selectTitle">
        <p>
          科目
          <span class="triangle"></span>
        </p>
      </div>

      <div class="selectTitle">
        <p>
          班型
          <span class="triangle"></span>
        </p>
      </div>
    </div>
    <ul class="courseArea">
      <li @click="routeTo('courseDetail')">
        <p class="title">新初二语文暑假系统班-正在报名</p>
        <p class="time">7月14-8月12日·八年级</p>
        <div class="bottom">
          <div class="teachers">
            <img src="@/assets/img/teacher.jpg" alt="">
            <img src="@/assets/img/teacher2.jpg" alt="">
            <img src="@/assets/img/teacher3.jpg" alt="">
          </div>
          <div class="important">
            <p class="price">¥ 499</p>
          </div>
        </div>
      </li>
      <li @click="routeTo('courseDetail')">
        <p class="title">新初二语文暑假系统班-正在报名</p>
        <p class="time">7月14-8月12日·八年级</p>
        <div class="bottom">
          <div class="teachers">
            <img src="@/assets/img/teacher.jpg" alt="">
            <img src="@/assets/img/teacher2.jpg" alt="">
            <img src="@/assets/img/teacher3.jpg" alt="">
          </div>
          <div class="important">
            <p class="price">¥ 499</p>
          </div>
        </div>
      </li>
      <li @click="routeTo('courseDetail')">
        <p class="title">新初二语文暑假系统班-正在报名</p>
        <p class="time">7月14-8月12日·八年级</p>
        <div class="bottom">
          <div class="teachers">
            <img src="@/assets/img/teacher.jpg" alt="">
            <img src="@/assets/img/teacher2.jpg" alt="">
            <img src="@/assets/img/teacher3.jpg" alt="">
          </div>
          <div class="important">
            <p class="price">¥ 499</p>
          </div>
        </div>
      </li>
      <li @click="routeTo('courseDetail')">
        <p class="title">新初二语文暑假系统班-正在报名</p>
        <p class="time">7月14-8月12日·八年级</p>
        <div class="bottom">
          <div class="teachers">
            <img src="@/assets/img/teacher.jpg" alt="">
            <img src="@/assets/img/teacher2.jpg" alt="">
            <img src="@/assets/img/teacher3.jpg" alt="">
          </div>
          <div class="important">
            <p class="price">¥ 499</p>
          </div>
        </div>
      </li>
      <li @click="routeTo('courseDetail')">
        <p class="title">新初二语文暑假系统班-正在报名</p>
        <p class="time">7月14-8月12日·八年级</p>
        <div class="bottom">
          <div class="teachers">
            <img src="@/assets/img/teacher.jpg" alt="">
            <img src="@/assets/img/teacher2.jpg" alt="">
            <img src="@/assets/img/teacher3.jpg" alt="">
          </div>
          <div class="important">
            <p class="price">¥ 499</p>
          </div>
        </div>
      </li>
      <li @click="routeTo('courseDetail')">
        <p class="title">新初二语文暑假系统班-正在报名</p>
        <p class="time">7月14-8月12日·八年级</p>
        <div class="bottom">
          <div class="teachers">
            <img src="@/assets/img/teacher.jpg" alt="">
            <img src="@/assets/img/teacher2.jpg" alt="">
            <img src="@/assets/img/teacher3.jpg" alt="">
          </div>
          <div class="important">
            <p class="price">¥ 499</p>
          </div>
        </div>
      </li>
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
      <li @click="routeTo('courseDetail')">
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
  font-family: "Microsoft YaHei";
  div.select {
    width: 100%;
    overflow: hidden;
    background: white;
    font-size: 14px;
    div.selectTitle {
      margin: 0 32px;
      float: left;
      position: relative;
      &:nth-child(1) {
        margin: 0 10px;
      }
      p {
        padding: 12px 16px;
        height: 41px;
        span.triangle {
          position: absolute;
          top: -6px;
          left: 33px;
          width:0;
          height:0;
          border-width:6px 6px 0;
          border-style:solid;
          border-color:black transparent transparent;/*灰 透明 透明 */
          margin:40px auto;
          position:relative;
        }
      }
    }
  }
  ul.courseArea {
    margin-top: -2px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    li {
      width: 93%;
      padding: 0 10px;
      margin-top: 20px;
      border: solid 1px rgba(228, 228, 228, 1);
      box-shadow: 0 0 25px rgba(228, 228, 228, 1);
      p.title {
        margin: 14px 0;
        font-weight: 700;
        font-size: 16px;
      }
      p.time {
        margin: 12px 0;
        color: #6D6D6D;
      }
      div.bottom {
        overflow: hidden;
        margin-top: 40px;
        margin-bottom: 15px;
        div.teachers {
          float: left;
          img {
            width: 35px;
            height: 35px;
            border-radius: 17.5px;
            margin: 0 4px;
            &:nth-child(1) {
              margin: 0;
            }
          }
        }
        div.important {
          float: right;
          p.price {
            margin-top: 6px;
            color: #55a532;
          }
        }
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
      /*display: none;*/
      width: 25%;
      height: 55px;
      float: left;
      /*border: solid 1px rgba(228, 228, 228, 1);*/
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
