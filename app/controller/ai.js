const Controller = require('egg').Controller

class AiController extends Controller {
  constructor(ctx) {
    super(ctx)
    this.createTransfer = ctx.app.Joi.object().keys({
      appId: ctx.app.Joi.string().required().label(ctx.__('appId')),
      appKey: ctx.app.Joi.string().required().label(ctx.__('appKey')),
      status: ctx.app.Joi.number().required().label(ctx.__('status'))
    }).unknown();
  
  }

  // 创建
  async create() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.createTransfer)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    await service.ai.create(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx, res:true})
  }

  // 删除单个
  async destroy() {
    const { ctx, service } = this
    // 校验参数
    const { id } = ctx.params
    // 调用 Service 进行业务处理
    await service.ai.destroy(id)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx,res:true})
  }

  // 修改
  async update() {
    const { ctx, service } = this

    // 组装参数
    const { id } = ctx.params
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    let filterData = ctx.helper.filterObject(payload, ['appId', 'appKey', 'status', 'startText', 'startKey','endKey', 'endText', 'msgKey'])

    await service.ai.update(id, filterData)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx,res:true})
  }
 
  // 获取单个
  async show() {
    const { ctx, service } = this
    // 组装参数
    const { id } = ctx.params
    // 调用 Service 进行业务处理
    const res = await service.ai.show(id)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx, res})
  }


}


module.exports = AiController