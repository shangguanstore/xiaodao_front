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

    if (isset(item.expire_start)) {
      item.expire_start_format = date('Y-m-d H:i:s', item.expire_start)
    }

    if (isset(item.expire_end)) {
      item.expire_end_format = date('Y-m-d H:i:s', item.expire_end)
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

    if (item.real_price) {
      item.real_price_format = parseFloat((item.real_price / 100).toFixed(2))
    } else {
      item.real_price_format = 0
    }

    if (item.unit_price) {
      item.unit_price_format = parseFloat((item.unit_price / 100).toFixed(2))
    } else {
      item.unit_price_format = 0
    }

    if (item.purchase_price) {
      item.purchase_price_format = parseFloat((item.purchase_price / 100).toFixed(2))
    } else {
      item.purchase_price_format = 0
    }

    if (item.order_money) {
      item.order_money_format = parseFloat((item.order_money / 100).toFixed(2))
    } else {
      item.order_money_format = 0
    }

    if (item.payment_money) {
      item.payment_money_format = parseFloat((item.payment_money / 100).toFixed(2))
    } else {
      item.payment_money_format = 0
    }

    if(isset(item.order_point)) {
      item.order_point_format = parseInt(item.order_point / 1000)
    }

    if(isset(item.payment_point)) {
      item.payment_point_format = parseInt(item.payment_point / 1000)
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





