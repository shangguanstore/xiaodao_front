<template>
  <div>
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>营销管理</BreadcrumbItem>
        <BreadcrumbItem>活动报名</BreadcrumbItem>
        <BreadcrumbItem>{{title}}</BreadcrumbItem>
      </Breadcrumb>
    </div>


    <div class="container activity_edit_container mt20">
      <p class="content_title">基本信息</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" class="mt20">
        <Row>
          <Col span="12">
            <FormItem label="名称" prop="name">
              <Input v-model="formValidate.name" placeholder="请输入活动名称（微信分享标题用此名称）"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
            <FormItem label="简介" prop="desc">
              <Input v-model="formValidate.desc" placeholder="请输入活动简介"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
            <FormItem label="单价" prop="price" style="position: relative">
              <Input number v-model="formValidate.price" placeholder="请输入报名活动价格，如果免费请不填"></Input>
              <span class="fieldUnit">元</span>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="4">
            <FormItem label="人数上限">
              <RadioGroup v-model="formValidate.maxNumRadio">
                <Radio label="have">有</Radio>
                <Radio label="havnt">无</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="8" style="position: relative" v-if="formValidate.maxNumRadio == 'have'">
            <Input number v-model="formValidate.max_num" placeholder="请输入最大报名人数"></Input> <span class="fieldUnit">人</span>
          </Col>
        </Row>

        <Row>
          <Col span="12">
            <FormItem label="活动时间" prop="timeRange">
              <DatePicker v-model="formValidate.timeRange" type="datetimerange" format="yyyy-MM-dd HH:mm"
                          placeholder="选择日期和时间" style="width: 100%"></DatePicker>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
          <fileUpload v-if="getDataDown" :imglink="formValidate.imglink" label="封面图片" :limit="1"
                      v-on:fileupload="imglinkFileUpload"></fileUpload>
          </Col>
        </Row>
      </Form>
    </div>

    <div class="container activity_edit_container grouponSetting mt20" v-if="activityType == 1">
      <p class="content_title">团购设置</p>
      <Form ref="grouponFormValidate" :model="grouponFormValidate" :rules="grouponRuleValidate" :label-width="100"
            class="mt20">
        <Row>
          <Col span="12">
            <FormItem label="团购价格" prop="group_price" style="position: relative">
              <Input number v-model="grouponFormValidate.group_price" placeholder="请输入团购价"></Input>
              <span class="fieldUnit">元</span>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
            <FormItem label="成团人数" prop="group_num" style="position: relative">
              <Input number v-model="grouponFormValidate.group_num" placeholder="请输入成团人数"></Input>
              <span class="fieldUnit">人</span>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
            <FormItem label="开放团购时间" prop="timeRange">
              <DatePicker v-model="grouponFormValidate.timeRange" type="datetimerange" format="yyyy-MM-dd HH:mm"
                          placeholder="选择日期和时间" style="width: 100%"></DatePicker>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>

    <div class="container activity_edit_container articleDetailList mt20">
      <p class="content_title">
        详细信息
      </p>
      <ckeditor v-if="getDataDown" id="aaabbbccc" v-model="detail" :config="config" @blur="onBlur($event)"
                @focus="onFocus($event)" @insertPic="detailInsertPic">
      </ckeditor>
    </div>


    <div class="bottomBtn">
      <Button size="large" type="primary" @click="handleSubmit()">提交</Button>
      <Button size="large" @click="handleReset()" style="margin-left: 8px">取消</Button>
    </div>
  </div>
</template>

