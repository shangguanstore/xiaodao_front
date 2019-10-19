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
      <Form v-if="false" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" class="mt20">
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

      <Row>
        <Col span="14">
        <Table border stripe ref="promotion" :loading="loading" :columns="columns" :data="pointRuleList"
               class="mt20"></Table>
        </Col>
      </Row>

    </div>

    <Modal
      v-model="showEditBox"
      width:="480"
      :styles="{top: '200px'}"
    >
      <p slot="header">
        <span>{{editTitle}}</span>
      </p>

      <div>
        <div class="comment-tip" v-show="editTip">
          <i class="icon iconfont icon-tishi"></i>
          <span>{{editTip}}</span>
        </div>

        <p v-show="editCfkey == config.XstCompanySetting.KEY_POINT_REGISTER" class="mt20 ml20">
          <span>新用户注册，获得</span>
          <Input v-model="editFormValidate.KEY_POINT_REGISTER" style="width: 100px" />
          <span>个学币</span>
        </p>

        <p v-show="editCfkey == config.XstCompanySetting.KEY_POINT_SHARE" class="mt20 ml20">
          <span>通过机构小程序分享课程、活动等，成功分享一次获得</span>
          <Input v-model="editFormValidate.KEY_POINT_SHARE" style="width: 100px" />
          <span>个学币</span>
        </p>

        <p v-show="editCfkey == config.XstCompanySetting.KEY_POINT_SHARE_APPLY" class="mt20 ml20">
          <span>学员每转介绍1人，获得</span>
          <Input v-model="editFormValidate.KEY_POINT_SHARE_APPLY" style="width: 100px" />
          <span>个学币</span>
        </p>

        <p v-show="editCfkey == config.XstCompanySetting.KEY_POINT_COURSE_CONSUME" class="mt20 ml20">
          <span>学员每课消</span>
          <Input v-model="editFormValidate.KEY_POINT_COURSE_CONSUME.course_num" style="width: 100px" />
          <span>课时，获得</span>
          <Input v-model="editFormValidate.KEY_POINT_COURSE_CONSUME.num" style="width: 100px" />
          <span>个学币</span>
        </p>

        <p v-show="editCfkey == config.XstCompanySetting.KEY_POINT_PURCHASE_CARD" class="mt20 ml20">
          <span>学员签合同收款每满</span>
          <Input v-model="editFormValidate.KEY_POINT_PURCHASE_CARD.money" style="width: 100px" />
          <span>元，获得</span>
          <Input v-model="editFormValidate.KEY_POINT_PURCHASE_CARD.num" style="width: 100px" />
          <span>个学币</span>
        </p>

        <p v-show="editCfkey == config.XstCompanySetting.KEY_POINT_PURCHASE_DEDUCTION" class="mt20 ml20">
          <span>学员签合同时每</span>
          <Input v-model="editFormValidate.KEY_POINT_PURCHASE_DEDUCTION.num" style="width: 100px" />
          <span>分，可抵学费</span>
          <Input v-model="editFormValidate.KEY_POINT_PURCHASE_DEDUCTION.money" style="width: 100px" />
          <span>元</span>
        </p>

      </div>

      <div slot="footer">
        <Button type="default" @click="handleCancel" style="margin-left: 8px">取消</Button>
        <Button type="primary" @click="handleUpdate">提交</Button>
      </div>
    </Modal>
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
        config: {},
        title: "",
        isAdd: true,
        loading: false,
        pointRuleList: [],
        showEditBox: false,
        editTitle: '',
        editTip: '',
        editCfkey: '',
        columns: [
          {
            title: '类型',
            key: 'type',
          },
          {
            title: '内容',
            key: 'content',
          },
          {
            title: '操作',
            key: 'operation',
            // width:220,
            // fixed:"right",
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  style: {
                    color: '#2db7f5',
                    marginLeft: '20px'
                  },
                  on: {
                    click: () => {
                      this.update(params)
                    }
                  }
                }, '修改'),
                h('i-switch', {
                  props: {
                    size: 'large',
                    value: params.row.status == config.XstCompanySetting.STATUS_OK ? true : false
                  },
                  style: {
                    color: '#2db7f5'
                  },
                  on: {
                    'on-change': () => {
                      this.changeValid(params)
                    }
                  }
                }, [
                  h('span', {
                    slot: 'open',
                    domProps: {
                      innerHTML: '有效'
                    }
                  }),
                  h('span', {
                    slot: 'close',
                    domProps: {
                      innerHTML: '无效'
                    }
                  })
                ]),
              ])
            }
          }
        ],
        editFormValidate: {
          KEY_POINT_REGISTER: 0,
          KEY_POINT_SHARE: 0,
          KEY_POINT_SHARE_APPLY: 0,
          KEY_POINT_COURSE_CONSUME: {},
          KEY_POINT_PURCHASE_CARD: {},
          KEY_POINT_PURCHASE_DEDUCTION: {},
        },
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
            {required: true, type: 'number', message: '请输入学币', trigger: 'blur'}
          ],
          KEY_POINT_SHARE_VALUE: [
            {required: true, type: 'number', message: '请输入学币', trigger: 'blur'}
          ],
          KEY_POINT_SHARE_APPLY_VALUE: [
            {required: true, type: 'number', message: '请输入学币', trigger: 'blur'}
          ],
          // KEY_POINT_SHARE_SUCCESS_VALUE: [
          //     {required: true, type: 'number',message: '请输入学币', trigger: 'blur'}
          // ],
        }
      }
    },
    created() {
      this.getSettingData()
      this.config = config
    },
    mounted() {

    },
    methods: {
      update(params) {
        this.showEditBox = true
        this.editCfkey = params.row.cfkey
        if(this.editCfkey == config.XstCompanySetting.KEY_POINT_REGISTER) {
          this.editTitle = '注册加学币'
          this.editTip = '新用户首次注册获得学币'
          this.editFormValidate.KEY_POINT_REGISTER = params.row.value
        }else if(this.editCfkey == config.XstCompanySetting.KEY_POINT_SHARE) {
          this.editTitle = '分享加学币'
          this.editTip = '机构小程序分享课程、活动获得学币'
          this.editFormValidate.KEY_POINT_SHARE = params.row.value
        }else if(this.editCfkey == config.XstCompanySetting.KEY_POINT_SHARE_APPLY) {
          this.editTitle = '转介绍加分'
          this.editTip = ''
          this.editFormValidate.KEY_POINT_SHARE_APPLY = params.row.value
        } else if(this.editCfkey == config.XstCompanySetting.KEY_POINT_COURSE_CONSUME) {
          this.editTitle = '课消加分'
          this.editTip = '扣费时根据课消奖励对应学币，取消扣费将减少对应学币'
          this.editFormValidate.KEY_POINT_COURSE_CONSUME = params.row.value
        } else if(this.editCfkey == config.XstCompanySetting.KEY_POINT_PURCHASE_CARD) {
          this.editTitle = '签约加分'
          this.editTip = '仅限于签合同收款奖励学币，奖励学币值取整'
          this.editFormValidate.KEY_POINT_PURCHASE_CARD = params.row.value
        } else if(this.editCfkey == config.XstCompanySetting.KEY_POINT_PURCHASE_DEDUCTION) {
          this.editTitle = '积分抵学费减分'
          this.editTip = ''
          this.editFormValidate.KEY_POINT_PURCHASE_DEDUCTION = params.row.value
        }
      },
      changeValid(params) {
        params.row.status = params.row.status == config.XstCompanySetting.STATUS_OK ? config.XstCompanySetting.STATUS_INVALID : config.XstCompanySetting.STATUS_OK
        let submitData = {
          setting: [params.row]
        }
        let url = "/api/company/setting/update"
        this.$http.post(url, submitData).then(res => {
          this.$Message.success('更新状态成功！')
          this.getSettingData()
        }).catch(error => {
          this.$Message.error(error.message)
          this.getSettingData()
        })
      },
      handleUpdate() {
        let submitData = {
          setting: [{
            cfkey: this.editCfkey,
            value: this.editFormValidate[this.editCfkey]
          }]
        }
        let url = "/api/company/setting/update"
        this.$http.post(url, submitData).then(res => {
          this.showEditBox = false
          this.$Message.success('更新成功！')
          this.getSettingData()
        }).catch(error => {
          this.$Message.error(error.message)
          this.getSettingData()
        })
      },
      handleCancel() {
        this.showEditBox = false
      },
      getSettingData() {
        this.loading = true
        let submitData = {
          cfkey: [
            config.XstCompanySetting.KEY_POINT_REGISTER,
            config.XstCompanySetting.KEY_POINT_SHARE,
            config.XstCompanySetting.KEY_POINT_SHARE_APPLY,
            config.XstCompanySetting.KEY_POINT_COURSE_CONSUME,
            config.XstCompanySetting.KEY_POINT_PURCHASE_CARD,
            config.XstCompanySetting.KEY_POINT_PURCHASE_DEDUCTION,
          ]
        }
        let url = '/api/company/setting/getlist'
        this.$http.post(url, submitData).then(res => {
          if (res) {
            var data = res.data.data

            let ruleList = []
            ruleList.push({
              cfkey: config.XstCompanySetting.KEY_POINT_REGISTER,
              type: '注册',
              content: `注册获得${data[config.XstCompanySetting.KEY_POINT_REGISTER].value}学币`,
              status: data[config.XstCompanySetting.KEY_POINT_REGISTER].status,
              value: data[config.XstCompanySetting.KEY_POINT_REGISTER].value,
            })
            ruleList.push({
              cfkey: config.XstCompanySetting.KEY_POINT_SHARE,
              type: '分享',
              content: `每分享一人获得${data[config.XstCompanySetting.KEY_POINT_SHARE].value}学币`,
              status: data[config.XstCompanySetting.KEY_POINT_SHARE].status,
              value: data[config.XstCompanySetting.KEY_POINT_SHARE].value,
            })
            ruleList.push({
              cfkey: config.XstCompanySetting.KEY_POINT_SHARE_APPLY,
              type: '转介绍',
              content: `每转介绍一人获得${data[config.XstCompanySetting.KEY_POINT_SHARE_APPLY].value}学币`,
              status: data[config.XstCompanySetting.KEY_POINT_SHARE_APPLY].status,
              value: data[config.XstCompanySetting.KEY_POINT_SHARE_APPLY].value,
            })
            ruleList.push({
              cfkey: config.XstCompanySetting.KEY_POINT_COURSE_CONSUME,
              type: '课消',
              content: `学员每课消${data[config.XstCompanySetting.KEY_POINT_COURSE_CONSUME].value.course_num}课时，获得${data[config.XstCompanySetting.KEY_POINT_COURSE_CONSUME].value.num}学币`,
              status: data[config.XstCompanySetting.KEY_POINT_COURSE_CONSUME].status,
              value: data[config.XstCompanySetting.KEY_POINT_COURSE_CONSUME].value,
            })
            ruleList.push({
              cfkey: config.XstCompanySetting.KEY_POINT_PURCHASE_CARD,
              type: '签约',
              content: `每满${data[config.XstCompanySetting.KEY_POINT_PURCHASE_CARD].value.money}元，获得${data[config.XstCompanySetting.KEY_POINT_PURCHASE_CARD].value.num}学币`,
              status: data[config.XstCompanySetting.KEY_POINT_PURCHASE_CARD].status,
              value: data[config.XstCompanySetting.KEY_POINT_PURCHASE_CARD].value,
            })
            ruleList.push({
              cfkey: config.XstCompanySetting.KEY_POINT_PURCHASE_DEDUCTION,
              type: '抵扣',
              content: `学员签合同时每${data[config.XstCompanySetting.KEY_POINT_PURCHASE_DEDUCTION].value.num}分，可低学费${data[config.XstCompanySetting.KEY_POINT_PURCHASE_DEDUCTION].value.money}元`,
              status: data[config.XstCompanySetting.KEY_POINT_PURCHASE_DEDUCTION].status,
              value: data[config.XstCompanySetting.KEY_POINT_PURCHASE_DEDUCTION].value,
            })

            this.pointRuleList = ruleList
            this.loading = false
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

      handleSubmit(name) {
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
              if (res) {
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
      handleReset(name) {
        this.$refs[name].resetFields();
      },
    },
  }
</script>
<style>

</style>
