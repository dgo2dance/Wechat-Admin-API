const Controller = require('egg').Controller

class UserController extends Controller {
  constructor(ctx) {
    super(ctx)
    this.UserCreateTransfer = ctx.app.Joi.object().keys({
      username: ctx.app.Joi.string().required().min(2).max(20).regex(/^[a-zA-Z0-9_]{2,20}$/).label(ctx.__('Username')),
      password: ctx.app.Joi.string().required().min(6).max(30).label(ctx.__('Password')),
      role: ctx.app.Joi.string().required().label(ctx.__('Role ID'))
    })
  
  }

  // 创建用户
  async create() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.UserCreateTransfer)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
     await service.user.create(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx, res:true})
  }

  // 删除单个用户
  async destroy() {
    const { ctx, service } = this
    // 校验参数
    const { id } = ctx.params
    // 调用 Service 进行业务处理
    await service.user.destroy(id)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx,res:true})
  }

  // 修改用户
  async update() {
    const { ctx, service } = this

    // 组装参数
    const { id } = ctx.params
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    let filterData = ctx.helper.filterObject(payload, ['realname', 'phone', 'role', 'email', 'locked','sex', 'avatar']);

    await service.user.update(id, filterData)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx,res:true})
  }
 
  // 获取单个用户
  async show() {
    const { ctx, service } = this
    // 组装参数
    const { id } = ctx.params
    // 调用 Service 进行业务处理
    const res = await service.user.show(id)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx, res})
  }

  // 获取所有用户(分页/模糊)
  async index() {
    const { ctx, service } = this
    // 组装参数
    const payload = ctx.query
    // 调用 Service 进行业务处理
    const res = await service.user.index(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx, res})
  }

  // 删除所选用户(条件id[])
  async removes() {
    const { ctx, service } = this
    // 组装参数
    // const payload = ctx.queries.id
    const { id } = ctx.request.body
    const payload = id.split(',') || []
    // 调用 Service 进行业务处理
    const result = await service.user.removes(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ctx})
  }

}


module.exports = UserController