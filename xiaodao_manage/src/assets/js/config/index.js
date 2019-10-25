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
  CompanyCourse: CompanyCourse,
  ClassRoom: ClassRoom,
  Subject: Subject,
  CourseSchedule: CourseSchedule,
  Attendance: Attendance,
  Promotion: Promotion,
  Card: Card,
  ShopGoods: ShopGoods,
  ShopBanner: ShopBanner,
  ShopStorageChangeDetail: ShopStorageChangeDetail,
  LotteryGoods: LotteryGoods,
  payType: [{label: '支付宝',value: 1},{label: '微信',value: 2},{label: '银行卡',value: 3},{label: '现金',value: 4},{label: '其他',value: 5}]
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
UserRole.ROLE_CLASS_TEACHER = 7;

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

XstCompanySetting.KEY_POINT_REGISTER = 'KEY_POINT_REGISTER'
XstCompanySetting.KEY_POINT_SHARE = 'KEY_POINT_SHARE'
XstCompanySetting.KEY_POINT_SHARE_APPLY = 'KEY_POINT_SHARE_APPLY'
XstCompanySetting.KEY_POINT_COURSE_CONSUME = 'KEY_POINT_COURSE_CONSUME'
XstCompanySetting.KEY_POINT_PURCHASE_CARD = 'KEY_POINT_PURCHASE_CARD'
XstCompanySetting.KEY_POINT_PURCHASE_DEDUCTION = 'KEY_POINT_PURCHASE_DEDUCTION'


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

function CompanyCourse() {
}
CompanyCourse.TYPE_ONE_TO_MANY = 0
CompanyCourse.TYPE_ONT_TO_ONE = 1


function ClassRoom() {
}
ClassRoom.STATUS_OK = 0
ClassRoom.STATUS_DELETED = -1
ClassRoom.STATUS_INVALID = -2


function Subject() {
}
Subject.STATUS_OK = 0
Subject.STATUS_DELETED = -1
Subject.STATUS_INVALID = -2

Subject.TYPE_SYS_DETAULT = 0
Subject.TYPE_CUSTOM = 1


function CourseSchedule() {
}
CourseSchedule.SCHEDULE_TYPE_NOT_REGULAR = -1
CourseSchedule.SCHEDULE_TYPE_REGULAR_WEEK = 0
CourseSchedule.SCHEDULE_TYPE_REGULAR_BIWEEKLY = 1


function Promotion() {
}
Promotion.TYPE_DISCOUNT = 0
Promotion.TYPE_CUT_DOWN = 1

Promotion.STATUS_OK = 0
Promotion.STATUS_DELETED = -1
Promotion.STATUS_INVALID = -2


function Attendance() {
}
Attendance.STATUS_INIT = 0//初始状态
Attendance.STATUS_ATTENDANCE = 1
Attendance.STATUS_ABSENCE = 2
Attendance.STATUS_CANCEL = 3
Attendance.STATUS_DELETED = -1

Attendance.TYPE_INIT = 0
Attendance.TYPE_ATTEND = 1
Attendance.TYPE_LATE = 2
Attendance.TYPE_ERALY_GO = 3
Attendance.TYPE_LEAVE_PERSONAL_AFFAIRS = 4
Attendance.TYPE_LEAVE_SICK = 5
Attendance.TYPE_TRUANCY = 6
Attendance.TYPE_OTHERS = 7


function Card() {
}
Card.STATUS_BUY = 1;
Card.STATUS_USING = 2;
Card.STATUS_PAUSE = 3;
Card.STATUS_EXPIRE = 4;
Card.STATUS_DELETED = 5;
Card.STATUS_REFUND = 6;
Card.STATUS_FREEZE = 7;
Card.STATUS_TRANSFER = 8;

function ShopGoods() {
}
ShopGoods.STATUS_OK = 0;
ShopGoods.STATUS_DELETED = -1;
ShopGoods.PUBLISH_OUT = -1;
ShopGoods.PUBLISH_ON = 0;

ShopGoods.PAY_TYPE_POINT = 0;
ShopGoods.PAY_TYPE_MONEY = 1;
ShopGoods.PAY_TYPE_MONEY_POINT = 2;


function ShopStorageChangeDetail() {
}
ShopStorageChangeDetail.TYPE_IN = 0;
ShopStorageChangeDetail.TYPE_OUT = 1;


function ShopBanner() {
}
ShopBanner.TYPE_GOODS = 0;


export default config

