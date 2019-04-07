<template>
    <div class="fileUploadContainer">
      <FormItem :label="label">
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

      <Modal title="图片预览" v-model="viewImg">
        <img :src="EXTERNAL_LINK + imgName" v-if="viewImg" style="width: 100%">
      </Modal>
    </div>
</template>

<script>
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'

  export default {
    name: 'fileUpload',
    props: {
      imglink: {
        type: String
      },
      label: {
        type: String,
        default: ''
      },
      limit: {
        type: Number,
        default: 0
      },
    },
    data() {
      return {
        uploadList: [],
        imgName: '',
        viewImg: false,
        showAddImgCategory1: false,
        img_category_name: '',
        EXTERNAL_LINK: '',
        ACTION_URL: '',
        QiniuToken: ''
      }
    },
    computed: {
      fileName() {
        return 'all'
      },
      defaultList() {
        if (this.imglink) {
          var pics = lib.getImglink(this.imglink, false)
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
      }
    },
    watch: {

    },
    mounted() {
      this.uploadList = this.$refs.upload.fileList

      this.EXTERNAL_LINK = config.Qiniu.EXTERNAL_LINK
      this.ACTION_URL = config.Qiniu.ACTION_URL

      this.getQiniuToken()
    },
    methods: {
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
        this.$refs.upload.fileList = this.$refs.upload.fileList.filter(function (item) {
          return item.name != file.name
        })
        this.uploadList = this.uploadList.filter(function (item) {
          return item.name != file.name
        })

        this.$emit('fileupload',this.uploadList)
      },
      handleSuccess(res, file, fileList) {
        file.url = config.Qiniu.EXTERNAL_LINK + res.key
        file.name = res.hash

        if(this.uploadList.length < fileList.length) {
          this.uploadList.push(file)
        }

        console.log('fileList',fileList)
        console.log('this.uploadList',this.uploadList)

        this.$emit('fileupload',this.uploadList)
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

        const check = this.limit ? this.uploadList.length < this.limit : true

        if (!check) {
          this.$Message.error(`只允许上传${this.limit}张图片`)
        }

        return check;
      }
    }
  }
</script>
<style>
  .uploadContainer {

  }
</style>
