const Controller = require('egg').Controller

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'wechat api'
  }
}

module.exports = HomeController
