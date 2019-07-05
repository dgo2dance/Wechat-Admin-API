const Controller = require('egg').Controller
class WechatController extends Controller {
    // 用户登入
    async login() {
        const { ctx, service } = this
        const res =  await  service.wechat.login();
        ctx.helper.success({ ctx, res })
        
    }
    //获取全部的朋友
    async index(){
        const { ctx, service } = this
        const query  =  ctx.query  || {}
        const res =  await  service.wechat.index(query);
        ctx.helper.success({ ctx, res })
    }
    
}

module.exports = WechatController