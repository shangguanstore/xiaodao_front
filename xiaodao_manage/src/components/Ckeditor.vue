<template>
  <div>
    <div class="mt20" style="width: 100%;display: flex;justify-content: flex-start;">
      <div class="ckeditor">
        <textarea
          :name="name"
          :id="id"
          :value="value"
          :types="types"
          :config="config">
        </textarea>
      </div>

      <div class="imgListBtn" @click="showPicModal = !showPicModal">
        <i class="icon iconfont icon-tupian" style="margin-left: 12px;font-size: 14px;"></i>
        <span>图片</span>
      </div>
    </div>
    <Modal class="picDialog" v-model="showPicModal" width="800" :styles="{top: '30px'}" @on-ok="selectDetailImg">
      <div slot="header" class="title">
        <div class="titleName fl">选择图片</div>
      </div>

      <div class="imgContainer">
        <div class="imgCategory fl">
          <ul>
            <li :class="curImgCategory == 0 ? 'active' : ''" @click="changeImgCategory(0)">
              <strong>全部图片</strong>
              <em>({{totalImgNum}})</em>
            </li>

            <li v-for="(item, index) in imgCategory" :class="curImgCategory == item.id ? 'active' : ''"
                @click="changeImgCategory(item.id)">
              <strong>{{item.name}}</strong>
              <em>({{item.num}})</em>
            </li>
            <li @click="showAddImgCategory1 = true">
              <strong>新建分组</strong>
            </li>
          </ul>
        </div>

        <div class="imgContent fr">
          <div class="top">
            <Upload ref="detailUpload"
                    :before-upload="handleDetailBeforeUpload"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
                    :on-success="handleDetailSuccess"
                    :format="['jpg','jpeg','png']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :data="{'token':QiniuToken}"
                    :action="ACTION_URL"
                    style="display: inline-block;width:58px;">
              <Button type="primary">本地上传</Button>
            </Upload>
          </div>
          <div class="content">
            <div class="imgListArea mt20" v-for="item in uploadImgList">
              <div class="uploadList">
                <template>
                  <div class="imgItem">
                    <div class="picBox" @click="changeImgSelected(item)">
                      <img :src="item.imglink_format">
                      <div v-show="item.selected" class="selected"></div>
                    </div>
                    <p class="picName">noData</p>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'

  export default {
    name: 'ckeditor',
    props: {
      name: {
        type: String,
        default: () => `editor`
      },
      value: {
        type: String
      },
      id: {
        type: String,
        default: () => `editor`
      },
      types: {
        type: String,
        default: () => `classic`
      },
      config: {
        type: Object,
        default: () => {
        }
      },
      QiniuToken: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        destroyed: false,
        showPicModal: false,
        curImgCategory: 0,
        imgCategory: [],
        totalImgNum: 0,
        uploadImgList: [],
        defaultList: [],
        EXTERNAL_LINK: '',
        ACTION_URL: '',
      }
    },
    computed: {
      instance() {
        return CKEDITOR.instances[this.id]
      },
      // defaultList() {
      //   if (this.imglink) {
      //     var pics = lib.getImglink(this.imglink, false)
      //     let picData = []
      //     for (let item in pics) {
      //       picData.push({
      //         "name": pics[item],
      //         'url': config.Qiniu.EXTERNAL_LINK + pics[item]
      //       })
      //     }
      //     return picData
      //   } else {
      //     return []
      //   }
      // },
      //
      // detailDefaultList() {
      //   if (this.$route.query.id) {
      //     var pics = lib.getImglink(this.$route.query.detail_imglink, false)
      //     let picData = []
      //     for (let item in pics) {
      //       picData.push({
      //         "name": pics[item],
      //         'url': config.Qiniu.EXTERNAL_LINK + pics[item]
      //       })
      //     }
      //     return picData
      //   } else {
      //     return []
      //   }
      // },
    },
    watch: {
      value(val) {
        if (this.instance) {
          this.update(val)
        }
      }
    },
    mounted() {
      this.create()
      this.getImgCategory()
      this.getImgStorage()

      this.EXTERNAL_LINK = config.Qiniu.EXTERNAL_LINK
      this.ACTION_URL = config.Qiniu.ACTION_URL
    },
    beforeDestroy() {
      this.destroy()
    },
    methods: {
      create() {
        if (typeof CKEDITOR === 'undefined') {
          console.log('CKEDITOR is missing (http://ckeditor.com/)')
        } else {
          if (this.types === 'inline') {
            CKEDITOR.inline(this.id, this.config)
          } else {
            CKEDITOR.replace(this.id, this.config)
          }
          this.instance.setData(this.value)
          this.instance.on('change', this.onChange)
          this.instance.on('blur', this.onBlur)
          this.instance.on('focus', this.onFocus)
        }
      },
      update(val) {
        let html = this.instance.getData()
        if (html !== val) {
          this.instance.setData(val)
        }
      },
      destroy() {
        if (!this.destroyed) {
          this.instance.focusManager.blur(true)
          this.instance.removeAllListeners()
          this.instance.destroy()
          this.destroyed = true
        }
      },
      onChange() {
        let html = this.instance.getData()
        if (html !== this.value) {
          this.$emit('input', html)
        }
      },
      onBlur() {
        this.$emit('blur', this.instance)
      },
      onFocus() {
        this.$emit('focus', this.instance)
      },

      // 图片上传开始
      getImgCategory() {
        let _this = this
        let url = 'api/img/category/getlist'
        let submitData = {}
        this.$http.get(url, submitData).then(res => {
          if (res.data.errNo == 100000) {
            let totalImgNum = 0
            let data = res.data.data || []
            data.map(function (item) {
              totalImgNum += item.num
            })

            _this.imgCategory = data
            _this.totalImgNum = totalImgNum
          }
        }).catch(error => {
          console.log(error)
          this.$Message.error('服务器错误!')
        })
      },
      getImgStorage() {
        let _this = this
        let submitData = {
          pageIndex: 1,
          pageSize: 1000,
          img_category_id: this.curImgCategory
        }
        let url = lib.getRequestUrl('api/img/storage/getlist', submitData)
        this.$http.get(url, submitData).then(res => {
          if (res.data.errNo == 100000) {
            let uploadImgList = lib.filterResult(res.data.data)
            if (uploadImgList.length > 0) {
              uploadImgList.map(function (item) {
                item.imglink_format = item.imglink_format[0]
                item.selected = false
              })
              uploadImgList[0].selected = true
              this.uploadImgList = uploadImgList
            }
          }
        }).catch(error => {
          console.log(error)
          this.$Message.error('服务器错误!')
        })
      },
      selectDetailImg() {
        let insertImgStr = ''
        this.uploadImgList.map(function (item) {
          if (item.selected) {
            insertImgStr += `<p style="text-align:center"><img alt="" src="${item.imglink_format}" style="width:458px" /></p>`
          }
        })

        this.detail += insertImgStr
      },
      changeImgCategory(id) {
        this.curImgCategory = id
        this.getImgStorage()
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
        file.url = config.Qiniu.EXTERNAL_LINK + res.key
        file.name = res.hash
      },
      handleDetailSuccess(res, file) {
        file.url = config.Qiniu.EXTERNAL_LINK + res.key
        file.name = res.hash

        this.addImgStorage(res.hash)
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
        this.detailUploadFileName = file.name.split('.')[0]
        console.log('this.detailUploadFileName', this.detailUploadFileName)

        this.file = file
        let files = [], fileData = [];
        for (let item in this.file) {
          files.push(this.file[item])
        }
        let filess = files[0]
        fileData = filess.split('.')
        // this.$refs.upload.action = config.Qiniu.ACTION_URL

        const check = this.detailUploadList.length < 5;
        if (!check) {
          this.$Message.success('封面图只允许上传五张图片')
        }
        return check;
      },
      // 图片上传结束
    }
  }
</script>
<style>
  .ckeditor::after {
    content: "";
    display: table;
    clear: both;
  }
</style>
