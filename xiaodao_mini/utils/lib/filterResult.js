import date from './date'
import isset from './isset'
import getImglink from './getImglink'

var filterResult = function(data) {
  data.map(function (item) {
    if (isset(item.create_time)) {
      item.create_time_format = date('Y-m-d H:i:s', item.create_time)
    }

    if (isset(item.update_time)) {
      item.update_time_format = date('Y-m-d H:i:s', item.update_time)
    }

    if (isset(item.start_time)) {
      item.start_time_format = date('Y-m-d H:i:s', item.start_time)
    }

    if (isset(item.end_time)) {
      item.end_time_format = date('Y-m-d H:i:s', item.end_time)
    }

    if (isset(item.imglink)) {
      item.imglink_format = getImglink(item.imglink)
    }

    if (isset(item.sex)) {
      item.sex_format = item.sex === 1 ? '男' : '女'
    }

    return item
  })

  return data
}

module.exports = filterResult