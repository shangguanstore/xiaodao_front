<template>
  <div class="multiloginContainer">
    <p class="title">选择登录分支机构</p>

    <ul class="group">
      <li class="border ellipsis" v-for="item in companyList" @click="go(item)">
        {{item.name}}({{item.role}})
      </li>
    </ul>

  </div>

</template>

<script>
  import config from '@/assets/js/config/index.js'
  import lib from '@/assets/js/lib/index.js'

  export default {
    name: 'multilogin',
    data() {
      return {
        companyList: []
      }
    },
    created() {
      this.getMultiCompanyList()
    },
    mounted() {

    },
    methods: {
      getMultiCompanyList() {
        let submitData = {
          uid: this.$route.query.uid,
        }
        this.$http.post('/api/multicompany/list', submitData).then(res => {
          let data = res.data.data
          this.companyList = data

        }).catch(error => {
          this.$Message.error(error.message);
        })
      },
      go(item) {
        let submitData = {
          cid: item.cid,
          uid: this.$route.query.uid,
          role_id: item.role_id,
        }
        this.$http.post('/api/member/multilogin', submitData).then(res => {
          let data = res.data

          this.$store.dispatch('Uname', data.member.uname)
          this.$store.dispatch('Cid', item.cid)
          this.$store.dispatch('Uid', item.uid)
          this.$store.dispatch('Mid', item.mid)
          this.$store.dispatch('CompanyName', item.name)
          this.$store.dispatch('RoleName', item.role)
          this.$store.dispatch('RoleId', item.role_id)
          this.$router.push({
            path: 'home',
            query: {
            }
          })
        }).catch(error => {
          this.$Message.error(error.message);
        })
      },
    }
  }
</script>

<style>
  .multiloginContainer > .title {
    text-align: center;
    font-size: 30px;
    margin-top: 200px;
  }

  .multiloginContainer ul.group {
    margin-top: 20px;
  }

  .multiloginContainer ul.group li {
    margin: 0 auto;
    margin-top: 10px;
    text-align: center;
    width: 400px;
    padding: 10px 16px;
    font-size: 18px;
    line-height: 1.33;
    border-radius: 0;
    color: #333;
    cursor: pointer;
  }

  .multiloginContainer ul.group li:hover {
    color: #fff;
    background-color: #5cb85c;
    border-color: #4cae4c;
  }


</style>
