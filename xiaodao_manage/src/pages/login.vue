<template>
  <div class="loginContainer">
    <Row>
      <Col span="12"></Col>
      <Col span="12">
        <div class="loginBox mt20">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <FormItem label="登录手机号" prop="phone">
              <Input v-model="formValidate.phone" placeholder="请输入登录手机号"></Input>
            </FormItem>
            <FormItem label="密码" prop="pwd">
              <Input type="password" v-model="formValidate.pwd" placeholder="请输入密码"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
              <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </FormItem>
          </Form>
        </div>
      </Col>
      <Col span="12"></Col>
    </Row>
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
    mounted(){

    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let submitData = {
              uname: this.formValidate.phone,
              pwd: this.formValidate.pwd,
              from: 1
            }
            let url = lib.getRequestUrl(config.BASE_DOMAIN + '/u/api/login', submitData)
            this.$http.get(url, {}).then(res => {
            if(res) {
               var UU7 = res.data.user.UU7
               this.memberLogin(UU7)
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
      memberLogin(UU7) {
        let submitData = {
          uname: this.formValidate.phone,
          UU7: UU7,
        }
        this.$http.post(config.XDM_DOMAIN + '/api/member/login', submitData).then(res => {
          if(res) {
              this.$Message.success('Success!');
          }
        }).catch(error => {
          this.$Message.error('服务器错误!');
        })
      }
    },
  }
</script>
<style>

</style>
