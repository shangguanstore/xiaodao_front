<template>
  <div>
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>营销管理</BreadcrumbItem>
        <BreadcrumbItem>小程序Banner设置</BreadcrumbItem>
        <BreadcrumbItem>{{title}}</BreadcrumbItem>
      </Breadcrumb>
    </div>

    <div class="container article_edit_container mt20">
      <p class="content_title">小程序首页banner设置</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" class="mt20">
        <FormItem label="Banner封面">
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
        <FormItem label="跳转活动" prop="name" style="width: 60%" >
\          <Select v-model="model1">
            <Option v-for="item in activityList" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
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

  export default {
    name: 'staffEdit',
    data() {
      return {
        mid: 0,
        title: "",
        isAdd: true,
        QiniuToken: '',
        activityList: [],

        content: '',
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
        imgName: '',
        viewImg: false,
        EXTERNAL_LINK: '',
        ACTION_URL: ''
        /*图片上传结束*/
      }
    },
    created() {
      this.getActivityList()

      if (this.$route.query.id) {
        this.title = "编辑Banner"
        this.isAdd = false
        let submitData = {
          id: this.$route.query.id,
          queryDetail: true,
        }
        let url = lib.getRequestUrl('/api/activity/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          if (res) {
            let data = res.data.activity
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
              this.detailListFormValidate.push(detailList)
            }
          }
        }).catch(error => {
          this.$Message.error('服务器错误!');
        })
      } else {
        this.title = "新添Banner"
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
      /*图片上传*/
      this.uploadList = this.$refs.upload.fileList
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
        if(this.$route.query.Id) {
          let pics = this.$route.query.Pic.split("|")
          pics = this.removeDuplicatedItem(pics)
          let picData = []
          for(let item in pics) {
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
      getActivityList() {
        let submitData = {
          queryDetail: false
        }
        let url = lib.getRequestUrl('/api/activity/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          if (res) {
            this.activityList = lib.filterResult(res.data.activity)
            console.log('this.activityList',this.activityList)
          }
        }).catch(error => {
          this.$Message.error('服务器错误!');
        })
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
        if (this.isAdd) {
          submitData = {
            name: this.formValidate.name,
            desc: this.formValidate.desc,
            activity_detail: this.detailListFormValidate
          }
          url = "/api/activity/add"
        } else {
          submitData = {
            id: this.formValidate.id,
            name: this.formValidate.name,
            desc: this.formValidate.desc,
            activity_detail: this.detailListFormValidate
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
          this.$Message.error('服务器错误!')
        })
      },

      /*上传图片*/
      getQiniuToken() {
        let url = 'api/qiniu/token/get'
        let submitData = {}
        this.$http.post(url, submitData).then(res => {
          if (res) {
            this.QiniuToken = res.data.token
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
        const check = this.uploadList.length < 5;
        if (!check) {
          this.$Message.success('Banner图片不超过5张')
        }
        return check;
      },
      /*上传结束*/

      handleReset(name) {
        this.$refs[name].resetFields();
      },

    },
  }
</script>
<style lang="less">

</style>
