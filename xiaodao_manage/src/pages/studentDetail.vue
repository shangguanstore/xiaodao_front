<template>
  <div class="student_detail_container">
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>学员</BreadcrumbItem>
        <BreadcrumbItem>学员详情</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div class="container detail_info mt20">
      <p class="content_title">学员信息</p>
      <Row :gutter="60" class="mt20">
        <Col span="6">
        <p class="item">
          <span>姓名：</span>
          <span>{{memberInfo.uname}}</span>
        </p>
        </Col>

        <Col span="6">
        <p class="item">
          <span>联系电话：</span>
          <span>{{memberInfo.phone}}</span>
        </p>
        </Col>

        <Col span="6">
        <p class="item">
          <span>公立学校：</span>
          <span>{{memberInfo.school_name ? memberInfo.school_name : '--'}}</span>
        </p>
        </Col>

        <Col span="6">
        <p class="item">
          <span>性别：</span>
          <span>{{memberInfo.sex_format ? memberInfo.sex_format : '未知'}}</span>
        </p>
        </Col>
      </Row>
      <Row :gutter="60" class="mt20">
        <Col span="6">
        <p class="item">
          <span>母亲手机：</span>
          <span>{{memberInfo.mother_phone ? memberInfo.mother_phone : '--'}}</span>
        </p>
        </Col>

        <Col span="6">
        <p class="item">
          <span>父亲手机：</span>
          <span>{{memberInfo.father_phone ? memberInfo.father_phone : '--'}}</span>
        </p>
        </Col>

        <Col span="6">
        <p class="item">
          <span>备注信息：</span>
          <span>无</span>
        </p>
        </Col>
      </Row>
    </div>

    <div class="container mt20">
      <Tabs value="name1">
        <TabPane label="报读课程" name="name1">
          <div class="courseArea">
            <Row :gutter="20">
              <Col span="2">
              <div class="kapianNav">
                <div class="kapian" v-for="item in cardList" :class="{active: item.id === curCard.id ? true : false, disabled: item.disabled}"
                     @click="changeCard(item.id)">
                  <p>
                    <i class="icon iconfont icon-jingpinkecheng" style="margin-right: 1px;position: relative;top: 2px;font-size: 16px"></i>
                    {{item.company_course_name}}
                  </p>
                  <p style="margin-top: 6px">{{item.des}}</p>
                </div>
              </div>
              </Col>

              <Col span="20" style="overflow: visible">
              <div class="kapianDetail" v-if="cardList.length">
                <ul class="nav float-wrap">
                  <li v-for="(item,index) in kapianDetailNavList" @click="changeKapianDetailNav(item)"
                      :class="{active: item.active,disabled: item.disabled}">
                    <span>{{item.label}}</span>
                  </li>
                </ul>

                <div class="middleContent mt20" style="border: solid 1px #cccccc;padding: 20px">
                  <div v-show="curKapianNav.value == 'gkxx'" class="purchaseInfo">
                    <Form :model="curCard" :label-width="80">
                      <Row :gutter="10">
                        <Col span="8">
                        <FormItem label="课程名称">
                          <Input v-model="curCard.company_course_name" disabled></Input>
                        </FormItem>
                        </Col>

                        <Col span="8">
                        <FormItem label="购买课时">
                          <Input v-model="curCard.num_sum" disabled></Input>
                        </FormItem>
                        </Col>

                        <Col span="8">
                        <FormItem label="剩余课时">
                          <Input v-model="curCard.num" disabled></Input>
                        </FormItem>
                        </Col>
                      </Row>

                      <Row :gutter="10" class="mt20">
                        <Col span="8">
                        <FormItem label="激活日期">
                          <Input v-model="curCard.expire_start_format" disabled></Input>
                        </FormItem>
                        </Col>

                        <Col span="8">
                        <FormItem label="购买日期">
                          <Input v-model="curCard.create_time_format" disabled></Input>
                        </FormItem>
                        </Col>

                        <Col span="8">
                        <FormItem label="截止日期">
                          <Input v-model="curCard.expire_end_format" disabled></Input>
                        </FormItem>
                        </Col>
                      </Row>

                      <Row :gutter="10" class="mt20">
                        <Col span="8">
                        <FormItem label="购买价格">
                          <Input v-model="curCard.price_format" disabled></Input>
                        </FormItem>
                        </Col>

                        <Col span="8">
                        <FormItem label="实付金额">
                          <Input v-model="curCard.real_price_format" disabled></Input>
                        </FormItem>
                        </Col>
                      </Row>
                    </Form>
                  </div>

                  <div v-show="curKapianNav.value == 'cz'">
                    <Form ref="rechargeFormValidate" :model="rechargeFormValidate" :label-width="80">
                      <Row :gutter="10">
                        <Col span="8">
                        <FormItem label="学员姓名">
                          <Input v-model="memberInfo.uname" disabled></Input>
                        </FormItem>
                        </Col>

                        <Col span="8">
                        <FormItem label="手机号">
                          <Input v-model="memberInfo.phone" disabled></Input>
                        </FormItem>
                        </Col>

                        <Col span="8">
                        <FormItem label="课程名称">
                          <Input v-model="curCard.company_course_name" disabled></Input>
                        </FormItem>
                        </Col>
                      </Row>

                      <Row :gutter="10" class="mt20">
                        <Col span="8">
                        <FormItem label="剩余次数">
                          <Input v-model="curCard.num" disabled></Input>
                        </FormItem>
                        </Col>

                        <Col span="8">
                        <FormItem label="新增次数">
                          <Input v-model="rechargeFormValidate.num"></Input>
                        </FormItem>
                        </Col>

                        <Col span="8">
                        <FormItem label="实收金额">
                          <Input v-model="rechargeFormValidate.price_format"></Input>
                        </FormItem>
                        </Col>
                      </Row>

                      <Row :gutter="10" class="mt20">
                        <Col span="8">
                        <FormItem label="销售员工" prop="sale_mid">
                          <Select v-model="rechargeFormValidate.sale_mid" clearable>
                            <Option v-for="item in saleList" :value="item.mid" :key="item.mid">{{ item.uname }}</Option>
                          </Select>
                        </FormItem>
                        </Col>

                        <Col span="8">
                        <FormItem label="支付方式" prop="pay_type">
                          <Select v-model="rechargeFormValidate.pay_type" clearable>
                            <Option v-for="item in payTypeList" :value="item.value" :key="item.value">{{ item.label }}
                            </Option>
                          </Select>
                        </FormItem>
                        </Col>
                      </Row>

                      <p class="mt10" style="color: #3c763d;margin-left: 80px;font-size: 14px;">
                        {{rechargeNotice}}
                      </p>

                      <Row :gutter="10" class="mt20">
                        <Col span="8">
                        <FormItem label="" prop="setDate">
                          <Checkbox v-model="rechargeFormValidate.isInputExpire" @on-change="changeRechargeSetDate">手动设置有效期
                          </Checkbox>
                        </FormItem>
                        </Col>

                        <Col span="8" v-if="rechargeFormValidate.isInputExpire">
                        <FormItem label="截止日期" prop="end_date">
                          <DatePicker :value="rechargeFormValidate.expire_end_format" type="date"
                                      @on-change="rechargeFormValidate.expire_end_format=$event" format="yyyy-MM-dd"
                                      placeholder="选择截止日期" transfer></DatePicker>
                        </FormItem>
                        </Col>
                      </Row>

                      <Row>
                        <Col span="12">
                        <FormItem label="备注" prop="comment">
                          <Input v-model="rechargeFormValidate.comment" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注信息"></Input>
                        </FormItem>
                        </Col>
                      </Row>

                      <Row>
                        <FormItem>
                          <Button type="primary" @click="handleRechargeSubmit('rechargeFormValidate')" :loading="rechargeLoading">提交</Button>
                        </FormItem>
                      </Row>
                    </Form>
                  </div>

                  <div v-show="curKapianNav.value == 'tf'">
                    <Form ref="refundFormValidate" :model="refundFormValidate" :label-width="80">
                      <Row :gutter="10">
                        <Col span="8">
                        <FormItem label="学员姓名">
                          <Input v-model="memberInfo.uname" disabled></Input>
                        </FormItem>
                        </Col>

                        <Col span="8">
                        <FormItem label="手机号">
                          <Input v-model="memberInfo.phone" disabled></Input>
                        </FormItem>
                        </Col>

                        <Col span="8">
                        <FormItem label="课程名称">
                          <Input v-model="curCard.company_course_name" disabled></Input>
                        </FormItem>
                        </Col>
                      </Row>

                      <Row :gutter="10" class="mt20">
                        <Col span="8">
                        <FormItem label="总课时">
                          <Input v-model="curCard.num_sum" disabled></Input>
                        </FormItem>
                        </Col>

                        <Col span="8">
                        <FormItem label="剩余课时">
                          <Input v-model="curCard.num" disabled></Input>
                        </FormItem>
                        </Col>
                      </Row>

                      <Row :gutter="10" class="mt20">
                        <Col span="8">
                        <FormItem label="退款额">
                          <Input v-model="refundFormValidate.price_format"></Input>
                        </FormItem>
                        </Col>

                        <Col span="8">
                        <FormItem label="支付方式" prop="pay_type">
                          <Select v-model="refundFormValidate.pay_type" clearable>
                            <Option v-for="item in payTypeList" :value="item.value" :key="item.value">{{ item.label }}
                            </Option>
                          </Select>
                        </FormItem>
                        </Col>
                      </Row>

                      <Row>
                        <Col span="12">
                        <FormItem label="备注" prop="comment">
                          <Input v-model="refundFormValidate.comment" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注信息"></Input>
                        </FormItem>
                        </Col>
                      </Row>

                      <Row>
                        <FormItem>
                          <Button type="primary" @click="handleRefundSubmit('refundFormValidate')" :loading="refundLoading">提交</Button>
                        </FormItem>
                      </Row>
                    </Form>
                  </div>

                  <div v-show="curKapianNav.value == 'sc'">
                    <Form ref="delFormValidate" :model="delFormValidate" :label-width="80">
                      <Row :gutter="10">
                        <Col span="8">
                        <FormItem label="开始日期">
                          <Input v-model="curCard.expire_start_format" disabled></Input>
                        </FormItem>
                        </Col>

                        <Col span="8">
                        <FormItem label="截止日期">
                          <Input v-model="curCard.expire_end_format" disabled></Input>
                        </FormItem>
                        </Col>
                      </Row>

                      <Row :gutter="10" class="mt20">
                        <Col span="8">
                        <FormItem label="总课时">
                          <Input v-model="curCard.num_sum" disabled></Input>
                        </FormItem>
                        </Col>

                        <Col span="8">
                        <FormItem label="剩余课时">
                          <Input v-model="curCard.num" disabled></Input>
                        </FormItem>
                        </Col>
                      </Row>

                      <Row>
                        <Col span="12">
                        <FormItem label="备注" prop="comment">
                          <Input v-model="delFormValidate.comment" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注信息"></Input>
                        </FormItem>
                        </Col>
                      </Row>

                      <Row>
                        <FormItem>
                          <Button type="default" @click="handleDelSubmit('delFormValidate')" :loading="delLoading">删除</Button>
                        </FormItem>
                      </Row>
                    </Form>
                  </div>

                  <div v-show="curKapianNav.value == 'jh'">
                    激活
                  </div>

                  <div v-show="curKapianNav.value == 'tkqj'">
                    停课/请假
                  </div>

                  <div v-show="curKapianNav.value == 'hfxj'">
                    恢复/销假
                  </div>

                  <div v-show="curKapianNav.value == 'dj'">
                    冻结
                  </div>

                  <div v-show="curKapianNav.value == 'jd'">
                    解冻
                  </div>

                  <div v-show="curKapianNav.value == 'zr'">
                    转让
                  </div>


                </div>

                <!--<p class="mt25" style="font-size: 16px;">变更明细</p>-->
                <!--<ul class="nav float-wrap mt20">-->
                  <!--<li v-for="(item,index) in cardChangeDetailNavList" @click="changeKapianDetailNav(item)"-->
                      <!--:class="{active: item.active}">-->
                    <!--<span>{{item.label}}</span>-->
                  <!--</li>-->
                <!--</ul>-->


              </div>
              </Col>
            </Row>
          </div>
        </TabPane>
        <TabPane label="积分明细" name="name2">
          <div class="mt20">
            <!--<Button type="info" icon="ios-plus-empty" @click="preJoinClass">添加学员</Button>-->
            <!--<Button type="default" class="ml20">调至其他班</Button>-->
            <!--<Button type="default" class="ml20">移出本班</Button>-->
          </div>

          <Table border ref="selection" :loading="loading"
                 :columns="studentTableColumns"
                 :data="studentTableData" class="mt20">>
          </Table>
        </TabPane>


        <!--<TabPane label="点名情况" name="name3">标签三的内容</TabPane>-->
      </Tabs>
    </div>


  </div>
