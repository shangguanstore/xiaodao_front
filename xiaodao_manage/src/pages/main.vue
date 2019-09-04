<template>
  <div class="layout">
    <Sider class="sliderbar" :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto','z-index': 20}"
           width='180'>
      <div class="icon-control"></div>
      <Menu active-name="1" theme="dark" width="auto" :open-names="['1']" @on-select="routeTo" accordion>
        <!--<div class="xdm_logo">-->
        <!--<img width="30" src="../../static/common/logo.jpg" />-->
        <!--</div>-->

        <ul class="sliderbar_personal">
          <li class="sliderbar_personal_portrait">
            <img src="../assets/img/xdm_sliderbar_personal_portrait.png" width="45" height="42"
                 style="border-radius: 50%;"/>
          </li>
          <li class="sliderbar_personal_information">
            <span style="display: block">{{this.uname}}</span>
            <span style="display: block">超级管理员</span>
          </li>
        </ul>

        <MenuItem name="home">
          <Icon type="ios-navigate"></Icon>
          <span>首页</span>
        </MenuItem>

        <!--<Submenu name="1">-->
        <!--<template slot="title">-->
        <!--<Icon type="md-contacts" />-->
        <!--基础信息管理-->
        <!--</template>-->
        <!--<MenuItem name="studentList">学生管理</MenuItem>-->
        <!--<MenuItem name="teacherList">老师管理</MenuItem>-->
        <!--</Submenu>-->

        <Submenu name="2">
          <template slot="title">
            <!--<Icon type="md-contacts" />-->
            <i class="icon iconfont icon-tianjiayonghu" style="font-size: 14px;margin-left: 14px;"></i>
            招生中心
          </template>
          <MenuItem name="student">咨询本</MenuItem>
        </Submenu>

        <Submenu name="3">
          <template slot="title">
            <Icon type="md-contacts"/>
            学员
          </template>
          <MenuItem name="student">学员列表</MenuItem>
        </Submenu>


        <Submenu name="4">
          <template slot="title">
            <Icon type="md-book"/>
            教务中心
          </template>
          <MenuItem name="class">班级管理</MenuItem>
          <!--<MenuItem name="courseList">课程管理</MenuItem>-->
          <MenuItem name="courseFee">课程/收费</MenuItem>
          <MenuItem name="teacherList">教师管理</MenuItem>
        </Submenu>


        <Submenu name="5">
          <template slot="title">
            <Icon type="ios-help-buoy"/>
            营销管理
          </template>
          <MenuItem name="groupon">多人拼团</MenuItem>
          <MenuItem name="activity">活动报名</MenuItem>
          <MenuItem name="trialClass">课程介绍</MenuItem>
          <MenuItem name="lottery">抽奖游戏</MenuItem>
        </Submenu>


        <Submenu name="6">
          <template slot="title">
            <i class="icon iconfont icon-jifen" style="margin-left: 12px;font-size: 14px;"></i>
            用户资金管理
          </template>
          <MenuItem name="userPoint">用户学币</MenuItem>
          <MenuItem name="pointDetail">用户学币明细</MenuItem>
        </Submenu>


        <Submenu name="7">
          <template slot="title">
            <Icon type="md-phone-portrait" style="font-size: 18px"/>
            手机端设置
          </template>
          <MenuItem name="weWebsite">首页Banner设置</MenuItem>
          <MenuItem name="homeActivity">首页活动排序</MenuItem>
        </Submenu>


        <!--<MenuItem name="home">-->
        <!--<Icon type="ios-help-buoy" />-->
        <!--<span>营销管理</span>-->
        <!--</MenuItem>-->


        <Submenu name="8">
          <template slot="title">
            <Icon type="ios-home"/>
            内部管理
          </template>
          <MenuItem name="staff">员工管理</MenuItem>
        </Submenu>

        <!--<Submenu name="9">-->
          <!--<template slot="title">-->
            <!--<Icon type="logo-googleplus"/>-->
            <!--机构设置-->
          <!--</template>-->
          <!--<MenuItem name="company">机构信息</MenuItem>-->
        <!--</Submenu>-->

        <Submenu name="9">
          <template slot="title">
            <Icon type="md-settings"/>
            机构设置
          </template>
          <MenuItem name="company">机构信息</MenuItem>
          <MenuItem name="pointEdit">学币设置</MenuItem>
          <MenuItem name="ruleSetting">规则设置</MenuItem>
        </Submenu>
      </Menu>

    </Sider>
    <Layout :style="{marginLeft: '180px',minHeight: '100%'}">
      <Affix :offset-top="0">
        <Header class="header" :style="{background: '#fff'}">
          <!--<AutoComplete class="xdm_input" v-model="value1" icon="ios-search" :data="data1" @on-search="handleSearch1" placeholder="input here" style="width:200px"></AutoComplete>-->
          <ul class="header_bar">
            <li>
              <Badge :count="count" class-name="demo-badge-alone">
                <Icon type="md-notifications" size="26"/>
              </Badge>
              <span>消息</span>
            </li>
            <!--<li>-->
            <!--<Badge :count="count">-->
            <!--<Icon type="md-notifications" size="26"/>-->
            <!--</Badge><span>预警</span>-->
            <!--</li>-->
            <li class="header_bar_last" style="cursor: pointer;text-align: center" @click="routeTo('login')">
              <Icon type="md-log-out" size="20"/>
            </li>
          </ul>
        </Header>
      </Affix>

      <Content :style="{padding: '0 27px 27px 27px'}">
        <router-view></router-view>
      </Content>

      <footer>
        <p>技术支持</p>
        <p>copyright © 2016 - 2019 校事通</p>
      </footer>
    </Layout>
  </div>
