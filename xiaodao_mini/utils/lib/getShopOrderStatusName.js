const app = getApp()
const config = app.config

module.exports = function getShopOrderStatusName(orderStatus) {
  if (orderStatus == config.ShopOrder.ORDER_STATUS_WAIT_PAY) {
    return '待支付'
  }else if(orderStatus == config.ShopOrder.ORDER_STATUS_PAID) {
    return '待领取'
  }else if(orderStatus == config.ShopOrder.ORDER_STATUS_WAIT_COMMENT) {
    return '待评价'
  }else if(orderStatus == config.ShopOrder.ORDER_STATUS_FINISH) {
    return '已完成'
  }else if(orderStatus == config.ShopOrder.ORDER_STATUS_CANCEL) {
    return '已取消'
  }else if(orderStatus == config.ShopOrder.ORDER_STATUS_REFUND) {
    return '已退货'
  }
}