</template>

<script>
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'
  import api from '@/assets/js/api'

  export default {
    name: 'classDetail',
    components: {},
    data() {
      return {
        memberInfo: {},
        loading: true,
        cardList: [],
        curCard: {},
        kapianDetailNavList: [],
        curKapianNav: {},
        cardChangeDetailNavList: [],
        curCardChangeDetailNav: {},
        payTypeList: [],

        rechargeFormValidate: {},
        rechargeLoading: false,
        rechargeNotice: '',
        saleList: [],

        refundFormValidate: {},
        refundLoading: false,

        delFormValidate: {},
        delLoading: false,

        studentTableData: [],
        studentTableColumns: [
          // {
          //   type: 'selection',
          //   width: 60,
          //   align: 'center'
          // },
          {
            title: '姓名',
            key: 'uname'
          },
          // {
          //   title: '性别',
          //   key: 'sex_format'
          // },
          {
            title: '手机号',
            key: 'phone'
          },
          {
            title: '操作',
            key: 'operation',
            render: (h, params) => {
              return h('div', [
                // h('Button', {
                //   props: {
                //     type: 'text',
                //     size: 'small',
                //   },
                //   style: {
                //     color: '#2db7f5'
                //   },
                //   on: {
                //     click: () => {
                //       this.update(params)
                //     }
                //   }
                // }, '调至其他班'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small',
                  },
                  style: {
                    color: '#2db7f5'
                  },
                  on: {
                    click: () => {
                      this.removeClassesMember(params)
                    }
                  }
                }, '移出本班'),
              ])
            }
          }
        ],
      }
    },
    watch: {
      rechargeFormValidate: {
        handler(val, oldVal){
          this.initRechargeNotice()
        },
        deep:true
      }
    },
    created() {
      this.getMemberInfo()
      this.getCardList()

      api.getSaleList.call(this, data => {
        this.saleList = data
        console.log('this.saleList', this.saleList)
      }, error => {
        this.$Message.error(error.message)
      })

      this.payTypeList = config.payType
    },
    mounted() {

    },
    methods: {
      changeRechargeSetDate(e) {
        console.log('setdate', e)
        console.log('this.rechargeFormValidate', this.rechargeFormValidate)
      },
      changeCard(id) {
        let curCard = {}
        this.cardList.map(item => {
          if (item.id == id) {
            curCard = item
          }
        })
        this.curCard = curCard
        this.initKapianDetailNavList(curCard)
        this.initCardChangeDetailNavList(curCard)
      },
      initRechargeNotice() {
        let notice = `${this.curCard.company_course_name} 原剩余次数${this.curCard.num},新剩余次数${parseInt(this.curCard.num) + parseInt(this.rechargeFormValidate.num)}`
        if(lib.isNotLimitDate(this.curCard.expire_end)) {
          notice += `,实收 ${this.rechargeFormValidate.price_format}元`
        }else{
          notice += `,原有效期${lib.date('Y/m/d',this.curCard.expire_start)}至${lib.date('Y/m/d',this.curCard.expire_end)},新有效期至${this.rechargeFormValidate.expire_end_format},实收 ${this.rechargeFormValidate.price_format}元`
        }

        this.rechargeNotice = notice
      },
      initKapianDetailNavList(curCard) {
        let kapianDetailNavList = []
        kapianDetailNavList.push({
          label: '购课信息',
          value: 'gkxx',
          active: true,
          disabled: false
        })
        kapianDetailNavList.push({
          label: '充值',
          value: 'cz',
          active: false,
          disabled: false
        })
        // kapianDetailNavList.push({
        //   label: '激活',
        //   value: 'jh',
        //   active: false,
        //   disabled: true
        // })
        // kapianDetailNavList.push({
        //   label: '停课/请假',
        //   value: 'tkqj',
        //   active: false,
        //   disabled: false
        // })
        // kapianDetailNavList.push({
        //   label: '恢复/销假',
        //   value: 'hfxj',
        //   active: false,
        //   disabled: false
        // })
        // kapianDetailNavList.push({
        //   label: '冻结',
        //   value: 'dj',
        //   active: false,
        //   disabled: false
        // })
        // kapianDetailNavList.push({
        //   label: '解冻',
        //   value: 'jd',
        //   active: false,
        //   disabled: false
        // })
        // kapianDetailNavList.push({
        //   label: '转让',
        //   value: 'zr',
        //   active: false,
        //   disabled: false
        // })
        kapianDetailNavList.push({
          label: '退费',
          value: 'tf',
          active: false,
          disabled: false
        })
        kapianDetailNavList.push({
          label: '删除',
          value: 'sc',
          active: false,
          disabled: false
        })

        this.kapianDetailNavList = kapianDetailNavList
        this.curKapianNav = kapianDetailNavList[0]
      },
      initCardChangeDetailNavList(curCard) {
        let cardChangeDetailNavList = []
        cardChangeDetailNavList.push({
          label: '购课/充值/激活',
          value: 'c_gkczjh',
          active: true,
        })
        cardChangeDetailNavList.push({
          label: '停卡/恢复',
          value: 'c_tkhf',
          active: false,
        })
        cardChangeDetailNavList.push({
          label: '考勤',
          value: 'c_kq',
          active: false,
        })

        this.cardChangeDetailNavList = cardChangeDetailNavList
        this.curCardChangeDetailNav = cardChangeDetailNavList[0]
      },
      changeKapianDetailNav(item) {
        if (!item.disabled) {
          this.kapianDetailNavList.map(item => item.active = false)
          item.active = true
          this.curKapianNav = item
        }

        if (item.value == 'cz') {
          this.initRecharge()
        }
      },
      initRecharge() {
        let expire_end_format
        if(lib.isNotLimitDate(this.curCard.expire_end)) {
          expire_end_format = lib.date('Y/m/d',this.curCard.expire_end)
        }else{
          var cardExpireDate = lib.date('Y/m/d',this.curCard.expire_end)
          expire_end_format = lib.getNextMonthDate(cardExpireDate, this.curCard.expire_month)
        }
        this.rechargeFormValidate = {
          num: this.curCard.num_sum,
          price_format: this.curCard.price_format,
          expire_end_format: expire_end_format,
        }
      },
      getMemberInfo() {
        let submitData = {
          roles: [config.UserRole.ROLE_MEMBER],
          mid: this.$route.query.mid,
          getCard: false,
          isStudent: true,
        }
        let url = lib.getRequestUrl('/api/member/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          let member = res.data.member
          member = lib.filterResult(member)
          this.memberInfo = member[0]
        }).catch(error => {
          this.loading = false
          console.log('error', error)

          this.$Message.error(error.message);
        })
      },
      getCardList() {
        let submitData = {
          mid: this.$route.query.mid
        }
        this.$http.post('/api/card/getlist', submitData).then(res => {
          let card = res.data.data
          card = lib.filterResult(card)

          card.map(item=>{
            item.disabled = false
            if(item.status == config.Card.STATUS_USING) {
              item.des = `${item.num}课时`
            }else if(item.status == config.Card.STATUS_REFUND) {
              item.des = `已退费`
              item.disabled = true
            }
          })

          this.cardList = card
          for(var i = 0; i < this.cardList.length; i++) {
            if(!lib.empty(this.curCard)) {
              this.changeCard(this.curCard.id)
              break
            }else if(!lib.in_array(this.cardList[i].status, [config.Card.STATUS_REFUND])){
              this.changeCard(this.cardList[i].id)
              break
            }
          }
        }).catch(error => {
          this.loading = false
          console.log('error', error)

          this.$Message.error(error.message);
        })
      },
      handleRechargeSubmit(inventory) {
        this.$refs[inventory].validate((valid) => {
          if (valid) {
            let url = 'api/card/upgrade'
            let submitData = {
              card_id: this.curCard.id,
              num: this.rechargeFormValidate.num,
              mid: this.memberInfo.mid,
              real_price: this.rechargeFormValidate.price_format,
              sale_mid: this.rechargeFormValidate.sale_mid,
              pay_type: this.rechargeFormValidate.pay_type,
              comment: this.rechargeFormValidate.comment,
              isInputExpire: this.rechargeFormValidate.isInputExpire,
              expire_end: this.rechargeFormValidate.isInputExpire ? lib.strtotime(this.rechargeFormValidate.expire_end_format + ' 23:59:59') : null,
            }
            this.$http.post(url, submitData).then(res => {
              this.$Message.success('充值成功')
              this.getCardList()
            }).catch(error => {
              this.$Message.error(error.message)
            })
          } else {
            this.$Message.error('请输入完整信息!');
          }
        })
      },
      handleRefundSubmit(inventory) {
        this.$Modal.confirm({
          title: '课程退费',
          content: "确认退费吗？",
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.$refs[inventory].validate((valid) => {
              if (valid) {
                this.refundLoading = true
                let url = 'api/card/refund'
                let submitData = {
                  card_id: this.curCard.id,
                  money: this.refundFormValidate.price_format,
                  pay_type: this.refundFormValidate.pay_type,
                  comment: this.refundFormValidate.comment,
                }
                this.$http.post(url, submitData).then(res => {
                  this.refundLoading = false
                  this.$Message.success('退费成功!')
                  this.getCardList()
                }).catch(error => {
                  this.refundLoading = false
                  this.$Message.error(error.message)
                })
              } else {
                this.$Message.error('请输入完整信息!');
              }
            })
          },
          onCancel: () => {
          }
        })
      },
      handleDelSubmit(inventory) {
        this.$Modal.confirm({
          title: '删除',
          content: "该删除功能是不可逆的，删除之后该学员将失去相应的课时，仍然要删除吗？",
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.$refs[inventory].validate((valid) => {
              if (valid) {
                this.delLoading = true
                let url = 'api/card/del'
                let submitData = {
                  id: this.curCard.id,
                  comment: this.delFormValidate.comment,
                  jump_vcode: true
                }
                this.$http.post(url, submitData).then(res => {
                  this.delLoading = false
                  this.$Message.success('删除成功!')
                  this.getCardList()
                }).catch(error => {
                  this.delLoading = false
                  this.$Message.error(error.message)
                })
              } else {
                this.$Message.error('请输入完整信息!');
              }
            })
          },
          onCancel: () => {
          }
        })
      },
    },
  }
