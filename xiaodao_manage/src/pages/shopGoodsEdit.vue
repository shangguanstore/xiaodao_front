<template>
  <div>
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>积分商城</BreadcrumbItem>
        <BreadcrumbItem>商品管理</BreadcrumbItem>
        <BreadcrumbItem>{{title}}</BreadcrumbItem>
      </Breadcrumb>
    </div>


    <div class="container activity_edit_container mt20">
      <p class="content_title">基本信息</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" class="mt20">
        <Row :gutter="12">
          <Col span="12">
          <FormItem label="商品类别" prop="shop_goods_category_id">
            <Select v-model="formValidate.shop_goods_category_id">
              <Option v-for="item in shopGoodsCategoryList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="2">
          <Button type="default" @click="preAddCategory">添加</Button>
          </Col>
        </Row>

        <Row>
          <Col span="12">
          <FormItem label="商品名称" prop="name">
            <Input v-model="formValidate.name" placeholder="请输入商品名称"></Input>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
          <FormItem label="进价" prop="price" style="position: relative;">
            <Input number v-model="formValidate.purchase_price_format" placeholder="请输入进价"></Input>
            <span class="fieldUnit">元</span>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
          <FormItem label="售价（微信）" prop="price" style="position: relative;margin-bottom: 6px;">
            <Input number v-model="formValidate.price_format" placeholder="请输入商品价格"></Input>
            <span class="fieldUnit">元</span>
          </FormItem>
          <p style="margin-bottom: 7px;margin-top: 12px;margin-left: 106px;color: #666666;font-size: 12px;">
            *&nbsp;在小程序端，选择支付方式为“微信支付”的价格
          </p>
          </Col>
        </Row>

        <Row class="mt20">
          <Col span="12">
          <FormItem label="售价（积分）" prop="point_format" style="position: relative;margin-bottom: 6px;">
            <Input number v-model="formValidate.point_format" placeholder="请输入"></Input>
            <span class="fieldUnit">分</span>
          </FormItem>
          <p style="margin-bottom: 7px;margin-top: 12px;margin-left: 106px;color: #666666;font-size: 12px;">
            *&nbsp;在小程序端，选择支付方式为“积分兑换”所需要的积分
          </p>
          </Col>
        </Row>

        <Row class="mt20">
          <Col span="12">
          <FormItem label="商品状态" prop="publish">
            <Select v-model="formValidate.publish">
              <Option v-for="item in publishList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>

        <Row class="mt10">
          <Col span="12">
          <FormItem label="库存量" prop="inventory">
            <Input number v-model="formValidate.inventory" placeholder="请输入" :disabled="!isAdd"></Input>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
          <fileUpload v-if="getDataDown" :imglink="formValidate.imglink" label="封面图片" :limit="6"
                      v-on:fileupload="imglinkFileUpload"></fileUpload>
          </Col>
        </Row>
      </Form>
    </div>


    <div class="container activity_edit_container articleDetailList mt20">
      <p class="content_title">
        详细信息
      </p>
      <ckeditor v-if="getDataDown" id="aaabbbccc" v-model="detail" :config="ckConfig" @blur="onBlur($event)"
                @focus="onFocus($event)" @insertPic="detailInsertPic">
      </ckeditor>
    </div>

    <div class="bottomBtn" v-if="isAdd">
      <Button size="large" @click="handleSubmit" type="primary">保存</Button>
    </div>
    <div class="bottomBtn" v-else>
      <Button size="large" @click="handleSubmit" type="primary">提交</Button>
      <Button size="large" style="margin-left: 8px" @click="back">返回</Button>
    </div>

  </div>
</template>

