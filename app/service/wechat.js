'use strict'

const Service = require('egg').Service
const {
  Wechaty,
  Message,
} = require('wechaty')
const WECHAT_API = 'https://api.qrserver.com/v1/create-qr-code/?data='

class WechatService extends Service {
  constructor(app) {
    super(app)
    let data = this.app.wechatQueue[this.ctx.state.userid] || {}
    this.bot = data.source
    this.status = data.status
  }
  /**
   * 用户登入
   */
  async login() {
    return new Promise((reslove, reject) => {
      const bot = new Wechaty()

      bot.on('scan', (qrcode, status) => reslove(WECHAT_API + qrcode))
      bot.on('login', (user) => {
        this.app.wechatQueue[this.ctx.state.userid] = {
          source: bot,
          status: 1,
        }

      })
      bot.on('logout', (user) => {
        this.app.wechatQueue[this.ctx.state.userid] = null
        delete this.app.wechatQueue[this.ctx.state.userid]
      })
      bot.on('error', (e) => console.error(e))
      bot.start().catch(console.error)
    })

  }
  /**
   * 获取全部的朋友
   * @param {*} query  查询条件
   */
  async friends(query) {
    this.checkLogin()
    const contactList = await this.bot.Contact.findAll()
    return this.filterContacts(contactList || [], query)

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
          members = await room[0].memberAll({ roomAlias: query.roomAlias  })
        } else if (query.contactAlias) {
          members = await room[0].memberAll({ contactAlias:query.contactAlias  })
        } else {
          members = await room[0].memberAll()
        }
        return this.filterContacts(members || [], { friend: query.friend, type: query.type })
      }
    }
    return []
  }
  //批量添加好友
  async RoomMembersAdd(query) {
    this.checkLogin()
    let members = await this.RoomMembers(query)
    this.app.wechatAddContactQueue[this.ctx.state.userid] = members
    this.app.runSchedule('wehcat_add_contact')
  

  }

  //检查是否登录
  checkLogin() {
    if (!this.bot && this.status !== 1) {
      this.ctx.throwBizError('WECHAT_NOT_LOGIN')
    }
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
    console.log(query)
    return contacts.filter(item => {
      let arr = []
      let { payload } = item
      if (friend != undefined) {
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
      console.log(arr)
      return arr.indexOf(false) < 0
    })
  }
}

module.exports = WechatService