</script>


<style>
  .student_detail_container .courseArea .kapianNav .kapian {
    color: #333;
    background-color: #fff;
    border: solid 1px #ccc;
    margin-top: 10px;
    border-radius: 5px;
    padding: 10px 5px;
    cursor: pointer;
  }

  .student_detail_container .courseArea .kapianNav .kapian:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  .student_detail_container .courseArea .kapianNav .kapian:first-child {
    margin-top: 0;
  }

  .student_detail_container .courseArea .kapianNav .kapian.active {
    color: #fff;
    background-color: #5cb85c;
    border-color: #4cae4c;
  }
  .student_detail_container .courseArea .kapianNav .kapian.disabled {
    pointer-events: none;
    cursor: not-allowed;
    box-shadow: none;
    opacity: .65;
  }

  .student_detail_container .courseArea .kapianDetail ul.nav {
    /*position: relative;*/
    border-bottom: solid 1px #ccc;
  }

  .student_detail_container .courseArea .kapianDetail ul.nav li {
    float: left;
    /*display: inline-block;*/
    color: #428bca;
    font-size: 14px;
    cursor: pointer;
    position: relative;
    margin-bottom: -1px;
  }

  .student_detail_container .courseArea .kapianDetail ul.nav li span {
    display: block;
    padding: 10px 20px;
  }

  .student_detail_container .courseArea .kapianDetail ul.nav li.active {
    border: solid 1px #ccc;
    border-bottom: 0;
    color: rgb(81, 90, 110);
  }

  .student_detail_container .courseArea .kapianDetail ul.nav li.active span {
    background: white;
  }

  .student_detail_container .courseArea .kapianDetail ul.nav li.disabled {
    cursor: not-allowed;
    color: rgb(119, 119, 119);
  }

</style>
