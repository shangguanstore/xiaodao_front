<template>
  <div class="layout">
    <Sider class="sliderbar" :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto','z-index': 20}" width='180'>
      <div class="icon-control"></div>
      <Menu active-name="1" theme="dark" width="auto" :open-names="['1']" @on-select="routeTo" accordion>
        <!--<div class="xdm_logo">-->
          <!--<img width="30" src="../../static/common/logo.jpg" />-->
        <!--</div>-->

        <ul class="sliderbar_personal">
          <li class="sliderbar_personal_portrait">
            <img src="../assets/img/xdm_sliderbar_personal_portrait.png" width="45" height="42" style="border-radius: 50%;"/>
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
            <Icon type="md-book" />
            教务中心
          </template>
          <MenuItem name="student">学员管理</MenuItem>
          <MenuItem name="courseList">课程管理</MenuItem>
          <MenuItem name="courseEdit">课程标签管理</MenuItem>
        </Submenu>


        <Submenu name="3">
          <template slot="title">
            <Icon type="ios-help-buoy" />
            营销管理
          </template>
          <MenuItem name="activity">活动报名</MenuItem>
          <MenuItem name="weWebsite">手机端设置</MenuItem>
        </Submenu>


        <!--<MenuItem name="home">-->
          <!--<Icon type="ios-help-buoy" />-->
          <!--<span>营销管理</span>-->
        <!--</MenuItem>-->


        <Submenu name="4">
          <template slot="title">
            <Icon type="ios-home" />
            内部管理
          </template>
          <MenuItem name="staff">员工管理</MenuItem>
        </Submenu>

        <Submenu name="5">
          <template slot="title">
            <Icon type="logo-googleplus" />
            机构设置
          </template>
          <MenuItem name="company">机构编辑</MenuItem>
        </Submenu>

        <Submenu name="6">
          <template slot="title">
            <Icon type="md-settings" />
            系统设置
          </template>
        </Submenu>
      </Menu>
    </Sider>
    <Layout :style="{marginLeft: '180px'}">
      <Affix :offset-top="0">
        <Header class="header" :style="{background: '#fff'}">
          <!--<AutoComplete class="xdm_input" v-model="value1" icon="ios-search" :data="data1" @on-search="handleSearch1" placeholder="input here" style="width:200px"></AutoComplete>-->
          <ul class="header_bar">
            <li>
              <Badge :count="count" class-name="demo-badge-alone">
                <Icon type="md-notifications" size="26"/>
              </Badge><span>消息</span>
            </li>
            <li>
              <Badge :count="count">
                <Icon type="md-notifications" size="26"/>
              </Badge><span>预警</span>
            </li>
            <li class="header_bar_last" style="cursor: pointer;text-align: center">
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
        <p>copyright © 2016 - 2018 校事通</p>
      </footer>
    </Layout>
  </div>
</template>

<script>
  import store from '../store'

  export default {
    data() {
      return {
        count: 3,
        uname: ""
      }
    },
    created() {

    },
    mounted() {
        this.uname = store.state.uname
    },
    methods: {
      routeTo(e) {
        this.$router.push(e)
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
