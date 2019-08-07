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

  async destroy() {
    const { ctx } = this
    const ai = await this.show();
    !ai && ctx.throwBizError('AI_NOT_EXIST')
    return ctx.model.Ai.findByIdAndRemove(ai._id)
  }


  async update( payload) {
    const { ctx } = this
    const ai = await this.show();
    !ai && ctx.throwBizError('AI_NOT_EXIST')
    return  this.ctx.model.Ai.findByIdAndUpdate(ai._id, payload) 
  }

  async show() {
    const { ctx } = this
    const _id = ctx.locals.userid
    return await ctx.model.Ai.findOne({userId:_id},'_id appId appKey status startText startKey endKey endText msgKey ctime')

  }


}
module.exports = AiService