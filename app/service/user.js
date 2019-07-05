const Service = require('egg').Service

class UserService extends Service {

  async create(payload) {
    const { ctx } = this
    const hasUserName = await ctx.model.User.findOne({ username: payload.username });
    hasUserName && ctx.throwBizError('USER_IS_EXIST')
    payload.password = await ctx.genHash(payload.password)
    return ctx.model.User.create(payload)
  }

  async destroy(_id) {
    const { ctx, service } = this
    const user = await ctx.service.user.find(_id)
    !user && ctx.throwBizError('USER_NOT_EXIST')
    return ctx.model.User.findByIdAndRemove(_id)
  }


  async update(_id, payload) {
    const { ctx, service } = this
    const user = await ctx.service.user.find(_id)
    !user && ctx.throwBizError('USER_NOT_EXIST')
    return ctx.model.User.findByIdAndUpdate(_id, payload)
  }

  async show(_id) {
    const user = await this.ctx.service.user.find(_id)
    !user && ctx.throwBizError('USER_NOT_EXIST')
    return this.ctx.model.User.findById(_id, "_id username role ctime locked").populate('role')
  }


  async index(payload) {
    const { currentPage, pageSize, isPaging, search } = payload
    let res = []
    let count = 0
    let skip = ((Number(currentPage)) - 1) * Number(pageSize || 10);
    let filed = "_id username realname role phone email avatar ctime locked";
    if (isPaging) {
      if (search) {
        res = await this.ctx.model.User.find({ username: { $regex: search } },filed).populate('role').skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
        count = res.length
      } else {
        res = await this.ctx.model.User.find({}, filed).populate('role').skip(skip).limit(Number(pageSize)).sort({ createdAt: -1 }).exec()
        count = await this.ctx.model.User.count({}).exec()
      }
    } else {
      if (search) {
        res = await this.ctx.model.User.find({ username: { $regex: search } },filed).populate('role').sort({ createdAt: -1 }).exec()
        count = res.length
      } else {
        res = await this.ctx.model.User.find({}, filed).populate('role').sort({ createdAt: -1 }).exec()
        count = await this.ctx.model.User.count({}).exec()
      }
    }
    let data = res.map((e, i) => {
      const jsonObject = Object.assign({}, e._doc)
      jsonObject.createdAt = this.ctx.helper.formatTime(e.createdAt)
      return jsonObject
    })

    return { count: count, list: data, pageSize: Number(pageSize), currentPage: Number(currentPage) }
  }

  async removes(payload) {
    return this.ctx.model.User.remove({ _id: { $in: payload } })
  }

  async findByUserName(username) {
    return this.ctx.model.User.findOne({ username })
  }

  async find(id, options) {
    return this.ctx.model.User.findById(id, options)
  }

  async findByIdAndUpdate(id, values) {
    return this.ctx.model.User.findByIdAndUpdate(id, values)
  }

}
module.exports = UserService