<template>
  <div>
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
        <FormItem label="固话" prop="fixphone" style="width: 60%">
          <Input v-model="formValidate.fixphone" placeholder="请输入固话"></Input>
        </FormItem>
        <FormItem label="手机" prop="phone" style="width: 60%">
          <Input v-model="formValidate.phone" placeholder="请输入手机号码"></Input>
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
  </div>
</template>

<script>
  import lib from '@/assets/js/lib/index'

  export default {
    name: 'company',
    data() {
      return {
        formValidate: {
          name: '',
          phone: '',
          fixphone: '',
          address: '',
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入机构名称', trigger: 'blur'}
          ],
          // phone: [
          //   {required: true, message: '请输入手机号', trigger: 'blur'}
          // ],
          // address: [
          //   {required: true, message: '请输入机构地址', trigger: 'blur'}
          // ],
        }
      }
    },
    created() {
      this.getCompany()
    },
    mounted() {

    },
    methods: {
      getCompany() {
        let url = lib.getRequestUrl('/api/company/getlist', {})
        this.$http.get(url, {}).then(res => {
          let company = res.data.data || []
          this.formValidate = company[0]
        }).catch(error => {
          console.log('error', error)
          this.$Message.error('服务器错误!');
        })
      },
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let url = 'api/company/update'
            let submitData = {
              name: this.formValidate.name,
              phone: this.formValidate.phone,
              fixphone: this.formValidate.fixphone,
              address: this.formValidate.address
            }
            this.$http.post(url, submitData).then(res => {
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
