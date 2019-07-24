module.exports = {
  'USER_NOT_EXIST': {
    status:200 ,
    code: 10010,
    message: 'User does not exist'
  },
  'USER_IS_EXIST': {
    status:200 ,
    code: 10011,
    message: 'User already exists'
  },
  'USER_IS_LOCKED': {
    status:200 ,
    code: 10012,
    message: 'User already locked'
  },
  'USER_PASSWORD_ERROR': {
    status:200 ,
    code: 10013,
    message: 'User password mistake'
  },
  'USER_OLD_PASSWORD_ERROR': {
    status:200 ,
    code: 10014,
    message: 'User old password mistake'
  },
  'ROLE_NOT_EXIST': {
    status:200 ,
    code: 10020,
    message: 'Role does not exist'
  },
  'ROLE_IS_EXIST': {
    status:200 ,
    code: 10021,
    message: 'Role already exists'
  },
  'WECHAT_NOT_LOGIN': {
    status:200 ,
    code: 10031,
    message: 'Wechat not login'
  }
}

