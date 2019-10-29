<template>
  <div class="layout">
    <Sider class="sliderbar" :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto','z-index': 20}"
           width='180'>
      <!--<div class="icon-control"></div>-->
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
            <span style="display: block">{{$store.state.uname}}</span>
            <span style="display: block">{{$store.state.role_name}}</span>
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
          <MenuItem name="client">咨询本</MenuItem>
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
          <MenuItem name="coursetable">课程表</MenuItem>
          <MenuItem name="class">班级/排课</MenuItem>
          <MenuItem name="attendance">考勤</MenuItem>
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
          <MenuItem name="userPoint">用户积分</MenuItem>
          <MenuItem name="pointDetail">用户积分明细</MenuItem>
        </Submenu>


        <Submenu name="7">
          <template slot="title">
            <i class="icon iconfont icon-shangcheng" style="margin-left: 12px;font-size: 14px;"></i>
            积分商城管理
          </template>
          <MenuItem name="shopGoods">商品管理</MenuItem>
          <MenuItem name="shopGoodsCategory">商品类别</MenuItem>
          <MenuItem name="shopOrder">订单管理</MenuItem>
          <MenuItem name="shopBanner">商城Banner</MenuItem>
        </Submenu>


        <Submenu name="8">
          <template slot="title">
            <Icon type="md-phone-portrait" style="font-size: 18px"/>
            手机端设置
          </template>
          <MenuItem name="weWebsite">首页Banner设置</MenuItem>
          <MenuItem name="homeActivity">首页活动排序</MenuItem>
          <MenuItem name="article">机构介绍文章管理</MenuItem>
        </Submenu>


        <!--<MenuItem name="home">-->
        <!--<Icon type="ios-help-buoy" />-->
        <!--<span>营销管理</span>-->
        <!--</MenuItem>-->


        <Submenu name="9">
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

        <Submenu name="10">
          <template slot="title">
            <Icon type="md-settings"/>
            机构设置
          </template>
          <MenuItem name="company">机构信息</MenuItem>
          <MenuItem name="pointEdit">积分设置</MenuItem>
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

            <li style="padding: 0 0" v-if="companyList.length > 1">
              <span class="wrap" style="border: none">
								{{$store.state.company_name}}
								<Dropdown placement="bottom" style="float: right;margin-right: 15px;">
									<a href="javascript:void(0)">
										&nbsp;&nbsp;切换门店
										<Icon type="arrow-down-b"></Icon>
									</a>

									<DropdownMenu slot="list">
										<DropdownItem v-for="(item,index) in companyList" :key="index" style="display: block;line-height:30px ;">
											<div @click.stop="changeCompany(item)">
												<span >{{index+1}}、</span>
												<span>{{item.name}} ({{item.role}})</span>
											</div>
										</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</span>
            </li>
            <li class="header_bar_last" style="cursor: pointer;text-align: center">
              <!--<Icon type="md-log-out" size="20"/>-->

              <Poptip trigger="hover" placement="bottom-end">
                <i class="iconfont icon icon-avatar" style="color: #87d068;font-size: 28px"></i>
                <div slot="content">
                  <div class="headDrop">
                    <p class="item">
                      <i class="username headdrop-i"></i>
                      {{$store.state.uname}}
                    </p>
                    <p class="item">
                      <i class="rolename headdrop-i"></i>
                      {{$store.state.role_name}}
                    </p>
                    <p class="item">
                      <i class="campusname headdrop-i"></i>
                      {{$store.state.company_name}}
                    </p>
                    <p class="item logout">
                      <Button type="primary" size="small" style="width: 160px;color: white;" @click="logout">退出登录</Button>
                    </p>
                    <p class="bottom-ope">
                      <a href="#" title="修改密码" @click="editPassWord = true">修改密码</a>
                      <a href="#">个人信息维护</a>
                    </p>
                  </div>
                </div>
              </Poptip>
            </li>
          </ul>
        </Header>
      </Affix>

      <Content :style="{padding: '0 27px 27px 27px'}">
        <router-view></router-view>
      </Content>

      <footer>
        <p>技术支持</p>
        <p>copyright © 2018 - 2019 校事通</p>
      </footer>
    </Layout>


    <Modal v-model="editPassWord">
      <p slot="header">
        <span>修改密码</span>
      </p>
      <div style="width: 600px">
        <Form ref="pwdFormValidate" :model="pwdFormValidate" :rules="pwdRuleValidate" :label-width="80">
          <FormItem label="手机号码" prop="phone">
            <Input v-model="pwdFormValidate.phone"  type="text" placeholder="请输入手机号码获取验证码" style="width: 300px;"/>
            <Button :disabled="codeDisabled" @click="getMobleCode" :loading="phoneCodeLoading">{{getPhoneCode}}</Button>
          </FormItem>

          <FormItem label="验证码" prop="vcode">
            <Input v-model="pwdFormValidate.vcode" number placeholder="请输入验证码" style="width: 300px;"/>
          </FormItem>

          <FormItem label="新密码" prop="newPwd">
            <Input v-model="pwdFormValidate.newPwd" placeholder="请输入新密码" type="password" style="width: 300px;"/>
          </FormItem>

          <FormItem label="确认密码" prop="confirmPwd">
            <Input v-model="pwdFormValidate.confirmPwd" placeholder="再次输入密码" type="password" style="width: 300px;"/>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="resetpassword('pwdFormValidate')">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import store from '../store'
  import config from '../../config/index'
  import '@/assets/css/iconfont/iconfont.css'

  export default {
    data() {
      return {
        config: {},
        count: 0,
        editPassWord: false,
        pwdFormValidate: {},
        pwdRuleValidate: {},
        getPhoneCode: '获取验证码',
        phoneCodeLoading: false,
        codeDisabled: false,
        codeTime: 60,
        companyList: []

      }
    },
    created() {
      this.config = config
      this.getMultiCompanyList()
    },
    mounted() {
      this.setFont(1920, 1920)
    },
    methods: {
      logout() {
        this.$store.dispatch('UserLogout')
        let submitData = {}
        this.$http.post('/u/api/logout', submitData).then(res => {
          this.$router.push({
            path: 'login',
            query: {}
          })
        }).catch(error => {
          this.$Message.error(error.message);
        })
      },
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

      getMultiCompanyList() {
        let submitData = {
          uid: this.$store.state.uid,
        }
        this.$http.post('/api/multicompany/list', submitData).then(res => {
          let data = res.data.data
          this.companyList = data

        }).catch(error => {
          this.$Message.error(error.message);
        })
      },
      changeCompany(item) {
        let submitData = {
          cid: item.cid,
          uid: item.uid,
          role_id: item.role_id,
        }
        this.$http.post('/api/member/multilogin', submitData).then(res => {
          let data = res.data.data

          this.$store.dispatch('Uname', data.uname)
          this.$store.dispatch('Cid', item.cid)
          this.$store.dispatch('Uid', item.uid)
          this.$store.dispatch('Mid', item.mid)
          this.$store.dispatch('CompanyName', item.name)
          this.$store.dispatch('RoleName', item.role)
          this.$store.dispatch('RoleId', item.role_id)

          this.$Message.success('切换门店成功！');
          setTimeout(()=>{
            this.$router.go(0)
          },1000)
        }).catch(error => {
          this.$Message.error(error.message);
        })
      },
      getMobleCode() {
        this.phoneCodeLoading = true
        let submitData = {
          phone: this.pwdFormValidate.phone,
          type: 1,
          sendType: 1
        }
        this.$http.post('/api/sms/send', submitData).then(res => {
          this.phoneCodeLoading = false
          this.afterSendCode()
        }).catch(error => {
          this.phoneCodeLoading = false
          this.$Message.error(error.message);
        })
      },
      // 验证码倒计时
      afterSendCode() {
        let _that = this
        this.codeDisabled = true
        let interval = window.setInterval(function() {
          if((_that.codeTime--) <= 0) {
            _that.codeTime = 60;
            _that.getPhoneCode = "获取验证码"
            _that.codeDisabled = false;
            window.clearInterval(interval)
          } else {
            _that.getPhoneCode = _that.codeTime + 's'
          }
        }, 1000);
      },

      resetpassword(inventory) {
        this.$refs[inventory].validate((valid) => {
          if (valid) {
            if(this.pwdFormValidate.newPwd == this.pwdFormValidate.confirmPwd) {
              let url = '/u/api/password/reset'
              let submitData = {
                uname: this.pwdFormValidate.phone,
                vcode: this.pwdFormValidate.vcode,
                pwd: this.pwdFormValidate.newPwd,
              }
              this.$http.post(url, submitData).then(res => {
                this.$Message.success('修改密码成功')
                this.editPassWord = false
              }).catch(error => {
                this.$Message.error(error.message)
                this.editPassWord = false
              })
            }else{
              this.$Message.error('新密码和确认密码不一致!');
            }
          } else {
            this.$Message.error('请输入完整信息!');
          }
        })
      }
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



  .headDrop {
    font-size: 12px;
    max-width: 220px;
    padding: 10px;
    min-width: 220px;
  }
  .headDrop p.item {
    text-align: left;
    border-bottom: 1px solid #ddd;
    font-size: 12px;
    padding: 10px 0px;
  }
  .headDrop p.logout {
    text-align: center;
    color: white;
  }
  .headDrop p.bottom-ope {
    display: flex;
    justify-content: space-between;
    padding-top: 12px;
  }

  .headDrop .headdrop-i {
    background: url(../../static/ico_loginuser.png) no-repeat;
    width: 18px;
    height: 18px;
    display: inline-block;
    margin: 0 5px -5px 0;
    vertical-align: top;
  }

  .headDrop .headdrop-i.username {
    background-position: 0 0;
  }

  .headDrop .headdrop-i.rolename {
    background-position: 0 -22.5px;
    margin-top: -1px;
  }

  .headDrop .headdrop-i.rolename {
    background-position: 0 -22.5px;
    margin-top: -1px;
  }

  .headDrop .headdrop-i.campusname {
    background-position: 0 -45px;
  }


</style>
