'use strict'
const fs = require('fs')
const path = require('path')
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')
const download = require('image-downloader')
const Controller = require('egg').Controller

class UserAccessController extends Controller {

  constructor(ctx) {
    super(ctx)
    this.UserLoginTransfer = ctx.app.Joi.object().keys({
      username: ctx.app.Joi.string().required().min(2).max(20).regex(/^[a-zA-Z0-9_]{2,20}$/).label(ctx.__('Username')),
      password: ctx.app.Joi.string().required().min(6).max(30).label(ctx.__('Password')),
    })
    this.UserRegTransfer = ctx.app.Joi.object().keys({
      username: ctx.app.Joi.string().required().min(2).max(20).regex(/^[a-zA-Z0-9_]{2,20}$/).label(ctx.__('Username')),
      password: ctx.app.Joi.string().required().min(6).max(30).label(ctx.__('Password')),
      email: ctx.app.Joi.string().email().label(ctx.__('Email')),
      phone: ctx.app.Joi.string().regex(/^1[3456789]\d{9}$/).label(ctx.__('Phone')),
    })
    this.UserResetPswTransfer = ctx.app.Joi.object().keys({ 
      password: ctx.app.Joi.string().required().min(6).max(30).label(ctx.__('Password')),
      oldPassword: ctx.app.Joi.string().required().min(6).max(30).label(ctx.__('Old password')),
    })
    this.UserUpdateTransfer = ctx.app.Joi.object().keys({ 
      email: ctx.app.Joi.string().email().label(ctx.__('Email')),
      phone: ctx.app.Joi.string().regex(/^1[3456789]\d{9}$/).label(ctx.__('Phone')),
    })
  }

  // 用户登入
  async login() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.UserLoginTransfer)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    const res = await service.userAccess.login(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res })
  }

  // 用户注册
  async register() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.UserRegTransfer)
    // 组装参数
    const payload = ctx.request.body || {}
    const autoLoginParams = {
      username: payload.username,
      password: payload.password
    }
    // 调用 Service 进行业务处理
    const data = await service.userAccess.register(payload)
    let res = {};
    if (data) {
      res = await service.userAccess.login(autoLoginParams)
    }
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res })
  }

  // 用户登出
  async logout() {
    const { ctx, service } = this
    // 调用 Service 进行业务处理
    let res = await service.userAccess.logout()
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res })
  }

  // 修改密码
  async resetPsw() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.UserResetPswTransfer)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用 Service 进行业务处理
    await service.userAccess.resetPsw(payload)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx })
  }

  // 获取用户信息
  async current() {
    const { ctx, service } = this
    const res = await service.userAccess.current()
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res })
  }

  // 修改基础信息
  async resetSelf() {
    const { ctx, service } = this
    // 校验参数
    ctx.validate(this.UserUpdateTransfer)
    // 组装参数
    const payload = ctx.request.body || {}
    // 调用Service 进行业务处理
    let filterData = ctx.helper.filterObject(payload, ['realname', 'phone', 'email', 'sex', 'avatar']);
    console.log(filterData);
    await service.userAccess.resetSelf(filterData)
    // 设置响应内容和响应状态码
    ctx.helper.success({ ctx, res:true })
  }


}

module.exports = UserAccessController
