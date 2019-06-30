'use strict'
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken') //引入jsonwebtoken

const moment = require('moment')
const {
  Wechaty,
  Message,
} = require('wechaty')
// 格式化时间
exports.formatTime = time => moment(time).format('YYYY-MM-DD HH:mm:ss')

// 处理成功响应
exports.success = ({ ctx, res = null, msg = '请求成功' }) => {
  ctx.body = {
    code: 0,
    data: res,
    msg
  }
  ctx.status = 200
}
exports.loginToken = (data, expires = 7200) => {
  const exp = Math.floor(Date.now() / 1000) + expires
  const cert = fs.readFileSync(path.join(__dirname, '../public/key/rsa_private_key.pem')) // 私钥，看后面生成方法
  const token = jwt.sign({ data, exp }, cert, { algorithm: 'RS256' })
  return token
}
exports.wechat = {
  getWechat(obj){
    return new Promise((reslove,reject)=>{
      const bot = new Wechaty()
      console.log(obj.ctx.state);
      obj.app.wechatList[obj.ctx.state.userid] = bot;
      bot.on('scan', onScan)
      bot.on('login', onLogin)
      bot.on('logout', onLogout)
      bot.on('message', onMessage)
      bot.on('error', onError)
  
      bot.start().catch(console.error)
  
      function onScan(qrcode, status) {
          console.log(qrcode);
          reslove('https://api.qrserver.com/v1/create-qr-code/?data='+qrcode);
      }
      function onLogin(user) {
          console.log(`${user} login`)
 
      }
      function onLogout(user) {
          console.log(`${user} logout`)
      }
      function onError(e) {
          console.error(e)
      }
      async function onMessage(msg) {
      }
  
    });    
     
  },
 async findAll(bot){
    const contactList = await bot.Contact.findAll() 
    return contactList;
  }
}
