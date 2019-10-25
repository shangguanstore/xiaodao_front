import date from './date'
import isset from './isset'
import getImglink from './getImglink'

var filterResult = function (data) {
    if(data.length == 0) return data
    data.map(function (item) {
        if (isset(item.create_time)) {
            item.create_time_format = date('Y-m-d H:i', item.create_time)
        }

        if (isset(item.update_time)) {
            item.update_time_format = date('Y-m-d H:i', item.update_time)
        }

        if (isset(item.start_time)) {
            item.start_time_format = date('Y-m-d H:i', item.start_time)
        }

        if (isset(item.end_time)) {
            item.end_time_format = date('Y-m-d H:i', item.end_time)
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

        if (isset(item.price)) {
            item.price_format = parseFloat((item.price / 100).toFixed(2))
        }

        if (isset(item.group_price)) {
            item.group_price_format = parseFloat((item.group_price / 100).toFixed(2))
        }

        if (isset(item.payment_money)) {
            item.payment_money_format = parseFloat((item.payment_money / 100).toFixed(2))
        }

        if (isset(item.order_money)) {
            item.order_money_format = parseFloat((item.order_money / 100).toFixed(2))
        }

        if(isset(item.point)) {
            item.point_format = parseInt(item.point / 1000)
        }

        if(isset(item.unit_price)) {
            item.unit_price_format = parseFloat((item.unit_price / 100).toFixed(2))
        }

        if(isset(item.unit_point)) {
            item.unit_point_format = parseFloat((item.unit_point / 1000).toFixed(2))
        }

        if(isset(item.payment_money)) {
            item.payment_money_format = parseFloat((item.payment_money / 100).toFixed(2))
        }

        if(isset(item.payment_point)) {
            item.payment_point_format = parseFloat((item.payment_point / 1000).toFixed(2))
        }

        if(isset(item.order_money)) {
            item.order_money_format = parseFloat((item.order_money / 100).toFixed(2))
        }

        if(isset(item.order_point)) {
            item.order_point_format = parseFloat((item.order_point / 1000).toFixed(2))
        }

        return item
    })

    return data
}

module.exports = filterResult