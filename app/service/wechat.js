'use strict'

const Service = require('egg').Service
const {
  Wechaty,
  Message,
} = require('wechaty')
const WECHAT_API = 'https://api.qrserver.com/v1/create-qr-code/?data=';

class WechatService extends Service {
  constructor(app) {
    super(app)
    let data = this.app.wechatQueue[this.ctx.state.userid] || {};
    this.bot = data.source;
    this.status = data.status;
  }
  // 用户登入
  async login() {
    return new Promise((reslove, reject) => {
      const bot = new Wechaty();
      this.app.wechatQueue[this.ctx.state.userid] = {
        source: bot,
        status: 0,
      };
      bot.on('scan', (qrcode, status) => reslove(WECHAT_API + qrcode))
      bot.on('login', (user) => {
        this.app.wechatQueue[this.ctx.state.userid].status = 1;

      })
      bot.on('logout', (user) => {
        this.app.wechatQueue[this.ctx.state.userid] = null;
        delete this.app.wechatQueue[this.ctx.state.userid];
      })
      bot.on('error', (e) => console.error(e))
      bot.start().catch(console.error)
    });

  }
  //获取全部的朋友
  /**
   * 
   * @param {*} param0 
   * friend : 1是朋友 2不是朋友
   * type : 1个人   2 公众号  3 未知
   * gender : 1 男  2  女
   */
  async index({ name, alias, friend, type, gender, province, city, address }) {
    this.checkLogin();
    const contactList = await this.bot.Contact.findAll();
    return contactList.filter(item => {
      let arr = [];
      let { payload } = item;
      if (friend != undefined) {
        let bool = Number(friend) === 1 ? true : false;
        arr.push(bool === payload.friend);
      }
      name && arr.push(payload.name.indexOf(name) >= 0);
      alias && arr.push(payload.alias.indexOf(alias) >= 0);
      type && arr.push(Number(type) === payload.type);
      gender && arr.push(Number(gender) === payload.gender);
      province && arr.push(payload.province.indexOf(province) >= 0);
      city && arr.push(payload.city.indexOf(city) >= 0);
      address && arr.push(payload.address.indexOf(address) >= 0);
      return arr.indexOf(false) < 0;
    })

  }
  //检查是否登录
  checkLogin() {
    if (!this.bot && this.status !== 1) {
      this.ctx.throwBizError('WECHAT_NOT_LOGIN')
    }
  }
}

module.exports = WechatService
