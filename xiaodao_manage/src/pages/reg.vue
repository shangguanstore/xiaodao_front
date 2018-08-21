<template>
  <div class="regContainer">
    <Row>
      <Col span="12"></Col>
      <Col span="12">
        <div class="regBox mt20">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <FormItem label="机构名称" prop="oganizeName">
              <Input v-model="formValidate.oganizeName" placeholder="请输入机构名称"></Input>
            </FormItem>
            <FormItem label="负责人姓名" prop="uname">
              <Input v-model="formValidate.uname" placeholder="请输入负责人姓名"></Input>
            </FormItem>
            <FormItem label="联系手机号码" prop="phone">
              <Input v-model="formValidate.phone" placeholder="请输入联系手机号码"></Input>
            </FormItem>
            <FormItem label="密码" prop="pwd">
              <Input type="password" v-model="formValidate.pwd" placeholder="请输入密码"></Input>
            </FormItem>
            <FormItem label="确认密码" prop="rePwd">
              <Input type="password" v-model="formValidate.rePwd" placeholder="请再次输入密码"></Input>
            </FormItem>
            <FormItem label="验证码" prop="vcode">
              <Input v-model="formValidate.vcode" placeholder="请输入验证码"></Input>
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

  export default {
    name: 'reg',
    data() {
      return {
        formValidate: {
          oganizeName: '',
          phone: '',
          uname: '',
          pwd: '',
          rePwd: '',
          vcode: '',
        },
        ruleValidate: {
          oganizeName: [
            {required: true, message: '请输入机构名称', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'}
          ],
          uname: [
            {required: true, message: '请输入负责人姓名', trigger: 'blur'}
          ],
          pwd: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ],
          rePwd: [
            {required: true, message: '请输入确认密码', trigger: 'blur'}
          ],
          vcode: [
            {required: true, message: '请输入验证码', trigger: 'blur'}
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
              oganizeName: this.formValidate.oganizeName,
              uname: this.formValidate.uname,
              phone: this.formValidate.phone,
              pwd: this.formValidate.pwd,
              vcode: this.formValidate.vcode,
              role: config.UserRole.ROLE_ADMIN,
            }
            this.$http.post(config.XDM_DOMAIN + '/api/member/reg', submitData).then(res => {
              if(res) {
                 this.$Message.success('Success!');
              }
            }).catch(error => {
              console.error(error)
              this.$Message.error('服务器错误!');
            })
          } else {
            this.$Message.error('请输入完整信息!');
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      }
    },
  }
</script>
<style>

</style>
