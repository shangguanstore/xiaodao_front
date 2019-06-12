<template>
  <Content :style="{padding: '0 27px 27px 27px'}">
    <div class="container home_container mt20">
      <div class="top mt20">
        <Row :gutter="24">
          <Col span="8">
            <ul class="one">
              <li class="title">今日营收</li>
              <li class="value">¥ 3800</li>
              <li class="des">
                <p class="text fl">本月营收&nbsp;&nbsp;&nbsp;&nbsp; ¥ 240137.13</p>
                <p class="icon fr">
                  <i class="icon iconfont icon-data06" style="font-size: 45px"></i>
                </p>
              </li>
            </ul>
          </Col>
          <Col span="8">
          <ul class="two">
            <li class="title">今日用户</li>
            <li class="value">4</li>
            <li class="des">
              <p class="text fl">本月用户&nbsp;&nbsp;16</p>
              <p class="icon fr">
                <i class="icon iconfont icon-icons-" style="font-size: 45px"></i>
              </p>
            </li>
          </ul>
          </Col>
          <Col span="8">
          <ul class="three">
            <li class="title">今日报名</li>
            <li class="value">2</li>
            <li class="des">
              <p class="text fl">本月报名&nbsp;&nbsp; 10</p>
              <p class="icon fr">
                <i class="icon iconfont icon-xiadanshijian" style="font-size: 45px"></i>
              </p>
            </li>
          </ul>
          </Col>
        </Row>
      </div>

      <div class="middle mt20">
        <Row :gutter="24">
          <Col span="8">
            <Card>
              <p slot="title">
                <Icon type="ios-help-buoy" />
                最新活动
              </p>
              <span slot="extra" @click.prevent="viewMore" style="cursor: pointer">
                更多
                <Icon type="ios-arrow-forward" />
              </span>
              <ul class="activityContentList">
                <li v-for="item in activityList" class="float-wrap">
                  <div class="fl float-wrap">
                    <div class="tag fl">
                      <Tag color="#ED5565" v-if="item.type == config.Activity.TYPE_GROUPON">拼团</Tag>
                      <Tag color="#FABF2D" v-if="item.type == config.Activity.TYPE_NORMAL">活动</Tag>
                      <Tag color="#0CC3AA" v-if="item.type == config.Activity.TYPE_COURSE">课程</Tag>
                      <Tag color="#FFA2D3" v-if="item.type == config.Activity.TYPE_LOTTERY">抽奖</Tag>
                    </div>
                    <div class="itemContent ml10 fr" style="cursor: pointer">
                      <p>{{item.name}}</p>
                      <p style="color: #999999">已参加：{{item.orderNum}}人</p>
                    </div>
                  </div>

                  <div class="fr">
                    {{item.create_time_md_format}}
                  </div>
                </li>
              </ul>
            </Card>
          </Col>
          <Col span="8">
            <Card>
            <p slot="title">
              <Icon type="ios-film-outline"></Icon>
              最新订单
            </p>
            <span slot="extra" @click.prevent="viewMore" style="cursor: pointer">
                更多
                <Icon type="ios-arrow-forward" />
              </span>
            <ul class="activityContentList">
              <li v-for="item in orderList" class="float-wrap">
                <div class="fl float-wrap">
                  <div class="itemContent ml10 fr" style="cursor: pointer">
                    <p>{{item.name}}</p>
                    <p style="color: #999999">{{item.uname}}</p>
                  </div>
                </div>

                <div class="fr">
                  {{item.create_time_md_format}}
                </div>
              </li>
            </ul>
          </Card>
          </Col>
          <Col span="8">
            <Card>
            <p slot="title">
              <i class="iconfont icon icon-icon-shortcut" style="color: #999"></i>
              快捷入口
            </p>
            <ul class="quickList float-wrap">
              <Row>
                <Col span="8">
                  <li>
                    <div class="icon">
                      <i class="iconfont icon icon-tianjiayonghu" style="font-size: 40px;color: #999;"></i>
                    </div>
                    <div class="des">
                      添加用户
                    </div>
                  </li>
                </Col>
                <Col span="8">
                  <li>
                    <div class="icon">
                      <i class="iconfont icon icon-pintuanzhuanqu" style="font-size: 40px;color: #999;"></i>
                    </div>
                    <div class="des">
                      新增团购
                    </div>
                  </li>
                </Col>
                <Col span="8">
                  <li>
                    <div class="icon">
                      <i class="iconfont icon icon-activity_icon" style="font-size: 40px;color: #999;"></i>
                    </div>
                    <div class="des">
                      发布活动
                    </div>
                  </li>
                </Col>
              </Row>
              <Row>
                <Col span="8">
                <li>
                  <div class="icon">
                    <i class="iconfont icon icon-chanpinjieshao" style="font-size: 40px;color: #999;"></i>
                  </div>
                  <div class="des">
                    课程介绍
                  </div>
                </li>
                </Col>
                <Col span="8">
                <li>
                  <div class="icon">
                    <i class="iconfont icon icon-choujiang" style="font-size: 40px;color: #999;"></i>
                  </div>
                  <div class="des">
                    抽奖游戏
                  </div>
                </li>
                </Col>
                <Col span="8">
                <li>
                  <div class="icon">
                    <i class="iconfont icon icon-ziyuan" style="font-size: 40px;color: #999;"></i>
                  </div>
                  <div class="des">
                    积分设置
                  </div>
                </li>
                </Col>
              </Row>
              <Row>
                <Col span="8">
                <li>
                  <div class="icon">
                    <i class="iconfont icon icon-jifen" style="font-size: 40px;color: #999;"></i>
                  </div>
                  <div class="des">
                    用户积分
                  </div>
                </li>
                </Col>
              </Row>
            </ul>
          </Card>
          </Col>
        </Row>
      </div>
    </div>
  </Content>
