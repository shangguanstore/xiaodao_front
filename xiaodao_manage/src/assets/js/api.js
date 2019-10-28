import config from '@/assets/js/config/index'
import lib from '@/assets/js/lib/index'

// var api = {
//   getSaleList: (success, fail) =>{
//     console.log('this',this)
//
//     let submitData = {
//       roles: [config.UserRole.ROLE_SALE]
//     }
//     let url = lib.getRequestUrl('/api/member/getlist', submitData)
//     this.$http.get(url, {}).then(res => {
//       let member = res.data.member
//       member = lib.filterResult(member)
//       success(member)
//     }).catch(error => {
//       fail(error)
//     })
//   }
// }


function getSaleList(success, fail){
  let submitData = {
    roles: [config.UserRole.ROLE_SALE]
  }
  let url = lib.getRequestUrl('/api/member/getlist', submitData)
  this.$http.get(url, {}).then(res => {
    let member = res.data.member
    member = lib.filterResult(member)
    success(member)
  }).catch(error => {
    fail(error)
  })
}

function getTeacherList(success, fail){
  let submitData = {
    roles: [config.UserRole.ROLE_TEACHER]
  }
  let url = lib.getRequestUrl('/api/member/getlist', submitData)
  this.$http.get(url, {}).then(res => {
    let member = res.data.member
    member = lib.filterResult(member)
    success(member)
  }).catch(error => {
    fail(error)
  })
}

var api = {
  getSaleList: getSaleList,
  getTeacherList,
}


export default api
