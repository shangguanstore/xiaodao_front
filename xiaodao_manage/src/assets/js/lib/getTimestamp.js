/*
 * 获取时间戳
 * type：now 当前时间戳； noLimit 没有限制，默认2099-12-31 23:59:59； passStr 传值；
 */
export default function getTimestamp(type = 'now', passVal = null) {
  if(type == 'now') {
    return parseInt(new Date().getTime() / 1000)
  }else if(type == 'noLimit') {
    return parseInt(new Date('2099-12-31 23:59:59').getTime() / 1000)
  }else if(type == 'passStr') {
    return parseInt(new Date(passVal).getTime() / 1000)
  }
}
