<template>
  <div class="signContainer">
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>招生中心</BreadcrumbItem>
        <BreadcrumbItem>报名</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="container mt20">
      <p class="content_title" @click="log">学员信息</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" class="mt20">
        <Row>
          <Col span="6">
          <FormItem label="选择学员" prop="mid">
            <Select
              v-model="formValidate.mid"
              ref="selectMenber"
              clearable
              placeholder="输入手机号或姓名进行搜索"
              filterable
              remote
              :remote-method="searchMember"
              @on-change="changeMember"
              :loading="searchMemberLoading">
              <Option v-for="(option, index) in memberOptions" :value="option.value" :key="option.value">{{option.label}}
              </Option>
            </Select>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="6">
          <p class="specialItem">
            <span class="itemLabel">
              联系电话
            </span>
            <span class="itemValue">
              {{member.phone ? member.phone : '--'}}
            </span>
          </p>
          </Col>

          <Col span="6">
          <p class="specialItem">
            <span class="itemLabel">
              公立学校
            </span>
            <span class="itemValue">
              {{member.school_name ? member.school_name : '--'}}
            </span>
          </p>
          </Col>

          <Col span="6">
          <p class="specialItem">
            <span class="itemLabel">
              来源类型
            </span>
            <span class="itemValue">
              {{member.source ? member.source : '--'}}
            </span>
          </p>
          </Col>
        </Row>

      </Form>
    </div>

    <div class="container mt20">
      <p class="content_title">报读课程</p>

      <Form ref="formValidate1" :model="formValidate" :rules="ruleValidate" :label-width="60" class="mt20">
        <Row>
          <Col span="6">
          <FormItem label="选择课程" prop="ccid">
            <Select v-model="formValidate.ccids"
                    clearable
                    multiple
                    @on-change="changeCourseSelect"
            >
              <Option v-for="item in courseList" :value="item.ccid" :key="item.ccid">{{ item.name }}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
      </Form>

      <div>
        <div class="table-wrap">
          <table class="grid">
            <thead class="table-head">
            <tr>
              <th style="width: 200px;">报读课程信息</th>
              <th>单价</th>
              <th>数量</th>
              <th>总金额</th>
              <th style="width: 200px">课程优惠</th>
              <th>课程优惠金额</th>
              <!--<th>直减分摊</th>-->
              <!--<th>合同优惠</th>-->
              <th>折后单价</th>
              <th>应收金额</th>
              <th>有效期至</th>
              <th>操作</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(item, index) in selectCourseList">
              <td>
                {{item.name}}
              </td>
              <td>
                <Input v-model="item.unit_price_format" @on-blur="changeUnitPrice(item,index)" placeholder="请输入" />
              </td>
              <td>
                <Input v-model="item.course_num" @on-blur="changeCourseNum(item, index)" placeholder="请输入" />
              </td>
              <td>
                <Input v-model="item.price_format" @on-blur="changePrice(item, index)" placeholder="请输入" />
              </td>

              <td>
                <Select v-model="item.promotion_id"
                        clearable
                        @on-change="changePromotionSelect(index,$event)"
                >
                  <Option v-for="item in promotionList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
              </td>

              <td>{{item.coupon_format}}</td>
              <!--<td>xxx</td>-->
              <!--<td>xxx</td>-->
              <td>{{item.real_unit_price_format}}</td>
              <td>{{item.real_price_format}}</td>
              <td>
                <!--toPickerExpireEnd(index)-->
                <Button v-show="!item.showExpireEndPicker" @click="toPickerExpireEnd(index)" type="default">不限</Button>
                <DatePicker v-show="item.showExpireEndPicker" :value="item.expire_end_format" type="date"
                            @on-change="item.expire_end_format=$event" format="yyyy-MM-dd" placeholder="选择截止日期"></DatePicker>
              </td>
              <td><Icon @click="removeCourse(index)" style="font-size: 18px;color: #aaa" type="ios-trash" /></td>

            </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <div class="container mt20">
      <p class="content_title">结算</p>

      <ul class="settlement mt20">
        <Row>
          <Col span="12" class="border-right">
          <li class="comment" style="width: 80%">
            <p class="title midgrey">合同备注</p>

            <Form ref="formValidate2" :model="formValidate" :rules="ruleValidate">
              <FormItem label="" prop="comment">
                <Input v-model="formValidate.comment" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder="对内备注" style="width:calc(100% - 60px);"></Input>
              </FormItem>

              <FormItem label="" prop="comment">
                <Input v-model="formValidate.comment" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder="对外备注" style="width:calc(100% - 60px);"></Input>
              </FormItem>
            </Form>
          </li>
          </Col>

          <Col span="12">
          <li class="detail">
            <p class="title midgrey ml20">结算</p>

            <Row class="content">
              <Col class="key" span="12">
              <span>共{{selectCourseList.length}}个课程，总课程金额</span>
              </Col>
              <Col class="val" span="12">
              <span class="number">{{orderMoney}}</span>
              <span class="unit">元</span>
              </Col>
            </Row>

            <Row class="content mt20">
              <Col class="key" span="12">
              <span>课程优惠</span>
              </Col>
              <Col class="val" span="12">
              <span class="number danger">{{couponMoney}}</span>
              <span class="unit danger">元</span>
              </Col>
            </Row>

            <Row class="content mt20">
              <Col class="key" span="12">
              <span>合同优惠</span>
              </Col>
              <Col class="val" span="12">
              <span class="number danger">0</span>
              <span class="unit danger">元</span>
              </Col>
            </Row>

            <Row class="content mt20">
              <Col class="key" span="12">
              <span>合同应收款</span>
              </Col>
              <Col class="val" span="12">
              <span class="number blueColor" style="font-size: 24px">{{paymentMoney}}</span>
              <span class="unit">元</span>
              </Col>
            </Row>

          </li>
          </Col>
        </Row>
      </ul>

      <div class="float-wrap">
        <Button class="mt20 fr" size="large" type="primary" :loading="handleLoading" @click="handleSubmit">保存合同</Button>
      </div>

    </div>

    <!--<div class="bottomBtn">-->
      <!--<Button size="large" type="primary" @click="handleSubmit">提交</Button>-->
      <!--<Button size="large" style="margin-left: 8px" @click="handleReset">重置</Button>-->
    <!--</div>-->


  </div>
