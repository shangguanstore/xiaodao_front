<template>
  <div>
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>内部管理</BreadcrumbItem>
        <BreadcrumbItem>员工管理</BreadcrumbItem>
        <BreadcrumbItem>{{title}}</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="container staff_edit_container mt20">
      <p class="content_title">基本信息</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" class="mt20">
        <FormItem label="姓名" prop="name" style="width: 60%">
          <Input v-model="formValidate.name" placeholder="请输入员工姓名"></Input>
        </FormItem>
        <FormItem label="手机" prop="phone" style="width: 60%">
          <Input v-model="formValidate.phone" placeholder="请输入员工电话号码"></Input>
        </FormItem>
        <FormItem label="角色" prop="role" style="width: 60%">
          <Select v-model="formValidate.role" multiple style="width:260px">
            <Option v-for="item in roleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="是否允许登录系统" prop="canLogin">
          <RadioGroup v-model="formValidate.canLogin">
            <Radio label="是">是</Radio>
            <Radio label="否">否</Radio>
          </RadioGroup>
        </FormItem>
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

  const validatePhone = function(rule, value, callback) {
      if(!(/^1[34578]\d{9}$/.test(value))) {
          return callback(new Error('您输入的手机号码有误'))
      } else {
          callback()
      }
  }

  export default {
    name: 'staffEdit',
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
            {
                value: config.UserRole.ROLE_ADMIN,
                label: "超级管理员",
            },
        ],
        formValidate: {
          name: '',
          phone: '',
          role: [],
          canLogin: '是',
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入员工名称', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入员工手机号', trigger: 'blur'},
            {validator: validatePhone, trigger: 'blur' }
          ],
          role: [
            {required: true, type: 'array', message: '请选择员工角色', trigger: 'change'}
          ],
        }
      }
    },
    created() {
        if(this.$route.query.mid) {
            this.title = "编辑员工"
            this.isAdd = false
            let submitData = {
                mid: this.$route.query.mid,
            }
            let url = lib.getRequestUrl('/api/member/getlist', submitData)
            this.$http.get(url, {}).then(res => {
                if(res) {
                   let member = res.data.member[0]
                   this.formValidate.phone = member.phone
                   this.formValidate.name = member.uname
                   this.formValidate.canLogin = '是'
                   this.formValidate.role = lib.is_array(member.role_id) ? member.role_id : [member.role_id]
                   this.mid = member.mid
                }
            }).catch(error => {
                console.log(error)
                this.$Message.error(error.message);
            })
        }else{
            this.title = "新增员工"
            this.isAdd = true
        }
    },
    mounted() {

    },
    methods: {
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
                      roles: this.formValidate.role,
                  }
                  url = "/api/member/add"
              }else{
                  submitData = {
                      mid: this.mid,
                      name: this.formValidate.name,
                      phone: this.formValidate.phone,
                      roles: this.formValidate.role,
                  }
                  url = "/api/member/update"
              }

              this.$http.post(url, submitData).then(res => {
                  if(res) {
                      this.$Message.success(this.title+'成功!')
                      var _this = this
                      setTimeout(function () {
                          _this.$router.push({
                              path: 'staff',
                              query: {}
                          })
                      },200)
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
      }
    },
  }
</script>
<style>

</style>
