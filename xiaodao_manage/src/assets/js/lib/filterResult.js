import date from './date'
import isset from './isset'
import empty from './empty'
import is_array from './is_array'
import array_column from './array_column'
import config from '../config'
import getImglink from './getImglink'


export default function filterResult(data) {
  data.map(function (item) {
    if (isset(item.create_time)) {
      item.create_time_format = date('Y-m-d H:i:s', item.create_time)
    }

    if (isset(item.update_time)) {
      item.update_time_format = date('Y-m-d H:i:s', item.update_time)
    }

    if (isset(item.role_id)) {
      let role_id_format
      if (is_array(item.role_id)) {
        role_id_format = []
        for (var i = 0; i < item.role_id.length; i++) {
          role_id_format.push(
            roleIdCorrespondString(item.role_id[i])
          )
        }
        role_id_format = role_id_format.join(' / ')
      } else {
        role_id_format = roleIdCorrespondString(item.role_id)
      }

      item.role_id_format = role_id_format
    }

    if(!empty(item.subject)) {
      item.subject_format = array_column(item.subject, 'name').join(' / ')
    }

    if (isset(item.imglink)) {
      item.imglink_format = getImglink(item.imglink)
    }

    if (isset(item.sex)) {
      item.sex_format = item.sex === 1 ? '男' : '女'
    }

    if (item.price) {
      item.price_format = parseFloat((item.price / 100).toFixed(2))
    } else {
      item.price_format = 0
    }

    if (item.unit_price) {
      item.unit_price_format = parseFloat((item.unit_price / 100).toFixed(2))
    } else {
      item.unit_price_format = 0
    }

    return item
  })

  return data
}


function roleIdCorrespondString(role_id) {
  if (role_id == config.UserRole.ROLE_SALE) {
    return '市场/咨询师'
  } else if (role_id == config.UserRole.ROLE_TEACHER) {
    return '老师'
  } else if (role_id == config.UserRole.ROLE_ADMIN) {
    return '超级管理员'
  } else if (role_id == config.UserRole.ROLE_MEMBER) {
    return '学员'
  } else if (role_id == config.UserRole.ROLE_FRONT) {
    return '前台'
  } else if (role_id == config.UserRole.ROLE_MANAGER) {
    return '校长'
  } else if (role_id == config.UserRole.ROLE_ASSIST_TEACHER) {
    return '辅导老师'
  } else if (role_id == config.UserRole.ROLE_CLASS_TEACHER) {
    return '班主任'
  } else {
    return false
  }
}





