const Service = require('egg').Service

class AiService extends Service {

  async create(payload) {
    const { ctx } = this
    const _id = ctx.locals.userid
    const ai = await ctx.model.Ai.findOne({userId:_id}) 
    ai && ctx.throwBizError('AI_IS_EXIST')
    payload.userId = _id;
    return ctx.model.Ai.create(payload)
  }

  async destroy(_id) {
    const { ctx, service } = this
    const ai = await ctx.service.ai.find(_id)
    !ai && ctx.throwBizError('AI_NOT_EXIST')
    return ctx.model.Ai.findByIdAndRemove(_id)
  }


  async update(_id, payload) {
    const { ctx } = this
    const ai = await ctx.service.ai.find(_id)
    !ai && ctx.throwBizError('AI_NOT_EXIST')
    return ctx.model.Ai.findByIdAndUpdate(_id, payload)
  }

  async show(_id) {
    const { ctx } = this
    const ai = await ctx.service.ai.find(_id)
    !ai && ctx.throwBizError('AI_NOT_EXIST')
    return ctx.model.Ai.findById(_id, '_id appId appKey status startText startKey endKey endText msgKey ctime')
  }


  async find(id, options) {
    return this.ctx.model.Ai.findById(id, options)
  }

  async findByIdAndUpdate(id, values) {
    return this.ctx.model.Ai.findByIdAndUpdate(id, values)
  }

}
module.exports = AiService