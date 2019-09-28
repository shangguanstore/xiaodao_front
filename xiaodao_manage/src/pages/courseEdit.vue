<template>
  <div class="courseEditContainer">
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>教务中心</BreadcrumbItem>
        <BreadcrumbItem>课程编辑</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="container mt20">
      <p class="content_title">基础信息</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" class="mt20">
        <Row>
          <Col span="6">
          <FormItem label="课程名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入课程名称"></Input>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="6">
          <FormItem label="课程类型" prop="type">
            <RadioGroup v-model="formValidate.type">
              <Radio :label="0">一对多</Radio>
              <Radio :label="1">一对一</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="6">
          <FormItem label="课表颜色" prop="course_color">
            <ColorPicker v-model="formValidate.course_color" recommend />
          </FormItem>
          </Col>
        </Row>
      </Form>
    </div>

    <div class="container mt20">
      <p class="content_title">详细信息</p>

      <Form ref="formValidate1" :model="formValidate" :rules="ruleValidate" :label-width="120" class="mt20">
        <Row v-if="formValidate.type == 0">
          <Col span="4">
          <FormItem label="课程总价" prop="price" style="position: relative;">
            <Input v-model="formValidate.price" placeholder="请输入" @on-blur="changePrice" number></Input>
            <span class="fieldUnit">元</span>
          </FormItem>
          </Col>
        </Row>

        <Row v-if="formValidate.type == 0">
          <Col span="4">
          <FormItem label="课时数" prop="course_num">
            <Input v-model="formValidate.course_num" placeholder="请输入" @on-blur="changeCourseNum" number></Input>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="4">
          <FormItem label="课程单价" prop="unit_price" style="position: relative;">
            <Input v-model="formValidate.unit_price" placeholder="请输入" @on-blur="changeUnitPrice" number></Input>
            <span class="fieldUnit" style="right: -51px">元/课时</span>
          </FormItem>
          </Col>
        </Row>

        <Row v-if="formValidate.type == 0">
          <Col span="8">
          <FormItem label="扣课时规则" prop="name">
            <div>
              <span>请假是否扣课时：</span>
              <RadioGroup v-model="formValidate.rule_leave">
                <Radio :label="0">扣</Radio>
                <Radio :label="1">不扣</Radio>
              </RadioGroup>
            </div>

            <div>
              <span>未到是否扣课时：</span>
              <RadioGroup v-model="formValidate.rule_absent">
                <Radio :label="0">扣</Radio>
                <Radio :label="1">不扣</Radio>
              </RadioGroup>
            </div>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="8">
          <FormItem label="课程内容" prop="content">
            <Input v-model="formValidate.content" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder="请输入课程内容" style="width:calc(100% - 60px);"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </div>

    <div class="bottomBtn">
      <Button size="large" type="primary" @click="handleSubmit">提交</Button>
      <Button size="large" style="margin-left: 8px" @click="handleReset">重置</Button>
    </div>


  </div>
</template>

<script>
  import lib from '../assets/js/lib/index'
  import config from '@/assets/js/config/index'


  export default {
    name: 'courseEdit',
    data() {
      return {
        isAdd: true,
        config: {},
        formValidate: {
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
      'formValidate.unit_price'(val,oldVal) {
        if(oldVal != 0 && this.formValidate.type == config.CompanyCourse.TYPE_ONE_TO_MANY) {
          let {price, unit_price, course_num} = this.formValidate
          let count = unit_price * course_num

          if(unit_price && course_num) {
            if(lib.is_int(count)) {
              this.formValidate.price = count
            }else{
              this.formValidate.price = count.toFixed(2)
            }
          }
        }

        if(oldVal != 0 && this.formValidate.type == config.CompanyCourse.TYPE_ONT_TO_ONE) {
          this.formValidate.price = val
          this.formValidate.course_num = 1
        }
      }
    },
    created() {
      this.isAdd = this.$route.query.isAdd
      this.config = config
    },
    mounted(){

    },
    methods: {
      changePrice() {
        let {price, unit_price, course_num} = this.formValidate
        let count = price / course_num

        if(course_num && price) {
          if(lib.is_int(count)) {
            this.formValidate.unit_price = count
          }else{
            this.formValidate.unit_price = parseFloat(count.toFixed(2))
          }
        }
      },
      changeUnitPrice() {

      },
      changeCourseNum() {
        let {price, unit_price, course_num} = this.formValidate
        let count = price / course_num

        if(price && course_num) {
          if(lib.is_int(count)) {
            this.formValidate.unit_price = count
          }else{
            this.formValidate.unit_price = parseFloat(count.toFixed(2))
          }
        }
      },

      handleSubmit() {
        this.$refs['formValidate'].validate((valid)=>{
          if(valid) {
            this.$refs['formValidate1'].validate((valid1)=>{
              if(valid1) {
                let submitData = {
                  name: this.formValidate.name,
                  price: this.formValidate.price * 100,
                  course_num: this.formValidate.course_num,
                  unit_price: this.formValidate.unit_price * 100,
                  type: this.formValidate.type,
                  course_color: this.formValidate.course_color,
                  content: this.formValidate.content
                }

                let url
                if(this.isAdd) {
                  url = 'api/company/course/add'
                }else{
                  url = 'api/company/course/update'
                  submitData.ccid = this.formValidate.ccid
                }

                this.$http.post(url, submitData).then(res => {
                  if(res) {
                    let message = this.isAdd ? '添加课程成功' : '修改成功'
                    this.$Message.success(message);

                    setTimeout(()=>{
                      this.$router.push('courseFee')
                    },1500)
                  }
                }).catch(error => {
                  console.log('error',error)
                  this.loading = false
                  this.$Message.error(error.message);
                })



              }else{
                this.$Message.error('请输入完整信息!');
              }
            })
          }else{
            this.$Message.error('请输入完整信息!');
          }
        })
      },

      handleReset() {
        this.$refs['formValidate'].resetFields();
        this.$refs['formValidate1'].resetFields();
      }
    },
  }
</script>
<style lang="less">
.courseEditContainer {

}
</style>