<script>
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'
  import ckeditor from '@/components/ckeditor'
  import fileUpload from '@/components/fileUpload'

  export default {
    name: 'staffEdit',
    components: {
      ckeditor,
      fileUpload
    },
    data() {
      return {
        config: {},
        mid: 0,
        title: "",
        detailTitle: "",
        detail: "",
        getDataDown: false,
        isAdd: true,
        content: '',

        shopGoodsCategoryList: [],
        addCategoryName: '',

        publishList: [],

        uploadImgList: [],
        detailUploadFileName: '',
        ckConfig: {
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
          width: '100%'
        },
        showPicModal: false,
        formValidate: {
          name: '',
          shop_goods_category_id: '',
          purchase_price_format: '',
          price_format: '',
          point_format: '',
          inventory: '',
          publish: config.ShopGoods.PUBLISH_ON,
        },
        ruleValidate: {
          shop_goods_category_id: [
            {required: true, message: '请选择商品类别', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入商品名', trigger: 'blur'}
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

        uploadList: [],
      }
    },
    created() {
      this.config = config

      this.publishList = [
        {
          label: '上架',
          value: config.ShopGoods.PUBLISH_ON
        },
        {
          label: '下架',
          value: config.ShopGoods.PUBLISH_OUT
        },
      ]

      if (this.$route.query.id) {
        this.title = "商品编辑"
        this.isAdd = false
        let submitData = {
          id: this.$route.query.id
        }
        this.$http.post('/api/shop/goods/getlist', submitData).then(res => {
          if (res) {
            let data = res.data.data
            data = lib.filterResult(data)
            data = data[0]
            this.formValidate = data
            this.formValidate.point_format = parseInt(data.point / 1000)

            this.detail = data.detail


            console.log('formValidate', this.formValidate)

            this.getDataDown = true
          }
        }).catch(error => {
          console.log('error', error)
          this.$Message.error(error.message);
        })
      } else {
        this.title = "新增商品"
        this.isAdd = true

        this.detail = ""
        this.getDataDown = true
      }

      this.getShopGoodsCategory()
    },
    mounted() {
    },
    computed: {},
    methods: {
      getShopGoodsCategory() {
        let submitData = {
        }
        this.$http.post('/api/shop/goods/category/getlist', submitData).then(res => {
          if (res) {
            let shopGoodsCategoryList = lib.filterResult(res.data.data)
            this.shopGoodsCategoryList = shopGoodsCategoryList
          }
        }).catch(error => {
          this.$Message.error(error.message);
        })
      },
      preAddCategory() {
        this.addCategoryName = ''
        this.$Modal.confirm({
          render: (h) => {
            return h('div', [
              h('p', {
                style: {
                  textAlign: 'left',
                  fontSize: '16px',
                  marginBottom: '20px'
                },
              }, '新添分类'),
              h('Input', {
                props: {
                  value: this.value,
                  autofocus: true,
                  placeholder: '请输入'
                },
                on: {
                  input: (val) => {
                    this.addCategoryName = val;
                  },
                }
              }),
            ])
          },
          onOk: () => {
            this.addCategory()
          }
        })
      },
      addCategory() {
        let submitData = {
          name: this.addCategoryName
        }
        let url = '/api/shop/goods/category/add'
        this.$http.post(url, submitData).then(res => {
          if (res.data.errNo == 100000) {
            this.$Message.success('添加分类成功!')
            this.getShopGoodsCategory()
          }
        }).catch(error => {
          this.$Message.error(error.message)
        })
      },
      handleSubmit() {
        let submitData = {
          shop_goods_category_id: this.formValidate.shop_goods_category_id,
          name: this.formValidate.name,
          purchase_price: this.formValidate.purchase_price_format * 100,
          price: this.formValidate.price_format * 100,
          point: this.formValidate.point_format * 1000,
          publish: this.formValidate.publish,
          inventory: this.formValidate.inventory,
          imglink: this.formValidate.imglink,
          detail: this.detail
        }
        let url
        if (this.isAdd) {
          url = "/api/shop/goods/add"
        } else {
          submitData.id = this.formValidate.id
          url = "/api/shop/goods/update"
        }

        this.$http.post(url, submitData).then(res => {
          if (res.data.errNo == 100000) {
            this.$Message.success(this.title + '成功!')
            this.back(200)
          }
        }).catch(error => {
          this.$Message.error(error.message)
        })
      },
      back(afterTimes) {
        afterTimes = afterTimes && (typeof afterTimes === 'number' && !isNaN(afterTimes)) ? afterTimes : 0
        console.log('afterTimes', afterTimes)
        setTimeout(() => {
          this.$router.push({
            path: 'ShopGoods',
            query: {}
          })
        }, afterTimes)
      },
      imglinkFileUpload(uploadfile) {
        this.formValidate.imglink = lib.getUpdateUploadPicStr(uploadfile)
      },
      detailInsertPic(insert) {
        this.detail += insert
      }
    }
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
