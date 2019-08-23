'use strict'
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken') //引入jsonwebtoken

const moment = require('moment')

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

exports.filterObject = (raw, allowed) => {
  return Object.keys(raw)
    .filter(key => allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = raw[key]
      return obj
    }, {})
}

exports.findObjInArr = (arr, key, value) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] == value) {
      return { item: arr[i], index: i };
    }
  }
  return {};
}
