<template>
  <div class="regContainer">
    <Row>
      <Col span="12"></Col>
      <Col span="12">
        <div class="regBox">
          <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="Name" prop="name">
              <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
            </FormItem>
            <FormItem label="E-mail" prop="mail">
              <Input v-model="formValidate.mail" placeholder="Enter your e-mail"></Input>
            </FormItem>
          </Form>
        </div>
      </Col>
      <Col span="12"></Col>
    </Row>
  </div>

</template>

<script>
  export default {
    name: 'reg',
    data() {
      return {

      }
    },
    mounted(){

    },
    methods: {

    },
  }
</script>
<style>

</style>
