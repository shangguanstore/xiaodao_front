var config = {
  XDM_DOMAIN: "http://hxe.7hu.cn",
  BASE_DOMAIN: "http://7hu.cn",
  STATIC_DOMAIN: "http://static.7hu.cn",
  UserRole: UserRole,
  Qiniu: Qiniu
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
Qiniu.EXTERNAL_LINK = 'http://pfcz9oabu.bkt.clouddn.com/'


export default config

