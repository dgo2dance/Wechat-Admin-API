const Controller = require('egg').Controller
const exportFromJSON = require('export-from-json')
class WechatController extends Controller {
  // 启动微信
  async start() {
    const { ctx, service } = this
    const res = await service.wechat.start()
    ctx.helper.success({ ctx, res })

  }
  // 用户登出
  async logout() {
    const { ctx, service } = this
    const res = await service.wechat.logout()
    ctx.helper.success({ ctx, res })

  }
  // 判断用户是否登入
  async checkLogin() {
    const { ctx, service } = this
    const res = await service.wechat.checkLogin(false)
    ctx.helper.success({ ctx, res })
  }
  // 图表数据
  async chart() {
    const { ctx, service } = this
    const res = await service.wechat.chart()
    ctx.helper.success({ ctx, res })

  }
  // 获取微信登录的二维码
  async getCode() {
    const { ctx, service } = this
    const res = await service.wechat.getCode()
    ctx.helper.success({ ctx, res })

  }
  //获取全部的朋友
  async friends() {
    const { ctx, service } = this
    const query = ctx.query || {}
    const res = await service.wechat.friends(query)
    ctx.helper.success({ ctx, res })
  }
  //获取全部的群聊
  async rooms() {
    const { ctx, service } = this
    const query = ctx.query || {}
    const res = await service.wechat.rooms(query)
    ctx.helper.success({ ctx, res })
  }
  //获取全部的群聊
  async RoomMembers() {
    const { ctx, service } = this
    const query = ctx.query || {}
    const res = await service.wechat.RoomMembers(query)
    ctx.helper.success({ ctx, res })
  }
  //批量添加好友
  async RoomMembersAdd() {
    const { ctx, service } = this
    const query = ctx.query || {}
    const res = await service.wechat.RoomMembersAdd(query)
    ctx.helper.success({ ctx, res })
  }
  //开启机器人聊天
  async MessageAiRun() {
    const { ctx, service } = this
    const res = await service.wechat.MessageAiRun()
    ctx.helper.success({ ctx, res })
  }
  //导出
  async export() {
    const { ctx, service } = this
    const query = ctx.query || {}
    const data = await service.wechat.export(query)
    const fileName = 'data'
    const exportType = 'xls'
    let result = exportFromJSON({
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