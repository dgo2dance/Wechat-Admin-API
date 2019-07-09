const Controller = require('egg').Controller

class RoleController extends Controller {
  constructor(ctx) {
    super(ctx)

    this.createRule = ctx.app.Joi.object().keys({
      name: ctx.app.Joi.string().required().min(2).max(10).label(ctx.__('Role name')),
      access: ctx.app.Joi.number().min(0).max(100).required().label(ctx.__('Role value'))
    })

  }

  // 创建角色
  async create() {
    const { ctx, service } = this
    // 校验参数
    this.ctx.validate(this.createRule)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    const res = await service.role.create(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res })
  }

  // 删除单个角色
  async destroy() {
    const { ctx, service } = this
    // 校验参数
    const { id } = ctx.params
    // 调用 Service 进行业务处理
    await service.role.destroy(id)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res: true })
  }

  // 修改角色
  async update() {
    const { ctx, service } = this
    // 组装参数
    const { id } = ctx.params
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    await service.role.update(id, { name: payload.name })
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res: true })
  }

  // 获取单个角色
  async show() {
    const { ctx, service } = this
    // 组装参数
    const { id } = ctx.params
    // 调用 Service 进行业务处理
    const res = await service.role.show(id)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res })
  }

  // 获取所有角色(分页/模糊)
  async index() {
    const { ctx, service } = this
    // 组装参数
    const payload = ctx.query
    // 调用 Service 进行业务处理
    const res = await service.role.index(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res })
  }

  // 删除所选角色(条件id[])
  async removes() {
    const { ctx, service } = this
    // 组装参数
    // const payload = ctx.queries.id
    const { id } = ctx.request.body // {id: "5a452a44ab122b16a0231b42,5a452a3bab122b16a0231b41"}
    const payload = id.split(',') || []
    // 调用 Service 进行业务处理
    const result = await service.role.removes(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res: result })
  }

}


module.exports = RoleController