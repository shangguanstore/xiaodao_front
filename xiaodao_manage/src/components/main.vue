<template>
  <div class="layout">
    <Sider class="sliderbar" :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}" width='180'>
      <div class="icon-control"></div>
      <Menu active-name="1" theme="dark" width="auto" :open-names="['1']" @on-select="routeTo" accordion>
        <div class="xdm_logo">
          <!--<img width="30" src="../../static/common/logo.jpg" />-->
        </div>

        <!--<MenuItem name="home">-->
          <!--<Icon type="ios-navigate"></Icon>-->
          <!--<span>控制台</span>-->
        <!--</MenuItem>-->

        <Submenu name="1">
          <template slot="title">
            <Icon type="compass"></Icon>
            基础信息
          </template>
          <MenuItem name="deviceControllerManagement">学生列表</MenuItem>
          <MenuItem name="warehouse">新增</MenuItem>
        </Submenu>

      </Menu>
    </Sider>
    <Layout :style="{marginLeft: '180px'}">
      <Affix :offset-top="0">
        <Header class="header" :style="{background: '#fff'}">
          <!--<AutoComplete class="xdm_input" v-model="value1" icon="ios-search" :data="data1" @on-search="handleSearch1" placeholder="input here" style="width:200px"></AutoComplete>-->
          <ul class="header_bar">
            <li>
              <Badge count="3" class-name="demo-badge-alone">
                <Icon type="ios-bell-outline" size="26"></Icon>
              </Badge><span>消息</span>
            </li>
            <li>
              <Badge count="3">
                <Icon type="ios-bell-outline" size="26"></Icon>
              </Badge><span>预警</span>
            </li>
            <li class="header_bar_last" style="cursor: pointer;">
              <Icon type="power" size="20"></Icon>
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
      return {}
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

  footer {

  }
</style>