</template>

<script>
  import '@/assets/css/iconfont/iconfont.css'
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'

  export default {
    name: 'admin',
    data() {
      return {
        config: {},
        activityList: [],
        activityLoading: true,
        orderList: [],
        orderLoading: true,
      }
    },
    created() {
      this.config = config
      this.getActivityList({
        pageIndex: 1,
        pageSize: 6
      })
      this.getOrderList({
        pageIndex: 1,
        pageSize: 6
      })
    },
    mounted(){

    },
    methods: {
      viewMore() {

      },
      getActivityList(option) {
        let submitData = {
          search: '',
          pageIndex: option.pageIndex,
          pageSize: option.pageSize,
          queryDetail: false,
          queryOrder: true
        }
        let url = lib.getRequestUrl('/api/activity/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          if (res) {
            this.activityLoading = false
            let activityList = lib.filterResult(res.data.data)

            activityList.map(function (item) {
              item.create_time_md_format = lib.date('m-d',item.create_time)
              item.orderNum = item.activity_order.length
            })
            this.activityList = activityList
          }
        }).catch(error => {
          console.log('error', error)
          this.loading = false
          this.$Message.error('服务器错误!');
        })
      },
      getOrderList(option) {
        let submitData = {
          pageIndex: option.pageIndex,
          pageSize: option.pageSize
        }
        let url = lib.getRequestUrl('/api/activity/order/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          if (res) {
            this.orderLoading = false
            let orderList = lib.filterResult(res.data.data)

            orderList.map(function (item) {
              item.create_time_md_format = lib.date('m-d',item.create_time)
            })
            this.orderList = orderList
          }
        }).catch(error => {
          console.log('error', error)
          this.loading = false
          this.$Message.error('服务器错误!');
        })
      },
    },
  }
</script>
<style>
  .home_container .top ul {
    padding: 20px 10px 0 40px;
  }
  .home_container .top ul.one {
    background: #ED5565;
  }
  .home_container .top ul.two {
    background: #2096F3;
  }
  .home_container .top ul.three {
    background: #0CC3AA;
  }
  .home_container .top ul li {
    color: white;
  }
  .home_container .top ul li.title {
    font-weight: 500;
    font-size: 16px;
  }
  .home_container .top ul li.value {
    font-weight: 600;
    font-size: 40px;
  }
  .home_container .top ul li.des {
    font-weight: 400;
    font-size: 18px;
  }
  .home_container .top ul li.des p:first-child {
    margin-bottom: 20px
  }
  .home_container .top ul.one li.des p:last-child {
    color: #E64859;
  }
  .home_container .top ul.two li.des p:last-child {
    color: #1A86DB;
  }
  .home_container .top ul.three li.des p:last-child {
    color: #07B69E;
  }
  .home_container .top ul li.des::after {
    content: '';
    display: block;
    clear: both;
  }

  .home_container ul.activityContentList li {
    padding: 6px 0;
  }
  .home_container ul.quickList li {
    width: 100%;
    padding: 10px 0;
  }

  .home_container ul.quickList li div.icon {
    text-align: center;
  }
  .home_container ul.quickList li div.des {
    text-align: center;
  }



</style>
