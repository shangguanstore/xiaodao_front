var config = {
  XDM_DOMAIN: "http://hxe.7hu.cn",
  BASE_DOMAIN: "http://7hu.cn",
  STATIC_DOMAIN: "http://static.7hu.cn",
  UserRole: UserRole,
    XstCompanySetting: XstCompanySetting,
  Mbanner: Mbanner,
  Activity: Activity,
  ActivityOrder: ActivityOrder,
  Qiniu: Qiniu,
  LineComment: LineComment,
  LotteryGoods: LotteryGoods
}

function UserRole() {
}

UserRole.ROLE_MEMBER = 0;
UserRole.ROLE_TEACHER = 1;//由ROLE_COACH更改为ROLE_TEACHER
UserRole.ROLE_ADMIN = 2;
UserRole.ROLE_SALE = 3;
UserRole.ROLE_FRONT = 4;
UserRole.ROLE_MANAGER = 5;
UserRole.ROLE_ASSIST_TEACHER = 6;

function Qiniu() {
}
Qiniu.ACTION_URL = 'http://up.qiniu.com'
Qiniu.EXTERNAL_LINK = 'http://qiniu.xiaost.net/'


function Mbanner() {
}
Mbanner.TYPE_ACTIVITY = 1


function XstCompanySetting() {
}
XstCompanySetting.STATUS_OK = 0
XstCompanySetting.STATUS_DELETE = -1
XstCompanySetting.STATUS_INVALID = -2


function Activity() {
}
Activity.TYPE_NORMAL = 0
Activity.TYPE_GROUPON = 1
Activity.TYPE_GET_LIKES = 2
Activity.TYPE_LOTTERY = 3
Activity.TYPE_COURSE = 4

Activity.PUBLISH_OUT = -2
Activity.PUBLISH_HOLD = 0
Activity.PUBLISH_ON = 1

function ActivityOrder() {
}
ActivityOrder.STATUS_OK = 0;
ActivityOrder.STATUS_PAID = 1;
ActivityOrder.STATUS_DELETE = -1;
ActivityOrder.STATUS_TIMEOUT = 2;

function LotteryGoods() {
}
LotteryGoods.TYPE_PHYSICAL = 0
LotteryGoods.TYPE_COUPON = 1
LotteryGoods.TYPE_EXPERIENCE = 2

function LineComment() {

}
LineComment.TYPE_TRACK = 1,
LineComment.TYPE_MARK = 2


export default config

