const Service = require('egg').Service

class RoleService extends Service {
  async create(payload) {
    const { ctx } = this
    const isExitedName = await ctx.model.Role.findOne({ name: payload.name });
    isExitedName && ctx.throwBizError('ROLE_IS_EXIST')
    const isExitedAccess = await ctx.model.Role.findOne({ access: payload.access });
    isExitedAccess && ctx.throwBizError('ROLE_IS_EXIST')
    return ctx.model.Role.create(payload)
  }

  async destroy(_id) {
    const { ctx } = this
    const role = await ctx.service.role.find(_id)
    !role && ctx.throwBizError('ROLE_NOT_EXIST')
    return ctx.model.Role.findByIdAndRemove(_id)
  }

  async update(_id, payload) {
    const { ctx } = this
    const role = await ctx.service.role.find(_id)
    !role && ctx.throwBizError('ROLE_NOT_EXIST')
    return ctx.model.Role.findByIdAndUpdate(_id, payload)
  }

  async show(_id) {
    const role = await this.ctx.service.role.find(_id)
    !role && ctx.throwBizError('ROLE_NOT_EXIST')
    return this.ctx.model.Role.findById(_id)
  }

  async index(payload) {
    const { currentPage, pageSize, isPaging, search } = payload
    let res = []
    let count = 0
    let skip = ((Number(currentPage)) - 1) * Number(pageSize || 10)
    let filed = "_id name access createdAt";
    if (isPaging) {
      if (search) {
        res = await this.ctx.model.Role.find({ name: { $regex: search } },filed).skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
        count = res.length
      } else {
        res = await this.ctx.model.Role.find({},filed).skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
        count = await this.ctx.model.Role.count({}).exec()
      }
    } else {
      if (search) {
        res = await this.ctx.model.Role.find({ name: { $regex: search } },filed).sort({ createdAt: -1 }).exec()
        count = res.length
      } else {
        res = await this.ctx.model.Role.find({},filed).sort({ createdAt: -1 }).exec()
        count = await this.ctx.model.Role.count({}).exec()
      }
    }
    let data = res.map((e, i) => {
      const jsonObject = Object.assign({}, e._doc)
      jsonObject.createdAt = this.ctx.helper.formatTime(e.createdAt)
      return jsonObject
    })

    return { count: count, list: data, pageSize: Number(pageSize), currentPage: Number(currentPage) }
  }

  async removes(values) {
    return this.ctx.model.Role.remove({ _id: { $in: values } })
  }

  async find(id) {
    return this.ctx.model.Role.findById(id)
  }

}

module.exports = RoleService