<!--1模板：html结构 -->
<template>
  <header>
    <h1>{{title}}</h1>
  </header>
</template>

<!--2行为：处理逻辑 -->
<script>
  export default {
    name: 'app-header',
    props: ['title'],
    data () {
      return {
        title:"Vue.js Demo in Xiaodao"
      }
    },
    
  }
</script>

<!--3样式：解决样式 -->
<style scoped>
header{
  background: pink;
  padding: 1px;
}
h1{
  color: #222;
  text-align: center;
  }
</style>