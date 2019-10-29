<template>
  <div class="loginContainer">
    <div class="title">
      <p>校事通</p>
      <div class="btn">
        <Button type="primary" size="large" @click="toApply">申请试用</Button>
      </div>
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
            <Button type="primary" @click="handleSubmit('formValidate')" :loading="submitLoading" size="large" long>登录
            </Button>
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
        submitLoading: false,
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
      // var domain = document.domain
      // if(domain.indexOf('xiaost.net') > -1) {
      //   window.location.href = 'http://abie.sgmarket.rocks'
      // }
      console.log(2222)
    },
    mounted() {

    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let submitData = {
              uname: this.formValidate.phone,
              pwd: this.formValidate.pwd,
              from: 1,
            }
            let url = lib.getRequestUrl('/u/api/login', submitData)
            this.$http.get(url, {}).then(res => {
              if (res) {
                var UU7 = res.data.user.UU7
                //this.$store.dispatch('UserLogin', UU7)
                this.memberLogin()
              }
            }).catch(error => {
              this.$Message.error(error.message);
            })
          } else {
            this.$Message.error('请输入完整信息!');
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },
      memberLogin() {
        this.submitLoading = true
        let submitData = {
          uname: this.formValidate.phone,
        }
        this.$http.post('/api/member/login', submitData).then(res => {
          this.submitLoading = false
          if (res.data.errNo == 100000) {
            let member = res.data.data

            this.$store.dispatch('Uname', member.uname)
            this.$store.dispatch('Cid', member.cid)
            this.$store.dispatch('Uid', member.uid)
            this.$store.dispatch('Mid', member.mid)
            this.$store.dispatch('CompanyName', member.company_name)
            this.$store.dispatch('RoleName', member.role_name)
            this.$store.dispatch('RoleId', member.role_id)

            this.$Message.success('Success!')

            setTimeout(()=>{
              this.$router.push({
                path: 'home',
                query: {}
              })
            },2000)
          } else if (res.data.errNo == 112004) {
            this.$router.push({
              path: 'multilogin',
              query: {
                uid: res.data.uid
              }
            })
          } else {
            this.$Message.error('出错啦')
          }
        }).catch(error => {
          this.submitLoading = false
          this.$Message.error(error.message)
        })
      },
      toApply() {
        let newpage = this.$router.resolve({
          name: 'apply',
          query: {}
        })
        window.open(newpage.href, '_blank')
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
      display: flex;
      justify-content: space-between;
      padding: 30px 320px;
      padding-right: 220px;
      p {
        font-size: 34px;
        color: #fff;
        font-weight: 700;
      }
      .btn {

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
      top: 200px;
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
