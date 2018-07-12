<template>
  <div class="container">
    <ul>
      <li @click="routeTo('teacher')">
        <div>
          <img src="@/assets/img/teacher.jpg" alt="">
          <p>李颖</p>
        </div>
        <p class="abstract">简介：专业从事初中语文的教学和命题</p>
      </li>
      <li @click="routeTo('teacher')">
        <div>
          <img src="@/assets/img/teacher.jpg" alt="">
          <p>李颖</p>
        </div>
        <p class="abstract">简介：专业从事初中语文的教学和命题</p>
      </li>
      <li @click="routeTo('teacher')">
        <div>
          <img src="@/assets/img/teacher.jpg" alt="">
          <p>李颖</p>
        </div>
        <p class="abstract">简介：专业从事初中语文的教学和命题</p>
      </li>
      <li @click="routeTo('teacher')">
        <div>
          <img src="@/assets/img/teacher.jpg" alt="">
          <p>李颖</p>
        </div>
        <p class="abstract">简介：专业从事初中语文的教学和命题</p>
      </li>
      <li @click="routeTo('teacher')">
        <div>
          <img src="@/assets/img/teacher.jpg" alt="">
          <p>李颖</p>
        </div>
        <p class="abstract">简介：专业从事初中语文的教学和命题</p>
      </li>
      <li @click="routeTo('teacher')">
        <div>
          <img src="@/assets/img/teacher.jpg" alt="">
          <p>李颖</p>
        </div>
        <p class="abstract">简介：专业从事初中语文的教学和命题</p>
      </li>
      <li @click="routeTo('teacher')">
        <div>
          <img src="@/assets/img/teacher.jpg" alt="">
          <p>李颖</p>
        </div>
        <p class="abstract">简介：专业从事初中语文的教学和命题</p>
      </li>
      <li @click="routeTo('teacher')">
        <div>
          <img src="@/assets/img/teacher.jpg" alt="">
          <p>李颖</p>
        </div>
        <p class="abstract">简介：专业从事初中语文的教学和命题</p>
      </li>
      <li @click="routeTo('teacher')">
        <div>
          <img src="@/assets/img/teacher.jpg" alt="">
          <p>李颖</p>
        </div>
        <p class="abstract">简介：专业从事初中语文的教学和命题</p>
      </li>
      <li @click="routeTo('teacher')">
        <div>
          <img src="@/assets/img/teacher.jpg" alt="">
          <p>李颖</p>
        </div>
        <p class="abstract">简介：专业从事初中语文的教学和命题</p>
      </li>
      <li @click="routeTo('teacher')">
        <div>
          <img src="@/assets/img/teacher.jpg" alt="">
          <p>李颖</p>
        </div>
        <p class="abstract">简介：专业从事初中语文的教学和命题</p>
      </li>
    </ul>
  </div>

</template>

<script>
export default {
  name: 'teacherList',
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
  }
}
</script>

<style lang="less" scoped>
.container {
  font-family: 'Microsoft YaHei';
  ul {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    li {
      width: 3.52rem;
      margin: 0.2rem 0.1rem;
      &:nth-child(1){
        margin: 0.04rem 0.1rem;
      }
      &:nth-child(2){
        margin: 0.04rem 0.1rem;
      }
      div {
        height: 2.28rem;
        background: rgba(0,0,0,0.2);
        text-align: center;
        img {
          width: 1.2rem;
          height: 1.2rem;
          display: inline-block;
          margin-top: 0.4rem;
          border-radius: 0.6rem;
        }
      }
      p.abstract {
        height: 1rem;
        padding: 0.06rem 0.2rem;
        font-size: 0.28rem;
        background: white;
      }

    }
  }
}
</style>
