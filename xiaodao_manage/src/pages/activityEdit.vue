<template>
  <div>
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>营销管理</BreadcrumbItem>
        <BreadcrumbItem>活动报名</BreadcrumbItem>
        <BreadcrumbItem>{{title}}</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div class="rightBtnList">
      <Button @click="addDetail">点击添加图文</Button>
    </div>

    <div class="container article_edit_container mt20">
      <p class="content_title">基本信息</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" class="mt20">
        <FormItem label="名称" prop="name" style="width: 60%">
          <Input v-model="formValidate.name" placeholder="请输入活动名称（微信分享标题用此名称）"></Input>
        </FormItem>
        <FormItem label="简介" prop="desc" style="width: 60%">
          <Input v-model="formValidate.desc" placeholder="请输入活动简介"></Input>
        </FormItem>
      </Form>
    </div>

    <div class="articleDetailList container article_edit_container mt20" v-for="(item,index) in detailListFormValidate">
      <p class="content_title">
        详细信息
      </p>
      <Icon type="ios-trash" class="delIcon" size="24" @click="removeDetail(item.htmlId)" />
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" class="mt20">
        <FormItem label="标题" prop="title" style="width: 60%">
          <Input v-model="item.title" placeholder="请输入正文标题（不是必填项）"></Input>
        </FormItem>

        <FormItem label="正文" prop="detail" style="width: 100%">
          <ckeditor :id="item.htmlId" v-model="item.detail" :config="config" @blur="onBlur($event)" @focus="onFocus($event)">
          </ckeditor>
        </FormItem>
      </Form>
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
  import  Ckeditor from '../components/Ckeditor'


  export default {
    name: 'staffEdit',
    components: { Ckeditor },
    data() {
      return {
        mid: 0,
        title: "",
        isAdd: true,

        content: '',
        config: {
            language: 'zh-cn',

            // toolbar: [
            //     ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript']
            // ],

            // toolbar: [
            //     { name: 'clipboard', items: [ 'Undo', 'Redo' ] },
            //     { name: 'styles', items: [ 'Styles', 'Format' ] },
            //     { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Strike', '-', 'RemoveFormat' ] },
            //     { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] },
            //     { name: 'links', items: [ 'Link', 'Unlink' ] },
            //     { name: 'insert', items: [ 'Image', 'EmbedSemantic', 'Table' ] },
            //     { name: 'tools', items: [ 'Maximize' ] },
            //     { name: 'editing', items: [ 'Scayt' ] }
            // ],


            // toolbar: 'basic',
            // toolbar_Basic:
            // [
            //     ['Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink','-','About']
            // ],


            // toolbar: 'Full',
            // toolbar_Full: [
            //     ['Source','-','Save','NewPage','Preview','-','Templates'],
            //     ['Cut','Copy','Paste','PasteText','PasteFromWord','-','Print', 'SpellChecker', 'Scayt'],
            //     ['Undo','Redo','-','Find','Replace','-','SelectAll','RemoveFormat'],
            //     ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'],
            //     '/',
            //     ['Bold','Italic','Underline','Strike','-','Subscript','Superscript'],
            //     ['NumberedList','BulletedList','-','Outdent','Indent','Blockquote'],
            //     ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
            //     ['Link','Unlink','Anchor'],
            //     ['Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak'],
            //     '/',
            //     ['Styles','Format','Font','FontSize'],
            //     ['TextColor','BGColor']
            // ],




            toolbar: [
                { name: 'document', items: [ 'Print' ] },
                { name: 'clipboard', items: [ 'Undo', 'Redo' ] },
                { name: 'styles', items: [ 'Format', 'Font', 'FontSize' ] },
                { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat', 'CopyFormatting' ] },
                { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
                { name: 'align', items: [ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
                { name: 'links', items: [ 'Link', 'Unlink' ] },
                { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] },
                { name: 'insert', items: [ 'Image', 'Table' ] },
                { name: 'tools', items: [ 'Maximize' ] },
                { name: 'editing', items: [ 'Scayt' ] }
            ],


            height: 300
        },

        detailListFormValidate: [],
        formValidate: {
          name: '',
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'}
          ],
          desc: [
              {required: true, message: '请输入活动简介', trigger: 'blur'}
          ],
        }
      }
    },
    created() {
        if(this.$route.query.id) {
            this.title = "编辑活动"
            this.isAdd = false
            let submitData = {
                id: this.$route.query.id,
                queryDetail: true,
            }
            let url = lib.getRequestUrl('/api/activity/getlist', submitData)
            this.$http.get(url, {}).then(res => {
                if(res) {
                   let data = res.data.activity
                    console.log('data',data)
                   this.formValidate.id = data.id
                   this.formValidate.name = data.name
                   this.formValidate.desc = data.desc
                   this.detailListFormValidate = []
                   for(var i = 0; i < data.activity_detail.length; i++) {
                       var len = i + 10
                       var detailList = {
                           htmlId: lib.getRandomString(len),
                           id: data.activity_detail[i].id,
                           title: data.activity_detail[i].title,
                           detail: data.activity_detail[i].detail,
                       }
                       console.log(detailList)
                       this.detailListFormValidate.push(detailList)
                   }
                }
            }).catch(error => {
                console.log(error)
                this.$Message.error('服务器错误!');
            })
        }else{
            this.title = "新增活动"
            this.isAdd = true

            var htmlId = lib.getRandomString()
            this.detailListFormValidate = [
                {
                    htmlId: htmlId,
                    title: "",
                    detail: ""
                },
            ]
        }
    },
    mounted() {

    },
    methods: {
      console() {
        console.log(this.content);
      },
      addDetail() {
          let htmlId = lib.getRandomString()
          this.detailListFormValidate.push({
              htmlId: htmlId,
              title: "",
              detail: ""
          })
      },
      removeDetail(htmlId) {
          this.detailListFormValidate = this.detailListFormValidate.filter(function (item) {
            if(item.htmlId != htmlId) {
                return item
            }
        })
      },
      handleSubmit () {
          let submitData
          let url
          console.log('isAdd',this.isAdd)
          if(this.isAdd) {
              submitData = {
                  name: this.formValidate.name,
                  desc: this.formValidate.desc,
                  activity_detail: this.detailListFormValidate
              }
              url = "/api/activity/add"
          }else{
              submitData = {
                  id: this.formValidate.id,
                  name: this.formValidate.name,
                  desc: this.formValidate.desc,
                  activity_detail: this.detailListFormValidate
              }
              url = "/api/activity/update"
          }

          this.$http.post(url, submitData).then(res => {
              if(res) {
                  this.$Message.success(this.title+'成功!')
                  var _this = this
                  setTimeout(function () {
                      _this.$router.push({
                          path: 'activity',
                          query: {}
                      })
                  },200)
              }
          }).catch(error => {
              this.$Message.error('服务器错误!')
          })
      },
      handleReset (name) {
          this.$refs[name].resetFields();
      },
      onBlur(editor) {
          console.log(editor);
      },
      onFocus(editor) {
          console.log(editor);
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
  .article_edit_container {
    width: 80%;
  }
</style>
