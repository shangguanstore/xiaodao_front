<template>
  <div class="loginContainer">
    <div class="title">
      <p>校事通</p>
    </div>
    <div class="slogan">
      <p class="big">SAAS + 物联网 + 商业智能</p>
      <p class="default">快捷互通的教育解决方案</p>
    </div>
    <div class="loginBox">
      <h2>帐号密码登录</h2>
      <Row>
        <Col span="24">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" class="form mt10">
            <FormItem prop="phone">
              <Input v-model="formValidate.phone" placeholder="请输入登录手机号"></Input>
            </FormItem>
            <FormItem prop="pwd">
              <Input type="password" v-model="formValidate.pwd" placeholder="请输入密码"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmit('formValidate')" size="large" long>登录</Button>
              <!--<Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>-->
            </FormItem>
          </Form>
        </Col>
        <!--<Col span="4">-->
        <!--</Col>-->
      </Row>
    </div>
  </div>

</template>

<script>
  import config from '@/assets/js/config/index.js'
  import lib from '@/assets/js/lib/index.js'

  export default {
    name: 'login',
    data() {
      return {
        formValidate: {
          phone: '',
          pwd: '',
        },
        ruleValidate: {
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'}
          ],
          pwd: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
        }
      }
    },
    created() {
      var domain = document.domain
      if(domain.indexOf('xiaost.net') > -1) {
        window.location.href = 'http://abie.sgmarket.rocks'
      }
      console.log(2222)
    },
    mounted(){

    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let submitData = {
              uname: this.formValidate.phone,
              pwd: this.formValidate.pwd,
              from: 1,
            }
            let url = lib.getRequestUrl('/u/api/login', submitData)
            this.$http.get(url, {}).then(res => {
            if(res) {
               var UU7 = res.data.user.UU7
               //this.$store.dispatch('UserLogin', UU7)
               this.memberLogin()
            }
            }).catch(error => {
              this.$Message.error('服务器错误!');
            })
          } else {
            this.$Message.error('请输入完整信息!');
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
      memberLogin() {
        let submitData = {
          uname: this.formValidate.phone,
        }
        this.$http.post('/api/member/login', submitData).then(res => {
          if(res) {
              let member = res.data.member
              this.$store.dispatch('UserName', member.uname)
              this.$Message.success('Success!')
              var _this = this
              setTimeout(function () {
                  _this.$router.push({
                      path: 'student',
                      query: {}
                  })
              },2000)
          }
        }).catch(error => {
            console.log(error)
          this.$Message.error('服务器错误!')
        })
      }
    },
  }
</script>
<style lang="less">
.loginContainer {
  height: 100vh;
  position: relative;
  background-image: url("../assets/img/xst2.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .title {
    margin-top: 0;
    p {
      padding-top: 30px;
      font-size: 34px;
      color: #fff;
      margin-left: 320px;
      font-weight: 700;
    }
  }
  .slogan {
    position: fixed;
    left: 320px;
    top: 190px;
    p.big {
      font-size: 40px;
      font-weight: 600;
      color: white;
    }
    p.default {
      font-size: 24px;
      margin-top: 20px;
      font-weight: 500;
      color: white;
    }
  }
  .loginBox {
    position: absolute;
    top: 140px;
    right: 220px;
    width: 380px;
    border-radius: 4px;
    background: #fff;
    h2 {
      font-size: 24px;
      margin-top: 20px;
      text-align: center;
      font-weight: 400;
    }
    .form {
      position: relative;
      left: -50px;
    }
  }
}
</style>
