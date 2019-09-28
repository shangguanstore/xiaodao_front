<template>
  <div>
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>教务中心</BreadcrumbItem>
        <BreadcrumbItem>教师管理</BreadcrumbItem>
        <BreadcrumbItem>{{title}}</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div class="container staff_edit_container mt20">
      <p class="content_title">基本信息</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" class="mt20">
        <Row>
          <Col span="8">
          <FormItem label="姓名" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入员工姓名" @on-blur="inputName"></Input>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="8">
          <FormItem label="账号" prop="account">
            <Input v-model="formValidate.account" :disabled="!isAdd" placeholder="输入姓名自动生成"></Input>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="8">
          <FormItem label="手机" prop="phone">
            <Input v-model="formValidate.phone" placeholder="请输入手机号码"></Input>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="8">
          <FormItem label="角色" prop="role">
            <Select v-model="formValidate.role" multiple>
              <Option v-for="item in roleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="8">
          <FormItem label="可教科目" prop="subject">
            <CheckboxGroup v-model="formValidate.subject">
              <Checkbox :label="item.id" v-for="item in subjectList" :key="item.id">{{item.name}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
          </Col>
        </Row>

        <Row v-if="isAdd">
          <Col span="8">
          <FormItem label="是否允许登录系统" prop="can_login">
            <RadioGroup v-model="formValidate.can_login">
              <Radio :label="1">是</Radio>
              <Radio :label="0">否</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
        </Row>
      </Form>

      <Row v-if="formValidate.can_login && isAdd">
        <Col span="8">
        <div class="comment-tip mt20">
          <i class="icon iconfont icon-tishi"></i>
          <span>保存后，系统会将登录系统的账号密码以短信方式发送到员工手机上。</span>
        </div>
        </Col>
      </Row>

    </div>

    <div class="bottomBtn">
      <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
      <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
    </div>

  </div>
</template>

<script>
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'

  const validatePhone = function (rule, value, callback) {
    if (!(/^1[34578]\d{9}$/.test(value))) {
      return callback(new Error('您输入的手机号码有误'))
    } else {
      callback()
    }
  }

  export default {
    name: 'teacherEdit',
    data() {
      return {
        mid: 0,
        title: "",
        isAdd: true,
        roleList: [
          {
            value: config.UserRole.ROLE_TEACHER,
            label: "老师",
          },
          // {
          //     value: config.UserRole.ROLE_ASSIST_TEACHER,
          //     label: "辅助老师",
          // },
          {
            value: config.UserRole.ROLE_CLASS_TEACHER,
            label: "教务/班主任",
          },
          {
            value: config.UserRole.ROLE_FRONT,
            label: "前台",
          },
          {
            value: config.UserRole.ROLE_SALE,
            label: "市场/咨询师",
          },
          {
            value: config.UserRole.ROLE_MANAGER,
            label: "校长",
          },
          // {
          //     value: config.UserRole.ROLE_ADMIN,
          //     label: "机构管理员",
          // },
        ],
        subjectList: [],
        formValidate: {
          name: '',
          account: '',
          phone: '',
          role: [],
          subject: [],
          can_login: 1,
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入员工名称', trigger: 'blur'}
          ],
          account: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入员工手机号', trigger: 'blur'},
            {validator: validatePhone, trigger: 'blur'}
          ],
          role: [
            {required: true, type: 'array', message: '请选择员工角色', trigger: 'change'}
          ],
        }
      }
    },
    created() {
      if (this.$route.query.mid) {
        this.title = "教师编辑"
        this.isAdd = false
        let submitData = {
          mid: this.$route.query.mid,
          getSubject: true
        }
        let url = lib.getRequestUrl('/api/member/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          let member = res.data.member[0]
          this.formValidate.phone = member.phone
          this.formValidate.name = member.uname
          this.formValidate.can_login = member.can_login
          this.formValidate.account = member.account
          this.formValidate.role = lib.is_array(member.role_id) ? member.role_id : [member.role_id]
          this.formValidate.subject = member.subject.length ? lib.array_column(member.subject, 'subject_id') : []
          this.mid = member.mid
        }).catch(error => {
          console.log(error)
          this.$Message.error(error.message);
        })
      } else {
        this.title = "新增教师"
        this.isAdd = true
      }

      this.getSubjectList()
    },
    mounted() {

    },
    methods: {
      getSubjectList() {
        let submitData = {
          type: [config.Subject.TYPE_SYS_DETAULT, config.Subject.TYPE_CUSTOM]
        }
        let url = '/api/subject/list'
        this.$http.post(url, submitData).then(res => {
          this.subjectList = res.data.data
        }).catch(error => {
          this.$Message.error(error.message);
        })
      },
      inputName() {
        let account = lib.chinese2pinyin(this.formValidate.name)
        this.formValidate.account = account ? account : ''
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let submitData
            let url
            console.log('isAdd', this.isAdd)
            if (this.isAdd) {
              submitData = {
                name: this.formValidate.name,
                phone: this.formValidate.phone,
                roles: this.formValidate.role,
                account: this.formValidate.account,
                can_login: this.formValidate.can_login,
                subjects: this.formValidate.subject,
              }
              url = "/api/member/add"
            } else {
              submitData = {
                mid: this.mid,
                name: this.formValidate.name,
                phone: this.formValidate.phone,
                roles: this.formValidate.role,
                subjects: this.formValidate.subject,
              }
              url = "/api/member/update"
            }

            this.$http.post(url, submitData).then(res => {
              if (res) {
                this.$Message.success(this.title + '成功!')
                var _this = this
                setTimeout(function () {
                  _this.$router.push({
                    path: 'teacherList',
                    query: {}
                  })
                }, 200)
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
      }
    },
  }
</script>
<style>

</style>
