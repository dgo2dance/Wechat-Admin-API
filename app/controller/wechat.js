const Controller = require('egg').Controller
const exportFromJSON = require('export-from-json')
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
   //开启机器人聊天
   async MessageAi(){
    const { ctx, service } = this
    const query  =  ctx.query  || {}
    const res =  await  service.wechat.MessageAi(query)
    ctx.helper.success({ ctx, res })
  }
  //导出
  async export(){
    const { ctx, service } = this
    const query  =  ctx.query  || {}
    const data =  await  service.wechat.export(query)
    const fileName = 'data'
    const exportType = 'xls'
    let result =  exportFromJSON({
      data,
      fileName,
      exportType,
      processor(content, type, fileName) {
        switch (type) {
            case 'txt':
                ctx.set('Content-Type', 'text/plain')
                break
            case 'json':
                ctx.set('Content-Type', 'text/plain')
                break
            case 'csv':
                ctx.set('Content-Type', 'text/csv')
                break
            case 'xls':
                ctx.set('Content-Type', 'application/vnd.ms-excel')
                break
        }
        ctx.set('Content-disposition', 'attachment;filename=' + fileName)
        return content
      }
    }) 
    ctx.status = 200;
    ctx.body = result;
    
  } 
}

module.exports = WechatController