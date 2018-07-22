<template>
  <Content :style="{padding: '0 27px 27px 27px'}">
    <div class="manage_title">
      <Breadcrumb>
        <BreadcrumbItem>aaa</BreadcrumbItem>
        <BreadcrumbItem>bbb</BreadcrumbItem>
      </Breadcrumb>
      <p @click="console">ccc</p>
    </div>
    <div class="manage_container mt20">
      <p class="content_title">基本信息</p>
    </div>
  </Content>
</template>

<script>
  export default {
    name: 'template',
    data() {
      return {}
    },
    created() {

    },
    mounted() {

    },
    methods: {
      console() {

      },
    },
    watch: {
      // data: function (n, o) {
      //
      // },
    },
  }
</script>

<style>

</style>
