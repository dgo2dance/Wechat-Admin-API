'use strict'

const Service = require('egg').Service

class UserAccessService extends Service {

  async login(payload) {
    const { ctx, service } = this
    const user = await service.user.findByUserName(payload.username)
    !user && ctx.throwBizError('USER_NOT_EXIST')
    user.locked === 1 && ctx.throwBizError('USER_IS_LOCKED')
    let verifyPsw = await ctx.compare(payload.password, user.password)
    !verifyPsw  && ctx.throwBizError('USER_PASSWORD_ERROR')
    let roleData = await service.role.find(user.role)
    const token = ctx.helper.loginToken({ userid: user._id, username: user.username, access: roleData.access }, 7200)
    await this.app.redis.set('loginToken_' + user.username, token, 'ex', 3600*24) 
    return { token, expires: this.config.login_token_time, access: roleData.access }

  }
  async register(payload) {
    const { ctx, service } = this
    let userRole = await ctx.model.Role.findOne({ access: 0 })
    if (!userRole) {
      userRole = await service.role.create({ access: 0, name: '普通用户' })
    }
    payload.role = userRole._id
    return await service.user.create(payload)
  }
  async logout() {
    this.service.wechat.loginOut();
    return this.app.redis.del('loginToken_' + this.ctx.locals.username)
  }

  async current() {
    const { ctx, service } = this
    const _id = ctx.locals.userid
    const user = await service.user.find(_id, '_id username realname role phone email locked ctime sex avatar')
    !user && ctx.throwBizError('USER_NOT_EXIST')
    return user
  }

  // 重置密码
  async resetPsw(values) {
    const { ctx, service } = this
    const _id = ctx.locals.userid
    const user = await service.user.find(_id)
    !user && ctx.throwBizError('USER_NOT_EXIST')
    let verifyPsw = await ctx.compare(values.oldPassword, user.password)
    if (!verifyPsw) {
      ctx.throwBizError('USER_OLD_PASSWORD_ERROR')
    } else {
      values.password = await ctx.genHash(values.password)
      return service.user.findByIdAndUpdate(_id, values)
    }
  }

  // 修改个人信息
  async resetSelf(values) {
    const { ctx, service } = this
    const _id = ctx.locals.userid
    const user = await service.user.find(_id)
    !user && ctx.throwBizError('USER_NOT_EXIST')
    return service.user.findByIdAndUpdate(_id, values)
  }

  // 更新头像
  async resetAvatar(values) {
    const { ctx, service } = this
    await service.upload.create(values)
    const _id = ctx.locals.userid
    const user = await service.user.find(_id)
    !user && ctx.throwBizError('USER_NOT_EXIST')
    return service.user.findByIdAndUpdate(_id, { avatar: values.url })
  }

}

module.exports = UserAccessService
