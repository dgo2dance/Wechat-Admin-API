'use strict'

const Service = require('egg').Service
const { TencentAI } = require('@khs1994/tencent-ai');
const { Wechaty } = require('wechaty');
const { puppet } = require('wechaty-puppet-puppeteer')
const _ = require('lodash');
class WechatService extends Service {
  constructor(args) {
    super(args);
    let { app, ctx } = this;
    this.data = app.wechatQueue[ctx.state.userid];
    this.bot = this.data && this.data.bot
  }
  /**
   * 用户登入
   */
  async start() {
    let { app, ctx } = this;
    if (this.bot) {
      return Promise.resolve(true);
    }
    this.data = app.wechatQueue[ctx.state.userid] = {
      bot: null,
      codeUrl: '',
      contactList: null,
      ai: {
        roomArr: [],
        personArr: [],
        config: {}
      }
    }
    return new Promise((resolve, reject) => {
      const bot = new Wechaty({
        puppet,
        name: `wechat-${this.ctx.state.userid}-login.json`
      })
      this.data.bot = this.bot = bot;
      bot.on('scan', (qrcode, status) => {
        const codeUrl = this.config.wechat.loginUrl + qrcode;
        this.data.codeUrl = codeUrl
      })
      bot.on('login', (user) => {
        console.log(`${user} has logined`);
      })
      bot.on('logout', (user) => {
        app.wechatQueue[ctx.state.userid] = null
        delete app.wechatQueue[ctx.state.userid]
      })
      bot.on('error', (e) => { console.error(e) })
      bot.start().then(() => {

      }).catch((err) => {
        ctx.throwBizError('WECHAT_START_FAIL')
        console.error(err)
      })
      resolve(true);

    })

  }
  /**
   * 获取微信登录的二维码
   * 返回true则表面已经登录
   */
  getCode() {
    if (!this.bot) {
      this.ctx.throwBizError('WECHAT_NOT_START')
    }
    if (this.checkLogin(false)) {
      return true;
    }
    return this.data ? this.data.codeUrl : ''
  }
  /**
  * 微信用户登出
  */
  async chart() {

    let data = await this.friends({});
    let sexData = _.countBy(data, 'gender');
    let provinceData = _.countBy(data, 'province');
    return { sexData, provinceData }



  }
  /**
   * 微信用户登出
   */
  async logout() {
    this.checkLogin();
    let { app, ctx } = this;
    await this.bot.logout();
    await this.bot.stop();
    app.wechatQueue[ctx.state.userid] = null
    delete app.wechatQueue[ctx.state.userid]
    return true;
  }
  /**
 * 检查是否登录
 * @param {*} isThrow 是否抛出异常
 */
  checkLogin(isThrow = true) {
    const isLogin = this.bot && this.bot.logonoff();
    if (!isLogin && isThrow) {
      this.ctx.throwBizError('WECHAT_NOT_LOGIN')
    }
    return isLogin;
  }
  /**
   * 获取全部的朋友
   * @param {*} query  查询条件
   */
  async friends(query) {
    this.checkLogin()
    // let contactList = [];
    // if (this.data.contactList) {
    //   contactList = this.data.contactList;
    // } else {
    //   contactList = await new Promise((resolve) => { setTimeout(async () => { resolve(await this.bot.Contact.findAll()); }, 2000) });
    //   this.data.contactList = contactList;
    // }
    let contactList = await this.bot.Contact.findAll();

    return this.setPaing(this.formatContacts(this.filterContacts(contactList || [], query)), query);


  }
  /**
   * 数据分页
   * @param {数据} data 
   * @param {分页条件} query 
   */
  setPaing(data, query) {
    const { pageIndex, pageSize, filed, sort } = query;
    if (pageIndex === undefined && pageSize === undefined) {
      return data;
    }
    let res = []
    let pageCount = 0
    let skip = ((Number(pageIndex || 1)) - 1) * Number(pageSize || 10);
    if (filed && sort) {
      data = data.sort((a, b) => { return sort > 0 ? a[filed] - b[filed] : b[filed] - a[filed] });
    }
    res = data.filter((item, index) => { return index >= skip && index < (skip + Number(pageSize)) })
    pageCount = data.length
    return { pageCount: pageCount, list: res, pageSize: Number(pageSize), pageIndex: Number(pageIndex) }
  }

  /**
   * 获取全部群聊
   * @param {*} topic 群聊名
   */
  async rooms({ topic }) {
    this.checkLogin()
    const roomList = await this.bot.Room.findAll()
    return roomList.filter(item => {
      return topic ? item.payload.topic.indexOf(topic) >= 0 : true
    })
  }

