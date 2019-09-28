<template>
    <div class="tableContainer">

    </div>
</template>

<script>
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'

  export default {
    name: 'table',
    props: {
      imglink: {
        type: String
      },
      imgSize: {
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

      }
    },
    computed: {

    },
    watch: {

    },
    mounted() {

    },
    methods: {}
  }
</script>
<style>

</style>
