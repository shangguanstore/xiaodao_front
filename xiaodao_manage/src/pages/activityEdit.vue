<template>
  <div>
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>营销管理</BreadcrumbItem>
        <BreadcrumbItem>活动报名</BreadcrumbItem>
        <BreadcrumbItem>{{title}}</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div class="rightBtnList" style="display: none">
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

        <FormItem label="封面图片">
          <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="item.status === 'finished'">
              <img :src="item.url">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
              </div>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
          <Upload ref="upload"
                  :before-upload="handleBeforeUpload"
                  :show-upload-list="false"
                  :default-file-list="defaultList"
                  :on-success="handleSuccess"
                  :format="['jpg','jpeg','png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  type="drag"
                  :data="{'token':QiniuToken}"
                  :action="ACTION_URL"
                  style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <div style="font-size: 14px;color: rgba(0, 0, 0, 0.45)">支持：jpg/jpeg/png格式</div>
        </FormItem>
      </Form>
    </div>

    <!--v-for="(item,index) in detailListFormValidate"-->
    <div class="articleDetailList container article_edit_container mt20" >
      <p class="content_title" @click="console">
        详细信息
      </p>

      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" class="mt20">
        <FormItem label="标题" prop="title" style="width: 60%" v-if="false">
          <Input v-model="detailTitle" placeholder="请输入正文标题（不是必填项）"></Input>
        </FormItem>

        <FormItem label="文本预传图片">
          <input id="copyUrlContain" type="text" style="display:none">
          <div v-for="item in detailUploadList" style="display: inline-block">
            <div class="demo-upload-list" >
              <template v-if="item.status === 'finished'">
                <img :src="item.url">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="handleDetailRemove(item)"></Icon>
                </div>
              </template>
              <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
              </template>
            </div>
            <div class="copyArea">
              <span class="url">{{item.url}}</span>
              <Button class="copyBtn" type="info" size="small" @click.native="copy(item.url)">复制链接</Button>
            </div>
          </div>


          <Upload ref="detailUpload"
                  :before-upload="handleDetailBeforeUpload"
                  :show-upload-list="false"
                  :default-file-list="detailDefaultList"
                  :on-success="handleSuccess"
                  :format="['jpg','jpeg','png']"
                  :max-size="2048"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  type="drag"
                  :data="{'token':QiniuToken}"
                  :action="ACTION_URL"
                  style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
              <Icon type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
          <div style="font-size: 14px;color: rgba(0, 0, 0, 0.45);margin-top: 60px"></div>
        </FormItem>

        <FormItem label="正文" prop="detail" style="width: 100%">
          <ckeditor v-if="getDetail" id="aaabbbccc" v-model="detail" :config="config" @blur="onBlur($event)"
                    @focus="onFocus($event)">
          </ckeditor>
        </FormItem>
      </Form>
    </div>

    <div class="bottomBtn">
      <Button size="large" type="primary" @click="handleSubmit()">提交</Button>
      <Button size="large" @click="handleReset()" style="margin-left: 8px">取消</Button>
    </div>

    <Modal title="图片预览" v-model="viewImg">
      <img :src="EXTERNAL_LINK + imgName" v-if="viewImg" style="width: 100%">
    </Modal>

  </div>
</template>

