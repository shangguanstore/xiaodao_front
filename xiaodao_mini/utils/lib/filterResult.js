import date from './date'
import isset from './isset'
import getImglink from './getImglink'

var filterResult = function (data) {
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

        if (isset(item.group_start_time)) {
            item.group_start_time_format = date('Y-m-d H:i', item.group_start_time)
        }

        if (isset(item.group_end_time)) {
            item.group_end_time_format = date('Y-m-d H:i', item.group_end_time)
        }

        if (isset(item.imglink)) {
            item.imglink_format = getImglink(item.imglink)[0]
            item.imglink_format_list = getImglink(item.imglink)
        }

        if (isset(item.logo)) {
            item.logo_format = getImglink(item.logo)[0]
            item.logo_format_list = getImglink(item.logo)
        }

        if (isset(item.lottery_intro_imglink)) {
            item.lottery_intro_imglink_format = getImglink(item.lottery_intro_imglink)
        }

        if (isset(item.sex)) {
            item.sex_format = item.sex === 1 ? '男' : '女'
        }

        if (item.price) {
            item.price_format = (item.price / 100).toFixed(2)
        } else {
            item.price_format = 0
        }

        if (item.group_price) {
            item.group_price_format = (item.group_price / 100).toFixed(2)
        } else {
            item.group_price_format = 0
        }

        if (item.payment_money) {
            item.payment_money_format = (item.payment_money / 100).toFixed(2)
        } else {
            item.payment_money_format = 0
        }

        if (item.order_money) {
            item.order_money_format = (item.order_money / 100).toFixed(2)
        } else {
            item.order_money_format = 0
        }

        return item
    })

    return data
}

module.exports = filterResult