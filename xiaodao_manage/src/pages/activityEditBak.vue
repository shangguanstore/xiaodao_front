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

    <div class="container activity_edit_container mt20">
      <p class="content_title">基本信息</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" class="mt20">
        <Row>
          <Col span="12">
            <FormItem label="名称" prop="name">
              <Input v-model="formValidate.name" placeholder="请输入活动名称（微信分享标题用此名称）"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
            <FormItem label="简介" prop="desc">
              <Input v-model="formValidate.desc" placeholder="请输入活动简介"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
            <FormItem label="单价" prop="price" style="position: relative">
              <Input number v-model="formValidate.price" placeholder="请输入报名活动价格，如果免费请不填"></Input>
              <span class="fieldUnit">元</span>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="4">
            <FormItem label="人数上限">
              <RadioGroup v-model="formValidate.maxNumRadio">
                <Radio label="have">有</Radio>
                <Radio label="havnt">无</Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="8" style="position: relative" v-if="formValidate.maxNumRadio == 'have'">
            <Input number v-model="formValidate.max_num" placeholder="请输入最大报名人数"></Input> <span class="fieldUnit">人</span>
          </Col>
        </Row>

        <Row>
          <Col span="12">
            <FormItem label="活动时间" prop="timeRange">
              <DatePicker v-model="formValidate.timeRange" type="datetimerange" format="yyyy-MM-dd HH:mm"
                          placeholder="选择日期和时间" style="width: 100%"></DatePicker>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
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
          </Col>
        </Row>
      </Form>
    </div>

    <div class="container activity_edit_container grouponSetting mt20" v-if="activityType == 1">
      <p class="content_title">团购设置</p>
      <Form ref="grouponFormValidate" :model="grouponFormValidate" :rules="grouponRuleValidate" :label-width="100"
            class="mt20">
        <Row>
          <Col span="12">
            <FormItem label="团购价格" prop="group_price" style="position: relative">
              <Input number v-model="grouponFormValidate.group_price" placeholder="请输入团购价"></Input>
              <span class="fieldUnit">元</span>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
            <FormItem label="成团人数" prop="group_num" style="position: relative">
              <Input number v-model="grouponFormValidate.group_num" placeholder="请输入成团人数"></Input>
              <span class="fieldUnit">人</span>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
            <FormItem label="开放团购时间" prop="timeRange">
              <DatePicker v-model="grouponFormValidate.timeRange" type="datetimerange" format="yyyy-MM-dd HH:mm"
                          placeholder="选择日期和时间" style="width: 100%"></DatePicker>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>

    <div class="container activity_edit_container articleDetailList mt20">
      <p class="content_title" @click="console">
        详细信息
      </p>

      <!--<div class="mt20" style="width: 100%;display: flex;justify-content: flex-start;">-->
        <!--<ckeditor v-if="getDetail" id="aaabbbccc" v-model="detail" :config="config" @blur="onBlur($event)"-->
                  <!--@focus="onFocus($event)">-->
        <!--</ckeditor>-->

        <!--<div class="imgListBtn" @click="showPicModal = !showPicModal">-->
          <!--<i class="icon iconfont icon-tupian" style="margin-left: 12px;font-size: 14px;"></i>-->
          <!--<span>图片</span>-->
        <!--</div>-->
      <!--</div>-->

      <ckeditor v-if="getDetail" id="aaabbbccc" v-model="detail" :config="config" :QiniuToken="QiniuToken" @blur="onBlur($event)"
                @focus="onFocus($event)">
      </ckeditor>
    </div>


    <div class="bottomBtn">
      <Button size="large" type="primary" @click="handleSubmit()">提交</Button>
      <Button size="large" @click="handleReset()" style="margin-left: 8px">取消</Button>
    </div>

    <Modal title="图片预览" v-model="viewImg">
      <img :src="EXTERNAL_LINK + imgName" v-if="viewImg" style="width: 100%">
    </Modal>

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
                    :default-file-list="detailDefaultList"
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
  import ckeditor from '@/components/ckeditor'

  export default {
    name: 'staffEdit',
    components: {ckeditor},
    data() {
      return {
        mid: 0,
        activityType: 0,
        title: "",
        detailTitle: "",
        detail: "",
        getDetail: false,
        isAdd: true,
        QiniuToken: '',
        content: '',
        imgCategory: [],
        totalImgNum: 0,
        curImgCategory: 0,
        uploadImgList: [],
        detailUploadFileName: '',
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
          height: 400,
          width: 700
        },
        showPicModal: false,
        formValidate: {
          name: '',
          desc: '',
          price: '',
          maxNumRadio: 'havnt',
          max_num: '',
          timeRange: ''
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'}
          ],
          desc: [
            {required: true, message: '请输入活动简介', trigger: 'blur'}
          ],
          max_num: [{
            required: true,
            type: 'number',
            message: '您填写的格式错误，请输入数字',
            trigger: 'blur'
          }],
        },
        grouponFormValidate: {
          group_num: '',
          group_price: '',
          timeRange: ''
        },
        grouponRuleValidate: {
          group_num: [{
            required: true,
            type: 'number',
            message: '您填写的格式错误，请输入数字',
            trigger: 'blur'
          }],
          group_price: [{
            required: true,
            type: 'number',
            message: '您填写的格式错误，请输入数字',
            trigger: 'blur'
          }],
        },

        /*图片上传*/
        uploadList: [],
        detailUploadList: [],
        imgName: '',
        viewImg: false,
        showAddImgCategory1: false,
        img_category_name: '',
        EXTERNAL_LINK: '',
        ACTION_URL: ''
        /*图片上传结束*/
      }
    },
    created() {
      this.activityType = this.$route.query.type ? this.$route.query.type : config.Activity.TYPE_NORMAL
      if (this.$route.query.id) {
        this.title = "编辑活动"
        this.isAdd = false
        let submitData = {
          id: this.$route.query.id,
          cid: this.$store.state.cid,
          queryDetail: true,
        }
        let url = lib.getRequestUrl('/api/activity/getlist', submitData)
        this.$http.get(url, {}).then(res => {
          if (res) {
            let data = res.data.data[0]
            var startTimeDate = new Date().setTime(data.start_time * 1000)
            var endTimeDate = new Date().setTime(data.end_time * 1000)
            var timeRange = [startTimeDate, endTimeDate];
            console.log('timeRange', timeRange)

            this.activityType = data.type
            this.formValidate.id = data.id
            this.formValidate.name = data.name
            this.formValidate.desc = data.desc
            this.formValidate.price = data.price
            this.formValidate.max_num = data.max_num
            this.formValidate.maxNumRadio = data.max_num ? 'have' : 'havnt'
            this.formValidate.timeRange = timeRange

            if (this.activityType == config.Activity.TYPE_GROUPON) {
              this.grouponFormValidate.group_num = data.group_num
              this.grouponFormValidate.group_price = data.group_price
              var groupStartTimeDate = new Date().setTime(data.group_start_time * 1000)
              var groupEndTimeDate = new Date().setTime(data.group_end_time * 1000)
              var groupTimeRange = [new Date(groupStartTimeDate), new Date(groupEndTimeDate)]
              console.log('groupTimeRange', groupTimeRange)
              this.grouponFormValidate.timeRange = groupTimeRange
            }

            this.detail = data.detail
            this.getDetail = true
          }
        }).catch(error => {
          console.log('error', error)
          this.$Message.error(error.message);
        })
      } else {
        this.title = "新增活动"
        this.isAdd = true

        this.detail = ""
        this.getDetail = true
      }

      this.getImgCategory()
      this.getImgStorage()
    },
    mounted() {
      /*图片上传*/
      this.uploadList = this.$refs.upload.fileList
      this.detailUploadList = this.$refs.detailUpload.fileList

      //
      // var _this = this
      // var timer = setInterval(function () {
      //     if(_this.$refs.detailUpload) {
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
        console.log('detailUploadList', this.detailUploadList)
      },
      addDetail() {

      },
      removeDetail() {

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
      selectDetailImg() {
        let insertImgStr = ''
        this.uploadImgList.map(function (item) {
          if (item.selected) {
            insertImgStr += `<p style="text-align:center"><img alt="" src="${item.imglink_format}" style="width:458px" /></p>`
          }
        })

        this.detail += insertImgStr
      },

      handleSubmit() {
        console.log('config',config)

        var timeRange = this.formValidate.timeRange
        console.log('timeRange', timeRange)
        var time1 = timeRange[0]
        var time2 = timeRange[1]
        console.log('time1', time1)
        var startTime = Math.ceil(new Date(timeRange[0]).getTime() / 1000)
        var endTime = Math.ceil(new Date(timeRange[1]).getTime() / 1000)

        let submitData = {
          type: config.Activity.TYPE_NORMAL,
          name: this.formValidate.name,
          desc: this.formValidate.desc,
          price: this.formValidate.price,
          max_num: this.formValidate.max_num,
          start_time: startTime,
          end_time: endTime,
          detail: this.detail,
          imglink: lib.getUpdateUploadPicStr(this.uploadList)
        }
        let url
        if (this.isAdd) {
          url = "/api/activity/add"
        } else {
          submitData.id = this.formValidate.id
          url = "/api/activity/update"
        }

        if (this.activityType == config.Activity.TYPE_GROUPON) {
          var timeRange = this.grouponFormValidate.timeRange
          var startTime = Math.ceil(new Date(timeRange[0]).getTime() / 1000)
          var endTime = Math.ceil(new Date(timeRange[1]).getTime() / 1000)
          submitData.type = config.Activity.TYPE_GROUPON
          submitData.group_num = this.grouponFormValidate.group_num
          submitData.group_price = this.grouponFormValidate.group_price
          submitData.group_start_time = startTime
          submitData.group_end_time = endTime
        }

        this.$http.post(url, submitData).then(res => {
          if (res.data.errNo == 100000) {
            this.$Message.success(this.title + '成功!')
            var _this = this
            var path = 'activity'
            if (this.activityType == config.Activity.TYPE_GROUPON) {
              path = 'groupon'
            }
            setTimeout(function () {
              _this.$router.push({
                path: path,
                query: {}
              })
            }, 200)
          }
        }).catch(error => {
          console.log(error)
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

      changeImgSelected(item) {
        item.selected = !item.selected
      },

      changeImgCategory(id) {
        this.curImgCategory = id
        this.getImgStorage()
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
          this.$Message.error(error.message)
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

  .activity_edit_container {
    width: 80%;
  }

  .imgListBtn {
    span {
      margin-left: 4px;
      font-size: 15px;
    }
  }

  .picDialog {
    .title {
      padding: 20px 30px;
      color: #222;
      font-size: 18px;
      .titleName {

      }
      .close {
        cursor: pointer;
      }
    }

    .imgContainer {
      width: 100%;
      height: 479px;
      overflow: hidden;
      .imgCategory {
        width: 16%;
        height: 479px;
        border-right: solid 1px #e7e7eb;
        ul {
          margin-top: 10px;
          height: 400px;
          overflow-y: scroll;
          li {
            padding: 5px 0;
            text-align: center;
            cursor: pointer;
            &:hover {
              background: #f4f5f9;
            }
            strong {
              font-size: 14px;
            }
            em {
              padding-left: 3px;
              color: #8d8d8d;
            }
            &.active {
              background: #f4f5f9;
            }
          }
        }
      }

      .imgContent {
        width: 80%;
        height: 479px;
        .top {
          height: 53px;
          line-height: 53px;
          border-bottom: solid 1px #e7e7eb;
        }
        .content {
          overflow: scroll;
          height: 479px;
          .imgListArea {
            display: inline-block;
            .uploadList {
              .imgItem {
                position: relative;
                margin-right: 11px;
                margin-bottom: 10px;
                float: left;
                text-align: center;
                .picBox {
                  width: 117px;
                  height: 117px;
                  position: relative;
                  overflow: hidden;
                  img {
                    height: 117px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    border-bottom: solid 1px #e7e7eb;
                  }
                  .selected {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 118px;
                    height: 118px;
                    background: rgba(0, 0, 0, 0.6) url("../assets/img/selected.png") no-repeat center;
                  }
                }
                .picName {
                  height: 32px;
                  line-height: 32px;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
              }
            }
          }

        }
      }
    }

  }
</style>
