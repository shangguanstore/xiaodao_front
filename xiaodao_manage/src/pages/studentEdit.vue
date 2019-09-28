<template>
  <div>
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>教务管理</BreadcrumbItem>
        <BreadcrumbItem>学员管理</BreadcrumbItem>
        <BreadcrumbItem>{{title}}</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="container staff_edit_container mt20">
      <p class="content_title">基本信息</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" class="mt20">
        <Row>
          <Col span="6">
          <FormItem label="姓名" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入员工姓名"></Input>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="6">
          <FormItem label="生日" prop="birthday">
            <DatePicker type="date" placeholder="请选择学员生日" v-model="formValidate.birthday"></DatePicker>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="6">
          <FormItem label="性别" prop="sex">
            <RadioGroup v-model="formValidate.sex">
              <Radio label="男">男</Radio>
              <Radio label="女">女</Radio>
            </RadioGroup>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="6">
          <FormItem label="绑定手机" prop="phone">
            <Input v-model="formValidate.phone" placeholder="绑定手机可用于接收短信通知"></Input>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="6">
          <FormItem label="母亲电话" prop="mother_phone">
            <Input v-model="formValidate.mother_phone" placeholder="请输入母亲电话"></Input>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="6">
          <FormItem label="父亲电话" prop="father_phone">
            <Input v-model="formValidate.father_phone" placeholder="请输入父亲电话"></Input>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="6">
          <FormItem label="公立学校" prop="school_id" style="position: relative;">
            <Select v-model="formValidate.school_id" clearable>
              <Option v-for="item in schoolList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
            <Icon @click="schoolAddRender" class="fieldPlus" style="position: absolute;top: 8px;cursor: pointer;font-size: 16px" type="md-add" />
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="6">

          </Col>
        </Row>

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
  import config from '@/assets/js/config/index'

  export default {
    name: 'staffEdit',
    data() {
      return {
        mid: 0,
        title: "",
        isAdd: true,
        schoolList: [],
        addSchoolName: '',
        formValidate: {
          name: '',
          phone: '',
          mother_phone: '',
          father_phone: '',
          school_id: '',
          birthday: '',
          sex: 0,
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入学员名称', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入学员手机号', trigger: 'blur'}
          ],
        }
      }
    },
    created() {
      if (this.$route.query.mid) {
        this.title = "编辑学员"
        this.isAdd = false
        let submitData = {
          mid: this.$route.query.mid,
        }
        let url = lib.getRequestUrl('/api/member/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          if (res) {
            let member = res.data.member[0]
            this.formValidate.phone = member.phone
            this.formValidate.mother_phone = member.mother_phone
            this.formValidate.father_phone = member.father_phone
            this.formValidate.birthday = new Date(lib.strtotime(member.birthday) * 1000)
            this.formValidate.sex = member.sex === 1 ? '男' : '女'
            this.formValidate.name = member.uname
            this.formValidate.school_id = member.school_id
            this.formValidate.role = lib.is_array(member.role_id) ? member.role_id : [member.role_id]
            this.mid = member.mid
          }
        }).catch(error => {
          console.log(error)
          this.$Message.error(error.message);
        })
      } else {
        this.title = "新增学员"
        this.isAdd = true
      }
      this.getSchoolList()
    },
    mounted() {

    },
    methods: {
      schoolAddRender () {
        this.addSchoolName = ''
        this.$Modal.confirm({
          render: (h) => {
            return h('div', [
              h('p', {
                style: {
                  textAlign: 'left',
                  fontSize: '16px',
                  marginBottom: '20px'
                },
              },'新增公立学校'),
              h('Input', {
                props: {
                  value: this.value,
                  autofocus: true,
                  placeholder: '请输入'
                },
                on: {
                  input: (val) => {
                    this.addSchoolName = val;
                  },
                }
              }),
            ])
          },
          onOk: () => {
            this.addSchool()
          }
        })
      },
      addSchool() {
        let submitData = {
          name: this.addSchoolName
        }
        let url = "/api/school/add"
        this.$http.post(url, submitData).then(res => {
          if (res.data.errNo == 100000) {
            this.$Message.success('添加成功!')
            this.getSchoolList()
          }
        }).catch(error => {
          this.$Message.error(error.message)
        })
      },
      getSchoolList() {
        let submitData = {
        }
        let url = '/api/school/getlist'
        this.$http.post(url, submitData).then(res => {
          this.schoolList = res.data.data
        }).catch(error => {
          this.$Message.error(error.message);
        })
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
                mother_phone: this.formValidate.mother_phone,
                father_phone: this.formValidate.father_phone,
                school_id: this.formValidate.school_id,
                sex: this.formValidate.sex === '男' ? 1 : 0,
                birthday: new Date(this.formValidate.birthday).getTime() / 1000,
                roles: config.UserRole.ROLE_MEMBER,
              }
              url = "/api/member/add"
            } else {
              submitData = {
                mid: this.mid,
                name: this.formValidate.name,
                phone: this.formValidate.phone,
                mother_phone: this.formValidate.mother_phone,
                father_phone: this.formValidate.father_phone,
                school_id: this.formValidate.school_id,
                sex: this.formValidate.sex === '男' ? 1 : 0,
                birthday: new Date(this.formValidate.birthday).getTime() / 1000,
                roles: config.UserRole.ROLE_MEMBE,
              }
              url = "/api/member/update"
            }

            this.$http.post(url, submitData).then(res => {
              if (res) {
                this.$Message.success(this.title + '成功!')
                var _this = this
                setTimeout(function () {
                  _this.$router.push({
                    path: 'student',
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
