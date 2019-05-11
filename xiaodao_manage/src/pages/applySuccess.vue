<template>
  <div class="applySuccessContainer">
    <div class="box">
      <img src="../../static/apply-success.png" alt="">
      <p class="title">账号申请成功</p>
      <p class="des">请耐心等待我们的工作人员联系发放试用账号</p>
    </div>
  </div>
</template>

<script>
  import config from '@/assets/js/config/index.js'
  import lib from '@/assets/js/lib/index.js'

  export default {
    name: 'applySuccess',
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
            this.$Message.success('Success!');
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
  .applySuccessContainer {
    height: 100%;
    background-image: url("../../static/apply-bg.png");
    background-size: 100% auto;
    background-repeat: no-repeat;
    padding-top: 180px;
  }
  .applySuccessContainer .box {
    margin: 0 auto;
    padding: 24px 20px;
    /*padding-left: 0;*/
    width: 30%;
    border-radius: 16px;
    box-shadow: 0px 0px 22px 5px rgba(31, 117, 230, 0.14);
    background-color: white;
    text-align: center;
  }
  .applySuccessContainer .box .title {
    font-size: 24px;
    color: #202020;
    margin-top: 20px;
  }
  .applySuccessContainer .box .des {
    color: #404040;
    font-size: 18px;
  }

</style>
