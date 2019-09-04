<template>
  <div class="applyContainer">
    <div class="logo">校事通</div>
    <div class="box">
      <p class="title">【校事通试用账号申请】</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" class="mt20">
        <FormItem label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入您的姓名"></Input>
        </FormItem>

        <FormItem label="手机号" prop="phone">
          <Input v-model="formValidate.phone" placeholder="请输入您的手机号"></Input>
        </FormItem>

        <FormItem label="培训机构名称" prop="organization">
          <Input number v-model="formValidate.organization" placeholder="请输入机构名称"></Input>
        </FormItem>

        <FormItem label="培训机构类型" prop="type">
          <Select v-model="formValidate.type">
            <Option value="英语">英语</Option>
            <Option value="美术">美术</Option>
            <Option value="SETM/机器人">SETM/机器人</Option>
            <Option value="舞蹈">舞蹈</Option>
            <Option value="书法">书法</Option>
            <Option value="户外">户外</Option>
            <Option value="音乐">音乐</Option>
            <Option value="综合">综合</Option>
            <Option value="其他">其他</Option>
          </Select>
        </FormItem>

        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">提交获取试用账号</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
  import config from '@/assets/js/config/index.js'
  import lib from '@/assets/js/lib/index.js'

  export default {
    name: 'apply',
    data() {
      return {
        formValidate: {
          name: '',
          phone: '',
          organization: '',
          type: ''
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入您的姓名', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入您的手机号', trigger: 'blur'}
          ],
          organization: [
            {required: true, message: '请输入机构名称', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择机构类型', trigger: 'change'}
          ],
        },
      }
    },
    created() {

    },
    mounted(){

    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            console.log(this.formValidate)

            let _this = this
            this.$http.post('api/trial/apply', this.formValidate).then(res => {
              if(res) {
                _this.$router.push({
                  name: 'applySuccess',
                  "params": {

                  }
                })
              }
            }).catch(error => {
              this.$Message.error(error.message);
            })


          } else {
            this.$Message.error('表单填写有误！');
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
  .applyContainer {
    height: 100%;
    background-image: url("../../static/apply-bg.png");
    background-size: 100% auto;
    background-repeat: no-repeat;
    padding-top: 20px;
  }
  .logo {
    margin: 0 auto 3% auto;
    font-size: 40px;
    color: white;
    text-align: center;
  }
  .box {
    margin: 0 auto;
    padding: 24px 20px;
    /*padding-left: 0;*/
    width: 30%;
    border-radius: 16px;
    box-shadow: 0px 0px 22px 5px rgba(31, 117, 230, 0.14);
    background-color: white;
  }
  .box .title {
    color: #1F75E6;
    text-align: center;
    margin: 0;
    font-size: 30px;
  }
</style>
