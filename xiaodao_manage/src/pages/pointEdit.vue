<template>
  <div>
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>系统设置</BreadcrumbItem>
        <BreadcrumbItem>积分设置</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="container staff_edit_container mt20">
      <p class="content_title">基本设置</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" class="mt20">
        <Row>
          <Col span="2">&nbsp;</Col>
          <Col span="3">
            <i-switch size="large" v-model="registerStatus" @on-change="registerChange">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
            注册得积分
          </Col>
          <Col span="3">
            <FormItem prop="name">
              <Input v-model="formValidate.registerNum"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="2">&nbsp;</Col>
          <Col span="3">
            <i-switch size="large" v-model="shareStatus" @on-change="shareChange">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
            分享得积分
          </Col>
          <Col span="3">
            <FormItem prop="name">
              <Input v-model="formValidate.shareNum"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="2">&nbsp;</Col>
          <Col span="3">
            <i-switch size="large" v-model="shareApplyStatus" @on-change="shareApplyChange">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
            分享并且报名得积分
          </Col>
          <Col span="3">
            <FormItem prop="name">
              <Input v-model="formValidate.shareApplyNum"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="2">&nbsp;</Col>
          <Col span="3">
            <i-switch size="large" v-model="shareSuccessStatus" @on-change="shareSuccessChange">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
            最终转化得积分
          </Col>
          <Col span="3">
            <FormItem prop="name">
              <Input v-model="formValidate.shareSuccessNum"></Input>
            </FormItem>
          </Col>
        </Row>


        <Row style="margin-top: 100px">
          <Col span="1">&nbsp;</Col>
          <Col span="4">
            <FormItem>
              <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
              <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </FormItem>
          </Col>
        </Row>

      </Form>
    </div>
  </div>
</template>

<script>
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'

  export default {
    name: 'pointEdit',
    data() {
      return {
        registerStatus: false,
        shareStatus: false,
        shareApplyStatus: false,
        shareSuccessStatus: false,
        mid: 0,
        title: "",
        isAdd: true,
        formValidate: {
          registerNum: 0,
          shareNum: 0,
          shareApplyNum: 0,
          shareSuccessNum: 0
        },
        ruleValidate: {

        }
      }
    },
    created() {
        this.getSettingData()
    },
    mounted() {

    },
    methods: {
      getSettingData() {
          let submitData = {
              key: [
                  'KEY_POINT_REGISTER',
                  'KEY_POINT_SHARE',
                  'KEY_POINT_SHARE_APPLY',
                  'KEY_POINT_SHARE_SUCCESS'
              ]
          }
          let url = '/api/company/setting/getlist'
          this.$http.post(url, submitData).then(res => {
              if(res) {
                  console.log(res)
              }
          }).catch(error => {
              console.log(error)
              this.$Message.error('服务器错误!');
          })
      },
      registerChange(value) {
        this.registerStatus = value
      },
      shareChange(value) {
        this.shareStatus = value
      },
      shareApplyChange(value) {
          this.shareApplyStatus = value
      },
      shareSuccessChange(value) {
          this.shareSuccessStatus = value
      },

      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
              let submitData
              let url
              console.log('isAdd',this.isAdd)
              if(this.isAdd) {
                  submitData = {
                      name: this.formValidate.name,
                      phone: this.formValidate.phone,
                      mother_phone: this.formValidate.mother_phone,
                      father_phone: this.formValidate.father_phone,
                      sex: this.formValidate.sex === '男' ? 1 : 0,
                      birthday: new Date(this.formValidate.birthday).getTime() / 1000,
                      roles: config.UserRole.ROLE_MEMBER,
                  }
                  url = "/api/member/add"
              }else{
                  submitData = {
                      mid: this.mid,
                      name: this.formValidate.name,
                      phone: this.formValidate.phone,
                      mother_phone: this.formValidate.mother_phone,
                      father_phone: this.formValidate.father_phone,
                      sex: this.formValidate.sex === '男' ? 1 : 0,
                      birthday: new Date(this.formValidate.birthday).getTime() / 1000,
                      roles: config.UserRole.ROLE_MEMBE,
                  }
                  url = "/api/member/update"
              }

              this.$http.post(url, submitData).then(res => {
                  if(res) {
                      this.$Message.success(this.title+'成功!')
                      var _this = this
                      setTimeout(function () {
                          _this.$router.push({
                              path: 'student',
                              query: {}
                          })
                      },200)
                  }
              }).catch(error => {
                  this.$Message.error('服务器错误!')
              })
          } else {
            this.$Message.error('请输入完整信息!');
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      },
    },
  }
</script>
<style>

</style>
