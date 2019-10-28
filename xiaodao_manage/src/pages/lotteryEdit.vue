<template>
  <div>
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>营销管理</BreadcrumbItem>
        <BreadcrumbItem>抽奖游戏</BreadcrumbItem>
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

        <!--<Row>-->
        <!--<Col span="12">-->
        <!--<FormItem label="单价" prop="price" style="position: relative">-->
        <!--<Input number v-model="formValidate.price" placeholder="请输入报名活动价格，如果免费请不填"></Input>-->
        <!--<span class="fieldUnit">元</span>-->
        <!--</FormItem>-->
        <!--</Col>-->
        <!--</Row>-->

        <Row>
          <Col span="12">
          <FormItem label="抽奖次数上限" prop="lottery_limit_draw" style="position: relative;margin-bottom: 6px">
            <Input number v-model="formValidate.lottery_limit_draw" placeholder="请输入每人抽奖次数上限"></Input>
            <span class="fieldUnit">次</span>
          </FormItem>
          <p style="margin-bottom: 24px;margin-top: 8px;margin-left: 100px;color: #666666;font-size: 12px;">
            *&nbsp;设定抽奖次数上限值，避免一个人重复多次抽奖</p>
          </Col>
        </Row>

        <Row v-if="!isAdd">
          <Col span="12">
          <FormItem label="状态" prop="publish">
            <Select v-model="formValidate.publish" style="width:200px">
              <Option v-for="item in publishList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
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
          <FormItem label="奖品有效期至" prop="giftLimitDate">
            <DatePicker v-model="formValidate.giftLimitDate" type="date" format="yyyy-MM-dd"
                        placeholder="奖品有效期限" style="width: 100%"></DatePicker>
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

    <!--奖品设置-->
    <div class="container activity_edit_container grouponSetting mt20">
      <p class="content_title">奖品设置</p>
      <Form ref="lotteryFormValidate" :model="lotteryFormValidate" :rules="lotteryRuleValidate" :label-width="100"
            class="mt20">
        <Row>
          <Col span="24">
          <div v-for="(lottery, index) in lotteryFormValidate.lotteryItems" v-if="!lottery.is_participant">
            <Col span="5">
            <FormItem label="奖品类型" :key="index" :prop="'lotteryItems.' + index + '.type'"
                      :rules="[{required: true,message: '请选择奖品类型', trigger: 'blur'}]">
              <Select v-model="lottery.type">
                <Option v-for="item in lotteryTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="5">
            <FormItem label="奖品名称" :key="index" :prop="'lotteryItems.' + index + '.name'"
                      :rules="[{required: true,message: '请填写奖品名称', trigger: 'blur'}]">
              <Input type="text" v-model="lottery.name" placeholder="请填写奖品名称"></Input>
            </FormItem>
            </Col>
            <Col span="5">
            <FormItem label="奖品数量" :key="index" :prop="'lotteryItems.' + index + '.num'"
                      :rules="[{required: true,message: '请填写奖品数量', trigger: 'blur'}]">
              <Input type="text" v-model="lottery.num" placeholder="请填写奖品数量"></Input>
            </FormItem>
            </Col>
            <Col span="5">
            <FormItem label="中奖概率" :key="index" :prop="'lotteryItems.' + index + '.probability'"
                      :rules="[{required: true,message: '请填写中奖概率', trigger: 'blur'}]">
              <Input type="text" v-model="lottery.probability" placeholder="请填写中奖概率"></Input>
              <span class="fieldUnit">%</span>
            </FormItem>
            </Col>

            <Col span="2">
            &nbsp;&nbsp;<Button class="ml40" @click="removeLotteryItem(index)">删除</Button>
            </Col>
          </div>
          <Col span="24">
          <Button type="dashed" style="margin-left: 90px;" @click="addLotteryItem" icon="md-add">新增奖品</Button>
          </Col>
          </Col>
        </Row>
      </Form>
    </div>

    <!--参与奖设置-->
    <div class="container activity_edit_container grouponSetting mt20">
      <p class="content_title">
        参与奖<span style="font-size: 12px;color: #666;font-weight: 400;">（当家长没有抽到别的奖品的时候，将会获得参与奖）</span>
      </p>
      <Form ref="lotteryFormValidate" :model="lotteryFormValidate" :rules="lotteryRuleValidate" :label-width="100"
            class="mt20">
        <Row>
          <Col span="24">
          <div v-for="(lottery, index) in lotteryFormValidate.lotteryItems" v-if="lottery.is_participant">
            <Col span="5">
            <FormItem label="奖品类型" :key="index" :prop="'lotteryItems.' + index + '.type'"
                      :rules="[{required: true,message: '请选择奖品类型', trigger: 'blur'}]">
              <Select v-model="lottery.type">
                <Option v-for="item in lotteryTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            </Col>
            <Col span="5">
            <FormItem label="奖品名称" :key="index" :prop="'lotteryItems.' + index + '.name'"
                      :rules="[{required: true,message: '请填写奖品名称', trigger: 'blur'}]">
              <Input type="text" v-model="lottery.name" placeholder="请填写奖品名称"></Input>
            </FormItem>
            </Col>
            <Col span="5">
            <FormItem label="奖品数量" :key="index" :prop="'lotteryItems.' + index + '.num'"
                      :rules="[{required: true,message: '请填写奖品数量', trigger: 'blur'}]">
              <Input type="text" v-model="lottery.num" placeholder="请填写奖品数量"></Input>
            </FormItem>
            </Col>

            <!--<Col span="5">-->
            <!--<FormItem label="中奖概率" :key="index" :prop="'lotteryItems.' + index + '.probability'"-->
            <!--:rules="[{required: true,message: '请填写中奖概率', trigger: 'blur'}]">-->
            <!--<Input type="text" v-model="lottery.probability" placeholder="请填写中奖概率"></Input>-->
            <!--<span class="fieldUnit">%</span>-->
            <!--</FormItem>-->
            <!--</Col>-->
          </div>

          </Col>
        </Row>
      </Form>
    </div>


    <div class="container activity_edit_container mt20">
      <p class="content_title">奖品介绍</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" class="mt20">
        <Row>
          <Col span="12">
          <FormItem label="介绍信息" prop="lotteryIntro">
            <Input v-model="formValidate.lottery_intro" type="textarea" :autosize="{minRows: 5,maxRows: 10}"
                   placeholder="请输入介绍信息"></Input>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
          <fileUpload v-if="getDataDown" :imglink="formValidate.lottery_intro_imglink" label="介绍图片" :limit="2"
                      v-on:fileupload="lotteryIntroFileUpload"></fileUpload>
          </Col>
        </Row>
      </Form>
    </div>

    <!--<div class="bottomBtn">-->
      <!--<Button size="large" type="primary" @click="handleSubmit()">提交</Button>-->
      <!--<Button size="large" @click="handleReset()" style="margin-left: 8px">取消</Button>-->
    <!--</div>-->

    <div class="bottomBtn" v-if="isAdd">
      <Button size="large" @click="handleSubmit(config.Activity.PUBLISH_HOLD)" type="primary">保存</Button>
      <Button size="large" @click="handleSubmit(config.Activity.PUBLISH_ON)" style="margin-left: 8px">保存并发布</Button>
    </div>
    <div class="bottomBtn" v-else>
      <Button size="large" @click="handleSubmit()" type="primary">提交</Button>
      <Button size="large" style="margin-left: 8px" @click="back">返回</Button>
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
        config: {},
        mid: 0,
        activityType: 0,
        title: "",
        detailTitle: "",
        detail: "",
        getDataDown: false,
        isAdd: true,
        publishList: [],
        content: '',
        imgCategory: [],
        totalImgNum: 0,
        curImgCategory: 0,
        uploadImgList: [],
        detailUploadFileName: '',
        ckConfig: {
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
          publish: 0,
          desc: '',
          price: '',
          maxNumRadio: 'havnt',
          max_num: '',
          lottery_limit_draw: '',
          timeRange: '',
          giftLimitDate: '',
          lottery_intro: ''
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
        lotteryFormValidate: {
          lotteryItems: [
            {
              type: 0,
              name: '',
              num: '',
              probability: '',
              is_participant: 0
            },
            {
              type: 0,
              name: '',
              num: '',
              probability: '',
              is_participant: 1
            }
          ],
          participation: {}
        },
        lotteryTypeList: [],
        lotteryRuleValidate: {},

        /*图片上传*/
        uploadList: [],
        detailUploadList: [],
        imgName: '',
        viewImg: false,
        showAddImgCategory1: false,
        img_category_name: '',
        /*图片上传结束*/
      }
    },
    created() {
      this.activityType = config.Activity.TYPE_LOTTERY
      this.config = config
      this.publishList = [
        {
          label: '待发布',
          value: config.Activity.PUBLISH_HOLD
        },
        {
          label: '已发布',
          value: config.Activity.PUBLISH_ON
        },
        {
          label: '已下架',
          value: config.Activity.PUBLISH_OUT
        }
      ]

      this.lotteryTypeList = [
        {
          value: config.LotteryGoods.TYPE_PHYSICAL,
          label: '实体奖品'
        },
        {
          value: config.LotteryGoods.TYPE_COUPON,
          label: '优惠券'
        },
        {
          value: config.LotteryGoods.TYPE_EXPERIENCE,
          label: '体验课'
        },
      ]

      if (this.$route.query.id) {
        this.title = "编辑"
        this.isAdd = false

        let _this = this
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
            console.log('timeRange',timeRange)

            var futureTime = new Date().getTime() + 24*60*60*1000*90
            var giftLimitDate = new Date()
            data.lottery_gift_limit_time ? giftLimitDate.setTime(data.lottery_gift_limit_time * 1000) : giftLimitDate.setTime(futureTime)
            console.log('giftLimitDate',giftLimitDate)

            this.formValidate = data
            this.formValidate.maxNumRadio = data.max_num ? 'have' : 'havnt'
            this.formValidate.timeRange = timeRange
            this.formValidate.giftLimitDate = giftLimitDate

            this.activityType = data.type

            this.detail = data.detail
            this.getDataDown = true
          }
        }).catch(error => {
          console.log('error', error)
          this.$Message.error(error.message);
        })

        _this.getLotteryGoods(_this.$route.query.id)
      } else {
        this.title = "新增"
        this.isAdd = true

        this.detail = ""
        this.getDataDown = true
      }
    },
    mounted() {
      this.ACTION_URL = config.Qiniu.ACTION_URL
    },
    computed: {
    },
    methods: {
      getLotteryGoods(activity_id) {
        let _this = this
        let submitData = {
          activity_id: activity_id
        }
        let url = lib.getRequestUrl('/api/lottery/goods/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          _this.lotteryFormValidate.lotteryItems = res.data.data
        }).catch(error => {
          console.log('error', error)
          this.$Message.error(error.message);
        })
      },
      addLotteryItem() {
        this.lotteryFormValidate.lotteryItems.push({
          type: 0,
          name: '',
          num: '',
          probability: '',
          is_participant: 0
        })
      },
      removeLotteryItem(index) {
        this.lotteryFormValidate.lotteryItems.splice(index, 1)
      },
      handleSubmit(publish) {
        console.log('publish1',publish)

        var timeRange = this.formValidate.timeRange
        console.log('timeRange', timeRange)
        var time1 = timeRange[0]
        var time2 = timeRange[1]
        console.log('time1', time1)
        var startTime = Math.ceil(new Date(timeRange[0]).getTime() / 1000)
        var endTime = Math.ceil(new Date(timeRange[1]).getTime() / 1000)

        var giftLimitDateTime = this.formValidate.giftLimitDate.getTime() / 1000


        var normalLotteryProbabilitySum = 0
        console.log('this.lotteryFormValidate.lotteryItems', this.lotteryFormValidate.lotteryItems)
        this.lotteryFormValidate.lotteryItems.map(function (item) {
          if (!item.is_participant) {
            normalLotteryProbabilitySum += Number(item.probability)
          }
        })

        console.log('normalLotteryProbabilitySum', normalLotteryProbabilitySum)
        if (normalLotteryProbabilitySum > 100) {
          this.$Message.error('奖品总的获奖概率不能超过100%')
          return
        }

        this.lotteryFormValidate.lotteryItems.map(function (item) {
          if (item.is_participant) {
            item.probability = 100 - normalLotteryProbabilitySum
          }
        })

        let submitData = {
          name: this.formValidate.name,
          publish: lib.isset(publish) ? publish : this.formValidate.publish,
          desc: this.formValidate.desc,
          price: this.formValidate.price,
          max_num: this.formValidate.max_num,
          lottery_limit_draw: this.formValidate.lottery_limit_draw,
          start_time: startTime,
          end_time: endTime,
          lottery_gift_limit_time: giftLimitDateTime,
          detail: this.detail,
          type: config.Activity.TYPE_LOTTERY,
          imglink: this.formValidate.imglink,
          lottery_intro: this.formValidate.lottery_intro,
          lottery_intro_imglink: this.formValidate.lottery_intro_imglink,
          lotteryItems: this.lotteryFormValidate.lotteryItems
        }
        let url
        if (this.isAdd) {
          url = "/api/activity/add"
        } else {
          submitData.id = this.formValidate.id
          url = "/api/activity/update"
        }

        this.$http.post(url, submitData).then(res => {
          if (res.data.errNo == 100000) {
            this.$Message.success(this.title + '成功!')
            this.back(200)
          }
        }).catch(error => {
          console.log(error)
          this.$Message.error(error.message)
        })
      },
      back(afterTimes) {
        afterTimes = afterTimes && (typeof afterTimes === 'number' && !isNaN(afterTimes)) ? afterTimes : 0
        var path = 'lottery'
        setTimeout(()=>{
          this.$router.push({
            path: path,
            query: {}
          })
        }, afterTimes)
      },
      lotteryIntroFileUpload(uploadfile) {
        this.formValidate.lottery_intro_imglink = lib.getUpdateUploadPicStr(uploadfile)
      },
      imglinkFileUpload(uploadfile) {
        this.formValidate.imglink = lib.getUpdateUploadPicStr(uploadfile)
      },
    },
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
