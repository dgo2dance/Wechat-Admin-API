module.exports = app => {
  app.BizErrorHandler = class extends app.BizErrorHandler {
    accepts(ctx) {
      if (ctx.acceptJSONP) {
        return 'jsonp'
      }
      return 'json'
    }
    json(ctx, error, config) {
      ctx.body = {
        code: config.code,
        data:false,
        msg: ctx.__(config.message),
      }
    }
  }
}