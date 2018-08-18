<template>
  <div class="users">
  	<Header :title="title"></Header>
    <ul>
      <li v-for="user in users"
          @click="user.show = !user.show">
        <h2 >{{user.name}}</h2>
        <h3 v-show="user.show">{{user.Position}}</h3>
      </li>
    </ul>
  </div>
</template>

<script>
import Header from './Header'
  export default {
    name: 'Users',
    data () {
      return {
      	title: 'XiaoDaoMi-Copyright',
        users:[
          {name:"Henry",Position:"Java工程师",show:false},
          {name:"Lily",Position:"Java工程师",show:false},
          {name:"KangKang",Position:"Java工程师",show:false},
          {name:"Maria",Position:"Java工程师",show:false},
          {name:"Sally",Position:"Java工程师",show:false},
          {name:"Elinna",Position:"Java工程师",show:false}
          ]
      }
    },
    components: {
    	Header,
    }
  }
</script>

<style scoped>
users{
  width: 100%;
  max-width: 1200px;
  margin:40px auto;
  padding: 0 20px;
  box-sizing: border-box;
}
ul{
   display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 0;
  }
li{
  flex-grow: 1;
  flex-basis: 200px;
  text-align: center;
  padding: 30px;
  border: 1px solid #666;
  margin: 10px;
}
</style>