</template>

<script>
  import store from '../store'
  import '@/assets/css/iconfont/iconfont.css'

  export default {
    data() {
      return {
        count: 0,
        uname: ""
      }
    },
    created() {

    },
    mounted() {
      this.uname = store.state.uname
      this.setFont(1920,1920)
    },
    methods: {
      routeTo(e) {
        this.$router.push(e)
      },
      setFont(designWidth, maxWidth) {
        let doc = document,
          win = window;
        let docEl = doc.documentElement;
        let tid;
        let rootItem, rootStyle;

        function refreshRem() {
          let width = docEl.getBoundingClientRect().width;
          if (!maxWidth) {
            maxWidth = 1920;
          }
          ;
          if (width > maxWidth) {
            width = maxWidth;
          }
          //与淘宝做法不同，直接采用简单的rem换算方法1rem=100px
          let rem = width * 100 / designWidth

          //设置根元素（html）的字符大小
          docEl.style.fontSize = rem + "px"

          //兼容UC开始
          rootStyle = "html{font-size:" + rem + 'px !important}'
          rootItem = document.getElementById('rootsize') || document.createElement("style")
          if (!document.getElementById('rootsize')) {
            document.getElementsByTagName("head")[0].appendChild(rootItem)
            rootItem.id = 'rootsize'
          }
          if (rootItem.styleSheet) {
            rootItem.styleSheet.disabled || (rootItem.styleSheet.cssText = rootStyle)
          } else {
            try {
              rootItem.innerHTML = rootStyle
            } catch (f) {
              rootItem.innerText = rootStyle
            }
          }
          //兼容UC结束
        }

        refreshRem()

        win.addEventListener("resize", function () {
          clearTimeout(tid); //防止执行两次
          tid = setTimeout(refreshRem, 300);
        }, false)

        win.addEventListener("pageshow", function (e) {
          if (e.persisted) { // 浏览器后退的时候重新计算
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300)
          }
        }, false)

        if (doc.readyState === "complete") {
          doc.body.style.fontSize = "16px"
        } else {
          doc.addEventListener("DOMContentLoaded", function (e) {
            doc.body.style.fontSize = "16px"
          }, false)
        }
      },
    },
  }
</script>

<style>
  .layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    /*overflow: hidden;*/
    height: 100vh;
  }

  .layout-header-bar {
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  }

  .demo-badge-alone {
    background: #5cb85c !important;
  }

  .ivu-badge-count {
    top: 4px;
  }
</style>
