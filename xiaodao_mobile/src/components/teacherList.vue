<template>
  <div class="container">
    <ul>
      <li>
        <div>
          <img src="@/assets/img/teacher.jpg" alt="">
          <p>李颖</p>
        </div>
        <p class="abstract">简介：专业从事初中语文的教学和命题</p>
      </li>

      <li>
        <div>
          <img src="@/assets/img/teacher.jpg" alt="">
          <p>李颖</p>
        </div>
        <p class="abstract">简介：专业从事初中语文的教学和命题</p>
      </li>

      <li>
        <div>
          <img src="@/assets/img/teacher.jpg" alt="">
          <p>李颖</p>
        </div>
        <p class="abstract">简介：专业从事初中语文的教学和命题</p>
      </li>

      <li>
        <div>
          <img src="@/assets/img/teacher.jpg" alt="">
          <p>李颖</p>
        </div>
        <p class="abstract">简介：专业从事初中语文的教学和命题</p>
      </li>

      <li>
        <div>
          <img src="@/assets/img/teacher.jpg" alt="">
          <p>李颖</p>
        </div>
        <p class="abstract">简介：专业从事初中语文的教学和命题</p>
      </li>

      <li>
        <div>
          <img src="@/assets/img/teacher.jpg" alt="">
          <p>李颖</p>
        </div>
        <p class="abstract">简介：专业从事初中语文的教学和命题</p>
      </li>

      <li>
        <div>
          <img src="@/assets/img/teacher.jpg" alt="">
          <p>李颖</p>
        </div>
        <p class="abstract">简介：专业从事初中语文的教学和命题</p>
      </li>

      <li>
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
      width: 176px;
      margin: 10px 5px;
      &:nth-child(1){
        margin: 2px 5px;
      }
      &:nth-child(2){
        margin: 2px 5px;
      }
      div {
        height: 114px;
        background: grey;
        text-align: center;
        img {
          width: 60px;
          height: 60px;
          display: inline-block;
          margin-top: 20px;
          border-radius: 30px;
        }
      }
      p.abstract {
        height: 50px;
        padding: 3px 10px;
        font-size: 14px;
        background: white;
      }

    }
  }
}
</style>
