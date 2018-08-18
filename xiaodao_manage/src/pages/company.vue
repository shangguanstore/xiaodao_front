<template>
  <Content :style="{padding: '0 27px 27px 27px'}">
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>机构设置</BreadcrumbItem>
        <BreadcrumbItem>机构编辑</BreadcrumbItem>
      </Breadcrumb>
      <!--<p>机构编辑</p>-->
    </div>
    <div class="container company_container mt20">
      <p class="content_title">基本信息</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" class="mt20">
        <FormItem label="机构名称" prop="name" style="width: 60%">
          <Input v-model="formValidate.name" placeholder="请输入机构名称"></Input>
        </FormItem>
        <FormItem label="电话" prop="phone" style="width: 60%">
          <Input v-model="formValidate.phone" placeholder="请输入电话号码"></Input>
        </FormItem>
        <FormItem label="地址" prop="address" style="width: 60%">
          <Input v-model="formValidate.address" placeholder="请输入机构所在地址"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </div>
  </Content>
</template>

<script>
  export default {
    name: 'studentList',
    data() {
      return {
        formValidate: {
          name: '',
          phone: '',
          address: '',
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入机构名称', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'}
          ],
          address: [
            {required: true, message: '请输入机构地址', trigger: 'blur'}
          ],
        }
      }
    },
    mounted() {

    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.get('http://hxe.7hu.cn' + 'api/member/reg', {}).then(res => {
              console.log(res)
              this.$Message.success('Success!');
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
      }
    },
  }
</script>
<style>

</style>
