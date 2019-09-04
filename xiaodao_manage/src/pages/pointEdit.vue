<template>
  <div>
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>机构设置</BreadcrumbItem>
        <BreadcrumbItem>学币设置</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="container staff_edit_container mt20">
      <p class="content_title">基本设置</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" class="mt20">
        <Row>
          <Col span="2">&nbsp;</Col>
          <Col span="3">
            <i-switch size="large" v-model="formValidate.KEY_POINT_REGISTER_STATUS" @on-change="registerChange">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
            注册得学币
          </Col>
          <Col span="3">
            <FormItem prop="KEY_POINT_REGISTER_VALUE">
              <Input v-model="formValidate.KEY_POINT_REGISTER_VALUE" number></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="2">&nbsp;</Col>
          <Col span="3">
            <i-switch size="large" v-model="formValidate.KEY_POINT_SHARE_STATUS" @on-change="shareChange">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
            分享得学币
          </Col>
          <Col span="3">
            <FormItem prop="KEY_POINT_SHARE_VALUE">
              <Input v-model="formValidate.KEY_POINT_SHARE_VALUE" number></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="2">&nbsp;</Col>
          <Col span="4">
            <i-switch size="large" v-model="formValidate.KEY_POINT_SHARE_APPLY_STATUS" @on-change="shareApplyChange">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
            分享并且报名得学币
          </Col>
          <Col span="3">
            <FormItem prop="KEY_POINT_SHARE_APPLY_VALUE">
              <Input v-model="formValidate.KEY_POINT_SHARE_APPLY_VALUE" number></Input>
            </FormItem>
          </Col>
        </Row>

        <!--<Row>-->
          <!--<Col span="2">&nbsp;</Col>-->
          <!--<Col span="3">-->
            <!--<i-switch size="large" v-model="formValidate.KEY_POINT_SHARE_SUCCESS_STATUS" @on-change="shareSuccessChange">-->
              <!--<span slot="open">开启</span>-->
              <!--<span slot="close">关闭</span>-->
            <!--</i-switch>-->
            <!--最终转化得学币-->
          <!--</Col>-->
          <!--<Col span="3">-->
            <!--<FormItem prop="KEY_POINT_SHARE_SUCCESS_VALUE">-->
              <!--<Input v-model="formValidate.KEY_POINT_SHARE_SUCCESS_VALUE" number></Input>-->
            <!--</FormItem>-->
          <!--</Col>-->
        <!--</Row>-->

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
        mid: 0,
        title: "",
        isAdd: true,
        formValidate: {
          KEY_POINT_REGISTER_STATUS: 0,
          KEY_POINT_REGISTER_VALUE: 0,
          KEY_POINT_SHARE_STATUS: 0,
          KEY_POINT_SHARE_VALUE: 0,
          KEY_POINT_SHARE_APPLY_STATUS: 0,
          KEY_POINT_SHARE_APPLY_VALUE: 0,
          // KEY_POINT_SHARE_SUCCESS_STATUS: 0,
          // KEY_POINT_SHARE_SUCCESS_VALUE: 0
        },
        ruleValidate: {
            KEY_POINT_REGISTER_VALUE: [
                {required: true, type: 'number',message: '请输入学币', trigger: 'blur'}
            ],
            KEY_POINT_SHARE_VALUE: [
                {required: true, type: 'number',message: '请输入学币', trigger: 'blur'}
            ],
            KEY_POINT_SHARE_APPLY_VALUE: [
                {required: true, type: 'number',message: '请输入学币', trigger: 'blur'}
            ],
            // KEY_POINT_SHARE_SUCCESS_VALUE: [
            //     {required: true, type: 'number',message: '请输入学币', trigger: 'blur'}
            // ],
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
              cfkey: [
                  'KEY_POINT_REGISTER',
                  'KEY_POINT_SHARE',
                  'KEY_POINT_SHARE_APPLY',
                  'KEY_POINT_SHARE_SUCCESS'
              ]
          }
          let url = '/api/company/setting/getlist'
          this.$http.post(url, submitData).then(res => {
              if(res) {
                  var data = res.data.data
                  this.formValidate.KEY_POINT_REGISTER_STATUS = data.KEY_POINT_REGISTER.status == 0 ? true : false
                  this.formValidate.KEY_POINT_REGISTER_VALUE = data.KEY_POINT_REGISTER.value
                  this.formValidate.KEY_POINT_SHARE_STATUS = data.KEY_POINT_SHARE.status == 0 ? true : false
                  this.formValidate.KEY_POINT_SHARE_VALUE = data.KEY_POINT_SHARE.value
                  this.formValidate.KEY_POINT_SHARE_APPLY_STATUS = data.KEY_POINT_SHARE_APPLY.status == 0 ? true : false
                  this.formValidate.KEY_POINT_SHARE_APPLY_VALUE = data.KEY_POINT_SHARE_APPLY.value
                  // this.formValidate.KEY_POINT_SHARE_SUCCESS_STATUS = data.KEY_POINT_SHARE_SUCCESS.status == 0 ? true : false
                  // this.formValidate.KEY_POINT_SHARE_SUCCESS_VALUE = data.KEY_POINT_SHARE_SUCCESS.value
              }
          }).catch(error => {
              console.log(error)
              this.$Message.error(error.message);
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
              let setting = [
                  {
                    cfkey: 'KEY_POINT_REGISTER',
                    value: this.formValidate.KEY_POINT_REGISTER_VALUE,
                    status: this.formValidate.KEY_POINT_REGISTER_STATUS ? config.XstCompanySetting.STATUS_OK : config.XstCompanySetting.STATUS_INVALID,
                  },
                  {
                      cfkey: 'KEY_POINT_SHARE',
                      value: this.formValidate.KEY_POINT_SHARE_VALUE,
                      status: this.formValidate.KEY_POINT_SHARE_STATUS ? config.XstCompanySetting.STATUS_OK : config.XstCompanySetting.STATUS_INVALID,
                  },
                  {
                      cfkey: 'KEY_POINT_SHARE_APPLY',
                      value: this.formValidate.KEY_POINT_SHARE_APPLY_VALUE,
                      status: this.formValidate.KEY_POINT_SHARE_APPLY_STATUS ? config.XstCompanySetting.STATUS_OK : config.XstCompanySetting.STATUS_INVALID,
                  },
                  // {
                  //     cfkey: 'KEY_POINT_SHARE_SUCCESS',
                  //     value: this.formValidate.KEY_POINT_SHARE_SUCCESS_VALUE,
                  //     status: this.formValidate.KEY_POINT_SHARE_SUCCESS_STATUS ? config.XstCompanySetting.STATUS_OK : config.XstCompanySetting.STATUS_INVALID,
                  // },
              ]

              let submitData = {
                setting: setting
              }
              let url = "/api/company/setting/update"
              this.$http.post(url, submitData).then(res => {
                  if(res) {
                      this.$Message.success('更新学币配置成功!')

                      // var _this = this
                      // setTimeout(function () {
                      //     _this.$router.push({
                      //         path: 'student',
                      //         query: {}
                      //     })
                      // },200)
                  }
              }).catch(error => {
                  this.$Message.error(error.message)
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
