<template>
  <div class="container">
    <mt-navbar v-model="navbar">
      <mt-tab-item id="1">活动报名</mt-tab-item>
      <mt-tab-item id="2">多人拼团</mt-tab-item>
      <mt-tab-item id="3">全名砍价</mt-tab-item>
      <mt-tab-item id="4">幸运大转盘</mt-tab-item>
    </mt-navbar>

    <ul>
      <li>
        <div class="img">

        </div>

        <div class="content">
          <p class="title">
            答题赢Iphone | 合肥：中学生诗词大赛第二季来袭！
          </p>
          <!--6月22日至7月20日每周末，新华书店安徽图书城店邀您一同“赏选手风采，品诗词之魅”-->
          <p class="des">
            诗词是中华经典之精华，学生的教育离不开诗词的学习。为了让更多的学生朋友从小爱上诗词阅读，传承国学精粹...
          </p>
        </div>
      </li>
      <li>
        <div class="img">

        </div>

        <div class="content">
          <p class="title">
            答题赢Iphone | 合肥：中学生诗词大赛第二季来袭！
          </p>
          <!--6月22日至7月20日每周末，新华书店安徽图书城店邀您一同“赏选手风采，品诗词之魅”-->
          <p class="des">
            诗词是中华经典之精华，学生的教育离不开诗词的学习。为了让更多的学生朋友从小爱上诗词阅读，传承国学精粹...
          </p>
        </div>
      </li>
      <li>
        <div class="img">

        </div>

        <div class="content">
          <p class="title">
            答题赢Iphone | 合肥：中学生诗词大赛第二季来袭！
          </p>
          <!--6月22日至7月20日每周末，新华书店安徽图书城店邀您一同“赏选手风采，品诗词之魅”-->
          <p class="des">
            诗词是中华经典之精华，学生的教育离不开诗词的学习。为了让更多的学生朋友从小爱上诗词阅读，传承国学精粹...
          </p>
        </div>
      </li>
      <li>
        <div class="img">

        </div>

        <div class="content">
          <p class="title">
            答题赢Iphone | 合肥：中学生诗词大赛第二季来袭！
          </p>
          <!--6月22日至7月20日每周末，新华书店安徽图书城店邀您一同“赏选手风采，品诗词之魅”-->
          <p class="des">
            诗词是中华经典之精华，学生的教育离不开诗词的学习。为了让更多的学生朋友从小爱上诗词阅读，传承国学精粹...
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'activeList',
  data () {
    return {
      navbar: 1,
    }
  },
  created () {
    this.navbar = 1
  },
}
</script>

<style lang="less" scoped>
.container {
  ul {
    margin-top: -0.04rem;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    li {
      width: 93%;
      padding: 0 0.2rem;
      margin-top: 0.1rem;
      display: flex;
      justify-content: flex-start;
      border-bottom: solid 0.02rem rgba(228, 228, 228, 1);
      &:nth-child(1) {
        border-top: solid 0.02rem rgba(228, 228, 228, 1);
      }
      div.img {
        width: 2.4rem;
        height: 2.4rem;
        margin: 0.36rem 0.12rem;
        background: grey;
      }
      div.content {
        width: 4.8rem;
        height: 2.4rem;
        margin-left: 0.12rem;
        p.title {
          margin-top: 0.32rem;
          font-size: 0.32rem;
          font-weight: 600;

        }

        p.des {
          margin-top: 0.12rem;
          font-size: 0.28rem;
        }
      }
    }
  }
}
</style>
