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
            <span style="display: block">Administrator</span>
            <span style="display: block">普通用户</span>
          </li>
        </ul>

        <MenuItem name="home">
          <Icon type="ios-navigate"></Icon>
          <span>首页</span>
        </MenuItem>

        <Submenu name="1">
          <template slot="title">
            <Icon type="md-contacts" />
            基础信息管理
          </template>
          <MenuItem name="studentList">学生管理</MenuItem>
          <MenuItem name="teacherList">老师管理</MenuItem>
        </Submenu>

        <Submenu name="2">
          <template slot="title">
            <Icon type="md-book" />
            课程管理
          </template>
          <MenuItem name="courseList">课程管理</MenuItem>
          <MenuItem name="courseEdit">课程标签管理</MenuItem>
        </Submenu>


        <MenuItem name="home">
          <Icon type="ios-help-buoy" />
          <span>活动管理</span>
        </MenuItem>

        <!--<Submenu name="3">-->
          <!--<template slot="title">-->
            <!--<Icon type="compass"></Icon>-->
            <!--活动管理-->
          <!--</template>-->
          <!--<MenuItem name="warehouse">课程管理</MenuItem>-->
          <!--<MenuItem name="warehouse">课程标签管理</MenuItem>-->
        <!--</Submenu>-->

        <Submenu name="3">
          <template slot="title">
            <Icon type="md-settings" />
            机构设置
          </template>
          <MenuItem name="company">机构编辑</MenuItem>
        </Submenu>

        <Submenu name="3">
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

      <router-view></router-view>

      <footer>
        <p>技术支持</p>
        <p>copyright © 2018 小稻米技术部出品</p>
      </footer>
    </Layout>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        count: 3
      }
    },
    created() {

    },
    mounted() {

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