  /**
   * 获取群聊里的人员
   * @param {*} query {topic：群聊名}
   * name：名字 
   * roomAlias：群聊别名
   * contactAlias：联系人别名
   * friend : 1是朋友 2不是朋友
   * type : 1个人   2 公众号  3 未知
   */
  async RoomMembers(query) {
    this.checkLogin()
    if (query.topic) {
      let room = await this.rooms({ topic: query.topic })
      if (room.length > 0) {
        let members
        if (query.name) {
          members = await room[0].memberAll({ name: new RegExp(query.name) })
        } else if (query.roomAlias) {
          members = await room[0].memberAll({ roomAlias: query.roomAlias })
        } else if (query.contactAlias) {
          members = await room[0].memberAll({ contactAlias: query.contactAlias })
        } else {
          members = await room[0].memberAll()
        }
        return this.filterContacts(members || [], { friend: query.friend, type: query.type })
      }
    }
    return []
  }
  /**
   * 批量添加好友 (只有wxid非wxid_开头的才可以正常添加。)
   * @param {*} query 
   */
  async RoomMembersAdd(query) {
    this.checkLogin()
    let members = await this.RoomMembers(query)
    this.app.wechatAddContactQueue.push({ key: this.ctx.state.userid, bot: this.data, data: members })
    this.app.runSchedule('wehcat_add_contact')
  }
  /**
 * 设置机器人聊天
 * @param {*} query 
 * status 是否开启 0关闭 1开启
 * startText 开启的返回消息
 * startKey 开启的标识
 * endText 关闭的返回消息
 * endKey 关闭的标识
 * msgKey 判断是否AI回复此消息的标识
 */
  async MessageAi(query) {
    this.checkLogin();

    if (this.data.ai.config.status === 1) {
      return false;
    }
    this.data.ai.config = Object.assign({}, this.data.ai.config, this.config.wechat.tencentAi, query);
    this.bot.on('message', async function (msg) {
      let config = this.data.ai.config;

      if (!config.status) {
        return false;
      }

      let text = msg.text();
      let hasAi = async function (arr, flag) {
        //打招呼返回
        if(text.indexOf(config.startText) >= 0){
           return false;
        }
        //判断开启AI的标识
        if (text.indexOf(config.startKey) >= 0) {
          arr.push(flag);
          await msg.say(config.startText)
          return false;
        }
        //判断关闭AI的标识
        if (text.indexOf(config.endKey) >= 0 && arr.indexOf(flag) >= 0) {
          arr.splice(arr.indexOf(flag), 1);
          await msg.say(config.endText)
          return false;
        }
        //判断此消息是否开启了AI聊天
        return arr.indexOf(flag) >= 0
      }
      //只接受消息类型
      if (msg.type() !== this.bot.Message.Type.Text) {
        return false;
      }
      //群聊
      if (msg.room() &&  !await hasAi(this.data.ai.roomArr, await msg.room().topic())) {
        return false;
        //个人
      } else if (!msg.room() &&  !await hasAi(this.data.ai.personArr, msg.from().name())) {
        return false;
      }

      if (config.msgKey && text.indexOf(config.msgKey) < 0) {
        return false;
      } else if (!config.msgKey && msg.self()) {
        return false;
      }
      

      try {
        const ai = new TencentAI(config.appKey, config.appId);
        const data = await ai.nlp.textChat(config.msgKey ? text.split(config.msgKey)[1].trim() : text.trim(),'session_id')
        await msg.say(data.data.answer)
  

      } catch (e) {
        console.error(e && e.message || e)
      }
    }.bind(this))

  }
  /**
   * 导出
   * @param {*} query 
   */
  async export(query) {
    this.checkLogin()
    let data = await this.friends(query)
    return data
  }

  //过滤联系人
  /**
 * @param {*} param1 
 * name：名字
 * alias：别名
 * friend : 1是朋友 2不是朋友
 * type : 1个人   2 公众号  3 未知
 * gender : 1 男  2  女
 * province : 省份
 * city ：城市
 * address：地址
 */
  filterContacts(contacts, query) {
    let { name, alias, friend, type, gender, province, city, address } = query
    return contacts.filter(item => {
      let arr = []
      let { payload } = item
      if (friend) {
        let bool = Number(friend) === 1 ? true : false
        arr.push(bool === payload.friend)
      }
      name && arr.push(payload.name.indexOf(name) >= 0)
      alias && arr.push(payload.alias.indexOf(alias) >= 0)
      type && arr.push(Number(type) === payload.type)
      gender && arr.push(Number(gender) === payload.gender)
      province && arr.push(payload.province.indexOf(province) >= 0)
      city && arr.push(payload.city.indexOf(city) >= 0)
      address && arr.push(payload.address.indexOf(address) >= 0)
      return arr.indexOf(false) < 0
    })
  }
  formatContacts(data) {
    let arr = data.map(function (item) {
      // const file = await item.avatar()
      // let avatar = await file.toBase64(file.name, true);
      let payload = item.payload;
      return {
        'id': payload.id,
        'name': payload.name,
        'gender': payload.gender === 0 ? '无' : (payload.gender === 1 ? '男' : '女'),
        'alias': payload.alias,
        'friend': payload.friend ? '是' : '否',
        'star': payload.star ? '是' : '否',
        'type': payload.type === 1 ? '个人' : (payload.type === 2 ? '公众号' : '未知'),
        'signature': payload.signature,
        'province': payload.province,
        'city': payload.city,
        'address': payload.address,
      }
    })
    return arr;
  }
}

module.exports = WechatService
