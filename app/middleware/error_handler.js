'use strict'

module.exports = (option, app) => {
  return async function (ctx, next) {
    try {
      await next()
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      app.emit('error', err, this);
     
      if (err.status === 422) {
        ctx.body = {
          code:err.status ,
          data:false,
          msg:err.details.map(item=>ctx.__(item.message)).join(',')
        }
        return false;
      }
       return ctx.responseBizError(err);
    }
  }
}