<script>
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'
  import Ckeditor from '../components/Ckeditor'

  export default {
    name: 'staffEdit',
    components: {Ckeditor},
    data() {
      return {
        mid: 0,
        title: "",
          detailTitle: "",
          detail: "",
          getDetail: false,
        isAdd: true,
        QiniuToken: '',

        content: '',
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
          height: 400
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
        },
        /*图片上传*/
        uploadList: [],
        detailUploadList: [],
        imgName: '',
        viewImg: false,
        EXTERNAL_LINK: '',
        ACTION_URL: ''
        /*图片上传结束*/
      }
    },
    created() {
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
              console.log('res',res)
            let data = res.data.activity
            console.log('data', data)
            this.formValidate.id = data.id
            this.formValidate.name = data.name
            this.formValidate.desc = data.desc
            this.detailListFormValidate = []
            for (var i = 0; i < data.activity_detail.length; i++) {
              var len = i + 10
              var detailList = {
                htmlId: lib.getRandomString(len),
                id: data.activity_detail[i].id,
                title: data.activity_detail[i].title,
                detail: data.activity_detail[i].detail,
              }
              console.log(detailList)
              this.detailListFormValidate.push(detailList)

              //暂时这么写
              this.detail = this.detailListFormValidate[0].detail
                this.getDetail = true

                console.log('this.detail',this.detail)
            }
          }
        }).catch(error => {
          console.log(error)
          this.$Message.error('服务器错误!');
        })
      } else {
        this.title = "新增活动"
        this.isAdd = true
          this.detail = ""
          this.getDetail = true

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
      /*图片上传*/
      this.uploadList = this.$refs.upload.fileList
        this.detailUploadList = this.$refs.detailUpload.fileList

        // console.log('this.$refs.upload',this.$refs.upload)
        //
        // var _this = this
        // var timer = setInterval(function () {
        //     if(_this.$refs.detailUpload) {
        //         console.log('this.$refs.detailUpload',_this.$refs.detailUpload)
        //         _this.detailUploadList = _this.$refs.detailUpload.fileList
        //         clearInterval(timer)
        //     }
        // },2000)

      this.getQiniuToken()
      this.EXTERNAL_LINK = config.Qiniu.EXTERNAL_LINK
      this.ACTION_URL = config.Qiniu.ACTION_URL
    },
    computed: {
      /*图片上传*/
      fileName() {
        return 'all'
      },
      defaultList() {
        if (this.$route.query.id) {
          var pics = lib.getImglink(this.$route.query.imglink, false)
          let picData = []
          for (let item in pics) {
            picData.push({
              "name": pics[item],
              'url': config.Qiniu.EXTERNAL_LINK + pics[item]
            })
          }
          return picData
        } else {
          return []
        }
      },
      detailDefaultList() {
          if (this.$route.query.id) {
              var pics = lib.getImglink(this.$route.query.detail_imglink, false)
              let picData = []
              for (let item in pics) {
                  picData.push({
                      "name": pics[item],
                      'url': config.Qiniu.EXTERNAL_LINK + pics[item]
                  })
              }
              return picData
          } else {
              return []
          }
      },
    },
    methods: {
      console() {
        console.log('detailUploadList',this.detailUploadList)
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
          if (item.htmlId != htmlId) {
            return item
          }
        })
      },
      handleSubmit() {
        let submitData
        let url
          var htmlId = lib.getRandomString()
          this.detailListFormValidate = [
              {
                  htmlId: htmlId,
                  title: this.detailTitle,
                  detail: this.detail,
              },
          ]
        if (this.isAdd) {
            this.detailListFormValidate[0].detail_imglink = lib.getUploadPicStr(this.detailUploadList)
          submitData = {
            name: this.formValidate.name,
            desc: this.formValidate.desc,
            // activity_detail: this.detailListFormValidate,
            activity_detail: this.detailListFormValidate,
            imglink: lib.getUploadPicStr(this.uploadList)
          }
          url = "/api/activity/add"
        } else {
            this.detailListFormValidate[0].detail_imglink = lib.getUpdateUploadPicStr(this.detailUploadList)
          submitData = {
            id: this.formValidate.id,
            name: this.formValidate.name,
            desc: this.formValidate.desc,
            activity_detail: this.detailListFormValidate,
            imglink: lib.getUpdateUploadPicStr(this.uploadList)
          }
          url = "/api/activity/update"
        }

        this.$http.post(url, submitData).then(res => {
          if (res) {
            this.$Message.success(this.title + '成功!')
            var _this = this
            setTimeout(function () {
              _this.$router.push({
                path: 'activity',
                query: {}
              })
            }, 200)
          }
        }).catch(error => {
            console.log(error)
          this.$Message.error('服务器错误!')
        })
      },

      /*上传图片*/
      getQiniuToken() {
        let url = 'api/qiniu/token/get'
        let submitData = {}
        this.$http.post(url, submitData).then(res => {
          if (res) {
            console.log('q', res)
            this.QiniuToken = res.data.token
            console.log(this.QiniuToken)
          }
        }).catch(error => {
          this.$Message.error('服务器错误!')
        })
      },
      handleView(name) {
        this.imgName = name;
        this.viewImg = true;
      },
      handleRemove(file) {
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      },
      handleDetailRemove(file) {
          const fileList1 = this.$refs.detailUpload.fileList;
          this.$refs.detailUpload.fileList.splice(fileList1.indexOf(file), 1);
      },
      handleSuccess(res, file) {
        file.url = config.Qiniu.EXTERNAL_LINK + res.key;
        file.name = res.hash;
      },
      handleFormatError(file) {
        this.$Message.success('请上传jpg，jpeg，png，格式的图片')
      },
      handleMaxSize(file) {
        this.$Message.success('请上传不大于2M的图片')
      },
      handleBeforeUpload(file) {
        this.file = file
        let files = [], fileData = [];
        for (let item in this.file) {
          files.push(this.file[item])
        }
        let filess = files[0]
        fileData = filess.split('.')
        // this.$refs.upload.action = config.Qiniu.ACTION_URL
        const check = this.uploadList.length < 1;
        if (!check) {
          this.$Message.success('封面图只允许上传一张图片')
        }
        return check;
      },
      handleDetailBeforeUpload(file) {
          this.file = file
          let files = [], fileData = [];
          for (let item in this.file) {
              files.push(this.file[item])
          }
          let filess = files[0]
          fileData = filess.split('.')
          // this.$refs.upload.action = config.Qiniu.ACTION_URL

          console.log('this.detailUploadList',this.detailUploadList)
          const check = this.detailUploadList.length < 5;
          if (!check) {
              this.$Message.success('封面图只允许上传五张图片')
          }
          return check;
      },
      /*上传结束*/
        copy(url) {
            var input = document.getElementById("copyUrlContain")
            input.style.display = 'block'
            input.value = url
            input.select()
            document.execCommand("copy")
            input.style.display = 'none'
            this.$Message.success('复制成功！')
        },

        handleReset(name) {
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
