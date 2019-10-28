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
            <Upload ref="upload"
                    :before-upload="handleBeforeUpload"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
                    :on-success="handleSuccess"
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

    <Modal title="创建分组" v-model="showAddImgCategory1"
           @on-ok="addImgCategory"
    >
      <Form :label-width="80" class="mt20">
        <FormItem label="分组名称" prop="img_category_name" style="width: 60%">
          <Input v-model="img_category_name" placeholder="请输入分组名称"></Input>
        </FormItem>
      </Form>
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
    },
    data() {
      return {
        destroyed: false,
        showPicModal: false,
        curImgCategory: 0,
        imgCategory: [],
        totalImgNum: 0,
        showAddImgCategory1: false,
        img_category_name: '',

        uploadImgList: [],
        defaultList: [],
        EXTERNAL_LINK: '',
        ACTION_URL: '',
        QiniuToken: '',
        detailUploadFileName: ''

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
      this.getQiniuToken()
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
        // this.$emit('blur', this.instance)
      },
      onFocus() {
        // this.$emit('focus', this.instance)
      },

      // 图片相关
      getQiniuToken() {
        let url = 'api/qiniu/token/get'
        let submitData = {}
        this.$http.post(url, submitData).then(res => {
          if (res) {
            this.QiniuToken = res.data.token
          }
        }).catch(error => {
          this.$Message.error(error.message)
        })
      },
      addImgCategory() {
        let _this = this
        let url = 'api/img/category/add'
        let submitData = {
          name: this.img_category_name
        }
        this.$http.post(url, submitData).then(res => {
          if (res.data.errNo == 100000) {
            this.$Message.success('添加分组成功！')
            _this.getImgCategory()
          }
        }).catch(error => {
          this.$Message.error(error.message)
        })
      },
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
          this.$Message.error(error.message)
        })
      },
      addImgStorage(name) {
        let _this = this
        let url = 'api/img/storage/add'

        let submitData = {
          imglink: name,
          imgname: this.detailUploadFileName
        }
        if (this.curImgCategory) {
          submitData.img_category_id = this.curImgCategory
        }

        this.$http.post(url, submitData).then(res => {
          if (res.data.errNo == 100000) {
            this.$Message.success('上传成功！')
            _this.getImgStorage()
            _this.getImgCategory()
          }
        }).catch(error => {
          this.$Message.error(error.message)
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
          this.$Message.error(error.message)
        })
      },
      selectDetailImg() {
        let insertImgStr = ''
        this.uploadImgList.map(function (item) {
          if (item.selected) {
            insertImgStr += `<p style="text-align:center"><img alt="" src="${item.imglink_format}" style="width:458px" /></p>`
          }
        })

        this.$emit('insertPic',insertImgStr)
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
        // this.$refs.upload.fileList = this.$refs.upload.fileList.filter(function (item) {
        //   return item.name != file.name
        // })
        // this.uploadList = this.uploadList.filter(function (item) {
        //   return item.name != file.name
        // })
        // this.$emit('fileupload',this.uploadList)
      },
      handleSuccess(res, file) {
        console.log(22222222)
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
        this.detailUploadFileName = file.name.split('.')[0]

        // this.file = file
        // let files = [], fileData = [];
        // for (let item in this.file) {
        //   files.push(this.file[item])
        // }
        // let filess = files[0]
        // fileData = filess.split('.')
      },
      changeImgSelected(item) {
        item.selected = !item.selected
      },
      // 图片相关结束
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
