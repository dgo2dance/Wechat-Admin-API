'use strict'
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken') //引入jsonwebtoken

module.exports = (options, app) => {
  return async function userInterceptor(ctx, next) {
    let authToken = ctx.header.authorization // 获取header里的authorization
    if (authToken) {
      authToken = authToken.substring(7)
      const res = verifyToken(authToken) // 解密获取的Token
      if (res.userid) {
        const redis_token = await ctx.app.redis.get('loginToken_'+res.username) // 获取保存的token
        if (authToken === redis_token) {
          ctx.locals.userid = res.userid
          ctx.locals.username = res.username              
          ctx.locals.access = res.access
          if(options &&  options.access !=  undefined && options.access > res.access ){
            ctx.body = { code: 50013, msg: '权限不足' }
          }else{
            await next()
          }
                    
        } else {
          ctx.body = { code: 50012, msg: '登录状态已过期' }
        }
      } else {
        ctx.body = { code: 50012, msg: '登录状态已过期' }
      }
    } else {
      ctx.body = { code: 50012, msg: '请登陆后再进行操作' }
    }
  }
}

// 解密，验证
function verifyToken(token) {
  const cert = fs.readFileSync(path.join(__dirname, '../public/key/rsa_public_key.pem')) // 公钥，看后面生成方法
  let res = ''
  try {
    const result = jwt.verify(token, cert, { algorithms: ['RS256'] }) || {}
    const { exp } = result,
      current = Math.floor(Date.now() / 1000)
    if (current <= exp) res = result.data || {}
  } catch (e) {
    console.log(e)
  }
  return res
}