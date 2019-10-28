<template>
  <div class="tableContainer">
    <Table border :loading="loading" :columns="columns" :data="tableData" class="mt20">></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="total" show-total show-sizer show-elevator :current="pageIndex" @on-change="changePage"
              @on-page-size-change="changepageSize"></Page>
      </div>
    </div>
  </div>
</template>

<script>
  import lib from '@/assets/js/lib/index'
  import config from '@/assets/js/config/index'

  export default {
    name: 'MyTable',
    props: {
      action: {
        type: String
      },
      options: {
        type: Object,
        default: {}
      },
      columns: {
        type: Array
      },
      searchValue: {
        type: String,
        default: ''
      },
      filterFn: {
        type: Function,
        default: item=>item
      }
    },
    data() {
      return {
        loading: true,
        pageIndex: 1,
        pageSize: 10,
        sort: "",
        total: 0,
        tableData: []
      }
    },
    computed: {},
    watch: {},
    mounted() {
      this.getTableData({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      })
    },
    methods: {
      getTableData(option) {
        let submitData = {
          search: this.searchValue,
          pageIndex: option.pageIndex,
          pageSize: option.pageSize
        }
        submitData = Object.assign(submitData, this.options)
        this.$http.post(this.action, submitData).then(res => {
          if (res) {
            this.loading = false
            this.pageIndex = option.pageIndex
            this.total = res.data.total
            let tableData = lib.filterResult(res.data.data)
            this.tableData = this.filterFn(tableData)
          }
        }).catch(error => {
          console.log('error', error)
          this.loading = false
          this.$Message.error(error.message);
        })
      },
      refresh() {
        this.getTableData({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        })
      },
      changePage(page) {
        this.pageIndex = page
        this.getTableData(
          {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
          }
        )
      },
      changepageSize(size) {
        this.pageSize = size
        this.getTableData(
          {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
          }
        )
      },
    }
  }
</script>
<style>

</style>
