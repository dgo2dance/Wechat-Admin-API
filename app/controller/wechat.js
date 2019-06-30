const Controller = require('egg').Controller



class WechatController extends Controller {
    // 用户登入
    async login() {
        const { ctx, service } = this
        const res =  await  ctx.helper.wechat.getWechat(this);
        ctx.helper.success({ ctx, res })
        
    }
    //获取全部的朋友
    async index(){
        const { ctx, service } = this
        const res =  await  ctx.helper.wechat.findAll(this.app.wechatList[ctx.state.userid]);
        ctx.helper.success({ ctx, res })
    }
    
}

module.exports = WechatController