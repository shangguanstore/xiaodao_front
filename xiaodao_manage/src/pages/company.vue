<template>
  <div>
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>机构设置</BreadcrumbItem>
        <BreadcrumbItem>机构编辑</BreadcrumbItem>
      </Breadcrumb>
      <!--<p>机构编辑</p>-->
    </div>
    <div class="container company_container mt20">
      <p class="content_title">基本信息</p>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120" class="mt20">
        <Row>
          <Col span="12">
            <FormItem label="机构名称" prop="name">
              <Input v-model="formValidate.name" placeholder="请输入机构名称"></Input>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
          <fileUpload v-if="getDataDown" :imglink="formValidate.logo" imgSize="width: 80px;" label="LOGO" :limit="1"
                      v-on:fileupload="imglinkFileUpload"></fileUpload>
          </Col>
        </Row>

        <Row>
          <Col span="12">
          <FormItem label="固话" prop="fixphone">
            <Input v-model="formValidate.fixphone" placeholder="请输入固话"></Input>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
          <FormItem label="手机" prop="phone">
            <Input v-model="formValidate.phone" placeholder="请输入手机号码"></Input>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
          <FormItem label="详细地址" prop="address">
            <Input v-model="formValidate.address" placeholder="机构地址（将在小程序上展示）"></Input>
          </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
          <FormItem label="所在地理坐标" prop="geo">
            <div style="width: 100%;position: relative;">
              <Input v-model="formValidate.geo" placeholder="地理位置（标记机构所在位置）"></Input>
              <Button @click="selectAddress" style="position: absolute;top: 1px;right: 0;">点击选择</Button>
            </div>
          </FormItem>
          </Col>
        </Row>

        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>

    </div>

    <Modal
      v-model="addressModel"
      width="70"
      title="点击获取地理坐标">

      <Row :gutter="32">
        <Col span="14">
          <div class="btnArea">
            <div class="brnTitle">地址搜索：</div>
            <Row :gutter="16">
              <Col span="16">
                <Input v-model="addressSearch" placeholder="输入地址（如：xx市xx区/xx县）"/>
              </Col>
              <Col span="6">
                <Button id="searchBtn" type="primary" icon="ios-search">搜索</Button>
              </Col>
            </Row>
          </div>
        </Col>
        <Col span="8">
          <div class="btnArea">
            <div class="brnTitle">当前坐标点如下：</div>
            <Input v-model="latLngDisplay" placeholder=""/>
          </div>
        </Col>
      </Row>

      <div id="map" class="mt20" style="width: 100%;height: 400px"></div>
    </Modal>
  </div>
</template>

<script>
  import lib from '@/assets/js/lib/index'
  import fileUpload from '@/components/fileUpload'

  export default {
    name: 'company',
    components: {
      fileUpload
    },
    data() {
      return {
        addressModel: false,
        addressSearch: '',
        latLngDisplay: '',
        getDataDown: false,

        formValidate: {
          name: '',
          phone: '',
          fixphone: '',
          address: '',
          geo: '',
          logo: '',
        },
        ruleValidate: {
          name: [
            {required: true, message: '请输入机构名称', trigger: 'blur'}
          ],
          // phone: [
          //   {required: true, message: '请输入手机号', trigger: 'blur'}
          // ],
          // address: [
          //   {required: true, message: '请输入机构地址', trigger: 'blur'}
          // ],
        }
      }
    },
    created() {
      this.getCompany()
    },
    mounted() {

    },
    methods: {
      getCompany() {
        let url = lib.getRequestUrl('/api/company/getlist', {})
        this.$http.get(url, {}).then(res => {
          let company = res.data.data || []
          this.formValidate = company[0]
          this.getDataDown = true
          this.mpInit()
        }).catch(error => {
          console.log('error', error)
          this.$Message.error('服务器错误!');
        })
      },
      imglinkFileUpload(uploadfile) {
        this.formValidate.logo = lib.getUpdateUploadPicStr(uploadfile)
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let url = 'api/company/update'
            let submitData = {
              name: this.formValidate.name,
              phone: this.formValidate.phone,
              fixphone: this.formValidate.fixphone,
              address: this.formValidate.address,
              geo: this.formValidate.geo,
              logo: this.formValidate.logo,
            }
            this.$http.post(url, submitData).then(res => {
              console.log(res)
              this.$Message.success('Success!');
            }).catch(error => {
              this.$Message.error('服务器错误!');
            })
          } else {
            this.$Message.error('请输入完整信息!');
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields();
      },

      mpInit() {
        let lat
        let lng
        let markersArray = []

        if(this.formValidate.geo) {
          var latlngArr = this.formValidate.geo.split(',')
          lat = latlngArr[0]
          lng = latlngArr[1]
        }else{
          lat = 32.06698144154888
          lng = 118.85929868090898
        }

        let myLatlng = new qq.maps.LatLng(lat, lng);
        let myOptions = {
          zoom: 12,
          center: myLatlng,
          mapTypeId: qq.maps.MapTypeId.ROADMAP
        }
        let map = new qq.maps.Map(document.getElementById("map"), myOptions);

        marke.call(this, lat, lng)

        //地址解析
        let geocoder = new qq.maps.Geocoder({
          complete : result => {
            map.setCenter(result.detail.location)
            marke.call(this, result.detail.location.lat, result.detail.location.lng)
          }
        });

        qq.maps.event.addListener(
          map,
          'click',
          event=>{
            lat = event.latLng.getLat()
            lng = event.latLng.getLng()
            // marke(lat, lng)
            marke.call(this, lat, lng)
          }
        );

        document.getElementById("searchBtn").addEventListener("click", ()=>{
          geocoder.getLocation(this.addressSearch);
        });

        function marke(lat, lng) {
          this.formValidate.geo = `${lat},${lng}`
          this.latLngDisplay = `${lat},${lng}`

          deleteOverlays()
          var center = new qq.maps.LatLng(lat, lng);
          var marker = new qq.maps.Marker({
            position: center,
            map
          });
          markersArray.push(marker)
        }

        function deleteOverlays() {
          if (markersArray.length > 0) {
            for (let i in markersArray) {
              markersArray[i].setMap(null);
            }
            markersArray.length = 0;
          }
        }


      },
      selectAddress() {
        this.addressModel = true
      },
    },
  }
</script>
<style>

</style>
