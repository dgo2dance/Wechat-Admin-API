const Controller = require('egg').Controller
class WechatController extends Controller {
  // 用户登入
  async login() {
    const { ctx, service } = this
    const res =  await  service.wechat.login()
    ctx.helper.success({ ctx, res })
        
  }
  //获取全部的朋友
  async friends(){
    const { ctx, service } = this
    const query  =  ctx.query  || {}
    const res =  await  service.wechat.friends(query)
    ctx.helper.success({ ctx, res })
  }
  //获取全部的群聊
  async rooms(){
    const { ctx, service } = this
    const query  =  ctx.query  || {}
    const res =  await  service.wechat.rooms(query)
    ctx.helper.success({ ctx, res })
  }
  //获取全部的群聊
  async RoomMembers(){
    const { ctx, service } = this
    const query  =  ctx.query  || {}
    const res =  await  service.wechat.RoomMembers(query)
    ctx.helper.success({ ctx, res })
  }
  //批量添加好友
  async RoomMembersAdd(){
    const { ctx, service } = this
    const query  =  ctx.query  || {}
    const res =  await  service.wechat.RoomMembersAdd(query)
    ctx.helper.success({ ctx, res })
  }
    
}

module.exports = WechatController