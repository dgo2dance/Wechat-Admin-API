'use strict'

const Service = require('egg').Service

class UserAccessService extends Service {

  async login(payload) {
    const { ctx, service } = this

    const user = await service.user.findByUserName(payload.username)

    if (!user) {
      ctx.throw(404, 'user not found')
    }
    if(user.locked === 1){
      ctx.throw(500, 'user is locked')
    }

    let verifyPsw = await ctx.compare(payload.password, user.password)

    if (!verifyPsw) {
      ctx.throw(404, 'user password is error')
    }
 
    let roleData = await service.role.find(user.role)

    const token = ctx.helper.loginToken({ userid: user._id, username: user.username , access:roleData.access  }, 7200);
    await this.app.redis.set('loginToken_' + user.username, token, 'ex', 7200) // 保存到redis

    return { token, expires: this.config.login_token_time ,access:roleData.access }

  }
  async register(payload) {
    const { ctx, service } = this;
    let userRole = await ctx.model.Role.findOne({ access: 0 });
    if (!userRole) {
      userRole = await service.role.create({ access: 0, name: '普通用户' });
    }
    payload.role = userRole._id;

    return await service.user.create(payload)

  }
  async logout() {
    return this.app.redis.del("loginToken_" + this.ctx.locals.username);
  }

  async resetPsw(values) {
    const { ctx, service } = this
    // ctx.state.user 可以提取到JWT编码的data
    const _id = ctx.locals.userid
    const user = await service.user.find(_id)
    if (!user) {
      ctx.throw(404, 'user is not found')
    }

    let verifyPsw = await ctx.compare(values.oldPassword, user.password)
    if (!verifyPsw) {
      ctx.throw(404, 'user password error')
    } else {
      // 重置密码
      values.password = await ctx.genHash(values.password)
      return service.user.findByIdAndUpdate(_id, values)
    }
  }

  async current() {
    const { ctx, service } = this
    // ctx.state.user 可以提取到JWT编码的data
    const _id = ctx.locals.userid
    const user = await service.user.find(_id,'_id username realname role phone email locked ctime sex avatar')
    if (!user) {
      ctx.throw(404, 'user is not found')
    }
    return user;
  }

  // 修改个人信息
  async resetSelf(values) {
    const { ctx, service } = this
    // 获取当前用户
    const _id = ctx.locals.userid
    const user = await service.user.find(_id)
    if (!user) {
      ctx.throw(404, 'user is not found')
    }
    return service.user.findByIdAndUpdate(_id, values)
  }

  // 更新头像
  async resetAvatar(values) {
    const { ctx, service } = this
    await service.upload.create(values)
    // 获取当前用户
    const _id = ctx.locals.userid
    const user = await service.user.find(_id)
    if (!user) {
      ctx.throw(404, 'user is not found')
    }
    return service.user.findByIdAndUpdate(_id, { avatar: values.url })
  }

}

module.exports = UserAccessService