<script>
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'
  import ckeditor from '@/components/ckeditor'
  import fileUpload from '@/components/fileUpload'

  export default {
    name: 'staffEdit',
    components: {
      ckeditor,
      fileUpload
    },
    data() {
      return {
        mid: 0,
        activityType: 0,
        title: "",
        detailTitle: "",
        detail: "",
        getDataDown: false,
        isAdd: true,
        content: '',

        uploadImgList: [],
        detailUploadFileName: '',
        config: {
          language: 'zh-cn',
          toolbar: [
            {name: 'document', items: ['Print']},
            {name: 'clipboard', items: ['Undo', 'Redo']},
            {name: 'styles', items: ['Format', 'Font', 'FontSize']},
            {name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat', 'CopyFormatting']},
            {name: 'colors', items: ['TextColor', 'BGColor']},
            {name: 'align', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']},
            {name: 'links', items: ['Link', 'Unlink']},
            {name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote']},
            {name: 'insert', items: ['Image', 'Table']},
            {name: 'tools', items: ['Maximize']},
            {name: 'editing', items: ['Scayt']}
          ],
          height: 400,
          width: 700
        },
        showPicModal: false,
        formValidate: {
          name: '',
          desc: '',
          price: '',
          maxNumRadio: 'havnt',
          max_num: '',
          timeRange: ''
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'}
          ],
          desc: [
            {required: true, message: '请输入活动简介', trigger: 'blur'}
          ],
          max_num: [{
            required: true,
            type: 'number',
            message: '您填写的格式错误，请输入数字',
            trigger: 'blur'
          }],
        },
        grouponFormValidate: {
          group_num: '',
          group_price: '',
          timeRange: ''
        },
        grouponRuleValidate: {
          group_num: [{
            required: true,
            type: 'number',
            message: '您填写的格式错误，请输入数字',
            trigger: 'blur'
          }],
          group_price: [{
            required: true,
            type: 'number',
            message: '您填写的格式错误，请输入数字',
            trigger: 'blur'
          }],
        },

        uploadList: [],
      }
    },
    created() {
      this.activityType = this.$route.query.type ? this.$route.query.type : config.Activity.TYPE_NORMAL
      if (this.$route.query.id) {
        this.title = "编辑活动"
        this.isAdd = false
        let submitData = {
          id: this.$route.query.id,
          queryDetail: true,
        }
        let url = lib.getRequestUrl('/api/activity/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          if (res) {
            let data = res.data.data[0]
            var startTimeDate = new Date().setTime(data.start_time * 1000)
            var endTimeDate = new Date().setTime(data.end_time * 1000)
            var timeRange = [startTimeDate, endTimeDate];
            console.log('timeRange', timeRange)

            this.formValidate = data
            this.formValidate.maxNumRadio = data.max_num ? 'have' : 'havnt'
            this.formValidate.timeRange = timeRange

            this.activityType = data.type
            if (this.activityType == config.Activity.TYPE_GROUPON) {
              this.grouponFormValidate.group_num = data.group_num
              this.grouponFormValidate.group_price = data.group_price
              var groupStartTimeDate = new Date().setTime(data.group_start_time * 1000)
              var groupEndTimeDate = new Date().setTime(data.group_end_time * 1000)
              var groupTimeRange = [new Date(groupStartTimeDate), new Date(groupEndTimeDate)]
              console.log('groupTimeRange', groupTimeRange)
              this.grouponFormValidate.timeRange = groupTimeRange
            }

            this.detail = data.detail
            this.getDataDown = true
          }
        }).catch(error => {
          console.log('error', error)
          this.$Message.error('服务器错误!');
        })
      } else {
        this.title = "新增活动"
        this.isAdd = true

        this.detail = ""
        this.getDataDown = true
      }
    },
    mounted() {
    },
    computed: {
    },
    methods: {
      handleSubmit() {
        var timeRange = this.formValidate.timeRange
        var time1 = timeRange[0]
        var time2 = timeRange[1]
        var startTime = Math.ceil(new Date(timeRange[0]).getTime() / 1000)
        var endTime = Math.ceil(new Date(timeRange[1]).getTime() / 1000)

        let submitData = {
          type: config.Activity.TYPE_NORMAL,
          name: this.formValidate.name,
          desc: this.formValidate.desc,
          price: this.formValidate.price,
          max_num: this.formValidate.max_num,
          start_time: startTime,
          end_time: endTime,
          detail: this.detail,
          imglink: this.formValidate.imglink
        }
        let url
        if (this.isAdd) {
          url = "/api/activity/add"
        } else {
          submitData.id = this.formValidate.id
          url = "/api/activity/update"
        }

        if (this.activityType == config.Activity.TYPE_GROUPON) {
          var timeRange = this.grouponFormValidate.timeRange
          var startTime = Math.ceil(new Date(timeRange[0]).getTime() / 1000)
          var endTime = Math.ceil(new Date(timeRange[1]).getTime() / 1000)
          submitData.type = config.Activity.TYPE_GROUPON
          submitData.group_num = this.grouponFormValidate.group_num
          submitData.group_price = this.grouponFormValidate.group_price
          submitData.group_start_time = startTime
          submitData.group_end_time = endTime
        }

        this.$http.post(url, submitData).then(res => {
          if (res.data.errNo == 100000) {
            this.$Message.success(this.title + '成功!')
            var _this = this
            var path = 'activity'
            if (this.activityType == config.Activity.TYPE_GROUPON) {
              path = 'groupon'
            }
            setTimeout(function () {
              _this.$router.push({
                path: path,
                query: {}
              })
            }, 200)
          }
        }).catch(error => {
          console.log(error)
          this.$Message.error('服务器错误!')
        })
      },
      imglinkFileUpload(uploadfile) {
        this.formValidate.imglink = lib.getUpdateUploadPicStr(uploadfile)
      },
      detailInsertPic(insert) {
        this.detail += insert
      }
    }
  }
</script>
<style lang="less">
  .rightBtnList {
    position: fixed;
    top: 200px;
    right: 178px;
  }

  .activity_edit_container {
    width: 80%;
  }

  .imgListBtn {
    span {
      margin-left: 4px;
      font-size: 15px;
    }
  }

  .picDialog {
    .title {
      padding: 20px 30px;
      color: #222;
      font-size: 18px;
      .titleName {

      }
      .close {
        cursor: pointer;
      }
    }

    .imgContainer {
      width: 100%;
      height: 479px;
      overflow: hidden;
      .imgCategory {
        width: 16%;
        height: 479px;
        border-right: solid 1px #e7e7eb;
        ul {
          margin-top: 10px;
          height: 400px;
          overflow-y: scroll;
          li {
            padding: 5px 0;
            text-align: center;
            cursor: pointer;
            &:hover {
              background: #f4f5f9;
            }
            strong {
              font-size: 14px;
            }
            em {
              padding-left: 3px;
              color: #8d8d8d;
            }
            &.active {
              background: #f4f5f9;
            }
          }
        }
      }

      .imgContent {
        width: 80%;
        height: 479px;
        .top {
          height: 53px;
          line-height: 53px;
          border-bottom: solid 1px #e7e7eb;
        }
        .content {
          overflow: scroll;
          height: 479px;
          .imgListArea {
            display: inline-block;
            .uploadList {
              .imgItem {
                position: relative;
                margin-right: 11px;
                margin-bottom: 10px;
                float: left;
                text-align: center;
                .picBox {
                  width: 117px;
                  height: 117px;
                  position: relative;
                  overflow: hidden;
                  img {
                    height: 117px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    border-bottom: solid 1px #e7e7eb;
                  }
                  .selected {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 118px;
                    height: 118px;
                    background: rgba(0, 0, 0, 0.6) url("../assets/img/selected.png") no-repeat center;
                  }
                }
                .picName {
                  height: 32px;
                  line-height: 32px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
              }
            }
          }

        }
      }
    }

  }
</style>