</template>

<script>
  import lib from '../assets/js/lib/index'
  import config from '@/assets/js/config/index'

  export default {
    name: 'sign',
    data() {
      return {
        config: {},
        orderMoney: 0,
        paymentMoney: 0,
        couponMoney: 0,
        promotionList: [],
        searchMemberLoading: false,
        memberList: [],
        member: {},
        memberOptions: [],
        courseList: [],
        selectCourseList: [],
        handleLoading: false,
        formValidate: {
          mid: '',
          ccids: '',


          name: '',
          price: '',
          unit_price: '',
          course_num: '',
          type: 0,
          rule_leave: 1,
          rule_absent: 0,
          course_color: '#19BE6B',
          content: '',
        },
        ruleValidate: {
          mid: [
            {required: true, type: 'number', message: '请选择学员', trigger: 'blur'},
          ],
          name: [
            {required: true, message: '请输入课程名称', trigger: 'blur'},
          ],
          course_color: [
            {required: true, message: '请选择课表颜色', trigger: 'change'},
          ],
          price: [
            {required: true, type: 'number', message: '请输入课程总价', trigger: 'blur'},
          ],
          unit_price: [
            {required: true, type: 'number', message: '请输入课程单价', trigger: 'blur'},
          ],
          course_num: [
            {required: true, type: 'number', message: '请输入课时数', trigger: 'blur'},
          ],
        }
      }
    },
    watch: {
      selectCourseList: {
        handler(val, oldVal){
          console.log('new-selectCourseList',val)
          let orderMoney = 0
          let paymentMoney = 0
          let couponMoney = 0
          val.map(item=>{
            orderMoney += item.price
            paymentMoney += item.real_price
            couponMoney += item.coupon
          })

          this.orderMoney = lib.fixedNumber(orderMoney / 100, 2)
          this.paymentMoney = lib.fixedNumber(paymentMoney / 100, 2)
          this.couponMoney = lib.fixedNumber(couponMoney / 100, 2)
        },
        deep:true
      }
    },
    created() {
      this.config = config

      this.getMemberList()
      this.getCourseList()
      this.getPromotionList()
    },
    mounted() {
      if(this.$route.query.mid) {
        this.formValidate.mid = this.$route.query.mid
      }
    },
    methods: {
      log() {
        console.log('selectCourseList',this.selectCourseList)
      },
      toPickerExpireEnd(index) {
        let selectCourseList = this.selectCourseList
        selectCourseList[index].showExpireEndPicker = true
        this.selectCourseList = []
        this.selectCourseList = selectCourseList
      },
      removeCourse(index) {
        this.formValidate.ccids.splice(index, 1)
        this.selectCourseList.splice(index, 1)
      },
      getPromotionList() {
        let submitData = {
          status: [config.Promotion.STATUS_OK, config.Promotion.STATUS_INVALID]
        }
        let url = '/api/promotion/getlist'
        this.$http.post(url, submitData).then(res => {
          this.promotionList = res.data.data
          this.promotionList = lib.filterResult(this.promotionList)
          this.promotionList.map(item=>{
            if(item.type == config.Promotion.TYPE_DISCOUNT) {
              item.type_format = '打折'
              item.num_format = `${item.num}%`
            }else if(item.type == config.Promotion.TYPE_CUT_DOWN) {
              item.type_format = '减免现金'
              item.num_format = item.num
            }
          })
        }).catch(error => {
          this.$Message.error(error.message);
        })
      },
      changeUnitPrice(item, index) {
        let {price_format, unit_price_format, course_num} = item
        let count = unit_price_format * course_num

        if(unit_price_format && course_num) {
          if(lib.is_int(count)) {
            item.price_format = count
          }else{
            item.price_format = parseFloat(count.toFixed(2))
          }

          item.unit_price = unit_price_format * 100
          item.price = unit_price_format * course_num * 100
        }

        this.deletePromotion(index)
      },
      changePrice(item, index) {
        let {price_format, unit_price_format, course_num} = item
        let count = price_format / course_num

        if(course_num && price_format) {
          if(lib.is_int(count)) {
            item.unit_price_format = count
          }else{
            item.unit_price_format = parseFloat(count.toFixed(2))
          }

          item.price = price_format * 100
          item.unit_price = price_format / course_num * 100
        }

        this.deletePromotion(index)
      },
      changeCourseNum(item, index) {
        console.log(111222)
        let {price_format, unit_price_format, course_num} = item
        let count = unit_price_format * course_num

        if(unit_price_format && course_num) {
          if(lib.is_int(count)) {
            item.price_format = count
          }else{
            item.price_format = parseFloat(count.toFixed(2))
          }

          item.price = unit_price_format * course_num * 100
        }

        this.deletePromotion(index)
      },

      getCourseList() {
        let submitData = {}
        let url = lib.getRequestUrl('/api/company/course/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          let courseList = res.data.data
          this.courseList = lib.filterResult(courseList)
          this.courseList.map(item=>{
            item.real_unit_price = item.unit_price
            item.real_price = item.price
            item.coupon = 0
            item.real_unit_price_format = item.unit_price_format
            item.real_price_format = item.price_format
            item.coupon_format = 0

            item.showExpireEndPicker = false
          })
        }).catch(error => {
          this.$Message.error(error.message);
        })
      },

      getMemberList() {
        let submitData = {
          roles: [config.UserRole.ROLE_MEMBER],
          // pageIndex: 1,
          // pageSize: 10,
        }
        let url = lib.getRequestUrl('/api/member/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          let memberData = res.data.member ? lib.filterResult(res.data.member) : []

          this.memberList = memberData
          this.memberOptions = memberData.map(item => {
            return {
              value: item.mid,
              label: `${item.uname}(${item.phone})`
            };
          });

          if(this.$route.query.mid) {
            this.changeMember(this.$route.query.mid)
          }

          this.$nextTick(() => {
            // 初始值
            this.$refs.selectMenber.$data.query = `${this.member.uname}(${this.member.phone})`
          })
        }).catch(error => {
          this.$Message.error(error.message);
        })
      },

      searchMember(query) {
        if (query !== '') {
          this.searchMemberLoading = true;

          let submitData = {
            roles: [config.UserRole.ROLE_MEMBER],
            search: query
          }
          let url = lib.getRequestUrl('/api/member/getlist', submitData)
          this.$http.get(url, {}).then(res => {
            let memberData = res.data.member ? lib.filterResult(res.data.member) : []
            this.memberOptions = memberData.map(item => {
              return {
                value: item.mid,
                label: `${item.uname} (${item.phone})`
              };
            });

            this.searchMemberLoading = false;
          }).catch(error => {
            this.searchMemberLoading = false;
            this.$Message.error(error.message);
          })

          // setTimeout(() => {
          //   this.searchMemberLoading = false;
          //   const list = this.list.map(item => {
          //     return {
          //       value: item,
          //       label: item
          //     };
          //   });
          //   this.memberOptions = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
          // }, 200);
        } else {
          this.memberOptions = [];
        }
      },

      changeMember(mid) {
        let member = this.memberList.filter(item => item.mid == mid)
        this.member = member.length > 0 ? member[0] : {}
      },
      changeCourseSelect(e) {
        let selectCourseList = []
        this.courseList.map(item=>{
          if(lib.in_array(item.ccid, e)) {
            selectCourseList.push(item)
          }
        })
        this.selectCourseList = selectCourseList

        console.log('selectCourseList',selectCourseList)
      },
      changePromotionSelect(index,e) {
        console.log('e',e)
        console.log('index',index)
        if(e) {
          let selectCourseList = this.selectCourseList
          let promotionList = this.promotionList
          for(var i = 0; i < selectCourseList.length; i++) {
            for(var j = 0; j < promotionList.length; j++) {
              if(selectCourseList[i].promotion_id == promotionList[j].id) {
                if(promotionList[j].type == config.Promotion.TYPE_DISCOUNT) {
                  selectCourseList[i].real_price = selectCourseList[i].price * promotionList[j].num / 100
                  selectCourseList[i].real_unit_price = selectCourseList[i].real_price / selectCourseList[i].course_num
                  selectCourseList[i].coupon = selectCourseList[i].price - selectCourseList[i].real_price

                  selectCourseList[i].real_price_format = lib.fixedNumber(selectCourseList[i].real_price / 100, 2)
                  selectCourseList[i].real_unit_price_format = lib.fixedNumber(selectCourseList[i].real_unit_price / 100, 2)
                  selectCourseList[i].coupon_format = lib.fixedNumber(selectCourseList[i].coupon / 100, 2)
                }else if(promotionList[j].type == config.Promotion.TYPE_CUT_DOWN) {
                  selectCourseList[i].real_price = selectCourseList[i].price - promotionList[j].num * 100
                  selectCourseList[i].real_unit_price = selectCourseList[i].real_price / selectCourseList[i].course_num
                  selectCourseList[i].coupon = selectCourseList[i].price - selectCourseList[i].real_price

                  selectCourseList[i].real_price_format = lib.fixedNumber(selectCourseList[i].real_price / 100, 2)
                  selectCourseList[i].real_unit_price_format = lib.fixedNumber(selectCourseList[i].real_unit_price / 100, 2)
                  selectCourseList[i].coupon_format = lib.fixedNumber(selectCourseList[i].coupon / 100, 2)
                }
              }
            }
          }
        }else{
          this.selectCourseList.map((item,i)=>{
            if(i == index) {
              item.real_unit_price = item.unit_price
              item.real_price = item.price
              item.coupon = 0
              item.real_unit_price_format = item.unit_price_format
              item.real_price_format = item.price_format
              item.coupon_format = 0
            }
          })
        }
      },
      deletePromotion(index) {
        delete this.selectCourseList[index].promotion_id
        delete this.selectCourseList[index].real_price
        delete this.selectCourseList[index].real_unit_price
        delete this.selectCourseList[index].coupon

        delete this.selectCourseList[index].real_price_format
        delete this.selectCourseList[index].real_unit_price_format
        delete this.selectCourseList[index].coupon_format
      },
      handleSubmit() {
        console.log('this.selectCourseList',this.selectCourseList)
        this.handleLoading = true
        var nowTime = lib.getTimestamp()
        var noLimitTime = lib.getTimestamp('noLimit')

        this.selectCourseList.map(item=>{
          item.num = item.course_num
          item.num_sum = item.course_num
          item.coupon_money = item.coupon
          item.expire_start = nowTime
          item.expire_end = item.expire_end_format ? lib.getTimestamp('passStr',`${item.expire_end_format} 23:59:59`) : noLimitTime
        })

        let url = '/api/purchase/add'
        let submitData = {
          courseList: this.selectCourseList,
          mid: this.formValidate.mid
        }
        this.$http.post(url, submitData).then(res => {
          this.$Message.success('操作成功')
          this.handleLoading = false
          setTimeout(()=>{
            this.$router.push({
              path: 'student',
              query: {
              },
            })
          },2000)
        }).catch(error => {
          this.$Message.error('操作失败，' + error.message)
          this.handleLoading = false
        })
      },
      handleReset() {

      },
    }
  }
</script>
<style lang="less">
  .signContainer {

  }

  .signContainer .settlement {
    border-top: solid 1px #cccccc;
    border-bottom: solid 1px #cccccc;
  }

  .signContainer .settlement .title {
    font-size: 16px;
    padding: 20px 0;
  }

  .signContainer .settlement .detail .content .key {
    color: #707070;
    font-size: 16px;
    text-align: right;
  }

  .signContainer .settlement .detail .content .val {
    color: #707070;
    text-align: right;
    padding-right: 20px;
  }

  .signContainer .settlement .detail .content .val .number {
    font-size: 20px;
  }
  .signContainer .settlement .detail .content .val .unit {
    font-size: 14px;
    margin-left: 10px;
  }
</style>
